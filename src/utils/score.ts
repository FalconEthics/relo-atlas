import type { Category, CountryScores } from "../types";

export const weightedScore = (
  scores: CountryScores,
  weights: number[],
  categories: Category[],
): number =>
  categories.reduce(
    (total, category, index) => total + (scores[category.id] || 0) * weights[index],
    0,
  );

export const scoreColor = (value: number): string =>
  value >= 8 ? "#22c55e" : value >= 6 ? "#eab308" : value >= 4 ? "#f97316" : "#ef4444";

export const scoreTier = (value: number): [string, string] =>
  value >= 7
    ? ["A", "#22c55e"]
    : value >= 6.4
      ? ["B", "#3b82f6"]
      : value >= 6
        ? ["C", "#eab308"]
        : value >= 5
          ? ["D", "#f97316"]
          : ["E", "#ef4444"];
