export default function Loading() {
  return (
    <section className="section shell" aria-busy="true" aria-live="polite">
      <p className="eyebrow">Loading the current record</p>
      <h1 className="quiet-h1">Keeping the decision in place.</h1>
      <div className="loading-ledger" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="measure">Published identity, price, availability, and state are being retrieved together.</p>
    </section>
  );
}
