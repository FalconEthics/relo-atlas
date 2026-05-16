import { Fragment } from "react";
import type { CareerField, Category, CategoryId, CountryData, CountryScores } from "../types";
import { scoreColor, scoreTier } from "../utils/score";
import tableStyles from "../styles/app-table.module.css";

type CountryRow = CountryData & { w: number; es?: CountryScores };

type CountryTableProps = {
  view: CategoryId | "overall";
  countries: CountryRow[];
  activeCategory: Category | undefined;
  selectedField: CareerField;
  expandedRow: string | null;
  onToggleRow: (countryCode: string) => void;
  onOpenDetail: (countryCode: string) => void;
  fontMono: string;
};

export function CountryTable({
  view,
  countries,
  activeCategory,
  selectedField,
  expandedRow,
  onToggleRow,
  onOpenDetail,
  fontMono,
}: CountryTableProps) {
  const isTechView = view === "tech";

  return (
    <div className={tableStyles.tableWrap}>
      <table className={tableStyles.table} style={{ fontFamily: fontMono }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #222" }}>
            <th style={{ padding: "10px 8px", textAlign: "left", color: "#5b5b7d", fontSize: 10, letterSpacing: 1, width: 40 }}>
              #
            </th>
            <th style={{ padding: "10px 8px", textAlign: "left", color: "#5b5b7d", fontSize: 10, letterSpacing: 1 }}>
              COUNTRY
            </th>
            <th
              style={{ padding: "10px 8px", textAlign: "left", color: "#5b5b7d", fontSize: 10, letterSpacing: 1, width: 220 }}
            >
              {view === "overall" ? "WEIGHTED SCORE" : activeCategory?.name.toUpperCase()}
            </th>
            <th style={{ padding: "10px 8px", textAlign: "center", color: "#5b5b7d", fontSize: 10, letterSpacing: 1, width: 60 }}>
              TIER
            </th>
            {view === "overall" && (
              <th style={{ padding: "10px 8px", textAlign: "center", color: "#5b5b7d", fontSize: 10, letterSpacing: 1, width: 60 }}>
                VIEW
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {countries.map((country, index) => {
            const value = view === "overall" ? country.w : (country.es || country.s)[view];
            const tier = scoreTier(country.w);
            const isExpanded = expandedRow === country.c && view !== "overall";
            const categoryInfo =
              view !== "overall"
                ? isTechView
                  ? `${selectedField.name} sector: ${selectedField.notes?.[country.c] ?? selectedField.desc}`
                  : country.d[view]
                : null;
            const categoryScore = view === "overall" ? null : (country.es || country.s)[view];

            return (
              <Fragment key={country.c}>
                <tr
                  className={`${tableStyles.row} ${isExpanded ? tableStyles.rowActive : ""}`}
                  onClick={() => {
                    if (view === "overall") {
                      onOpenDetail(country.c);
                    } else {
                      onToggleRow(country.c);
                    }
                  }}
                  onMouseEnter={(event) => {
                    if (!isExpanded) event.currentTarget.classList.add(tableStyles.rowHover);
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.classList.remove(tableStyles.rowHover);
                  }}
                >
                  <td style={{ padding: "11px 8px", fontWeight: 600 }} className={tableStyles.cellMuted}>
                    {index + 1}
                  </td>
                  <td style={{ padding: "11px 8px" }}>
                    <span style={{ fontSize: 18, marginRight: 8 }}>{country.f}</span>
                    <span className={tableStyles.cellTitle}>{country.n}</span>
                    <span style={{ fontSize: 10, marginLeft: 8 }} className={tableStyles.cellMuted}>
                      {country.r}
                    </span>
                  </td>
                  <td style={{ padding: "11px 8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className={tableStyles.barTrack}>
                        <div
                          style={{
                            width: `${(value / 10) * 100}%`,
                            background: scoreColor(value),
                          }}
                          className={tableStyles.barFill}
                        />
                      </div>
                      <span style={{ color: scoreColor(value), fontWeight: 700, fontSize: 14 }}>
                        {view === "overall" ? value.toFixed(2) : value}
                        <span style={{ fontSize: 10, color: "#4a4a6a" }}>/10</span>
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "11px 8px", textAlign: "center" }}>
                    <span className={tableStyles.tierBadge} style={{ fontFamily: fontMono, background: tier[1] }}>
                      {tier[0]}
                    </span>
                  </td>
                  {view === "overall" && (
                    <td style={{ padding: "11px 8px", textAlign: "center" }}>
                      <span style={{ color: "#6366f1", fontSize: 14 }}>→</span>
                    </td>
                  )}
                </tr>
                {isExpanded && categoryInfo && (
                  <tr className={tableStyles.expandedRow}>
                    <td colSpan={4} style={{ padding: 0 }}>
                      <div className={tableStyles.expandedCard}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 14 }}>{isTechView ? selectedField.icon : activeCategory?.icon}</span>
                          <span style={{ fontFamily: fontMono, fontSize: 12, color: "#a5b4fc", fontWeight: 600 }}>
                            {isTechView ? `${selectedField.name} Sector` : activeCategory?.name}
                          </span>
                           {categoryScore !== null && (
                             <span
                               style={{
                                 fontFamily: fontMono,
                                 fontSize: 11,
                                 color: scoreColor(categoryScore),
                                 fontWeight: 700,
                               }}
                             >
                               {categoryScore}/10
                             </span>
                           )}
                          <span style={{ fontFamily: fontMono, fontSize: 10, color: "#4a4a6a" }}>·</span>
                          <span style={{ fontFamily: fontMono, fontSize: 10, color: "#4a4a6a" }}>
                            Rank #{index + 1} of {countries.length}
                          </span>
                        </div>
                        <p style={{ fontSize: 13, color: "#9999bb", lineHeight: 1.65, margin: 0 }}>{categoryInfo}</p>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            onOpenDetail(country.c);
                          }}
                          type="button"
                          style={{
                            fontFamily: fontMono,
                            fontSize: 10,
                            padding: "5px 12px",
                            borderRadius: 4,
                            marginTop: 10,
                            border: "1px solid #3a3a5a",
                            background: "transparent",
                            color: "#8888cc",
                            cursor: "pointer",
                          }}
                        >
                          View full country breakdown →
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
