const TYPESENSE_HOST = import.meta.env.VITE_TYPESENSE_HOST ?? "localhost";
const TYPESENSE_PORT = import.meta.env.VITE_TYPESENSE_PORT ?? "8108";
const TYPESENSE_PROTOCOL = import.meta.env.VITE_TYPESENSE_PROTOCOL ?? "http";
const TYPESENSE_API_KEY = import.meta.env.VITE_TYPESENSE_SEARCH_KEY ?? "sia_typesense_dev_key";
const BASE_URL = `${TYPESENSE_PROTOCOL}://${TYPESENSE_HOST}:${TYPESENSE_PORT}`;

export interface SearchResult {
  id: string;
  type: "organization" | "contact" | "file";
  title: string;
  subtitle?: string;
  snippet?: string;
  href: string;
}

interface TypesenseHit {
  document: Record<string, unknown>;
  highlights?: Array<{
    field: string;
    snippet?: string;
  }>;
}

interface TypesenseSearchResult {
  found: number;
  hits: TypesenseHit[];
}

interface MultiSearchResponse {
  results: TypesenseSearchResult[];
}

export async function searchAll(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const body = {
    searches: [
      {
        collection: "organizations",
        q: query,
        query_by: "name,description,tags",
        per_page: 5,
      },
      {
        collection: "contacts",
        q: query,
        query_by: "full_name,email,role",
        per_page: 5,
      },
      {
        collection: "files",
        q: query,
        query_by: "content,file_name",
        query_by_weights: "1,2",
        per_page: 5,
      },
    ],
  };

  const res = await fetch(`${BASE_URL}/multi_search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-TYPESENSE-API-KEY": TYPESENSE_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) return [];

  const data: MultiSearchResponse = await res.json();
  const results: SearchResult[] = [];

  // Organizations
  for (const hit of data.results[0]?.hits ?? []) {
    const doc = hit.document;
    results.push({
      id: doc.id as string,
      type: "organization",
      title: doc.name as string,
      subtitle: `${doc.type} · ${doc.country ?? ""}`.trim(),
      href: `/portal/organizations/${doc.id}`,
    });
  }

  // Contacts
  for (const hit of data.results[1]?.hits ?? []) {
    const doc = hit.document;
    const orgIds = doc.organization_ids as string[];
    results.push({
      id: doc.id as string,
      type: "contact",
      title: doc.full_name as string,
      subtitle: (doc.role as string) ?? (doc.email as string),
      href: orgIds?.[0] ? `/portal/organizations/${orgIds[0]}` : "/portal/organizations",
    });
  }

  // Files
  for (const hit of data.results[2]?.hits ?? []) {
    const doc = hit.document;
    const snippet = hit.highlights?.find((h) => h.field === "content")?.snippet;
    results.push({
      id: doc.id as string,
      type: "file",
      title: doc.file_name as string,
      subtitle: doc.file_type as string,
      snippet,
      href: `/portal/organizations/${doc.organization_id}`,
    });
  }

  return results;
}
