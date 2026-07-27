"use client";

import type { AvatarConfig, BodyShape } from "@/data/types";

function bodyScale(body: BodyShape) {
  switch (body) {
    case "skinny":
      return { torso: 0.78, shoulder: 0.82, hip: 0.8 };
    case "slim":
      return { torso: 0.9, shoulder: 0.92, hip: 0.9 };
    case "athletic":
      return { torso: 1, shoulder: 1.08, hip: 0.95 };
    case "muscular":
      return { torso: 1.12, shoulder: 1.22, hip: 1.05 };
    case "curvy":
      return { torso: 1.05, shoulder: 1.02, hip: 1.2 };
    case "thick":
      return { torso: 1.15, shoulder: 1.12, hip: 1.28 };
    case "plus":
      return { torso: 1.28, shoulder: 1.2, hip: 1.4 };
  }
}

/** Fashion-forward seated avatar used in rooms & creator previews. */
export function HumanAvatar({
  config,
  size = 110,
  className = "",
  showChair = true,
}: {
  config: AvatarConfig;
  size?: number;
  className?: string;
  showChair?: boolean;
}) {
  const s = bodyScale(config.body);
  const headY = config.gender === "masculine" ? 30 : 28;
  const faceW = config.gender === "masculine" ? 15.5 : 16.5;
  const faceH = config.gender === "masculine" ? 18 : 19.5;
  const eyeOpen = config.eyeShape === "wide" ? 4.4 : config.eyeShape === "round" ? 3.8 : 3.1;
  const eyeW = config.eyeShape === "almond" || config.eyeShape === "upturned" ? 5.8 : 4.9;

  const torsoW = 30 * s.torso;
  const shoulderW = 38 * s.shoulder;
  const hipW = 36 * s.hip;

  return (
    <svg
      className={className}
      width={size}
      height={Math.round(size * 1.35)}
      viewBox="0 0 100 135"
      aria-hidden
    >
      {showChair && (
        <>
          <ellipse cx="50" cy="118" rx="28" ry="8" fill="#9aa3b5" />
          <path d="M28 78 C28 70 38 66 50 66 C62 66 72 70 72 78 L76 112 L24 112 Z" fill="#aeb6c8" />
        </>
      )}

      {/* legs / lower */}
      <path
        d={`M${50 - hipW / 2} 88 Q50 ${95 + (config.body === "plus" ? 4 : 0)} ${50 + hipW / 2} 88 L${50 + hipW / 2 + 4} 118 L${50 - hipW / 2 - 4} 118 Z`}
        fill={config.clothing === "dress" ? config.clothingColor : shade(config.clothingColor, -20)}
      />

      {/* torso */}
      <path
        d={`M${50 - shoulderW / 2} 58 C${50 - shoulderW / 2} 48 ${50 - torsoW / 2} 44 50 44 C${50 + torsoW / 2} 44 ${50 + shoulderW / 2} 48 ${50 + shoulderW / 2} 58 L${50 + hipW / 2} 90 L${50 - hipW / 2} 90 Z`}
        fill={config.clothingColor}
      />
      {config.clothing === "puffer" && (
        <>
          <path d={`M${50 - shoulderW / 2 + 2} 56 Q50 52 ${50 + shoulderW / 2 - 2} 56`} fill="none" stroke="#fff" strokeOpacity="0.35" />
          <path d={`M${50 - shoulderW / 2 + 4} 66 Q50 62 ${50 + shoulderW / 2 - 4} 66`} fill="none" stroke="#fff" strokeOpacity="0.28" />
        </>
      )}
      {config.clothing === "blazer" && (
        <path d="M50 46 L50 88" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.4" />
      )}

      {/* arms */}
      <path d={`M${50 - shoulderW / 2 + 2} 58 C${50 - shoulderW / 2 - 14} 70 ${50 - shoulderW / 2 - 12} 92 ${50 - shoulderW / 2 + 2} 98`} fill="none" stroke={config.skin} strokeWidth={7 * s.torso} strokeLinecap="round" />
      <path d={`M${50 + shoulderW / 2 - 2} 58 C${50 + shoulderW / 2 + 14} 70 ${50 + shoulderW / 2 + 12} 92 ${50 + shoulderW / 2 - 2} 98`} fill="none" stroke={config.skin} strokeWidth={7 * s.torso} strokeLinecap="round" />

      {/* neck + head */}
      <rect x="45" y={headY + faceH - 6} width="10" height="12" rx="3" fill={config.skin} />
      <ellipse cx="50" cy={headY} rx={faceW} ry={faceH} fill={config.skin} />

      <Hair config={config} cx={50} cy={headY} />

      {/* ears */}
      <ellipse cx={50 - faceW + 1} cy={headY + 2} rx="3.2" ry="4.6" fill={config.skin} />
      <ellipse cx={50 + faceW - 1} cy={headY + 2} rx="3.2" ry="4.6" fill={config.skin} />

      {/* eyes */}
      <Eye cx={50 - 6.5} cy={headY + (config.eyeShape === "hooded" ? 2 : 1)} w={eyeW} h={eyeOpen} color={config.eyeColor} shape={config.eyeShape} lashes={config.gender !== "masculine"} />
      <Eye cx={50 + 6.5} cy={headY + (config.eyeShape === "hooded" ? 2 : 1)} w={eyeW} h={eyeOpen} color={config.eyeColor} shape={config.eyeShape} lashes={config.gender !== "masculine"} />

      {/* brows */}
      <path d={`M${50 - 11} ${headY - 6} Q${50 - 6} ${headY - 8} ${50 - 2} ${headY - 6}`} fill="none" stroke={config.hairColor} strokeWidth="1.7" strokeLinecap="round" />
      <path d={`M${50 + 2} ${headY - 6} Q${50 + 6} ${headY - 8} ${50 + 11} ${headY - 6}`} fill="none" stroke={config.hairColor} strokeWidth="1.7" strokeLinecap="round" />

      {/* nose + lips */}
      <path d={`M50 ${headY + 4} L48 ${headY + 9} L52 ${headY + 9}`} fill="none" stroke="#000" strokeOpacity="0.16" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="50" cy={headY + 14} rx={config.gender === "masculine" ? 4.2 : 5.2} ry={config.gender === "masculine" ? 1.8 : 2.6} fill={config.lipColor} />

      {config.glasses !== "none" && <Glasses style={config.glasses} cy={headY + 1} />}
      {config.hat !== "none" && <Hat style={config.hat} color={config.clothingColor} hair={config.hairColor} />}
      {config.accessory === "hoops" && (
        <>
          <circle cx={50 - faceW} cy={headY + 8} r="3.2" fill="none" stroke="#eab308" strokeWidth="1.5" />
          <circle cx={50 + faceW} cy={headY + 8} r="3.2" fill="none" stroke="#eab308" strokeWidth="1.5" />
        </>
      )}
      {config.accessory === "studs" && (
        <>
          <circle cx={50 - faceW} cy={headY + 7} r="1.4" fill="#eab308" />
          <circle cx={50 + faceW} cy={headY + 7} r="1.4" fill="#eab308" />
        </>
      )}
      {config.accessory === "necklace" && (
        <path d={`M${50 - 10} ${headY + faceH - 2} Q50 ${headY + faceH + 8} ${50 + 10} ${headY + faceH - 2}`} fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
      )}
    </svg>
  );
}

