import { Fragment } from "react";
import { CAREER_FIELDS } from "../data/career-fields";
import type { Category, CategoryId, CountryData, CountryScores, ScoringConfig } from "../types";
import type { WeightProfile } from "../data/weight-profiles";
import { scoreBreakdown, scoreColor, scoreTier } from "../utils/score";

type BattleCountry = CountryData & { w: number; es?: CountryScores; breakdown?: ReturnType<typeof scoreBreakdown> };

type FinalBattlePanelProps = {
  countries: BattleCountry[];
  categories: Category[];
  customWeights: number[];
  activeProfile: WeightProfile;
  effectiveScores: (country: CountryData) => CountryScores;
  scoringConfig?: ScoringConfig | null;
  onOpenDetail: (countryCode: string) => void;
  fontMono: string;
  fontSerif: string;
};

const CONSISTENT_THRESHOLD = 7;
const PRIORITY_COUNT = 4;
const PRO_COUNT = 2;
const DRAWBACK_COUNT = 2;
const DRAWBACK_THRESHOLD = 6;
const PRO_THRESHOLD = 8;

const impactLabel = (value: number) => (value >= 0.12 ? "high" : value >= 0.07 ? "moderate" : "low");

export function FinalBattlePanel({
  countries,
  categories,
  customWeights,
  activeProfile,
  effectiveScores,
  scoringConfig,
  onOpenDetail,
  fontMono,
  fontSerif,
}: FinalBattlePanelProps) {
  const categoryScore = (country: CountryData, id: CategoryId) =>
    (id === "tech" ? effectiveScores(country) : country.s)[id] ?? 0;

  const stripParentNotes = (text: string) => {
    const cleaned = text
      .split(/(?<=[.!?])\s+/)
      .filter((sentence) => !/parent|parents|adr|super visa/i.test(sentence))
      .join(" ")
      .trim();
    return cleaned.length > 0 ? cleaned : "Immigration pathway remains a notable weakness for long-term settlement.";
  };

  const categoryText = (country: CountryData, id: CategoryId, score: number) => {
    if (id === "tech") {
      const note = CAREER_FIELDS[0].notes?.[country.c];
      return note
        ? `${country.n} — Tech sector: ${score}/10. ${note}`
        : `Tech sector score for ${country.n}: ${score}/10. ${CAREER_FIELDS[0].desc}`;
    }
    const baseText = country.d[id];
    return id === "immi" ? stripParentNotes(baseText) : baseText;
  };

  if (countries.length === 0) {
    return (
      <section style={{ marginBottom: 24 }}>
        <div style={{ background: "#101028", border: "1px solid #1a1a30", borderRadius: 12, padding: 14 }}>
          <div style={{ fontFamily: fontMono, fontSize: 11, color: "#6b6b8d", letterSpacing: 1, marginBottom: 6 }}>
            FINAL BATTLE
          </div>
          <p style={{ fontSize: 13, color: "#8a8aa8", margin: 0 }}>
            No countries match the current filter. Try a broader region or reset weights.
          </p>
        </div>
      </section>
    );
  }

  const topWeightedCategories = customWeights
    .map((weight, index) => ({
      weight,
      category: categories[index],
    }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, PRIORITY_COUNT);

  const battleCountries = countries.map((country) => {
    const scores = categories.map((cat) => {
      const score = categoryScore(country, cat.id);
      return { ...cat, score, text: categoryText(country, cat.id, score) };
    });

    const sortedByScore = [...scores].sort((a, b) => (a.score !== b.score ? b.score - a.score : a.name.localeCompare(b.name)));
    const sortedByWeakness = [...scores].sort((a, b) => (a.score !== b.score ? a.score - b.score : a.name.localeCompare(b.name)));

    const proCutoffScore = sortedByScore[Math.min(PRO_COUNT - 1, sortedByScore.length - 1)]?.score ?? 0;
    const pros = sortedByScore.filter((entry, index) => index < PRO_COUNT || entry.score === proCutoffScore);

    const drawbackCutoffScore = sortedByWeakness[Math.min(DRAWBACK_COUNT - 1, sortedByWeakness.length - 1)]?.score ?? 0;
    const drawbacks = sortedByWeakness.filter((entry, index) => index < DRAWBACK_COUNT || entry.score === drawbackCutoffScore);

    const breakdown = scoreBreakdown(effectiveScores(country), customWeights, categories, activeProfile, scoringConfig);

    return {
      country,
      scores,
      pros,
      drawbacks,
      weighted: breakdown.finalScore,
      breakdown,
    };
  });

  const allFiveStrong = categories.filter((cat) =>
    battleCountries.every((entry) => categoryScore(entry.country, cat.id) >= CONSISTENT_THRESHOLD),
  );

  const comparisonMatrix = categories.map((category) => ({
    category,
    cells: battleCountries.map((countryEntry) => {
      const score = categoryScore(countryEntry.country, category.id);
      const status = score >= PRO_THRESHOLD ? "pro" : score <= DRAWBACK_THRESHOLD ? "weak" : "mid";
      return {
        country: countryEntry.country,
        score,
        status,
        text: categoryText(countryEntry.country, category.id, score),
      };
    }),
  }));

  const priorityLeaders = topWeightedCategories.map((entry) => {
    const leader = battleCountries
      .map((countryEntry) => ({
        countryEntry,
        score: categoryScore(countryEntry.country, entry.category.id),
      }))
      .sort((a, b) => b.score - a.score);
    const topScore = leader[0]?.score ?? 0;
    const leaders = leader.filter((item) => item.score === topScore);
    return { category: entry.category, leaders, weight: entry.weight };
  });

  const decisiveCategory = categories
    .map((cat) => {
      const scores = battleCountries.map((entry) => categoryScore(entry.country, cat.id));
      const spread = Math.max(...scores) - Math.min(...scores);
      return { category: cat, spread };
    })
    .sort((a, b) => b.spread - a.spread)[0];

  const recommended = [...battleCountries].sort((a, b) => b.weighted - a.weighted)[0];
  const recommendedCountry = recommended?.country;
  const priorityLabels = topWeightedCategories.map((item) => item.category.name);
  const recommendedWeakest = recommended?.drawbacks[0];
  const recommendedBreakdown = recommended?.breakdown;

  const recommendationImpact = recommendedWeakest
    ? impactLabel(customWeights[categories.findIndex((cat) => cat.id === recommendedWeakest.id)] ?? 0)
    : "low";

  return (
    <section style={{ marginBottom: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: fontMono, fontSize: 12, color: "#ef4444", letterSpacing: 1, fontWeight: 700 }}>
          FINAL BATTLE - TOP 5 SHOWDOWN
        </div>
        <p style={{ color: "#8a8aa8", fontSize: 13, margin: "6px 0 0" }}>
          The top 5 is recalculated live using your current weights, region filter, career focus, and priority penalties.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {battleCountries.map((entry) => (
          <button
            key={entry.country.c}
            onClick={() => onOpenDetail(entry.country.c)}
            type="button"
            style={{
              background: "#111128",
              border: "1px solid #1e1e36",
              borderRadius: 12,
              padding: "12px 14px",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>{entry.country.f}</span>
                <span style={{ fontFamily: fontSerif, fontSize: 17, fontWeight: 700 }}>{entry.country.n}</span>
              </div>
              <span
                style={{
                  fontFamily: fontMono,
                  fontSize: 10,
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: scoreTier(entry.weighted)[1],
                  color: "#0a0a1a",
                }}
              >
                {`TIER ${scoreTier(entry.weighted)[0]}`}
              </span>
            </div>
            <div style={{ fontFamily: fontMono, fontSize: 20, color: scoreColor(entry.weighted), fontWeight: 700 }}>
              {entry.weighted.toFixed(1)}
              <span style={{ fontSize: 11, color: "#5b5b7d" }}> / 100</span>
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
              {entry.pros.map((item) => (
                <span
                  key={item.id}
                  style={{
                    fontFamily: fontMono,
                    fontSize: 10,
                    color: "#22c55e",
                    background: "#0b2a1a",
                    borderRadius: 12,
                    padding: "2px 8px",
                  }}
                >
                  {item.icon} {item.name} {item.score}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div style={{ background: "#0d0d22", border: "1px solid #1a1a30", borderRadius: 12, padding: 12, marginBottom: 16 }}>
        <div style={{ fontFamily: fontMono, fontSize: 10, color: "#a5b4fc", letterSpacing: 1, marginBottom: 10 }}>
          CATEGORY COMPARISON (ALL SCORES)
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `180px repeat(${battleCountries.length}, minmax(220px, 1fr))`,
            gap: 10,
          }}
        >
          <div />
          {battleCountries.map((entry) => (
            <div key={`${entry.country.c}-header`} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>{entry.country.f}</span>
              <span style={{ fontFamily: fontSerif, fontSize: 14, fontWeight: 700 }}>{entry.country.n}</span>
            </div>
          ))}

          {comparisonMatrix.map((row) => (
            <Fragment key={row.category.id}>
              <div style={{ fontFamily: fontMono, fontSize: 11, color: "#6b6b8d" }}>
                {row.category.icon} {row.category.name}
              </div>
              {row.cells.map((cell) => (
                <div
                  key={`${row.category.id}-${cell.country.c}`}
                  style={{
                    background: cell.status === "weak" ? "#1a0f16" : cell.status === "pro" ? "#0b2a1a" : "#101028",
                    border: "1px solid #1a1a30",
                    borderRadius: 8,
                    padding: "8px 10px",
                    minHeight: 54,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontFamily: fontMono, fontSize: 11, color: scoreColor(cell.score) }}>
                      {cell.score}/10
                    </span>
                    {cell.status !== "mid" && (
                      <span
                        style={{
                          fontFamily: fontMono,
                          fontSize: 9,
                          color: cell.status === "pro" ? "#22c55e" : "#f87171",
                          background: cell.status === "pro" ? "#0b2a1a" : "#2a0b1b",
                          borderRadius: 10,
                          padding: "2px 6px",
                        }}
                      >
                        {cell.status === "pro" ? "PRO" : "WEAK"}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#8888aa", lineHeight: 1.5 }}>{cell.text}</div>
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: 16 }}>
        <div style={{ background: "#0d0d22", border: "1px solid #1a1a30", borderRadius: 10, padding: 12 }}>
          <div style={{ fontFamily: fontMono, fontSize: 10, color: "#22c55e", letterSpacing: 1, marginBottom: 6 }}>
            WHAT ALL 5 GOT RIGHT
          </div>
          {allFiveStrong.length === 0 ? (
            <p style={{ fontSize: 12, color: "#8888aa", margin: 0 }}>No category clears {CONSISTENT_THRESHOLD}/10 across all five.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {allFiveStrong.map((cat) => (
                <span
                  key={cat.id}
                  style={{
                    fontFamily: fontMono,
                    fontSize: 10,
                    color: "#22c55e",
                    border: "1px solid #1f3322",
                    borderRadius: 12,
                    padding: "2px 8px",
                  }}
                >
                  {cat.icon} {cat.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: "#0d0d22", border: "1px solid #1a1a30", borderRadius: 10, padding: 12 }}>
          <div style={{ fontFamily: fontMono, fontSize: 10, color: "#a855f7", letterSpacing: 1, marginBottom: 6 }}>
            HOW TO MAKE THE FINAL CALL
          </div>
          <div style={{ fontSize: 12, color: "#8888aa", lineHeight: 1.6 }}>
            <p style={{ margin: "0 0 6px" }}>
              Your top priorities: <strong style={{ color: "#c7b8ff" }}>{priorityLabels.join(", ")}</strong>.
            </p>
            <p style={{ margin: "0 0 6px" }}>
              {priorityLeaders.map((item) => (
                <span key={item.category.id} style={{ display: "block" }}>
                  {item.category.icon} {item.category.name}: {item.leaders.map((leader) => leader.countryEntry.country.n).join(" / ")}
                </span>
              ))}
            </p>
            {decisiveCategory && (
              <p style={{ margin: 0 }}>
                Biggest separator: <strong style={{ color: "#fca5a5" }}>{decisiveCategory.category.name}</strong>.
              </p>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: "#101028", border: "1px solid #1a1a30", borderRadius: 12, padding: 14 }}>
        <div style={{ fontFamily: fontMono, fontSize: 10, color: "#fbbf24", letterSpacing: 1, marginBottom: 8 }}>
          RECOMMENDED COUNTRY
        </div>
        {recommendedCountry ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 22 }}>{recommendedCountry.f}</span>
              <span style={{ fontFamily: fontSerif, fontSize: 20, fontWeight: 700 }}>{recommendedCountry.n}</span>
              <span style={{ fontFamily: fontMono, fontSize: 12, color: scoreColor(recommended?.weighted ?? 0) }}>
                {recommended?.weighted.toFixed(1)} / 100
              </span>
            </div>
            <div style={{ fontSize: 13, color: "#8a8aa8", lineHeight: 1.7 }}>
              <p style={{ margin: "0 0 6px" }}>
                You prioritize: <strong style={{ color: "#fef08a" }}>{priorityLabels.join(", ")}</strong>.
              </p>
              <p style={{ margin: "0 0 6px" }}>
                This country leads in: <strong style={{ color: "#a7f3d0" }}>{priorityLeaders
                  .filter((item) => item.leaders.some((leader) => leader.countryEntry.country.c === recommendedCountry.c))
                  .map((item) => item.category.name)
                  .join(", ") || "No single priority category, but strongest overall blend."}</strong>
              </p>
              {recommendedWeakest ? (
                <p style={{ margin: "0 0 6px" }}>
                  Main risk: <strong style={{ color: "#fca5a5" }}>{recommendedWeakest.name}</strong> (impact is {recommendationImpact} given your weights).
                </p>
              ) : null}
              {recommendedBreakdown && (recommendedBreakdown.priorityPenalty < 0.95 || recommendedBreakdown.gatePenalty < 1 || recommendedBreakdown.tierCap) && (
                <p style={{ margin: 0 }}>
                  Ranking adjustments: priority penalty ×{recommendedBreakdown.priorityPenalty.toFixed(2)}
                  {recommendedBreakdown.gatePenalty < 1 ? `, gate penalty ×${recommendedBreakdown.gatePenalty.toFixed(2)}` : ""}
                  {recommendedBreakdown.tierCap ? `, capped at tier ${recommendedBreakdown.tierCap}` : ""}.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p style={{ fontSize: 12, color: "#8888aa", margin: 0 }}>No recommendation available.</p>
        )}
      </div>
    </section>
  );
}
