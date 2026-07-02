export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Abygail Charles logo"
    >
      <defs>
        <linearGradient id="logoGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffb3c9" />
          <stop offset="0.5" stopColor="#ffe48a" />
          <stop offset="1" stopColor="#7ecfc4" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#logoGrad)" />
      <path
        d="M20 42V22h6.2c5.4 0 8.8 2.8 8.8 7.4 0 3.2-1.6 5.6-4.2 6.8L36 42h-6.4l-4.8-5.2H26V42H20zm6-10.4h3.6c2.2 0 3.4-1 3.4-2.8 0-1.8-1.2-2.8-3.4-2.8H26v5.6z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M38 42l8-20h6.8l8 20h-6.4l-1.2-3.2H45.6L44.4 42H38zm6.8-8.4h5.2l-2.6-6.8-2.6 6.8z"
        fill="white"
        fillOpacity="0.95"
      />
      <circle cx="50" cy="18" r="3" fill="white" fillOpacity="0.7" />
    </svg>
  );
}
