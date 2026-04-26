"use client";

import { useEffect, useRef, useState } from "react";

type RevealOnScrollProps = {
  children: React.ReactNode;
  /** Root margin for IntersectionObserver (e.g. "0px 0px -60px 0px" = trigger when 60px into view) */
  rootMargin?: string;
  /** Once true, stop observing (animate only once) */
  once?: boolean;
  className?: string;
};

let readyClassApplied = false;

export default function RevealOnScroll({
  children,
  rootMargin = "0px 0px -80px 0px",
  once = false,
  className = "",
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!readyClassApplied) {
      document.documentElement.classList.add("js-reveal-ready");
      readyClassApplied = true;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Double rAF so the hidden state is painted before we trigger the animation
          requestAnimationFrame(() => {
            requestAnimationFrame(() => setVisible(true));
          });
          if (once) observer.disconnect();
        } else {
          setVisible(false);
        }
      },
      { rootMargin, threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, once]);

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${visible ? "is-visible" : ""} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