function shade(hex: string, amt: number) {
  const n = hex.replace("#", "");
  const num = parseInt(n.length === 3 ? n.split("").map((c) => c + c).join("") : n, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function Eye({
  cx,
  cy,
  w,
  h,
  color,
  shape,
  lashes,
}: {
  cx: number;
  cy: number;
  w: number;
  h: number;
  color: string;
  shape: AvatarConfig["eyeShape"];
  lashes?: boolean;
}) {
  const tilt = shape === "upturned" ? -10 : shape === "monolid" ? 2 : 0;
  return (
    <g transform={`rotate(${tilt} ${cx} ${cy})`}>
      <ellipse cx={cx} cy={cy} rx={w} ry={h} fill="#fff" stroke="#111" strokeWidth="0.6" />
      <circle cx={cx} cy={cy} r={Math.max(1.9, h * 0.72)} fill={color} />
      <circle cx={cx + 0.9} cy={cy - 0.9} r="0.7" fill="#fff" />
      {lashes && (
        <>
          <path d={`M${cx - w} ${cy - h * 0.2} L${cx - w - 1.5} ${cy - h - 1.5}`} stroke="#111" strokeWidth="0.8" />
          <path d={`M${cx} ${cy - h} L${cx} ${cy - h - 2.2}`} stroke="#111" strokeWidth="0.8" />
          <path d={`M${cx + w} ${cy - h * 0.2} L${cx + w + 1.5} ${cy - h - 1.5}`} stroke="#111" strokeWidth="0.8" />
        </>
      )}
    </g>
  );
}

function Hair({ config, cx, cy }: { config: AvatarConfig; cx: number; cy: number }) {
  const c = config.hairColor;
  const textured =
    config.hairTexture === "curly" || config.hairTexture === "coily" || config.hairTexture === "kinky";

  if (config.hairStyle === "buzz" || config.hairStyle === "fade") {
    return <ellipse cx={cx} cy={cy - 6} rx="16" ry="13" fill={c} opacity={config.hairStyle === "buzz" ? 0.9 : 0.75} />;
  }
  if (config.hairStyle === "buns") {
    return (
      <>
        <ellipse cx={cx} cy={cy - 8} rx="17" ry="14" fill={c} />
        <circle cx={cx - 14} cy={cy - 14} r="8" fill={c} />
        <circle cx={cx + 14} cy={cy - 14} r="8" fill={c} />
        {config.hat === "bows" && (
          <>
            <path d={`M${cx - 18} ${cy - 14} L${cx - 10} ${cy - 18} L${cx - 10} ${cy - 10} Z`} fill="#fff" />
            <path d={`M${cx + 18} ${cy - 14} L${cx + 10} ${cy - 18} L${cx + 10} ${cy - 10} Z`} fill="#fff" />
          </>
        )}
      </>
    );
  }
  if (config.hairStyle === "braids" || config.hairStyle === "loc") {
    return (
      <>
        <ellipse cx={cx} cy={cy - 8} rx="17" ry="13" fill={c} />
        <path d={`M${cx - 14} ${cy} Q${cx - 18} ${cy + 30} ${cx - 12} ${cy + 55}`} fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" />
        <path d={`M${cx + 14} ${cy} Q${cx + 18} ${cy + 30} ${cx + 12} ${cy + 55}`} fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" />
        <path d={`M${cx - 6} ${cy + 2} Q${cx - 8} ${cy + 28} ${cx - 4} ${cy + 50}`} fill="none" stroke={c} strokeWidth="4" strokeLinecap="round" />
        <path d={`M${cx + 6} ${cy + 2} Q${cx + 8} ${cy + 28} ${cx + 4} ${cy + 50}`} fill="none" stroke={c} strokeWidth="4" strokeLinecap="round" />
      </>
    );
  }
  if (config.hairStyle === "afro") {
    return <circle cx={cx} cy={cy - 4} r="24" fill={c} />;
  }
  if (config.hairStyle === "ponytail") {
    return (
      <>
        <ellipse cx={cx} cy={cy - 8} rx="16" ry="13" fill={c} />
        <path d={`M${cx + 10} ${cy - 6} Q${cx + 28} ${cy + 10} ${cx + 18} ${cy + 40}`} fill="none" stroke={c} strokeWidth="7" strokeLinecap="round" />
      </>
    );
  }
  if (config.hairStyle === "pixie" || config.hairStyle === "short" || config.hairStyle === "bob") {
    return (
      <>
        <ellipse cx={cx} cy={cy - 8} rx="17" ry="13" fill={c} />
        {config.hairStyle !== "pixie" && (
          <path d={`M${cx - 17} ${cy - 2} Q${cx - 20} ${cy + 18} ${cx - 10} ${cy + 22} L${cx + 10} ${cy + 22} Q${cx + 20} ${cy + 18} ${cx + 17} ${cy - 2}`} fill={c} />
        )}
        {textured && (
          <>
            <circle cx={cx - 12} cy={cy + 2} r="3.5" fill={c} />
            <circle cx={cx + 12} cy={cy + 2} r="3.5" fill={c} />
          </>
        )}
      </>
    );
  }
  // shoulder / long
  return (
    <>
      <ellipse cx={cx} cy={cy - 8} rx="17" ry="14" fill={c} />
      <path
        d={
          textured
            ? `M${cx - 18} ${cy} C${cx - 24} ${cy + 28} ${cx - 16} ${cy + 58} ${cx - 8} ${cy + 62} L${cx - 4} ${cy + 20} L${cx} ${cy - 4} L${cx + 4} ${cy + 20} L${cx + 8} ${cy + 62} C${cx + 16} ${cy + 58} ${cx + 24} ${cy + 28} ${cx + 18} ${cy} Z`
            : `M${cx - 17} ${cy} C${cx - 20} ${cy + 35} ${cx - 14} ${cy + 62} ${cx - 6} ${cy + 66} L${cx} ${cy - 2} L${cx + 6} ${cy + 66} C${cx + 14} ${cy + 62} ${cx + 20} ${cy + 35} ${cx + 17} ${cy} Z`
        }
        fill={c}
      />
    </>
  );
}

function Glasses({ style, cy }: { style: AvatarConfig["glasses"]; cy: number }) {
  if (style === "sun") {
    return (
      <>
        <rect x="35" y={cy - 4} width="12" height="9" rx="3" fill="#0f172a" opacity="0.8" />
        <rect x="53" y={cy - 4} width="12" height="9" rx="3" fill="#0f172a" opacity="0.8" />
        <path d={`M47 ${cy} H53`} stroke="#0f172a" strokeWidth="1.4" />
      </>
    );
  }
  if (style === "rect" || style === "thin") {
    return (
      <>
        <rect x="35" y={cy - 3.5} width="12" height="8" rx={style === "thin" ? 1 : 1.5} fill="none" stroke="#111" strokeWidth={style === "thin" ? 1 : 1.5} />
        <rect x="53" y={cy - 3.5} width="12" height="8" rx={style === "thin" ? 1 : 1.5} fill="none" stroke="#111" strokeWidth={style === "thin" ? 1 : 1.5} />
        <path d={`M47 ${cy + 0.5} H53`} stroke="#111" strokeWidth="1.2" />
      </>
    );
  }
  return (
    <>
      <circle cx="41" cy={cy} r="5.6" fill="none" stroke="#111" strokeWidth="1.4" />
      <circle cx="59" cy={cy} r="5.6" fill="none" stroke="#111" strokeWidth="1.4" />
      <path d={`M46.6 ${cy} H53.4`} stroke="#111" strokeWidth="1.2" />
    </>
  );
}

function Hat({
  style,
  color,
  hair,
}: {
  style: AvatarConfig["hat"];
  color: string;
  hair: string;
}) {
  if (style === "earmuffs") {
    return (
      <>
        <circle cx="32" cy="30" r="8" fill="#f8fafc" />
        <circle cx="68" cy="30" r="8" fill="#f8fafc" />
        <path d="M32 24 Q50 12 68 24" fill="none" stroke="#f8fafc" strokeWidth="3" />
      </>
    );
  }
  if (style === "headband") {
    return <path d="M34 22 H66" stroke="#f8fafc" strokeWidth="5" strokeLinecap="round" />;
  }
  if (style === "bows") {
    return <circle cx="50" cy="14" r="0.1" fill={hair} />;
  }
  if (style === "cap") {
    return (
      <>
        <ellipse cx="50" cy="18" rx="17" ry="8" fill={color} />
        <path d="M50 14 H72 Q76 18 64 20 H50 Z" fill={color} />
      </>
    );
  }
  if (style === "beanie") {
    return <path d="M33 24 C33 10 67 10 67 24 Z" fill={color} />;
  }
  return <ellipse cx="48" cy="16" rx="18" ry="8" fill={color} transform="rotate(-10 48 16)" />;
}

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
      className={`avatar-round inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <HumanAvatar config={config} size={Math.round(size * 1.45)} showChair={false} />
    </span>
  );
}

/** Small picture tile for avatar option pickers */
export function AvatarOptionPreview({
  config,
  size = 64,
}: {
  config: AvatarConfig;
  size?: number;
}) {
  return (
    <span className="grid place-items-center overflow-hidden rounded-xl bg-white" style={{ width: size, height: size }}>
      <HumanAvatar config={config} size={Math.round(size * 1.15)} showChair={false} />
    </span>
  );
}
