"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

const WORD = "GLITTER".split("");

const COLORS = [
  "#f0c85c",
  "#fb918a",
  "#5eead4",
  "#a78bfa",
  "#ffffff",
  "#fda4af",
  "#67e8f9",
  "#fde68a",
];

type Spark = {
  id: number;
  left: string;
  top: string;
  color: string;
  dx: string;
  dy: string;
  delay: string;
  size: string;
};

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false);
  const sparks = useMemo<Spark[]>(
    () =>
      Array.from({ length: 72 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 72 + (i % 3) * 0.2;
        const dist = 120 + (i % 7) * 42;
        return {
          id: i,
          left: "50%",
          top: "46%",
          color: COLORS[i % COLORS.length],
          dx: `${Math.cos(angle) * dist}px`,
          dy: `${Math.sin(angle) * dist - 40}px`,
          delay: `${(i % 12) * 0.04}s`,
          size: `${5 + (i % 5)}px`,
        };
      }),
    [],
  );

  useEffect(() => {
    const t1 = window.setTimeout(() => setExiting(true), 2400);
    const t2 = window.setTimeout(onDone, 2950);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div className={`glitter-stage ${exiting ? "exit" : ""}`} aria-label="Loading Glitter">
      {sparks.map((s) => (
        <span
          key={s.id}
          className="spark"
          style={
            {
              left: s.left,
              top: s.top,
              background: s.color,
              width: s.size,
              height: s.size,
              boxShadow: `0 0 12px ${s.color}`,
              "--dx": s.dx,
              "--dy": s.dy,
              animationDelay: s.delay,
            } as CSSProperties
          }
        />
      ))}
      <div className="glitter-word" aria-hidden>
        {WORD.map((letter, i) => (
          <span
            key={letter + i}
            className="glitter-letter"
            style={{ animationDelay: `${0.15 + i * 0.1}s, ${0.9 + i * 0.08}s` }}
          >
            {letter}
          </span>
        ))}
      </div>
      <p className="relative z-[2] mt-8 text-sm font-semibold tracking-[0.28em] text-white/55">
        CONNECT · CREATE · GATHER
      </p>
    </div>
  );
}
