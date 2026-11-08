"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Menu,
  X,
  Send,
  Clock,
  Archive,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
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
import { useSubmissions, Submission } from "@/context/SubmissionContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Navbar() {
  const router = useRouter();
  const { submissions, archiveSubmission } = useSubmissions();
  const { t, language } = useLanguage();
  const { user, profile, signOut, openAuthModal } = useAuth();

  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // History Tab & Action states for complete Session Log functionality
  const [historyTab, setHistoryTab] = useState<"active" | "archived">("active");
  const [confirmActionDialog, setConfirmActionDialog] = useState<{
    isOpen: boolean;
    action: "archive" | "restore";
    record: Submission | null;
  }>({
    isOpen: false,
    action: "archive",
    record: null,
  });
  const [actionFeedback, setActionFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);

  const isBisaya = language === "ceb";

  // Data isolation: If user is not authenticated, records are strictly empty
  const activeSubmissions = useMemo(
    () => (user ? submissions.filter((s) => !s.archivedAt) : []),
    [submissions, user]
  );

  const archivedSubmissions = useMemo(
    () => (user ? submissions.filter((s) => !!s.archivedAt) : []),
    [submissions, user]
  );

  const currentViewList = historyTab === "active" ? activeSubmissions : archivedSubmissions;

  // Close session log panel on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  // Prevent background scroll when history dropdown is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const scrollToForm = () => {
    setIsMobileMenuOpen(false);
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

  const handleOpenConfirm = (action: "archive" | "restore", record: Submission) => {
    setConfirmActionDialog({
      isOpen: true,
      action,
      record,
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmActionDialog.record) return;
    const recId = confirmActionDialog.record.id;
    const action = confirmActionDialog.action;
    setIsProcessingAction(true);

    try {
      if (action === "archive") {
        const res = await archiveSubmission?.(recId, true);
        if (res?.success) {
          setActionFeedback({
            type: "success",
            message: isBisaya
              ? "Gibalhin ang rekord sa Archived"
              : "Record moved to Archived",
          });
        } else {
          setActionFeedback({
            type: "error",
            message:
              res?.error ||
              (isBisaya
                ? "Napakyas sa pag-archive sa rekord"
                : "Failed to archive record"),
          });
        }
      } else {
        const res = await archiveSubmission?.(recId, false);
        if (res?.success) {
          setActionFeedback({
            type: "success",
            message: isBisaya
              ? "Gibalik ang rekord sa Aktibo"
              : "Record restored to Active Submissions",
          });
        } else {
          setActionFeedback({
            type: "error",
            message:
              res?.error ||
              (isBisaya
                ? "Napakyas sa pagpahiuli sa rekord"
                : "Failed to restore record"),
          });
        }
      }
    } catch (err: any) {
      setActionFeedback({
        type: "error",
        message:
          err?.message ||
          (isBisaya
            ? "May nahitabong sayop sa pagproseso"
            : "An unexpected error occurred"),
      });
    } finally {
      setIsProcessingAction(false);
      setConfirmActionDialog({ isOpen: false, action: "archive", record: null });
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  const handleConfirmSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      setIsSignOutDialogOpen(false);
      setIsMobileMenuOpen(false);
      router.push("/");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#060807]/95 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-3 sm:px-6 gap-2">
          {/* Brand */}
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer shrink-0 min-w-0"
          >
            <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-transform group-hover:scale-105 shrink-0">
              <Tv className="size-4 sm:size-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors truncate">
                  Paload ko
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 shrink-0">
                  <Sparkles className="size-2.5" />
                  {t.nav.prototype}
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 hidden lg:inline truncate">
                {t.nav.portalSubtitle}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links & Controls (>= 1024px) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <LanguageSwitcher />

            {/* Customer Auth Button / Profile Indicator */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs text-zinc-300">
                  <User className="size-3 text-emerald-400" />
                  <span className="max-w-[120px] truncate font-medium">
                    {profile?.account_name || user.email?.split("@")[0]}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSignOutDialogOpen(true)}
                  title={isBisaya ? "Gawas (Sign Out)" : "Sign Out"}
                  className="cursor-pointer text-zinc-400 hover:text-rose-400 hover:bg-zinc-800/60 h-9 px-2.5 text-xs focus-visible:ring-2 focus-visible:ring-rose-500/50"
                >
                  <LogOut className="size-3.5 mr-1" />
                  <span>{isBisaya ? "Gawas" : "Sign Out"}</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => openAuthModal("login")}
                className="cursor-pointer font-medium border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm px-3 h-9 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500/50"
              >
                <LogIn className="size-3.5 text-emerald-400 mr-1.5 shrink-0" />
                <span>{isBisaya ? "Sulod" : "Sign In"}</span>
              </Button>
            )}

            {/* Desktop History Button: Toggles the History Dropdown */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={t.nav.history}
              className="cursor-pointer font-medium border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm px-3 h-9 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500/50"
            >
              <History className="size-3.5 text-emerald-400 mr-1.5 shrink-0" />
              <span>{t.nav.history}</span>
              {activeSubmissions.length > 0 && (
                <span className="ml-1.5 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                  {activeSubmissions.length}
                </span>
              )}
            </Button>

            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                aria-label={t.nav.admin}
                className="cursor-pointer font-medium border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm px-3 h-9 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500/50"
              >
                <LayoutDashboard className="size-3.5 text-emerald-400 mr-1.5 shrink-0" />
                <span>{t.nav.admin}</span>
              </Button>
            </Link>

            <Button
              onClick={scrollToForm}
              size="sm"
              aria-label={t.nav.enterInfoDesktop}
              className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all text-xs sm:text-sm px-3.5 h-9 focus-visible:ring-2 focus-visible:ring-emerald-500/50 shrink-0"
            >
              <span>{t.nav.enterInfoDesktop}</span>
            </Button>
          </div>

          {/* Mobile Navigation Header Controls (< 1024px) */}
          <div className="flex lg:hidden items-center gap-1.5 shrink-0">
            <LanguageSwitcher />

            {/* Quick Action Button for Mobile / Tablet */}
            <Button
              onClick={scrollToForm}
              size="sm"
              aria-label={t.nav.enterInfoMobile}
              className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all text-xs px-2.5 h-9 min-h-[38px] focus-visible:ring-2 focus-visible:ring-emerald-500/50 shrink-0"
            >
              <Send className="size-3 mr-1" />
              <span>{t.nav.enterInfoMobile}</span>
            </Button>

            {/* Hamburger / Close Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              className="flex size-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:text-white hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 transition-colors cursor-pointer shrink-0"
            >
              {isMobileMenuOpen ? (
                <X className="size-5 text-emerald-400" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>

        {/* Backdrop for click-outside dismissal across all viewports */}
        {isMobileMenuOpen && (
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            aria-hidden="true"
          />
        )}

        {/* Session Log / History Dropdown Panel (Responsive on Mobile, Tablet & Laptop) */}
        {isMobileMenuOpen && (
          <div
            id="session-log-dropdown"
            role="dialog"
            aria-modal="true"
            aria-label={isBisaya ? "Talaan sa Sesyon" : "Session Log"}
            className="fixed top-[calc(4rem+8px)] left-3 right-3 sm:left-auto sm:right-4 md:right-6 sm:w-[500px] z-50 flex flex-col rounded-2xl border border-zinc-800/90 bg-[#090d0b]/98 backdrop-blur-xl shadow-2xl shadow-black/80 max-h-[calc(100dvh-5.5rem)] overflow-hidden animate-in fade-in slide-in-from-top-3 duration-250 ease-out motion-reduce:transition-none motion-reduce:transform-none"
          >
            {/* Header: Title, Session Log Badge, Count & Close Button */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-zinc-800/80 bg-zinc-950/70 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
                  <History className="size-4.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block truncate">
                    {isBisaya ? "Talaan sa Sesyon" : "Session Log"}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                    {isBisaya ? "Kasaysayan sa Pagsumiter" : "Submission History"}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {user ? (
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 font-mono">
                    {currentViewList.length}{" "}
                    {currentViewList.length === 1
                      ? isBisaya
                        ? "rekord"
                        : "record"
                      : isBisaya
                      ? "mga rekord"
                      : "records"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-950/40 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                    <ShieldAlert className="size-2.5" />
                    <span>{isBisaya ? "Gipanalipdan" : "Protected"}</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label={isBisaya ? "Isara ang session log" : "Close session log"}
                  className="size-8 flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer min-h-[32px] min-w-[32px]"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Customer Status / Auth Ribbon */}
            <div className="px-3.5 py-2 border-b border-zinc-800/60 bg-zinc-900/40 flex items-center justify-between text-xs shrink-0">
              {user ? (
                <>
                  <div className="flex items-center gap-2 min-w-0">
                    <User className="size-3.5 text-emerald-400 shrink-0" />
                    <span className="text-zinc-400 text-[11px] truncate">
                      {isBisaya ? "Nakasulod:" : "Account:"}{" "}
                      <strong className="text-zinc-200 font-medium">
                        {profile?.account_name || user.email?.split("@")[0]}
                      </strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSignOutDialogOpen(true);
                    }}
                    className="text-rose-400 hover:text-rose-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <LogOut className="size-3" />
                    <span>{isBisaya ? "Gawas" : "Sign Out"}</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 min-w-0">
                    <User className="size-3.5 text-zinc-500 shrink-0" />
                    <span className="text-zinc-400 text-[11px] truncate">
                      {isBisaya ? "Bisita (Guest Customer)" : "Guest Customer"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openAuthModal("login");
                    }}
                    className="text-emerald-400 hover:text-emerald-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <LogIn className="size-3" />
                    <span>{isBisaya ? "Sulod" : "Sign In"}</span>
                  </button>
                </>
              )}
            </div>

            {/* Action Feedback Banner */}
            {actionFeedback && (
              <div
                className={`mx-3.5 mt-2.5 flex items-center justify-between gap-2 rounded-xl border p-2.5 text-xs animate-in fade-in slide-in-from-top-1 duration-150 shrink-0 ${
                  actionFeedback.type === "error"
                    ? "border-rose-500/40 bg-rose-950/40 text-rose-200"
                    : "border-emerald-500/40 bg-emerald-950/40 text-emerald-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {actionFeedback.type === "error" ? (
                    <ShieldAlert className="size-3.5 text-rose-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                  )}
                  <span className="text-[11px] font-medium">{actionFeedback.message}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActionFeedback(null)}
                  className={`cursor-pointer ${
                    actionFeedback.type === "error"
                      ? "text-rose-400 hover:text-white"
                      : "text-emerald-400 hover:text-white"
                  }`}
                >
                  <X className="size-3" />
                </button>
              </div>
            )}

            {/* Active Submissions vs Archived Tabs for Authenticated Customers */}
            {user && (
              <div className="px-3.5 pt-2.5 shrink-0">
                <div className="grid grid-cols-2 rounded-xl border border-zinc-800 bg-zinc-950/90 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setHistoryTab("active")}
                    className={`min-h-[34px] flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      historyTab === "active"
                        ? "bg-emerald-500 text-zinc-950 shadow-xs"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>{t.history.archiveUi.viewActiveTab}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                        historyTab === "active"
                          ? "bg-emerald-950/20 text-zinc-950 font-bold"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {activeSubmissions.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHistoryTab("archived")}
                    className={`min-h-[34px] flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      historyTab === "archived"
                        ? "bg-amber-500 text-zinc-950 shadow-xs"
                        : "text-zinc-400 hover:text-amber-300"
                    }`}
                  >
                    <Archive className="size-3" />
                    <span>
                      {t.history.archiveUi.viewArchivedTab(archivedSubmissions.length).split("(")[0].trim()}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                        historyTab === "archived"
                          ? "bg-amber-950/20 text-zinc-950 font-bold"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {archivedSubmissions.length}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-2.5">
              {!user ? (
                /* Protected State: Signed-out visitors cannot view customer records */
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-950/30 text-amber-400">
                    <ShieldAlert className="size-6" />
                  </div>
                  <div className="space-y-1 max-w-xs">
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      {isBisaya ? "Gikinahanglan ang Pag-login" : "Customer Sign In Required"}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {t.auth.signInPromptMessage}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-1 w-full max-w-xs">
                    <Button
                      size="sm"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal("login");
                      }}
                      className="flex-1 cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-sm text-xs h-9 rounded-xl"
                    >
                      <LogIn className="size-3.5 mr-1" />
                      <span>{isBisaya ? "Sulod" : "Sign In"}</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        openAuthModal("register");
                      }}
                      className="flex-1 cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 text-xs h-9 rounded-xl"
                    >
                      <span>{isBisaya ? "Rehistro" : "Register"}</span>
                    </Button>
                  </div>
                </div>
              ) : historyTab === "archived" && archivedSubmissions.length === 0 ? (
                /* Empty state for archived records */
                <div className="flex flex-col items-center justify-center py-7 px-4 text-center space-y-2.5">
                  <div className="flex size-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-950/30 text-amber-400">
                    <Archive className="size-5" />
                  </div>
                  <div className="space-y-1 max-w-xs">
                    <h4 className="text-sm font-semibold text-white">
                      {t.history.archiveUi.archivedEmptyTitle}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {t.history.archiveUi.archivedEmptyBody}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setHistoryTab("active")}
                    className="mt-2 min-h-[40px] px-3.5 rounded-xl text-xs font-medium border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 cursor-pointer"
                  >
                    <span>{t.history.archiveUi.viewActiveTab}</span>
                  </Button>
                </div>
              ) : currentViewList.length === 0 ? (
                /* Empty state for active records */
                <div className="flex flex-col items-center justify-center py-7 px-4 text-center space-y-2.5">
                  <div className="flex size-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/60 text-zinc-500">
                    <History className="size-5 text-zinc-400" />
                  </div>
                  <div className="space-y-1 max-w-xs">
                    <h4 className="text-sm font-semibold text-white">
                      {t.history.emptyTitle}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {t.history.emptyBody}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={scrollToForm}
                    className="mt-2 min-h-[42px] px-4 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-sm cursor-pointer"
                  >
                    <Send className="size-3.5 mr-1.5" />
                    <span>{isBisaya ? "Magpaload Karon" : "Request Reload"}</span>
                  </Button>
                </div>
              ) : (
                <>
                  {/* Notice banner for archived view */}
                  {historyTab === "archived" && (
                    <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-950/20 p-2.5 text-xs text-amber-200">
                      <Archive className="size-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-[11px] leading-relaxed">
                        <strong className="text-amber-300 block">
                          {t.history.archiveUi.archivedSectionTitle}
                        </strong>
                        <span className="text-zinc-400">
                          {t.history.archiveUi.archivedSectionSub}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Customer history records */}
                  {currentViewList.map((sub) => {
                    const isDone = sub.paymentStatus === "Done";
                    const isArchived = !!sub.archivedAt;

                    return (
                      <div
                        key={sub.id}
                        className={`rounded-xl border p-3 space-y-2 transition-colors ${
                          isArchived
                            ? "border-amber-900/50 bg-amber-950/15 hover:border-amber-800/60"
                            : "border-zinc-800/80 bg-zinc-900/70 hover:border-zinc-700/80"
                        }`}
                      >
                        {/* Card Top: Customer Name, Unit Type & Status */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-semibold text-zinc-500 block">
                              {isBisaya ? "Ngalan sa Account" : "Account Name"}
                            </span>
                            <div className="font-semibold text-white text-xs sm:text-sm break-words">
                              {sub.name}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                            <span className="inline-flex items-center rounded-md border border-zinc-700/80 bg-zinc-950 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                              {sub.unitType}
                            </span>
                            {isDone ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                                <span className="size-1.5 rounded-full bg-emerald-400" />
                                {t.history.doneStatus}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                                <span className="size-1.5 rounded-full bg-amber-400" />
                                {t.history.pendingStatus}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Card Middle: Account Number & Payment Amount */}
                        <div className="grid grid-cols-2 gap-2 text-xs pt-1.5 border-t border-zinc-800/50">
                          <div>
                            <span className="text-zinc-500 block text-[10px] uppercase font-medium">
                              {isBisaya ? "Numero sa Receiver" : "Account Number"}
                            </span>
                            <span className="font-mono text-zinc-200 text-xs break-all font-medium">
                              {sub.receiverNumber}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block text-[10px] uppercase font-medium">
                              {isBisaya ? "Bayad" : "Payment"}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-emerald-400 text-xs font-semibold">
                                {sub.paymentAmount || "\u2014"}
                              </span>
                              {sub.packageDescription && (
                                <span className="rounded bg-zinc-800 px-1 py-0.2 text-[9px] text-zinc-300 font-medium truncate max-w-[90px]">
                                  {sub.packageDescription}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom: Timestamp, GCash Reference & Action Button */}
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1.5 border-t border-zinc-800/40">
                          <span className="flex items-center gap-1 font-mono text-[10px]">
                            <Clock className="size-3 text-zinc-500" />
                            {sub.submittedAt}
                          </span>
                          <div className="flex items-center gap-2">
                            {sub.gcashReferenceNumber && (
                              <span className="font-mono text-[10px] text-zinc-500 truncate max-w-[95px] sm:max-w-[130px]">
                                Ref: {sub.gcashReferenceNumber}
                              </span>
                            )}
                            {historyTab === "active" ? (
                              <button
                                type="button"
                                onClick={() => handleOpenConfirm("archive", sub)}
                                title={t.history.archiveUi.archiveBtn}
                                className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-950/30 hover:bg-amber-900/50 px-2 py-0.5 text-[10px] font-medium text-amber-300 cursor-pointer transition-colors"
                              >
                                <Archive className="size-2.5" />
                                <span>{t.history.archiveUi.archiveBtn}</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenConfirm("restore", sub)}
                                title={t.history.archiveUi.restoreBtn}
                                className="inline-flex items-center gap-1 rounded-md bg-emerald-500 hover:bg-emerald-400 px-2 py-0.5 text-[10px] font-semibold text-zinc-950 cursor-pointer transition-colors shadow-xs"
                              >
                                <RotateCcw className="size-2.5" />
                                <span>{t.history.archiveUi.restoreBtn}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Pinned Panel Footer: Quick Navigation & Portal Links */}
            <div className="p-3 sm:p-3.5 border-t border-zinc-800/80 bg-zinc-950/80 grid grid-cols-3 gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/history");
                }}
                className="cursor-pointer border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 text-[11px] font-medium min-h-[40px] px-2 rounded-xl flex items-center justify-center gap-1"
              >
                <History className="size-3 text-emerald-400" />
                <span className="truncate">{t.nav.history}</span>
              </Button>

              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full cursor-pointer border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 text-[11px] font-medium min-h-[40px] px-2 rounded-xl flex items-center justify-center gap-1"
                >
                  <LayoutDashboard className="size-3 text-emerald-400" />
                  <span className="truncate">{t.nav.admin}</span>
                </Button>
              </Link>

              <Button
                size="sm"
                onClick={scrollToForm}
                className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-[11px] min-h-[40px] px-2 rounded-xl shadow-xs flex items-center justify-center gap-1"
              >
                <Send className="size-3" />
                <span className="truncate">{isBisaya ? "Paload" : "Reload"}</span>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Customer Archive / Restore Confirmation Dialog */}
      <AlertDialog
        open={confirmActionDialog.isOpen}
        onOpenChange={(open) => {
          if (!open && !isProcessingAction) {
            setConfirmActionDialog({ isOpen: false, action: "archive", record: null });
          }
        }}
      >
        <AlertDialogContent className="w-[calc(100%-1.5rem)] max-w-md border-zinc-800 bg-zinc-950/95 text-zinc-100 p-5 sm:p-6 shadow-2xl rounded-2xl max-h-[90dvh] overflow-y-auto overscroll-contain">
          <AlertDialogHeader className="gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
                  confirmActionDialog.action === "archive"
                    ? "border-amber-500/30 bg-amber-950/40 text-amber-300"
                    : "border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
                }`}
              >
                {confirmActionDialog.action === "archive" ? (
                  <Archive className="size-3" />
                ) : (
                  <RotateCcw className="size-3" />
                )}
                <span>
                  {confirmActionDialog.action === "archive"
                    ? t.history.archiveUi.archiveBtn
                    : t.history.archiveUi.restoreBtn}
                </span>
              </span>
            </div>
            <AlertDialogTitle className="text-lg font-bold text-white">
              {confirmActionDialog.action === "archive"
                ? t.history.archiveUi.confirmDialog.archiveTitle
                : t.history.archiveUi.confirmDialog.restoreTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {confirmActionDialog.action === "archive"
                ? t.history.archiveUi.confirmDialog.archiveDesc
                : t.history.archiveUi.confirmDialog.restoreDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {confirmActionDialog.record && (
            <div className="my-1 rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">
                  {t.history.archiveUi.confirmDialog.accountLabel}:
                </span>
                <span className="font-semibold text-white">
                  {confirmActionDialog.record.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">
                  {t.history.archiveUi.confirmDialog.unitLabel}:
                </span>
                <span className="text-emerald-400 font-mono">
                  {confirmActionDialog.record.unitType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">
                  {t.history.archiveUi.confirmDialog.amountLabel}:
                </span>
                <span className="text-zinc-200 font-mono">
                  {confirmActionDialog.record.paymentAmount}
                </span>
              </div>
            </div>
          )}

          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-3 border-t border-zinc-800/80">
            <AlertDialogCancel
              disabled={isProcessingAction}
              onClick={() =>
                setConfirmActionDialog({ isOpen: false, action: "archive", record: null })
              }
              className="cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 h-11 sm:h-9 text-xs sm:text-sm font-medium rounded-xl"
            >
              {t.history.archiveUi.confirmDialog.cancelBtn}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isProcessingAction}
              onClick={handleConfirmAction}
              className={`cursor-pointer font-semibold h-11 sm:h-9 text-xs sm:text-sm shadow-md transition-colors rounded-xl ${
                confirmActionDialog.action === "archive"
                  ? "bg-amber-500 hover:bg-amber-400 text-zinc-950"
                  : "bg-emerald-500 hover:bg-emerald-400 text-zinc-950"
              }`}
            >
              {isProcessingAction ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : confirmActionDialog.action === "archive" ? (
                <>
                  <Archive className="mr-1.5 size-3.5" />
                  <span>{t.history.archiveUi.confirmDialog.confirmArchiveBtn}</span>
                </>
              ) : (
                <>
                  <RotateCcw className="mr-1.5 size-3.5" />
                  <span>{t.history.archiveUi.confirmDialog.confirmRestoreBtn}</span>
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Customer Sign-Out Confirmation Dialog */}
      <AlertDialog
        open={isSignOutDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isSigningOut) {
            setIsSignOutDialogOpen(false);
          }
        }}
      >
        <AlertDialogContent className="w-[calc(100%-1.5rem)] max-w-md border-zinc-800 bg-zinc-950/95 text-zinc-100 p-5 sm:p-6 shadow-2xl rounded-2xl max-h-[90dvh] overflow-y-auto overscroll-contain">
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
              <span className="font-semibold text-white truncate max-w-[200px]">
                {profile.account_name || user?.email}
              </span>
            </div>
          )}

          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-3 border-t border-zinc-800/80">
            <AlertDialogCancel
              disabled={isSigningOut}
              onClick={() => setIsSignOutDialogOpen(false)}
              className="cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 h-11 sm:h-9 text-xs sm:text-sm font-medium rounded-xl"
            >
              {t.auth.signOutCancelBtn}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isSigningOut}
              onClick={handleConfirmSignOut}
              className="cursor-pointer font-semibold bg-zinc-200 hover:bg-white text-zinc-950 h-11 sm:h-9 text-xs sm:text-sm shadow-md transition-colors rounded-xl"
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
