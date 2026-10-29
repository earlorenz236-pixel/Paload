"use client";

import React from "react";
import { Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className = "" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selection"
      className={`inline-flex items-center rounded-lg border border-zinc-800 bg-zinc-900/90 p-0.5 text-xs shadow-xs shrink-0 ${className}`}
    >
      <div className="hidden xs:flex sm:flex items-center pl-1.5 pr-1 text-zinc-500" title="Language / Pinulongan" aria-hidden="true">
        <Languages className="size-3.5" />
      </div>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        aria-label="Switch to English"
        className={`flex items-center justify-center rounded-md px-1.5 sm:px-2 py-1 text-xs font-semibold transition-all cursor-pointer min-h-[30px] min-w-[28px] sm:min-w-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
          language === "en"
            ? "bg-emerald-500 text-zinc-950 shadow-xs"
            : "text-zinc-400 hover:text-white"
        }`}
        title="English"
      >
        <span>EN</span>
      </button>
      <button
        type="button"
        onClick={() => setLanguage("ceb")}
        aria-pressed={language === "ceb"}
        aria-label="Switch to Bisaya (Cebuano)"
        className={`flex items-center justify-center rounded-md px-1.5 sm:px-2 py-1 text-xs font-semibold transition-all cursor-pointer min-h-[30px] min-w-[28px] sm:min-w-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
          language === "ceb"
            ? "bg-emerald-500 text-zinc-950 shadow-xs"
            : "text-zinc-400 hover:text-white"
        }`}
        title="Bisaya (Cebuano)"
      >
        <span>BIS</span>
      </button>
    </div>
  );
}
