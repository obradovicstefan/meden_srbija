"use client";

import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "#pocetna", label: "Početna" },
  { href: "#o-nama", label: "O nama" },
  { href: "#proizvodi", label: "Proizvodi" },
  { href: "#nagrade", label: "Nagrade" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function HeroBackground() {
  return (
    <section
      id="pocetna"
      className="relative min-h-screen w-full overflow-hidden"
      aria-label="Hero sekcija"
    >
      {/* Softly blurred full-size background */}
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat blur-sm"
        style={{ backgroundImage: "url('/images/hero/hero.webp')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/35" aria-hidden />

      {/* Centered logo */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="Meden Srbija – početna"
        >
          <Image
            src="/images/logo/logo.webp"
            alt="Meden Srbija"
            width={800}
            height={320}
            className="h-64 w-auto object-contain drop-shadow-lg sm:h-80 md:h-96 lg:h-[28rem] xl:h-[32rem]"
            priority
          />
        </Link>
      </div>

      {/* Nav at bottom of hero section, spread evenly */}
      <nav
        className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-evenly border-t border-amber-400/20 bg-black/30 px-4 py-5 backdrop-blur-sm sm:py-6"
        aria-label="Glavna navigacija"
      >
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="relative text-sm font-semibold uppercase tracking-wider text-amber-400 transition-all duration-200 hover:scale-110 hover:text-amber-300 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
          >
            {label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
