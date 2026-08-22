import styles from "./pdp.module.css";

export default function ProductLoading() {
  return (
    <section
      className={styles.loadingOpening}
      aria-labelledby="product-loading-title"
      aria-busy="true"
    >
      <div className={styles.loadingMedia} aria-hidden="true" />
      <div className={styles.loadingCopy}>
        <h1 className="visually-hidden" id="product-loading-title">
          Loading product details
        </h1>
        <span className={styles.loadingLine} aria-hidden="true" />
        <span className={styles.loadingLine} aria-hidden="true" />
        <span className={styles.loadingLine} aria-hidden="true" />
        <span className={styles.loadingLine} aria-hidden="true" />
        <p className="visually-hidden" role="status" aria-live="polite">
          Loading product details.
        </p>
      </div>
    </section>
  );
}
