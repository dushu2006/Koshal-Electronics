import { useEffect, useRef } from "react";
import { Logo } from "./Logo";
import { usePrefersReducedMotion } from "../state";

const EXIT_AT = 4500; // ms after mount when the ident hands off to the site

export function Intro({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const exiting = useRef(false);
  const done = useRef(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    document.body.style.overflow = "hidden";

    const finish = () => {
      if (done.current) return;
      done.current = true;
      document.body.style.overflow = "";
      onDone();
    };

    const beginExit = () => {
      if (exiting.current) return;
      exiting.current = true;

      const svg = logoRef.current?.querySelector("svg");
      const target = document.getElementById("site-logo");

      if (svg && target) {
        const from = svg.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        if (from.width > 0 && to.width > 0) {
          const dx = to.left + to.width / 2 - (from.left + from.width / 2);
          const dy = to.top + to.height / 2 - (from.top + from.height / 2);
          const s = to.width / from.width;
          const el = logoRef.current!;
          el.style.transition = reduced
            ? "opacity .4s ease"
            : "transform .78s cubic-bezier(.7,0,.2,1), opacity .2s ease .72s";
          el.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
          el.style.opacity = "0";
        }
      }
      if (nameRef.current) {
        nameRef.current.style.transition = "opacity .45s ease, transform .45s ease";
        nameRef.current.style.opacity = "0";
        nameRef.current.style.transform = "translateY(-8px)";
      }
      if (bgRef.current) {
        bgRef.current.style.transition = `opacity .55s ease ${reduced ? "0s" : ".18s"}`;
        bgRef.current.style.opacity = "0";
      }
      window.setTimeout(finish, reduced ? 500 : 950);
    };

    const playTimer = window.setTimeout(() => {
      if (reduced) root.classList.add("skip");
      else root.classList.add("play");
    }, 60);

    const exitTimer = window.setTimeout(beginExit, reduced ? 700 : EXIT_AT);
    const failsafe = window.setTimeout(finish, 10000);

    (root as HTMLElement & { __beginExit?: () => void }).__beginExit = beginExit;

    return () => {
      clearTimeout(playTimer);
      clearTimeout(exitTimer);
      clearTimeout(failsafe);
      document.body.style.overflow = "";
    };
  }, [onDone, reduced]);

  const skip = () => {
    const root = rootRef.current;
    if (!root) return;
    root.classList.add("skip");
    const beginExit = (root as HTMLElement & { __beginExit?: () => void }).__beginExit;
    window.setTimeout(() => beginExit?.(), 120);
  };

  return (
    <div
      ref={rootRef}
      className="intro fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-label="Koshal Electronics intro"
    >
      <div ref={bgRef} className="absolute inset-0 bg-cream" />

      {/* corner ident metadata */}
      <div className="absolute top-6 left-6 kicker text-moss/70">Ident 01</div>
      <div className="absolute top-6 right-6 kicker text-moss/70">Signal · Live</div>

      <div className="relative flex flex-col items-center px-6">
        <div ref={logoRef} className="w-[min(72vw,420px)]">
          <Logo animated className="w-full h-auto" label="" />
        </div>
        <div
          ref={nameRef}
          className="intro-name mt-8 font-display font-semibold text-forest text-[clamp(1rem,3.4vw,1.5rem)] tracking-[0.22em] uppercase text-center"
        >
          Koshal <span className="text-ink">Electronics</span>
        </div>
      </div>

      <button
        type="button"
        onClick={skip}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 kicker text-moss hover:text-forest transition-colors px-4 py-2"
      >
        Enter website ↓
      </button>
    </div>
  );
}
