"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Award } from "./Awards";

const LENS_SIZE = 160;
const LENS_ZOOM = 2.5;

type LensState = { x: number; y: number; rect: DOMRect } | null;

type AwardDetailsModalProps = {
  award: Award;
  onClose: () => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
};

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

function parseDescription(longDescription: string | undefined) {
  const paragraphs = longDescription
    ? longDescription.split(/\n\n+/).filter(Boolean)
    : [];
  let subtitle: string | null = null;
  let descriptionParagraphs: string[] = [];
  let closingStatement: string | null = null;
  if (paragraphs.length > 2) {
    subtitle = paragraphs[0];
    descriptionParagraphs = paragraphs.slice(1, -1);
    closingStatement = paragraphs[paragraphs.length - 1];
  } else if (paragraphs.length === 2) {
    subtitle = paragraphs[0];
    closingStatement = paragraphs[1];
  } else if (paragraphs.length === 1) {
    descriptionParagraphs = [paragraphs[0]];
  }
  return { subtitle, descriptionParagraphs, closingStatement };
}

function LensIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

export default function AwardDetailsModal({
  award,
  onClose,
  returnFocusRef,
}: AwardDetailsModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const [lensActive, setLensActive] = useState(false);
  const [lensState, setLensState] = useState<LensState>(null);
  const parsed = parseDescription(award.longDescription);
  const subtitle = award.subtitle ?? parsed.subtitle;
  const { descriptionParagraphs, closingStatement } = parsed;

  const toggleLens = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLensActive((on) => !on);
    if (lensActive) setLensState(null);
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!lensActive || !imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    setLensState({ x: e.clientX, y: e.clientY, rect });
  };

  const handleImageMouseLeave = () => setLensState(null);

  const updateLensFromTouch = useCallback(
    (clientX: number, clientY: number) => {
      if (!imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      setLensState({ x: clientX, y: clientY, rect });
    },
    [],
  );

  const handleImageTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!lensActive || e.touches.length === 0) return;
      updateLensFromTouch(e.touches[0].clientX, e.touches[0].clientY);
    },
    [lensActive, updateLensFromTouch],
  );

  const handleImageTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!lensActive || e.touches.length === 0) return;
      updateLensFromTouch(e.touches[0].clientX, e.touches[0].clientY);
    },
    [lensActive, updateLensFromTouch],
  );

  const handleImageTouchEnd = useCallback(() => setLensState(null), []);
  const handleImageTouchCancel = useCallback(() => setLensState(null), []);

  useEffect(() => {
    const el = imageWrapperRef.current;
    if (!lensActive || !el) return;
    const preventScroll = (e: TouchEvent) => e.preventDefault();
    el.addEventListener("touchmove", preventScroll, { passive: false });
    return () => el.removeEventListener("touchmove", preventScroll);
  }, [lensActive]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      if (
        returnFocusRef?.current &&
        typeof returnFocusRef.current.focus === "function"
      ) {
        returnFocusRef.current.focus();
      }
    };
  }, [returnFocusRef]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !containerRef.current) return;
      const focusables = getFocusableElements(containerRef.current);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const first = containerRef.current
      ? getFocusableElements(containerRef.current)[0]
      : null;
    if (first) requestAnimationFrame(() => first.focus());
  }, [award.src, award.image?.modal]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  const modalImageSrc = award.image?.modal ?? award.src;

  const lensNode =
    lensActive && lensState && typeof document !== "undefined"
      ? createPortal(
          <div
            className="pointer-events-none fixed rounded-full border-2 border-[#D4AF37] bg-black/95 shadow-2xl ring-2 ring-[#D4AF37]/50"
            style={{
              zIndex: 1001,
              width: LENS_SIZE,
              height: LENS_SIZE,
              left: lensState.x - LENS_SIZE / 2,
              top: lensState.y - LENS_SIZE / 2,
              backgroundImage: `url(${modalImageSrc})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${lensState.rect.width * LENS_ZOOM}px ${lensState.rect.height * LENS_ZOOM}px`,
              backgroundPosition: `${-(lensState.x - lensState.rect.left) * LENS_ZOOM + LENS_SIZE / 2}px ${-(lensState.y - lensState.rect.top) * LENS_ZOOM + LENS_SIZE / 2}px`,
            }}
            aria-hidden
          />,
          document.body,
        )
      : null;

  const content = (
    <div
      ref={overlayRef}
      className="awards-modal-overlay fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        animation: "awardsModalOverlayIn 0.3s ease",
      }}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="award-details-title"
    >
      <div
        ref={containerRef}
        className="awards-modal-content relative flex max-h-[90vh] w-full max-w-[90vw] flex-col gap-4 overflow-hidden rounded-[20px] border-2 bg-[#0d0d0d] px-6 pt-20 pb-6 shadow-[0_20px_80px_rgba(212,175,55,0.3)] sm:gap-6 sm:px-8 sm:pt-24 sm:pb-8 md:max-w-[900px] md:flex-row md:gap-10 md:p-10 lg:p-12"
        style={{
          borderColor: "rgba(212,175,55,0.4)",
          animation: "awardsModalSlideUp 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="awards-modal-close absolute right-3 top-3 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-[rgba(212,175,55,0.4)] bg-transparent text-[#D4AF37] transition-all duration-200 hover:rotate-90 hover:border-[#D4AF37] hover:bg-[rgba(212,175,55,0.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d] sm:right-4 sm:top-4"
          aria-label="Zatvori"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <button
          type="button"
          onClick={toggleLens}
          className="awards-modal-lens absolute left-3 top-3 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-[#D4AF37] bg-[rgba(212,175,55,0.9)] text-[#1a1a1a] shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-transform hover:scale-110 hover:bg-[#D4AF37] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d] sm:left-4 sm:top-4"
          aria-label={
            lensActive
              ? "Isključi lupu za čitanje"
              : "Uključi lupu za čitanje preko slike"
          }
          title={lensActive ? "Isključi lupu" : "Lupa za čitanje"}
        >
          <LensIcon />
        </button>

        {/* Left: image */}
        <div className="flex shrink-0 flex-col gap-6 md:w-[55%] md:gap-10">
          <div
            ref={imageWrapperRef}
            className="awards-modal-image-box relative flex overflow-hidden rounded-xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            onMouseMove={lensActive ? handleImageMouseMove : undefined}
            onMouseLeave={lensActive ? handleImageMouseLeave : undefined}
            onTouchStart={lensActive ? handleImageTouchStart : undefined}
            onTouchMove={lensActive ? handleImageTouchMove : undefined}
            onTouchEnd={lensActive ? handleImageTouchEnd : undefined}
            onTouchCancel={lensActive ? handleImageTouchCancel : undefined}
            style={lensActive ? { cursor: "crosshair" } : undefined}
          >
            <div className="relative aspect-[3/4] w-full p-5 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={modalImageSrc}
                alt={award.alt}
                className="max-h-full w-full object-contain object-center select-none"
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Right: details */}
        <div className="awards-modal-details flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto md:w-[45%] md:gap-6">
          <h2
            id="award-details-title"
            className="pr-12 text-2xl font-bold text-[#D4AF37] sm:text-3xl"
          >
            {award.name}
          </h2>
          {subtitle && (
            <p className="text-base text-white sm:text-lg">{subtitle}</p>
          )}
          <div className="space-y-4">
            {descriptionParagraphs.map((para, i) => (
              <p
                key={i}
                className="text-base leading-[1.75] text-[#c0c0c0] sm:leading-[1.8] sm:text-[17px]"
              >
                {para}
              </p>
            ))}
          </div>
          {closingStatement && (
            <p className="mt-4 text-[15px] italic text-[#D4AF37] sm:mt-6 sm:text-base">
              {closingStatement}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return content;
  return (
    <>
      {createPortal(content, document.body)}
      {lensNode}
    </>
  );
}
