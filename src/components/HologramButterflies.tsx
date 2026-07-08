function ButterflyClassic() {
  return (
    <svg viewBox="0 0 100 80" className="hologram-butterfly-svg" aria-hidden>
      <defs>
        <linearGradient id="holo-pink-a" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd6ec" />
          <stop offset="35%" stopColor="#f472b6" />
          <stop offset="65%" stopColor="#e85d8a" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
      </defs>
      <g className="hologram-wing hologram-wing-left">
        <path
          d="M50 40 C35 28 8 18 6 38 C4 52 22 58 50 40Z"
          fill="url(#holo-pink-a)"
          className="hologram-wing-fill"
        />
      </g>
      <g className="hologram-wing hologram-wing-right">
        <path
          d="M50 40 C65 28 92 18 94 38 C96 52 78 58 50 40Z"
          fill="url(#holo-pink-a)"
          className="hologram-wing-fill"
        />
      </g>
      <ellipse cx="50" cy="40" rx="3" ry="14" className="hologram-body" />
    </svg>
  );
}

function ButterflyAngular() {
  return (
    <svg viewBox="0 0 100 80" className="hologram-butterfly-svg" aria-hidden>
      <defs>
        <linearGradient id="holo-pink-b" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbcfe8" />
          <stop offset="40%" stopColor="#fb7185" />
          <stop offset="70%" stopColor="#f4729a" />
          <stop offset="100%" stopColor="#a5f3fc" />
        </linearGradient>
      </defs>
      <g className="hologram-wing hologram-wing-left">
        <path
          d="M48 42 L18 12 L28 48 L10 62 L48 42Z"
          fill="url(#holo-pink-b)"
          className="hologram-wing-fill"
        />
      </g>
      <g className="hologram-wing hologram-wing-right">
        <path
          d="M52 42 L82 12 L72 48 L90 62 L52 42Z"
          fill="url(#holo-pink-b)"
          className="hologram-wing-fill"
        />
      </g>
      <rect x="47" y="28" width="6" height="24" rx="3" className="hologram-body" />
    </svg>
  );
}

function ButterflySwallowtail() {
  return (
    <svg viewBox="0 0 100 90" className="hologram-butterfly-svg" aria-hidden>
      <defs>
        <linearGradient id="holo-pink-c" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#fce7f3" />
          <stop offset="30%" stopColor="#f9a8d4" />
          <stop offset="60%" stopColor="#e85d8a" />
          <stop offset="100%" stopColor="#ddd6fe" />
        </linearGradient>
      </defs>
      <g className="hologram-wing hologram-wing-left">
        <path
          d="M50 38 C30 22 10 30 12 48 C14 58 28 54 50 38Z"
          fill="url(#holo-pink-c)"
          className="hologram-wing-fill"
        />
        <path
          d="M50 38 L22 72 L34 52 Z"
          fill="url(#holo-pink-c)"
          className="hologram-wing-fill"
          opacity="0.85"
        />
      </g>
      <g className="hologram-wing hologram-wing-right">
        <path
          d="M50 38 C70 22 90 30 88 48 C86 58 72 54 50 38Z"
          fill="url(#holo-pink-c)"
          className="hologram-wing-fill"
        />
        <path
          d="M50 38 L78 72 L66 52 Z"
          fill="url(#holo-pink-c)"
          className="hologram-wing-fill"
          opacity="0.85"
        />
      </g>
      <ellipse cx="50" cy="38" rx="2.5" ry="16" className="hologram-body" />
    </svg>
  );
}

export function HologramButterflies({ className = "aspect-square w-full" }: { className?: string }) {
  return (
    <div className={`hologram-butterflies ${className}`} aria-hidden>
      <div className="hologram-butterfly hologram-butterfly-1">
        <ButterflyClassic />
      </div>
      <div className="hologram-butterfly hologram-butterfly-2">
        <ButterflyAngular />
      </div>
      <div className="hologram-butterfly hologram-butterfly-3">
        <ButterflySwallowtail />
      </div>
    </div>
  );
}
