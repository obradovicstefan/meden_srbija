"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "#pocetna", label: "Početna" },
  { href: "#o-nama", label: "O nama" },
  { href: "#proizvodi", label: "Proizvodi" },
  { href: "#nagrade", label: "Nagrade" },
  { href: "#kontakt", label: "Kontakt" },
];

function getCurrentHash() {
  if (typeof window === "undefined") return "";
  const hash = window.location.hash;
  return hash === "" ? "#pocetna" : hash;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(() => getCurrentHash());

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(getCurrentHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  /* Scroll-spy: highlight nav link for the section currently in view */
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.slice(1));
    const triggerTop = 140;

    const updateActive = () => {
      let activeId: string | null = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= triggerTop) activeId = id;
      }
      if (activeId) setCurrentHash("#" + activeId);
    };

    requestAnimationFrame(updateActive);
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  return (
    <header
      className="sticky top-0 z-50 w-full overflow-visible border-b border-amber-400/30 bg-black/60 backdrop-blur-[10px]"
      aria-label="Zaglavlje"
    >
      {/* Backdrop for mobile menu – tap to close */}
      <div
        className={`mobile-backdrop fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden ${menuOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <div className="relative z-50 mx-auto flex h-14 min-h-14 max-w-7xl items-center justify-between overflow-visible px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="logo-link flex shrink-0 items-center overflow-visible pl-0 pr-3"
          aria-label="Meden Srbija – početna"
        >
          <Image
            src="/images/logo/logo.svg"
            alt="Meden Srbija"
            width={200}
            height={80}
            className="h-32 w-auto object-contain sm:h-36 md:h-40 lg:h-44"
            priority
          />
        </Link>

        <nav
          className="hidden md:flex md:items-center md:gap-10"
          aria-label="Glavna navigacija"
        >
          {navLinks.map(({ href, label }) => {
            const isActive = currentHash === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setCurrentHash(href)}
                className={`nav-link relative rounded text-sm font-semibold uppercase tracking-wider transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${isActive ? "nav-link-active text-amber-400" : "text-[var(--foreground)] hover:text-amber-400"}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--foreground)] transition-colors duration-200 hover:text-amber-400 md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Zatvori meni" : "Otvori meni"}
        >
          <span className="sr-only">{menuOpen ? "Zatvori" : "Meni"}</span>
          <svg
            className="h-6 w-6 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`mobile-menu-panel relative z-50 md:hidden ${menuOpen ? "mobile-menu-panel--open" : "mobile-menu-panel--closed"}`}
        role="region"
        aria-label="Mobilni meni"
        {...(!menuOpen && { inert: true })}
      >
        <div className="border-t border-white/5 bg-[var(--background)]/90 backdrop-blur-sm">
          <nav
            className={`flex flex-col items-center gap-0 px-4 py-4 text-center ${menuOpen ? "mobile-nav-open" : ""}`}
            aria-label="Mobilna navigacija"
          >
            {navLinks.map(({ href, label }) => {
              const isActive = currentHash === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`mobile-nav-link flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md px-3 py-3 text-sm font-semibold uppercase tracking-wider transition-colors duration-200 hover:bg-amber-400/10 hover:text-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-inset ${isActive ? "text-amber-400" : "text-[var(--foreground)]"}`}
                  onClick={() => {
                    setCurrentHash(href);
                    setMenuOpen(false);
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
