"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import type { Product } from "@/components/ProductCard";

type ProductHoverPanelProps = {
  product: Product;
  anchorRect: DOMRect;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
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

export default function ProductHoverPanel({
  product,
  anchorRect,
  onMouseEnter,
  onMouseLeave,
}: ProductHoverPanelProps) {
  const body = product.longDescription ?? product.description;
  const paragraphs = body.split(/\n\n+/).filter(Boolean);
  const { left, top } = getPanelPosition(anchorRect);

  const panel = (
    <aside
      className="panel-slide-in fixed z-40 max-h-[80vh] w-[360px] overflow-hidden rounded-xl border border-amber-400/30 bg-[var(--background)] shadow-xl shadow-amber-400/10"
      style={{
        left: `${left}px`,
        top: `${top}px`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
            alt=""
            fill
            className="object-cover object-center"
            sizes="360px"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent"
            aria-hidden
          />
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto p-4">
          <h3
            className="mb-1 text-xl font-bold text-[var(--foreground)]"
            style={{
              animation: "fadeInRight 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
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
        </div>
      </div>
    </aside>
  );

  if (typeof document === "undefined") return panel;
  return createPortal(panel, document.body);
}
