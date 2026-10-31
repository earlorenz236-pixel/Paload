"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface RegistrationSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  username?: string;
  requiresVerification?: boolean;
}

export function RegistrationSuccessDialog({
  isOpen,
  onClose,
  onContinue,
  username,
  requiresVerification = false,
}: RegistrationSuccessDialogProps) {
  const { t, language } = useLanguage();
  const isBisaya = language === "ceb";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-sm sm:max-w-[390px] border border-emerald-500/25 bg-zinc-950/95 text-zinc-100 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(16,185,129,0.15)] rounded-2xl backdrop-blur-xl">
        <DialogHeader className="flex flex-col items-center text-center space-y-3 pt-2">
          {/* Success Checkmark Icon with emerald glow */}
          <div className="relative flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)] animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="size-8 text-emerald-400" />
            <div className="absolute inset-0 rounded-2xl bg-emerald-400/10 blur-sm pointer-events-none" />
          </div>

          <div className="space-y-2">
            <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-white">
              {t.auth.registrationSuccessTitle}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-xs mx-auto">
              {requiresVerification
                ? t.auth.registrationSuccessVerificationRequired
                : t.auth.registrationSuccessMessage}
            </DialogDescription>
          </div>

          {username && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/90 px-3 py-1 text-xs text-zinc-400 shadow-inner">
              <span>{isBisaya ? "Username:" : "Username:"}</span>
              <span className="font-semibold text-emerald-400 font-mono">@{username}</span>
            </div>
          )}
        </DialogHeader>

        <DialogFooter className="mt-4 sm:mt-5 flex flex-col gap-2 w-full">
          <Button
            type="button"
            onClick={onContinue}
            className="w-full cursor-pointer bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold h-10 text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_25px_rgba(16,185,129,0.45)]"
          >
            <span>{t.auth.continueBtn}</span>
            <ArrowRight className="size-4 ml-1.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
