import React from "react";
import { Tv } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800/80 bg-[#060807] py-8 text-center text-xs text-zinc-400">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 font-semibold text-white">
          <div className="flex size-6 items-center justify-center rounded-md bg-emerald-500 text-zinc-950 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            <Tv className="size-3.5" />
          </div>
          <span>Paload ko</span>
        </div>
        <p>
          Initial UI Prototype • Receiver Reload Information System
        </p>
        <p className="text-[11px] text-zinc-500">
          Frontend prototype only. No data stored.
        </p>
      </div>
    </footer>
  );
}
