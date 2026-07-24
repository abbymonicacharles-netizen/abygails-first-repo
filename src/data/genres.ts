import type { GenreMeta } from "./types";

export const genres: GenreMeta[] = [
  { id: "software", label: "Software", description: "Build and ship software" },
  { id: "robotics", label: "Robotics", description: "Hardware and field work" },
  { id: "engineering", label: "Engineering", description: "Specs and build plans" },
  { id: "business", label: "Business", description: "Strategy and operations" },
  { id: "school", label: "School", description: "Classes and assignments" },
  { id: "film", label: "Film", description: "Production and creative" },
  { id: "research", label: "Research", description: "Study and analysis" },
  { id: "marketing", label: "Marketing", description: "Campaigns and launches" },
  { id: "architecture", label: "Architecture", description: "Concept and design" },
  { id: "writing", label: "Writing", description: "Drafts and revisions" },
  { id: "custom", label: "Custom", description: "Define your own genre" },
];

export const DEFAULT_SECTIONS = [
  "Brainstorming",
  "Planning",
  "Tasks",
  "Resources",
  "Meetings",
  "Progress",
  "Completion",
] as const;

export const SPINE_COLORS = [
  "#1f3a34",
  "#2c4a6e",
  "#5c3d2e",
  "#3d4a2f",
  "#4a3f55",
  "#6b3a2a",
  "#2f4550",
  "#4a5560",
];
