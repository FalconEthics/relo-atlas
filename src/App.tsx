import { useMemo, useState } from "react";
import { Header } from "./components/Header";
import { RankingControls } from "./components/RankingControls";
import { CountryTable } from "./components/CountryTable";
import { FinalBattlePanel } from "./components/FinalBattlePanel";
import { InsightsFooter } from "./components/InsightsFooter";
import { CountryDetailModal } from "./components/modals/CountryDetailModal";
import { SettingsModal } from "./components/modals/SettingsModal";
import { SourcesModal } from "./components/modals/SourcesModal";
import { FrameworkModal } from "./components/modals/FrameworkModal";
import { CATEGORIES } from "./data/categories";
import { CAREER_FIELDS } from "./data/career-fields";
import { DESCRIPTIONS } from "./data/descriptions";
import { COUNTRIES } from "./data/countries";
import { useLocalStorageFlag } from "./hooks/useLocalStorageFlag";
import { weightedScore } from "./utils/score";
import type { CareerFieldId, CategoryId, CountryData, CountryScores, RegionFilter } from "./types";
import styles from "./styles/app.module.css";

const FONT_SANS = "'DM Sans', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";
const FONT_SERIF = "'Playfair Display', serif";

type ViewMode = CategoryId | "overall" | "battle";

export default function App() {
  const [view, setView] = useState<ViewMode>("overall");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [catNote, setCatNote] = useState<CategoryId | null>(null);
  const [region, setRegion] = useState<RegionFilter>("All");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showFramework, setShowFramework] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedField, setSelectedField] = useState<CareerFieldId>("technology");
  const [customWeights, setCustomWeights] = useState(CATEGORIES.map((category) => category.w));
  const [showSources, setShowSources] = useState<CategoryId | null>(null);
  const [sourcesField, setSourcesField] = useState<CareerFieldId | null>(null);

  useLocalStorageFlag("reloatlas_configured", () => {
    setTimeout(() => setShowSettings(true), 400);
  });

  const activeCategory = CATEGORIES.find((category) => category.id === view);
  const field = CAREER_FIELDS.find((f) => f.id === selectedField) || CAREER_FIELDS[0];
  const isOverallView = view === "overall" || view === "battle";

  const effectiveScores = (country: CountryData): CountryScores => ({
    ...country.s,
    tech: field.scores[country.c] ?? country.s.tech,
  });

  const sorted = useMemo(() => {
    let list = COUNTRIES.map((country) => {
      const scores = effectiveScores(country);
      return { ...country, es: scores, w: weightedScore(scores, customWeights, CATEGORIES) };
    });

    if (region !== "All") {
      list = list.filter((country) => country.r === region);
    }

    list.sort((a, b) => (isOverallView ? b.w - a.w : (b.es?.[view] ?? 0) - (a.es?.[view] ?? 0)));

    return list;
  }, [view, region, customWeights, selectedField, isOverallView]);

  const topFive = sorted.slice(0, 5);

  const formattedSourcesField = sourcesField ? CAREER_FIELDS.find((entry) => entry.id === sourcesField)?.name ?? field.name : field.name;

  const selectedData = selectedCountry ? COUNTRIES.find((country) => country.c === selectedCountry) || null : null;
  const selectedScore = selectedData ? weightedScore(effectiveScores(selectedData), customWeights, CATEGORIES) : 0;
  const selectedEffective = selectedData ? effectiveScores(selectedData) : null;

  return (
    <div className={styles.app} style={{ fontFamily: FONT_SANS }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:wght@700;800&display=swap"
        rel="stylesheet"
      />

      <Header onShowFramework={() => setShowFramework(true)} onShowSettings={() => setShowSettings(true)} />

      <CountryDetailModal
        open={Boolean(selectedData)}
        country={selectedData}
        weightedScore={selectedScore}
        categories={CATEGORIES}
        selectedField={field}
        effectiveScores={selectedEffective}
        catNote={catNote}
        onToggleCatNote={(id) => setCatNote(id ? (id as CategoryId) : null)}
        onClose={() => {
          setSelectedCountry(null);
          setCatNote(null);
        }}
        fontMono={FONT_MONO}
        fontSerif={FONT_SERIF}
      />

      <RankingControls
        view={view}
        onChangeView={setView}
        region={region}
        onChangeRegion={setRegion}
        activeCategory={activeCategory}
        selectedField={field}
        customWeights={customWeights}
        onOpenSources={setShowSources}
        onSetSourcesField={setSourcesField}
        onClearExpanded={() => setExpandedRow(null)}
        fontMono={FONT_MONO}
        description={view === "tech" ? field.desc : view !== "overall" && view !== "battle" ? DESCRIPTIONS[view] : undefined}
      />

      {view === "battle" ? (
        <FinalBattlePanel
          countries={topFive}
          categories={CATEGORIES}
          customWeights={customWeights}
          selectedField={field}
          effectiveScores={effectiveScores}
          onOpenDetail={(countryCode) => {
            setSelectedCountry(countryCode);
            setCatNote(null);
          }}
          fontMono={FONT_MONO}
          fontSerif={FONT_SERIF}
        />
      ) : (
        <CountryTable
          view={view}
          countries={sorted}
          activeCategory={activeCategory}
          selectedField={field}
          expandedRow={expandedRow}
          onToggleRow={(countryCode) => setExpandedRow(expandedRow === countryCode ? null : countryCode)}
          onOpenDetail={(countryCode) => {
            setSelectedCountry(countryCode);
            setCatNote(null);
          }}
          fontMono={FONT_MONO}
        />
      )}

      <InsightsFooter fontMono={FONT_MONO} />

      <SettingsModal
        open={showSettings}
        onClose={() => {
          setShowSettings(false);
          try {
            localStorage.setItem("reloatlas_configured", "1");
          } catch {
            // Ignore storage errors.
          }
        }}
        categories={CATEGORIES}
        careerFields={CAREER_FIELDS}
        selectedFieldId={selectedField}
        onSelectField={(id) => setSelectedField(id as CareerFieldId)}
        onResetWeights={() => {
          setCustomWeights(CATEGORIES.map((category) => category.w));
          setSelectedField("technology");
        }}
        customWeights={customWeights}
        onChangeWeight={(index, value) =>
          setCustomWeights((weights) => {
            const next = [...weights];
            next[index] = value / 100;
            return next;
          })
        }
        fontMono={FONT_MONO}
        fontSerif={FONT_SERIF}
      />

      <SourcesModal
        open={showSources !== null}
        onClose={() => setShowSources(null)}
        categories={CATEGORIES}
        activeCategoryId={showSources}
        sourcesField={sourcesField}
        sourcesFieldLabel={formattedSourcesField}
        fontMono={FONT_MONO}
        fontSerif={FONT_SERIF}
      />

      <FrameworkModal
        open={showFramework}
        onClose={() => setShowFramework(false)}
        categories={CATEGORIES}
        fontMono={FONT_MONO}
        fontSerif={FONT_SERIF}
      />
    </div>
  );
}
