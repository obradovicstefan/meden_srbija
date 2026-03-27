"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import ImageLightbox from "./ImageLightbox";

type AwardItem = {
  id: number;
  name: ReactNode;
  year: string;
  category: string;
  location: string;
  tag: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

export type Award = {
  src: string;
  alt: string;
  name: string;
  longDescription?: string;
  subtitle?: string;
  image?: {
    thumbnail?: string;
    modal?: string;
    zoom?: string;
  };
};

const awards: AwardItem[] = [
  {
    id: 1,
    name: (
      <>
        <em>Beogradski Pobednik</em> 2025.
      </>
    ),
    year: "2025",
    category: "Pčelarstvo",
    location: "Beograd",
    tag: "Nacionalno priznanje",
    description:
      "Priznanje za najuspesnije poslovanje u oblasti pcelarstva i izgradnju brenda Meden.",
    imageSrc: "/images/awards/Diploma2025.webp",
    imageAlt: "Beogradski Pobednik 2025",
  },
  {
    id: 2,
    name: (
      <>
        Prvi Oskar Srbije <em>2022.</em>
      </>
    ),
    year: "2022",
    category: "Pčelarstvo",
    location: "Beograd",
    tag: "Poslovna izvrsnost",
    description:
      "Dodeljeno za najuspesnije poslovanje u proizvodnji i distribuciji meda i pcelinjih proizvoda.",
    imageSrc: "/images/awards/nagradaOskar.webp",
    imageAlt: "Prvi Oskar Srbije 2022",
  },
  {
    id: 3,
    name: (
      <>
        Izvestaj o kvalitetu <em>uzoraka meda</em>
      </>
    ),
    year: "2020",
    category: "Laboratorijska analiza",
    location: "Srbija",
    tag: "Zlatno priznanje",
    description:
      "Ispitivanje je ocenjeno najvisom ocenom i dodeljeno je zlatno priznanje za kvalitet bagremovog meda.",
    imageSrc: "/images/awards/result.webp",
    imageAlt: "Izvestaj o kvalitetu uzoraka meda",
  },
  {
    id: 4,
    name: (
      <>
        Summit Success <em>2022.</em>
      </>
    ),
    year: "2022",
    category: "Pčelarstvo",
    location: "Beograd",
    tag: "Hotelska dodela",
    description:
      "Nagrada za visegodisnji uzastopni uspeh i stabilno poslovanje poljoprivrednog gazdinstva Stankovic.",
    imageSrc: "/images/awards/summit.webp",
    imageAlt: "Summit Success 2022",
  },
  {
    id: 5,
    name: (
      <>
        Tetovo Honey Awards <em>Bagrem 2020.</em>
      </>
    ),
    year: "2020",
    category: "Pčelarstvo",
    location: "Tetovo",
    tag: "Balkansko takmicenje",
    description:
      "Priznanje za kvalitet bagremovog meda sa visokim plasmanom u regionalnoj konkurenciji.",
    imageSrc: "/images/awards/tetovoAcacia.webp",
    imageAlt: "Tetovo Honey Awards 2020 - Bagremov med",
  },
  {
    id: 6,
    name: (
      <>
        Tetovo Honey Awards <em>Livadski 2020.</em>
      </>
    ),
    year: "2020",
    category: "Pčelarstvo",
    location: "Tetovo",
    tag: "Zlatna medalja",
    description:
      "Prvo mesto i zlatna medalja za kvalitet livadskog meda na podrucju celog Balkana.",
    imageSrc: "/images/awards/tetovoMeadow.webp",
    imageAlt: "Tetovo Honey Awards 2020 - Livadski med",
  },
];

export default function Awards() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [translateX, setTranslateX] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + awards.length) % awards.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % awards.length);
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const updateTrackPosition = () => {
      if (!viewportRef.current) return;

      const viewport = viewportRef.current;
      const firstCard =
        viewport.querySelector<HTMLElement>("[data-award-card]");
      if (!firstCard) return;

      const viewportWidth = viewport.offsetWidth;
      const cardWidth = firstCard.offsetWidth;
      const gap = 24;
      const step = cardWidth + gap;
      const desired = viewportWidth / 2 - (currentIndex * step + cardWidth / 2);
      const maxTranslate = 0;
      const minTranslate = viewportWidth - (awards.length * step - gap);
      const clamped = Math.min(maxTranslate, Math.max(minTranslate, desired));
      setTranslateX(clamped);
    };

    updateTrackPosition();
    window.addEventListener("resize", updateTrackPosition);
    return () => window.removeEventListener("resize", updateTrackPosition);
  }, [currentIndex]);

  return (
    <section
      id="nagrade"
      className="border-t border-white/10 bg-[#0a0805] py-16 sm:py-20 lg:py-24"
    >
      <div
        className={`mx-auto w-full max-w-7xl px-4 transition-all duration-700 ease-out sm:px-6 lg:px-8 ${
          isMounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-8 border-b border-[#c9920a]/15 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-5">
            <div className="h-14 w-0.5 bg-[#c9920a]" aria-hidden />
            <div className="space-y-2">
              <p className="[font-family:var(--font-montserrat)] text-xs font-medium tracking-[0.28em] text-[#c9920a]/80">
                KVALITET &amp; PREPOZNATLJIVOST
              </p>
              <h2 className="[font-family:var(--font-cormorant)] text-3xl text-[#f0e8d8] sm:text-4xl lg:text-5xl">
                Nagrade &amp; <em className="italic text-[#c9920a]">Počasti</em>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <p className="[font-family:var(--font-cormorant)] text-base text-[#f0e8d8] sm:text-lg">
              {String(currentIndex + 1).padStart(2, "0")}{" "}
              <span className="text-[#c9920a]/50">/</span>{" "}
              <span className="text-[#c9920a]/70">
                {String(awards.length).padStart(2, "0")}
              </span>
            </p>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous award"
                className="flex h-11 w-11 items-center justify-center border border-[#c9920a]/30 bg-transparent text-[#f0e8d8] transition-all duration-300 ease-in-out hover:border-[#c9920a]/60 hover:bg-[#c9920a]/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next award"
                className="flex h-11 w-11 items-center justify-center border border-[#c9920a]/30 bg-transparent text-[#f0e8d8] transition-all duration-300 ease-in-out hover:border-[#c9920a]/60 hover:bg-[#c9920a]/10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 h-[1px] w-full bg-[#c9920a]/10">
          <div
            className="h-full bg-[#c9920a] transition-all duration-300 ease-in-out"
            style={{ width: `${((currentIndex + 1) / awards.length) * 100}%` }}
          />
        </div>

        <div ref={viewportRef} className="mt-10 overflow-hidden">
          <div
            className="flex gap-6 transition-all duration-300 ease-in-out"
            style={{ transform: `translateX(${translateX}px)` }}
          >
            {awards.map((award, index) => {
              const isActive = index === currentIndex;

              return (
                <article
                  key={award.id}
                  data-award-card
                  onClick={() => setCurrentIndex(index)}
                  className={`group relative w-full shrink-0 cursor-pointer overflow-hidden border bg-[#080604] transition-all duration-300 ease-in-out sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] ${
                    isActive
                      ? "border-[#c9920a]/35"
                      : "border-[#c9920a]/10 hover:border-[#c9920a]/20"
                  }`}
                >
                  <div
                    className={`absolute top-4 left-4 border-t border-l transition-all duration-300 ease-in-out ${
                      isActive
                        ? "h-[18px] w-[18px] border-[#c9920a]/90"
                        : "h-[12px] w-[12px] border-[#c9920a]/35"
                    }`}
                    aria-hidden
                  />
                  <div
                    className={`absolute right-4 bottom-4 border-r border-b transition-all duration-300 ease-in-out ${
                      isActive
                        ? "h-[18px] w-[18px] border-[#c9920a]/90"
                        : "h-[12px] w-[12px] border-[#c9920a]/35"
                    }`}
                    aria-hidden
                  />

                  <div className="relative flex h-56 items-center justify-center border-b border-[#c9920a]/10">
                    <Image
                      src={award.imageSrc}
                      alt={award.imageAlt}
                      fill
                      className="object-contain p-5"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxImage({
                          src: award.imageSrc,
                          alt: award.imageAlt,
                        });
                      }}
                      className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 overflow-hidden border border-[#c9920a]/40 bg-[#080604]/85 px-3.5 py-1.5 [font-family:var(--font-montserrat)] text-[0.55rem] font-medium uppercase tracking-[0.18em] text-[#c9920a] transition-[border-color] duration-300 ease-in-out before:absolute before:inset-0 before:bg-[linear-gradient(105deg,transparent_25%,rgba(201,146,10,0.1)_50%,transparent_75%)] before:translate-x-[-120%] before:transition-transform before:duration-500 before:ease-in-out hover:border-[#c9920a]/70 hover:before:translate-x-[120%] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9920a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080604]"
                    >
                      Pogledaj nagradu
                    </button>
                    {!isActive && (
                      <div
                        className="absolute inset-0 bg-[#080604]/50 transition-all duration-300 ease-in-out"
                        aria-hidden
                      />
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="[font-family:var(--font-cormorant)] text-xl text-[#f0e8d8]">
                      {award.name}
                    </h3>
                    <div
                      className={`mt-4 h-[1px] bg-[#c9920a]/30 transition-all duration-300 ease-in-out ${
                        isActive ? "w-9" : "w-6"
                      }`}
                    />
                    <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="[font-family:var(--font-montserrat)] uppercase tracking-[0.18em] text-[#c9920a]/45">
                          Godina
                        </p>
                        <p className="mt-1 [font-family:var(--font-cormorant)] text-sm text-[#f0e8d8]">
                          {award.year}
                        </p>
                      </div>
                      <div>
                        <p className="[font-family:var(--font-montserrat)] uppercase tracking-[0.18em] text-[#c9920a]/45">
                          Lokacija
                        </p>
                        <p className="mt-1 [font-family:var(--font-cormorant)] text-sm text-[#f0e8d8]">
                          {award.location}
                        </p>
                      </div>
                      <div>
                        <p className="[font-family:var(--font-montserrat)] uppercase tracking-[0.18em] text-[#c9920a]/45">
                          {award.id === 3 ? "Tip" : "Kategorija"}
                        </p>
                        <p className="mt-1 [font-family:var(--font-cormorant)] text-sm text-[#f0e8d8]">
                          {award.id === 3
                            ? "Laboratorijski izvestaj"
                            : award.category}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`overflow-hidden [font-family:var(--font-montserrat)] text-sm leading-relaxed text-[#f0e8d8]/80 transition-all duration-300 ease-in-out ${
                        isActive
                          ? "mt-4 max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p>{award.description}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {awards.map((award, index) => {
            const isActive = index === currentIndex;

            return (
              <button
                key={award.id}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to award ${index + 1}`}
                className={`h-[1px] transition-all duration-300 ease-in-out ${
                  isActive
                    ? "w-10 bg-[#c9920a]"
                    : "w-5 bg-[#c9920a]/20 hover:bg-[#c9920a]/40"
                }`}
              />
            );
          })}
        </div>
      </div>
      {lightboxImage && (
        <ImageLightbox
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </section>
  );
}
