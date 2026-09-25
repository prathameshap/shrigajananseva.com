/**
 * Decorative artwork, drawn as inline SVG.
 *
 * The hero used to reach for `/images/utsav-shrine.jpg` and a portrait that
 * were never in the repository, so it rendered as a blank dark band. Vector
 * art is the better answer for this site regardless: it costs nothing on a
 * cellular connection, it recolours itself with the theme, and it does not
 * depend on the trustees supplying a photograph before the page looks finished.
 *
 * Nothing here depicts Maharaj. The motifs are the ones actually present at
 * the centre — the torana above the murti, the marigold garland, the lamps and
 * the lotus.
 *
 * All of it is `aria-hidden`: none of it carries meaning a reader needs.
 */

import { cx } from "@/components/ui";

/* ------------------------------------------------------------ torana arch */

/**
 * The arch over the murti, with garland and hanging leaves.
 *
 * Sized to be dropped in at any width; the viewBox does the work.
 */
export function ToranaArch({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 120"
      className={cx("w-full", className)}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="sgs-torana-gold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-gold-600)" />
          <stop offset="50%" stopColor="var(--color-marigold-300)" />
          <stop offset="100%" stopColor="var(--color-gold-600)" />
        </linearGradient>
      </defs>

      {/* The swag itself */}
      <path
        d="M0 8 Q 200 96 400 8"
        fill="none"
        stroke="url(#sgs-torana-gold)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Marigolds threaded along it, densest at the low point */}
      {Array.from({ length: 21 }, (_, i) => {
        const t = i / 20;
        const x = t * 400;
        // Quadratic Bézier through (0,8) (200,96) (400,8)
        const y = (1 - t) * (1 - t) * 8 + 2 * (1 - t) * t * 96 + t * t * 8;
        const r = 3.2 + Math.sin(t * Math.PI) * 2.6;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={i % 2 === 0 ? "var(--color-marigold-400)" : "var(--color-saffron-500)"}
          />
        );
      })}

      {/* Mango leaves hanging from the garland */}
      {Array.from({ length: 7 }, (_, i) => {
        const t = 0.14 + (i / 6) * 0.72;
        const x = t * 400;
        const y = (1 - t) * (1 - t) * 8 + 2 * (1 - t) * t * 96 + t * t * 8;
        const len = 14 + Math.sin(t * Math.PI) * 10;
        return (
          <path
            key={i}
            d={`M${x} ${y} q 6 ${len * 0.6} 0 ${len} q -6 ${-len * 0.4} 0 ${-len}`}
            fill="var(--color-tulsi-500)"
            opacity="0.85"
          />
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------ shrine niche */

/**
 * The hero centrepiece: an arched niche with a torana, two lit lamps and a
 * lotus, framing whatever is placed inside it.
 *
 * `children` renders in the middle of the arch — the mantra, on the home page.
 */
export function ShrineNiche({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("relative isolate", className)}>
      <svg
        viewBox="0 0 320 420"
        className="h-auto w-full"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="sgs-niche-fill" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="var(--color-night-700)" />
            <stop offset="55%" stopColor="var(--color-night-800)" />
            <stop offset="100%" stopColor="var(--color-night-950)" />
          </linearGradient>
          <linearGradient id="sgs-niche-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-gold-300)" />
            <stop offset="45%" stopColor="var(--color-gold-500)" />
            <stop offset="100%" stopColor="var(--color-gold-300)" />
          </linearGradient>
          <radialGradient id="sgs-niche-glow" cx="0.5" cy="0.38" r="0.5">
            <stop offset="0%" stopColor="var(--color-marigold-300)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-marigold-300)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sgs-flame" cx="0.5" cy="0.7" r="0.6">
            <stop offset="0%" stopColor="#fff6d8" />
            <stop offset="45%" stopColor="var(--color-marigold-300)" />
            <stop offset="100%" stopColor="var(--color-saffron-500)" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* Niche body — a shikhara-ish pointed arch on a plinth */}
        <path
          d="M40 400 L40 170 Q40 40 160 24 Q280 40 280 170 L280 400 Z"
          fill="url(#sgs-niche-fill)"
          stroke="url(#sgs-niche-edge)"
          strokeWidth="3"
        />

        {/* Inner glow, where the murti would stand */}
        <ellipse cx="160" cy="215" rx="118" ry="150" fill="url(#sgs-niche-glow)" />

        {/* Concentric arch mouldings */}
        {[18, 34].map((inset) => (
          <path
            key={inset}
            d={`M${40 + inset} 400 L${40 + inset} ${170 + inset * 0.4} Q${40 + inset} ${
              46 + inset
            } 160 ${30 + inset} Q${280 - inset} ${46 + inset} ${280 - inset} ${
              170 + inset * 0.4
            } L${280 - inset} 400`}
            fill="none"
            stroke="var(--color-gold-500)"
            strokeWidth="1"
            opacity={inset === 18 ? 0.55 : 0.3}
          />
        ))}

        {/* Kalash finial */}
        <g fill="url(#sgs-niche-edge)">
          <path d="M160 6 L165 17 L155 17 Z" />
          <circle cx="160" cy="19" r="5.5" />
        </g>

        {/* Torana swag inside the arch */}
        <path
          d="M64 132 Q160 196 256 132"
          fill="none"
          stroke="var(--color-gold-500)"
          strokeWidth="2"
        />
        {Array.from({ length: 13 }, (_, i) => {
          const t = i / 12;
          const x = 64 + t * 192;
          const y = (1 - t) * (1 - t) * 132 + 2 * (1 - t) * t * 196 + t * t * 132;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={2.4 + Math.sin(t * Math.PI) * 1.8}
              fill={i % 2 === 0 ? "var(--color-marigold-400)" : "var(--color-saffron-400)"}
            />
          );
        })}

        {/* Two samai lamps on the plinth */}
        {[96, 224].map((x) => (
          <g key={x}>
            <path
              d={`M${x - 14} 372 L${x + 14} 372 L${x + 8} 362 L${x - 8} 362 Z`}
              fill="var(--color-gold-500)"
            />
            <rect x={x - 2} y={336} width="4" height="26" fill="var(--color-gold-600)" />
            <path
              d={`M${x - 11} 336 q 11 -9 22 0 q -11 6 -22 0 Z`}
              fill="var(--color-gold-400)"
            />
            <ellipse
              cx={x}
              cy={324}
              rx="9"
              ry="14"
              fill="url(#sgs-flame)"
              className="animate-shimmer"
            />
          </g>
        ))}

        {/* Lotus at the centre of the plinth */}
        <g transform="translate(160 384)">
          {[-58, -36, -16, 0, 16, 36, 58].map((angle, i) => (
            <ellipse
              key={angle}
              cx="0"
              cy="-9"
              rx="7"
              ry="15"
              transform={`rotate(${angle})`}
              fill={i % 2 === 0 ? "var(--color-kumkum-300)" : "var(--color-kumkum-200)"}
              opacity="0.9"
            />
          ))}
          <circle cx="0" cy="-4" r="5" fill="var(--color-marigold-300)" />
        </g>
      </svg>

      {children ? (
        <div className="absolute inset-x-[14%] top-[26%] bottom-[34%] grid place-items-center text-center">
          {children}
        </div>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------- lotus mark */

export function LotusMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cx("h-8 w-8", className)}
      aria-hidden="true"
      focusable="false"
    >
      <g transform="translate(32 46)" fill="currentColor">
        {[-66, -44, -22, 0, 22, 44, 66].map((angle, i) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-13"
            rx="7"
            ry="19"
            transform={`rotate(${angle})`}
            opacity={i % 2 === 0 ? 0.95 : 0.6}
          />
        ))}
      </g>
      <circle cx="32" cy="40" r="5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

/* ------------------------------------------------------------- separators */

/** A row of petals, for the seam between two bands of different colour. */
export function PetalDivider({
  className,
  tone = "gold",
}: {
  className?: string;
  tone?: "gold" | "kumkum";
}) {
  const fill = tone === "gold" ? "var(--color-gold-400)" : "var(--color-kumkum-400)";
  return (
    <svg
      viewBox="0 0 240 12"
      className={cx("h-3 w-full", className)}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: 24 }, (_, i) => (
        <path
          key={i}
          d={`M${i * 10} 0 q 5 8 10 0 z`}
          fill={fill}
          opacity={i % 2 === 0 ? 0.75 : 0.4}
        />
      ))}
    </svg>
  );
}

/**
 * A faint mandala, positioned absolutely behind a band of flat colour.
 *
 * Pure decoration: it exists because a 400px-tall block of one colour is what
 * made this site read as flat, and one barely-visible pattern fixes it without
 * costing a request or hurting contrast.
 */
export function MandalaField({
  className,
  rings = 7,
  petals = 16,
}: {
  className?: string;
  rings?: number;
  petals?: number;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={cx("pointer-events-none absolute", className)}
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="0.4"
        transform="translate(100 100)"
      >
        {Array.from({ length: rings }, (_, i) => (
          <circle key={i} r={12 + i * 12} opacity={0.55 - i * 0.045} />
        ))}
        {Array.from({ length: petals }, (_, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-58"
            rx="11"
            ry="30"
            transform={`rotate(${(360 / petals) * i})`}
            opacity="0.3"
          />
        ))}
      </g>
    </svg>
  );
}
