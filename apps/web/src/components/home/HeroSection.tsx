"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "./SearchBar";

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeStart = 0;
  const fadeEnd = 150;
  const fadeProgress = Math.max(0, Math.min(1, (scrollY - fadeStart) / (fadeEnd - fadeStart)));

  const scaleStart = 80;
  const scaleEnd = 260;
  const scaleProgress = Math.max(0, Math.min(1, (scrollY - scaleStart) / (scaleEnd - scaleStart)));

  const paddingProgress = Math.max(0, Math.min(1, (scrollY - 0) / 200));

  const headingOpacity = 1 - fadeProgress;
  const headingTranslateY = -20 * fadeProgress;
  const searchScale = 1 - 0.25 * scaleProgress;
  const searchOpacity = 1 - scaleProgress;
  const topPad = Math.max(0, 80 * (1 - paddingProgress));
  const botPad = Math.max(0, 80 * (1 - paddingProgress));

  return (
    <div
      className="relative"
      style={{ paddingTop: `${topPad}px`, paddingBottom: `${botPad}px` }}
    >
      <div
        className="mb-8 text-center transition-all duration-200"
        style={{ opacity: headingOpacity, transform: `translateY(${headingTranslateY}px)` }}
      >
        <h1
          className="mb-3 text-[26px] font-semibold leading-[30px] text-ink"
          style={{ letterSpacing: "-0.01em" }}
        >
          Find your next laptop in the UAE
        </h1>
        <p className="text-sm leading-[18px] text-ink-2">
          New, certified refurbished, and like-new — from top brands
        </p>
      </div>

      <div
        className="transition-all duration-200"
        style={{
          transform: `scale(${searchScale})`,
          opacity: searchOpacity,
          transformOrigin: "top center",
        }}
      >
        <SearchBar />
      </div>
    </div>
  );
}
