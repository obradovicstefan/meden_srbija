"use client";

import { useState } from "react";

type ExpandableBioProps = {
  /** Paragraphs of text to show; first `previewCount` are visible when collapsed */
  paragraphs: string[];
  /** Number of paragraphs to show when collapsed (default 1) */
  previewCount?: number;
  /** Class name for the wrapper (e.g. text styling) */
  className?: string;
};

export default function ExpandableBio({
  paragraphs,
  previewCount = 1,
  className = "",
}: ExpandableBioProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? paragraphs : paragraphs.slice(0, previewCount);
  const hasMore = paragraphs.length > previewCount;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="space-y-2 text-base leading-[1.6] text-[#b0b0b0]">
        {visible.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="bioToggleButton touch-target mt-3 inline-flex items-center justify-center text-sm font-medium text-[var(--gold)] underline decoration-[var(--gold)]/50 underline-offset-2 transition-colors hover:text-amber-300 hover:decoration-[var(--gold)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d]"
        >
          {expanded ? "Zatvori" : "Pročitaj više"}
          <span className={expanded ? "bioToggleArrow isOpen" : "bioToggleArrow"}>
            ↓
          </span>
        </button>
      )}
    </div>
  );
}
