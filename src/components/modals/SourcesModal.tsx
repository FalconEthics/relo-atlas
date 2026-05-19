import type { CareerFieldId, Category, CategoryId } from "../../types";
import { AI_NOTE } from "../../data/notes";
import { FIELD_SOURCES, SOURCES } from "../../data/sources";
import { ModalShell } from "../ModalShell";

type SourcesModalProps = {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  activeCategoryId: CategoryId | null;
  sourcesField: CareerFieldId | null;
  sourcesFieldLabel?: string | null;
  fontMono: string;
  fontSerif: string;
};

export function SourcesModal({
  open,
  onClose,
  categories,
  activeCategoryId,
  sourcesField,
  sourcesFieldLabel,
  fontMono,
  fontSerif,
}: SourcesModalProps) {
  if (!activeCategoryId) return null;

  const category = categories.find((cat) => cat.id === activeCategoryId);
  const isField = activeCategoryId === "tech";
  const fieldSources = isField ? FIELD_SOURCES[sourcesField || "technology"] : SOURCES[activeCategoryId] || [];
  const headingLabel = isField ? `${sourcesFieldLabel || "Technology"} Sector` : category?.name;

  return (
    <ModalShell open={open} onClose={onClose} maxWidth={720} zIndex={3000}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h3 style={{ fontFamily: fontSerif, fontSize: 20, fontWeight: 700, color: "#e2e2e8", margin: "0 0 4px" }}>
            {isField ? "⚡" : category?.icon} {" "}
            {headingLabel} — Data Sources
          </h3>
          <p style={{ fontFamily: fontMono, fontSize: 10, color: "#5b5b7d", margin: 0, letterSpacing: 1 }}>
            SOURCES USED TO SCORE THIS CATEGORY ACROSS ALL 64 COUNTRIES
          </p>
        </div>
        <button
          onClick={onClose}
          type="button"
          style={{
            background: "none",
            border: "1px solid #333",
            color: "#888",
            borderRadius: 6,
            padding: "4px 10px",
            cursor: "pointer",
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {fieldSources.map((source, index) => (
          <a
            key={index}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              background: "#0a0a1e",
              border: "1px solid #1a1a30",
              borderRadius: 8,
              padding: "12px 14px",
              textDecoration: "none",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.borderColor = "#4a4a7a";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.borderColor = "#1a1a30";
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: "#c4b5fd", fontWeight: 600 }}>{source.name}</span>
              <span
                style={{
                  fontFamily: fontMono,
                  fontSize: 9,
                  color: "#4a4a6a",
                  background: "#111128",
                  padding: "2px 6px",
                  borderRadius: 3,
                }}
              >
                ↗ OPEN
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#6b6b8d", margin: 0, lineHeight: 1.5 }}>{source.what}</p>
          </a>
        ))}
      </div>

      <p style={{ fontFamily: fontMono, fontSize: 10, color: "#4a4a6a", margin: "0 0 16px", lineHeight: 1.5 }}>
        These are the primary sources used for scoring. Many additional reports, datasets, and expert analyses were also factored in — an exhaustive list is not practical to publish.
      </p>

      {isField && (
        <div style={{ background: "#0a0a1e", border: "1px solid #1a1a30", borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
          <p style={{ fontFamily: fontMono, fontSize: 10, color: "#a5b4fc", letterSpacing: 1, margin: "0 0 6px" }}>
            CATEGORY-LEVEL SOURCES
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {(SOURCES.tech || []).map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 12, color: "#6b6b8d", textDecoration: "none" }}
              >
                ↗ {source.name} — {source.what}
              </a>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: "#0d0d22", border: "1px solid #2a2a3a", borderRadius: 8, padding: "14px 16px" }}>
        <div style={{ fontFamily: fontMono, fontSize: 10, color: "#818cf8", letterSpacing: 1, marginBottom: 8, fontWeight: 700 }}>
          🤖 AI SCORING TRANSPARENCY
        </div>
        <p style={{ fontSize: 12, color: "#7777aa", lineHeight: 1.65, margin: 0 }}>{AI_NOTE}</p>
      </div>
    </ModalShell>
  );
}
