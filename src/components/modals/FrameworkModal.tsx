import type { Category } from "../../types";
import { DESCRIPTIONS } from "../../data/descriptions";
import { ModalShell } from "../ModalShell";

type FrameworkModalProps = {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  fontMono: string;
  fontSerif: string;
};

export function FrameworkModal({ open, onClose, categories, fontMono, fontSerif }: FrameworkModalProps) {
  const sections = [
    {
      title: null,
      body:
        "Most 'best countries' discussions online are shallow. They reduce an entire country to salary, weather, taxes, safety rankings, and random stereotypes. But long-term emigration is far more complex. A country can look incredible on paper and still feel wrong once you actually live there. This framework evaluates countries more holistically and realistically.",
    },
    {
      title: "What this framework answers",
      body:
        "Can I build a meaningful long-term career there? Will I feel welcomed socially? Is the country likely to stay stable over the next 20–40 years? Does daily life actually feel enjoyable? Is the infrastructure intelligent and future-ready? Can I realistically build wealth and eventually settle permanently? Does the country's culture and historical mindset resonate with me?",
    },
    {
      title: "Scoring system",
      body: "1–3 = Weak / major downside · 4–6 = Mixed / acceptable · 7–8 = Strong · 9–10 = Exceptional",
    },
    {
      title: "Philosophy",
      body:
        "This framework intentionally combines objective metrics, long-term structural analysis, culture and psychology, lived quality-of-life factors, and future-oriented thinking. Some categories matter emotionally. Some matter financially. Some only become important after 10 years. A country that is 'good at everything' is not automatically the best fit. A country that excels at the things you personally value most usually wins.",
    },
  ];

  return (
    <ModalShell open={open} onClose={onClose} maxWidth={860}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontFamily: fontSerif, fontSize: 24, fontWeight: 700, color: "#e2e2e8", margin: "0 0 4px" }}>
            Emigration Research Framework
          </h2>
          <p style={{ fontFamily: fontMono, fontSize: 10, color: "#5b5b7d", margin: 0, letterSpacing: 1 }}>
            METHODOLOGY · SCORING GUIDE · PRIORITY WEIGHTS
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
          ✕ Close
        </button>
      </div>

      {sections.map((section, index) => (
        <div key={index} style={{ marginBottom: 20 }}>
          {section.title && (
            <h3
              style={{
                fontFamily: fontMono,
                fontSize: 11,
                color: "#a5b4fc",
                letterSpacing: 1,
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              {section.title}
            </h3>
          )}
          <p style={{ fontSize: 13, color: "#8888aa", lineHeight: 1.7, margin: 0 }}>{section.body}</p>
        </div>
      ))}

      <div style={{ borderTop: "1px solid #1a1a3a", margin: "24px 0" }} />
      <h3
        style={{
          fontFamily: fontMono,
          fontSize: 11,
          color: "#a5b4fc",
          letterSpacing: 1,
          marginBottom: 16,
          textTransform: "uppercase",
        }}
      >
        Priority Weight Distribution
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 24 }}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#0a0a1e",
              border: "1px solid #1a1a30",
              borderRadius: 6,
              padding: "8px 12px",
            }}
          >
            <span style={{ fontSize: 13, color: "#c0c0d8" }}>
              {cat.icon} {cat.name}
            </span>
            <span style={{ fontFamily: fontMono, fontSize: 12, color: "#6366f1", fontWeight: 700 }}>
              {(cat.w * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid #1a1a3a", margin: "24px 0" }} />
      <h3
        style={{
          fontFamily: fontMono,
          fontSize: 11,
          color: "#a5b4fc",
          letterSpacing: 1,
          marginBottom: 16,
          textTransform: "uppercase",
        }}
      >
        Category Definitions
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {categories.map((cat) => (
          <div
            key={cat.id}
            style={{ background: "#0a0a1e", border: "1px solid #1a1a30", borderRadius: 8, padding: "14px 16px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 16 }}>{cat.icon}</span>
              <span style={{ fontFamily: fontMono, fontSize: 12, color: "#a5b4fc", fontWeight: 700 }}>{cat.name}</span>
              <span style={{ fontFamily: fontMono, fontSize: 10, color: "#4a4a6a", marginLeft: "auto" }}>
                Weight: {(cat.w * 100).toFixed(0)}%
              </span>
            </div>
            <p style={{ fontSize: 12, color: "#7777aa", lineHeight: 1.65, margin: 0 }}>{DESCRIPTIONS[cat.id]}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: "1px solid #1a1a3a", margin: "24px 0" }} />
      <div style={{ background: "#0a0a1e", border: "1px solid #1a1a30", borderRadius: 8, padding: "16px" }}>
        <h3 style={{ fontFamily: fontMono, fontSize: 11, color: "#a5b4fc", letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
          Final Note
        </h3>
        <p style={{ fontSize: 13, color: "#8888aa", lineHeight: 1.7, margin: 0 }}>
          No country is perfect. Every country is a tradeoff between opportunity, stability, culture, freedom, affordability, social
          warmth, and long-term sustainability. This framework exists to make those tradeoffs visible instead of emotional. Think like
          an engineer evaluating systems. But also think like a human being who has to wake up there every morning. That balance is
          where the right answer usually appears.
        </p>
      </div>
    </ModalShell>
  );
}
