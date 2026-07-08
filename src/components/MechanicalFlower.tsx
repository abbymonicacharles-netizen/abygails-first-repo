"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function MechanicalFlower({ className = "h-56 w-48 sm:h-64 sm:w-52" }: { className?: string }) {
  const [rotation, setRotation] = useState(0);
  const [isBursting, setIsBursting] = useState(false);
  const rotationRef = useRef(0);

  const triggerBurst = useCallback(() => {
    rotationRef.current += 1080;
    setRotation(rotationRef.current);
    setIsBursting(true);
  }, []);

  useEffect(() => {
    const initial = setTimeout(triggerBurst, 1200);
    const interval = setInterval(triggerBurst, 4500);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [triggerBurst]);

  useEffect(() => {
    if (!isBursting) return;
    const timer = setTimeout(() => setIsBursting(false), 550);
    return () => clearTimeout(timer);
  }, [isBursting]);

  return (
    <div className={`relative ${className}`} aria-hidden>
      <svg
        viewBox="0 0 200 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="steelLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8edf2" />
            <stop offset="45%" stopColor="#9aa3ad" />
            <stop offset="100%" stopColor="#5c6670" />
          </linearGradient>
          <linearGradient id="steelDark" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7a8490" />
            <stop offset="50%" stopColor="#c5ccd4" />
            <stop offset="100%" stopColor="#4a535c" />
          </linearGradient>
          <linearGradient id="steelEdge" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#6b7580" />
            <stop offset="50%" stopColor="#d8dee5" />
            <stop offset="100%" stopColor="#5a636d" />
          </linearGradient>
          <linearGradient id="stemGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2d4a35" />
            <stop offset="100%" stopColor="#1a2e1f" />
          </linearGradient>
        </defs>

        {/* Stem */}
        <path
          d="M100 168 Q108 210 100 255 Q96 268 100 275"
          stroke="url(#stemGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M100 200 Q78 215 72 232"
          stroke="url(#stemGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M100 215 Q122 228 128 245"
          stroke="url(#stemGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="72" cy="234" rx="9" ry="5" fill="#2d4a35" transform="rotate(-25 72 234)" />
        <ellipse cx="128" cy="247" rx="9" ry="5" fill="#2d4a35" transform="rotate(25 128 247)" />

        {/* Steel rose — continuous clockwise spin */}
        <g transform="translate(100 218)">
          <g className="steel-rose-spin">
            {[0, 72, 144, 216, 288].map((angle) => (
              <ellipse
                key={`rose-outer-${angle}`}
                cx="0"
                cy="-16"
                rx="10"
                ry="18"
                fill="url(#steelLight)"
                stroke="#4a535c"
                strokeWidth="0.8"
                transform={`rotate(${angle})`}
              />
            ))}
            {[36, 108, 180, 252, 324].map((angle) => (
              <ellipse
                key={`rose-mid-${angle}`}
                cx="0"
                cy="-11"
                rx="7"
                ry="13"
                fill="url(#steelDark)"
                stroke="#5c6670"
                strokeWidth="0.6"
                transform={`rotate(${angle})`}
              />
            ))}
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <ellipse
                key={`rose-inner-${angle}`}
                cx="0"
                cy="-6"
                rx="4.5"
                ry="8"
                fill="url(#steelEdge)"
                stroke="#6b7580"
                strokeWidth="0.5"
                transform={`rotate(${angle})`}
              />
            ))}
            <circle cx="0" cy="0" r="5" fill="url(#steelDark)" stroke="#4a535c" strokeWidth="0.8" />
            <circle cx="0" cy="0" r="2" fill="#d8dee5" />
          </g>
        </g>

        {/* Mechanical flower head */}
        <g
          className={isBursting ? "" : "mechanical-flower-idle"}
          style={{
            transform: isBursting ? `rotate(${rotation}deg)` : undefined,
            transformOrigin: "100px 100px",
            transition: isBursting ? "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)" : undefined,
          }}
        >
          <line x1="100" y1="130" x2="100" y2="168" stroke="#1a1a1a" strokeWidth="2" />

          <circle cx="100" cy="100" r="72" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
          <circle cx="100" cy="100" r="62" stroke="#e85d8a" strokeWidth="1" fill="none" strokeDasharray="4 6" />

          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <g key={angle} transform={`rotate(${angle} 100 100)`}>
              <path
                d="M100 32 L110 58 L100 66 L90 58 Z"
                fill="#f7f3ed"
                stroke="#1a1a1a"
                strokeWidth="1.5"
              />
              <circle cx="100" cy="46" r="3.5" fill="#e85d8a" stroke="#1a1a1a" strokeWidth="1" />
              <line x1="100" y1="66" x2="100" y2="78" stroke="#1a1a1a" strokeWidth="1.5" />
            </g>
          ))}

          <circle cx="100" cy="100" r="28" fill="#f7f3ed" stroke="#1a1a1a" strokeWidth="2" />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <rect
              key={`gear-${angle}`}
              x="96"
              y="68"
              width="8"
              height="12"
              rx="1"
              fill="#e85d8a"
              stroke="#1a1a1a"
              strokeWidth="1"
              transform={`rotate(${angle} 100 100)`}
            />
          ))}

          <circle cx="100" cy="100" r="12" fill="#1a1a1a" />
          <circle cx="100" cy="100" r="5" fill="#e85d8a" />
          <circle cx="100" cy="100" r="2" fill="#f7f3ed" />

          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
            <line
              key={`spoke-${angle}`}
              x1="100"
              y1="100"
              x2={100 + 44 * Math.cos((angle * Math.PI) / 180)}
              y2={100 + 44 * Math.sin((angle * Math.PI) / 180)}
              stroke="#e85d8a"
              strokeWidth="0.75"
              opacity="0.7"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
