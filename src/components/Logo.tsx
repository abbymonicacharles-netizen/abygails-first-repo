export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Abygail Charles logo"
    >
      <rect x="1" y="1" width="38" height="38" rx="4" fill="#1a1a1a" />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fill="#f7f3ed"
        fontSize="14"
        fontFamily="Georgia, serif"
        fontWeight="600"
        letterSpacing="1"
      >
        AC
      </text>
      <rect x="1" y="1" width="38" height="3" rx="1" fill="#e85d8a" />
    </svg>
  );
}
