import { forwardRef, useId, type ComponentPropsWithoutRef } from "react";

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  label: string;
  error?: string;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, className = "", ...props }, ref) {
    const id = useId();
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="font-bold text-tinta">
          {label}
        </label>
        <textarea
          id={id}
          ref={ref}
          aria-invalid={Boolean(error)}
          className={`min-h-28 rounded-2xl border-2 bg-blanco-crema px-4 py-3 text-tinta placeholder:text-cacao/60 focus:border-miel focus:outline-none ${
            error ? "border-terracota" : "border-amarillo-suave"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-sm font-bold text-terracota">{error}</p>}
      </div>
    );
  }
);

export default Textarea;
