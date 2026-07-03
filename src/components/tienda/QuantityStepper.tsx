"use client";

import { Minus, Plus } from "lucide-react";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  max?: number | null;
  label?: string;
};

export default function QuantityStepper({
  value,
  onChange,
  max,
  label = "Cantidad",
}: QuantityStepperProps) {
  const limit = Math.min(max ?? 50, 50);

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border-2 border-amarillo-suave bg-blanco-crema p-1"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className="rounded-full p-2 text-tinta transition-colors hover:bg-crema disabled:opacity-40"
        aria-label="Quitar uno"
        disabled={value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <span className="min-w-8 text-center font-bold text-tinta" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="rounded-full p-2 text-tinta transition-colors hover:bg-crema disabled:opacity-40"
        aria-label="Agregar uno"
        disabled={value >= limit}
        onClick={() => onChange(Math.min(limit, value + 1))}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
