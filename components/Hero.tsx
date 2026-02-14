"use client";

function scrollToProducts() {
  const el = document.getElementById("proizvodi");
  el?.scrollIntoView({ behavior: "smooth" });
}

function scrollToAbout() {
  const el = document.getElementById("o-nama");
  el?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  return (
    <section
      id="pocetna"
      className="hero-bg-fixed relative min-h-[85vh] w-full bg-cover bg-center bg-no-repeat sm:min-h-[90vh]"
      style={{ backgroundImage: "url('/images/hero/hero.webp')" }}
      aria-label="Hero sekcija"
    >
      {/* Base gradient: slightly darker overall, doesn’t flatten the image */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"
        aria-hidden
      />
      {/* Center lift: lighter through middle so text pops */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50"
        aria-hidden
      />
      {/* Vignette: tightened radial, center stays brighter */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.5) 100%)",
        }}
        aria-hidden
      />

      {/* Decorative honeycomb – subtle, non-interactive */}
      <div
        className="pointer-events-none absolute bottom-12 left-8 z-0 opacity-10 sm:bottom-16 sm:left-12"
        aria-hidden
      >
        <svg
          width="80"
          height="70"
          viewBox="0 0 80 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-amber-400"
        >
          <path
            d="M20 5 L35 12.5 L35 27.5 L20 35 L5 27.5 L5 12.5 Z"
            fill="currentColor"
          />
          <path
            d="M45 22.5 L60 30 L60 45 L45 52.5 L30 45 L30 30 Z"
            fill="currentColor"
          />
          <path
            d="M20 40 L35 47.5 L35 62.5 L20 70 L5 62.5 L5 47.5 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-4 py-28 text-center sm:min-h-[90vh] sm:px-6 sm:py-32 lg:px-8 lg:py-36">
        <div className="hero-entrance mx-auto w-full max-w-5xl space-y-10 sm:space-y-12">
          <p
            className="hero-overline text-sm font-medium uppercase tracking-[0.25em] text-amber-400/90 sm:text-base"
            aria-hidden
          >
            Prirodni med iz Srbije
          </p>
          <h1 className="hero-title font-display text-5xl font-bold tracking-tight text-[var(--foreground)] sm:text-6xl md:text-7xl lg:text-8xl">
            Meden Srbija
          </h1>
          <p className="hero-tagline mx-auto max-w-[65ch] text-base leading-[1.7] text-[var(--foreground)]/90 sm:text-lg">
            Tradicionalni med i proizvodi od meda.
            <br className="hidden sm:block" />
            Kvalitet i tradicija u svakom gutljaju.
          </p>
          <div className="hero-cta flex flex-col items-center gap-4 pt-4 sm:gap-5 sm:pt-6">
            <div
              className="h-px w-16 shrink-0 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent sm:w-24"
              aria-hidden
            />
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-5">
            <button
              type="button"
              onClick={scrollToProducts}
              className="hero-btn-primary btn-hover-lift w-full origin-center rounded-lg border border-amber-400/40 bg-amber-500 px-10 py-4 text-base font-semibold text-black shadow-[0_0_20px_rgba(251,191,36,0.12)] transition-all duration-300 ease-out hover:scale-105 hover:border-amber-400/60 hover:bg-amber-400 hover:shadow-[0_0_24px_rgba(251,191,36,0.2)] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[var(--background)] sm:w-auto sm:px-12 sm:py-5 sm:text-lg"
            >
              Pogledaj proizvode
            </button>
            <button
              type="button"
              onClick={scrollToAbout}
              className="w-full rounded-lg border-2 border-amber-400/60 bg-transparent px-10 py-4 text-base font-semibold text-amber-400/95 transition-all duration-300 ease-out hover:bg-amber-400/20 hover:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-[var(--background)] sm:w-auto sm:px-12 sm:py-5 sm:text-lg"
            >
              O nama
            </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
