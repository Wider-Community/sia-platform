/**
 * Migration script: Add structured `locations` array to organization nodes
 * and audit nodeType mismatches in Mujarrad.
 *
 * Usage:
 *   VITE_MUJARRAD_PUBLIC_KEY=xxx VITE_MUJARRAD_PRIVATE_KEY=yyy npx tsx scripts/migrate-to-structured.ts
 *   # Add --execute to apply changes (default is dry-run)
 */

const API_BASE = "https://mujarrad.onrender.com/api";
const SPACE = "sia-portal-platform";

const PUBLIC_KEY = process.env.VITE_MUJARRAD_PUBLIC_KEY;
const PRIVATE_KEY = process.env.VITE_MUJARRAD_PRIVATE_KEY;

if (!PUBLIC_KEY || !PRIVATE_KEY) {
  console.error("Missing VITE_MUJARRAD_PUBLIC_KEY or VITE_MUJARRAD_PRIVATE_KEY env vars.");
  process.exit(1);
}

const EXECUTE = process.argv.includes("--execute");

const HEADERS = {
  "X-API-Key": PUBLIC_KEY,
  "X-API-Secret": PRIVATE_KEY,
  "Content-Type": "application/json",
};

// --- Country lookup ---

const COUNTRY_MAP: Record<string, { isoCode: string; name: string; lat: number; lng: number; capital: string }> = {
  "UAE": { isoCode: "AE", name: "United Arab Emirates", lat: 24.4539, lng: 54.3773, capital: "Abu Dhabi" },
  "United Arab Emirates": { isoCode: "AE", name: "United Arab Emirates", lat: 24.4539, lng: 54.3773, capital: "Abu Dhabi" },
  "Saudi Arabia": { isoCode: "SA", name: "Saudi Arabia", lat: 24.7136, lng: 46.6753, capital: "Riyadh" },
  "KSA": { isoCode: "SA", name: "Saudi Arabia", lat: 24.7136, lng: 46.6753, capital: "Riyadh" },
  "Malaysia": { isoCode: "MY", name: "Malaysia", lat: 3.1390, lng: 101.6869, capital: "Kuala Lumpur" },
};

// Expected nodeType per resource type
const EXPECTED_NODE_TYPE: Record<string, string> = {
  organizations: "CONTEXT",
  contacts: "CONTEXT",
  users: "CONTEXT",
};

// --- Types ---

interface MujarradNode {
  id: string;
  nodeType: string;
  nodeDetails: Record<string, unknown>;
  [key: string]: unknown;
}

// --- Main ---

async function fetchAllNodes(): Promise<MujarradNode[]> {
  const url = `${API_BASE}/spaces/${SPACE}/nodes`;
  console.log(`Fetching nodes from ${url} ...`);
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`Failed to fetch nodes: ${res.status} ${res.statusText} — ${await res.text()}`);
  }
  const data = await res.json();
  // API may return { nodes: [...] } or [...] directly
  return Array.isArray(data) ? data : (data.nodes ?? data.data ?? []);
}

async function updateNode(id: string, nodeDetails: Record<string, unknown>): Promise<void> {
  const url = `${API_BASE}/spaces/${SPACE}/nodes/${id}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: HEADERS,
    body: JSON.stringify({ nodeDetails }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to update node ${id}: ${res.status} ${res.statusText} — ${body}`);
  }
}

async function main() {
  console.log(EXECUTE ? "=== EXECUTE MODE ===" : "=== DRY RUN (pass --execute to apply) ===");
  console.log();

  const nodes = await fetchAllNodes();
  console.log(`Found ${nodes.length} total nodes.\n`);

  let migrated = 0;
  let skipped = 0;
  let unmapped = 0;
  let typeMismatches = 0;

  for (const node of nodes) {
    const details = node.nodeDetails ?? {};
    const resourceType = details._resourceType as string | undefined;

    // --- Audit nodeType ---
    if (resourceType && EXPECTED_NODE_TYPE[resourceType]) {
      const expected = EXPECTED_NODE_TYPE[resourceType];
      if (node.nodeType !== expected) {
        typeMismatches++;
        console.log(`[TYPE MISMATCH] Node ${node.id} (${resourceType}): nodeType="${node.nodeType}", expected="${expected}" — CANNOT FIX (immutable)`);
      }
    }

    // --- Migrate locations ---
    if (resourceType !== "organizations") continue;

    const name = (details.name as string) || node.id;

    // Already has locations — skip
    if (Array.isArray(details.locations) && details.locations.length > 0) {
      skipped++;
      continue;
    }

    const country = (details.country as string)?.trim();
    if (!country) {
      skipped++;
      console.log(`[SKIP] Org "${name}" — no country field`);
      continue;
    }

    const mapped = COUNTRY_MAP[country];
    if (!mapped) {
      unmapped++;
      console.log(`[UNMAPPED] Org "${name}" — country="${country}" not in lookup`);
      continue;
    }

    const locations = [
      {
        label: `HQ — ${mapped.capital}`,
        address: mapped.capital,
        country: mapped.name,
        countryCode: mapped.isoCode,
        coordinates: { lat: mapped.lat, lng: mapped.lng },
        isPrimary: true,
      },
    ];

    const updatedDetails = { ...details, locations };

    if (EXECUTE) {
      console.log(`[MIGRATE] Org "${name}" — country="${country}" → locations array ... updating`);
      await updateNode(node.id, updatedDetails);
      console.log(`  ✓ Updated`);
    } else {
      console.log(`[MIGRATE] Org "${name}" — country="${country}" → would add locations array`);
    }
    migrated++;
  }

  console.log();
  console.log("=== Summary ===");
  console.log(`  Migrated (or would migrate): ${migrated}`);
  console.log(`  Skipped (already has locations or no country): ${skipped}`);
  console.log(`  Unmapped countries: ${unmapped}`);
  console.log(`  nodeType mismatches (immutable, logged only): ${typeMismatches}`);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
