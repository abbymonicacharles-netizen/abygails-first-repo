type ButterflyVariant = "monarch" | "swallowtail" | "morpho";

const gradients: Record<ButterflyVariant, { id: string; stops: [string, string, string, string] }> = {
  monarch: {
    id: "holo-monarch",
    stops: ["#ffe4f1", "#f472b6", "#e85d8a", "#c4b5fd"],
  },
  swallowtail: {
    id: "holo-swallowtail",
    stops: ["#fce7f3", "#fb7185", "#f4729a", "#a5f3fc"],
  },
  morpho: {
    id: "holo-morpho",
    stops: ["#fff1f8", "#f9a8d4", "#e85d8a", "#ddd6fe"],
  },
};

function ButterflySvg({ variant }: { variant: ButterflyVariant }) {
  const gradient = gradients[variant];

  return (
    <svg viewBox="0 0 120 100" className="hologram-butterfly-svg" aria-hidden>
      <defs>
        <linearGradient id={gradient.id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gradient.stops[0]} />
          <stop offset="35%" stopColor={gradient.stops[1]} />
          <stop offset="68%" stopColor={gradient.stops[2]} />
          <stop offset="100%" stopColor={gradient.stops[3]} />
        </linearGradient>
      </defs>

      <g transform="translate(60 50)">
        <g className="hologram-wing-side hologram-wing-left">
          {variant === "monarch" && (
            <>
              <path
                d="M0 -2 C-18 -24 -48 -30 -54 -10 C-58 4 -46 18 -28 22 C-14 25 -2 14 0 -2Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill"
              />
              <path
                d="M0 4 C-12 8 -34 14 -36 28 C-37 38 -24 40 -12 32 C-4 26 0 16 0 4Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill hologram-wing-hind"
              />
              <path
                d="M-8 -8 C-28 -18 -42 -8 M-6 10 C-22 18 -30 28"
                fill="none"
                className="hologram-vein"
              />
            </>
          )}
          {variant === "swallowtail" && (
            <>
              <path
                d="M0 -4 C-16 -28 -50 -34 -56 -8 C-60 8 -42 24 -22 26 C-10 27 0 12 0 -4Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill"
              />
              <path
                d="M0 6 C-14 12 -32 18 -34 34 C-36 48 -28 58 -18 62 C-10 64 -4 48 0 6Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill hologram-wing-hind"
              />
              <path
                d="M-18 58 L-28 78 M-10 54 L-14 74"
                fill="none"
                className="hologram-vein"
              />
            </>
          )}
          {variant === "morpho" && (
            <>
              <path
                d="M0 -2 C-22 -30 -58 -28 -60 -4 C-62 16 -40 30 -18 28 C-6 27 0 14 0 -2Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill"
              />
              <path
                d="M0 6 C-16 12 -38 20 -40 36 C-42 50 -26 52 -10 40 C-2 34 0 20 0 6Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill hologram-wing-hind"
              />
              <circle cx="-34" cy="-2" r="5" className="hologram-eyespot" />
              <circle cx="-20" cy="22" r="3.5" className="hologram-eyespot" />
            </>
          )}
        </g>

        <g className="hologram-wing-side hologram-wing-right">
          {variant === "monarch" && (
            <>
              <path
                d="M0 -2 C18 -24 48 -30 54 -10 C58 4 46 18 28 22 C14 25 2 14 0 -2Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill"
              />
              <path
                d="M0 4 C12 8 34 14 36 28 C37 38 24 40 12 32 C4 26 0 16 0 4Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill hologram-wing-hind"
              />
              <path
                d="M8 -8 C28 -18 42 -8 M6 10 C22 18 30 28"
                fill="none"
                className="hologram-vein"
              />
            </>
          )}
          {variant === "swallowtail" && (
            <>
              <path
                d="M0 -4 C16 -28 50 -34 56 -8 C60 8 42 24 22 26 C10 27 0 12 0 -4Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill"
              />
              <path
                d="M0 6 C14 12 32 18 34 34 C36 48 28 58 18 62 C10 64 4 48 0 6Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill hologram-wing-hind"
              />
              <path
                d="M18 58 L28 78 M10 54 L14 74"
                fill="none"
                className="hologram-vein"
              />
            </>
          )}
          {variant === "morpho" && (
            <>
              <path
                d="M0 -2 C22 -30 58 -28 60 -4 C62 16 40 30 18 28 C6 27 0 14 0 -2Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill"
              />
              <path
                d="M0 6 C16 12 38 20 40 36 C42 50 26 52 10 40 C2 34 0 20 0 6Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill hologram-wing-hind"
              />
              <circle cx="34" cy="-2" r="5" className="hologram-eyespot" />
              <circle cx="20" cy="22" r="3.5" className="hologram-eyespot" />
            </>
          )}
        </g>

        <g className="hologram-body-group">
          <circle cx="0" cy="-16" r="3.2" className="hologram-head" />
          <path d="M-1.5 -19 C-4 -24 -6 -25 M1.5 -19 C4 -24 6 -25" className="hologram-antenna" />
          <ellipse cx="0" cy="-8" rx="3.8" ry="5" className="hologram-thorax" />
          <path
            d="M0 -3 C-2 4 -2.5 12 -2 20 C-1.5 28 0 32 0 32 C0 32 1.5 28 2 20 C2.5 12 2 4 0 -3Z"
            className="hologram-abdomen"
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
        <ButterflySvg variant="monarch" />
      </div>
      <div className="hologram-butterfly hologram-butterfly-2">
        <ButterflySvg variant="swallowtail" />
      </div>
      <div className="hologram-butterfly hologram-butterfly-3">
        <ButterflySvg variant="morpho" />
      </div>
    </div>
  );
}
