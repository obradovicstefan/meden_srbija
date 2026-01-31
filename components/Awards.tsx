"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import AwardHoverPanel from "./AwardHoverPanel";
import RevealOnScroll from "./RevealOnScroll";

export type Award = {
  src: string;
  alt: string;
  name: string;
  longDescription?: string;
};

const awards: Award[] = [
  {
    src: "/images/awards/Diploma2025.webp",
    alt: "Beogradski Pobednik 2025",
    name: "Beogradski Pobednik 2025.",
    longDescription:
      `Zahvalnost pretočena u priznanje.

U prestižnom ambijentu hotela Balkan u Beogradu, Poljoprivredno gazdinstvo Stanković ponosno je primilo priznanje „Beogradski pobednik" – za najuspešnije poslovanje u oblasti pčelarstva i za stvaranje izuzetnog brenda Meden.

Ova nagrada ne simbolizuje samo trud, već i ljubav prema prirodi, posvećenost kvalitetu i želju da med – kao najčistiji dar prirode – predstavimo na način koji zaslužuje.

Hvala svima koji prepoznaju naš rad.

Ovo je tek početak.`,
  },
  {
    src: "/images/awards/nagradaOskar.webp",
    alt: "Prvi Oskar Srbije 2022",
    name: "Prvi Oskar Srbije 2022.",
    longDescription:
      `Dodeljen u Beogradu 2022. godine u hotelu „RADISSON COLLECTION BELGRADE".

Kao nagradu i priznanje Poljoprivrednom gazdinstvu „Stanković" za najuspešnije poslovanje u oblasti proizvodnje i distribucije meda i pčelinjih proizvoda na teritoriji cele Srbije.`,
  },
  {
    src: "/images/awards/result.webp",
    alt: "Izveštaj o kvalitetu uzoraka meda",
    name: "Izveštaj o kvalitetu uzoraka meda",
    longDescription:
      `Ispitivanje uzoraka meda iz Poljoprivrednog gazdinstva Stankovič je ocenjeno sa najvišom ocenom i dodeljeno zlatno priznanje za kvalitet bagremovog meda.`,
  },
  {
    src: "/images/awards/summit.webp",
    alt: "Summit Success 2022",
    name: "Summit Success 2022.",
    longDescription:
      `Nagrada dodeljena 2022. godine u Beogradu u hotelu „HYATT REGENCY BELGRADE" za višegodišnji uzastopni uspeh i poslovanje Poljoprivrednog gazdinstva Stanković.`,
  },
  {
    src: "/images/awards/tetovoAcacia.webp",
    alt: "Tetovo Honey Awards 2020 - Bagremov med",
    name: "Tetovo Honey Awards 2020. - Bagremov med",
    longDescription:
      `Nagrada dodeljena 2020. godine u Tetovu (Severozapadna Makedonija) kao priznanje za kvalitet bagremovog meda visoko plasiranog na trećem mestu na području balkana.`,
  },
  {
    src: "/images/awards/tetovoMeadow.webp",
    alt: "Tetovo Honey Awards 2020 - Livadski med",
    name: "Tetovo Honey Awards 2020. - Livadski med",
    longDescription:
      `Nagrada dodeljena 2020. godine u Tetovu (Severozapadna Makedonija) kao priznanje za kvalitet livadskog meda sa zasluženim prvim mestom i zlatnom medaljom za područje celog balkana.`,
  },
];

const SLIDE_VIEWPORT_PERCENT = 55;
const OFFSET_PERCENT = (100 - SLIDE_VIEWPORT_PERCENT) / 2;
const TRACK_WIDTH_PERCENT = awards.length * SLIDE_VIEWPORT_PERCENT;
const SLIDE_TRACK_PERCENT = 100 / awards.length;

