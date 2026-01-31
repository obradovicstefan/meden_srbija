"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

type ImageLightboxProps = {
  src: string;
  alt: string;
  onClose: () => void;
};

const LENS_SIZE = 160;
const LENS_ZOOM = 2.5;

type LensState = { x: number; y: number; rect: DOMRect } | null;

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
}: ImageLightboxProps) {
  const [lensActive, setLensActive] = useState(false);
  const [lensState, setLensState] = useState<LensState>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
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
            className="pointer-events-none fixed z-[9999] rounded-full border-2 border-amber-400 bg-black/95 shadow-2xl ring-2 ring-amber-400/50"
            style={{
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
          document.body
        )
      : null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] flex flex-col items-center bg-black p-4 pt-24"
        role="dialog"
        aria-modal="true"
        aria-label={alt || "Puna veličina slike"}
        onClick={handleBackdropClick}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
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
          className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
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
          className="mt-4 flex min-h-0 flex-1 items-start justify-center overflow-y-auto overflow-x-hidden"
          onClick={(e) => e.stopPropagation()}
          onMouseMove={lensActive ? handleImageMouseMove : undefined}
          onMouseLeave={lensActive ? handleImageMouseLeave : undefined}
          style={lensActive ? { cursor: "crosshair" } : undefined}
        >
          {/* Native img so tall documents (e.g. quality report) keep full height and scroll */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={src}
            alt={alt}
            className="w-full max-w-4xl object-contain object-top"
            draggable={false}
          />
        </div>
      </div>
      {lensNode}
    </>
  );
}
