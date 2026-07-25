export interface StickerDef {
  id: string;
  label: string;
  src: string;
}

/** Cut-out picture stickers (SVG shapes in /public/stickers). */
export const STICKER_PACK: StickerDef[] = [
  { id: "heart", label: "Heart", src: "/stickers/heart.svg" },
  { id: "star", label: "Star", src: "/stickers/star.svg" },
  { id: "flower", label: "Flower", src: "/stickers/flower.svg" },
  { id: "cloud", label: "Cloud", src: "/stickers/cloud.svg" },
  { id: "moon", label: "Moon", src: "/stickers/moon.svg" },
  { id: "leaf", label: "Leaf", src: "/stickers/leaf.svg" },
  { id: "car", label: "Racer", src: "/stickers/car.svg" },
  { id: "note", label: "Note", src: "/stickers/note.svg" },
];

export const DEFAULT_STICKERS = ["heart", "star", "flower", "cloud"];

export function stickerSrc(id: string) {
  return STICKER_PACK.find((s) => s.id === id)?.src ?? "/stickers/star.svg";
}
