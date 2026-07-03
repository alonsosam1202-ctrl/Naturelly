type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

/**
 * Encabezado de sección: eyebrow en Karla bold con tracking amplio y título
 * en Fraunces (BRAND_GUIDE.md: títulos nunca en mayúsculas sostenidas).
 */
export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  const alignment = align === "center" ? "items-center text-center" : "";
  return (
    <div className={`flex max-w-2xl flex-col gap-3 ${alignment} ${align === "center" ? "mx-auto" : ""}`}>
      {eyebrow && (
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-miel">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-semibold text-tinta sm:text-4xl">
        {title}
      </h2>
      {description && <p className="text-lg text-cacao">{description}</p>}
    </div>
  );
}
