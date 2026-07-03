/**
 * Formatea un precio en soles: `formatPrice(18)` → "S/ 18.00".
 * Opera en céntimos para evitar errores de flotantes.
 */
export function formatPrice(price: number): string {
  const cents = Math.round(price * 100);
  const soles = Math.trunc(cents / 100);
  const rest = Math.abs(cents % 100).toString().padStart(2, "0");
  return `S/ ${soles}.${rest}`;
}

/** Suma segura de líneas (precio unitario × cantidad) trabajando en céntimos. */
export function sumLineTotals(
  lines: { unitPrice: number; quantity: number }[]
): number {
  const cents = lines.reduce(
    (acc, line) => acc + Math.round(line.unitPrice * 100) * line.quantity,
    0
  );
  return cents / 100;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Fechas siempre mostradas en zona horaria de Lima. */
export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Lima",
  }).format(new Date(isoDate));
}
