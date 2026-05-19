import { useMemo, useState } from "react";
import type { Category, CategoryId, GateRule, PenaltyCurve, ScoringConfig } from "../../types";
import type { WeightProfile, WeightProfileId } from "../../data/weight-profiles";
import { WEIGHT_PROFILES, DEFAULT_PRIORITY_PENALTY_CURVE, DEFAULT_GATES } from "../../data/weight-profiles";
import { CATEGORIES } from "../../data/categories";
import { ModalShell } from "../ModalShell";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  activeProfile: WeightProfile;
  onResetWeights: () => void;
  customWeights: number[];
  onChangeWeight: (index: number, value: number) => void;
  activeProfileId: WeightProfileId | "custom";
  onSelectProfile: (id: WeightProfileId) => void;
  scoringConfig: ScoringConfig | null;
  onChangeScoringConfig: (config: ScoringConfig | null) => void;
  fontMono: string;
  fontSerif: string;
};

const PENALTY_CURVE_DEFAULTS: PenaltyCurve = { ...DEFAULT_PRIORITY_PENALTY_CURVE };

function buildScoringConfig(partial: Partial<ScoringConfig>, prev: ScoringConfig | null): ScoringConfig {
  return {
    gates: partial.gates ?? prev?.gates ?? null,
    priorities: partial.priorities ?? prev?.priorities ?? null,
    priorityCount: partial.priorityCount ?? prev?.priorityCount ?? 4,
    penaltyCurve: partial.penaltyCurve ?? prev?.penaltyCurve ?? null,
    penaltyPower: partial.penaltyPower ?? prev?.penaltyPower ?? 1,
  };
}

