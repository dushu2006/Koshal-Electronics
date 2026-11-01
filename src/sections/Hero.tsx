import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDownRight, ArrowUpRight, Play } from "lucide-react";
import { MaskLines, Reveal, Magnetic } from "../components/ui";
import { usePrefersReducedMotion } from "../state";
import { cn } from "../utils/cn";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE = [
  "Televisions", 
  "Speakers", 
  "Home theatres", 
  "Monitors", 
  "Desktops", 
  "Other electronics"
];

// Exact video file path from current project
const VIDEO_SRC = "/gemini_generated_video_ae06bfd0.mp4";

// Progress mapping for immersive 3D storytelling:
// 0.00 - 0.25: Centering + Camera approach + TV rotates (0.0s -> 2.0s)
// 0.25 - 0.55: Horizontal component explosion into exploded view (2.0s -> 5.0s)
// 0.55 - 0.70: Deliberate hold on full exploded view (5.0s)
// 0.70 - 0.92: Smooth horizontal reassembly into normal TV (5.0s -> 9.95s)
// 0.92 - 1.00: Settle and natural transition into next section (9.95s)
function getVideoTime(p: number): number {
  if (p <= 0.25) {
    return (p / 0.25) * 2.0;
  } else if (p <= 0.55) {
    return 2.0 + ((p - 0.25) / 0.30) * 3.0;
  } else if (p <= 0.70) {
    return 5.0; // Hold peak exploded view
  } else if (p <= 0.92) {
    return 5.0 + ((p - 0.70) / 0.22) * 4.95;
  } else {
    return 9.95; // Fully reassembled
  }
}

