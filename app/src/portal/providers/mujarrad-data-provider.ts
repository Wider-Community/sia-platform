import type { DataProvider, CrudFilter, CrudSort, Pagination } from "@refinedev/core";

const API_URL = import.meta.env.VITE_MUJARRAD_API_URL ?? "https://mujarrad.onrender.com/api";
const SPACE = "sia-portal";

function getHeaders(): HeadersInit {
  const token = localStorage.getItem("sia_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...getHeaders(), ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

function buildQueryString(params: {
  filters?: CrudFilter[];
  sorters?: CrudSort[];
  pagination?: Pagination;
}): string {
  const qs = new URLSearchParams();
  params.filters?.forEach((f) => {
    if ("field" in f) {
      if (f.operator === "eq") qs.append(`filter[${f.field}]`, String(f.value));
      else qs.append(`filter[${f.field}][${f.operator}]`, String(f.value));
    }
  });
  if (params.sorters?.length) {
    const sortStr = params.sorters
      .map((s) => (s.order === "desc" ? `-${s.field}` : s.field))
      .join(",");
    qs.append("sort", sortStr);
  }
  if (params.pagination?.currentPage) qs.append("page", String(params.pagination.currentPage));
  if (params.pagination?.pageSize) qs.append("limit", String(params.pagination.pageSize));
  return qs.toString();
}

function normalizeNode(node: Record<string, unknown>): Record<string, unknown> {
  const details = (node.nodeDetails ?? node.node_details ?? {}) as Record<string, unknown>;
  return {
    id: node.id ?? node._id,
    ...details,
    createdAt: node.createdAt ?? node.created_at,
    updatedAt: node.updatedAt ?? node.updated_at,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const mujarradDataProvider: DataProvider = {
  getApiUrl: () => API_URL,

  async getList({ resource, pagination, filters, sorters }) {
    const qs = buildQueryString({ filters, sorters, pagination });
    const path = `/spaces/${SPACE}/nodes?context=${resource}${qs ? `&${qs}` : ""}`;
    const result = await request<{ data: Record<string, unknown>[]; total?: number }>(path);
    const data = (result.data ?? []).map(normalizeNode);
    return { data: data as any, total: result.total ?? data.length };
  },

  async getOne({ id }) {
    const node = await request<Record<string, unknown>>(`/spaces/${SPACE}/nodes/${id}`);
    return { data: normalizeNode(node) as any };
  },

  async create({ resource, variables }) {
    const node = await request<Record<string, unknown>>(`/spaces/${SPACE}/nodes`, {
      method: "POST",
      body: JSON.stringify({ context: resource, type: "REGULAR", nodeDetails: variables }),
    });
    return { data: normalizeNode(node) as any };
  },

  async update({ id, variables }) {
    const node = await request<Record<string, unknown>>(`/spaces/${SPACE}/nodes/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ nodeDetails: variables }),
    });
    return { data: normalizeNode(node) as any };
  },

  async deleteOne({ id }) {
    await request(`/spaces/${SPACE}/nodes/${id}`, { method: "DELETE" });
    return { data: { id } as any };
  },

  getMany: undefined,

  async custom({ url, method, payload, query, headers: customHeaders }) {
    const qs = query ? `?${new URLSearchParams(query as Record<string, string>).toString()}` : "";
    const res = await request<Record<string, unknown>>(`${url}${qs}`, {
      method: method.toUpperCase(),
      body: payload ? JSON.stringify(payload) : undefined,
      headers: customHeaders as HeadersInit,
    });
    return { data: res as any };
  },
};
/* eslint-enable @typescript-eslint/no-explicit-any */
