import type { Category, CountryScores, GateRule, PenaltyCurve, ScoreTier, ScoringConfig } from "../types";
import type { WeightProfile } from "../data/weight-profiles";
import { DEFAULT_PRIORITY_PENALTY_CURVE } from "../data/weight-profiles";

export const weightedScore = (scores: CountryScores, weights: number[], categories: Category[]): number =>
  categories.reduce((total, category, index) => total + (scores[category.id] || 0) * weights[index], 0);

export const scoreColor = (value: number): string => {
  return value >= 80 ? "#22c55e" : value >= 60 ? "#eab308" : value >= 40 ? "#f97316" : "#ef4444";
};

export const scoreTier = (value: number): [ScoreTier, string] =>
  value <= 0
    ? ["E", "#ef4444"]
    : value >= 55
      ? ["A", "#22c55e"]
      : value >= 49
        ? ["B", "#3b82f6"]
        : value >= 43
          ? ["C", "#eab308"]
          : value >= 37
            ? ["D", "#f97316"]
            : ["E", "#ef4444"];

export type GateImpact = {
  rule: GateRule;
  score: number;
  penaltyMultiplier: number;
  appliedCap?: ScoreTier;
};

export type ScoreBreakdown = {
  baseScore: number;
  priorityPenalty: number;
  gatePenalty: number;
  finalScore: number;
  priorities: { id: Category["id"]; score: number; penalty: number }[];
  gateImpacts: GateImpact[];
  tierCap?: ScoreTier;
};

const getPenalty = (score: number, curve: PenaltyCurve): number => {
  const clamped = Math.max(1, Math.min(10, Math.round(score)));
  return curve[clamped] ?? DEFAULT_PRIORITY_PENALTY_CURVE[clamped] ?? 1;
};

const tierRank: Record<ScoreTier, number> = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
  E: 1,
};

const clampTier = (current: ScoreTier, cap: ScoreTier): ScoreTier =>
  tierRank[current] > tierRank[cap] ? cap : current;

const tierScoreCeiling: Record<ScoreTier, number> = {
  A: 100,
  B: 54.99,
  C: 48.99,
  D: 42.99,
  E: 36.99,
};

const applyTierCap = (score: number, cap?: ScoreTier): number => {
  if (!cap) return score;
  return Math.min(score, tierScoreCeiling[cap]);
};

export const scoreBreakdown = (
  scores: CountryScores,
  weights: number[],
  categories: Category[],
  profile: WeightProfile,
  config?: ScoringConfig | null,
): ScoreBreakdown => {
  const baseScore = weightedScore(scores, weights, categories) * 10;
  const curve = config?.penaltyCurve ?? profile.priorityPenaltyCurve ?? DEFAULT_PRIORITY_PENALTY_CURVE;

  const priorityCount = config?.priorityCount ?? 4;
  let priorityIds: Category["id"][];
  if (config?.priorities && config.priorities !== "auto") {
    priorityIds = config.priorities;
  } else if (profile.priorities && profile.priorities.length > 0) {
    priorityIds = profile.priorities;
  } else {
    priorityIds = [...categories]
      .map((cat, index) => ({ cat, weight: weights[index] }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, priorityCount)
      .map((entry) => entry.cat.id);
  }

  const priorities = priorityIds.map((id) => {
    const score = scores[id] ?? 0;
    return { id, score, penalty: getPenalty(score, curve) };
  });

  const priorityPenaltyRaw = priorities.reduce((total, item) => total * item.penalty, 1);
  const penaltyPower = config?.penaltyPower ?? profile.priorityPenaltyPower;
  const priorityPenalty = penaltyPower !== undefined
    ? Math.pow(priorityPenaltyRaw, penaltyPower)
    : priorityPenaltyRaw;

  const gates = config?.gates ?? profile.gates ?? [];
  let gatePenalty = 1;
  let tierCap: ScoreTier | undefined;
  const gateImpacts: GateImpact[] = [];

  for (const rule of gates) {
    const score = scores[rule.id] ?? 0;
    if (score < rule.minScore) {
      const penaltyMultiplier = rule.penaltyMultiplier ?? 1;
      gatePenalty *= penaltyMultiplier;
      const appliedCap = rule.capTier;
      if (appliedCap) {
        tierCap = tierCap ? clampTier(tierCap, appliedCap) : appliedCap;
      }
      gateImpacts.push({ rule, score, penaltyMultiplier, appliedCap });
    }
  }

  const rawFinal = baseScore * priorityPenalty * gatePenalty;
  const finalScore = applyTierCap(rawFinal, tierCap);

  return {
    baseScore,
    priorityPenalty,
    gatePenalty,
    finalScore,
    priorities,
    gateImpacts,
    tierCap,
  };
};
