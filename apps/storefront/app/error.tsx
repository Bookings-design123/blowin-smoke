"use client";

export default function ErrorPage({ reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <section className="section shell">
      <p className="eyebrow">Storefront error</p>
      <h1 className="quiet-h1">The page did not finish loading.</h1>
      <p className="measure">
        Your route is still known. Try the page again, return to a division, or take the question to Support.
      </p>
      <div className="button-row">
        <button className="button" type="button" onClick={reset}>
          Try again
        </button>
        <a className="button secondary" href="/support">
          Go to Support
        </a>
      </div>
    </section>
  );
}