export function SettingsModal({
  open,
  onClose,
  categories,
  activeProfile,
  onResetWeights,
  customWeights,
  onChangeWeight,
  activeProfileId,
  onSelectProfile,
  scoringConfig,
  onChangeScoringConfig,
  fontMono,
  fontSerif,
}: SettingsModalProps) {
  const totalWeight = Math.round(customWeights.reduce((sum, weight) => sum + weight * 100, 0));
  const totalOk = totalWeight === 100;
  const [showAdvanced, setShowAdvanced] = useState(false);

  const weightsMatchProfile = (profileId: WeightProfileId) => {
    const profile = WEIGHT_PROFILES.find((p) => p.id === profileId);
    if (!profile) return false;
    return CATEGORIES.every((cat, i) => {
      const profileWeight = Math.round((profile.weights[cat.id as CategoryId] ?? 0) * 100);
      const currentWeight = Math.round(customWeights[i] * 100);
      return profileWeight === currentWeight;
    });
  };

  const effectiveProfileId: WeightProfileId | "custom" =
    activeProfileId !== "custom" && weightsMatchProfile(activeProfileId) ? activeProfileId : "custom";

  const profileGates = activeProfile.gates ?? DEFAULT_GATES;

  const effectiveGates: GateRule[] = scoringConfig?.gates ?? profileGates;

  const effectivePriorities = scoringConfig?.priorities ?? activeProfile.priorities ?? "auto";

  const priorityMode: "auto" | "manual" =
    effectivePriorities !== "auto" ? "manual" : "auto";

  const priorityCount = scoringConfig?.priorityCount ?? 4;

  const autoPriorities = useMemo(() => {
    return [...categories]
      .map((cat, index) => ({ cat, weight: customWeights[index] }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, priorityCount)
      .map((entry) => entry.cat);
  }, [categories, customWeights, priorityCount]);

  const effectiveCurve = scoringConfig?.penaltyCurve ?? activeProfile.priorityPenaltyCurve ?? PENALTY_CURVE_DEFAULTS;

  const effectivePower = scoringConfig?.penaltyPower ?? activeProfile.priorityPenaltyPower ?? 1;

  const updateGates = (gates: GateRule[]) => {
    onChangeScoringConfig(buildScoringConfig({ gates }, scoringConfig));
  };

  const toggleGate = (index: number) => {
    const gates = [...effectiveGates];
    const existing = gates[index];
    if (existing.label?.startsWith("__disabled__")) {
      gates[index] = { ...existing, label: existing.label.replace("__disabled__", "") };
    } else {
      gates[index] = { ...existing, label: `__disabled__${existing.label ?? ""}` };
    }
    updateGates(gates);
  };

  const isGateEnabled = (gate: GateRule) => !gate.label?.startsWith("__disabled__");

  const updateGate = (index: number, updates: Partial<GateRule>) => {
    const gates = [...effectiveGates];
    gates[index] = { ...gates[index], ...updates };
    updateGates(gates);
  };

  const addGate = () => {
    const gates = [...effectiveGates, { id: "immi" as CategoryId, minScore: 3 }];
    updateGates(gates);
  };

  const removeGate = (index: number) => {
    const gates = effectiveGates.filter((_, i) => i !== index);
    updateGates(gates);
  };

  const resetGates = () => {
    onChangeScoringConfig(buildScoringConfig({ gates: null }, scoringConfig));
  };

  const updateCurveValue = (score: number, value: number) => {
    const curve = { ...effectiveCurve, [score]: Math.round(value * 100) / 100 };
    onChangeScoringConfig(buildScoringConfig({ penaltyCurve: curve }, scoringConfig));
  };

  const resetCurve = () => {
    onChangeScoringConfig(buildScoringConfig({ penaltyCurve: null }, scoringConfig));
  };

  const updatePower = (power: number) => {
    onChangeScoringConfig(buildScoringConfig({ penaltyPower: power }, scoringConfig));
  };

  return (
    <ModalShell open={open} onClose={onClose} maxWidth={900}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: fontSerif, fontSize: 22, fontWeight: 700, color: "#e2e2e8", margin: "0 0 4px" }}>
            ⚙ Settings & Personalisation
          </h2>
          <p style={{ fontFamily: fontMono, fontSize: 10, color: "#5b5b7d", margin: 0, letterSpacing: 1 }}>
            WEIGHT PROFILES · SCORING CONTROLS · SCORES UPDATE LIVE
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
          WEIGHT PROFILE
        </div>
        <p style={{ fontSize: 12, color: "#6b6b8d", margin: "0 0 12px", lineHeight: 1.6 }}>
          Pick a preset or customise manually. Your config is saved automatically.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 8 }}>
          {WEIGHT_PROFILES.map((profile) => {
            const isActive = effectiveProfileId === profile.id;
            return (
              <button
                key={profile.id}
                onClick={() => onSelectProfile(profile.id)}
                type="button"
                style={{
                  fontFamily: fontMono,
                  fontSize: 11,
                  padding: "10px 12px",
                  borderRadius: 8,
                  textAlign: "left",
                  cursor: "pointer",
                  border: isActive ? "1px solid #8b5cf6" : "1px solid #1a1a30",
                  background: isActive ? "#2e1065" : "#0a0a1e",
                  color: isActive ? "#c4b5fd" : "#6b6b8d",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 12 }}>{profile.name}</div>
                <div style={{ fontSize: 10, opacity: 0.7, lineHeight: 1.4 }}>{profile.tagline}</div>
              </button>
            );
          })}
          {effectiveProfileId === "custom" && (
            <div
              style={{
                fontFamily: fontMono,
                fontSize: 11,
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #f59e0b40",
                background: "#0a0a1e",
                color: "#f59e0b",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 12 }}>Custom</div>
              <div style={{ fontSize: 10, opacity: 0.7, lineHeight: 1.4 }}>Manually adjusted settings</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: fontMono, fontSize: 11, color: "#a5b4fc", letterSpacing: 1, marginBottom: 12 }}>
          PRIORITY PENALTIES
        </div>
        <p style={{ fontSize: 12, color: "#6b6b8d", margin: "0 0 12px", lineHeight: 1.6 }}>
          Countries scoring low in your priority categories receive extra penalties. You can auto-pick based on your highest-weighted categories or select manually.
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: "#a0a0c0" }}>Mode:</span>
          <button
            onClick={() => {
              if (priorityMode === "manual") {
                onChangeScoringConfig(buildScoringConfig({ priorities: "auto" }, scoringConfig));
              }
            }}
            type="button"
            style={{
              fontFamily: fontMono,
              fontSize: 11,
              padding: "5px 12px",
              borderRadius: 6,
              border: priorityMode === "auto" ? "1px solid #8b5cf6" : "1px solid #1a1a30",
              background: priorityMode === "auto" ? "#2e1065" : "transparent",
              color: priorityMode === "auto" ? "#c4b5fd" : "#6b6b8d",
              cursor: "pointer",
            }}
          >
            Auto
          </button>
          <button
            onClick={() => {
              if (priorityMode === "auto") {
                const ids = autoPriorities.map((cat) => cat.id);
                onChangeScoringConfig(buildScoringConfig({ priorities: ids }, scoringConfig));
              }
            }}
            type="button"
            style={{
              fontFamily: fontMono,
              fontSize: 11,
              padding: "5px 12px",
              borderRadius: 6,
              border: priorityMode === "manual" ? "1px solid #8b5cf6" : "1px solid #1a1a30",
              background: priorityMode === "manual" ? "#2e1065" : "transparent",
              color: priorityMode === "manual" ? "#c4b5fd" : "#6b6b8d",
              cursor: "pointer",
            }}
          >
            Manual
          </button>
        </div>

        {priorityMode === "auto" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: "#a0a0c0" }}>Top</span>
            <select
              value={priorityCount}
              onChange={(e) => onChangeScoringConfig(buildScoringConfig({ priorityCount: Number(e.target.value) }, scoringConfig))}
              style={{
                fontFamily: fontMono,
                fontSize: 11,
                padding: "4px 8px",
                borderRadius: 4,
                background: "#0a0a1e",
                color: "#c4b5fd",
                border: "1px solid #2a2a4a",
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span style={{ fontSize: 12, color: "#a0a0c0" }}>highest-weighted categories</span>
          </div>
        ) : null}

        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          padding: "10px 12px",
          background: "#0a0a1e",
          borderRadius: 8,
          border: "1px solid #1a1a30",
          marginBottom: 12,
        }}>
          {priorityMode === "auto" ? (
            autoPriorities.map((cat) => (
              <span key={cat.id} style={{ fontFamily: fontMono, fontSize: 10, color: "#a5b4fc" }}>
                {cat.icon} {cat.name}
              </span>
            ))
          ) : (
            categories.map((cat) => {
              const selected = Array.isArray(effectivePriorities) ? effectivePriorities.includes(cat.id) : false;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    const current = Array.isArray(effectivePriorities) ? effectivePriorities : [];
                    const next = selected
                      ? current.filter((id) => id !== cat.id)
                      : [...current, cat.id];
                    onChangeScoringConfig(buildScoringConfig({ priorities: next }, scoringConfig));
                  }}
                  type="button"
                  style={{
                    fontFamily: fontMono,
                    fontSize: 10,
                    padding: "4px 10px",
                    borderRadius: 12,
                    border: selected ? "1px solid #8b5cf6" : "1px solid #2a2a4a",
                    background: selected ? "#2e1065" : "transparent",
                    color: selected ? "#c4b5fd" : "#6b6b8d",
                    cursor: "pointer",
                  }}
                >
                  {cat.icon} {cat.name}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: fontMono, fontSize: 11, color: "#a5b4fc", letterSpacing: 1, marginBottom: 12 }}>
          GATE RULES
        </div>
        <p style={{ fontSize: 12, color: "#6b6b8d", margin: "0 0 12px", lineHeight: 1.6 }}>
          Gate rules apply hard penalties when a country scores below a threshold in a category. Multiple rules for the same category stack.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
          {effectiveGates.map((gate, index) => {
            const enabled = isGateEnabled(gate);
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  background: "#0a0a1e",
                  borderRadius: 6,
                  border: "1px solid #1a1a30",
                  opacity: enabled ? 1 : 0.4,
                }}
              >
                <button
                  onClick={() => toggleGate(index)}
                  type="button"
                  style={{
                    fontFamily: fontMono,
                    fontSize: 10,
                    padding: "2px 6px",
                    borderRadius: 3,
                    border: enabled ? "1px solid #22c55e" : "1px solid #555",
                    background: enabled ? "#0b2a1a" : "transparent",
                    color: enabled ? "#22c55e" : "#555",
                    cursor: "pointer",
                    minWidth: 30,
                  }}
                >
                  {enabled ? "ON" : "OFF"}
                </button>

                <span style={{ fontSize: 12, color: "#a0a0c0", minWidth: 120 }}>
                  {categories.find((cat) => cat.id === gate.id)?.icon}{" "}
                  {categories.find((cat) => cat.id === gate.id)?.name ?? gate.id}
                </span>

                <span style={{ fontSize: 11, color: "#6b6b8d" }}>{"<"}</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={gate.minScore}
                  onChange={(e) => updateGate(index, { minScore: Number(e.target.value) })}
                  style={{ width: 60, accentColor: "#6366f1", cursor: "pointer" }}
                />
                <span style={{ fontFamily: fontMono, fontSize: 11, color: "#a5b4fc", minWidth: 20 }}>
                  {gate.minScore}
                </span>

                <span style={{ fontSize: 11, color: "#6b6b8d" }}>Cap</span>
                <select
                  value={gate.capTier ?? "none"}
                  onChange={(e) => updateGate(index, { capTier: e.target.value === "none" ? undefined : e.target.value as "A" | "B" | "C" | "D" | "E" })}
                  style={{
                    fontFamily: fontMono,
                    fontSize: 10,
                    padding: "2px 4px",
                    borderRadius: 3,
                    background: "#0a0a1e",
                    color: "#a5b4fc",
                    border: "1px solid #2a2a4a",
                  }}
                >
                  <option value="none">—</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>

                <span style={{ fontSize: 11, color: "#6b6b8d" }}>×</span>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.01"
                  value={gate.penaltyMultiplier ?? 1}
                  onChange={(e) => updateGate(index, { penaltyMultiplier: Number(e.target.value) })}
                  style={{ width: 50, accentColor: "#6366f1", cursor: "pointer" }}
                />
                <span style={{ fontFamily: fontMono, fontSize: 11, color: "#a5b4fc", minWidth: 30 }}>
                  {gate.penaltyMultiplier?.toFixed(2) ?? "1.00"}
                </span>

                <button
                  onClick={() => removeGate(index)}
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                    fontSize: 13,
                    padding: "2px 4px",
                  }}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={addGate}
            type="button"
            style={{
              fontFamily: fontMono,
              fontSize: 10,
              padding: "5px 12px",
              borderRadius: 5,
              border: "1px solid #3a3a5a",
              background: "transparent",
              color: "#8888cc",
              cursor: "pointer",
            }}
          >
            + Add gate rule
          </button>
          <button
            onClick={resetGates}
            type="button"
            style={{
              fontFamily: fontMono,
              fontSize: 10,
              padding: "5px 12px",
              borderRadius: 5,
              border: "1px solid #3a3a5a",
              background: "transparent",
              color: "#8888cc",
              cursor: "pointer",
            }}
          >
            ↺ Reset to profile defaults
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            type="button"
            style={{
              fontFamily: fontMono,
              fontSize: 11,
              color: "#a5b4fc",
              letterSpacing: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              fontWeight: 700,
            }}
          >
            {showAdvanced ? "▼" : "▶"} ADVANCED — PENALTY CURVE & POWER
          </button>
        </div>

        {showAdvanced && (
          <div style={{ background: "#0a0a1e", border: "1px solid #1a1a30", borderRadius: 8, padding: "14px 16px" }}>
            <p style={{ fontSize: 12, color: "#6b6b8d", margin: "0 0 12px", lineHeight: 1.6 }}>
              The penalty curve maps a priority category score (1-10) to a multiplier. A score of 3 gets multiplied by 0.52 — a 48% penalty. Higher values = gentler penalties.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px", marginBottom: 14 }}>
              {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((score) => (
                <div key={score} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontFamily: fontMono, fontSize: 11, color: "#a0a0c0", minWidth: 16 }}>
                    {score}:
                  </span>
                  <span style={{ fontSize: 11, color: "#6b6b8d" }}>×</span>
                  <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.01"
                    value={effectiveCurve[score] ?? 1}
                    onChange={(e) => updateCurveValue(score, Number(e.target.value))}
                    style={{ flex: 1, accentColor: "#6366f1", cursor: "pointer" }}
                  />
                  <input
                    type="number"
                    min="0.05"
                    max="1"
                    step="0.01"
                    value={effectiveCurve[score] ?? 1}
                    onChange={(e) => {
                      const v = Math.max(0.05, Math.min(1, Number(e.target.value)));
                      updateCurveValue(score, v);
                    }}
                    style={{
                      fontFamily: fontMono,
                      fontSize: 10,
                      width: 50,
                      padding: "2px 4px",
                      borderRadius: 3,
                      background: "#111128",
                      color: "#a5b4fc",
                      border: "1px solid #2a2a4a",
                      textAlign: "right",
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontFamily: fontMono, fontSize: 11, color: "#a0a0c0" }}>Penalty power:</span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={effectivePower}
                onChange={(e) => updatePower(Number(e.target.value))}
                style={{ width: 120, accentColor: "#6366f1", cursor: "pointer" }}
              />
              <span style={{ fontFamily: fontMono, fontSize: 11, color: "#a5b4fc" }}>×{effectivePower.toFixed(1)}</span>
              <span style={{ fontSize: 10, color: "#6b6b8d" }}>1.0 = default, higher = steeper penalties</span>
            </div>

            <button
              onClick={resetCurve}
              type="button"
              style={{
                fontFamily: fontMono,
                fontSize: 10,
                padding: "5px 12px",
                borderRadius: 5,
                border: "1px solid #3a3a5a",
                background: "transparent",
                color: "#8888cc",
                cursor: "pointer",
              }}
            >
              ↺ Reset curve to defaults
            </button>
          </div>
        )}
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
                <span style={{ fontSize: 14, flexShrink: 0 }}>{category.id === "tech" ? "💻" : category.icon}</span>
                <span style={{ fontSize: 12, color: "#a0a0c0", minWidth: 140, flexShrink: 0 }}>
                  {category.id === "tech" ? "Tech Sector" : category.name}
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
