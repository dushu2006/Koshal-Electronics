import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "../utils/cn";
import { CONTACT } from "../config";

const LINKS = [
  { href: "#diagnose", label: "Diagnose", id: "diagnose" },
  { href: "#services", label: "Services", id: "services" },
  { href: "#process", label: "How it works", id: "process" },
  { href: "#about", label: "About", id: "about" },
  { href: "#faqs", label: "FAQs", id: "faqs" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const burgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* active section tracking */
  useEffect(() => {
    const ids = [...LINKS.map((l) => l.id), "contact"];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  /* mobile menu: scroll lock + focus + escape */
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-[80] transition-all duration-500",
          scrolled ? "bg-cream/92 backdrop-blur-sm border-b border-line shadow-[0_8px_30px_-20px_rgba(16,19,18,0.35)]" : "bg-transparent border-b border-transparent"
        )}
      >
        <div className={cn("mx-auto max-w-7xl px-5 md:px-8 flex items-center justify-between transition-all duration-500", scrolled ? "h-16" : "h-20")}>
          <a href="#top" className="flex items-center gap-3 group" aria-label="Koshal Electronics — back to top">
            <span id="site-logo" className="w-11 shrink-0">
              <Logo className="w-full h-auto" label="" />
            </span>
            <span className="font-display font-semibold tracking-tight text-forest leading-none">
              Koshal
              <span className="block text-[0.6rem] font-mono font-normal tracking-[0.3em] text-moss uppercase mt-0.5">
                Electronics
              </span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={l.href}
                aria-current={active === l.id ? "true" : undefined}
                className="link-draw font-display text-[0.9rem] font-medium text-ink/80 hover:text-forest transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="#contact" className="btn btn-primary shine hidden sm:inline-flex !py-2.5 !px-5 text-sm">
              <span>Request a repair</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <button
              ref={burgerRef}
              type="button"
              onClick={() => setOpen(true)}
              className="lg:hidden p-2.5 text-forest hover:bg-cream-2 rounded transition-colors"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      <div
        ref={panelRef}
        className={cn(
          "fixed inset-0 z-[85] lg:hidden transition-[opacity,visibility] duration-400",
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="absolute inset-0 bg-cream" />
        <div className="absolute inset-x-0 top-0 h-full grain opacity-[0.05] pointer-events-none" />
        <div className="relative h-full flex flex-col px-6 py-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <span className="w-10"><Logo className="w-full h-auto" label="" /></span>
              <span className="font-display font-semibold text-forest">Koshal Electronics</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                burgerRef.current?.focus();
              }}
              className="p-2.5 text-forest hover:bg-cream-2 rounded transition-colors"
              aria-label="Close menu"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>

          <nav className="mt-14 flex flex-col gap-1" aria-label="Mobile">
            {[...LINKS, { href: "#contact", label: "Contact", id: "contact" }].map((l, i) => (
              <a
                key={l.id}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display font-semibold text-forest text-[clamp(1.8rem,8vw,2.6rem)] tracking-tight py-2 border-b border-line/70 flex items-center justify-between group transition-all duration-500"
                style={{
                  transitionDelay: open ? `${120 + i * 60}ms` : "0ms",
                  opacity: open ? 1 : 0,
                  transform: open ? "none" : "translateY(18px)",
                }}
              >
                {l.label}
                <ArrowUpRight size={22} className="text-sage group-hover:text-forest group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" aria-hidden="true" />
              </a>
            ))}
          </nav>

          <div className="mt-auto pt-8 pb-2 text-sm text-moss">
            {CONTACT.phone.confirmed ? (
              <a href={`tel:${CONTACT.phone.value}`} className="link-draw font-mono">{CONTACT.phone.value}</a>
            ) : (
              <p className="font-mono text-xs">Phone &amp; WhatsApp · to be confirmed</p>
            )}
            <p className="mt-2 font-mono text-xs tracking-wide">TV · Audio · Monitors · Desktops</p>
          </div>
        </div>
      </div>
    </>
  );
}
