import { cn } from "../utils/cn";

/* Single source of truth for the Koshal Electronics mark:
 * TV outline (thin black, exactly two legs), open cream screen,
 * black K with pixel fragments on its left edge, black play
 * triangle, forest-green E. Parts carry classes so the intro
 * ident and hover shimmer can target them. */

const FRAGS: { x: number; y: number; s: number; c: string }[] = [
  { x: 46, y: 40, s: 11, c: "#122056" },
  { x: 31, y: 56, s: 8, c: "#4852C7" },
  { x: 42, y: 70, s: 15, c: "#122056" },
  { x: 27, y: 90, s: 10, c: "#5B65DC" },
  { x: 47, y: 97, s: 8, c: "#4852C7" },
  { x: 35, y: 110, s: 9, c: "#122056" },
  { x: 54, y: 55, s: 6, c: "#7883EA" },
  { x: 24, y: 75, s: 5, c: "#5B65DC" },
];

export function Logo({
  className,
  animated = false,
  label = "Koshal Electronics — home",
}: {
  className?: string;
  animated?: boolean;
  label?: string;
}) {
  return (
    <svg
      viewBox="0 0 260 192"
      className={cn("block", className)}
      role="img"
      aria-label={label}
    >
      {/* TV outline */}
      <rect
        className="lg-tv"
        x="10"
        y="10"
        width="240"
        height="140"
        rx="16"
        fill="none"
        stroke="#122056"
        strokeWidth="8"
      />
      {/* exactly two legs */}
      <path className="lg-leg" d="M84 152 L58 184" stroke="#122056" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path className="lg-leg" d="M176 152 L202 184" stroke="#122056" strokeWidth="8" strokeLinecap="round" fill="none" />

      <g className={cn(animated && "lg-lockgroup")}>
        {/* pixel fragments */}
        {FRAGS.map((f, i) => (
          <rect
            key={i}
            className="lg-frag"
            style={{ "--i": i } as React.CSSProperties}
            x={f.x}
            y={f.y}
            width={f.s}
            height={f.s}
            fill={f.c}
          />
        ))}

        {/* K */}
        <g className="lg-k" stroke="#122056" strokeWidth="17" strokeLinecap="butt">
          <path d="M74 44 V 118" />
          <path d="M75 85 L 137 44" />
          <path d="M75 79 L 137 118" />
        </g>

        {/* play triangle */}
        <path
          className="lg-play"
          d="M153 61 L 153 103 L 187 82 Z"
          fill="#122056"
          stroke="#122056"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* E */}
        <g className="lg-e" fill="#5B65DC">
          <rect x="196" y="42" width="10" height="76" />
          <polygon points="196,42 243,42 235,58 196,58" />
          <rect x="196" y="73" width="34" height="16" />
          <polygon points="196,104 235,104 243,118 196,118" />
        </g>
      </g>
    </svg>
  );
}
