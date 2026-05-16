import type { Category, CountryData, CountryScores } from "../../types";
import { scoreColor, scoreTier } from "../../utils/score";
import { ModalShell } from "../ModalShell";

type CountryDetailModalProps = {
  open: boolean;
  country: CountryData | null;
  weightedScore: number;
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
        {weightedScore.toFixed(2)}
        <span style={{ fontSize: 13, color: "#6b6b8d" }}> / 10</span>
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

      {[
        { label: "PRIMARY DRAWBACKS", text: country.d.deal, color: "#ef4444" },
        { label: "PARENT PATHWAY", text: country.d.parent, color: "#eab308" },
      ].map((block) => (
        <div
          key={block.label}
          style={{ background: "#0d0d22", border: "1px solid #1a1a30", borderRadius: 8, padding: 14, marginBottom: 8 }}
        >
          <div
            style={{
              fontFamily: fontMono,
              fontSize: 11,
              color: block.color,
              letterSpacing: 1,
              marginBottom: 6,
              fontWeight: 700,
            }}
          >
            {block.label}
          </div>
          <p style={{ fontSize: 13, color: "#8888aa", lineHeight: 1.6, margin: 0 }}>{block.text}</p>
        </div>
      ))}
    </ModalShell>
  );
}
