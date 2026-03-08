// Cliente HTTP base — reemplaza config/api.ts
// Configura la URL base del backend desde la variable de entorno VITE_API_URL

export const BASE = import.meta.env.VITE_API_URL || '';

export async function fetchJson(path: string, opts?: RequestInit) {
  if (!BASE) throw new Error('No backend configured');
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) {
    let body: any = null;
    try {
      body = await res.json();
    } catch (_) {
      /* ignore */
    }
    throw body || new Error(`API error ${res.status}`);
  }
  return res.json();
}
