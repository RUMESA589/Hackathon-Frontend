const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  return fetch(`${API_BASE}${path}`, { ...options, headers, credentials: "include" });
}
