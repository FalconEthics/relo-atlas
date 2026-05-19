import type { CategoryId, PenaltyCurve, GateRule } from "../types";

export type WeightProfileId =
  | "mik"
  | "builder"
  | "settler"
  | "explorer"
  | "minimalist"
  | "prestige"
  | "retiree";

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

const toWeights = (
  entries: [CategoryId, number][],
): Record<CategoryId, number> => {
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

const SOFT_PRIORITY_PENALTY_CURVE: PenaltyCurve = {
  10: 1,
  9: 1,
  8: 0.98,
  7: 0.95,
  6: 0.9,
  5: 0.85,
  4: 0.75,
  3: 0.62,
  2: 0.45,
  1: 0.3,
};

const STRICT_PRIORITY_PENALTY_CURVE: PenaltyCurve = {
  10: 1,
  9: 1,
  8: 0.96,
  7: 0.9,
  6: 0.85,
  5: 0.75,
  4: 0.6,
  3: 0.45,
  2: 0.3,
  1: 0.15,
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

export const WEIGHT_PROFILES: WeightProfile[] = [
  {
    id: "mik",
    name: "Mik's Default",
    tagline: "High-agency tech life, grown-up guardrails, no chaos",
    priorityPenaltyCurve: DEFAULT_PRIORITY_PENALTY_CURVE,
    priorities: [
      "career",
      "tech",
      "social",
      "lifestyle",
      "terrain",
      "safety",
      "values",
    ],
    gates: [
      {
        id: "safety",
        minScore: 4,
        capTier: "B",
        label: "Safety below 4 caps tier at B",
      },
      {
        id: "stability",
        minScore: 4,
        capTier: "B",
        label: "Stability below 4 caps tier at B",
      },
      {
        id: "gov",
        minScore: 4,
        capTier: "B",
        label: "Governance below 4 caps tier at B",
      },
      {
        id: "health",
        minScore: 4,
        capTier: "B",
        label: "Healthcare below 4 applies an extra penalty",
      },
      {
        id: "social",
        minScore: 4,
        capTier: "B",
        label: "Friendliness below 3 applies a penalty",
      },
    ],
    weights: toWeights([
      ["career", 8],
      ["social", 9],
      ["lifestyle", 8],
      ["safety", 8],
      ["health", 8],
      ["housing", 2],
      ["values", 9],
      ["edu", 2],
      ["tech", 9],
      ["stability", 8],
      ["terrain", 8],
      ["urban", 7],
      ["env", 2],
      ["gov", 8],
      ["immi", 2],
      ["history", 2],
    ]),
  },
  {
    id: "builder",
    name: "The Builder",
    tagline: "Career rocket fuel, big upside, tech hub magnet",
    priorityPenaltyCurve: DEFAULT_PRIORITY_PENALTY_CURVE,
    priorityPenaltyPower: 1,
    priorities: ["career", "tech", "safety", "immi"],
    gates: [
      {
        id: "career",
        minScore: 8,
        capTier: "B",
        label: "carrer below 4 caps tier at B",
      },
      {
        id: "tech",
        minScore: 8,
        capTier: "B",
        label: "tech below 4 caps tier at B",
      },
      {
        id: "safety",
        minScore: 4,
        capTier: "B",
        label: "Safety below 4 caps tier at B",
      },
    ],
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
    tagline: "Long-haul family stack: safety, stability, systems",
    priorityPenaltyCurve: DEFAULT_PRIORITY_PENALTY_CURVE,
    priorityPenaltyPower: 1,
    priorities: [
      "safety",
      "stability",
      "health",
      "housing",
      "urban",
      "social",
      "values",
    ],
    gates: [
      {
        id: "safety",
        minScore: 3,
        capTier: "B",
        label: "Safety below 3 caps tier at B",
      },
      {
        id: "health",
        minScore: 3,
        capTier: "B",
        label: "Healthcare below 3 caps tier at B",
      },
      {
        id: "housing",
        minScore: 3,
        penaltyMultiplier: 0.95,
        label: "Housing below 3 applies a penalty",
      },
      {
        id: "stability",
        minScore: 3,
        capTier: "B",
        label: "Stability below 3 caps tier at B",
      },
      {
        id: "urban",
        minScore: 3,
        penaltyMultiplier: 0.97,
        label: "Urban planning below 3 applies a penalty",
      },
    ],
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
    tagline: "Cinematic living: terrain, vibes, stories for later",
    priorityPenaltyCurve: SOFT_PRIORITY_PENALTY_CURVE,
    priorityPenaltyPower: 0.9,
    priorities: ["lifestyle", "terrain", "social", "env", "urban", "safety"],
    gates: [
      {
        id: "safety",
        minScore: 3,
        penaltyMultiplier: 0.95,
        label: "Safety below 3 applies a penalty",
      },
      {
        id: "stability",
        minScore: 3,
        penaltyMultiplier: 0.96,
        label: "Stability below 3 applies a penalty",
      },
    ],
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
    tagline: "Low drama, high order: walkable, clean, predictable",
    priorityPenaltyCurve: STRICT_PRIORITY_PENALTY_CURVE,
    priorityPenaltyPower: 1.1,
    priorities: ["urban", "stability", "safety", "health", "gov", "lifestyle"],
    gates: [
      {
        id: "safety",
        minScore: 4,
        capTier: "B",
        label: "Safety below 4 caps tier at B",
      },
      {
        id: "stability",
        minScore: 4,
        capTier: "B",
        label: "Stability below 4 caps tier at B",
      },
      {
        id: "health",
        minScore: 4,
        penaltyMultiplier: 0.92,
        label: "Healthcare below 4 applies an extra penalty",
      },
      {
        id: "urban",
        minScore: 4,
        penaltyMultiplier: 0.95,
        label: "Urban planning below 4 applies a penalty",
      },
    ],
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
    tagline: "Status-maxing: elite brands, signals, shiny things",
    priorityPenaltyCurve: DEFAULT_PRIORITY_PENALTY_CURVE,
    priorityPenaltyPower: 1.05,
    priorities: ["career", "tech", "edu", "urban", "gov", "stability"],
    gates: [
      {
        id: "gov",
        minScore: 4,
        capTier: "B",
        label: "Governance below 4 caps tier at B",
      },
      {
        id: "stability",
        minScore: 4,
        capTier: "B",
        label: "Stability below 4 caps tier at B",
      },
      {
        id: "edu",
        minScore: 4,
        penaltyMultiplier: 0.95,
        label: "Education below 4 applies a penalty",
      },
      {
        id: "career",
        minScore: 4,
        penaltyMultiplier: 0.95,
        label: "Career below 4 applies a penalty",
      },
    ],
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
    tagline: "Soft landing: health first, calm days, no noise",
    priorityPenaltyCurve: STRICT_PRIORITY_PENALTY_CURVE,
    priorityPenaltyPower: 1.15,
    priorities: [
      "health",
      "safety",
      "lifestyle",
      "stability",
      "terrain",
      "env",
    ],
    gates: [
      {
        id: "health",
        minScore: 5,
        capTier: "B",
        label: "Healthcare below 5 caps tier at B",
      },
      {
        id: "safety",
        minScore: 4,
        capTier: "B",
        label: "Safety below 4 caps tier at B",
      },
      {
        id: "stability",
        minScore: 4,
        capTier: "B",
        label: "Stability below 4 caps tier at B",
      },
      {
        id: "env",
        minScore: 3,
        penaltyMultiplier: 0.95,
        label: "Environment below 3 applies a penalty",
      },
      {
        id: "terrain",
        minScore: 3,
        penaltyMultiplier: 0.95,
        label: "Terrain below 3 applies a penalty",
      },
      {
        id: "urban",
        minScore: 3,
        penaltyMultiplier: 0.95,
        label: "Urban planning below 3 applies a penalty",
      },
    ],
    weights: toWeights([
      ["career", 1],
      ["tech", 1],
      ["social", 10],
      ["stability", 10],
      ["lifestyle", 12],
      ["terrain", 12],
      ["safety", 12],
      ["urban", 6],
      ["health", 16],
      ["env", 12],
      ["housing", 5],
      ["gov", 3],
      ["values", 1],
      ["immi", 0],
      ["edu", 0],
      ["history", 1],
    ]),
  },
];

export const MIK_DEFAULT_PROFILE = WEIGHT_PROFILES.find((p) => p.id === "mik")!;
