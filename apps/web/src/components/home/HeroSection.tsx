"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
      <div className="absolute inset-0 -top-24 h-[calc(100%+96px)] overflow-hidden">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div
        className="relative z-10 mb-6 text-center transition-all duration-200 sm:mb-8"
        style={{ opacity: headingOpacity, transform: `translateY(${headingTranslateY}px)` }}
      >
        <h1
          className="mb-2 text-[22px] font-semibold leading-[26px] text-white sm:mb-3 sm:text-[26px] sm:leading-[30px]"
          style={{ letterSpacing: "-0.01em" }}
        >
          Find your next laptop in the UAE
        </h1>
        <p className="px-4 text-sm leading-[18px] text-white/70 sm:px-0 sm:text-white/80">
          New, certified refurbished, and like-new — from top brands
        </p>
      </div>

      <div
        className="relative z-10 transition-all duration-200"
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
