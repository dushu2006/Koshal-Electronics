import { Camera, MessageSquareQuote } from "lucide-react";
import { GALLERY } from "../config";
import { Reveal, SectionHead } from "../components/ui";

function TileArt({ kind }: { kind: string }) {
  const stroke = "#EEEFFD";
  const common = { fill: "none", stroke, strokeWidth: 3, strokeLinecap: "round" as const };
  switch (kind) {
    case "bench":
      return (
        <g {...common}>
          <path d="M20 90h120" />
          <path d="M35 90V60h30v30M95 90V50h25v40" />
          <path d="M42 70h16M102 62h11M102 74h11" strokeWidth="2" />
          <circle cx="130" cy="40" r="6" />
        </g>
      );
    case "board":
      return (
        <g {...common}>
          <rect x="25" y="35" width="110" height="60" rx="4" />
          <path d="M40 50h20v15h25M100 80v-20h20" strokeWidth="2" />
          <circle cx="45" cy="78" r="4" /><circle cx="115" cy="48" r="4" />
        </g>
      );
    case "strip":
      return (
        <g {...common}>
          <rect x="25" y="55" width="110" height="18" rx="9" />
          {[42, 62, 82, 102, 122].map((x) => <circle key={x} cx={x} cy="64" r="4" strokeWidth="2" />)}
          <path d="M60 40l-6-8M90 40l6-8" strokeWidth="2" />
        </g>
      );
    case "wave":
      return (
        <g {...common}>
          <path d="M22 65q10-25 20 0t20 0 20 0 20 0 20 0 20 0" />
          <rect x="30" y="85" width="100" height="12" rx="6" strokeWidth="2" />
        </g>
      );
    case "screen":
      return (
        <g {...common}>
          <rect x="30" y="30" width="100" height="60" rx="5" />
          <path d="M80 90v12M65 102h30" />
          <path d="M45 45v30M55 52v16M65 48v24" strokeWidth="2" />
        </g>
      );
    default:
      return (
        <g {...common}>
          <rect x="28" y="32" width="104" height="62" rx="6" />
          <path d="M55 94l-8 12M105 94l8 12" />
          <path d="M62 50v26M62 63l18-13M62 63l18 13" strokeWidth="3" />
          <path d="M92 56v14l11-7z" fill={stroke} strokeWidth="2" strokeLinejoin="round" />
        </g>
      );
  }
}

export function Gallery() {
  return (
    <section id="work" className="py-24 md:py-36 bg-forest-3 text-cream relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 grain opacity-[0.06]" />
      <div className="mx-auto max-w-7xl px-5 md:px-8 relative">
        <SectionHead
          dark
          index="07"
          kicker="From the bench"
          title={
            <>
              The work, <span className="text-mint">as it happens.</span>
            </>
          }
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GALLERY.map((g, i) => (
            <Reveal key={g.label} delay={(i % 3) * 100} variant="scale">
              <figure className="group relative border border-sage/25 rounded-lg overflow-hidden bg-forest/50 aspect-[4/3]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 160 130" className="w-3/4 h-3/4 opacity-70 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105" aria-hidden="true">
                    <TileArt kind={g.kind} />
                  </svg>
                </div>
                {/* sweep */}
                <div aria-hidden="true" className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-cream/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-forest-3/95 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="font-display font-medium text-sm text-cream">{g.label}</p>
                  <p className="dev-tag mt-1.5 inline-block !border-sage/50 !text-sage">Photo to come</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-sage">
          <Camera size={13} aria-hidden="true" />
          Real workshop photography will replace these illustrations once supplied.
        </p>

        {/* reviews — honest empty state */}
        <div className="mt-20 border border-sage/25 rounded-lg p-8 md:p-10 bg-forest/40 flex flex-col md:flex-row items-start md:items-center gap-6">
          <span className="w-12 h-12 rounded-full border border-sage/40 flex items-center justify-center shrink-0">
            <MessageSquareQuote size={20} className="text-mint" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display font-semibold text-xl mb-1.5">Customer reviews</h3>
            <p className="text-sage leading-relaxed max-w-2xl text-sm">
              Verified reviews will be published here with names and sources, once the
              business chooses to share them. Nothing on this page is fabricated — no
              invented ratings, quotes or review counts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
