"use client";

export function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button type="button" className="absolute inset-0 bg-ink/40 backdrop-blur-sm" aria-label="Close" onClick={onClose} />
      <div
        className={`relative z-10 max-h-[92svh] w-full overflow-y-auto rounded-t-[2rem] border border-line bg-surface p-6 shadow-2xl backdrop-blur-xl sm:rounded-[2rem] ${
          wide ? "sm:max-w-3xl" : "sm:max-w-lg"
        }`}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
          <button type="button" className="btn btn-ghost !px-3 !py-1.5 !text-xs" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
