"use client";

import type { AvatarConfig } from "@/data/mock";

/** Stylized human figure sitting — customizable features for Glitter rooms & profiles. */
export function HumanAvatar({
  config,
  size = 96,
  className = "",
}: {
  config: AvatarConfig;
  size?: number;
  className?: string;
}) {
  const w = size;
  const h = Math.round(size * 1.25);
  const faceRx = config.face === "round" ? 18 : config.face === "long" ? 14 : config.face === "sharp" ? 13 : 16;
  const faceRy = config.face === "long" ? 22 : config.face === "round" ? 18 : 19;
  const eyeOpen = config.eyeShape === "wide" ? 4.2 : config.eyeShape === "round" ? 3.6 : 3.1;
  const eyeWidth = config.eyeShape === "almond" || config.eyeShape === "upturned" ? 5.5 : 4.8;
  const eyeY = config.eyeShape === "hooded" ? 40 : 39;

  return (
    <svg
      className={`human-avatar ${className}`}
      width={w}
      height={h}
      viewBox="0 0 88 110"
      aria-hidden
    >
      {/* chair back peeking */}
      <rect x="24" y="62" width="40" height="28" rx="10" fill="#5a4d6d" opacity="0.85" />

      {/* torso / clothing */}
      <path
        d={
          config.clothing === "dress"
            ? "M28 58 C28 48 36 44 44 44 C52 44 60 48 60 58 L64 92 L24 92 Z"
            : "M30 56 C30 48 36 44 44 44 C52 44 58 48 58 56 L62 86 C62 90 58 92 44 92 C30 92 26 90 26 86 Z"
        }
        fill={config.clothingColor}
      />
      {config.clothing === "blazer" && (
        <>
          <path d="M44 46 L44 86" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.5" />
          <path d="M32 56 L44 48 L56 56" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="1.2" />
        </>
      )}
      {config.clothing === "hoodie" && (
        <path d="M34 48 C38 42 50 42 54 48" fill={config.clothingColor} stroke="#000" strokeOpacity="0.15" />
      )}

      {/* arms resting */}
      <path d="M28 58 C18 64 16 78 22 84" fill="none" stroke={config.skin} strokeWidth="7" strokeLinecap="round" />
      <path d="M60 58 C70 64 72 78 66 84" fill="none" stroke={config.skin} strokeWidth="7" strokeLinecap="round" />

      {/* neck */}
      <rect x="39" y="40" width="10" height="10" rx="3" fill={config.skin} />

      {/* head */}
      <ellipse cx="44" cy="32" rx={faceRx} ry={faceRy} fill={config.skin} />

      {/* hair */}
      <Hair style={config.hairStyle} color={config.hairColor} />

      {/* ears */}
      <ellipse cx={44 - faceRx + 1} cy="34" rx="3" ry="4.5" fill={config.skin} />
      <ellipse cx={44 + faceRx - 1} cy="34" rx="3" ry="4.5" fill={config.skin} />

      {/* eyes */}
      <Eye cx={37} cy={eyeY} w={eyeWidth} h={eyeOpen} color={config.eyeColor} shape={config.eyeShape} />
      <Eye cx={51} cy={eyeY} w={eyeWidth} h={eyeOpen} color={config.eyeColor} shape={config.eyeShape} />

      {/* brows */}
      <path
        d={`M32 ${eyeY - 7} Q37 ${eyeY - 9} 42 ${eyeY - 7}`}
        fill="none"
        stroke={config.hairColor}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d={`M46 ${eyeY - 7} Q51 ${eyeY - 9} 56 ${eyeY - 7}`}
        fill="none"
        stroke={config.hairColor}
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* nose + mouth */}
      <path d="M44 42 L42 47 L46 47" fill="none" stroke="#000" strokeOpacity="0.18" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M39 52 Q44 56 49 52" fill="none" stroke="#000" strokeOpacity="0.28" strokeWidth="1.5" strokeLinecap="round" />

      {/* glasses */}
      {config.glasses !== "none" && <Glasses style={config.glasses} />}

      {/* hat */}
      {config.hat !== "none" && <Hat style={config.hat} color={config.clothingColor} />}

      {/* accessory hints */}
      {config.accessory === "earrings" && (
        <>
          <circle cx={44 - faceRx} cy="40" r="1.6" fill="#fbbf24" />
          <circle cx={44 + faceRx} cy="40" r="1.6" fill="#fbbf24" />
        </>
      )}
      {config.accessory === "necklace" && (
        <path d="M36 54 Q44 60 52 54" fill="none" stroke="#fbbf24" strokeWidth="1.4" />
      )}
      {config.accessory === "scarf" && (
        <path d="M32 50 C40 58 48 58 56 50 L54 62 L34 62 Z" fill="#fb7185" opacity="0.9" />
      )}
      {config.accessory === "watch" && (
        <rect x="17" y="78" width="7" height="5" rx="1.5" fill="#111" stroke="#fbbf24" strokeWidth="0.8" />
      )}
    </svg>
  );
}

