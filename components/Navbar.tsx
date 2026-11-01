"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Tv,
  Sparkles,
  LayoutDashboard,
  History,
  User,
  LogIn,
  LogOut,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { useSubmissions } from "@/context/SubmissionContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Navbar() {
  const router = useRouter();
  const { submissions } = useSubmissions();
  const { t, language } = useLanguage();
  const { user, profile, signOut, openAuthModal } = useAuth();

  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

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

  const handleConfirmSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      setIsSignOutDialogOpen(false);
      router.push("/");
    } finally {
      setIsSigningOut(false);
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
                  onClick={() => setIsSignOutDialogOpen(true)}
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

      {/* Customer Sign-Out Confirmation Dialog */}
      <AlertDialog
        open={isSignOutDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isSigningOut) {
            setIsSignOutDialogOpen(false);
          }
        }}
      >
        <AlertDialogContent className="w-[calc(100%-1.5rem)] max-w-md border-zinc-800 bg-zinc-950/95 text-zinc-100 p-5 sm:p-6 shadow-2xl">
          <AlertDialogHeader className="gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900/80 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-300">
                <LogOut className="size-3 text-emerald-400" />
                <span>Paload ko</span>
              </span>
            </div>
            <AlertDialogTitle className="text-lg font-bold text-white">
              {t.auth.signOutConfirmTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {t.auth.signOutConfirmMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {profile && (
            <div className="my-1 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Account</span>
              <span className="font-semibold text-white">
                {profile.account_name || user?.email}
              </span>
            </div>
          )}

          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-3 border-t border-zinc-800/80">
            <AlertDialogCancel
              disabled={isSigningOut}
              onClick={() => setIsSignOutDialogOpen(false)}
              className="cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 h-9 text-xs font-medium"
            >
              {t.auth.signOutCancelBtn}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isSigningOut}
              onClick={handleConfirmSignOut}
              className="cursor-pointer font-semibold bg-zinc-200 hover:bg-white text-zinc-950 h-9 text-xs shadow-md transition-colors"
            >
              {isSigningOut ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  <span>{t.auth.signingOutBtn}</span>
                </>
              ) : (
                <>
                  <LogOut className="mr-1.5 size-3.5" />
                  <span>{t.auth.signOutConfirmBtn}</span>
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

