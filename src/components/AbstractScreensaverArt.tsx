export function AbstractScreensaverArt({ className = "aspect-square w-full max-w-[320px]" }: { className?: string }) {
  return (
    <div className={`abstract-screensaver relative overflow-hidden ${className}`} aria-hidden>
      <div className="abstract-screensaver-bg absolute inset-0" />
      <div className="abstract-orb abstract-orb-1" />
      <div className="abstract-orb abstract-orb-2" />
      <div className="abstract-orb abstract-orb-3" />
      <div className="abstract-ring abstract-ring-1" />
      <div className="abstract-ring abstract-ring-2" />
      <div className="abstract-line abstract-line-1" />
      <div className="abstract-line abstract-line-2" />
      <div className="abstract-dot abstract-dot-1" />
      <div className="abstract-dot abstract-dot-2" />
      <div className="abstract-dot abstract-dot-3" />
      <div className="abstract-dot abstract-dot-4" />
    </div>
  );
}
