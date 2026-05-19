import type { CategoryId } from "../types";

export type WeightProfileId = "mik" | "builder" | "settler" | "explorer" | "minimalist" | "prestige" | "retiree";

export type ScoreTier = "A" | "B" | "C" | "D" | "E";

export type PenaltyCurve = Record<number, number>;

export type GateRule = {
  id: CategoryId;
  minScore: number;
  penaltyMultiplier?: number;
  capTier?: ScoreTier;
  label?: string;
};

export type WeightProfile = {
  id: WeightProfileId;
  name: string;
  tagline: string;
  weights: Record<CategoryId, number>;
  priorities?: CategoryId[];
  gates?: GateRule[];
  priorityPenaltyCurve?: PenaltyCurve;
  priorityPenaltyPower?: number;
};

const toWeights = (entries: [CategoryId, number][]): Record<CategoryId, number> => {
  const result: Partial<Record<CategoryId, number>> = {};
  for (const [id, pct] of entries) {
    result[id] = pct / 100;
  }
  return result as Record<CategoryId, number>;
};

export const DEFAULT_PRIORITY_PENALTY_CURVE: PenaltyCurve = {
  10: 1,
  9: 1,
  8: 0.97,
  7: 0.93,
  6: 0.88,
  5: 0.8,
  4: 0.68,
  3: 0.52,
  2: 0.35,
  1: 0.2,
};

export const DEFAULT_GATES: GateRule[] = [
  {
    id: "immi",
    minScore: 4,
    capTier: "B",
    label: "Immigration below 4 caps tier at B",
  },
  {
    id: "safety",
    minScore: 4,
    capTier: "B",
    label: "Safety below 4 caps tier at B",
  },
  {
    id: "health",
    minScore: 4,
    capTier: "B",
    label: "Healthcare below 4 caps tier at B",
  },
  {
    id: "housing",
    minScore: 3,
    penaltyMultiplier: 0.92,
    label: "Housing below 3 applies an extra penalty",
  },
];

export const SETTLER_GATES: GateRule[] = [
  ...DEFAULT_GATES,
  {
    id: "housing",
    minScore: 4,
    capTier: "B",
    label: "Settler profile: housing below 4 caps tier at B",
  },
];

const BASE_PROFILE_SETTINGS = {
  priorityPenaltyCurve: DEFAULT_PRIORITY_PENALTY_CURVE,
  gates: DEFAULT_GATES,
};

export const WEIGHT_PROFILES: WeightProfile[] = [
  {
    id: "mik",
    name: "Mik's Default",
    tagline: "Balanced high-agency tech immigrant build",
    ...BASE_PROFILE_SETTINGS,
    weights: toWeights([
      ["career", 10],
      ["tech", 16],
      ["social", 14],
      ["stability", 6],
      ["lifestyle", 7],
      ["terrain", 4],
      ["safety", 7],
      ["urban", 7],
      ["health", 6],
      ["env", 2],
      ["housing", 2],
      ["gov", 7],
      ["values", 7],
      ["immi", 2],
      ["edu", 2],
      ["history", 1],
    ]),
  },
  {
    id: "builder",
    name: "The Builder",
    tagline: "Max career acceleration, wealth creation, tech ecosystem depth",
    ...BASE_PROFILE_SETTINGS,
    weights: toWeights([
      ["career", 18],
      ["tech", 22],
      ["social", 3],
      ["stability", 8],
      ["lifestyle", 4],
      ["terrain", 1],
      ["safety", 5],
      ["urban", 4],
      ["health", 4],
      ["env", 1],
      ["housing", 8],
      ["gov", 6],
      ["values", 3],
      ["immi", 8],
      ["edu", 4],
      ["history", 1],
    ]),
  },
  {
    id: "settler",
    name: "The Settler",
    tagline: "Long-term family civilization build",
    priorityPenaltyCurve: DEFAULT_PRIORITY_PENALTY_CURVE,
    gates: SETTLER_GATES,
    weights: toWeights([
      ["career", 6],
      ["tech", 5],
      ["social", 10],
      ["stability", 14],
      ["lifestyle", 10],
      ["terrain", 5],
      ["safety", 12],
      ["urban", 7],
      ["health", 10],
      ["env", 6],
      ["housing", 5],
      ["gov", 5],
      ["values", 3],
      ["immi", 1],
      ["edu", 1],
      ["history", 0],
    ]),
  },
  {
    id: "explorer",
    name: "The Explorer",
    tagline: "Terrain, aesthetics, experiences, cinematic life",
    ...BASE_PROFILE_SETTINGS,
    weights: toWeights([
      ["career", 4],
      ["tech", 4],
      ["social", 10],
      ["stability", 5],
      ["lifestyle", 18],
      ["terrain", 20],
      ["safety", 6],
      ["urban", 5],
      ["health", 3],
      ["env", 8],
      ["housing", 2],
      ["gov", 2],
      ["values", 5],
      ["immi", 2],
      ["edu", 1],
      ["history", 5],
    ]),
  },
  {
    id: "minimalist",
    name: "The Minimalist",
    tagline: "Low stress, walkability, clean systems, predictability",
    ...BASE_PROFILE_SETTINGS,
    weights: toWeights([
      ["career", 5],
      ["tech", 4],
      ["social", 6],
      ["stability", 12],
      ["lifestyle", 10],
      ["terrain", 3],
      ["safety", 12],
      ["urban", 14],
      ["health", 10],
      ["env", 6],
      ["housing", 5],
      ["gov", 8],
      ["values", 3],
      ["immi", 1],
      ["edu", 1],
      ["history", 0],
    ]),
  },
  {
    id: "prestige",
    name: "The Prestige Chaser",
    tagline: "Status, elite signaling, world-class institutions",
    ...BASE_PROFILE_SETTINGS,
    weights: toWeights([
      ["career", 18],
      ["tech", 15],
      ["social", 2],
      ["stability", 8],
      ["lifestyle", 8],
      ["terrain", 3],
      ["safety", 6],
      ["urban", 5],
      ["health", 5],
      ["env", 1],
      ["housing", 1],
      ["gov", 7],
      ["values", 2],
      ["immi", 2],
      ["edu", 12],
      ["history", 5],
    ]),
  },
  {
    id: "retiree",
    name: "The Retiree",
    tagline: "Peaceful long-term living, health, low stress",
    ...BASE_PROFILE_SETTINGS,
    weights: toWeights([
      ["career", 1],
      ["tech", 1],
      ["social", 10],
      ["stability", 10],
      ["lifestyle", 14],
      ["terrain", 8],
      ["safety", 12],
      ["urban", 8],
      ["health", 16],
      ["env", 8],
      ["housing", 7],
      ["gov", 3],
      ["values", 1],
      ["immi", 0],
      ["edu", 0],
      ["history", 1],
    ]),
  },
];

export const MIK_DEFAULT_PROFILE = WEIGHT_PROFILES.find((p) => p.id === "mik")!;
