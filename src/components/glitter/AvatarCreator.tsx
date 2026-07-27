"use client";

import { AVATAR_OPTIONS, type AvatarConfig } from "@/data/mock";
import { HumanAvatar } from "./HumanAvatar";
import { Modal } from "./ui";

const LABELS: Record<string, string> = {
  hairStyle: "Hairstyle",
  hairColor: "Hair colour",
  face: "Face shape",
  skin: "Skin tone",
  eyeShape: "Eye shape",
  eyeColor: "Eye colour",
  clothing: "Clothing",
  clothingColor: "Clothing colour",
  accessory: "Accessories",
  hat: "Hats",
  glasses: "Glasses",
};

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
      <p className="text-sm leading-relaxed text-ink-soft">
        Build a human avatar — hair, eyes, skin, clothes, and more. In rooms you’ll appear seated on a chair.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
        <div className="iri-border flex flex-col items-center p-6 text-center">
          <div className="relative">
            <div className="chair-back mx-auto" />
            <HumanAvatar config={value} size={140} />
            <div className="chair-base mx-auto" />
          </div>
          <p className="mt-4 text-sm font-bold capitalize">
            {value.hairStyle} · {value.clothing}
          </p>
          <p className="text-xs text-ink-faint capitalize">
            {value.eyeShape} eyes · sitting pose
          </p>
        </div>

        <div className="space-y-5">
          {(
            [
              "hairStyle",
              "hairColor",
              "face",
              "skin",
              "eyeShape",
              "eyeColor",
              "clothing",
              "clothingColor",
              "accessory",
              "hat",
              "glasses",
            ] as const
          ).map((key) => (
            <div key={key}>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink-faint">
                {LABELS[key]}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {key === "skin" || key === "hairColor" || key === "eyeColor" || key === "clothingColor"
                  ? AVATAR_OPTIONS[key].map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        aria-label={tone}
                        onClick={() => patch(key, tone)}
                        className={`h-9 w-9 rounded-full border-2 transition ${
                          value[key] === tone ? "border-ink scale-110" : "border-transparent"
                        }`}
                        style={{ background: tone }}
                      />
                    ))
                  : AVATAR_OPTIONS[key].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => patch(key, opt as never)}
                        className={`chip capitalize ${
                          value[key] === opt ? "border-transparent bg-ink text-paper" : ""
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
              </div>
            </div>
          ))}

          <button type="button" onClick={onClose} className="btn btn-primary">
            Save avatar
          </button>
        </div>
      </div>
    </Modal>
  );
}
