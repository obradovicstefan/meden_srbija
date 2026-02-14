"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import RevealOnScroll from "./RevealOnScroll";
import AwardDetailsModal from "./AwardDetailsModal";

const SWIPE_THRESHOLD_PX = 50;
const AUTO_ADVANCE_MS = 5000;

export type Award = {
  src: string;
  alt: string;
  name: string;
  longDescription?: string;
  /** Optional, e.g. "Zahvalnost pretočena u priznanje." */
  subtitle?: string;
  image?: {
    thumbnail?: string;
    modal?: string;
    zoom?: string;
  };
};

const awards: Award[] = [
  {
    src: "/images/awards/Diploma2025.webp",
    alt: "Beogradski Pobednik 2025",
    name: "Beogradski Pobednik 2025.",
    subtitle: "Zahvalnost pretočena u priznanje.",
    longDescription: `Zahvalnost pretočena u priznanje.

U prestižnom ambijentu hotela Balkan u Beogradu, Poljoprivredno gazdinstvo Stanković ponosno je primilo priznanje „Beogradski pobednik" – za najuspešnije poslovanje u oblasti pčelarstva i za stvaranje izuzetnog brenda Meden.

Ova nagrada ne simbolizuje samo trud, već i ljubav prema prirodi, posvećenost kvalitetu i želju da med – kao najčistiji dar prirode – predstavimo na način koji zaslužuje.

Hvala svima koji prepoznaju naš rad.

Ovo je tek početak.`,
  },
  {
    src: "/images/awards/nagradaOskar.webp",
    alt: "Prvi Oskar Srbije 2022",
    name: "Prvi Oskar Srbije 2022.",
    longDescription: `Dodeljen u Beogradu 2022. godine u hotelu „RADISSON COLLECTION BELGRADE".

Kao nagradu i priznanje Poljoprivrednom gazdinstvu „Stanković" za najuspešnije poslovanje u oblasti proizvodnje i distribucije meda i pčelinjih proizvoda na teritoriji cele Srbije.`,
  },
  {
    src: "/images/awards/result.webp",
    alt: "Izveštaj o kvalitetu uzoraka meda",
    name: "Izveštaj o kvalitetu uzoraka meda",
    longDescription: `Ispitivanje uzoraka meda iz Poljoprivrednog gazdinstva Stankovič je ocenjeno sa najvišom ocenom i dodeljeno zlatno priznanje za kvalitet bagremovog meda.`,
  },
  {
    src: "/images/awards/summit.webp",
    alt: "Summit Success 2022",
    name: "Summit Success 2022.",
    longDescription: `Nagrada dodeljena 2022. godine u Beogradu u hotelu „HYATT REGENCY BELGRADE" za višegodišnji uzastopni uspeh i poslovanje Poljoprivrednog gazdinstva Stanković.`,
  },
  {
    src: "/images/awards/tetovoAcacia.webp",
    alt: "Tetovo Honey Awards 2020 - Bagremov med",
    name: "Tetovo Honey Awards 2020. - Bagremov med",
    longDescription: `Nagrada dodeljena 2020. godine u Tetovu (Severozapadna Makedonija) kao priznanje za kvalitet bagremovog meda visoko plasiranog na trećem mestu na području balkana.`,
  },
  {
    src: "/images/awards/tetovoMeadow.webp",
    alt: "Tetovo Honey Awards 2020 - Livadski med",
    name: "Tetovo Honey Awards 2020. - Livadski med",
    longDescription: `Nagrada dodeljena 2020. godine u Tetovu (Severozapadna Makedonija) kao priznanje za kvalitet livadskog meda sa zasluženim prvim mestom i zlatnom medaljom za područje celog balkana.`,
  },
];