function Eye({
  cx,
  cy,
  w,
  h,
  color,
  shape,
}: {
  cx: number;
  cy: number;
  w: number;
  h: number;
  color: string;
  shape: AvatarConfig["eyeShape"];
}) {
  const tilt = shape === "upturned" ? -8 : 0;
  return (
    <g transform={`rotate(${tilt} ${cx} ${cy})`}>
      <ellipse cx={cx} cy={cy} rx={w} ry={h} fill="#fff" />
      <circle cx={cx} cy={cy} r={Math.max(1.8, h * 0.7)} fill={color} />
      <circle cx={cx + 0.8} cy={cy - 0.8} r="0.7" fill="#fff" opacity="0.9" />
      {shape === "hooded" && (
        <path
          d={`M${cx - w} ${cy - h * 0.2} Q${cx} ${cy - h * 1.4} ${cx + w} ${cy - h * 0.2}`}
          fill="#000"
          opacity="0.12"
        />
      )}
    </g>
  );
}

function Hair({ style, color }: { style: AvatarConfig["hairStyle"]; color: string }) {
  if (style === "buzz") {
    return <ellipse cx="44" cy="26" rx="17" ry="14" fill={color} opacity="0.85" />;
  }
  if (style === "bun") {
    return (
      <>
        <ellipse cx="44" cy="24" rx="18" ry="16" fill={color} />
        <circle cx="44" cy="10" r="8" fill={color} />
      </>
    );
  }
  if (style === "braids") {
    return (
      <>
        <ellipse cx="44" cy="24" rx="18" ry="15" fill={color} />
        <path d="M28 30 Q24 55 26 78" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
        <path d="M60 30 Q64 55 62 78" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" />
      </>
    );
  }
  if (style === "curls") {
    return (
      <>
        <ellipse cx="44" cy="24" rx="19" ry="16" fill={color} />
        <circle cx="28" cy="34" r="5" fill={color} />
        <circle cx="60" cy="34" r="5" fill={color} />
        <circle cx="32" cy="44" r="4.5" fill={color} />
        <circle cx="56" cy="44" r="4.5" fill={color} />
      </>
    );
  }
  if (style === "long" || style === "waves") {
    return (
      <>
        <ellipse cx="44" cy="24" rx="18" ry="15" fill={color} />
        <path
          d={
            style === "waves"
              ? "M26 28 C22 48 24 70 28 82 L34 50 L44 28 L54 50 L60 82 C64 70 66 48 62 28 Z"
              : "M26 26 C22 55 24 85 30 90 L34 48 L44 26 L54 48 L58 90 C64 85 66 55 62 26 Z"
          }
          fill={color}
        />
      </>
    );
  }
  if (style === "pixie") {
    return (
      <>
        <ellipse cx="44" cy="24" rx="17" ry="13" fill={color} />
        <path d="M28 28 C30 38 34 40 38 36" fill={color} />
      </>
    );
  }
  // sleek
  return (
    <>
      <ellipse cx="44" cy="23" rx="17" ry="14" fill={color} />
      <path d="M27 28 C30 40 34 44 38 40 L44 24 Z" fill={color} />
      <path d="M61 28 C58 40 54 44 50 40 L44 24 Z" fill={color} />
    </>
  );
}

function Glasses({ style }: { style: AvatarConfig["glasses"] }) {
  if (style === "sun") {
    return (
      <>
        <rect x="30" y="35" width="12" height="9" rx="3" fill="#0f172a" opacity="0.75" />
        <rect x="46" y="35" width="12" height="9" rx="3" fill="#0f172a" opacity="0.75" />
        <path d="M42 39 H46" stroke="#0f172a" strokeWidth="1.5" />
      </>
    );
  }
  if (style === "rect") {
    return (
      <>
        <rect x="30" y="35.5" width="12" height="8" rx="1.5" fill="none" stroke="#111" strokeWidth="1.4" />
        <rect x="46" y="35.5" width="12" height="8" rx="1.5" fill="none" stroke="#111" strokeWidth="1.4" />
        <path d="M42 39.5 H46" stroke="#111" strokeWidth="1.3" />
      </>
    );
  }
  // round
  return (
    <>
      <circle cx="36" cy="39" r="5.5" fill="none" stroke="#111" strokeWidth="1.4" />
      <circle cx="52" cy="39" r="5.5" fill="none" stroke="#111" strokeWidth="1.4" />
      <path d="M41.5 39 H46.5" stroke="#111" strokeWidth="1.3" />
    </>
  );
}

function Hat({ style, color }: { style: AvatarConfig["hat"]; color: string }) {
  if (style === "cap") {
    return (
      <>
        <ellipse cx="44" cy="18" rx="16" ry="8" fill={color} />
        <path d="M44 14 H66 Q70 18 60 20 H44 Z" fill={color} />
      </>
    );
  }
  if (style === "beanie") {
    return <path d="M28 24 C28 10 60 10 60 24 Z" fill={color} />;
  }
  // beret
  return <ellipse cx="42" cy="16" rx="18" ry="8" fill={color} transform="rotate(-12 42 16)" />;
}

/** Round cropped avatar for lists / profile chips */
export function AvatarBubble({
  config,
  size = 44,
  className = "",
}: {
  config: AvatarConfig;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`avatar-round inline-flex shrink-0 items-center justify-center bg-paper ${className}`}
      style={{ width: size, height: size }}
    >
      <HumanAvatar config={config} size={Math.round(size * 1.35)} />
    </span>
  );
}
