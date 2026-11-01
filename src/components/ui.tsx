import { useEffect, useRef } from "react";
import { cn } from "../utils/cn";
import { usePrefersReducedMotion } from "../state";

/* ---------------- scroll reveal ---------------- */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "left" | "right" | "scale";
  as?: "div" | "section" | "li" | "span" | "figure" | "header" | "article";
}) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const variantClass =
    variant === "left" ? "reveal-left" : variant === "right" ? "reveal-right" : variant === "scale" ? "reveal-scale" : "";

  return (
    <Tag
      // @ts-expect-error polymorphic ref
      ref={ref}
      className={cn("reveal", variantClass, className)}
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

/* ---------------- masked line headline ---------------- */
export function MaskLines({ lines, className }: { lines: React.ReactNode[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in-view");
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {lines.map((l, i) => (
        <span className="mask-line" key={i}>
          <span style={{ "--d": `${i * 110}ms` } as React.CSSProperties}>{l}</span>
        </span>
      ))}
    </div>
  );
}

/* ---------------- magnetic hover ---------------- */
export function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transition = "transform .5s var(--ease-soft)";
      el.style.transform = "translate(0,0)";
      setTimeout(() => (el.style.transition = ""), 500);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduced, strength]);

  return (
    <div ref={ref} className={cn("inline-block will-change-transform", className)}>
      {children}
    </div>
  );
}

/* ---------------- section heading ---------------- */
export function SectionHead({
  index,
  kicker,
  title,
  dark = false,
  className,
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn("mb-12 md:mb-16", className)}>
      <div className={cn("flex items-center gap-4 mb-5", dark ? "text-sage" : "text-moss")}>
        <span className="kicker">{index}</span>
        <span className={cn("h-px flex-1 max-w-16", dark ? "bg-sage/40" : "bg-line")} />
        <span className="kicker">{kicker}</span>
      </div>
      <h2
        className={cn(
          "font-display font-semibold tracking-tight text-[clamp(2rem,5vw,3.6rem)] leading-[1.04]",
          dark ? "text-cream" : "text-ink"
        )}
      >
        {title}
      </h2>
    </Reveal>
  );
}

/* ---------------- scroll progress bar ---------------- */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
        if (ref.current) ref.current.style.transform = `scaleX(${p})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[90] h-[2px] bg-transparent" aria-hidden="true">
      <div ref={ref} className="h-full bg-forest origin-left scale-x-0" />
    </div>
  );
}
