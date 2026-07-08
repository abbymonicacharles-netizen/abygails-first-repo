export function MechanicalFlower({ className = "h-64 w-52 sm:h-72 sm:w-56" }: { className?: string }) {
  return (
    <div className={`mechanical-flower-stage relative ${className}`} aria-hidden>
      <div className="mechanical-flower-spin h-full w-full">
        <svg
          viewBox="0 0 200 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
        <defs>
          <linearGradient id="metalLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eef1f4" />
            <stop offset="50%" stopColor="#a8b0b8" />
            <stop offset="100%" stopColor="#6b7580" />
          </linearGradient>
          <linearGradient id="metalMid" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8a939c" />
            <stop offset="50%" stopColor="#d5dbe1" />
            <stop offset="100%" stopColor="#5a636d" />
          </linearGradient>
          <linearGradient id="metalDark" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#4f5861" />
            <stop offset="50%" stopColor="#c2c9d0" />
            <stop offset="100%" stopColor="#3f464e" />
          </linearGradient>
          <linearGradient id="threadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#b8c0c8" />
            <stop offset="100%" stopColor="#7a848e" />
          </linearGradient>
        </defs>

        {/* Base — bolt head + hex nut */}
        <ellipse cx="100" cy="282" rx="22" ry="7" fill="#4a535c" opacity="0.35" />
        <rect x="88" y="258" width="24" height="22" rx="2" fill="url(#metalDark)" stroke="#3f464e" strokeWidth="1" />
        <polygon
          points="100,248 112,252 112,264 100,268 88,264 88,252"
          fill="url(#metalMid)"
          stroke="#3f464e"
          strokeWidth="1"
        />
        <circle cx="100" cy="256" r="4" fill="url(#metalLight)" stroke="#5a636d" strokeWidth="0.6" />

        {/* Stem — starts centred, curves slightly right */}
        <path
          d="M100 248 C100 230, 102 210, 108 188 C112 172, 114 148, 112 118"
          stroke="url(#threadGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Thread ridges */}
        {[230, 215, 200, 185, 170, 155, 140, 128].map((y) => (
          <line
            key={`thread-${y}`}
            x1={100 + (y - 230) * 0.04}
            y1={y}
            x2={100 + (y - 230) * 0.04 + 6}
            y2={y}
            stroke="#8a939c"
            strokeWidth="0.6"
            opacity="0.7"
          />
        ))}

        {/* Metal leaves — crescent shapes on stem */}
        <path
          d="M104 205 Q118 200 120 212 Q112 218 104 212 Z"
          fill="url(#metalMid)"
          stroke="#5a636d"
          strokeWidth="0.8"
        />
        <path
          d="M106 175 Q122 170 124 182 Q114 188 106 182 Z"
          fill="url(#metalLight)"
          stroke="#5a636d"
          strokeWidth="0.8"
        />

        {/* Flower head — hex nuts as petals around central bearing */}
        <g transform="translate(112 108)">
          <circle cx="0" cy="0" r="9" fill="url(#metalDark)" stroke="#3f464e" strokeWidth="1" />
          <circle cx="0" cy="0" r="4" fill="url(#metalLight)" />

          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <g key={`petal-${angle}`} transform={`rotate(${angle})`}>
              <polygon
                points="0,-28 7,-14 7,-2 0,4 -7,-2 -7,-14"
                fill="url(#metalMid)"
                stroke="#4a535c"
                strokeWidth="0.9"
              />
              <circle cx="0" cy="-16" r="2.2" fill="none" stroke="#6b7580" strokeWidth="0.5" />
            </g>
          ))}

          {/* Outer ring */}
          <circle cx="0" cy="0" r="30" stroke="#e85d8a" strokeWidth="0.8" fill="none" opacity="0.5" strokeDasharray="3 4" />
        </g>

        {/* Connector rod from stem to head */}
        <line x1="112" y1="118" x2="112" y2="108" stroke="url(#threadGrad)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
