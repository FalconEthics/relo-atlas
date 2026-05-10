type InsightsFooterProps = {
  fontMono: string;
};

export function InsightsFooter({ fontMono }: InsightsFooterProps) {
  return (
    <>
      <div style={{ marginTop: 24, padding: "18px 16px", background: "#101028", borderRadius: 10, border: "1px solid #1a1a30" }}>
        <div style={{ fontFamily: fontMono, fontSize: 10, color: "#6b6b8d", letterSpacing: 1, marginBottom: 10 }}>
          KEY CROSS-CUTTING INSIGHTS
        </div>
        <div style={{ fontSize: 13, color: "#8888aa", lineHeight: 1.7 }}>
          <p style={{ margin: "0 0 8px" }}>
            🔴 <strong style={{ color: "#ef4444" }}>Parent sponsorship</strong> is functionally impossible almost everywhere. Only Canada
            (Super Visa), Australia (AUD 95K + 14yr wait), and NZ (ballot) have real options.
          </p>
          <p style={{ margin: "0 0 8px" }}>
            🟡 <strong style={{ color: "#eab308" }}>Dual citizenship rules vary widely</strong> — some countries force you to renounce your
            home passport on their side (NL, AT, ES, SG, JP, KR). Always verify both countries' rules before committing to a
            naturalisation pathway.
          </p>
          <p style={{ margin: 0 }}>
            🟢 <strong style={{ color: "#22c55e" }}>The old hierarchy (US › CA › AU › EU) has shifted</strong>. Mid-tier Europe and Singapore
            increasingly offer better risk-adjusted outcomes depending on your field and priorities.
          </p>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <p style={{ fontFamily: fontMono, fontSize: 10, color: "#3a3a5a", margin: "0 0 4px" }}>
          FINAL RANKING → CLICK ROW FOR FULL BREAKDOWN · CATEGORY VIEW → CLICK ROW FOR REASONING · 📚 SOURCES ON EVERY CATEGORY
        </p>
        <p style={{ fontFamily: fontMono, fontSize: 9, color: "#2a2a4a", margin: 0 }}>
          RELO ATLAS · OPEN SOURCE · BUILT WITH RESEARCH + AI · DEPLOY YOUR OWN ON VERCEL
        </p>
      </div>
    </>
  );
}
