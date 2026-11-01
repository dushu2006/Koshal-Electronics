import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowRight, RotateCcw } from "lucide-react";
import { DEVICES } from "../config";
import { useDiagnostic, useIsDesktop, usePrefersReducedMotion } from "../state";
import { Reveal, SectionHead } from "../components/ui";
import { cn } from "../utils/cn";

gsap.registerPlugin(ScrollTrigger);

/* ---------------- shared diagnostic UI (used pinned + static) ---------------- */
export function DiagnosticUI({ dark = true, onContinue }: { dark?: boolean; onContinue?: () => void }) {
  const { device, symptom, setDevice, setSymptom } = useDiagnostic();
  const activeDevice = DEVICES.find((d) => d.id === device) ?? null;

  const chipCls = (pressed: boolean) =>
    cn(
      "font-display text-sm font-medium px-4 py-2 rounded-full border transition-all duration-300 cursor-pointer select-none active:scale-95",
      dark
        ? pressed
          ? "bg-cream text-forest border-cream shadow-[0_4px_16px_-4px_rgba(255,255,255,0.4)] scale-[1.02]"
          : "border-sage/40 text-cream hover:border-cream hover:-translate-y-0.5"
        : pressed
          ? "bg-forest text-cream border-forest shadow-[0_4px_16px_-4px_rgba(91,101,220,0.4)] scale-[1.02]"
          : "border-line text-ink hover:border-forest hover:-translate-y-0.5"
    );

  return (
    <div className={cn("flex flex-col h-full", dark ? "text-cream" : "text-ink")}>
      {/* screen chrome */}
      <div className={cn("flex items-center justify-between font-mono text-[0.6rem] tracking-[0.25em] uppercase pb-4 border-b", dark ? "text-sage border-sage/25" : "text-moss border-line")}>
        <span>KE · Diagnostic</span>
        <span className="flex items-center gap-2">
          <span className={cn("w-1.5 h-1.5 rounded-full animate-[blink-soft_1.8s_ease-in-out_infinite]", dark ? "bg-mint" : "bg-leaf")} />
          Live
        </span>
      </div>

      <div className="flex-1 py-5 grid gap-6 content-start overflow-y-auto">
        {/* step 1 */}
        <div>
          <p className={cn("kicker mb-3", dark ? "text-sage" : "text-moss")}>01 — What is it?</p>
          <div className="flex flex-wrap gap-2.5" role="group" aria-label="Choose a device">
            {DEVICES.map((d) => (
              <button key={d.id} type="button" aria-pressed={device === d.id} className={chipCls(device === d.id)} onClick={() => setDevice(d.id)}>
                {d.short}
              </button>
            ))}
          </div>
        </div>

        {/* step 2 */}
        {activeDevice && (
          <div className="animate-[rise-in_0.5s_cubic-bezier(0.22,1,0.36,1)]">
            <p className={cn("kicker mb-3", dark ? "text-sage" : "text-moss")}>02 — What&rsquo;s it doing?</p>
            <div className="flex flex-wrap gap-2.5" role="group" aria-label="Choose a symptom">
              {activeDevice.issues.map((s) => (
                <button key={s} type="button" aria-pressed={symptom === s} className={chipCls(symptom === s)} onClick={() => setSymptom(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* footer */}
      <div className={cn("pt-4 border-t flex flex-wrap items-center justify-between gap-3", dark ? "border-sage/25" : "border-line")}>
        <div className="font-mono text-[0.65rem] tracking-wide min-h-5" aria-live="polite">
          {device ? (
            <>
              <span className={dark ? "text-mint" : "text-leaf"}>▸</span>{" "}
              {activeDevice?.name}
              {symptom ? ` — ${symptom}` : " — pick a symptom (optional)"}
            </>
          ) : (
            <span className={dark ? "text-sage" : "text-moss"}>Select a device to begin</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {(device || symptom) && (
            <button
              type="button"
              onClick={() => { setDevice(null); }}
              className={cn("font-mono text-[0.65rem] tracking-widest uppercase px-3 py-2 rounded border transition-colors", dark ? "border-sage/40 text-sage hover:text-cream hover:border-cream" : "border-line text-moss hover:text-forest hover:border-forest")}
            >
              <RotateCcw size={11} className="inline mr-1.5 -mt-0.5" aria-hidden="true" />
              Reset
            </button>
          )}
          <button
            type="button"
            disabled={!device}
            onClick={onContinue}
            className={cn(
              "font-display font-semibold text-sm px-5 py-2.5 rounded flex items-center gap-2 transition-all duration-300",
              device
                ? dark
                  ? "bg-cream text-forest hover:gap-3"
                  : "bg-forest text-cream hover:gap-3"
                : "opacity-40 cursor-not-allowed border border-current"
            )}
          >
            Send to enquiry
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

const goContact = (reduced: boolean) =>
  document.getElementById("contact")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });

/* ---------------- the portal section ---------------- */
export function Portal() {
  const pinRef = useRef<HTMLDivElement>(null);
  const tvRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();
  const animate = desktop && !reduced;

  useLayoutEffect(() => {
    if (!animate || !pinRef.current) return;
    const ctx = gsap.context(() => {
      const screen = screenRef.current!;
      const ui = screen.querySelector("[data-ui]") as Element;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: "+=260%",
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            const ready = self.progress > 0.52;
            screenRef.current?.classList.toggle("pointer-events-auto", ready);
            screenRef.current?.classList.toggle("pointer-events-none", !ready);
            hintRef.current && (hintRef.current.style.opacity = String(Math.max(0, 1 - self.progress * 5)));
          },
        },
      });
      tl.to(tvRef.current, { scale: 7, ease: "none", duration: 0.55 })
        .fromTo(
          screen,
          { clipPath: "circle(0% at 50% 50%)" },
          { clipPath: "circle(120% at 50% 50%)", ease: "power2.inOut", duration: 0.3 },
          0.42
        )
        .fromTo(ui, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.18 }, 0.62)
        .to({}, { duration: 0.55 }); // hold space for interaction before release
    }, pinRef);
    return () => ctx.revert();
  }, [animate]);

  return (
    <section id="diagnose" aria-labelledby="diagnose-title">
      <div className="mx-auto max-w-7xl px-5 md:px-8 pt-24 md:pt-36">
        <SectionHead
          index="02"
          kicker="Step into the screen"
          title={
            <span id="diagnose-title">
              Your fault, <span className="text-leaf">diagnosed</span> before you call.
            </span>
          }
        />
        <Reveal delay={120} className="-mt-6 mb-14 max-w-2xl">
          <p className="text-moss text-lg leading-relaxed">
            Pick the device and the symptom. Your choices travel straight into the enquiry
            form — no retyping, no guesswork.
          </p>
        </Reveal>
      </div>

      {animate ? (
        /* -------- pinned, scroll-zoom variant -------- */
        <div ref={pinRef} className="relative h-screen overflow-hidden">
          {/* the physical TV */}
          <div ref={tvRef} className="absolute inset-0 flex items-center justify-center will-change-transform">
            <div className="w-[min(78vw,620px)]">
              <div className="rounded-2xl border-[7px] border-ink bg-cream shadow-[0_40px_80px_-40px_rgba(16,19,18,0.4)]">
                <div className="aspect-video crt-lines relative flex flex-col items-center justify-center gap-3">
                  <div ref={hintRef} className="flex flex-col items-center gap-3 text-center px-6">
                    <span className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-moss">Standby</span>
                    <ArrowDown size={18} className="text-leaf animate-bounce" aria-hidden="true" />
                    <span className="font-display font-medium text-forest text-sm">Scroll to step inside</span>
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="flex justify-between px-12 -mt-px">
                <span className="w-2 h-10 bg-ink rotate-[16deg] origin-top rounded-b" />
                <span className="w-2 h-10 bg-ink -rotate-[16deg] origin-top rounded-b" />
              </div>
            </div>
          </div>

          {/* the screen that becomes the UI */}
          <div
            ref={screenRef}
            className="absolute inset-0 bg-forest pointer-events-none"
            style={{ clipPath: "circle(0% at 50% 50%)" }}
          >
            <div className="crt-lines absolute inset-0 pointer-events-none opacity-60" />
            <div data-ui className="relative h-full max-w-3xl mx-auto px-6 md:px-10 py-8 flex flex-col">
              <DiagnosticUI dark onContinue={() => goContact(reduced)} />
            </div>
          </div>
        </div>
      ) : (
        /* -------- static / reduced-motion / mobile variant -------- */
        <div className="mx-auto max-w-7xl px-5 md:px-8 pb-8">
          <Reveal variant="scale">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-2xl border-[6px] border-ink bg-forest overflow-hidden">
                <div className="px-6 md:px-9 py-7 min-h-[420px]">
                  <DiagnosticUI dark onContinue={() => goContact(reduced)} />
                </div>
              </div>
              <div aria-hidden="true" className="flex justify-between px-12 -mt-px">
                <span className="w-1.5 h-7 bg-ink rotate-[16deg] origin-top rounded-b" />
                <span className="w-1.5 h-7 bg-ink -rotate-[16deg] origin-top rounded-b" />
              </div>
            </div>
          </Reveal>
        </div>
      )}
    </section>
  );
}