export default function Awards() {
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const carouselWrapRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  /* Carousel state: selectedIndex (0..N-1) drives active slide; prev/next from modulo for loop. Modal (selectedAward, zoomOpen) unchanged. triggerRef = active slide when opening modal so focus returns on close. */
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [advanceProgress, setAdvanceProgress] = useState(0);
  const advanceStartRef = useRef<number>(Date.now());
  const N = awards.length;
  const prevIndex = (selectedIndex - 1 + N) % N;
  const nextIndex = (selectedIndex + 1) % N;

  const goPrev = useCallback(() => {
    setSelectedIndex((i) => (i - 1 + N) % N);
  }, [N]);

  const goNext = useCallback(() => {
    setSelectedIndex((i) => (i + 1) % N);
  }, [N]);

  useEffect(() => {
    const handleCarouselKeyDown = (e: KeyboardEvent) => {
      if (selectedAward != null) return;
      const target = document.activeElement as Node | null;
      if (!target || !carouselWrapRef.current?.contains(target)) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    document.addEventListener("keydown", handleCarouselKeyDown);
    return () => document.removeEventListener("keydown", handleCarouselKeyDown);
  }, [selectedAward, goPrev, goNext]);

  useEffect(() => {
    if (selectedAward != null) {
      setAdvanceProgress(0);
      return;
    }
    advanceStartRef.current = Date.now();
    setAdvanceProgress(0);
    const id = setInterval(() => {
      const elapsed = Date.now() - advanceStartRef.current;
      const p = Math.min(elapsed / AUTO_ADVANCE_MS, 1);
      setAdvanceProgress(p);
      if (p >= 1) {
        goNext();
        advanceStartRef.current = Date.now();
        setAdvanceProgress(0);
      }
    }, 50);
    return () => clearInterval(id);
  }, [selectedAward, selectedIndex, goNext]);

  return (
    <section
      id="nagrade"
      className="border-t border-white/10 bg-[var(--background)] py-16 sm:py-20 lg:py-24"
      aria-labelledby="awards-title"
    >
      <RevealOnScroll>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2
            id="awards-title"
            className="mb-6 text-center text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.5rem]"
          >
            Nagrade i kvalitet
          </h2>
          <div className="awards-heading-accent mb-12 sm:mb-16" aria-hidden />
          <p className="awards-intro mx-auto mb-0 max-w-[800px] text-center text-base leading-[1.7] text-[#c0c0c0] sm:mb-20 sm:text-lg lg:text-xl">
            Prepoznati smo po kvalitetu i tradiciji. Naši proizvodi nose
            priznanja i diplome koje potvrđuju posvećenost prirodnom medu i
            visokim standardima.
          </p>

          {/* Carousel: overflow visible, padding per spec; ref for focus return */}
          <div
            ref={carouselWrapRef}
            className="awards-carousel relative mx-auto max-w-[1600px] overflow-visible px-10 pt-0 pb-8 sm:py-[100px]"
          >
            <button
              type="button"
              onClick={goPrev}
              className="carousel-arrow carousel-arrow-left absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              aria-label="Prethodna nagrada"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="carousel-arrow carousel-arrow-right absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              aria-label="Sledeća nagrada"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div
              className="carousel-track"
              role="region"
              aria-roledescription="carousel"
              aria-label="Nagrade i priznanja"
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                const start = touchStartX.current;
                touchStartX.current = null;
                if (start == null) return;
                const end = e.changedTouches[0].clientX;
                const deltaX = start - end;
                if (deltaX > SWIPE_THRESHOLD_PX) goNext();
                else if (deltaX < -SWIPE_THRESHOLD_PX) goPrev();
              }}
            >
              {awards.map((award, i) => {
                const role =
                  i === selectedIndex
                    ? "active"
                    : i === prevIndex
                      ? "prev"
                      : i === nextIndex
                        ? "next"
                        : "hidden";
                const handleSlideClick = (e: React.MouseEvent) => {
                  if (role === "active") {
                    triggerRef.current = e.currentTarget as HTMLElement;
                    setSelectedAward(award);
                  } else if (role === "prev") goPrev();
                  else if (role === "next") goNext();
                };
                const handleSlideKeyDown = (e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (role === "active") {
                      triggerRef.current = e.currentTarget as HTMLElement;
                      setSelectedAward(award);
                    } else if (role === "prev") goPrev();
                    else if (role === "next") goNext();
                  }
                };
                return (
                  <div
                    key={award.src}
                    className={`carousel-slide carousel-slide-${role}`}
                    data-award-index={i}
                    role="button"
                    tabIndex={role === "hidden" ? -1 : 0}
                    aria-label={
                      role === "active"
                        ? `Pogledaj detalje: ${award.name}`
                        : role === "prev"
                          ? "Prethodna nagrada"
                          : role === "next"
                            ? "Sledeća nagrada"
                            : undefined
                    }
                    aria-hidden={role === "hidden"}
                    aria-current={role === "active" ? "true" : undefined}
                    onClick={handleSlideClick}
                    onKeyDown={handleSlideKeyDown}
                  >
                    <AwardCard award={award} />
                  </div>
                );
              })}
            </div>

            {/* Live region: announces "Nagrada X od Y" when selectedIndex changes; slides use aria-hidden (hidden) and aria-current (active) for context. */}
            <div
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
              role="status"
            >
              Nagrada {selectedIndex + 1} od {awards.length}.
            </div>

            <div
              className="carousel-pagination flex justify-center"
              role="tablist"
              aria-label="Nagrade - stranice"
            >
              <div
                className="carousel-pagination-inner"
                style={{ ["--carousel-active-index" as string]: selectedIndex }}
              >
                <div className="carousel-pagination-indicator" aria-hidden>
                  <div
                    className="carousel-pagination-indicator-fill"
                    style={{ width: `${advanceProgress * 100}%` }}
                  />
                </div>
                {awards.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedIndex(i)}
                    className="flex min-h-[32px] min-w-[32px] items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    role="tab"
                    aria-label={`Nagrada ${i + 1}`}
                    aria-selected={i === selectedIndex}
                  >
                    <span
                      className={`carousel-dot ${i === selectedIndex ? "carousel-dot-active" : ""}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {selectedAward && (
          <AwardDetailsModal
            award={selectedAward}
            onClose={() => setSelectedAward(null)}
            returnFocusRef={triggerRef}
          />
        )}
      </RevealOnScroll>
    </section>
  );
}

type AwardCardProps = {
  award: Award;
};

function AwardCard({ award }: AwardCardProps) {
  return (
    <div className="award-card">
      <div className="award-card-inner">
        <div className="award-image-container">
          <div className="award-certificate">
            <Image
              src={award.image?.thumbnail ?? award.src}
              alt={award.alt}
              fill
              className="object-contain object-center"
              sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 420px"
            />
          </div>
        </div>
        <div className="award-title-container">
          <p className="award-title">{award.name}</p>
        </div>
      </div>
    </div>
  );
}
