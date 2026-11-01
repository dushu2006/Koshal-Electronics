import { useState } from "react";
import { Tv, Speaker, Monitor, Cpu, CircuitBoard, ArrowUpRight } from "lucide-react";
import { DEVICES, type DeviceId } from "../config";
import { useDiagnostic } from "../state";
import { Reveal, SectionHead } from "../components/ui";
import { cn } from "../utils/cn";

const ICONS: Record<DeviceId, typeof Tv> = {
  tv: Tv,
  speaker: Speaker,
  monitor: Monitor,
  desktop: Cpu,
  other: CircuitBoard,
};

function ServiceArt({ id }: { id: DeviceId }) {
  switch (id) {
    case "tv":
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full text-cream" aria-hidden="true">
          <rect x="20" y="14" width="160" height="92" rx="8" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.5" />
          <rect x="30" y="24" width="140" height="72" rx="4" fill="currentColor" opacity="0.08" />
          <rect className="animate-[scanline_3s_linear_infinite]" x="30" y="20" width="140" height="18" fill="#5B65DC" opacity="0.65" />
        </svg>
      );
    case "speaker":
      return (
        <div className="flex items-end justify-center gap-1.5 h-full" aria-hidden="true">
          {[0.5, 0.9, 0.65, 1, 0.75, 0.55, 0.85, 0.6, 0.95, 0.5].map((h, i) => (
            <span
              key={i}
              className="w-2 bg-leaf rounded-sm origin-bottom animate-[pulse-bar_1.1s_ease-in-out_infinite]"
              style={{ height: `${h * 80}%`, animationDelay: `${i * 90}ms` }}
            />
          ))}
        </div>
      );
    case "monitor":
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full text-cream" aria-hidden="true">
          <rect x="30" y="16" width="140" height="78" rx="6" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.5" />
          <path d="M100 94v14M80 110h40" stroke="currentColor" strokeWidth="4" opacity="0.5" strokeLinecap="round" />
          <rect x="44" y="32" width="8" height="46" fill="#5B65DC" className="animate-[blink-soft_1s_steps(1)_infinite]" />
          <path d="M60 40h70M60 56h52M60 72h64" stroke="currentColor" strokeWidth="4" opacity="0.3" strokeLinecap="round" />
        </svg>
      );
    case "desktop":
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full text-cream" aria-hidden="true">
          <rect x="70" y="14" width="60" height="92" rx="6" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.5" />
          <g className="origin-center animate-[spin_3.5s_linear_infinite]" style={{ transformBox: "fill-box" }}>
            <circle cx="100" cy="48" r="16" fill="none" stroke="#5B65DC" strokeWidth="4" />
            <path d="M100 32v32M84 48h32" stroke="#5B65DC" strokeWidth="3" />
          </g>
          <circle cx="86" cy="88" r="3" fill="#5B65DC" className="animate-[blink-soft_1.4s_ease-in-out_infinite]" />
          <circle cx="98" cy="88" r="3" fill="currentColor" opacity="0.5" className="animate-[blink-soft_1.4s_ease-in-out_infinite_0.5s]" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 200 120" className="w-full h-full text-cream" aria-hidden="true">
          <circle cx="100" cy="60" r="6" fill="currentColor" />
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx="100"
              cy="60"
              r={20 + i * 14}
              fill="none"
              stroke="#5B65DC"
              strokeWidth="2"
              opacity={0.8 - i * 0.2}
              className="origin-center animate-[spin_6s_linear_infinite]"
              style={{ transformBox: "fill-box", animationDuration: `${5 + i * 2}s`, animationDirection: i % 2 ? "reverse" : "normal" }}
            />
          ))}
          <circle cx="120" cy="60" r="4" fill="#5B65DC" className="origin-center animate-[spin_5s_linear_infinite]" style={{ transformBox: "fill-box" }} />
        </svg>
      );
  }
}

export function Services() {
  const [active, setActive] = useState<DeviceId>("tv");
  const { setDevice } = useDiagnostic();
  const device = DEVICES.find((d) => d.id === active)!;
  const Icon = ICONS[active];

  const startEnquiry = () => {
    setDevice(active);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services" className="bg-forest-2 text-cream py-24 md:py-36 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 grain opacity-[0.05]" />
      <div className="mx-auto max-w-7xl px-5 md:px-8 relative">
        <SectionHead
          dark
          index="03"
          kicker="What we work on"
          title={
            <>
              Five benches, <span className="text-mint">one standard</span> of care.
            </>
          }
        />

        <div className="grid lg:grid-cols-12 gap-10">
          {/* selector list */}
          <Reveal variant="left" className="lg:col-span-5 flex flex-col">
            {DEVICES.map((d, i) => {
              const DIcon = ICONS[d.id];
              const isActive = d.id === active;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setActive(d.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "group text-left flex items-center gap-5 py-5 border-b transition-all duration-400",
                    isActive ? "border-mint/60 pl-3" : "border-sage/20 hover:pl-2"
                  )}
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  <span className="font-mono text-xs text-sage w-6">0{i + 1}</span>
                  <DIcon
                    size={22}
                    className={cn("shrink-0 transition-colors duration-300", isActive ? "text-mint" : "text-sage group-hover:text-cream")}
                    aria-hidden="true"
                  />
                  <span className="flex-1">
                    <span className={cn("font-display font-semibold text-lg block transition-colors", isActive ? "text-cream" : "text-cream/70 group-hover:text-cream")}>
                      {d.name}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={18}
                    className={cn("transition-all duration-300", isActive ? "text-mint opacity-100" : "opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0")}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
            <p className="mt-6 text-sm text-sage leading-relaxed">
              Something else? Choose <span className="text-cream">Other</span> and describe it — we&rsquo;ll
              tell you plainly whether it&rsquo;s a job we can take on.
            </p>
          </Reveal>

          {/* detail panel */}
          <Reveal variant="right" delay={150} className="lg:col-span-7">
            <div className="border border-sage/25 rounded-lg p-7 md:p-10 bg-forest/60 h-full flex flex-col">
              <div key={active} className="flex flex-col h-full animate-[rise-in_0.55s_cubic-bezier(0.22,1,0.36,1)]">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Icon size={26} className="text-mint" aria-hidden="true" />
                      <h3 className="font-display font-semibold text-2xl">{device.name}</h3>
                    </div>
                    <p className="text-cream/75 leading-relaxed max-w-md">{device.blurb}</p>
                  </div>
                  <div className="hidden sm:block w-36 h-24 shrink-0 opacity-90">
                    <ServiceArt id={active} />
                  </div>
                </div>

                <div className="mt-8">
                  <p className="kicker text-sage mb-3">Common issues we see</p>
                  <ul className="flex flex-wrap gap-2">
                    {device.issues.map((s) => (
                      <li key={s} className="font-mono text-[0.7rem] tracking-wide px-3 py-1.5 rounded-full border border-sage/30 text-cream/80">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-8 flex flex-wrap items-center gap-4">
                  <button type="button" onClick={startEnquiry} className="btn bg-cream text-forest font-semibold shine">
                    <span>Diagnose this device</span>
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </button>
                  <span className="text-xs text-sage font-mono tracking-wide">Selection carries into the enquiry form</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
