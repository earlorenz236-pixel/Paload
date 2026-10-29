"use client";

import React from "react";
import BlurText from "@/components/BlurText";
import Threads from "@/components/Threads";
import { Button } from "@/components/ui/button";
import { ArrowDown, Radio, Tv, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

export function Hero() {
  const { t } = useLanguage();
  const { user, openAuthModal } = useAuth();

  const scrollToForm = () => {
    const el = document.getElementById("info-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    if (!user) {
      openAuthModal("login");
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#060807] pt-14 pb-16 md:pt-22 md:pb-26 border-b border-emerald-950/40">
      {/* Animated Glowing Luminous Wave Threads Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <Threads
          color={[0.06, 0.95, 0.45]}
          accentColor={[0.1, 0.85, 0.95]}
          amplitude={1.8}
          distance={0.35}
          enableMouseInteraction={true}
          lineCount={85}
          thickness={0.75}
          softness={1.25}
          speed={0.5}
          waves={1.15}
          split={0.04}
          fray={0.5}
          brightness={1.5}
          className="opacity-90"
        />

        {/* Soft emerald and cyan ambient glow behind lines */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(16,185,129,0.22),rgba(6,182,212,0.08),transparent_65%)]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[320px] bg-emerald-500/12 blur-[100px] rounded-full" />
      </div>

      <div className="container relative z-10 mx-auto max-w-5xl px-4 sm:px-6 text-center">
        {/* Pill Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3.5 py-1 text-xs font-medium text-emerald-300 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)] sm:text-sm">
          <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span>{t.hero.pill}</span>
        </div>

        {/* System Name with React Bits BlurText */}
        <div className="mb-3 flex justify-center">
          <BlurText
            text="Paload ko"
            delay={80}
            animateBy="letters"
            direction="top"
            className="text-3xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_0_25px_rgba(16,185,129,0.35)] font-sans"
          />
        </div>

        {/* Clear Headline */}
        <h1 className="mx-auto max-w-3xl text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white px-2">
          {t.hero.headline}
        </h1>

        {/* Friendly Description */}
        <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-lg sm:leading-relaxed text-zinc-300 px-2">
          {t.hero.descriptionWelcome}{" "}
          <strong className="text-emerald-400 font-semibold">{t.hero.descriptionBrand}</strong>
          {t.hero.descriptionBody}
        </p>

        {/* Call-to-action button */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row px-4">
          <Button
            size="lg"
            onClick={scrollToForm}
            className="group h-11 w-full sm:w-auto px-7 text-sm sm:text-base font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_25px_rgba(16,185,129,0.45)] hover:shadow-[0_0_35px_rgba(16,185,129,0.7)] cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{t.hero.fillButton}</span>
            <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
          </Button>
        </div>

        {/* Supported Units Highlights */}
        <div className="mt-12 pt-8 border-t border-emerald-950/60 px-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90 mb-4">
            {t.hero.supportedUnitsTitle}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-emerald-500/25 bg-zinc-900/70 p-2.5 sm:p-3 text-xs sm:text-sm font-medium text-zinc-100 backdrop-blur-md shadow-xs transition-colors hover:border-emerald-500/50">
              <Radio className="size-3.5 sm:size-4 text-emerald-400 shrink-0" />
              <span>Satellite</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-emerald-500/25 bg-zinc-900/70 p-2.5 sm:p-3 text-xs sm:text-sm font-medium text-zinc-100 backdrop-blur-md shadow-xs transition-colors hover:border-emerald-500/50">
              <Tv className="size-3.5 sm:size-4 text-emerald-400 shrink-0" />
              <span>GSat</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-emerald-500/25 bg-zinc-900/70 p-2.5 sm:p-3 text-xs sm:text-sm font-medium text-zinc-100 backdrop-blur-md shadow-xs transition-colors hover:border-emerald-500/50">
              <ShieldCheck className="size-3.5 sm:size-4 text-emerald-400 shrink-0" />
              <span>Fili TV</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-emerald-500/25 bg-zinc-900/70 p-2.5 sm:p-3 text-xs sm:text-sm font-medium text-zinc-100 backdrop-blur-md shadow-xs transition-colors hover:border-emerald-500/50">
              <Radio className="size-3.5 sm:size-4 text-emerald-400 shrink-0" />
              <span>Sky Direct</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg border border-emerald-500/25 bg-zinc-900/70 p-2.5 sm:p-3 text-xs sm:text-sm font-medium text-zinc-100 backdrop-blur-md shadow-xs transition-colors hover:border-emerald-500/50 col-span-2 sm:col-span-1">
              <Tv className="size-3.5 sm:size-4 text-emerald-400 shrink-0" />
              <span>Signal</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