export function Hero() {
  const pinSectionRef = useRef<HTMLElement>(null);
  const heroGridRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const tvStageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const reduced = usePrefersReducedMotion();
  const [videoReady, setVideoReady] = useState(false);

  // Initialize and pause video decoder at 0s so seeking responds instantaneously
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.pause();

    const onReady = () => {
      video.pause();
      video.currentTime = 0;
      setVideoReady(true);
    };

    if (video.readyState >= 2) {
      onReady();
    } else {
      video.addEventListener("loadeddata", onReady, { once: true });
      video.addEventListener("canplay", onReady, { once: true });
    }

    return () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
    };
  }, []);

  // GSAP 3D ScrollTrigger Choreography
  useLayoutEffect(() => {
    if (reduced) return;

    const pinSection = pinSectionRef.current;
    const tvStage = tvStageRef.current;
    const video = videoRef.current;
    const heroText = heroTextRef.current;
    const marquee = marqueeRef.current;

    if (!pinSection || !tvStage || !video) return;

    const ctx = gsap.context(() => {
      const isDesktop = window.innerWidth >= 1024;

      // Calculate centering translation vector independent of existing transforms
      const getCenteringOffsets = () => {
        if (!isDesktop) {
          return { x: 0, y: 0, scale: 1.15 };
        }
        const stageRect = tvStage.getBoundingClientRect();
        const currentCenterX = stageRect.left + stageRect.width / 2;
        const targetCenterX = window.innerWidth / 2;
        const currentCenterY = stageRect.top + stageRect.height / 2;
        const targetCenterY = window.innerHeight * 0.48;

        const currentX = (gsap.getProperty(tvStage, "x") as number) || 0;
        const currentY = (gsap.getProperty(tvStage, "y") as number) || 0;
        const currentScale = (gsap.getProperty(tvStage, "scale") as number) || 1;

        const unshiftedCenterX = currentCenterX - currentX;
        const unshiftedCenterY = currentCenterY - currentY;
        const unshiftedWidth = stageRect.width / currentScale;

        const maxScale = Math.min(1.44, (window.innerWidth * 0.86) / unshiftedWidth);

        return {
          x: targetCenterX - unshiftedCenterX,
          y: targetCenterY - unshiftedCenterY,
          scale: maxScale,
        };
      };

      // Seek video with micro-threshold to prevent redundant decoding
      let lastSeekTime = -1;
      const scrubTo = (t: number) => {
        if (!video) return;
        const clamped = Math.max(0, Math.min(9.95, t));
        if (Math.abs(clamped - lastSeekTime) < 0.02) return;
        lastSeekTime = clamped;
        video.currentTime = clamped;
      };

      // Master Scroll-Driven 3D Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSection,
          start: "top top",
          end: "+=260%",
          pin: true,
          scrub: 0.35,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Synchronize video currentTime directly with scroll progress
            scrubTo(getVideoTime(self.progress));
          },
        },
      });

      // --- 1. TV MOVES TO CENTER & SCALES (Approaching the TV in 3D perspective) ---
      tl.to(
        tvStage,
        {
          x: () => getCenteringOffsets().x,
          y: () => getCenteringOffsets().y,
          scale: () => getCenteringOffsets().scale,
          ease: "power2.inOut",
          duration: 2.5,
        },
        0
      );

      // --- 2. HERO TEXT TRANSITIONS AWAY NATURALLY ---
      if (heroText) {
        tl.to(
          heroText,
          {
            opacity: 0,
            x: -60,
            scale: 0.95,
            filter: "blur(6px)",
            ease: "power2.out",
            duration: 1.6,
            pointerEvents: "none",
          },
          0
        );
      }

      // --- 3. DELIBERATE HOLD AT PEAK EXPLODED VIEW ---
      tl.to({}, { duration: 1.5 }, 5.5);

      // --- 4. GENTLE TRANSITION INTO NEXT SECTION AS TV REASSEMBLES ---
      tl.to(
        tvStage,
        {
          scale: () => (isDesktop ? 1.15 : 1.0),
          ease: "power2.inOut",
          duration: 0.8,
        },
        9.2
      );

      if (marquee) {
        tl.fromTo(
          marquee,
          { opacity: 0.2, y: 16 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          9.1
        );
      }

      const onResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
      };
    }, pinSection);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={pinSectionRef}
      className="relative pt-28 md:pt-36 pb-0 overflow-hidden min-h-screen flex flex-col justify-between bg-cream"
      aria-labelledby="hero-title"
    >
      {/* Soft atmospheric gradient backdrop to unify video background with website */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(255,255,255,0.9)_0%,rgba(250,250,253,0.5)_60%,rgba(250,250,253,1)_100%)] select-none"
      />

      {/* Editorial backdrop typography */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-24 font-display font-bold text-[22vw] leading-none text-forest/[0.035] select-none"
      >
        KE
      </div>

      <div
        ref={heroGridRef}
        className="mx-auto max-w-7xl px-5 md:px-8 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center flex-1 relative z-10"
      >
        {/* Left Column: Editorial Minimalist Hero Content */}
        <div ref={heroTextRef} data-hero-text className="lg:col-span-6 relative z-10 will-change-transform">
          <Reveal>
            <p className="kicker text-forest mb-5 flex items-center gap-2.5">
              <span className="inline-block w-2 h-2 rounded-full bg-forest animate-pulse" />
              Television &amp; electronics repair
            </p>
          </Reveal>

          <h1
            id="hero-title"
            className="font-display font-bold tracking-tight text-ink text-[clamp(2.7rem,7.5vw,5.6rem)] leading-[0.98]"
          >
            <MaskLines
              lines={[
                <>Dead screen?</>,
                <>No sound?</>,
                <span key="l" className="text-forest">
                  Let&rsquo;s take a look.
                </span>,
              ]}
            />
          </h1>

          <Reveal delay={350} className="mt-7 max-w-xl">
            <p className="text-lg text-moss leading-relaxed">
              Koshal Electronics diagnoses and repairs televisions, speakers, monitors and
              desktops — with honest advice <em className="not-italic text-ink font-medium">before</em> any work begins.
              Tell us the device and the fault; we&rsquo;ll take it from there.
            </p>
          </Reveal>

          <Reveal delay={480} className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a href="#contact" className="btn btn-primary shine">
                <span>Request a repair</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </Magnetic>
            <a href="#services" className="btn btn-ghost group">
              Explore services
              <ArrowDownRight
                size={18}
                className="transition-transform group-hover:translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </Reveal>

          <Reveal delay={600} className="mt-9 pt-6 border-t border-line flex flex-wrap items-center gap-6 text-xs font-mono text-moss">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-forest" />
              Component-level diagnosis
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-forest" />
              Micro-soldering &amp; precision repair
            </span>
          </Reveal>
        </div>

        {/* Right Column: Physical 3D Television (Natural borderless integration) */}
        <div className="lg:col-span-6 relative z-20 flex items-center justify-center">
          <div
            ref={tvStageRef}
            className="relative w-full max-w-[560px] lg:max-w-none will-change-transform [perspective:1400px]"
          >
            {/* Subtle natural contact shadow beneath the television stand */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[1.5%] left-1/2 -translate-x-1/2 w-[76%] h-7 bg-ink/[0.10] blur-xl rounded-full transition-transform duration-700"
            />

            {/* Television Video Object - Seamless multi-axis soft feather + blend mode */}
            <div
              className="relative aspect-video w-full flex items-center justify-center"
              style={{
                // Soft horizontal edge fade (3.5% feather)
                maskImage: "linear-gradient(to right, transparent 0%, black 3.5%, black 96.5%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 3.5%, black 96.5%, transparent 100%)",
              }}
            >
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  // Soft vertical edge fade (4.5% feather)
                  maskImage: "linear-gradient(to bottom, transparent 0%, black 4.5%, black 95.5%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 4.5%, black 95.5%, transparent 100%)",
                }}
              >
                <video
                  ref={videoRef}
                  src={VIDEO_SRC}
                  muted
                  playsInline
                  preload="auto"
                  aria-label="Koshal Electronics television hardware animation"
                  className={cn(
                    "w-full h-full object-contain pointer-events-none select-none transition-opacity duration-700",
                    videoReady ? "opacity-100" : "opacity-95"
                  )}
                  style={{
                    mixBlendMode: "multiply",
                    filter: "contrast(1.04) brightness(1.02)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* service strip marquee */}
      <div ref={marqueeRef} className="mt-14 md:mt-20 border-y border-line bg-white/70 backdrop-blur-sm relative z-10">
        <div className="marquee overflow-hidden py-4" aria-hidden="true">
          <div className="marquee-track flex w-max items-center gap-8 pr-8">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span
                key={i}
                className="flex items-center gap-8 font-mono text-xs tracking-[0.3em] uppercase text-ink/80"
              >
                {m}
                <Play size={9} fill="currentColor" className="text-forest" />
              </span>
            ))}
          </div>
        </div>
        <span className="sr-only">
          We repair televisions, speakers, home theatres, monitors, desktops and other electronics.
        </span>
      </div>
    </section>
  );
}
