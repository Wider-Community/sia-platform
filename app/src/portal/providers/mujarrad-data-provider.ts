import type { DataProvider, CrudFilter, CrudSort, Pagination } from "@refinedev/core";

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const API_URL = import.meta.env.DEV ? "/mujarrad-api" : (import.meta.env.VITE_MUJARRAD_API_URL ?? "https://mujarrad.onrender.com/api");
const SPACE = "sia-portal-platform";
const ADMIN_EMAIL = import.meta.env.VITE_MUJARRAD_ADMIN_EMAIL ?? "";
const ADMIN_PASSWORD = import.meta.env.VITE_MUJARRAD_ADMIN_PASSWORD ?? "";

let cachedToken: string | null = null;
let tokenPromise: Promise<string> | null = null;

async function ensureToken(): Promise<string> {
  if (cachedToken) return cachedToken;
  if (tokenPromise) return tokenPromise;
  const stored = localStorage.getItem("sia_mujarrad_token");
  if (stored) {
    try {
      const payload = JSON.parse(atob(stored.split(".")[1]));
      if (payload.exp && payload.exp * 1000 > Date.now() + 60000) {
        cachedToken = stored;
        return stored;
      }
    } catch { /* expired or invalid */ }
  }
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Mujarad credentials not configured");
  }
  tokenPromise = fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Mujarad login failed");
      return res.json();
    })
    .then((data) => {
      cachedToken = data.token;
      localStorage.setItem("sia_mujarrad_token", data.token);
      tokenPromise = null;
      return data.token;
    })
    .catch((err) => {
      tokenPromise = null;
      throw err;
    });
  return tokenPromise;
}

function getHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await ensureToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...getHeaders(token), ...options?.headers },
  });
  if (!res.ok) {
    if (res.status === 401) {
      cachedToken = null;
      localStorage.removeItem("sia_mujarrad_token");
    }
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

interface MujarradNode {
  id: string;
  spaceId: string;
  nodeType: string;
  title: string;
  slug: string;
  content: string | null;
  nodeDetails: Record<string, unknown>;
  createdBy: string;
  modifiedBy: string;
  createdAt: string;
  updatedAt: string;
}

function normalizeNode(node: MujarradNode): Record<string, unknown> {
  const details = node.nodeDetails ?? {};
  return {
    id: node.id,
    ...details,
    _title: node.title,
    _slug: node.slug,
    _nodeType: node.nodeType,
    _content: node.content,
    createdAt: node.createdAt,
    updatedAt: node.updatedAt,
  };
}

function clientFilter(
  data: Record<string, unknown>[],
  filters?: CrudFilter[],
): Record<string, unknown>[] {
  if (!filters?.length) return data;
  return data.filter((item) =>
    filters.every((f) => {
      if (!("field" in f)) return true;
      const val = item[f.field];
      switch (f.operator) {
        case "eq":
          return val === f.value;
        case "ne":
          return val !== f.value;
        case "contains":
          return typeof val === "string" && val.toLowerCase().includes(String(f.value).toLowerCase());
        default:
          return true;
      }
    }),
  );
}

function clientSort(
  data: Record<string, unknown>[],
  sorters?: CrudSort[],
): Record<string, unknown>[] {
  if (!sorters?.length) return data;
  return [...data].sort((a, b) => {
    for (const s of sorters) {
      const aVal = String(a[s.field] ?? "");
      const bVal = String(b[s.field] ?? "");
      const cmp = aVal.localeCompare(bVal);
      if (cmp !== 0) return s.order === "desc" ? -cmp : cmp;
    }
    return 0;
  });
}

function clientPaginate(
  data: Record<string, unknown>[],
  pagination?: Pagination,
): Record<string, unknown>[] {
  if (!pagination || pagination.mode === "off") return data;
  const page = pagination.current ?? 1;
  const size = pagination.pageSize ?? 10;
  return data.slice((page - 1) * size, page * size);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const mujarradDataProvider: DataProvider = {
  getApiUrl: () => API_URL,

  async getList({ resource, pagination, filters, sorters }) {
    const nodes = await request<MujarradNode[]>(`/spaces/${SPACE}/nodes?search=`);
    const allNormalized = nodes.map(normalizeNode);
    // Filter by resource type stored in nodeDetails._resourceType
    let data = allNormalized.filter((n) => n._resourceType === resource);
    data = clientFilter(data, filters);
    data = clientSort(data, sorters);
    const total = data.length;
    data = clientPaginate(data, pagination);
    return { data: data as any, total };
  },

  async getOne({ id }) {
    const node = await request<MujarradNode>(`/spaces/${SPACE}/nodes/${id}`);
    return { data: normalizeNode(node) as any };
  },

  async create({ resource, variables }) {
    const vars = variables as Record<string, unknown>;
    const title = (vars.name as string) || (vars.title as string) || resource;
    const node = await request<MujarradNode>(`/spaces/${SPACE}/nodes`, {
      method: "POST",
      body: JSON.stringify({
        title,
        slug: slugify(title + "-" + Date.now()),
        nodeType: "REGULAR",
        content: (vars.description as string) ?? "",
        nodeDetails: { ...vars, _resourceType: resource },
      }),
    });
    return { data: normalizeNode(node) as any };
  },

  async update({ id, variables }) {
    const vars = variables as Record<string, unknown>;
    // First get existing node to preserve fields
    const existing = await request<MujarradNode>(`/spaces/${SPACE}/nodes/${id}`);
    const title = (vars.name as string) || (vars.title as string) || existing.title;
    const node = await request<MujarradNode>(`/spaces/${SPACE}/nodes/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title,
        slug: existing.slug,
        nodeType: existing.nodeType,
        content: (vars.description as string) ?? existing.content ?? "",
        nodeDetails: {
          ...existing.nodeDetails,
          ...vars,
          _resourceType: existing.nodeDetails._resourceType,
        },
      }),
    });
    return { data: normalizeNode(node) as any };
  },

  async deleteOne({ id }) {
    await request(`/spaces/${SPACE}/nodes/${id}`, { method: "DELETE" });
    return { data: { id } as any };
  },

  getMany: undefined,

  async custom({ url, method, payload, query: q, headers: customHeaders }) {
    const qs = q ? `?${new URLSearchParams(q as Record<string, string>).toString()}` : "";
    const res = await request<Record<string, unknown>>(`${url}${qs}`, {
      method: method.toUpperCase(),
      body: payload ? JSON.stringify(payload) : undefined,
      headers: customHeaders as HeadersInit,
    });
    return { data: res as any };
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */
