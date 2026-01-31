"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useState } from "react";
import type { Award } from "./Awards";
import ImageLightbox from "./ImageLightbox";

type AwardHoverPanelProps = {
  award: Award;
  anchorRect: DOMRect;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

const PANEL_WIDTH = 400;
const GAP = 8;
const VIEWPORT_PADDING = 8;

function getPanelPosition(anchorRect: DOMRect) {
  const maxHeight =
    typeof window !== "undefined" ? Math.round(window.innerHeight * 0.85) : 450;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1024;
  const vh = typeof window !== "undefined" ? window.innerHeight : 768;

  let left = anchorRect.right + GAP;
  if (left + PANEL_WIDTH > vw - VIEWPORT_PADDING) {
    left = anchorRect.left - PANEL_WIDTH - GAP;
  }
  left = Math.max(
    VIEWPORT_PADDING,
    Math.min(left, vw - PANEL_WIDTH - VIEWPORT_PADDING)
  );

  let top = anchorRect.top;
  top = Math.max(
    VIEWPORT_PADDING,
    Math.min(top, vh - maxHeight - VIEWPORT_PADDING)
  );

  return { left, top };
}

export default function AwardHoverPanel({
  award,
  anchorRect,
  onMouseEnter,
  onMouseLeave,
}: AwardHoverPanelProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const paragraphs = award.longDescription
    ? award.longDescription.split(/\n\n+/).filter(Boolean)
    : [];
  const { left, top } = getPanelPosition(anchorRect);

  const openLightbox = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLightboxOpen(true);
  };

  const panel = (
    <aside
      className="panel-slide-in fixed z-40 max-h-[85vh] w-[400px] overflow-hidden rounded-xl border border-amber-400/30 bg-[var(--background)] shadow-xl shadow-amber-400/10"
      style={{ left: `${left}px`, top: `${top}px` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={`Detalji: ${award.name}`}
    >
      <div
        className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-amber-400/50 to-transparent"
        aria-hidden
      />
      <div className="flex max-h-full flex-col overflow-hidden">
        <button
          type="button"
          onClick={openLightbox}
          className="group relative h-56 w-full shrink-0 overflow-hidden sm:h-64"
          aria-label="Pogledaj u punoj veličini"
        >
          <Image
            src={award.src}
            alt={award.alt}
            fill
            className="object-contain object-center transition-opacity group-hover:opacity-95"
            sizes="400px"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent"
            aria-hidden
          />
          <span className="absolute bottom-2 left-2 right-2 rounded bg-black/60 py-1.5 text-center text-xs font-medium text-amber-400/95 opacity-0 transition-opacity group-hover:opacity-100 sm:text-sm">
            Klikni za punu veličinu
          </span>
        </button>
        <div className="flex flex-1 flex-col overflow-y-auto p-4">
          <h3
            className="mb-3 text-xl font-bold uppercase tracking-tight text-[#ffbf00]"
            style={{
              animation: "fadeInRight 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
              animationDelay: "80ms",
            }}
          >
            {award.name}
          </h3>
          <div className="space-y-2">
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className="text-sm leading-relaxed text-[var(--foreground)]/85"
                style={{
                  animation:
                    "fadeInRight 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
                  animationDelay: `${160 + i * 50}ms`,
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          src={award.src}
          alt={award.alt}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </aside>
  );

  if (typeof document === "undefined") return panel;
  return createPortal(panel, document.body);
}
