"use client";

import { AVATAR_OPTIONS, type AvatarConfig } from "@/data/mock";
import { Modal } from "./ui";

export function AvatarCreator({
  value,
  onChange,
  onClose,
}: {
  value: AvatarConfig;
  onChange: (v: AvatarConfig) => void;
  onClose: () => void;
}) {
  function patch<K extends keyof AvatarConfig>(key: K, next: AvatarConfig[K]) {
    onChange({ ...value, [key]: next });
  }

  return (
    <Modal title="Avatar creator" onClose={onClose} wide>
      <p className="text-sm text-ink-soft">
        Design a polished avatar with a little sparkle — hair, face, outfit, and sitting pose for rooms.
      </p>
      <div className="mt-5 grid gap-5 md:grid-cols-[200px_minmax(0,1fr)]">
        <div className="rounded-3xl border border-line bg-paper p-5 text-center">
          <div
            className="mx-auto grid h-28 w-28 place-items-center rounded-full text-3xl font-bold text-ink shadow-inner"
            style={{ background: value.skin }}
          >
            ◕‿◕
          </div>
          <p className="mt-3 text-sm font-semibold">{value.hair} · {value.clothing}</p>
          <p className="text-xs text-ink-faint">
            {value.hat !== "None" ? value.hat : "No hat"} ·{" "}
            {value.glasses !== "None" ? value.glasses : "No glasses"}
          </p>
          <p className="mt-2 text-xs font-semibold text-accent">Pose: {value.pose}</p>
        </div>
        <div className="space-y-4">
          {(
            [
              ["hair", "Hair / hairstyles"],
              ["face", "Face"],
              ["eyes", "Eyes"],
              ["clothing", "Clothing"],
              ["accessory", "Accessories"],
              ["hat", "Hats"],
              ["glasses", "Glasses"],
              ["pose", "Sitting poses"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-faint">{label}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {AVATAR_OPTIONS[key].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => patch(key, opt)}
                    className={`chip ${value[key] === opt ? "border-ink bg-ink text-surface" : ""}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-faint">Skin tone</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {AVATAR_OPTIONS.skin.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  aria-label={tone}
                  onClick={() => patch("skin", tone)}
                  className={`h-9 w-9 rounded-full border-2 ${
                    value.skin === tone ? "border-ink" : "border-transparent"
                  }`}
                  style={{ background: tone }}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-ink-faint">Seasonal outfits unlock with calendar events and badges.</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-surface"
          >
            Save avatar
          </button>
        </div>
      </div>
    </Modal>
  );
}
