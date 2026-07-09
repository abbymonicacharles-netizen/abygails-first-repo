type ButterflyVariant = "monarch" | "swallowtail" | "morpho";

const beamGradients: Record<
  ButterflyVariant,
  { id: string; x1: number; y1: number; x2: number; y2: number }
> = {
  monarch: { id: "holo-beam-monarch", x1: 18, y1: 8, x2: 102, y2: 92 },
  swallowtail: { id: "holo-beam-swallowtail", x1: 104, y1: 10, x2: 16, y2: 94 },
  morpho: { id: "holo-beam-morpho", x1: 60, y1: 0, x2: 60, y2: 100 },
};

function ButterflySvg({ variant }: { variant: ButterflyVariant }) {
  const beam = beamGradients[variant];
  const fill = `url(#${beam.id})`;

  return (
    <svg viewBox="0 0 120 100" className="hologram-butterfly-svg" aria-hidden>
      <defs>
        <linearGradient
          id={beam.id}
          gradientUnits="userSpaceOnUse"
          x1={beam.x1}
          y1={beam.y1}
          x2={beam.x2}
          y2={beam.y2}
        >
          <stop offset="0%" stopColor="#fff7fc" />
          <stop offset="28%" stopColor="#fbcfe8" />
          <stop offset="52%" stopColor="#f472b6" />
          <stop offset="78%" stopColor="#e85d8a" />
          <stop offset="100%" stopColor="#f5d0fe" />
        </linearGradient>
      </defs>

      <g className="hologram-butterfly-figure" transform="translate(60 48)">
        <g className="hologram-wing-side hologram-wing-left">
          {variant === "monarch" && (
            <>
              <path
                d="M0 0 L-10 -30 L-38 -42 L-56 -18 L-52 2 L-34 20 L-10 10 Z"
                fill={fill}
                className="hologram-beam-fill"
              />
              <path
                d="M0 2 L-8 8 L-30 16 L-38 32 L-32 44 L-16 38 L-4 22 Z"
                fill={fill}
                className="hologram-beam-fill"
              />
            </>
          )}
          {variant === "swallowtail" && (
            <>
              <path
                d="M0 0 L-12 -34 L-44 -46 L-60 -14 L-50 10 L-28 24 L-8 12 Z"
                fill={fill}
                className="hologram-beam-fill"
              />
              <path
                d="M0 4 L-10 12 L-28 20 L-32 38 L-24 52 L-14 58 L-6 40 Z"
                fill={fill}
                className="hologram-beam-fill"
              />
              <path d="M-14 56 L-22 78 L-18 58 Z" fill={fill} className="hologram-beam-fill" />
              <path d="M-8 50 L-10 72 L-6 52 Z" fill={fill} className="hologram-beam-fill" />
            </>
          )}
          {variant === "morpho" && (
            <>
              <path
                d="M0 0 L-14 -32 L-46 -40 L-62 -10 L-54 14 L-30 26 L-8 12 Z"
                fill={fill}
                className="hologram-beam-fill"
              />
              <path
                d="M0 4 L-12 12 L-34 22 L-40 40 L-28 48 L-12 36 L-2 20 Z"
                fill={fill}
                className="hologram-beam-fill"
              />
            </>
          )}
        </g>

        <g className="hologram-wing-side hologram-wing-right">
          {variant === "monarch" && (
            <>
              <path
                d="M0 0 L10 -30 L38 -42 L56 -18 L52 2 L34 20 L10 10 Z"
                fill={fill}
                className="hologram-beam-fill"
              />
              <path
                d="M0 2 L8 8 L30 16 L38 32 L32 44 L16 38 L4 22 Z"
                fill={fill}
                className="hologram-beam-fill"
              />
            </>
          )}
          {variant === "swallowtail" && (
            <>
              <path
                d="M0 0 L12 -34 L44 -46 L60 -14 L50 10 L28 24 L8 12 Z"
                fill={fill}
                className="hologram-beam-fill"
              />
              <path
                d="M0 4 L10 12 L28 20 L32 38 L24 52 L14 58 L6 40 Z"
                fill={fill}
                className="hologram-beam-fill"
              />
              <path d="M14 56 L22 78 L18 58 Z" fill={fill} className="hologram-beam-fill" />
              <path d="M8 50 L10 72 L6 52 Z" fill={fill} className="hologram-beam-fill" />
            </>
          )}
          {variant === "morpho" && (
            <>
              <path
                d="M0 0 L14 -32 L46 -40 L62 -10 L54 14 L30 26 L8 12 Z"
                fill={fill}
                className="hologram-beam-fill"
              />
              <path
                d="M0 4 L12 12 L34 22 L40 40 L28 48 L12 36 L2 20 Z"
                fill={fill}
                className="hologram-beam-fill"
              />
            </>
          )}
        </g>

        <g className="hologram-body-group">
          <circle cx="0" cy="-14" r="2.8" fill={fill} className="hologram-beam-fill" />
          <path
            d="M-1.2 -17 L-3.5 -22 M1.2 -17 L3.5 -22"
            fill="none"
            stroke={fill}
            strokeWidth="1"
            className="hologram-beam-stroke"
          />
          <ellipse cx="0" cy="-6" rx="3.2" ry="4.8" fill={fill} className="hologram-beam-fill" />
          <path
            d="M0 -1 C-1.8 6 -2.2 14 -1.8 22 C-1.4 30 0 34 0 34 C0 34 1.4 30 1.8 22 C2.2 14 1.8 6 0 -1Z"
            fill={fill}
            className="hologram-beam-fill"
          />
        </g>
      </g>
    </svg>
  );
}

export function HologramButterflies({ className = "aspect-square w-full" }: { className?: string }) {
  return (
    <div className={`hologram-butterflies ${className}`} aria-hidden>
      <div className="hologram-butterfly hologram-butterfly-1">
        <div className="hologram-butterfly-glow">
          <ButterflySvg variant="monarch" />
        </div>
      </div>
      <div className="hologram-butterfly hologram-butterfly-2">
        <div className="hologram-butterfly-glow">
          <ButterflySvg variant="swallowtail" />
        </div>
      </div>
      <div className="hologram-butterfly hologram-butterfly-3">
        <div className="hologram-butterfly-glow">
          <ButterflySvg variant="morpho" />
        </div>
      </div>
    </div>
  );
}
