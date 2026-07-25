export interface SeaCreature {
  id: string;
  name: string;
  /** Unlock when any project race reaches this % */
  unlockAt: number;
  emoji: string;
  color: string;
  /** Growth stage label for the egg story */
  stage: "egg" | "crack" | "hatch" | "swim" | "legend";
}

/** Cute sea collection unlocked by finishing tasks / progress. */
export const SEA_CREATURES: SeaCreature[] = [
  { id: "egg", name: "Mystery Egg", unlockAt: 0, emoji: "🥚", color: "#f5e6a8", stage: "egg" },
  { id: "crack", name: "Cracking Egg", unlockAt: 15, emoji: "🐣", color: "#ffe082", stage: "crack" },
  { id: "hatchling", name: "Tiny Hatchling", unlockAt: 30, emoji: "🐠", color: "#ff8a65", stage: "hatch" },
  { id: "clownfish", name: "Clownfish", unlockAt: 40, emoji: "🐡", color: "#ff7043", stage: "swim" },
  { id: "seahorse", name: "Seahorse", unlockAt: 50, emoji: "🦄", color: "#ba68c8", stage: "swim" },
  { id: "jellyfish", name: "Jellyfish", unlockAt: 55, emoji: "🎐", color: "#ce93d8", stage: "swim" },
  { id: "starfish", name: "Starfish", unlockAt: 60, emoji: "⭐", color: "#f48fb1", stage: "swim" },
  { id: "turtle", name: "Sea Turtle", unlockAt: 70, emoji: "🐢", color: "#81c784", stage: "swim" },
  { id: "octopus", name: "Octopus", unlockAt: 80, emoji: "🐙", color: "#ab47bc", stage: "swim" },
  { id: "shark", name: "Friendly Shark", unlockAt: 90, emoji: "🦈", color: "#90a4ae", stage: "swim" },
  { id: "whale", name: "Baby Whale", unlockAt: 95, emoji: "🐋", color: "#64b5f6", stage: "legend" },
  { id: "coral-queen", name: "Coral Queen", unlockAt: 100, emoji: "👑", color: "#e040fb", stage: "legend" },
];

export function creaturesForProgress(progress: number) {
  return SEA_CREATURES.filter((c) => progress >= c.unlockAt);
}

export function stageForProgress(progress: number): SeaCreature {
  const unlocked = creaturesForProgress(progress);
  return unlocked[unlocked.length - 1] ?? SEA_CREATURES[0];
}
