import { CATEGORIES } from "../data/categories";
import type { CareerField, Category, CategoryId, RegionFilter } from "../types";

type RankingControlsProps = {
  view: CategoryId | "overall";
  onChangeView: (next: CategoryId | "overall") => void;
  region: RegionFilter;
  onChangeRegion: (next: RegionFilter) => void;
  activeCategory: Category | undefined;
  selectedField: CareerField;
  customWeights: number[];
  onOpenSources: (category: CategoryId) => void;
  onSetSourcesField: (fieldId: CareerField["id"] | null) => void;
  onClearExpanded: () => void;
  fontMono: string;
  description: string | undefined;
};

export function RankingControls({
  view,
  onChangeView,
  region,
  onChangeRegion,
  activeCategory,
  selectedField,
  customWeights,
  onOpenSources,
  onSetSourcesField,
  onClearExpanded,
  fontMono,
  description,
}: RankingControlsProps) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <button
          onClick={() => {
            onChangeView("overall");
            onClearExpanded();
          }}
          type="button"
          style={{
            fontFamily: fontMono,
            fontSize: 12,
            padding: "6px 14px",
            borderRadius: 6,
            border: view === "overall" ? "1px solid #6366f1" : "1px solid #2a2a4a",
            background: view === "overall" ? "#1e1b4b" : "transparent",
            color: view === "overall" ? "#a5b4fc" : "#6b6b8d",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          🏆 FINAL RANKING
        </button>
        <span style={{ fontFamily: fontMono, fontSize: 10, color: "#4a4a6a" }}>
          Weighted score across all 16 categories
        </span>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: fontMono, fontSize: 9, color: "#6b6b8d", letterSpacing: 1, marginBottom: 6 }}>
          SORT BY CATEGORY
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                onChangeView(cat.id);
                onClearExpanded();
              }}
              type="button"
              style={{
                fontFamily: fontMono,
                fontSize: 11,
                padding: "5px 10px",
                borderRadius: 5,
                border: view === cat.id ? "1px solid #6366f1" : "1px solid #222",
                background: view === cat.id ? "#1e1b4b" : "transparent",
                color: view === cat.id ? "#a5b4fc" : "#5b5b7d",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {cat.id === "tech" ? selectedField.icon : cat.icon} {" "}
              {cat.id === "tech" ? selectedField.name.split(/\s/)[0] : cat.name.split(/\s/)[0]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {(["All", "Europe", "N. America", "Oceania", "Asia"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => onChangeRegion(filter)}
            type="button"
            style={{
              fontFamily: fontMono,
              fontSize: 11,
              padding: "5px 12px",
              borderRadius: 5,
              border: region === filter ? "1px solid #8b5cf6" : "1px solid #1a1a2e",
              background: region === filter ? "#2e1065" : "transparent",
              color: region === filter ? "#c4b5fd" : "#5b5b7d",
              cursor: "pointer",
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {view !== "overall" && activeCategory && description && (
        <div
          style={{
            background: "#101028",
            border: "1px solid #222",
            borderRadius: 8,
            padding: "14px 16px",
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontFamily: fontMono, fontSize: 13, color: "#a5b4fc", fontWeight: 600 }}>
                {view === "tech" ? selectedField.icon : activeCategory.icon}{" "}
                {view === "tech" ? `${selectedField.name} Sector` : activeCategory.name}
              </span>
              <span style={{ fontFamily: fontMono, fontSize: 11, color: "#5b5b7d" }}>
                Weight: {(customWeights[CATEGORIES.findIndex((cat) => cat.id === view)] * 100).toFixed(0)}%
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: fontMono, fontSize: 10, color: "#4a4a6a" }}>Click row for country details</span>
              <button
                onClick={() => {
                  onOpenSources(view);
                  onSetSourcesField(view === "tech" ? selectedField.id : null);
                }}
                type="button"
                style={{
                  fontFamily: fontMono,
                  fontSize: 10,
                  padding: "4px 10px",
                  borderRadius: 5,
                  border: "1px solid #3a3a5a",
                  background: "transparent",
                  color: "#8888cc",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                📚 Sources
              </button>
            </div>
          </div>
          <p
            style={{
              fontSize: 12,
              color: "#6b6b8d",
              lineHeight: 1.65,
              margin: 0,
              borderTop: "1px solid #1a1a30",
              paddingTop: 10,
            }}
          >
            {description}
          </p>
        </div>
      )}
    </>
  );
}
