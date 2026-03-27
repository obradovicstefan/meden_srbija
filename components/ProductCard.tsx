"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import "./Products.css";

export type Product = {
  id: string;
  name: string;
  description: string;
  image: string;
  weightVariants: string;
  longDescription?: string;
};

type ProductCardProps = {
  product: Product;
  onMouseEnter?: (product: Product, rect: DOMRect) => void;
  onMouseLeave?: () => void;
  isHovered?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function useIsMobile() {
  const query = "(max-width: 639px)";
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      const m = window.matchMedia(query);
      m.addEventListener("change", onStoreChange);
      return () => m.removeEventListener("change", onStoreChange);
    },
    () => (typeof window === "undefined" ? false : window.matchMedia(query).matches),
    () => false,
  );
}

function ChevronDown() {
  return (
    <svg
      className="h-4 w-4 shrink-0 transition-transform"
      aria-hidden
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg
      className="h-4 w-4 shrink-0"
      aria-hidden
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  );
}

const detailLinkClass =
  "mt-1 inline-flex min-h-[44px] min-w-[44px] items-center text-sm font-medium text-[#D4AF37] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d]";

export default function ProductCard({
  product,
  onMouseEnter,
  onMouseLeave,
  isHovered = false,
  className,
  style,
}: ProductCardProps) {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

  const hasLongDescription = Boolean(product.longDescription);
  const hasHoverPanel = Boolean(
    hasLongDescription && (onMouseEnter ?? onMouseLeave)
  );
  const useExpandOnMobile = hasLongDescription && isMobile;

  const tooltipParagraphs = (product.longDescription ?? "")
    .split(/\n\n+/)
    .filter(Boolean);

  const showDesktopTooltip = hasLongDescription && !isMobile && isHovered;

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    onMouseEnter?.(product, e.currentTarget.getBoundingClientRect());
  };

  const toggleExpanded = () => {
    if (!hasLongDescription) return;
    setExpanded((prev) => {
      const next = !prev;
      if (next) {
        requestAnimationFrame(() => {
          expandedRef.current
            ?.querySelector<HTMLElement>("a, button")
            ?.focus();
        });
      } else {
        toggleRef.current?.focus();
      }
      return next;
    });
  };

  const expandId = `product-details-${product.id}`;

  return (
    <article
      ref={articleRef}
      onMouseEnter={hasHoverPanel ? handleMouseEnter : undefined}
      onMouseLeave={onMouseLeave}
      data-ms-product-card="true"
      className={`product-card group flex flex-col overflow-hidden outline-none ${
        hasHoverPanel ? "cursor-pointer" : ""
      } ${isHovered ? "is-hovered" : ""} ${className ?? ""}`}
      style={style}
      aria-labelledby={`product-${product.id}`}
      role="listitem"
    >
      <div className="card-img-wrap">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 400px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
        />
      </div>
      <div className="product-info flex flex-1 flex-col">
        {/* Title: expandable button on mobile (when longDescription), static h3 on desktop or when no longDescription */}
        {useExpandOnMobile ? (
          <button
            ref={toggleRef}
            type="button"
            onClick={toggleExpanded}
            aria-expanded={expanded}
            aria-controls={expandId}
            id={`product-${product.id}`}
            className="mb-2 flex w-full items-center justify-between gap-2 text-left text-xl font-bold text-white hover:text-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d] sm:text-[22px]"
          >
            <span>{product.name}</span>
            <span
              className={`shrink-0 text-[#D4AF37] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            >
              <ChevronDown />
            </span>
          </button>
        ) : (
          <h3
            id={`product-${product.id}`}
            className="product-name"
          >
            {product.name}
          </h3>
        )}
        <p className="product-short-description line-clamp-3">
          {product.description}
        </p>
        <p className="product-price">
          {product.weightVariants}
        </p>

        {/* Mobile only: expand/collapse + accordion with longDescription */}
        {useExpandOnMobile && (
          <>
            <button
              type="button"
              onClick={toggleExpanded}
              aria-expanded={expanded}
              aria-controls={expandId}
              className="mt-1 inline-flex min-h-[44px] min-w-[44px] items-center gap-1.5 text-sm font-medium text-[#D4AF37] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d]"
            >
              {expanded ? (
                <>
                  Zatvori
                  <ChevronUp />
                </>
              ) : (
                <>
                  Vidi detalje
                  <ChevronDown />
                </>
              )}
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
              aria-hidden={!expanded}
            >
              <div ref={expandedRef} className="min-h-0 overflow-hidden">
                <div
                  id={expandId}
                  role="region"
                  aria-label={`Detalji: ${product.name}`}
                  className="mt-4 space-y-3 border-t border-[rgba(212,175,55,0.2)] pt-4 text-sm leading-relaxed text-[rgba(255,255,255,0.55)] sm:text-[15px]"
                >
                  {(product.longDescription ?? "")
                    .split(/\n\n+/)
                    .filter(Boolean)
                    .map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  <a href="#kontakt" className={detailLinkClass}>
                    Naruči
                  </a>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Desktop: hover-only helper text */}
        {hasLongDescription && !isMobile && (
          <p className={detailLinkClass}>
            Pređi mišem preko slike za više →
          </p>
        )}

        {/* No longDescription: informational text only (non-clickable) */}
        {!hasLongDescription && (
          <p className={detailLinkClass}>
            Vidi detalje →
          </p>
        )}
      </div>

      {/* Desktop hover/click tooltip (in-card overlay) */}
      {showDesktopTooltip && (
        <div
          className="product-tooltip"
          role="complementary"
          aria-label={`Detalji: ${product.name}`}
        >
          <div className="tooltip-name">{product.name}</div>
          {product.weightVariants ? (
            <div className="tooltip-price">{product.weightVariants}</div>
          ) : null}
          <div className="tooltip-text">
            {tooltipParagraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
