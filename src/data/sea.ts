export type EggStageId = "pastel" | "warm" | "crack" | "peek" | "almost" | "grown";

export interface EggStage {
  id: EggStageId;
  at: number;
  name: string;
  /** Pastel shell colour */
  shell: string;
  /** Soft accent */
  accent: string;
}

/** Cute pastel egg growth shown only on the project progress chart. */
export const EGG_STAGES: EggStage[] = [
  { id: "pastel", at: 0, name: "Pastel egg", shell: "#FFD6E8", accent: "#F8BBD9" },
  { id: "warm", at: 18, name: "Warm egg", shell: "#E1BEE7", accent: "#CE93D8" },
  { id: "crack", at: 35, name: "Tiny crack", shell: "#BBDEFB", accent: "#90CAF9" },
  { id: "peek", at: 55, name: "Peeking out", shell: "#C8E6C9", accent: "#A5D6A7" },
  { id: "almost", at: 78, name: "Almost grown", shell: "#FFE0B2", accent: "#FFCC80" },
  { id: "grown", at: 100, name: "Fully grown!", shell: "#FFF9C4", accent: "#FFF59D" },
];

export interface AquariumPet {
  id: string;
  name: string;
  /** Cute emoji stand-in / label */
  emoji: string;
  /** Body colours for SVG fish art */
  colors: { body: string; fin: string; accent: string };
  kind: "goldfish" | "angelfish" | "discus" | "school" | "octopus" | "shark" | "turtle" | "jellyfish";
}

/** Fully grown pets that can join the aquarium (never eggs). */
export const AQUARIUM_PETS: AquariumPet[] = [
  {
    id: "goldfish",
    name: "Sunny Goldfish",
    emoji: "🐠",
    colors: { body: "#FFB74D", fin: "#FF8A65", accent: "#FFF59D" },
    kind: "goldfish",
  },
  {
    id: "angelfish",
    name: "Blue Angel",
    emoji: "🐟",
    colors: { body: "#64B5F6", fin: "#1976D2", accent: "#E3F2FD" },
    kind: "angelfish",
  },
  {
    id: "discus",
    name: "Coral Discus",
    emoji: "🐡",
    colors: { body: "#FF8A65", fin: "#E53935", accent: "#FFCCBC" },
    kind: "discus",
  },
  {
    id: "school",
    name: "Little School",
    emoji: "💛",
    colors: { body: "#FFEB3B", fin: "#FBC02D", accent: "#FFFDE7" },
    kind: "school",
  },
  {
    id: "octopus",
    name: "Rosie Octopus",
    emoji: "🐙",
    colors: { body: "#CE93D8", fin: "#AB47BC", accent: "#F3E5F5" },
    kind: "octopus",
  },
  {
    id: "shark",
    name: "Friendly Shark",
    emoji: "🦈",
    colors: { body: "#90A4AE", fin: "#607D8B", accent: "#ECEFF1" },
    kind: "shark",
  },
  {
    id: "turtle",
    name: "Sea Turtle",
    emoji: "🐢",
    colors: { body: "#81C784", fin: "#4CAF50", accent: "#E8F5E9" },
    kind: "turtle",
  },
  {
    id: "jellyfish",
    name: "Jelly Bloom",
    emoji: "🎐",
    colors: { body: "#F8BBD0", fin: "#F48FB1", accent: "#FCE4EC" },
    kind: "jellyfish",
  },
];

export function eggStageForProgress(progress: number): EggStage {
  const pct = Math.max(0, Math.min(100, progress));
  let stage = EGG_STAGES[0];
  for (const s of EGG_STAGES) {
    if (pct >= s.at) stage = s;
  }
  return stage;
}

export function petById(id: string) {
  return AQUARIUM_PETS.find((p) => p.id === id);
}

export function nextPetId(owned: string[]) {
  const next = AQUARIUM_PETS.find((p) => !owned.includes(p.id));
  return next?.id ?? AQUARIUM_PETS[owned.length % AQUARIUM_PETS.length].id;
}

/** Only fully grown aquarium pets (not eggs). */
export function grownPets(collection: string[]) {
  return AQUARIUM_PETS.filter((p) => collection.includes(p.id));
}
