/**
 * Local ETL Watcher — monitors R2 for new uploads, extracts text, indexes into Typesense.
 *
 * Usage: npx tsx --env-file=../.env scripts/etl-watcher.ts
 *   (or set env vars manually)
 */

import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const POLL_INTERVAL_MS = 60_000;

const R2_ENDPOINT = process.env.R2_ENDPOINT ?? "";
const R2_BUCKET = process.env.R2_BUCKET_NAME ?? "sia-data";
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY_ID ?? "";
const R2_SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY ?? "";

const TYPESENSE_HOST = process.env.TYPESENSE_HOST ?? "localhost";
const TYPESENSE_PORT = process.env.TYPESENSE_PORT ?? "8108";
const TYPESENSE_API_KEY = process.env.TYPESENSE_API_KEY ?? "sia_typesense_dev_key";
const TYPESENSE_URL = `http://${TYPESENSE_HOST}:${TYPESENSE_PORT}`;

const INDEX_FILE = join(__dirname, ".extraction_index.json");

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: { accessKeyId: R2_ACCESS_KEY, secretAccessKey: R2_SECRET_KEY },
});

interface IndexEntry {
  key: string;
  lastModified: string;
  indexed: boolean;
}

let index: Map<string, IndexEntry> = new Map();

function loadIndex(): void {
  try {
    if (existsSync(INDEX_FILE)) {
      const data = JSON.parse(readFileSync(INDEX_FILE, "utf-8"));
      index = new Map(Object.entries(data));
    }
  } catch {
    index = new Map();
  }
}

function saveIndex(): void {
  writeFileSync(INDEX_FILE, JSON.stringify(Object.fromEntries(index), null, 2));
}

export function transformToTypesenseDoc(extraction: {
  fileKey: string;
  fileName: string;
  organizationId: string;
  fileType: string;
  uploadedAt: string;
  content: string;
}): Record<string, unknown> {
  return {
    id: extraction.fileKey.replace(/[^a-zA-Z0-9-_]/g, "_"),
    file_name: extraction.fileName,
    organization_id: extraction.organizationId,
    file_type: extraction.fileType,
    content: extraction.content,
    uploaded_at: Math.floor(new Date(extraction.uploadedAt).getTime() / 1000),
  };
}

export async function indexDocument(doc: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${TYPESENSE_URL}/collections/files/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-TYPESENSE-API-KEY": TYPESENSE_API_KEY,
    },
    body: JSON.stringify(doc),
  });
  if (res.status === 409) {
    await fetch(`${TYPESENSE_URL}/collections/files/documents/${doc.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-TYPESENSE-API-KEY": TYPESENSE_API_KEY,
      },
      body: JSON.stringify(doc),
    });
  } else if (!res.ok) {
    const body = await res.text();
    console.error(`Failed to index ${doc.id}: ${res.status} ${body}`);
  }
}

function extractOrgIdFromKey(key: string): string {
  const match = key.match(/^orgs\/(org-[^/]+)\//);
  return match?.[1] ?? "unknown";
}

function extractFileName(key: string): string {
  return key.split("/").pop() ?? key;
}

function extractFileType(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  return ext;
}

async function downloadFile(key: string): Promise<Buffer> {
  const cmd = new GetObjectCommand({ Bucket: R2_BUCKET, Key: key });
  const resp = await s3.send(cmd);
  const chunks: Uint8Array[] = [];
  for await (const chunk of resp.Body as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function extractText(filePath: string, fileType: string): Promise<string> {
  // Try Wider Tooling Python pipeline if available
  try {
    const { execSync } = await import("child_process");
    const result = execSync(
      `python3 -c "from wider_tooling.extraction import extract_file; print(extract_file('${filePath}'))" 2>/dev/null`,
      { timeout: 60_000, encoding: "utf-8" },
    );
    if (result.trim().length > 100) return result.trim();
  } catch {
    // Wider Tooling not available, fall through
  }

  // Fallback: basic text extraction for common types
  if (fileType === "txt" || fileType === "md" || fileType === "csv") {
    return readFileSync(filePath, "utf-8");
  }

  return `[Content pending extraction — ${fileType} file]`;
}

async function processFile(key: string, lastModified: string): Promise<void> {
  console.log(`  Processing: ${key}`);

  const fileName = extractFileName(key);
  const orgId = extractOrgIdFromKey(key);
  const fileType = extractFileType(key);

  // Download to temp
  const buffer = await downloadFile(key);
  const tmpPath = join(tmpdir(), `sia-etl-${Date.now()}-${fileName}`);
  writeFileSync(tmpPath, buffer);

  // Extract text
  const content = await extractText(tmpPath, fileType);

  // Transform and index
  const doc = transformToTypesenseDoc({
    fileKey: key,
    fileName,
    organizationId: orgId,
    fileType,
    uploadedAt: lastModified,
    content,
  });

  await indexDocument(doc);
  console.log(`  Indexed: ${key} (${content.length} chars)`);

  index.set(key, { key, lastModified, indexed: true });
  saveIndex();
}

async function pollAndProcess(): Promise<void> {
  console.log(`[${new Date().toISOString()}] Polling R2 for new files...`);

  let continuationToken: string | undefined;
  let newFiles = 0;

  do {
    const cmd = new ListObjectsV2Command({
      Bucket: R2_BUCKET,
      ContinuationToken: continuationToken,
    });
    const resp = await s3.send(cmd);

    for (const obj of resp.Contents ?? []) {
      const key = obj.Key;
      if (!key) continue;

      const existing = index.get(key);
      const lastMod = obj.LastModified?.toISOString() ?? "";

      if (existing?.indexed && existing.lastModified === lastMod) continue;

      try {
        await processFile(key, lastMod);
        newFiles++;
      } catch (err) {
        console.error(`  Error processing ${key}:`, err);
      }
    }

    continuationToken = resp.NextContinuationToken;
  } while (continuationToken);

  console.log(`  ${newFiles} new file(s) processed`);
}

async function main(): Promise<void> {
  console.log("SIA ETL Watcher starting...");
  console.log(`  Typesense: ${TYPESENSE_URL}`);
  console.log(`  R2 Bucket: ${R2_BUCKET}`);
  console.log(`  R2 Endpoint: ${R2_ENDPOINT}`);
  console.log(`  Poll interval: ${POLL_INTERVAL_MS / 1000}s`);

  if (!R2_ENDPOINT || !R2_ACCESS_KEY) {
    console.error("Missing R2 credentials. Set R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.");
    process.exit(1);
  }

  loadIndex();
  await pollAndProcess();

  setInterval(pollAndProcess, POLL_INTERVAL_MS);
}

main().catch(console.error);
