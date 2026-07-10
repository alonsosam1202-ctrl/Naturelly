import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "secondary" | "whatsapp";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-bold transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTS: Record<Variant, string> = {
  // Spec Tinta & Oro: botón primario = fondo Oro, texto Tinta, hover Oro claro
  primary:
    "bg-oro text-tinta shadow-calida hover:-translate-y-0.5 hover:bg-oro-hover hover:shadow-calida-lg",
  secondary:
    "border-2 border-tinta text-tinta hover:-translate-y-0.5 hover:bg-tinta hover:text-oro",
  whatsapp:
    "bg-whatsapp text-blanco-crema shadow-calida hover:-translate-y-0.5 hover:brightness-95 hover:shadow-calida-lg",
};

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props} />
  );
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: Variant;
};

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={`${BASE} ${VARIANTS[variant]} ${className}`} {...props} />
  );
}
