type MapPanelProps = {
  open: boolean;
  onToggle: () => void;
  fontMono: string;
};

export function MapPanel({ open, onToggle, fontMono }: MapPanelProps) {
  return (
    <div style={{ marginBottom: 16, border: "1px solid #1a1a2e", borderRadius: 10, overflow: "hidden" }}>
      <button
        onClick={onToggle}
        type="button"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 18px",
          background: "#101028",
          border: "none",
          cursor: "pointer",
          color: "#a0a0c0",
          fontFamily: fontMono,
          fontSize: 12,
        }}
      >
        <span>🗺 Global Overview Map</span>
        <span
          style={{
            color: "#4a4a6a",
            fontSize: 14,
            transition: "transform 0.2s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▾
        </span>
      </button>
      {open && (
        <div style={{ background: "#080818", padding: "12px" }}>
          <img
            src={`${import.meta.env.BASE_URL}Emigration_Scorecard__Global_Overview.png`}
            alt="Emigration Scorecard Global Overview Map"
            style={{ width: "100%", borderRadius: 6, display: "block" }}
          />
          <p
            style={{
              fontFamily: fontMono,
              fontSize: 9,
              color: "#3a3a5a",
              textAlign: "center",
              margin: "8px 0 0",
            }}
          >
            EMIGRATION SCORECARD · GLOBAL OVERVIEW · MAY 2026
          </p>
        </div>
      )}
    </div>
  );
}
