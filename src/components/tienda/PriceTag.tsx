import { formatPrice } from "@/lib/utils";

type PriceTagProps = {
  price: number;
  compareAtPrice?: number | null;
  prefix?: string;
  className?: string;
};

export default function PriceTag({
  price,
  compareAtPrice,
  prefix,
  className = "",
}: PriceTagProps) {
  return (
    <p className={`flex items-baseline gap-2 ${className}`}>
      {prefix && <span className="text-sm text-cacao">{prefix}</span>}
      <span className="font-display text-xl font-semibold text-miel">
        {formatPrice(price)}
      </span>
      {compareAtPrice != null && compareAtPrice > price && (
        <s className="text-sm text-cacao">{formatPrice(compareAtPrice)}</s>
      )}
    </p>
  );
}
