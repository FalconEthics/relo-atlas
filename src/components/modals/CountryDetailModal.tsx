import type { Category, CountryData, CountryScores } from "../../types";
import type { ScoreBreakdown } from "../../utils/score";
import { scoreColor, scoreTier } from "../../utils/score";
import { ModalShell } from "../ModalShell";

type CountryDetailModalProps = {
  open: boolean;
  country: CountryData | null;
  weightedScore: number;
  scoreBreakdown: ScoreBreakdown | null;
  categories: Category[];
  selectedField: { id: string; name: string; icon: string; desc: string };
  effectiveScores: CountryScores | null;
  catNote: string | null;
  onToggleCatNote: (id: string) => void;
  onClose: () => void;
  fontMono: string;
  fontSerif: string;
};

export function CountryDetailModal({
  open,
  country,
  weightedScore,
  scoreBreakdown,
  categories,
  selectedField,
  effectiveScores,
  catNote,
  onToggleCatNote,
  onClose,
  fontMono,
  fontSerif,
}: CountryDetailModalProps) {
  if (!country) return null;

  const categoryScore = (id: Category["id"]) => (id === "tech" ? effectiveScores : country.s)?.[id] ?? 0;

  const stripParentNotes = (text: string) => {
    const cleaned = text
      .split(/(?<=[.!?])\s+/)
      .filter((sentence) => !/parent|parents|adr|super visa/i.test(sentence))
      .join(" ")
      .trim();
    return cleaned.length > 0 ? cleaned : "Immigration pathway remains a notable weakness for long-term settlement.";
  };

  const categoryText = (id: Category["id"], score: number) => {
    if (id === "tech") {
      if (selectedField.id !== "technology") {
        return `${selectedField.name} sector score for ${country.n}: ${score}/10. ${selectedField.desc}`;
      }
      return country.d.tech;
    }

    const baseText = country.d[id];
    return id === "immi" ? stripParentNotes(baseText) : baseText;
  };

  const primaryDrawbacks = categories
    .map((cat, index) => {
      const score = categoryScore(cat.id);
      return {
        ...cat,
        score,
        index,
        text: categoryText(cat.id, score),
      };
    })
    .sort((a, b) => (a.score !== b.score ? a.score - b.score : a.index - b.index));

  const cutoffIndex = Math.min(primaryDrawbacks.length - 1, 2);
  const cutoffScore = primaryDrawbacks[cutoffIndex]?.score ?? 0;
  const displayedDrawbacks = primaryDrawbacks.filter((item, index) => index <= cutoffIndex || item.score === cutoffScore);

  return (
    <ModalShell open={open} onClose={onClose} maxWidth={840} zIndex={1000}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 32 }}>{country.f}</span>
          <span style={{ fontFamily: fontSerif, fontSize: 26, fontWeight: 700 }}>{country.n}</span>
          <span
            style={{
              fontFamily: fontMono,
              fontSize: 10,
              fontWeight: 700,
              padding: "2px 6px",
              borderRadius: 3,
              color: "#0a0a1a",
              background: scoreTier(weightedScore)[1],
            }}
          >
            {`TIER ${scoreTier(weightedScore)[0]}`}
          </span>
        </div>
        <button
          onClick={onClose}
          type="button"
          style={{
            background: "none",
            border: "1px solid #333",
            color: "#888",
            borderRadius: 6,
            padding: "3px 8px",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          ✕
        </button>
      </div>
      <div style={{ fontFamily: fontMono, fontSize: 24, fontWeight: 700, color: scoreColor(weightedScore) }}>
        {weightedScore.toFixed(1)}
        <span style={{ fontSize: 13, color: "#6b6b8d" }}> / 100</span>
      </div>
      <p style={{ color: "#9999bb", fontSize: 14, lineHeight: 1.65, margin: "8px 0 16px" }}>{country.d.sum}</p>

      <div style={{ fontFamily: fontMono, fontSize: 11, color: "#6b6b8d", letterSpacing: 1, marginBottom: 10 }}>
        CATEGORY SCORES — CLICK FOR DETAILS
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 16 }}>
        {categories.map((cat) => {
          const value = (cat.id === "tech" ? effectiveScores : country.s)?.[cat.id] ?? 0;
          const openNote = catNote === cat.id;
          const noteText =
            cat.id === "tech"
              ? selectedField.id !== "technology"
                ? `${selectedField.name} sector score for ${country.n}: ${value}/10. ${selectedField.desc}`
                : country.d.tech
              : country.d[cat.id];

          return (
            <div
              key={cat.id}
              onClick={() => onToggleCatNote(openNote ? "" : cat.id)}
              style={{
                background: openNote ? "#181838" : "#0d0d22",
                border: `1px solid ${openNote ? "#4a4a7a" : "#1a1a30"}`,
                borderRadius: 8,
                padding: "9px 12px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#a0a0c0" }}>
                  {cat.icon} {cat.name}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 50, height: 6, background: "#1a1a2e", borderRadius: 3, overflow: "hidden" }}>
                    <div
                      style={{ width: `${value * 10}%`, height: "100%", background: scoreColor(value), borderRadius: 3 }}
                    />
                  </div>
                  <span style={{ fontFamily: fontMono, fontSize: 13, color: scoreColor(value), fontWeight: 700, minWidth: 18 }}>
                    {value}
                  </span>
                </div>
              </div>
              {openNote && noteText && (
                <p style={{ fontSize: 12, color: "#8888aa", lineHeight: 1.6, marginTop: 8, marginBottom: 0 }}>{noteText}</p>
              )}
            </div>
          );
        })}
      </div>

      {scoreBreakdown && (
        <div style={{ background: "#0d0d22", border: "1px solid #1a1a30", borderRadius: 8, padding: 14, marginBottom: 8 }}>
          <div
            style={{
              fontFamily: fontMono,
              fontSize: 11,
              color: "#38bdf8",
              letterSpacing: 1,
              marginBottom: 6,
              fontWeight: 700,
            }}
          >
            RANKING BREAKDOWN
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            <div style={{ background: "#101028", border: "1px solid #1a1a30", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontFamily: fontMono, fontSize: 10, color: "#94a3b8", marginBottom: 4 }}>Base score</div>
              <div style={{ fontFamily: fontMono, fontSize: 14, color: "#e2e8f0", fontWeight: 700 }}>
                {scoreBreakdown.baseScore.toFixed(1)} / 100
              </div>
            </div>
            <div style={{ background: "#101028", border: "1px solid #1a1a30", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontFamily: fontMono, fontSize: 10, color: "#94a3b8", marginBottom: 4 }}>Priority penalty</div>
              <div style={{ fontFamily: fontMono, fontSize: 14, color: "#fca5a5", fontWeight: 700 }}>
                × {scoreBreakdown.priorityPenalty.toFixed(3)}
              </div>
            </div>
            <div style={{ background: "#101028", border: "1px solid #1a1a30", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontFamily: fontMono, fontSize: 10, color: "#94a3b8", marginBottom: 4 }}>Gate penalty</div>
              <div style={{ fontFamily: fontMono, fontSize: 14, color: "#fbbf24", fontWeight: 700 }}>
                × {scoreBreakdown.gatePenalty.toFixed(3)}
              </div>
            </div>
            <div style={{ background: "#101028", border: "1px solid #1a1a30", borderRadius: 6, padding: "8px 10px" }}>
              <div style={{ fontFamily: fontMono, fontSize: 10, color: "#94a3b8", marginBottom: 4 }}>Final score</div>
              <div style={{ fontFamily: fontMono, fontSize: 14, color: "#a5b4fc", fontWeight: 700 }}>
                {scoreBreakdown.finalScore.toFixed(1)} / 100
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontFamily: fontMono, fontSize: 10, color: "#a5b4fc" }}>Priority penalties</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {scoreBreakdown.priorities.map((item) => (
                <span
                  key={item.id}
                  style={{
                    fontFamily: fontMono,
                    fontSize: 10,
                    color: item.penalty < 0.9 ? "#f87171" : "#cbd5f5",
                    background: "#101028",
                    border: "1px solid #1a1a30",
                    borderRadius: 12,
                    padding: "2px 8px",
                  }}
                >
                  {categories.find((cat) => cat.id === item.id)?.name ?? item.id}: {item.score}/10 → {item.penalty.toFixed(2)}
                </span>
              ))}
            </div>
            {scoreBreakdown.gateImpacts.length > 0 && (
              <>
                <div style={{ fontFamily: fontMono, fontSize: 10, color: "#f59e0b", marginTop: 6 }}>Gate impacts</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {scoreBreakdown.gateImpacts.map((impact) => (
                    <div key={`${impact.rule.id}-${impact.rule.minScore}`} style={{ fontSize: 12, color: "#fca5a5" }}>
                      {categories.find((cat) => cat.id === impact.rule.id)?.name ?? impact.rule.id} {impact.score}/10 —
                      {impact.appliedCap ? ` capped at ${impact.appliedCap}` : ""}
                      {impact.penaltyMultiplier !== 1 ? ` ×${impact.penaltyMultiplier.toFixed(2)}` : ""}
                    </div>
                  ))}
                </div>
              </>
            )}
            {scoreBreakdown.tierCap && (
              <div style={{ fontFamily: fontMono, fontSize: 10, color: "#f59e0b" }}>
                Tier capped at {scoreBreakdown.tierCap}
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ background: "#0d0d22", border: "1px solid #1a1a30", borderRadius: 8, padding: 14, marginBottom: 8 }}>
        <div
          style={{
            fontFamily: fontMono,
            fontSize: 11,
            color: "#ef4444",
            letterSpacing: 1,
            marginBottom: 6,
            fontWeight: 700,
          }}
        >
          PRIMARY DRAWBACKS
        </div>
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {displayedDrawbacks.map((item, index) => (
            <li key={item.id} style={{ marginBottom: index === displayedDrawbacks.length - 1 ? 0 : 10 }}>
              <div style={{ fontFamily: fontMono, fontSize: 11, color: "#6b6b8d", marginBottom: 4 }}>
                {item.icon} {item.name} · {item.score}/10
              </div>
              <div style={{ fontSize: 12, color: "#8888aa", lineHeight: 1.6 }}>{item.text}</div>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ background: "#0d0d22", border: "1px solid #1a1a30", borderRadius: 8, padding: 14, marginBottom: 8 }}>
        <div
          style={{
            fontFamily: fontMono,
            fontSize: 11,
            color: "#eab308",
            letterSpacing: 1,
            marginBottom: 6,
            fontWeight: 700,
          }}
        >
          PARENT PATHWAY
        </div>
        <p style={{ fontSize: 13, color: "#8888aa", lineHeight: 1.6, margin: 0 }}>{country.d.parent}</p>
      </div>
    </ModalShell>
  );
}
