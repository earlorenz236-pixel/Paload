"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tv, Sparkles, LayoutDashboard, History, User, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubmissions } from "@/context/SubmissionContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Navbar() {
  const router = useRouter();
  const { submissions } = useSubmissions();
  const { t, language } = useLanguage();
  const { user, profile, signOut, openAuthModal } = useAuth();

  const isBisaya = language === "ceb";

  const scrollToForm = () => {
    const el = document.getElementById("info-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#info-form");
    }
    if (!user) {
      openAuthModal("login");
    }
  };

  const scrollToHistory = () => {
    const el = document.getElementById("submission-history");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#submission-history");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#060807]/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-2.5 sm:px-6 gap-1.5 sm:gap-2">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 group cursor-pointer shrink-0">
            <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-transform group-hover:scale-105 shrink-0">
              <Tv className="size-4 sm:size-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Paload ko
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  <Sparkles className="size-2.5" />
                  {t.nav.prototype}
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 hidden md:inline">
                {t.nav.portalSubtitle}
              </span>
            </div>
          </Link>

          {/* Action Buttons & Language Switcher */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <LanguageSwitcher />

            {/* Customer Auth Button / Profile Indicator */}
            {user ? (
              <div className="flex items-center gap-1">
                <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs text-zinc-300">
                  <User className="size-3 text-emerald-400" />
                  <span className="max-w-[100px] truncate font-medium">
                    {profile?.account_name || user.email?.split("@")[0]}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  title={isBisaya ? "Gawas (Sign Out)" : "Sign Out"}
                  className="cursor-pointer text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/60 h-8 px-2 text-xs"
                >
                  <LogOut className="size-3.5" />
                  <span className="hidden md:inline ml-1">{isBisaya ? "Gawas" : "Sign Out"}</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openAuthModal("login")}
                className="cursor-pointer font-medium border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 transition-colors focus-visible:ring-emerald-500/50"
              >
                <LogIn className="size-3.5 text-emerald-400 shrink-0" />
                <span className="hidden sm:inline ml-1">{isBisaya ? "Sulod" : "Sign In"}</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={scrollToHistory}
              aria-label={t.nav.history}
              className="cursor-pointer font-medium border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 transition-colors focus-visible:ring-emerald-500/50"
            >
              <History className="size-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline ml-1">{t.nav.history}</span>
              {submissions.length > 0 && (
                <span className="ml-1 rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                  {submissions.length}
                </span>
              )}
            </Button>

            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                aria-label={t.nav.admin}
                className="cursor-pointer font-medium border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9 transition-colors focus-visible:ring-emerald-500/50"
              >
                <LayoutDashboard className="size-3.5 text-emerald-400 shrink-0" />
                <span className="hidden sm:inline ml-1">{t.nav.admin}</span>
              </Button>
            </Link>

            <Button
              onClick={scrollToForm}
              size="sm"
              aria-label={t.nav.enterInfoDesktop}
              className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all text-xs sm:text-sm px-2.5 sm:px-3.5 h-8 sm:h-9 focus-visible:ring-emerald-500/50 shrink-0"
            >
              <span className="hidden md:inline">{t.nav.enterInfoDesktop}</span>
              <span className="md:hidden">{t.nav.enterInfoMobile}</span>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}

