"use client";

import Image from "next/image";

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
};

export default function ProductCard({ product, onMouseEnter, onMouseLeave }: ProductCardProps) {
  const hasHoverPanel = Boolean(product.longDescription && (onMouseEnter ?? onMouseLeave));

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    onMouseEnter?.(product, e.currentTarget.getBoundingClientRect());
  };

  return (
    <article
      onMouseEnter={hasHoverPanel ? handleMouseEnter : undefined}
      onMouseLeave={onMouseLeave}
      className={`group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-amber-400/30 hover:bg-white/10 hover:shadow-lg hover:shadow-amber-400/5 ${hasHoverPanel ? "cursor-pointer" : ""}`}
      aria-labelledby={`product-${product.id}`}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h3
          id={`product-${product.id}`}
          className="text-lg font-semibold text-[var(--foreground)] sm:text-xl"
        >
          {product.name}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-[var(--foreground)]/75 sm:text-base">
          {product.description}
        </p>
        <p className="text-xs font-medium leading-snug text-amber-400/90 sm:text-sm">
          {product.weightVariants}
        </p>
        {hasHoverPanel && (
          <span className="mt-2 text-xs font-medium text-amber-400/80 sm:text-sm">
            Pređi mišem za više →
          </span>
        )}
      </div>
    </article>
  );
}
