import styles from "./thca.module.css";

export default function ThcaLoading() {
  return (
    <section className={styles.loading} role="status" aria-busy="true">
      <div className="shell">
        <p className="eyebrow">THCA</p>
        <h1>Loading published THCA.</h1>
        <p>Product identity, prices, availability, and proof state will stay together when the shelf resolves.</p>
        <div className={styles.loadingLines} aria-hidden="true"><span /><span /><span /></div>
      </div>
    </section>
  );
}