export default function Awards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredAward, setHoveredAward] = useState<Award | null>(null);
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goPrev = () => {
    setCurrentIndex((i) => (i === 0 ? awards.length - 1 : i - 1));
  };

  const goNext = () => {
    setCurrentIndex((i) => (i === awards.length - 1 ? 0 : i + 1));
  };

  const translatePercent = (OFFSET_PERCENT - currentIndex * SLIDE_VIEWPORT_PERCENT) / (TRACK_WIDTH_PERCENT / 100);

  const handleAwardEnter = (award: Award, rect: DOMRect) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setHoveredRect(rect);
    setHoveredAward(award);
  };

  const handleAwardLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => setHoveredAward(null), 180);
  };

  const handlePanelEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  const handlePanelLeave = () => {
    setHoveredAward(null);
    setHoveredRect(null);
  };

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
          className="mb-6 text-center text-3xl font-bold tracking-tight text-[var(--foreground)] sm:mb-8 sm:text-4xl lg:text-5xl"
        >
          Nagrade i kvalitet
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-center text-base leading-relaxed text-[var(--foreground)]/80 sm:mb-16 sm:text-lg">
          Prepoznati smo po kvalitetu i tradiciji. Naši proizvodi nose priznanja i diplome koje potvrđuju
          posvećenost prirodnom medu i visokim standardima.
        </p>

        <div className="relative mx-auto max-w-5xl">
          <div className="min-h-[280px] overflow-hidden rounded-xl px-2 sm:min-h-[320px] sm:px-4 md:min-h-[360px]">
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{
                width: `${TRACK_WIDTH_PERCENT}%`,
                transform: `translateX(${translatePercent}%)`,
              }}
            >
              {awards.map((award, index) => {
                const { src, alt, name, longDescription } = award;
                const isCenter = index === currentIndex;
                const hasDetail = Boolean(longDescription);
                const showPopup = hasDetail && isCenter;
                return (
                  <div
                    key={src}
                    className="flex shrink-0 flex-col items-center px-2 sm:px-3"
                    style={{ width: `${SLIDE_TRACK_PERCENT}%` }}
                    onMouseEnter={
                      showPopup
                        ? (e) => handleAwardEnter(award, e.currentTarget.getBoundingClientRect())
                        : undefined
                    }
                    onMouseLeave={showPopup ? handleAwardLeave : undefined}
                    aria-label={showPopup ? `Pročitaj više: ${name}` : undefined}
                  >
                    <div
                      className={`group relative flex h-56 w-full items-center justify-center transition-all duration-300 sm:h-64 md:h-80 ${
                        showPopup ? "cursor-pointer" : "cursor-default"
                      } ${isCenter ? "opacity-100" : "opacity-60 blur-md scale-95"}`}
                      aria-hidden
                    >
                      <div className="relative h-full w-full">
                        <Image
                          src={src}
                          alt={alt}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 55vw, (max-width: 1024px) 45vw, 480px"
                        />
                        {showPopup && (
                          <span className="absolute bottom-0 left-0 right-0 bg-black/60 py-1.5 text-center text-xs font-medium text-amber-400/90 opacity-0 transition-opacity group-hover:opacity-100 sm:text-sm">
                            Pređi mišem za više →
                          </span>
                        )}
                      </div>
                    </div>
                    <p
                      className={`mt-3 min-h-[2.5rem] text-center text-sm font-medium uppercase leading-tight transition-opacity duration-300 sm:min-h-[2.75rem] sm:text-base md:min-h-[3rem] md:text-lg text-[#ffbf00] ${
                        isCenter ? "opacity-100" : "opacity-60"
                      }`}
                    >
                      {name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={goPrev}
            className="absolute left-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[var(--background)]/90 text-[var(--foreground)] transition-colors hover:bg-white/10 hover:border-amber-400/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50 sm:-left-2"
            aria-label="Prethodna nagrada"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-0 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[var(--background)]/90 text-[var(--foreground)] transition-colors hover:bg-white/10 hover:border-amber-400/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50 sm:-right-2"
            aria-label="Sledeća nagrada"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="mt-8 flex justify-center gap-2">
            {awards.map(({ src }, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex ? "w-6 bg-amber-400" : "w-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Nagrada ${i + 1}`}
                aria-current={i === currentIndex ? "true" : undefined}
              />
            ))}
          </div>
        </div>
        </div>

        {hoveredAward && hoveredRect && (
          <AwardHoverPanel
            award={hoveredAward}
            anchorRect={hoveredRect}
            onMouseEnter={handlePanelEnter}
            onMouseLeave={handlePanelLeave}
          />
        )}
      </RevealOnScroll>
    </section>
  );
}
