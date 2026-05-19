import styles from "../styles/app.module.css";

type HeaderProps = {
  onShowFramework: () => void;
  onShowSettings: () => void;
};

export function Header({ onShowFramework, onShowSettings }: HeaderProps) {
  return (
    <header className={styles.pageHeader}>
      <h1 className={styles.title}>Relo Atlas</h1>
      <p className={styles.subtitle}>Find your next home. Scored by data, not feelings.</p>
      <p className={styles.tagline}>64 COUNTRIES · 16 CATEGORIES · FULLY PERSONALISED · MAY 2026</p>
      <div className={styles.headerActions}>
        <button className={styles.ghostButton} onClick={onShowFramework} type="button">
          📋 Research Framework & Methodology
        </button>
        <button
          className={`${styles.ghostButton} ${styles.ghostButtonAccent}`}
          onClick={onShowSettings}
          type="button"
        >
          ⚙ Settings & Weights
        </button>
      </div>
    </header>
  );
}
