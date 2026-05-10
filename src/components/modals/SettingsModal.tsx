import type { CareerField, Category } from "../../types";
import { ModalShell } from "../ModalShell";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  careerFields: CareerField[];
  selectedFieldId: string;
  onSelectField: (id: string) => void;
  onResetWeights: () => void;
  customWeights: number[];
  onChangeWeight: (index: number, value: number) => void;
  fontMono: string;
  fontSerif: string;
};

export function SettingsModal({
  open,
  onClose,
  categories,
  careerFields,
  selectedFieldId,
  onSelectField,
  onResetWeights,
  customWeights,
  onChangeWeight,
  fontMono,
  fontSerif,
}: SettingsModalProps) {
  const totalWeight = Math.round(customWeights.reduce((sum, weight) => sum + weight * 100, 0));
  const totalOk = totalWeight === 100;
  const currentField = careerFields.find((field) => field.id === selectedFieldId) || careerFields[0];

  return (
    <ModalShell open={open} onClose={onClose} maxWidth={900}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: fontSerif, fontSize: 22, fontWeight: 700, color: "#e2e2e8", margin: "0 0 4px" }}>
            ⚙ Settings & Personalisation
          </h2>
          <p style={{ fontFamily: fontMono, fontSize: 10, color: "#5b5b7d", margin: 0, letterSpacing: 1 }}>
            ADJUST WEIGHTS · CAREER FIELD · SCORES UPDATE LIVE
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onResetWeights}
            type="button"
            style={{
              fontFamily: fontMono,
              fontSize: 11,
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #3a3a5a",
              background: "transparent",
              color: "#8888aa",
              cursor: "pointer",
            }}
          >
            ↺ Reset Defaults
          </button>
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
            }}
          >
            ✕
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: fontMono, fontSize: 11, color: "#a5b4fc", letterSpacing: 1, marginBottom: 12 }}>
          CAREER FIELD
        </div>
        <p style={{ fontSize: 12, color: "#6b6b8d", margin: "0 0 12px", lineHeight: 1.6 }}>
          Select your industry. The <strong style={{ color: "#c4b5fd" }}>Sector</strong> category scores update for each country based on that
          field's job market, salary ceiling, and career opportunities.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 6 }}>
          {careerFields.map((field) => (
            <button
              key={field.id}
              onClick={() => onSelectField(field.id)}
              type="button"
              style={{
                fontFamily: fontMono,
                fontSize: 11,
                padding: "8px 10px",
                borderRadius: 6,
                textAlign: "left",
                cursor: "pointer",
                border: selectedFieldId === field.id ? "1px solid #8b5cf6" : "1px solid #1a1a30",
                background: selectedFieldId === field.id ? "#2e1065" : "#0a0a1e",
                color: selectedFieldId === field.id ? "#c4b5fd" : "#6b6b8d",
                transition: "all 0.15s",
              }}
            >
              {field.icon} {field.name}
            </button>
          ))}
        </div>
        <div style={{ background: "#0a0a1e", border: "1px solid #2a2a4a", borderRadius: 6, padding: "10px 14px", marginTop: 10 }}>
          <span style={{ fontFamily: fontMono, fontSize: 11, color: "#a5b4fc" }}>
            {currentField.icon} {currentField.name}
          </span>
          <p style={{ fontSize: 12, color: "#6b6b8d", margin: "4px 0 0", lineHeight: 1.5 }}>{currentField.desc}</p>
        </div>
      </div>

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontFamily: fontMono, fontSize: 11, color: "#a5b4fc", letterSpacing: 1 }}>CATEGORY WEIGHTS</div>
          <span style={{ fontFamily: fontMono, fontSize: 13, fontWeight: 700, color: totalOk ? "#22c55e" : "#ef4444" }}>
            Total: {totalWeight}%{!totalOk && " ⚠ must equal 100%"}
          </span>
        </div>
        <p style={{ fontSize: 12, color: "#6b6b8d", margin: "0 0 14px", lineHeight: 1.6 }}>
          Drag sliders to reflect what matters to you. Rankings update instantly. All weights must sum to 100%.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
          {categories.map((category, index) => {
            const pct = Math.round(customWeights[index] * 100);
            return (
              <div
                key={category.id}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid #111128" }}
              >
                <span style={{ fontSize: 14, flexShrink: 0 }}>{category.id === "tech" ? currentField.icon : category.icon}</span>
                <span style={{ fontSize: 12, color: "#a0a0c0", minWidth: 140, flexShrink: 0 }}>
                  {category.id === "tech" ? `${currentField.name.split(" ")[0]} Sector` : category.name}
                </span>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={pct}
                  onChange={(event) => onChangeWeight(index, Number(event.target.value))}
                  style={{ flex: 1, accentColor: "#6366f1", cursor: "pointer", height: 4 }}
                />
                <span
                  style={{
                    fontFamily: fontMono,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#6366f1",
                    minWidth: 32,
                    textAlign: "right",
                  }}
                >
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </ModalShell>
  );
}
