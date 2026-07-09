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

      <g className="hologram-butterfly-figure" transform="translate(60 48)">
        <g className="hologram-wing-side hologram-wing-left">
          {variant === "monarch" && (
            <>
              <path
                d="M0 0 C-18 -22 -48 -28 -54 -8 C-58 6 -46 20 -28 24 C-14 27 -2 16 0 0Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill"
              />
              <path
                d="M0 2 C-12 6 -34 12 -36 26 C-37 36 -24 38 -12 30 C-4 24 0 14 0 2Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill"
              />
              <path
                d="M-8 -6 C-28 -16 -42 -6 M-6 12 C-22 20 -30 30"
                fill="none"
                className="hologram-vein"
              />
            </>
          )}
          {variant === "swallowtail" && (
            <>
              <path
                d="M0 0 C-16 -26 -50 -32 -56 -6 C-60 10 -42 26 -22 28 C-10 29 0 14 0 0Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill"
              />
              <path
                d="M0 4 C-14 10 -32 16 -34 32 C-36 46 -28 56 -18 60 C-10 62 -4 46 0 4Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill"
              />
              <path
                d="M-18 56 L-28 76 M-10 52 L-14 72"
                fill="none"
                className="hologram-vein"
              />
            </>
          )}
          {variant === "morpho" && (
            <>
              <path
                d="M0 0 C-22 -28 -58 -26 -60 -2 C-62 18 -40 32 -18 30 C-6 29 0 16 0 0Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill"
              />
              <path
                d="M0 4 C-16 10 -38 18 -40 34 C-42 48 -26 50 -10 38 C-2 32 0 18 0 4Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill"
              />
              <circle cx="-34" cy="0" r="5" className="hologram-eyespot" />
              <circle cx="-20" cy="24" r="3.5" className="hologram-eyespot" />
            </>
          )}
        </g>

        <g className="hologram-wing-side hologram-wing-right">
          {variant === "monarch" && (
            <>
              <path
                d="M0 0 C18 -22 48 -28 54 -8 C58 6 46 20 28 24 C14 27 2 16 0 0Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill"
              />
              <path
                d="M0 2 C12 6 34 12 36 26 C37 36 24 38 12 30 C4 24 0 14 0 2Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill"
              />
              <path
                d="M8 -6 C28 -16 42 -6 M6 12 C22 20 30 30"
                fill="none"
                className="hologram-vein"
              />
            </>
          )}
          {variant === "swallowtail" && (
            <>
              <path
                d="M0 0 C16 -26 50 -32 56 -6 C60 10 42 26 22 28 C10 29 0 14 0 0Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill"
              />
              <path
                d="M0 4 C14 10 32 16 34 32 C36 46 28 56 18 60 C10 62 4 46 0 4Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill"
              />
              <path
                d="M18 56 L28 76 M10 52 L14 72"
                fill="none"
                className="hologram-vein"
              />
            </>
          )}
          {variant === "morpho" && (
            <>
              <path
                d="M0 0 C22 -28 58 -26 60 -2 C62 18 40 32 18 30 C6 29 0 16 0 0Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill"
              />
              <path
                d="M0 4 C16 10 38 18 40 34 C42 48 26 50 10 38 C2 32 0 18 0 4Z"
                fill={`url(#${gradient.id})`}
                className="hologram-wing-fill"
              />
              <circle cx="34" cy="0" r="5" className="hologram-eyespot" />
              <circle cx="20" cy="24" r="3.5" className="hologram-eyespot" />
            </>
          )}
        </g>

        <g className="hologram-body-group">
          <circle cx="0" cy="-14" r="3.2" className="hologram-head" />
          <path d="M-1.5 -17 C-4 -22 -6 -23 M1.5 -17 C4 -22 6 -23" className="hologram-antenna" />
          <ellipse cx="0" cy="-6" rx="3.8" ry="5" className="hologram-thorax" />
          <path
            d="M0 -1 C-2 6 -2.5 14 -2 22 C-1.5 30 0 34 0 34 C0 34 1.5 30 2 22 C2.5 14 2 6 0 -1Z"
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
