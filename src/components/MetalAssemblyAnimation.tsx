"use client";

import { useEffect, useState } from "react";

type Phase = "flat" | "building" | "built" | "unbuilding";

const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];

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
      <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <defs>
          <linearGradient id="metalA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8a9199" />
            <stop offset="100%" stopColor="#4a5058" />
          </linearGradient>
          <linearGradient id="metalB" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6d747c" />
            <stop offset="100%" stopColor="#3a4046" />
          </linearGradient>
          <linearGradient id="petalFill" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#7a828a" />
            <stop offset="60%" stopColor="#9aa3ab" />
            <stop offset="100%" stopColor="#5c646c" />
          </linearGradient>
        </defs>

        {/* Base */}
        <g className="assembly-part assembly-part-base" style={{ "--part-i": 0 } as React.CSSProperties}>
          <ellipse cx="100" cy="272" rx="18" ry="5" fill="#3a4046" opacity="0.35" />
          <rect x="91" y="252" width="18" height="16" rx="2" fill="url(#metalB)" stroke="#2e3338" strokeWidth="0.8" />
        </g>

        {/* Stem */}
        <g className="assembly-part assembly-part-stem" style={{ "--part-i": 1 } as React.CSSProperties}>
          <path
            d="M100 252 L100 185"
            stroke="url(#metalA)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* Lily leaves */}
        <g className="assembly-part assembly-part-leaf-1" style={{ "--part-i": 2 } as React.CSSProperties}>
          <path
            d="M100 218 C118 212 132 200 134 182 C128 178 112 188 100 202 Z"
            fill="url(#metalB)"
            stroke="#3a4046"
            strokeWidth="0.7"
          />
          <path d="M104 205 Q118 198 126 186" stroke="#4a5058" strokeWidth="0.4" fill="none" />
        </g>
        <g className="assembly-part assembly-part-leaf-2" style={{ "--part-i": 3 } as React.CSSProperties}>
          <path
            d="M100 195 C78 188 66 175 64 158 C72 154 88 164 100 178 Z"
            fill="url(#metalA)"
            stroke="#3a4046"
            strokeWidth="0.7"
          />
          <path d="M96 182 Q82 172 70 162" stroke="#4a5058" strokeWidth="0.4" fill="none" />
        </g>

        {/* Pistil */}
        <g className="assembly-part assembly-part-pistil" style={{ "--part-i": 4 } as React.CSSProperties}>
          <line x1="100" y1="88" x2="100" y2="68" stroke="url(#metalB)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="64" r="3.5" fill="url(#metalA)" stroke="#3a4046" strokeWidth="0.6" />
        </g>

        {/* Six lily petals */}
        {PETAL_ANGLES.map((angle, i) => (
          <g
            key={angle}
            className={`assembly-part assembly-part-petal assembly-part-petal-${i + 1}`}
            style={{ "--part-i": 5 + i } as React.CSSProperties}
            transform={`rotate(${angle} 100 82)`}
          >
            <path
              d="M100 84 Q108 55 106 32 Q100 22 94 32 Q92 55 100 84 Z"
              fill="url(#petalFill)"
              stroke="#3a4046"
              strokeWidth="0.75"
            />
            <path d="M100 84 L100 28" stroke="#5a6068" strokeWidth="0.35" opacity="0.6" />
          </g>
        ))}

        {/* Stamens */}
        <g className="assembly-part assembly-part-stamen-1" style={{ "--part-i": 11 } as React.CSSProperties}>
          <line x1="100" y1="82" x2="108" y2="58" stroke="url(#metalB)" strokeWidth="1" strokeLinecap="round" />
          <circle cx="109" cy="55" r="2" fill="#9aa2aa" stroke="#3a4046" strokeWidth="0.5" />
        </g>
        <g className="assembly-part assembly-part-stamen-2" style={{ "--part-i": 12 } as React.CSSProperties}>
          <line x1="100" y1="82" x2="92" y2="58" stroke="url(#metalB)" strokeWidth="1" strokeLinecap="round" />
          <circle cx="91" cy="55" r="2" fill="#9aa2aa" stroke="#3a4046" strokeWidth="0.5" />
        </g>
        <g className="assembly-part assembly-part-stamen-3" style={{ "--part-i": 13 } as React.CSSProperties}>
          <line x1="100" y1="82" x2="100" y2="54" stroke="url(#metalB)" strokeWidth="1" strokeLinecap="round" />
          <circle cx="100" cy="52" r="2" fill="#9aa2aa" stroke="#3a4046" strokeWidth="0.5" />
        </g>
      </svg>
    </div>
  );
}
