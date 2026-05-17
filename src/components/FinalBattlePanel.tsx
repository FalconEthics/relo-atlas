import type { Category, CategoryId, CareerField, CountryData, CountryScores } from "../types";
import { scoreColor, scoreTier, weightedScore } from "../utils/score";

type BattleCountry = CountryData & { w: number; es?: CountryScores };

type FinalBattlePanelProps = {
  countries: BattleCountry[];
  categories: Category[];
  customWeights: number[];
  selectedField: CareerField;
  effectiveScores: (country: CountryData) => CountryScores;
  onOpenDetail: (countryCode: string) => void;
  fontMono: string;
  fontSerif: string;
};

const WEAK_THRESHOLD = 5;
const CONSISTENT_THRESHOLD = 7;
const PRIORITY_COUNT = 3;
const PRO_COUNT = 2;
const DRAWBACK_COUNT = 2;
const HEAVY_PENALTY = 0.7;
const SECONDARY_PENALTY = 0.4;
const CONSISTENCY_BONUS = 0.2;

const impactLabel = (value: number) => (value >= 0.12 ? "high" : value >= 0.07 ? "moderate" : "low");

export function FinalBattlePanel({
  countries,
  categories,
  customWeights,
  selectedField,
  effectiveScores,
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
      if (selectedField.id !== "technology") {
        return `${selectedField.name} sector score for ${country.n}: ${score}/10. ${selectedField.desc}`;
      }
      return country.d.tech;
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

    const weighted = weightedScore(effectiveScores(country), customWeights, categories);

    return {
      country,
      scores,
      pros,
      drawbacks,
      weighted,
    };
  });

  const allFiveStrong = categories.filter((cat) =>
    battleCountries.every((entry) => categoryScore(entry.country, cat.id) >= CONSISTENT_THRESHOLD),
  );

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

  const recommendationScores = battleCountries.map((entry) => {
    const priorityFit = topWeightedCategories.reduce((total, item) => {
      const score = categoryScore(entry.country, item.category.id);
      return total + score * item.weight;
    }, 0);

    const penalties = topWeightedCategories
      .filter((item) => categoryScore(entry.country, item.category.id) <= WEAK_THRESHOLD)
      .reduce((total, item, index) => {
        const scale = index === 0 ? HEAVY_PENALTY : SECONDARY_PENALTY;
        return total + item.weight * scale;
      }, 0);

    const weakCount = entry.scores.filter((score) => score.score <= WEAK_THRESHOLD).length;
    const consistencyBonus = Math.max(0, (categories.length - weakCount) / categories.length) * CONSISTENCY_BONUS;

    return {
      entry,
      priorityFit,
      penalties,
      bonus: consistencyBonus,
      total: priorityFit - penalties + consistencyBonus,
    };
  });

  const recommended = [...recommendationScores].sort((a, b) => b.total - a.total)[0];
  const recommendedCountry = recommended?.entry.country;
  const priorityLabels = topWeightedCategories.map((item) => item.category.name);
  const recommendedWeakest = recommended?.entry.drawbacks[0];

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
          The top 5 is recalculated live using your current weights, region filter, and career focus.
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
              {entry.weighted.toFixed(2)}
              <span style={{ fontSize: 11, color: "#5b5b7d" }}> / 10</span>
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        {battleCountries.map((entry) => (
          <div key={`${entry.country.c}-tradeoffs`} style={{ background: "#0d0d22", border: "1px solid #1a1a30", borderRadius: 10, padding: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{entry.country.f}</span>
              <span style={{ fontFamily: fontSerif, fontSize: 16, fontWeight: 700 }}>{entry.country.n}</span>
            </div>
            <div style={{ fontFamily: fontMono, fontSize: 10, color: "#ef4444", letterSpacing: 1, marginBottom: 6 }}>
              DRAWBACKS (LOWEST SCORES)
            </div>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {entry.drawbacks.map((item, index) => (
                <li key={item.id} style={{ marginBottom: index === entry.drawbacks.length - 1 ? 0 : 8 }}>
                  <div style={{ fontFamily: fontMono, fontSize: 11, color: "#6b6b8d", marginBottom: 4 }}>
                    {item.icon} {item.name} · {item.score}/10
                  </div>
                  <div style={{ fontSize: 12, color: "#8888aa", lineHeight: 1.6 }}>{item.text}</div>
                </li>
              ))}
            </ul>
          </div>
        ))}
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
              <span style={{ fontFamily: fontMono, fontSize: 12, color: scoreColor(recommended?.entry.weighted ?? 0) }}>
                {recommended?.entry.weighted.toFixed(2)} / 10
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
                <p style={{ margin: 0 }}>
                  Main risk: <strong style={{ color: "#fca5a5" }}>{recommendedWeakest.name}</strong> (impact is {recommendationImpact} given your weights).
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <p style={{ fontSize: 12, color: "#8888aa", margin: 0 }}>No recommendation available.</p>
        )}
      </div>
    </section>
  );
}
