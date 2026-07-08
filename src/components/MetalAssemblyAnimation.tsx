"use client";

import { useEffect, useState } from "react";

type Phase = "flat" | "building" | "built" | "unbuilding";

export function MetalAssemblyAnimation({ className = "h-64 w-52 sm:h-72 sm:w-56" }: { className?: string }) {
  const [phase, setPhase] = useState<Phase>("flat");

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "flat") {
      timer = setTimeout(() => setPhase("building"), 600);
    } else if (phase === "building") {
      timer = setTimeout(() => setPhase("built"), 3200);
    } else if (phase === "built") {
      timer = setTimeout(() => setPhase("unbuilding"), 40000);
    } else if (phase === "unbuilding") {
      timer = setTimeout(() => setPhase("flat"), 3200);
    }

    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div
      className={`assembly-stage relative ${className}`}
      data-phase={phase}
      aria-hidden
    >
      <svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <linearGradient id="metalA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8a9199" />
            <stop offset="100%" stopColor="#4a5058" />
          </linearGradient>
          <linearGradient id="metalB" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6d747c" />
            <stop offset="100%" stopColor="#3a4046" />
          </linearGradient>
        </defs>

        <g className="assembly-part assembly-part-base" style={{ "--part-i": 0 } as React.CSSProperties}>
          <rect x="88" y="252" width="24" height="18" rx="2" fill="url(#metalB)" stroke="#2e3338" strokeWidth="1" />
          <polygon points="100,244 110,247 110,257 100,260 90,257 90,247" fill="url(#metalA)" stroke="#2e3338" strokeWidth="0.8" />
        </g>

        <g className="assembly-part assembly-part-stem" style={{ "--part-i": 1 } as React.CSSProperties}>
          <path
            d="M100 244 C100 220, 104 185, 108 145 C110 125, 111 105, 110 88"
            stroke="url(#metalA)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        <g className="assembly-part assembly-part-leaf-1" style={{ "--part-i": 2 } as React.CSSProperties}>
          <path d="M108 195 Q125 188 128 200 Q118 206 108 202 Z" fill="url(#metalB)" stroke="#3a4046" strokeWidth="0.7" />
        </g>
        <g className="assembly-part assembly-part-leaf-2" style={{ "--part-i": 3 } as React.CSSProperties}>
          <path d="M109 165 Q128 158 130 172 Q118 178 109 174 Z" fill="url(#metalA)" stroke="#3a4046" strokeWidth="0.7" />
        </g>

        <g className="assembly-part assembly-part-hub" style={{ "--part-i": 4 } as React.CSSProperties}>
          <circle cx="110" cy="82" r="10" fill="url(#metalB)" stroke="#2e3338" strokeWidth="1" />
          <circle cx="110" cy="82" r="4" fill="#9aa2aa" />
        </g>

        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <g
            key={angle}
            className={`assembly-part assembly-part-petal assembly-part-petal-${i + 1}`}
            style={{ "--part-i": 5 + i } as React.CSSProperties}
            transform={`rotate(${angle} 110 82)`}
          >
            <polygon
              points="110,52 118,68 118,78 110,82 102,78 102,68"
              fill="url(#metalA)"
              stroke="#3a4046"
              strokeWidth="0.8"
            />
            <circle cx="110" cy="64" r="2.5" fill="none" stroke="#5a6068" strokeWidth="0.5" />
          </g>
        ))}

        <g className="assembly-part assembly-part-screw-1" style={{ "--part-i": 11 } as React.CSSProperties}>
          <rect x="107" y="76" width="6" height="14" rx="1" fill="url(#metalB)" stroke="#2e3338" strokeWidth="0.6" />
          <rect x="106" y="74" width="8" height="3" rx="0.5" fill="#5a6068" />
        </g>
        <g className="assembly-part assembly-part-screw-2" style={{ "--part-i": 12 } as React.CSSProperties}>
          <circle cx="110" cy="88" r="3" fill="url(#metalA)" stroke="#3a4046" strokeWidth="0.6" />
        </g>
      </svg>
    </div>
  );
}
