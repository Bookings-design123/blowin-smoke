import styles from "./thca.module.css";

export default function ThcaLoading() {
  return (
    <section className={styles.loading} role="status" aria-busy="true">
      <div className="shell">
        <h1>THCA</h1>
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
