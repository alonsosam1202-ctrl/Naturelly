import { forwardRef, useId, type ComponentPropsWithoutRef } from "react";

type InputProps = ComponentPropsWithoutRef<"input"> & {
  label: string;
  error?: string;
  hint?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, className = "", ...props },
  ref
) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-bold text-tinta">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        aria-invalid={Boolean(error)}
        className={`rounded-2xl border-2 bg-blanco-crema px-4 py-3 text-tinta placeholder:text-cacao/60 focus:border-miel focus:outline-none ${
          error ? "border-terracota" : "border-amarillo-suave"
        } ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-sm text-cacao">{hint}</p>}
      {error && <p className="text-sm font-bold text-terracota">{error}</p>}
    </div>
  );
});

export default Input;
