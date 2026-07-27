"use client";

import {
  CLOTHING_COLORS,
  EYE_COLORS,
  HAIR_COLORS,
  LIP_COLORS,
  SKIN_TONES,
  makeAvatar,
  type AvatarConfig,
  type BodyShape,
  type ClothingStyle,
  type EyeShape,
  type GenderPresentation,
  type HairStyle,
  type HairTexture,
} from "@/data/types";
import { AvatarOptionPreview, HumanAvatar } from "./HumanAvatar";
import { Modal } from "./ui";
import { IconClose } from "./Icons";

const BODIES: BodyShape[] = ["skinny", "slim", "athletic", "muscular", "curvy", "thick", "plus"];
const GENDERS: GenderPresentation[] = ["feminine", "masculine", "fluid"];
const TEXTURES: HairTexture[] = ["straight", "wavy", "curly", "coily", "kinky"];
const STYLES: HairStyle[] = [
  "buzz",
  "fade",
  "short",
  "pixie",
  "bob",
  "shoulder",
  "long",
  "buns",
  "braids",
  "loc",
  "ponytail",
  "afro",
];
const EYES: EyeShape[] = ["almond", "round", "hooded", "upturned", "wide", "monolid"];
const CLOTHES: ClothingStyle[] = ["tee", "crop", "hoodie", "blazer", "jacket", "puffer", "coat", "dress"];
const HATS: AvatarConfig["hat"][] = ["none", "cap", "beanie", "beret", "earmuffs", "headband", "bows"];
const GLASSES: AvatarConfig["glasses"][] = ["none", "round", "rect", "thin", "sun"];
const ACCESSORIES: AvatarConfig["accessory"][] = ["none", "hoops", "studs", "necklace", "watch", "scarf"];

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
    <Modal title="Avatar" onClose={onClose} wide>
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="flex flex-col items-center rounded-2xl border border-line bg-paper p-4">
          <HumanAvatar config={value} size={160} />
          <button type="button" className="btn btn-primary mt-4 w-full" onClick={onClose}>
            Save
          </button>
        </div>

        <div className="scroll-y max-h-[70svh] space-y-5 pr-1">
          <Section title="Body">
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {BODIES.map((b) => (
                <button
                  key={b}
                  type="button"
                  className="option-tile"
                  data-active={value.body === b}
                  onClick={() => patch("body", b)}
                >
                  <AvatarOptionPreview config={makeAvatar({ ...value, body: b })} size={56} />
                </button>
              ))}
            </div>
          </Section>

          <Section title="Presentation">
            <div className="grid grid-cols-3 gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  className="option-tile"
                  data-active={value.gender === g}
                  onClick={() => patch("gender", g)}
                >
                  <AvatarOptionPreview
                    config={makeAvatar({
                      ...value,
                      gender: g,
                      clothing: g === "masculine" ? "hoodie" : g === "feminine" ? "crop" : value.clothing,
                    })}
                    size={64}
                  />
                </button>
              ))}
            </div>
          </Section>

          <Section title="Skin">
            <div className="flex flex-wrap gap-2">
              {SKIN_TONES.map((tone) => (
                <button
                  key={tone}
                  type="button"
                  className="option-tile !p-1"
                  data-active={value.skin === tone}
                  onClick={() => patch("skin", tone)}
                  aria-label={tone}
                >
                  <AvatarOptionPreview config={makeAvatar({ ...value, skin: tone })} size={52} />
                </button>
              ))}
            </div>
          </Section>

          <Section title="Hair texture">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {TEXTURES.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="option-tile"
                  data-active={value.hairTexture === t}
                  onClick={() => patch("hairTexture", t)}
                >
                  <AvatarOptionPreview
                    config={makeAvatar({
                      ...value,
                      hairTexture: t,
                      hairStyle: t === "coily" || t === "kinky" ? "afro" : t === "curly" ? "buns" : "long",
                    })}
                    size={56}
                  />
                </button>
              ))}
            </div>
          </Section>

          <Section title="Hairstyle">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {STYLES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="option-tile"
                  data-active={value.hairStyle === s}
                  onClick={() => patch("hairStyle", s)}
                >
                  <AvatarOptionPreview config={makeAvatar({ ...value, hairStyle: s })} size={56} />
                </button>
              ))}
            </div>
          </Section>

          <Section title="Hair colour">
            <div className="flex flex-wrap gap-2">
              {HAIR_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="option-tile !p-1"
                  data-active={value.hairColor === c}
                  onClick={() => patch("hairColor", c)}
                >
                  <AvatarOptionPreview config={makeAvatar({ ...value, hairColor: c })} size={52} />
                </button>
              ))}
            </div>
          </Section>

          <Section title="Eyes">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {EYES.map((e) => (
                <button
                  key={e}
                  type="button"
                  className="option-tile"
                  data-active={value.eyeShape === e}
                  onClick={() => patch("eyeShape", e)}
                >
                  <AvatarOptionPreview config={makeAvatar({ ...value, eyeShape: e })} size={52} />
                </button>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {EYE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="h-8 w-8 rounded-full border-2"
                  style={{
                    background: c,
                    borderColor: value.eyeColor === c ? "var(--g-ink)" : "transparent",
                  }}
                  onClick={() => patch("eyeColor", c)}
                />
              ))}
            </div>
          </Section>

          <Section title="Lips">
            <div className="flex flex-wrap gap-2">
              {LIP_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="option-tile !p-1"
                  data-active={value.lipColor === c}
                  onClick={() => patch("lipColor", c)}
                >
                  <AvatarOptionPreview config={makeAvatar({ ...value, lipColor: c })} size={48} />
                </button>
              ))}
            </div>
          </Section>

          <Section title="Clothing">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {CLOTHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="option-tile"
                  data-active={value.clothing === c}
                  onClick={() => patch("clothing", c)}
                >
                  <AvatarOptionPreview config={makeAvatar({ ...value, clothing: c })} size={56} />
                </button>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {CLOTHING_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className="h-8 w-8 rounded-full border-2"
                  style={{
                    background: c,
                    borderColor: value.clothingColor === c ? "var(--g-ink)" : "transparent",
                  }}
                  onClick={() => patch("clothingColor", c)}
                />
              ))}
            </div>
          </Section>

          <Section title="Hats & glasses">
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {HATS.map((h) => (
                <button
                  key={h}
                  type="button"
                  className="option-tile"
                  data-active={value.hat === h}
                  onClick={() => patch("hat", h)}
                >
                  <AvatarOptionPreview config={makeAvatar({ ...value, hat: h })} size={48} />
                </button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {GLASSES.map((g) => (
                <button
                  key={g}
                  type="button"
                  className="option-tile"
                  data-active={value.glasses === g}
                  onClick={() => patch("glasses", g)}
                >
                  <AvatarOptionPreview config={makeAvatar({ ...value, glasses: g })} size={48} />
                </button>
              ))}
            </div>
          </Section>

          <Section title="Accessories">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {ACCESSORIES.map((a) => (
                <button
                  key={a}
                  type="button"
                  className="option-tile"
                  data-active={value.accessory === a}
                  onClick={() => patch("accessory", a)}
                >
                  <AvatarOptionPreview config={makeAvatar({ ...value, accessory: a })} size={48} />
                </button>
              ))}
            </div>
          </Section>
        </div>
      </div>
      <button type="button" className="sr-only" onClick={onClose} aria-label="Close">
        <IconClose />
      </button>
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-ink-faint">{title}</p>
      {children}
    </section>
  );
}
