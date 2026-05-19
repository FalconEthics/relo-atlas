import { useMemo, useState, useEffect } from "react";
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
import { WEIGHT_PROFILES, type WeightProfileId } from "./data/weight-profiles";
import { useLocalStorageFlag } from "./hooks/useLocalStorageFlag";
import { scoreBreakdown } from "./utils/score";
import type { CategoryId, CountryData, CountryScores, RegionFilter } from "./types";
import styles from "./styles/app.module.css";

const FONT_SANS = "'DM Sans', system-ui, sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";
const FONT_SERIF = "'Playfair Display', serif";

const STORAGE_KEYS = {
  configured: "reloatlas_configured",
  weights: "reloatlas_weights",
  profile: "reloatlas_weight_profile",
  region: "reloatlas_region",
};

function loadStoredWeights(): { weights: number[]; profileId: WeightProfileId | "custom" } {
  try {
    const storedWeights = localStorage.getItem(STORAGE_KEYS.weights);
    const storedProfile = localStorage.getItem(STORAGE_KEYS.profile);
    if (storedWeights) {
      const parsed = JSON.parse(storedWeights) as number[];
      if (Array.isArray(parsed) && parsed.length === CATEGORIES.length) {
        return {
          weights: parsed,
          profileId: (storedProfile as WeightProfileId) || "custom",
        };
      }
    }
  } catch {
    // Ignore storage errors.
  }
  return {
    weights: CATEGORIES.map((cat) => cat.w),
    profileId: "mik",
  };
}

function loadStoredRegion(): RegionFilter {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.region);
    if (
      stored &&
      (
        stored === "All" ||
        stored === "Europe" ||
        stored === "Asia" ||
        stored === "Oceania" ||
        stored === "N. America" ||
        stored === "S. America" ||
        stored === "Africa" ||
        stored === "Middle East" ||
        stored === "Caribbean" ||
        stored === "Central America"
      )
    ) {
      return stored as RegionFilter;
    }
  } catch {
    // Ignore storage errors.
  }
  return "All";
}

type ViewMode = CategoryId | "overall" | "battle";

export default function App() {
  const [view, setView] = useState<ViewMode>("overall");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [catNote, setCatNote] = useState<CategoryId | null>(null);
  const [region, setRegion] = useState<RegionFilter>(loadStoredRegion);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showFramework, setShowFramework] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const initialWeights = loadStoredWeights();
  const [customWeights, setCustomWeights] = useState(initialWeights.weights);
  const [activeProfileId, setActiveProfileId] = useState<WeightProfileId | "custom">(initialWeights.profileId);
  const [showSources, setShowSources] = useState<CategoryId | null>(null);

  useLocalStorageFlag(STORAGE_KEYS.configured, () => {
    setTimeout(() => setShowSettings(true), 400);
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.weights, JSON.stringify(customWeights));
    } catch {
      // Ignore storage errors.
    }
  }, [customWeights]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.profile, activeProfileId);
    } catch {
      // Ignore storage errors.
    }
  }, [activeProfileId]);


  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.region, region);
    } catch {
      // Ignore storage errors.
    }
  }, [region]);

  const activeCategory = CATEGORIES.find((category) => category.id === view);
  const activeProfile = WEIGHT_PROFILES.find((profile) => profile.id === activeProfileId) || WEIGHT_PROFILES[0];
  const isOverallView = view === "overall" || view === "battle";

  const effectiveScores = (country: CountryData): CountryScores => ({
    ...country.s,
    tech: CAREER_FIELDS[0].scores[country.c] ?? 0,
  });

  const sorted = useMemo(() => {
    let list = COUNTRIES.map((country) => {
      const scores = effectiveScores(country);
      const breakdown = scoreBreakdown(scores, customWeights, CATEGORIES, activeProfile);
      return { ...country, es: scores, w: breakdown.finalScore, breakdown };
    });

    if (region !== "All") {
      list = list.filter((country) => country.r === region);
    }

    list.sort((a, b) => (isOverallView ? b.w - a.w : (b.es?.[view] ?? 0) - (a.es?.[view] ?? 0)));

    return list;
  }, [view, region, customWeights, isOverallView, activeProfile]);

  const topFive = sorted.slice(0, 5);

  const selectedData = selectedCountry ? COUNTRIES.find((country) => country.c === selectedCountry) || null : null;
  const selectedScore = selectedData ? scoreBreakdown(effectiveScores(selectedData), customWeights, CATEGORIES, activeProfile).finalScore : 0;
  const selectedEffective = selectedData ? effectiveScores(selectedData) : null;
  const selectedBreakdown = selectedData ? scoreBreakdown(effectiveScores(selectedData), customWeights, CATEGORIES, activeProfile) : null;

  const applyProfile = (profileId: WeightProfileId) => {
    const profile = WEIGHT_PROFILES.find((p) => p.id === profileId);
    if (!profile) return;
    const newWeights = CATEGORIES.map((cat) => profile.weights[cat.id] ?? cat.w);
    setCustomWeights(newWeights);
    setActiveProfileId(profileId);
  };

  const updateCustomWeights = (nextWeights: number[]) => {
    const matchedProfile = WEIGHT_PROFILES.find((profile) =>
      CATEGORIES.every((cat, index) => {
        const profileWeight = Math.round((profile.weights[cat.id] ?? 0) * 100);
        const currentWeight = Math.round((nextWeights[index] ?? 0) * 100);
        return profileWeight === currentWeight;
      }),
    );

    setCustomWeights(nextWeights);
    setActiveProfileId(matchedProfile ? matchedProfile.id : "custom");
  };

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
        scoreBreakdown={selectedBreakdown}
        categories={CATEGORIES}
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
        customWeights={customWeights}
        onOpenSources={setShowSources}
        onClearExpanded={() => setExpandedRow(null)}
        fontMono={FONT_MONO}
        description={view === "tech" ? CAREER_FIELDS[0].desc : view !== "overall" && view !== "battle" ? DESCRIPTIONS[view] : undefined}
      />

      {view === "battle" ? (
        <FinalBattlePanel
          countries={topFive}
          categories={CATEGORIES}
          customWeights={customWeights}
          activeProfile={activeProfile}
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
            localStorage.setItem(STORAGE_KEYS.configured, "1");
          } catch {
            // Ignore storage errors.
          }
        }}
        categories={CATEGORIES}
        onResetWeights={() => {
          applyProfile("mik");
          try {
            localStorage.removeItem(STORAGE_KEYS.weights);
            localStorage.removeItem(STORAGE_KEYS.profile);
          } catch {
            // Ignore storage errors.
          }
        }}
        customWeights={customWeights}
        onChangeWeight={(index, value) => {
          updateCustomWeights(
            customWeights.map((weight, i) => (i === index ? value / 100 : weight)),
          );
        }}
        activeProfileId={activeProfileId}
        onSelectProfile={applyProfile}
        fontMono={FONT_MONO}
        fontSerif={FONT_SERIF}
      />

      <SourcesModal
        open={showSources !== null}
        onClose={() => setShowSources(null)}
        categories={CATEGORIES}
        activeCategoryId={showSources}
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
