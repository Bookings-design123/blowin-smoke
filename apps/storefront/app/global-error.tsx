"use client";

export default function GlobalError({ reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <html lang="en">
      <body>
        <main id="main" className="section shell">
          <p className="eyebrow">Storefront unavailable</p>
          <h1 className="quiet-h1">The house shell could not load.</h1>
          <p>No product or purchase state is being guessed while the storefront recovers.</p>
          <button className="button" type="button" onClick={reset}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
