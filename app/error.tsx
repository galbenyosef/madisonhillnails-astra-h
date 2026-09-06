"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="app-page empty">
      <h1 style={{ fontSize: 42 }}>A little pause.</h1>
      <p>We couldn’t load this page. Please try again in a moment.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
