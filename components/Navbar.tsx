"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tv, Sparkles, LayoutDashboard, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubmissions } from "@/context/SubmissionContext";

export function Navbar() {
  const router = useRouter();
  const { submissions } = useSubmissions();

  const scrollToForm = () => {
    const el = document.getElementById("info-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#info-form");
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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#060807]/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer shrink-0">
          <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-transform group-hover:scale-105 shrink-0">
            <Tv className="size-4 sm:size-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Paload ko
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                <Sparkles className="size-2.5" />
                Prototype
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 hidden md:inline">
              TV &amp; Satellite Reload Portal
            </span>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToHistory}
            className="cursor-pointer font-medium border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
          >
            <History className="size-3.5 mr-1 text-emerald-400 shrink-0" />
            <span>History</span>
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
              className="cursor-pointer font-medium border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
            >
              <LayoutDashboard className="size-3.5 mr-1 text-emerald-400 shrink-0" />
              <span>Admin</span>
            </Button>
          </Link>

          <Button
            onClick={scrollToForm}
            size="sm"
            className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all text-xs sm:text-sm px-2.5 sm:px-3.5 h-8 sm:h-9"
          >
            <span className="hidden md:inline">Enter Information</span>
            <span className="md:hidden">Reload</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
