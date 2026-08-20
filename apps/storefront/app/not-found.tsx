import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section shell">
      <p className="eyebrow">Not found</p>
      <h1 className="quiet-h1">That record is not on the published shelf.</h1>
      <p className="measure">
        It may be unpublished, unavailable, changed, or the address may be incomplete. Nothing has been substituted in its place.
      </p>
      <div className="button-row">
        <Link className="button" href="/search">
          Search the house
        </Link>
        <Link className="button secondary" href="/">
          Return home
        </Link>
      </div>
    </section>
  );
}
