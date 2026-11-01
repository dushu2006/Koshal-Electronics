import { useEffect, useRef, useState } from "react";
import { DiagnosticProvider, usePrefersReducedMotion } from "./state";
import { ScrollProgress } from "./components/ui";
import { Intro } from "./components/Intro";
import { Header } from "./components/Header";
import { Hero } from "./sections/Hero";
import { Portal } from "./sections/Portal";
import { Services } from "./sections/Services";
import { Process } from "./sections/Process";
import { Trust } from "./sections/Trust";
import { Gallery } from "./sections/Gallery";
import { FAQ } from "./sections/FAQ";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";

const INTRO_KEY = "ke-intro-seen";

function shouldPlayIntro() {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).has("intro")) return true;
  try {
    return sessionStorage.getItem(INTRO_KEY) !== "1";
  } catch {
    return true;
  }
}

/* desktop-only difference-blend cursor halo */
function CursorHalo() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let rx = x, ry = y;
    let raf = 0;
    let visible = false;

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      dot.style.transform = `translate(${x}px, ${y}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element | null;
      const interactive = t?.closest("a, button, select, input, textarea, [role='button'], [data-cursor]");
      ring.classList.toggle("is-active", !!interactive);
    };
    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <>
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} aria-hidden="true" />
    </>
  );
}

export default function App() {
  const [showIntro, setShowIntro] = useState(shouldPlayIntro);

  const finishIntro = () => {
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* private mode */
    }
    setShowIntro(false);
  };

  return (
    <DiagnosticProvider>
      <div id="top" className="relative">
        <ScrollProgress />
        <CursorHalo />
        <Header />
        <main>
          <Hero />
          <Portal />
          <Services />
          <Process />
          <Trust />
          <Gallery />
          <FAQ />
          <Contact />
        </main>
        <Footer />
        {showIntro && <Intro onDone={finishIntro} />}
      </div>
    </DiagnosticProvider>
  );
}
