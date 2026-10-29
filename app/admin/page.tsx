"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSubmissions, Submission } from "@/context/SubmissionContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tv,
  ArrowLeft,
  Users,
  Inbox,
  Shield,
  Info,
  Trash2,
  Radio,
  Clock,
  Phone,
  Search,
  X,
  Check,
  CheckCircle2,
  Archive,
  RotateCcw,
  ShieldAlert,
  LogOut,
} from "lucide-react";
import BlurText from "@/components/BlurText";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface ConfirmDialogState {
  isOpen: boolean;
  action: "archive" | "soft-delete" | "restore";
  record: Submission | null;
}

export default function AdminPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { submissions, updatePaymentStatus, archiveSubmission, clearSubmissions, loading: submissionsLoading } = useSubmissions();
  const { language, t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "DONE">("ALL");
  const [adminView, setAdminView] = useState<"active" | "archived">("active");

  // In-memory UI preview tracking for local responsiveness
  const [previewArchivedIds, setPreviewArchivedIds] = useState<Set<string>>(new Set());
  const [previewSoftDeletedIds, setPreviewSoftDeletedIds] = useState<Set<string>>(new Set());
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    action: "archive",
    record: null,
  });
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Summary counts
  const pendingCount = useMemo(
    () =>
      submissions.filter(
        (s) => !s.paymentStatus || s.paymentStatus === "Pending Verification"
      ).length,
    [submissions]
  );

  const doneCount = useMemo(
    () => submissions.filter((s) => s.paymentStatus === "Done").length,
    [submissions]
  );

  // Segregated active vs archived submissions based on database archivedAt and UI state
  const activeSubmissions = useMemo(
    () => submissions.filter((s) => !previewArchivedIds.has(s.id) && !s.archivedAt),
    [submissions, previewArchivedIds]
  );

  const archivedSubmissions = useMemo(
    () => submissions.filter((s) => previewArchivedIds.has(s.id) || !!s.archivedAt),
    [submissions, previewArchivedIds]
  );

  const currentViewList = adminView === "active" ? activeSubmissions : archivedSubmissions;

  // Filtered customer records by search term and payment status filter
  const filteredSubmissions = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return currentViewList.filter((sub) => {
      const matchesSearch = !term || sub.name.toLowerCase().includes(term);
      const isDone = sub.paymentStatus === "Done";
      const isPending =
        !sub.paymentStatus || sub.paymentStatus === "Pending Verification";

      if (statusFilter === "PENDING") {
        return matchesSearch && isPending;
      }
      if (statusFilter === "DONE") {
        return matchesSearch && isDone;
      }
      return matchesSearch;
    });
  }, [currentViewList, searchTerm, statusFilter]);

  const openDialog = (
    action: "archive" | "soft-delete" | "restore",
    record: Submission
  ) => {
    setConfirmDialog({
      isOpen: true,
      action,
      record,
    });
  };

  const closeDialog = () => {
    setConfirmDialog({
      isOpen: false,
      action: "archive",
      record: null,
    });
  };

  const handleConfirmAction = () => {
    if (!confirmDialog.record) return;
    const recId = confirmDialog.record.id;

    if (confirmDialog.action === "archive") {
      archiveSubmission(recId, true);
      setPreviewArchivedIds((prev) => new Set([...prev, recId]));
      setActionFeedback(t.admin.archiveUi.confirmDialog.archiveTitle);
    } else if (confirmDialog.action === "soft-delete") {
      archiveSubmission(recId, true);
      setPreviewSoftDeletedIds((prev) => new Set([...prev, recId]));
      setPreviewArchivedIds((prev) => new Set([...prev, recId]));
      setActionFeedback(t.admin.archiveUi.confirmDialog.softDeleteTitle);
    } else if (confirmDialog.action === "restore") {
      archiveSubmission(recId, false);
      setPreviewArchivedIds((prev) => {
        const next = new Set(prev);
        next.delete(recId);
        return next;
      });
      setPreviewSoftDeletedIds((prev) => {
        const next = new Set(prev);
        next.delete(recId);
        return next;
      });
      setActionFeedback(t.admin.archiveUi.confirmDialog.restoreTitle);
    }

    closeDialog();
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#060807] text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#060807]/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-3 sm:px-6 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer">
              <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-transform group-hover:scale-105 shrink-0">
                <Tv className="size-4 sm:size-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                    Paload ko
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                    <Shield className="size-2.5" />
                    {t.nav.adminBadge}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 hidden sm:inline">
                  {t.nav.adminSubtitle}
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <LanguageSwitcher />

            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer font-medium border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm px-2.5 sm:px-3 h-8 sm:h-9"
              >
                <ArrowLeft className="mr-1.5 size-3.5 sm:size-4" />
                <span className="hidden sm:inline">{t.nav.userPovForm}</span>
                <span className="sm:hidden">{t.nav.userPovMobile}</span>
              </Button>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await signOut();
                router.push("/admin-login");
              }}
              title="Sign Out of Admin Portal"
              className="cursor-pointer font-medium border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-rose-400 text-xs sm:text-sm px-2.5 sm:px-3 h-8 sm:h-9 transition-colors"
            >
              <LogOut className="mr-1.5 size-3.5 sm:size-4 text-rose-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6 sm:py-10">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-6 sm:space-y-8">
          {/* Page Title & Status */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                <Shield className="size-3.5" />
                <span>{t.admin.liveBadge}</span>
              </div>
              <div className="flex items-center gap-3">
                <BlurText
                  key={language}
                  text={t.admin.title}
                  delay={60}
                  animateBy="words"
                  direction="top"
                  className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl"
                />
              </div>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                {t.admin.subtitle}
              </p>
            </div>

            {submissions.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearSubmissions}
                className="w-full sm:w-auto cursor-pointer border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors h-9"
                title={t.admin.clearSubmissionsBtn}
              >
                <Trash2 className="mr-1.5 size-3.5" />
                {t.admin.clearSubmissionsBtn}
              </Button>
            )}
          </div>

          {/* Temporary State Notice Banner */}
          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-950/20 p-4 text-xs text-zinc-300 sm:text-sm backdrop-blur-xs">
            <Info className="size-5 shrink-0 text-emerald-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-white">{t.admin.noticeTitle}</p>
              <p className="text-zinc-400 leading-relaxed">
                {t.admin.noticeBody}
              </p>
            </div>
          </div>

          {/* UI Action Feedback Banner */}
          {actionFeedback && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-amber-950/30 p-3.5 text-xs text-amber-200 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2">
                <ShieldAlert className="size-4 text-amber-400 shrink-0" />
                <span>
                  <strong>{actionFeedback}:</strong> {t.admin.archiveUi.uiPreviewNotice}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActionFeedback(null)}
                className="text-amber-400 hover:text-white cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}

          {/* Metrics Overview Cards (Total, Pending Verification Summary, Done) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Submissions Card */}
            <Card className="border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {t.admin.totalSubmissionsTitle}
                  </CardTitle>
                  <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Users className="size-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-white tracking-tight">
                  {submissions.length}
                </div>
                <CardDescription className="text-xs text-zinc-400 mt-1">
                  {t.admin.totalSubmissionsSub}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Pending Verification Summary Card */}
            <Card className="border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    {t.admin.pendingCountTitle}
                  </CardTitle>
                  <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Clock className="size-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-amber-300 tracking-tight">
                  {pendingCount}
                </div>
                <CardDescription className="text-xs text-zinc-400 mt-1">
                  {t.admin.pendingCountSub(pendingCount)}
                </CardDescription>
              </CardContent>
            </Card>

            {/* Done / Verified Summary Card */}
            <Card className="border-zinc-800 bg-zinc-900/80 backdrop-blur-sm shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    {t.admin.doneCountTitle}
                  </CardTitle>
                  <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="size-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-emerald-400 tracking-tight">
                  {doneCount}
                </div>
                <CardDescription className="text-xs text-zinc-400 mt-1">
                  {t.admin.doneCountSub(doneCount)}
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Submissions Table / Search / Filters / Archive Section Card */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-xl overflow-hidden backdrop-blur-sm">
            {/* Header: Title, Active/Archived View Switcher, Search Bar & Status Filters */}
            <div className="p-4 sm:p-6 border-b border-zinc-800/80 space-y-4">
              {/* Top Row: View Switcher (Active vs Archived UI Preview) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800/60">
                <div className="inline-flex items-center rounded-xl border border-zinc-800 bg-zinc-950/90 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setAdminView("active")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      adminView === "active"
                        ? "bg-emerald-500 text-zinc-950 shadow-xs"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {t.admin.archiveUi.viewActiveTab} ({activeSubmissions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminView("archived")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      adminView === "archived"
                        ? "bg-amber-500 text-zinc-950 shadow-xs"
                        : "text-zinc-400 hover:text-amber-300"
                    }`}
                  >
                    <Archive className="size-3.5" />
                    <span>{t.admin.archiveUi.viewArchivedTab(archivedSubmissions.length)}</span>
                  </button>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 px-3 py-1 text-[11px] font-semibold text-amber-300 self-start sm:self-auto">
                  <ShieldAlert className="size-3" />
                  <span>{t.admin.archiveUi.uiPreviewBadge}</span>
                </div>
              </div>

              {/* Title and Record Count Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {adminView === "active" ? (
                      t.admin.tableCardTitle
                    ) : (
                      <>
                        <Archive className="size-5 text-amber-400" />
                        <span>{t.admin.archiveUi.archivedSectionTitle}</span>
                      </>
                    )}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {adminView === "active"
                      ? t.admin.tableCardSub
                      : t.admin.archiveUi.archivedSectionSub}
                  </p>
                </div>
                <span className="text-xs text-zinc-400 font-mono">
                  {searchTerm.trim() || statusFilter !== "ALL"
                    ? t.admin.showingResults(
                        filteredSubmissions.length,
                        currentViewList.length
                      )
                    : t.admin.submissionCount(currentViewList.length)}
                </span>
              </div>

              {/* Customer Search Bar & Status Filter Pills */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
                {/* 1. Customer Search Input */}
                <div className="relative flex-1 min-w-0 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Search className="size-4" />
                  </div>
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t.admin.searchPlaceholder}
                    className="pl-9 pr-9 h-10 w-full bg-zinc-950/80 border-zinc-800 text-white placeholder:text-zinc-500 text-sm focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500 rounded-lg"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white cursor-pointer"
                      title={t.admin.clearSearch}
                      aria-label={t.admin.clearSearch}
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>

                {/* 2. Status Filters (All, Pending Verification, Done) */}
                <div className="flex items-center flex-wrap gap-1.5 shrink-0">
                  <span className="text-xs text-zinc-400 mr-1 hidden sm:inline">
                    {t.admin.filterLabel}
                  </span>

                  <button
                    type="button"
                    onClick={() => setStatusFilter("ALL")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      statusFilter === "ALL"
                        ? "bg-zinc-800 text-white border border-zinc-700 shadow-xs"
                        : "bg-zinc-950/60 text-zinc-400 hover:text-white border border-zinc-800/80"
                    }`}
                  >
                    {t.admin.filterAll} ({currentViewList.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilter("PENDING")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      statusFilter === "PENDING"
                        ? "bg-amber-950/80 text-amber-300 border border-amber-500/50 shadow-xs"
                        : "bg-zinc-950/60 text-zinc-400 hover:text-amber-300 border border-zinc-800/80"
                    }`}
                  >
                    <Clock className="size-3 text-amber-400" />
                    <span>{t.admin.filterPending}</span>
                    <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] text-amber-300 font-mono">
                      {currentViewList.filter((s) => !s.paymentStatus || s.paymentStatus === "Pending Verification").length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilter("DONE")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                      statusFilter === "DONE"
                        ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-xs"
                        : "bg-zinc-950/60 text-zinc-400 hover:text-emerald-300 border border-zinc-800/80"
                    }`}
                  >
                    <CheckCircle2 className="size-3 text-emerald-400" />
                    <span>{t.admin.filterDone}</span>
                    <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[10px] text-emerald-300 font-mono">
                      {currentViewList.filter((s) => s.paymentStatus === "Done").length}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table className="min-w-[960px]">
                <TableHeader className="bg-zinc-950/60 border-zinc-800">
                  <TableRow className="border-zinc-800/80 hover:bg-transparent">
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      {t.admin.table.accountName}
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      {t.admin.table.phoneNumber}
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      {t.admin.table.unitType}
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      {t.admin.table.accountNumber}
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      {t.admin.table.paymentGcash}
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      {t.admin.table.address}
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      {t.admin.table.note}
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      {t.admin.table.submittedAt}
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400 text-right">
                      {t.admin.table.action}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-zinc-800/60">
                  {submissions.length === 0 ? (
                    /* Initial empty state when no submissions exist */
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={9} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                          <div className="flex size-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/80 text-zinc-400">
                            <Inbox className="size-6 text-zinc-400" />
                          </div>
                          <div className="space-y-1 max-w-sm">
                            <h4 className="text-base font-bold text-white">
                              {t.admin.emptyTitle}
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              {t.admin.emptyBody}
                            </p>
                          </div>
                          <Link href="/">
                            <Button
                              size="sm"
                              className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] mt-1"
                            >
                              {t.admin.goToUserPovBtn}
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : adminView === "archived" && archivedSubmissions.length === 0 ? (
                    /* Archived section empty state */
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={9} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                          <div className="flex size-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-950/30 text-amber-400">
                            <Archive className="size-6" />
                          </div>
                          <div className="space-y-1 max-w-sm">
                            <h4 className="text-base font-bold text-white">
                              {t.admin.archiveUi.archivedEmptyTitle}
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              {t.admin.archiveUi.archivedEmptyBody}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setAdminView("active")}
                            className="cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 text-xs mt-1"
                          >
                            {t.admin.archiveUi.viewActiveTab}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredSubmissions.length === 0 ? (
                    /* Empty search/filter state */
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={9} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                          <div className="flex size-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/80 text-zinc-400">
                            <Search className="size-6 text-zinc-400" />
                          </div>
                          <div className="space-y-1 max-w-sm">
                            <h4 className="text-base font-bold text-white">
                              {t.admin.noSearchResultsTitle}
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              {t.admin.noSearchResultsBody(searchTerm)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            {searchTerm && (
                              <Button
                                size="sm"
                                onClick={() => setSearchTerm("")}
                                className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                              >
                                <X className="mr-1.5 size-3.5" />
                                {t.admin.clearSearchBtn}
                              </Button>
                            )}
                            {statusFilter !== "ALL" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setStatusFilter("ALL")}
                                className="cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200"
                              >
                                {t.admin.filterAll}
                              </Button>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubmissions.map((sub) => {
                      const isDone = sub.paymentStatus === "Done";
                      const isSoftDeleted = previewSoftDeletedIds.has(sub.id);
                      return (
                        <TableRow
                          key={sub.id}
                          className="border-zinc-800/60 hover:bg-zinc-950/40 transition-colors"
                        >
                          <TableCell className="font-semibold text-white whitespace-nowrap">
                            {sub.name}
                          </TableCell>
                          <TableCell className="text-zinc-300 font-mono text-xs whitespace-nowrap">
                            {sub.phoneNumber}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                              <Radio className="size-3" />
                              {sub.unitType}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-emerald-400 font-semibold whitespace-nowrap">
                            {sub.receiverNumber}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <div className="flex flex-col text-xs gap-1">
                              <div className="flex items-center gap-1.5 font-medium text-white">
                                <span className="font-bold text-emerald-400 font-mono text-sm">
                                  {sub.paymentAmount || "—"}
                                </span>
                                {sub.packageDescription && (
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                                      sub.packageDescription === "All Channels"
                                        ? "border-emerald-500/40 bg-emerald-950/80 text-emerald-300"
                                        : "border-zinc-700 bg-zinc-800/80 text-zinc-300"
                                    }`}
                                  >
                                    {sub.packageDescription}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-zinc-400 font-mono">
                                Ref: {sub.gcashReferenceNumber || "—"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell
                            className="text-zinc-300 max-w-xs truncate text-xs"
                            title={sub.address}
                          >
                            {sub.address}
                          </TableCell>
                          <TableCell
                            className="text-zinc-300 max-w-xs text-xs"
                            title={sub.note || undefined}
                          >
                            {sub.note && sub.note.trim() ? (
                              <span className="text-zinc-300 break-words line-clamp-2">
                                {sub.note}
                              </span>
                            ) : (
                              <span className="text-zinc-500 italic text-[11px]">
                                {t.admin.noNoteProvided}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-zinc-400 text-xs whitespace-nowrap">
                            {sub.submittedAt}
                          </TableCell>
                          {/* Actions Column: Verification, Archive, Restore & Soft Delete */}
                          <TableCell className="text-right whitespace-nowrap">
                            <div className="flex flex-col items-end gap-1.5">
                              {/* Status Badges */}
                              <div className="flex items-center gap-1.5">
                                {isDone ? (
                                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-950/70 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                                    <CheckCircle2 className="size-3 text-emerald-400" />
                                    <span>{t.admin.doneStatus}</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-950/70 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
                                    <Clock className="size-3 text-amber-400" />
                                    <span>{t.admin.pendingStatus}</span>
                                  </span>
                                )}
                                {isSoftDeleted && (
                                  <span className="inline-flex items-center gap-1 rounded bg-rose-950/70 border border-rose-500/40 px-1.5 py-0.2 text-[10px] font-semibold text-rose-300">
                                    {t.admin.archiveUi.softDeletedBadge}
                                  </span>
                                )}
                              </div>

                              {/* Action Buttons Row */}
                              <div className="flex items-center gap-1 mt-0.5">
                                {!isDone && adminView === "active" && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => updatePaymentStatus(sub.id, "Done")}
                                    className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_10px_rgba(16,185,129,0.3)] h-7 px-2 text-xs transition-transform active:scale-95"
                                    title={t.admin.markAsDoneBtn}
                                  >
                                    <Check className="mr-1 size-3" />
                                    {t.admin.markAsDoneBtn}
                                  </Button>
                                )}

                                {adminView === "active" ? (
                                  <>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openDialog("archive", sub)}
                                      className="cursor-pointer border-amber-500/30 bg-amber-950/30 hover:bg-amber-900/50 text-amber-300 h-7 px-2 text-xs"
                                      title={t.admin.archiveUi.archiveBtn}
                                    >
                                      <Archive className="mr-1 size-3" />
                                      <span>{t.admin.archiveUi.archiveBtn}</span>
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openDialog("soft-delete", sub)}
                                      className="cursor-pointer border-zinc-700 bg-zinc-800/50 hover:bg-rose-950/50 hover:border-rose-500/40 hover:text-rose-300 text-zinc-400 h-7 px-2 text-xs"
                                      title={t.admin.archiveUi.softDeleteBtn}
                                    >
                                      <Trash2 className="size-3" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={() => openDialog("restore", sub)}
                                      className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 h-7 px-2 text-xs shadow-xs"
                                      title={t.admin.archiveUi.restoreBtn}
                                    >
                                      <RotateCcw className="mr-1 size-3" />
                                      <span>{t.admin.archiveUi.restoreBtn}</span>
                                    </Button>
                                    {!isSoftDeleted && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openDialog("soft-delete", sub)}
                                        className="cursor-pointer border-zinc-700 bg-zinc-800/50 hover:bg-rose-950/50 hover:border-rose-500/40 hover:text-rose-300 text-zinc-400 h-7 px-2 text-xs"
                                        title={t.admin.archiveUi.softDeleteBtn}
                                      >
                                        <Trash2 className="size-3" />
                                      </Button>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Responsive Card View */}
            <div className="md:hidden">
              {submissions.length === 0 ? (
                /* Initial empty state when no submissions exist */
                <div className="flex flex-col items-center justify-center p-10 text-center space-y-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/80 text-zinc-400">
                    <Inbox className="size-6 text-zinc-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">
                      {t.admin.emptyTitle}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {t.admin.emptyBody}
                    </p>
                  </div>
                  <Link href="/">
                    <Button
                      size="sm"
                      className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] mt-1"
                    >
                      {t.admin.goToUserPovBtn}
                    </Button>
                  </Link>
                </div>
              ) : adminView === "archived" && archivedSubmissions.length === 0 ? (
                /* Archived section empty state on mobile */
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-950/30 text-amber-400">
                    <Archive className="size-6" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h4 className="text-base font-bold text-white">
                      {t.admin.archiveUi.archivedEmptyTitle}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {t.admin.archiveUi.archivedEmptyBody}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAdminView("active")}
                    className="cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 text-xs mt-1"
                  >
                    {t.admin.archiveUi.viewActiveTab}
                  </Button>
                </div>
              ) : filteredSubmissions.length === 0 ? (
                /* Empty search/filter state on mobile */
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/80 text-zinc-400">
                    <Search className="size-6 text-zinc-400" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h4 className="text-base font-bold text-white">
                      {t.admin.noSearchResultsTitle}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {t.admin.noSearchResultsBody(searchTerm)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    {searchTerm && (
                      <Button
                        size="sm"
                        onClick={() => setSearchTerm("")}
                        className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      >
                        <X className="mr-1.5 size-3.5" />
                        {t.admin.clearSearchBtn}
                      </Button>
                    )}
                    {statusFilter !== "ALL" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setStatusFilter("ALL")}
                        className="cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200"
                      >
                        {t.admin.filterAll}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/80">
                  {filteredSubmissions.map((sub) => {
                    const isDone = sub.paymentStatus === "Done";
                    const isSoftDeleted = previewSoftDeletedIds.has(sub.id);
                    return (
                      <div key={sub.id} className="p-4 space-y-3.5 bg-zinc-950/30">
                        {/* Card Header: Customer Name, Phone, Unit Type & Status Badges */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
                              {t.admin.mobile.accountName}
                            </span>
                            <div className="font-bold text-white text-base break-words">
                              {sub.name}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono mt-0.5">
                              <Phone className="size-3 text-zinc-500" />
                              <a
                                href={`tel:${sub.phoneNumber}`}
                                className="hover:text-emerald-400 transition-colors"
                              >
                                {sub.phoneNumber}
                              </a>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                              <Radio className="size-2.5" />
                              {sub.unitType}
                            </span>
                            <div className="flex items-center gap-1 flex-wrap justify-end">
                              {isDone ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 rounded-full px-2 py-0.5">
                                  <CheckCircle2 className="size-3 text-emerald-400" />
                                  {t.admin.doneStatus}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/70 border border-amber-500/30 rounded-full px-2 py-0.5">
                                  <Clock className="size-3 text-amber-400" />
                                  {t.admin.pendingStatus}
                                </span>
                              )}
                              {isSoftDeleted && (
                                <span className="inline-flex items-center rounded bg-rose-950/70 border border-rose-500/40 px-1.5 py-0.2 text-[10px] font-semibold text-rose-300">
                                  {t.admin.archiveUi.softDeletedBadge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Account Number & Time */}
                        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-zinc-800/40">
                          <div>
                            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
                              {t.admin.mobile.accountNumber}
                            </span>
                            <span className="font-mono text-emerald-400 font-semibold break-all text-xs sm:text-sm">
                              {sub.receiverNumber}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
                              {t.admin.mobile.time}
                            </span>
                            <span className="text-zinc-400 flex items-center gap-1 text-[11px] break-words">
                              <Clock className="size-3 text-zinc-500 shrink-0" />
                              {sub.submittedAt}
                            </span>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div className="text-xs pt-1 border-t border-zinc-800/40 space-y-1">
                          <span className="text-zinc-500 text-[10px] uppercase font-semibold block">
                            {t.admin.mobile.paymentGcash}
                          </span>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-emerald-400 font-mono text-sm">
                                {sub.paymentAmount || "—"}
                              </span>
                              {sub.packageDescription && (
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                                    sub.packageDescription === "All Channels"
                                      ? "border-emerald-500/40 bg-emerald-950/80 text-emerald-300"
                                      : "border-zinc-700 bg-zinc-800/80 text-zinc-300"
                                  }`}
                                >
                                  {sub.packageDescription}
                                </span>
                              )}
                            </div>
                            <span className="text-zinc-300 font-mono text-[11px] break-all">
                              Ref: {sub.gcashReferenceNumber || "—"}
                            </span>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="text-xs pt-1 border-t border-zinc-800/40">
                          <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
                            {t.admin.mobile.address}
                          </span>
                          <span className="text-zinc-300 break-words text-xs">
                            {sub.address}
                          </span>
                        </div>

                        {/* Note */}
                        <div className="text-xs pt-1 border-t border-zinc-800/40">
                          <span className="text-zinc-500 block text-[10px] uppercase font-semibold">
                            {t.admin.mobile.note}
                          </span>
                          {sub.note && sub.note.trim() ? (
                            <div className="rounded-lg bg-zinc-900/80 border border-zinc-800/80 p-2.5 mt-1 text-zinc-200 break-words whitespace-pre-wrap text-xs">
                              {sub.note}
                            </div>
                          ) : (
                            <span className="text-zinc-500 italic text-[11px]">
                              {t.admin.noNoteProvided}
                            </span>
                          )}
                        </div>

                        {/* Mobile Actions: Verification, Archive, Restore & Soft Delete */}
                        <div className="pt-2 border-t border-zinc-800/60 space-y-2">
                          {!isDone && adminView === "active" && (
                            <Button
                              type="button"
                              onClick={() => updatePaymentStatus(sub.id, "Done")}
                              className="w-full cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] h-11 sm:h-10 text-xs sm:text-sm transition-transform active:scale-[0.98] focus-visible:ring-emerald-500/50"
                            >
                              <Check className="mr-1.5 size-4" />
                              {t.admin.markAsDoneBtn}
                            </Button>
                          )}

                          <div className="flex items-center gap-2">
                            {adminView === "active" ? (
                              <>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => openDialog("archive", sub)}
                                  className="flex-1 cursor-pointer border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 h-10 sm:h-9 text-xs font-semibold focus-visible:ring-amber-500/50"
                                >
                                  <Archive className="mr-1.5 size-3.5" />
                                  {t.admin.archiveUi.archiveBtn}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => openDialog("soft-delete", sub)}
                                  className="flex-1 cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-rose-950/50 hover:border-rose-500/40 hover:text-rose-300 text-zinc-300 h-10 sm:h-9 text-xs font-semibold focus-visible:ring-rose-500/50"
                                >
                                  <Trash2 className="mr-1.5 size-3.5" />
                                  {t.admin.archiveUi.softDeleteBtn}
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  type="button"
                                  onClick={() => openDialog("restore", sub)}
                                  className="flex-1 cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 h-10 sm:h-9 text-xs focus-visible:ring-emerald-500/50"
                                >
                                  <RotateCcw className="mr-1.5 size-3.5" />
                                  {t.admin.archiveUi.restoreBtn}
                                </Button>
                                {!isSoftDeleted && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => openDialog("soft-delete", sub)}
                                    className="flex-1 cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-rose-950/50 hover:border-rose-500/40 hover:text-rose-300 text-zinc-300 h-10 sm:h-9 text-xs font-semibold focus-visible:ring-rose-500/50"
                                  >
                                    <Trash2 className="mr-1.5 size-3.5" />
                                    {t.admin.archiveUi.softDeleteBtn}
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog Modal for Archive, Soft Delete, and Restore */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="w-[calc(100%-1.5rem)] max-w-md border-zinc-800 bg-zinc-950/95 text-zinc-100 p-4 sm:p-6 shadow-2xl max-h-[88dvh] overflow-y-auto overscroll-contain">
          <DialogHeader className="gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-950/60 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
                <ShieldAlert className="size-3 text-amber-400" />
                {t.admin.archiveUi.uiPreviewBadge}
              </span>
            </div>
            <DialogTitle className="text-lg font-bold text-white">
              {confirmDialog.action === "archive"
                ? t.admin.archiveUi.confirmDialog.archiveTitle
                : confirmDialog.action === "soft-delete"
                ? t.admin.archiveUi.confirmDialog.softDeleteTitle
                : t.admin.archiveUi.confirmDialog.restoreTitle}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400 leading-relaxed">
              {confirmDialog.action === "archive"
                ? t.admin.archiveUi.confirmDialog.archiveDesc
                : confirmDialog.action === "soft-delete"
                ? t.admin.archiveUi.confirmDialog.softDeleteDesc
                : t.admin.archiveUi.confirmDialog.restoreDesc}
            </DialogDescription>
          </DialogHeader>

          {confirmDialog.record && (
            <div className="my-2 rounded-xl border border-zinc-800/90 bg-zinc-900/70 p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  {t.admin.archiveUi.confirmDialog.customerLabel}
                </span>
                <span className="font-semibold text-white">
                  {confirmDialog.record.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  {t.admin.archiveUi.confirmDialog.unitLabel}
                </span>
                <span className="font-medium text-emerald-400">
                  {confirmDialog.record.unitType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  {t.admin.archiveUi.confirmDialog.accountLabel}
                </span>
                <span className="font-mono text-zinc-200">
                  {confirmDialog.record.receiverNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  {t.admin.archiveUi.confirmDialog.amountLabel}
                </span>
                <span className="font-mono font-bold text-white">
                  {confirmDialog.record.paymentAmount}
                </span>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-amber-500/25 bg-amber-950/20 p-2.5 text-[11px] text-amber-200/90">
            <p>{t.admin.archiveUi.confirmDialog.warningNote}</p>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              className="cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 h-9 text-xs"
            >
              {t.admin.archiveUi.confirmDialog.cancelBtn}
            </Button>
            <Button
              type="button"
              onClick={handleConfirmAction}
              className={`cursor-pointer font-semibold h-9 text-xs shadow-md ${
                confirmDialog.action === "soft-delete"
                  ? "bg-rose-600 hover:bg-rose-500 text-white"
                  : confirmDialog.action === "archive"
                  ? "bg-amber-500 hover:bg-amber-400 text-zinc-950"
                  : "bg-emerald-500 hover:bg-emerald-400 text-zinc-950"
              }`}
            >
              {confirmDialog.action === "archive"
                ? t.admin.archiveUi.confirmDialog.confirmArchiveBtn
                : confirmDialog.action === "soft-delete"
                ? t.admin.archiveUi.confirmDialog.confirmSoftDeleteBtn
                : t.admin.archiveUi.confirmDialog.confirmRestoreBtn}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#060807] py-6 text-center text-xs text-zinc-500">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-zinc-300 font-semibold">
            <Tv className="size-4 text-emerald-400" />
            <span>{t.admin.footerTitle}</span>
          </div>
          <p className="text-[11px]">
            {t.admin.footerSubtitle}
          </p>
        </div>
      </footer>
    </div>
  );
}
