"use client";

type IconProps = { className?: string; size?: number; filled?: boolean };

function Svg({
  size = 22,
  className = "",
  children,
}: {
  size?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function IconHome({ size, className, filled }: IconProps) {
  return (
    <Svg size={size} className={className}>
      {filled ? (
        <path fill="currentColor" stroke="none" d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z" />
      ) : (
        <path d="M4 10.5 12 3l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
      )}
    </Svg>
  );
}

export function IconMessages({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H9l-4 3.5V6.5Z" />
    </Svg>
  );
}

export function IconFeed({ size, className, filled }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <rect x="4" y="5" width="16" height="14" rx="3" fill={filled ? "currentColor" : "none"} />
      {!filled && <path d="M8 10h5M8 14h8" />}
      {filled && <path stroke="#fff" d="M8 10h5M8 14h8" />}
      <path d="M8 3.5v2M16 3.5v2" />
    </Svg>
  );
}

export function IconUpdate({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M8.5 13.5c.8 1.4 2 2.1 3.5 2.1s2.7-.7 3.5-2.1" />
      <circle cx="9.2" cy="10" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="10" r="0.9" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconRooms({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M5 20V9.5L12 4l7 5.5V20" />
      <path d="M9.5 20v-6h5v6" />
      <circle cx="12" cy="11.5" r="1.2" />
    </Svg>
  );
}

export function IconBell({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M7 10a5 5 0 0 1 10 0c0 4 1.5 5.5 1.5 5.5H5.5S7 14 7 10Z" />
      <path d="M10 17.5a2 2 0 0 0 4 0" />
    </Svg>
  );
}

export function IconProfile({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19c1.4-3.2 3.5-4.5 6.5-4.5s5.1 1.3 6.5 4.5" />
    </Svg>
  );
}

export function IconSearch({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.5-3.5" />
    </Svg>
  );
}

export function IconHeart({ size, className, filled }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path
        d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.8C19 15.6 12 20 12 20Z"
        fill={filled ? "#e11d48" : "none"}
        stroke={filled ? "#e11d48" : "currentColor"}
      />
    </Svg>
  );
}

export function IconSend({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M4 11.5 20 4l-5.5 16-3-6.5L4 11.5Z" />
    </Svg>
  );
}

export function IconBookmark({ size, className, filled }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M7 4.5h10v16l-5-3.2-5 3.2v-16Z" fill={filled ? "currentColor" : "none"} />
    </Svg>
  );
}

export function IconPhone({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M7.5 3.5h3l1.2 4-2 1.4a12 12 0 0 0 5.4 5.4l1.4-2 4 1.2v3A2 2 0 0 1 18.5 18.5 14.5 14.5 0 0 1 4 4a2 2 0 0 1 2-2h1.5Z" />
    </Svg>
  );
}

export function IconVideo({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <rect x="3.5" y="7" width="12" height="10" rx="2.2" />
      <path d="m15.5 11 5-2.5v7L15.5 13" />
    </Svg>
  );
}

export function IconScreen({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 17v3" />
    </Svg>
  );
}

export function IconLock({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <rect x="5.5" y="10" width="13" height="10" rx="2" />
      <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" />
    </Svg>
  );
}

export function IconPlus({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function IconMore({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="6" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconCalendar({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <rect x="4" y="6" width="16" height="14" rx="2.5" />
      <path d="M8 4v4M16 4v4M4 11h16" />
    </Svg>
  );
}

export function IconSettings({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M4.8 6.5l1.6 1.6M17.6 15.9l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.8 17.5l1.6-1.6M17.6 8.1l1.6-1.6" />
    </Svg>
  );
}

export function IconShare({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <circle cx="6" cy="12" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <circle cx="18" cy="18" r="2.2" />
      <path d="m8 11 8-4M8 13l8 4" />
    </Svg>
  );
}

export function IconMic({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <rect x="9" y="3.5" width="6" height="10" rx="3" />
      <path d="M7 11a5 5 0 0 0 10 0M12 16v4M9 20h6" />
    </Svg>
  );
}

export function IconHand({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M8 11V6.5a1.5 1.5 0 0 1 3 0V11M11 10.5V5.2a1.5 1.5 0 0 1 3 0V11M14 10V6.8a1.5 1.5 0 0 1 3 0V13c0 3.2-2 5.5-5 5.5S7 16.2 7 13v-2.5a1.5 1.5 0 0 1 3 0V11" />
    </Svg>
  );
}

export function IconClose({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  );
}

export function IconCamera({ size, className }: IconProps) {
  return (
    <Svg size={size} className={className}>
      <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h2l1.2-1.5h5L16 6h1.5A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8Z" />
      <circle cx="12" cy="12.5" r="3.2" />
    </Svg>
  );
}
