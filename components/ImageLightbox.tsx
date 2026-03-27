"use client";

import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type ImageLightboxProps = {
  src: string;
  alt: string;
  onClose: () => void;
  zIndex?: number;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
};

const LENS_SIZE = 160;
const LENS_ZOOM = 2.5;
const DEFAULT_Z_INDEX = 60;

type LensState = { x: number; y: number; rect: DOMRect } | null;

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll<HTMLElement>(selector));
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

export default function ImageLightbox({
  src,
  alt,
  onClose,
  zIndex = DEFAULT_Z_INDEX,
  returnFocusRef,
}: ImageLightboxProps) {
  const [lensActive, setLensActive] = useState(false);
  const [lensState, setLensState] = useState<LensState>(null);
  const [isClosing, setIsClosing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      onClose();
      return;
    }
    setIsClosing(true);
    setTimeout(() => onClose(), 280);
  }, [isClosing, onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const returnFocusEl = returnFocusRef?.current;
    return () => {
      document.body.style.overflow = prev;
      if (returnFocusEl && typeof returnFocusEl.focus === "function") {
        returnFocusEl.focus();
      }
    };
  }, [returnFocusRef]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
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
    [handleClose],
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
  }, [src]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

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

  const handleImageMouseLeave = () => {
    setLensState(null);
  };

  const lensNode =
    lensActive && lensState && typeof document !== "undefined"
      ? createPortal(
          <div
            className="pointer-events-none fixed rounded-full border-2 border-[#D4AF37] bg-black/95 shadow-2xl ring-2 ring-[#D4AF37]/50"
            style={{
              zIndex: zIndex + 1,
              width: LENS_SIZE,
              height: LENS_SIZE,
              left: lensState.x - LENS_SIZE / 2,
              top: lensState.y - LENS_SIZE / 2,
              backgroundImage: `url(${src})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${lensState.rect.width * LENS_ZOOM}px ${
                lensState.rect.height * LENS_ZOOM
              }px`,
              backgroundPosition: `${
                -(lensState.x - lensState.rect.left) * LENS_ZOOM + LENS_SIZE / 2
              }px ${
                -(lensState.y - lensState.rect.top) * LENS_ZOOM + LENS_SIZE / 2
              }px`,
            }}
            aria-hidden
          />,
          document.body,
        )
      : null;

  return (
    <>
      <div
        ref={containerRef}
        className={`zoom-overlay fixed inset-0 flex items-center justify-center bg-black/35 p-3 transition-opacity duration-300 sm:p-4 backdrop-blur-[14px] ${isClosing ? "opacity-0" : "opacity-100"}`}
        style={{ zIndex }}
        role="dialog"
        aria-modal="true"
        aria-label={alt || "Puna veličina slike"}
        onClick={handleBackdropClick}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 flex min-h-[44px] min-w-[44px] items-center justify-center border border-[#c9920a]/40 bg-[#080604]/70 text-[#f0e8d8] shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-300 ease-in-out hover:border-[#c9920a]/80 hover:bg-[#c9920a]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9920a] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:right-4 sm:top-4 sm:min-h-[48px] sm:min-w-[48px]"
          aria-label="Zatvori"
        >
          <svg
            className="h-6 w-6 shrink-0"
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
          className={`absolute left-3 top-3 z-10 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:left-4 sm:top-4 sm:min-h-[48px] sm:min-w-[48px] ${
            lensActive
              ? "border-[#D4AF37] bg-[#D4AF37]/90 text-[#1a1a1a] shadow-[0_8px_24px_rgba(212,175,55,0.35)]"
              : "border-[#D4AF37]/40 bg-black/50 text-[#D4AF37] hover:bg-[rgba(212,175,55,0.2)]"
          }`}
          aria-label={
            lensActive
              ? "Isključi lupu za čitanje"
              : "Uključi lupu za čitanje preko slike"
          }
          title={lensActive ? "Isključi lupu" : "Lupa za čitanje"}
        >
          <LensIcon />
        </button>

        <div
          className="zoom-content-in flex max-h-[95vh] max-w-[95vw] items-center justify-center overflow-hidden rounded-xl bg-transparent p-0 shadow-none"
          onClick={(e) => e.stopPropagation()}
          onMouseMove={lensActive ? handleImageMouseMove : undefined}
          onMouseLeave={lensActive ? handleImageMouseLeave : undefined}
          style={lensActive ? { cursor: "crosshair" } : undefined}
        >
          <TransformWrapper
            initialScale={1}
            minScale={1}
            maxScale={1}
            doubleClick={{ disabled: true }}
            panning={{ disabled: true }}
            wheel={{ disabled: true }}
            pinch={{ disabled: true }}
          >
            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              contentStyle={{
                maxWidth: "100%",
                maxHeight: "85vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Native img for pinch/pan and lens; tall docs keep full height */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={src}
                alt={alt}
                className="max-h-[85vh] w-full object-contain object-center select-none"
                draggable={false}
                style={{ touchAction: "none" }}
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
      </div>
      {lensNode}
    </>
  );
}
