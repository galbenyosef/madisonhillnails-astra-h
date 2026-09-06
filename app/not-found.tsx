import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="app-page empty">
      <span className="eyebrow">404 / A LITTLE DETOUR</span>
      <h1 style={{ fontSize: 48 }}>Let’s find your way back.</h1>
      <p style={{ marginTop: 20 }}>That page isn’t here.</p>
      <Link className="button" href="/">
        Back to Madison Hill ↗
      </Link>
    </main>
  );
}
