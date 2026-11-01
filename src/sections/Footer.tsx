import { ArrowUp, ArrowUpRight } from "lucide-react";
import { Logo } from "../components/Logo";
import { CONTACT, BUSINESS } from "../config";
import { Magnetic, Reveal } from "../components/ui";

const FOOT_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#diagnose", label: "Diagnose" },
  { href: "#process", label: "How it works" },
  { href: "#about", label: "About" },
  { href: "#faqs", label: "FAQs" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-forest-3 text-cream relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 grain opacity-[0.06]" />

      {/* closing CTA */}
      <div className="relative mx-auto max-w-7xl px-5 md:px-8 pt-24 md:pt-32 pb-20 border-b border-sage/20">
        <Reveal>
          <p className="kicker text-sage mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-mint animate-[blink-soft_2s_ease-in-out_infinite]" />
            End of transmission
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="font-display font-bold tracking-tight text-[clamp(2.2rem,6vw,4.5rem)] leading-[1.02] max-w-4xl">
            Something not <span className="text-mint">switching on?</span>
            <br />
            Describe it — we&rsquo;ll reply honestly.
          </h2>
        </Reveal>
        <Reveal delay={220} className="mt-10 flex flex-wrap gap-4">
          <Magnetic>
            <a href="#contact" className="btn bg-cream text-forest font-semibold shine">
              <span>Request a repair</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </Magnetic>
          {CONTACT.phone.confirmed && (
            <a href={`tel:${CONTACT.phone.value}`} className="btn btn-ghost-cream">
              Call {CONTACT.phone.value}
            </a>
          )}
        </Reveal>
      </div>

      {/* footer body */}
      <div className="relative mx-auto max-w-7xl px-5 md:px-8 py-14 grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <a href="#top" className="footer-logo inline-block w-24 group" aria-label="Koshal Electronics — back to top">
            <Logo className="w-full h-auto [&_.lg-frag]:transition-transform [&_.lg-frag]:duration-500 group-hover:[&_.lg-frag:nth-child(odd)]:-translate-y-1 group-hover:[&_.lg-frag:nth-child(even)]:translate-x-1" label="" />
          </a>
          <p className="mt-5 text-sm text-sage leading-relaxed max-w-sm">
            {BUSINESS.name} — local diagnosis and repair for televisions, audio,
            monitors and desktops. Check first, explain second, repair third.
          </p>
        </div>

        <nav className="md:col-span-3" aria-label="Footer">
          <p className="kicker text-sage mb-4">Explore</p>
          <ul className="space-y-2.5">
            {FOOT_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link-draw text-sm text-cream/80 hover:text-cream">{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="kicker text-sage mb-4">Contact</p>
          <ul className="space-y-2.5 text-sm text-cream/80">
            <li>{CONTACT.phone.confirmed ? CONTACT.phone.value : "Phone — to be confirmed"}</li>
            <li>{CONTACT.email.confirmed ? CONTACT.email.value : "Email — to be confirmed"}</li>
            <li>{CONTACT.address.confirmed ? CONTACT.address.value : "Address — to be confirmed"}</li>
            <li>{CONTACT.hours.confirmed ? CONTACT.hours.value : "Hours — to be confirmed"}</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-sage/20">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-6 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-sage">
            © {year} {BUSINESS.name} · All faults welcome
          </p>
          <p className="font-mono text-[0.65rem] tracking-wide text-sage/70 max-w-md">
            Business registration, warranty terms and pickup options are published once
            confirmed by the owner.
          </p>
          <button type="button" onClick={toTop} className="group flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-sage hover:text-cream transition-colors">
            Back to top
            <span className="w-8 h-8 rounded-full border border-sage/40 flex items-center justify-center group-hover:-translate-y-1 group-hover:border-cream transition-all">
              <ArrowUp size={14} aria-hidden="true" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
