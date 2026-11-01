import { BRANDS, TERMS } from "../config";
import { Reveal, SectionHead } from "../components/ui";

const VALUES = [
  "Diagnosis before recommendation — always.",
  "Plain-language explanations, never jargon as a shield.",
  "If it isn't worth fixing, we say so.",
  "Your device is handled like it's ours.",
];

export function Trust() {
  return (
    <>
      {/* about */}
      <section id="about" className="py-24 md:py-36 bg-cream-2/50 border-y border-line">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHead
            index="05"
            kicker="Who you're dealing with"
            title={
              <>
                A neighbourhood bench, <span className="text-leaf">not a call centre.</span>
              </>
            }
          />

          <div className="grid lg:grid-cols-12 gap-10">
            <Reveal variant="left" className="lg:col-span-6">
              <p className="font-display text-[clamp(1.3rem,2.6vw,1.9rem)] leading-snug text-ink font-medium">
                Koshal Electronics is a local repair workshop for the screens and sound
                systems people actually use every day.
              </p>
              <div className="mt-8 space-y-4 text-moss leading-relaxed max-w-xl">
                <p>
                  Most faults have sensible, affordable fixes — and some don&rsquo;t. Our job is
                  to tell the difference honestly, explain it clearly, and only then talk
                  about money.
                </p>
                <p>
                  That&rsquo;s the whole philosophy: check first, explain second, repair third.
                  No pressure at any point, and no work begins without your yes.
                </p>
              </div>
            </Reveal>

            <Reveal variant="right" delay={150} className="lg:col-span-5 lg:col-start-8">
              <ul className="space-y-4">
                {VALUES.map((v, i) => (
                  <li key={v} className="flex items-start gap-4 group" style={{ transitionDelay: `${i * 60}ms` }}>
                    <span aria-hidden="true" className="mt-1.5 flex gap-1 shrink-0">
                      <span className="w-2 h-2 bg-forest transition-transform group-hover:-translate-y-0.5" />
                      <span className="w-2 h-2 bg-leaf transition-transform group-hover:translate-y-0.5" />
                    </span>
                    <span className="font-display font-medium text-ink/90">{v}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 p-5 border border-dashed border-sage/60 rounded-md bg-cream">
                <p className="dev-tag mb-2">Transparency note</p>
                <p className="text-sm text-moss leading-relaxed">
                  We don&rsquo;t display certificates, authorised-service badges or partner
                  logos. If formal credentials or association details are provided by the
                  business, they&rsquo;ll appear here — verified, never implied.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* brands */}
      <section className="py-20 md:py-28 bg-cream" aria-labelledby="brands-title">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <h2 id="brands-title" className="font-display font-semibold text-2xl md:text-3xl text-forest">
              Brands we commonly see on the bench
            </h2>
            <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-moss max-w-xs">
              Listed to help you identify your equipment — not an endorsement or
              authorised-service claim.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-line border border-line rounded-md overflow-hidden">
              {BRANDS.map((b) => (
                <li
                  key={b}
                  className="bg-cream px-5 py-6 font-display font-medium text-ink/70 text-center hover:bg-forest hover:text-cream transition-colors duration-300 cursor-default"
                >
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* terms */}
      <section className="pb-24 md:pb-36 bg-cream" aria-labelledby="terms-title">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <SectionHead
            index="06"
            kicker="Estimates & terms"
            title={
              <span id="terms-title">
                What to expect, <span className="text-leaf">in plain language.</span>
              </span>
            }
          />
          <div className="grid sm:grid-cols-2 gap-5">
            {TERMS.map((t, i) => (
              <Reveal key={t.title} delay={i * 90} variant={i % 2 ? "right" : "left"}>
                <article className="group h-full border border-line rounded-lg p-7 md:p-8 bg-card hover:border-forest/50 hover:shadow-[0_20px_50px_-30px_rgba(18,32,86,0.18)] hover:-translate-y-1 transition-all duration-500">
                  <div className="flex items-baseline justify-between mb-4">
                    <h3 className="font-display font-semibold text-lg text-forest">{t.title}</h3>
                    <span className="font-mono text-[0.6rem] text-sage tracking-widest">0{i + 1}</span>
                  </div>
                  <p className="text-moss leading-relaxed text-[0.95rem]">{t.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
