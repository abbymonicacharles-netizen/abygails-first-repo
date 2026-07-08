"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function MechanicalFlower({ className = "h-48 w-48" }: { className?: string }) {
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
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`h-full w-full ${isBursting ? "" : "mechanical-flower-idle"}`}
        style={{
          transform: isBursting ? `rotate(${rotation}deg)` : undefined,
          transformOrigin: "center",
          transition: isBursting ? "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)" : undefined,
        }}
      >
        <circle cx="100" cy="100" r="92" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
        <circle cx="100" cy="100" r="78" stroke="#b8897a" strokeWidth="1" fill="none" strokeDasharray="4 6" />

        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 100 100)`}>
            <path
              d="M100 18 L112 52 L100 62 L88 52 Z"
              fill="#f7f3ed"
              stroke="#1a1a1a"
              strokeWidth="1.5"
            />
            <circle cx="100" cy="38" r="4" fill="#b8897a" stroke="#1a1a1a" strokeWidth="1" />
            <line x1="100" y1="62" x2="100" y2="78" stroke="#1a1a1a" strokeWidth="1.5" />
          </g>
        ))}

        <circle cx="100" cy="100" r="34" fill="#f7f3ed" stroke="#1a1a1a" strokeWidth="2" />
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <rect
            key={`gear-${angle}`}
            x="96"
            y="62"
            width="8"
            height="14"
            rx="1"
            fill="#b8897a"
            stroke="#1a1a1a"
            strokeWidth="1"
            transform={`rotate(${angle} 100 100)`}
          />
        ))}

        <circle cx="100" cy="100" r="14" fill="#1a1a1a" />
        <circle cx="100" cy="100" r="6" fill="#b8897a" />
        <circle cx="100" cy="100" r="2.5" fill="#f7f3ed" />

        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
          <line
            key={`spoke-${angle}`}
            x1="100"
            y1="100"
            x2={100 + 56 * Math.cos((angle * Math.PI) / 180)}
            y2={100 + 56 * Math.sin((angle * Math.PI) / 180)}
            stroke="#b8897a"
            strokeWidth="0.75"
            opacity="0.6"
          />
        ))}
      </svg>
    </div>
  );
}
