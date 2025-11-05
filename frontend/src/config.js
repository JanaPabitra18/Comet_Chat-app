// Build a robust base URL from env with normalization
const rawApi =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:8080' : window.location.origin);

// Ensure scheme for localhost-like values
function ensureScheme(u) {
  if (/^https?:\/\//i.test(u)) return u;
  if (/^localhost(?::\d+)?/i.test(u) || /^127\.0\.0\.1(?::\d+)?/i.test(u)) {
    return 'http://' + u;
  }
  return u; // assume valid absolute URL otherwise
}

function normalizeBase(u) {
  let v = ensureScheme(u).replace(/\/$/, '');
  // If provided env already includes '/api', strip it to avoid double '/api'
  if (v.toLowerCase().endsWith('/api')) v = v.slice(0, -4);
  return v;
}

export const BASE_URL = normalizeBase(rawApi);

const rawSocket = import.meta.env.VITE_SOCKET_URL || BASE_URL;
export const SOCKET_URL = normalizeBase(rawSocket);
