/**
 * Sanitización centralizada del parámetro `next` y destino post-login por
 * rol. Se usa en login, registro, /auth/callback y middleware para que la
 * regla sea una sola: solo rutas internas (empiezan con "/", nunca con
 * "//", jamás un dominio externo). Si no es válida, se ignora.
 */

export function sanitizeNextPath(
  next: string | null | undefined
): string | null {
  if (!next) return null;
  if (!next.startsWith("/") || next.startsWith("//")) return null;
  return next;
}

/** Destino por defecto tras iniciar sesión: admin → panel, resto → cuenta. */
export function homePathForRole(role: string | null | undefined): string {
  return role === "admin" ? "/admin" : "/cuenta";
}
