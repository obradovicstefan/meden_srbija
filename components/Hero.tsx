"use client";

function scrollToProducts() {
  const el = document.getElementById("proizvodi");
  el?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  return (
    <section
      id="pocetna"
      className="relative min-h-[85vh] w-full bg-cover bg-center bg-no-repeat sm:min-h-[90vh]"
      style={{ backgroundImage: "url('/images/hero/hero.webp')" }}
      aria-label="Hero sekcija"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" aria-hidden />

      <div className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-4 py-24 text-center sm:min-h-[90vh]">
        <div className="hero-entrance mx-auto max-w-4xl space-y-6 sm:space-y-8">
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl md:text-6xl lg:text-7xl">
            Meden Srbija
          </h1>
          <p className="text-lg text-[var(--foreground)]/90 sm:text-xl md:text-2xl lg:text-3xl">
            Tradicionalni med i proizvodi od meda. Kvalitet i tradicija u svakom gutljaju.
          </p>
          <div className="pt-2 sm:pt-4">
            <button
              type="button"
              onClick={scrollToProducts}
              className="btn-hover-lift rounded-lg bg-amber-500 px-8 py-3 text-base font-semibold text-black transition-colors hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[var(--background)] sm:px-10 sm:py-4 sm:text-lg"
            >
              Pogledaj proizvode
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
