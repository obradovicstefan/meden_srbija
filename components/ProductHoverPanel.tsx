"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/components/ProductCard";

type ProductHoverPanelProps = {
  product: Product;
  anchorRect: DOMRect;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClose?: () => void;
  isPinned?: boolean;
};

const PANEL_WIDTH = 360;
const GAP = 8;
const VIEWPORT_PADDING = 8;

function getPanelPosition(anchorRect: DOMRect) {
  const maxHeight =
    typeof window !== "undefined" ? Math.round(window.innerHeight * 0.8) : 400;
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

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

export default function ProductHoverPanel({
  product,
  anchorRect,
  onMouseEnter,
  onMouseLeave,
  onClose,
  isPinned = false,
}: ProductHoverPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const body = product.longDescription ?? product.description;
  const paragraphs = body.split(/\n\n+/).filter(Boolean);
  const { left, top } = getPanelPosition(anchorRect);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
        return;
      }
      if (!isPinned || e.key !== "Tab" || !panelRef.current) return;
      const focusables = getFocusableElements(panelRef.current);
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
    [isPinned, onClose]
  );

  useEffect(() => {
    if (!isPinned || !onClose) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPinned, onClose, handleKeyDown]);

  useEffect(() => {
    if (!isPinned || !panelRef.current) return;
    const focusables = getFocusableElements(panelRef.current);
    const first = focusables[0];
    if (first) {
      requestAnimationFrame(() => first.focus());
    }
  }, [isPinned, product.id]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const panel = (
    <>
      {isPinned && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          aria-hidden
          onClick={handleBackdropClick}
        />
      )}
      <aside
        ref={panelRef}
        className="panel-slide-in fixed z-50 max-h-[80vh] w-[360px] overflow-hidden rounded-xl border border-amber-400/30 bg-[var(--background)] shadow-xl shadow-amber-400/10"
        style={{
          left: `${left}px`,
          top: `${top}px`,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        role={isPinned ? "dialog" : "complementary"}
        aria-modal={isPinned ? true : undefined}
        aria-label={`Detalji: ${product.name}`}
      >
        <div
          className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-amber-400/50 to-transparent"
          aria-hidden
        />
        <div className="flex max-h-full flex-col overflow-hidden">
          <div className="relative h-32 w-full shrink-0 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover object-center"
              sizes="360px"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent"
              aria-hidden
            />
            {isPinned && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="absolute right-2 top-2 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                aria-label="Zatvori"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto p-4">
            <h3
              className="mb-1 text-xl font-bold text-[var(--foreground)]"
              style={{
                animation:
                  "fadeInRight 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
                animationDelay: "80ms",
              }}
            >
              {product.name}
            </h3>
            {product.weightVariants ? (
              <p
                className="mb-3 text-xs font-medium text-amber-400/90"
                style={{
                  animation:
                    "fadeInRight 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
                  animationDelay: "120ms",
                }}
              >
                {product.weightVariants}
              </p>
            ) : null}
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
            {isPinned && (
              <a
                href="#kontakt"
                className="mt-3 inline-flex min-h-[44px] min-w-[44px] items-center text-sm font-semibold text-amber-400 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              >
                Naruči
              </a>
            )}
          </div>
        </div>
      </aside>
    </>
  );

  if (typeof document === "undefined") return panel;
  return createPortal(panel, document.body);
}
