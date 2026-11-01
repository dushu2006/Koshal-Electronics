import { useEffect, useRef } from "react";
import { PROCESS } from "../config";
import { Reveal, SectionHead } from "../components/ui";
import { cn } from "../utils/cn";

export function Process() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* line follows scroll */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const wrap = wrapRef.current;
      const fill = fillRef.current;
      if (!wrap || !fill) return;
      const r = wrap.getBoundingClientRect();
      const mid = window.innerHeight * 0.55;
      const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
      fill.style.transform = `scaleY(${p})`;
      stepRefs.current.forEach((el) => {
        if (!el) return;
        const sr = el.getBoundingClientRect();
        el.classList.toggle("is-active", sr.top < mid);
      });
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="process" className="py-24 md:py-36 bg-cream relative">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          index="04"
          kicker="How it works"
          title={
            <>
              Four steps. <span className="text-leaf">No surprises.</span>
            </>
          }
        />

        <div ref={wrapRef} className="relative max-w-3xl ml-0 lg:ml-[8%]">
          {/* rail */}
          <div aria-hidden="true" className="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-px bg-line" />
          <div
            ref={fillRef}
            aria-hidden="true"
            className="absolute left-[15px] md:left-[19px] top-2 bottom-2 w-[2px] -ml-px bg-forest origin-top scale-y-0"
          />

          <ol className="space-y-14 md:space-y-20">
            {PROCESS.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 90}>
                <div
                  ref={(el) => { stepRefs.current[i] = el; }}
                  className="group relative pl-14 md:pl-20 transition-colors"
                >
                  {/* node */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1 w-8 h-8 md:w-10 md:h-10 rounded-full border border-line bg-cream flex items-center justify-center transition-all duration-500 group-[.is-active]:border-forest group-[.is-active]:bg-forest"
                  >
                    <span className="font-mono text-[0.65rem] text-moss transition-colors duration-500 group-[.is-active]:text-cream">
                      0{i + 1}
                    </span>
                    <span className="absolute inset-0 rounded-full border border-forest/40 opacity-0 scale-50 transition-all duration-700 group-[.is-active]:opacity-100 group-[.is-active]:scale-125 group-[.is-active]:animate-[ping_2.4s_ease-out_infinite]" />
                  </span>

                  <h3 className={cn("font-display font-semibold text-xl md:text-2xl mb-2 transition-colors duration-500", "text-ink/50 group-[.is-active]:text-forest")}>
                    {step.title}
                  </h3>
                  <p className="text-moss leading-relaxed max-w-xl">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
