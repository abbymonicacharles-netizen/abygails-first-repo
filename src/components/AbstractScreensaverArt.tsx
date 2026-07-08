export function AbstractScreensaverArt({ className = "aspect-square w-full max-w-[320px]" }: { className?: string }) {
  return (
    <div className={`modern-cubist-art relative overflow-hidden ${className}`} aria-hidden>
      <svg
        viewBox="0 0 400 400"
        className="modern-cubist-svg h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="400" height="400" className="cubist-bg" />

        <g className="cubist-layer cubist-layer-back">
          <polygon points="0,120 140,0 260,80 180,200" className="cubist-plane cubist-plane-a" />
          <polygon points="260,80 400,40 400,180 300,220" className="cubist-plane cubist-plane-b" />
          <polygon points="0,280 120,200 200,320 40,400" className="cubist-plane cubist-plane-c" />
        </g>

        <g className="cubist-layer cubist-layer-mid">
          <polygon points="90,90 210,60 250,170 130,210" className="cubist-plane cubist-plane-d" />
          <polygon points="210,60 330,100 290,220 250,170" className="cubist-plane cubist-plane-e" />
          <polygon points="130,210 250,170 270,290 150,310" className="cubist-plane cubist-plane-f" />
          <polygon points="250,170 290,220 360,280 270,290" className="cubist-plane cubist-plane-g" />
        </g>

        <g className="cubist-layer cubist-layer-face">
          <polygon points="155,125 235,105 255,185 175,205" className="cubist-plane cubist-plane-face-a" />
          <polygon points="235,105 305,135 275,205 255,185" className="cubist-plane cubist-plane-face-b" />
          <polygon points="175,205 255,185 245,265 165,255" className="cubist-plane cubist-plane-face-c" />
          <polygon points="255,185 275,205 295,255 245,265" className="cubist-plane cubist-plane-face-d" />
          <ellipse cx="205" cy="168" rx="11" ry="14" className="cubist-eye cubist-eye-left" />
          <ellipse cx="268" cy="178" rx="9" ry="12" className="cubist-eye cubist-eye-right" />
          <path d="M188 228 Q220 248 252 232" className="cubist-mouth" />
          <path d="M175 145 L255 125" className="cubist-line" />
          <path d="M165 255 L295 245" className="cubist-line" />
        </g>

        <g className="cubist-layer cubist-layer-front">
          <polygon points="40,40 110,20 95,95 25,110" className="cubist-plane cubist-plane-h" />
          <polygon points="300,300 380,260 400,360 320,390" className="cubist-plane cubist-plane-i" />
          <circle cx="88" cy="310" r="28" className="cubist-accent-ring" />
          <rect x="318" y="48" width="52" height="72" transform="rotate(18 344 84)" className="cubist-accent-block" />
        </g>
      </svg>
    </div>
  );
}
