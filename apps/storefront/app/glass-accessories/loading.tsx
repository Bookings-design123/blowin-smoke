import styles from "./glass.module.css";

export default function GlassAccessoriesLoading() {
  return (
    <section className={styles.loading} role="status" aria-busy="true">
      <div className="shell">
        <h1>Glass / Accessories / Merch</h1>
        <p>Loading products</p>
        <div className={styles.loadingCards} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}
