import { useState } from "react";
import { Plus } from "lucide-react";
import { FAQS } from "../config";
import { Reveal, SectionHead } from "../components/ui";
import { cn } from "../utils/cn";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faqs" className="py-24 md:py-36 bg-cream">
      <div className="mx-auto max-w-7xl px-5 md:px-8 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHead
              index="08"
              kicker="Questions"
              title={
                <>
                  Asked <span className="text-leaf">often.</span>
                </>
              }
              className="mb-6"
            />
            <Reveal delay={120}>
              <p className="text-moss leading-relaxed max-w-xs">
                Anything else? The enquiry form reaches us directly — no phone tree, no
                ticket number.
              </p>
              <a href="#contact" className="link-draw inline-block mt-5 font-display font-semibold text-forest">
                Ask your own question →
              </a>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ul className="border-t border-line">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <Reveal as="li" key={f.q} delay={i * 50}>
                  <div className="border-b border-line">
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        id={`faq-btn-${i}`}
                        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                      >
                        <span className={cn("font-display font-semibold text-lg md:text-xl transition-colors duration-300", isOpen ? "text-forest" : "text-ink/80 group-hover:text-forest")}>
                          {f.q}
                        </span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-400",
                            isOpen ? "bg-forest border-forest text-cream rotate-45" : "border-line text-moss group-hover:border-forest group-hover:text-forest"
                          )}
                        >
                          <Plus size={16} />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-btn-${i}`}
                      className="acc-panel"
                      data-open={isOpen}
                    >
                      <div>
                        <p className="pb-7 pr-12 text-moss leading-relaxed max-w-2xl">{f.a}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
