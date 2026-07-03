type Faq = {
  question: string;
  answer: string;
};

/**
 * Acordeón sin JavaScript usando <details>/<summary>: accesible y liviano.
 */
export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <details
          key={faq.question}
          className="group rounded-2xl bg-blanco-crema p-5 shadow-calida"
        >
          <summary className="cursor-pointer list-none font-bold text-tinta marker:hidden">
            <span className="flex items-center justify-between gap-4">
              {faq.question}
              <span
                className="text-miel transition-transform group-open:rotate-45"
                aria-hidden
              >
                +
              </span>
            </span>
          </summary>
          <p className="mt-3 text-cacao">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
