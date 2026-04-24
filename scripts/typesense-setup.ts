/**
 * Creates Typesense collections for the SIA Portal.
 * Run: npx tsx scripts/typesense-setup.ts
 */

const TYPESENSE_HOST = process.env.TYPESENSE_HOST ?? "localhost";
const TYPESENSE_PORT = process.env.TYPESENSE_PORT ?? "8108";
const TYPESENSE_API_KEY = process.env.TYPESENSE_API_KEY ?? "sia_typesense_dev_key";
const BASE_URL = `http://${TYPESENSE_HOST}:${TYPESENSE_PORT}`;

const collections = [
  {
    name: "organizations",
    fields: [
      { name: "id", type: "string" },
      { name: "name", type: "string" },
      { name: "type", type: "string", facet: true },
      { name: "status", type: "string", facet: true },
      { name: "country", type: "string", facet: true, optional: true },
      { name: "description", type: "string", optional: true },
      { name: "tags", type: "string[]", facet: true, optional: true },
      { name: "created_at", type: "int64", sort: true },
    ],
    default_sorting_field: "created_at",
  },
  {
    name: "contacts",
    fields: [
      { name: "id", type: "string" },
      { name: "first_name", type: "string" },
      { name: "last_name", type: "string" },
      { name: "full_name", type: "string" },
      { name: "email", type: "string", optional: true },
      { name: "phone", type: "string", optional: true },
      { name: "role", type: "string", optional: true },
      { name: "organization_ids", type: "string[]" },
      { name: "created_at", type: "int64", sort: true },
    ],
    default_sorting_field: "created_at",
  },
  {
    name: "files",
    fields: [
      { name: "id", type: "string" },
      { name: "file_name", type: "string" },
      { name: "organization_id", type: "string", facet: true },
      { name: "file_type", type: "string", facet: true },
      { name: "content", type: "string" },
      { name: "uploaded_at", type: "int64", sort: true },
    ],
    default_sorting_field: "uploaded_at",
  },
];

async function createCollection(schema: (typeof collections)[number]) {
  const res = await fetch(`${BASE_URL}/collections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-TYPESENSE-API-KEY": TYPESENSE_API_KEY,
    },
    body: JSON.stringify(schema),
  });

  if (res.ok) {
    console.log(`Created collection: ${schema.name}`);
  } else if (res.status === 409) {
    console.log(`Collection already exists: ${schema.name}`);
  } else {
    const body = await res.text();
    console.error(`Failed to create ${schema.name}: ${res.status} ${body}`);
  }
}

async function main() {
  console.log(`Connecting to Typesense at ${BASE_URL}...`);

  try {
    const health = await fetch(`${BASE_URL}/health`);
    if (!health.ok) throw new Error(`Health check failed: ${health.status}`);
    console.log("Typesense is healthy");
  } catch (err) {
    console.error("Cannot connect to Typesense. Is it running?", err);
    process.exit(1);
  }

  for (const schema of collections) {
    await createCollection(schema);
  }

  console.log("Done.");
}

main();
