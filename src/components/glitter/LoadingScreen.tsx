"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

const COLORS = ["#f0c85c", "#fb918a", "#5eead4", "#a78bfa", "#ffffff", "#fda4af", "#67e8f9"];

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false);
  const specs = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        left: `${8 + (i * 17) % 84}%`,
        top: `${18 + (i * 23) % 64}%`,
        color: COLORS[i % COLORS.length],
        delay: `${(i % 10) * 0.12}s`,
        size: `${2 + (i % 4)}px`,
      })),
    [],
  );

  useEffect(() => {
    const t1 = window.setTimeout(() => setExiting(true), 2200);
    const t2 = window.setTimeout(onDone, 2650);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div className={`glitter-stage ${exiting ? "exit" : ""}`} aria-label="Loading Glitter">
      {specs.map((s) => (
        <span
          key={s.id}
          className="spec"
          style={
            {
              left: s.left,
              top: s.top,
              background: s.color,
              width: s.size,
              height: s.size,
              boxShadow: `0 0 8px ${s.color}`,
              animationDelay: s.delay,
            } as CSSProperties
          }
        />
      ))}
      <div className="glitter-logo">
        <span className="glitter-logo-fill">Glitter</span>
      </div>
    </div>
  );
}
