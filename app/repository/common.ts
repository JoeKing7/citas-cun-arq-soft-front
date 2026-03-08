export const KEY_MEDICOS = 'app_medicos_v1';
export const KEY_PACIENTES = 'app_pacientes_v1';
export const KEY_CITAS = 'app_citas_v1';

export function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function write<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items));
}
