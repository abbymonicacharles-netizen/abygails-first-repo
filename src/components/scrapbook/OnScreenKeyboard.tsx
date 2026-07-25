"use client";

const ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["⌫", "0", "⏎"],
];

export function OnScreenKeyboard({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (next: string) => void;
  onSubmit?: () => void;
}) {
  function press(key: string) {
    if (key === "⌫") {
      onChange(value.slice(0, -1));
      return;
    }
    if (key === "⏎") {
      onSubmit?.();
      return;
    }
    if (value.length >= 24) return;
    onChange(value + key);
  }

  return (
    <div className="osk mt-3" role="group" aria-label="On-screen keyboard">
      {ROWS.flat().map((key) => (
        <button
          key={key}
          type="button"
          className="osk-key"
          onClick={() => press(key)}
        >
          {key}
        </button>
      ))}
    </div>
  );
}
