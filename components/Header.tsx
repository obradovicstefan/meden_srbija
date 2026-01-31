"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "#pocetna", label: "Početna" },
  { href: "#o-nama", label: "O nama" },
  { href: "#proizvodi", label: "Proizvodi" },
  { href: "#nagrade", label: "Nagrade" },
  { href: "#kontakt", label: "Kontakt" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full overflow-visible border-b border-white/10 bg-[var(--background)]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 min-h-16 max-w-7xl items-center justify-between overflow-visible px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center overflow-visible" aria-label="Meden Srbija – početna">
          <Image
            src="/images/logo/logo.webp"
            alt="Meden Srbija"
            width={660}
            height={264}
            className="h-[10.5rem] w-auto object-contain sm:h-48"
            priority
          />
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-8" aria-label="Glavna navigacija">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-semibold uppercase tracking-wider text-amber-400 transition-all duration-200 hover:scale-110 hover:text-amber-300 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md text-amber-400 transition-colors hover:text-amber-300 md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Zatvori meni" : "Otvori meni"}
        >
          <span className="sr-only">{menuOpen ? "Zatvori" : "Meni"}</span>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`md:hidden ${menuOpen ? "block" : "hidden"} border-t border-white/10 bg-[var(--background)]`}
        role="region"
        aria-label="Mobilni meni"
      >
        <nav className="flex flex-col gap-0 px-4 py-4" aria-label="Mobilna navigacija">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-2 text-sm font-semibold uppercase tracking-wider text-amber-400 transition-all duration-200 hover:bg-amber-400/10 hover:text-amber-300 hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
