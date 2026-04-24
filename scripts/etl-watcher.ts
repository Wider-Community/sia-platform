/**
 * Local ETL Watcher — monitors R2 for new uploads, extracts text, indexes into Typesense.
 *
 * This script runs on the local machine (not the server).
 * It polls R2 via S3-compatible API for new files, runs the Wider Tooling
 * extraction pipeline, and pushes results to Typesense.
 *
 * Usage: TYPESENSE_API_KEY=xxx R2_ACCESS_KEY=xxx R2_SECRET_KEY=xxx npx tsx scripts/etl-watcher.ts
 *
 * NOTE: This is a scaffold. The actual Wider Tooling integration
 * (extract_file() calls) needs to be connected to the local Python pipeline.
 */

const POLL_INTERVAL_MS = 60_000; // 1 minute

const R2_ENDPOINT = process.env.R2_ENDPOINT ?? "";
const R2_BUCKET = process.env.R2_BUCKET ?? "sia-files";
const R2_ACCESS_KEY = process.env.R2_ACCESS_KEY ?? "";
const R2_SECRET_KEY = process.env.R2_SECRET_KEY ?? "";

const TYPESENSE_HOST = process.env.TYPESENSE_HOST ?? "localhost";
const TYPESENSE_PORT = process.env.TYPESENSE_PORT ?? "8108";
const TYPESENSE_API_KEY = process.env.TYPESENSE_API_KEY ?? "sia_typesense_dev_key";
const TYPESENSE_URL = `http://${TYPESENSE_HOST}:${TYPESENSE_PORT}`;

const INDEX_FILE = ".extraction_index.json";

interface IndexEntry {
  key: string;
  lastModified: string;
  indexed: boolean;
}

let index: Map<string, IndexEntry> = new Map();

function loadIndex(): void {
  try {
    const fs = require("fs");
    if (fs.existsSync(INDEX_FILE)) {
      const data = JSON.parse(fs.readFileSync(INDEX_FILE, "utf-8"));
      index = new Map(Object.entries(data));
    }
  } catch {
    index = new Map();
  }
}

function saveIndex(): void {
  const fs = require("fs");
  const obj = Object.fromEntries(index);
  fs.writeFileSync(INDEX_FILE, JSON.stringify(obj, null, 2));
}

/**
 * Transformer: maps Wider Tooling extract_file() output to Typesense document.
 */
function transformToTypesenseDoc(extraction: {
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

async function indexDocument(doc: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${TYPESENSE_URL}/collections/files/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-TYPESENSE-API-KEY": TYPESENSE_API_KEY,
    },
    body: JSON.stringify(doc),
  });
  if (res.status === 409) {
    // Already exists, upsert
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

async function pollAndProcess(): Promise<void> {
  console.log(`[${new Date().toISOString()}] Polling for new files...`);

  // TODO: Connect to R2 via @aws-sdk/client-s3 ListObjectsV2
  // TODO: For each new file:
  //   1. Download from R2
  //   2. Call Wider Tooling extract_file() (Python subprocess or HTTP API)
  //   3. If Round 1 (Docling) extracts < 100 chars, trigger Round 2 (OCR)
  //   4. Transform extraction output to Typesense doc
  //   5. Index into Typesense
  //   6. Update index

  // Placeholder for demonstration:
  console.log("  No new files (ETL watcher scaffold — connect R2 + Wider Tooling)");
}

async function main(): Promise<void> {
  console.log("SIA ETL Watcher starting...");
  console.log(`  Typesense: ${TYPESENSE_URL}`);
  console.log(`  R2 Bucket: ${R2_BUCKET}`);
  console.log(`  Poll interval: ${POLL_INTERVAL_MS / 1000}s`);

  loadIndex();

  // Initial poll
  await pollAndProcess();

  // Continuous polling
  setInterval(pollAndProcess, POLL_INTERVAL_MS);
}

main().catch(console.error);

export { transformToTypesenseDoc, indexDocument };
