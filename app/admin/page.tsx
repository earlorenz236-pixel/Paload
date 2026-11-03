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
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
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
  RotateCw,
  ShieldAlert,
  LogOut,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface ConfirmDialogState {
  isOpen: boolean;
  action: "archive" | "restore" | "delete";
  record: Submission | null;
}

export default function AdminPage() {
  const router = useRouter();
  const { signOut } = useAuth();
  const {
    submissions,
    updatePaymentStatus,
    archiveSubmission,
    deleteSubmission,
    refreshSubmissions,
    loading: submissionsLoading,
  } = useSubmissions();
  const { language, t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "DONE">("ALL");
  const [adminView, setAdminView] = useState<"active" | "archived">("active");

  // Separate states for Archive/Restore vs Permanent Deletion
  const [archiveDialog, setArchiveDialog] = useState<{
    isOpen: boolean;
    action: "archive" | "restore";
    record: Submission | null;
  }>({
    isOpen: false,
    action: "archive",
    record: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    record: Submission | null;
  }>({
    isOpen: false,
    record: null,
  });

  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const [isProcessingArchive, setIsProcessingArchive] = useState<boolean>(false);
  const [isProcessingDelete, setIsProcessingDelete] = useState<boolean>(false);

  // Segregated active vs archived submissions based on database archivedAt
  // Consistent counting rules:
  // - Active Records = records that are not archived
  // - Archived Records = archived records only
  const activeSubmissions = useMemo(
    () => submissions.filter((s) => !s.archivedAt),
    [submissions]
  );

  const archivedSubmissions = useMemo(
    () => submissions.filter((s) => !!s.archivedAt),
    [submissions]
  );

  // Consistent counting rules:
  // - Total Submissions = active records only
  // - Pending Verification = active records with Pending Verification status
  // - Done / Verified = active records with Done status
  // Archived records must not contribute to active submission statistics.
  const totalActiveSubmissions = activeSubmissions.length;

  const pendingCount = useMemo(
    () =>
      activeSubmissions.filter(
        (s) => !s.paymentStatus || s.paymentStatus === "Pending Verification"
      ).length,
    [activeSubmissions]
  );

  const doneCount = useMemo(
    () => activeSubmissions.filter((s) => s.paymentStatus === "Done").length,
    [activeSubmissions]
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

  const openArchiveDialog = (
    action: "archive" | "restore",
    record: Submission
  ) => {
    setArchiveDialog({
      isOpen: true,
      action,
      record,
    });
  };

  const closeArchiveDialog = () => {
    if (isProcessingArchive) return;
    setArchiveDialog({
      isOpen: false,
      action: "archive",
      record: null,
    });
  };

  const openDeleteDialog = (record: Submission) => {
    setDeleteDialog({
      isOpen: true,
      record,
    });
  };

  const closeDeleteDialog = () => {
    if (isProcessingDelete) return;
    setDeleteDialog({
      isOpen: false,
      record: null,
    });
  };

  const handleConfirmArchive = async () => {
    if (!archiveDialog.record) return;
    const rec = archiveDialog.record;
    setIsProcessingArchive(true);

    try {
      if (archiveDialog.action === "archive") {
        const res = await archiveSubmission(rec.id, true);
        if (res.success) {
          setNotification({
            type: "info",
            message: `Record for "${rec.name}" has been moved to Archived Records.`,
          });
        } else {
          setNotification({
            type: "error",
            message: res.error || "Failed to archive record.",
          });
        }
      } else if (archiveDialog.action === "restore") {
        const res = await archiveSubmission(rec.id, false);
        if (res.success) {
          setNotification({
            type: "success",
            message: `Record for "${rec.name}" has been restored to Active Records.`,
          });
        } else {
          setNotification({
            type: "error",
            message: res.error || "Failed to restore record.",
          });
        }
      }
    } finally {
      setIsProcessingArchive(false);
      closeArchiveDialog();
      setTimeout(() => {
        setNotification((prev) => (prev?.type === "info" ? null : prev));
      }, 5000);
    }
  };

  const handlePermanentDelete = async () => {
    if (!deleteDialog.record) return;
    const rec = deleteDialog.record;
    setIsProcessingDelete(true);

    try {
      const res = await deleteSubmission(rec.id);
      if (res.success) {
        setNotification({
          type: "success",
          message: t.admin.archiveUi.confirmDialog.deleteSuccessNotification(rec.name),
        });
      } else {
        setNotification({
          type: "error",
          message: t.admin.archiveUi.confirmDialog.deleteErrorNotification(res.error),
        });
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: t.admin.archiveUi.confirmDialog.deleteErrorNotification(
          err?.message || "Unknown error"
        ),
      });
    } finally {
      setIsProcessingDelete(false);
      setDeleteDialog({ isOpen: false, record: null });
      setTimeout(() => {
        setNotification((prev) => (prev?.type === "success" ? null : prev));
      }, 6000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-200 overflow-x-hidden">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/70 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-3 sm:px-6 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer">
              <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 transition-transform group-hover:scale-105 shrink-0">
                <Tv className="size-3.5" />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm font-semibold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Paload ko
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                  <Shield className="size-2.5" />
                  {t.nav.adminBadge}
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
                className="cursor-pointer font-medium border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs px-2.5 min-h-[36px] h-9 sm:h-8 rounded-lg"
              >
                <ArrowLeft className="mr-1 size-3.5" />
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
              className="cursor-pointer font-medium border-zinc-800 bg-zinc-900/50 hover:bg-rose-950/30 hover:border-rose-500/30 hover:text-rose-300 text-zinc-400 text-xs px-2.5 min-h-[36px] h-9 sm:h-8 rounded-lg transition-colors"
            >
              <LogOut className="mr-1 sm:mr-1.5 size-3.5 text-rose-400" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-5 sm:py-8">
        <div className="container mx-auto max-w-6xl px-3 sm:px-6 space-y-5 sm:space-y-6">
          {/* Page Title & Status */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-1">
                <span className="inline-block size-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
                <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">{t.admin.liveBadge}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {t.admin.title}
              </h1>
              <p className="mt-0.5 text-xs sm:text-sm text-zinc-400">
                {t.admin.subtitle}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshSubmissions()}
              disabled={submissionsLoading}
              className="w-full sm:w-auto cursor-pointer border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors h-8 text-xs font-medium rounded-md"
              title={t.admin.refreshDataBtn}
            >
              <RotateCw className={`mr-1.5 size-3.5 ${submissionsLoading ? "animate-spin text-emerald-400" : ""}`} />
              {t.admin.refreshDataBtn}
            </Button>
          </div>

          {/* Sync / State Notice Banner */}
          <div className="flex items-start gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3.5 text-xs text-zinc-400">
            <Info className="size-4 shrink-0 text-emerald-400 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-zinc-200">{t.admin.noticeTitle}</p>
              <p className="text-zinc-400 leading-relaxed text-[11px] sm:text-xs">
                {t.admin.noticeBody}
              </p>
            </div>
          </div>

          {/* Notification Banner (Success / Error / Info) */}
          {notification && (
            <div
              className={`flex items-start justify-between gap-3 rounded-lg border p-3.5 text-xs sm:text-sm animate-in fade-in slide-in-from-top-1 duration-200 ${
                notification.type === "success"
                  ? "border-emerald-500/30 bg-emerald-950/30 text-emerald-200"
                  : notification.type === "error"
                  ? "border-rose-500/30 bg-rose-950/30 text-rose-200"
                  : "border-amber-500/30 bg-amber-950/20 text-amber-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {notification.type === "success" ? (
                  <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                ) : notification.type === "error" ? (
                  <AlertTriangle className="size-4 text-rose-400 shrink-0" />
                ) : (
                  <Info className="size-4 text-amber-400 shrink-0" />
                )}
                <span className="font-medium leading-relaxed">
                  {notification.message}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setNotification(null)}
                className="text-zinc-400 hover:text-white cursor-pointer shrink-0 mt-0.5"
                title="Dismiss"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          {/* Metrics Overview Cards (Responsive 1-col on mobile, 2-col on tablet, 3-col on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {/* 1. Total Submissions Card */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  {t.admin.totalSubmissionsTitle}
                </span>
                <div className="flex size-7 items-center justify-center rounded-md bg-zinc-800/60 text-zinc-400 border border-zinc-700/40">
                  <Users className="size-3.5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-white font-mono">
                  {totalActiveSubmissions}
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  {t.admin.totalSubmissionsSub}
                </p>
              </div>
            </div>

            {/* 2. Pending Verification Summary Card */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-amber-400">
                  {t.admin.pendingCountTitle}
                </span>
                <div className="flex size-7 items-center justify-center rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Clock className="size-3.5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-amber-300 font-mono">
                  {pendingCount}
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  {t.admin.pendingCountSub(pendingCount)}
                </p>
              </div>
            </div>

            {/* 3. Done / Verified Summary Card (Spans 2 cols on tablet for a balanced grid) */}
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                  {t.admin.doneCountTitle}
                </span>
                <div className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="size-3.5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-emerald-400 font-mono">
                  {doneCount}
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  {t.admin.doneCountSub(doneCount)}
                </p>
              </div>
            </div>
          </div>

          {/* Submissions Records Management Section */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 shadow-xs overflow-hidden">
            {/* Header: Title, Description, Active/Archived Tabs, Search & Filters */}
            <div className="p-4 sm:p-5 border-b border-zinc-800/70 space-y-4">
              {/* Row 1: Section Title, Subtitle & Displayed Count */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                    {adminView === "active" ? (
                      t.admin.tableCardTitle
                    ) : (
                      <>
                        <Archive className="size-4 text-amber-400" />
                        <span>{t.admin.archiveUi.archivedSectionTitle}</span>
                      </>
                    )}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {adminView === "active"
                      ? t.admin.tableCardSub
                      : t.admin.archiveUi.archivedSectionSub}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-md border border-zinc-800 bg-zinc-950/80 px-2 py-1 text-xs font-mono text-zinc-400 self-start sm:self-auto">
                  {searchTerm.trim() || statusFilter !== "ALL"
                    ? t.admin.showingResults(
                        filteredSubmissions.length,
                        currentViewList.length
                      )
                    : t.admin.submissionCount(currentViewList.length)}
                </span>
              </div>

              {/* Row 2: Navigation Tabs (Active Records vs Archived Records) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-zinc-800/60">
                <div className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex items-center rounded-lg bg-zinc-950/90 p-1 border border-zinc-800/70 text-xs gap-1 sm:gap-0">
                  <button
                    type="button"
                    onClick={() => setAdminView("active")}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 min-h-[40px] sm:min-h-[32px] rounded-md text-xs font-medium cursor-pointer transition-colors ${
                      adminView === "active"
                        ? "bg-zinc-800 text-white shadow-xs"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <span>{t.admin.archiveUi.viewActiveTab}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                        adminView === "active"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {activeSubmissions.length}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminView("archived")}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 min-h-[40px] sm:min-h-[32px] rounded-md text-xs font-medium cursor-pointer transition-colors ${
                      adminView === "archived"
                        ? "bg-zinc-800 text-white shadow-xs"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Archive className="size-3 text-amber-400" />
                    <span>{t.admin.archiveUi.viewArchivedTab(archivedSubmissions.length).split('(')[0].trim()}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                        adminView === "archived"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {archivedSubmissions.length}
                    </span>
                  </button>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-300 self-start sm:self-auto">
                  <ShieldAlert className="size-3" />
                  <span>{t.admin.archiveUi.uiPreviewBadge}</span>
                </div>
              </div>

              {/* Row 3: Customer Search Bar & Status Filter Pills */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2">
                {/* 1. Customer Search Input */}
                <div className="relative flex-1 min-w-0 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Search className="size-3.5" />
                  </div>
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t.admin.searchPlaceholder}
                    className="pl-9 pr-9 min-h-[44px] sm:min-h-[36px] h-auto w-full bg-zinc-950/80 border-zinc-800 text-white placeholder:text-zinc-500 text-base sm:text-xs focus-visible:ring-emerald-500/40 focus-visible:border-emerald-500/60 rounded-xl sm:rounded-md"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center min-w-[36px] text-zinc-400 hover:text-white cursor-pointer"
                      title={t.admin.clearSearch}
                      aria-label={t.admin.clearSearch}
                    >
                      <X className="size-4 sm:size-3.5" />
                    </button>
                  )}
                </div>

                {/* 2. Status Filters (All, Pending Verification, Done) */}
                <div className="flex items-center flex-wrap gap-2 sm:gap-1.5 shrink-0">
                  <span className="text-xs text-zinc-400 mr-1 hidden sm:inline">
                    {t.admin.filterLabel}
                  </span>

                  <button
                    type="button"
                    onClick={() => setStatusFilter("ALL")}
                    className={`min-h-[38px] sm:min-h-[32px] px-3 py-1.5 rounded-lg sm:rounded-md text-xs font-medium cursor-pointer transition-colors ${
                      statusFilter === "ALL"
                        ? "bg-zinc-800 text-white border border-zinc-700"
                        : "bg-zinc-950/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80"
                    }`}
                  >
                    {t.admin.filterAll} ({currentViewList.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilter("PENDING")}
                    className={`min-h-[38px] sm:min-h-[32px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg sm:rounded-md text-xs font-medium cursor-pointer transition-colors ${
                      statusFilter === "PENDING"
                        ? "bg-amber-950/60 text-amber-300 border border-amber-500/40"
                        : "bg-zinc-950/80 text-zinc-400 hover:text-amber-300 border border-zinc-800/80"
                    }`}
                  >
                    <span className="size-1.5 rounded-full bg-amber-400" />
                    <span>{t.admin.filterPending}</span>
                    <span className="rounded bg-amber-500/10 px-1 py-0.2 text-[10px] text-amber-300 font-mono">
                      {currentViewList.filter((s) => !s.paymentStatus || s.paymentStatus === "Pending Verification").length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatusFilter("DONE")}
                    className={`min-h-[38px] sm:min-h-[32px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg sm:rounded-md text-xs font-medium cursor-pointer transition-colors ${
                      statusFilter === "DONE"
                        ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40"
                        : "bg-zinc-950/80 text-zinc-400 hover:text-emerald-300 border border-zinc-800/80"
                    }`}
                  >
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    <span>{t.admin.filterDone}</span>
                    <span className="rounded bg-emerald-500/10 px-1 py-0.2 text-[10px] text-emerald-300 font-mono">
                      {currentViewList.filter((s) => s.paymentStatus === "Done").length}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table className="min-w-[960px] w-full text-left">
                <TableHeader className="bg-zinc-950/60 border-b border-zinc-800/80">
                  <TableRow className="border-zinc-800/80 hover:bg-transparent">
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 py-3 px-3.5">
                      {t.admin.table.accountName}
                    </TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 py-3 px-3.5">
                      {t.admin.table.phoneNumber}
                    </TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 py-3 px-3.5">
                      {t.admin.table.unitType}
                    </TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 py-3 px-3.5">
                      {t.admin.table.accountNumber}
                    </TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 py-3 px-3.5">
                      {t.admin.table.paymentGcash}
                    </TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 py-3 px-3.5">
                      {t.admin.table.address}
                    </TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 py-3 px-3.5">
                      {t.admin.table.note}
                    </TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 py-3 px-3.5">
                      {t.admin.table.submittedAt}
                    </TableHead>
                    <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 py-3 px-3.5 text-right">
                      {t.admin.table.action}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-zinc-800/40">
                  {submissions.length === 0 ? (
                    /* Initial empty state when no submissions exist */
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={9} className="h-56 text-center">
                        <div className="flex flex-col items-center justify-center p-6 text-center space-y-2.5">
                          <div className="flex size-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400">
                            <Inbox className="size-5 text-zinc-400" />
                          </div>
                          <div className="space-y-1 max-w-sm">
                            <h3 className="text-sm font-semibold text-white">
                              {t.admin.emptyTitle}
                            </h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              {t.admin.emptyBody}
                            </p>
                          </div>
                          <Link href="/">
                            <Button
                              size="sm"
                              className="cursor-pointer font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs h-8 px-3 mt-1"
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
                      <TableCell colSpan={9} className="h-56 text-center">
                        <div className="flex flex-col items-center justify-center p-6 text-center space-y-2.5">
                          <div className="flex size-10 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-950/20 text-amber-400">
                            <Archive className="size-5" />
                          </div>
                          <div className="space-y-1 max-w-sm">
                            <h3 className="text-sm font-semibold text-white">
                              {t.admin.archiveUi.archivedEmptyTitle}
                            </h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              {t.admin.archiveUi.archivedEmptyBody}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setAdminView("active")}
                            className="cursor-pointer border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 text-xs h-8 px-3 rounded-md mt-1"
                          >
                            {t.admin.archiveUi.viewActiveTab}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredSubmissions.length === 0 ? (
                    /* Empty search/filter state */
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={9} className="h-56 text-center">
                        <div className="flex flex-col items-center justify-center p-6 text-center space-y-2.5">
                          <div className="flex size-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400">
                            <Search className="size-5 text-zinc-400" />
                          </div>
                          <div className="space-y-1 max-w-sm">
                            <h3 className="text-sm font-semibold text-white">
                              {t.admin.noSearchResultsTitle}
                            </h3>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              {t.admin.noSearchResultsBody(searchTerm)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            {searchTerm && (
                              <Button
                                size="sm"
                                onClick={() => setSearchTerm("")}
                                className="cursor-pointer font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs h-8 px-2.5"
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
                                className="cursor-pointer border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 text-xs h-8 px-2.5 rounded-md"
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
                      return (
                        <TableRow
                          key={sub.id}
                          className="border-zinc-800/40 hover:bg-zinc-800/20 transition-colors"
                        >
                          <TableCell className="font-medium text-white whitespace-nowrap text-xs px-3.5 py-3">
                            {sub.name}
                          </TableCell>
                          <TableCell className="text-zinc-300 font-mono text-xs whitespace-nowrap px-3.5 py-3">
                            {sub.phoneNumber}
                          </TableCell>
                          <TableCell className="whitespace-nowrap px-3.5 py-3">
                            <span className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                              <Radio className="size-2.5" />
                              {sub.unitType}
                            </span>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-zinc-200 font-medium whitespace-nowrap px-3.5 py-3">
                            {sub.receiverNumber}
                          </TableCell>
                          <TableCell className="whitespace-nowrap px-3.5 py-3">
                            <div className="flex flex-col text-xs gap-0.5">
                              <div className="flex items-center gap-1.5 font-medium text-white">
                                <span className="font-semibold text-emerald-400 font-mono text-xs">
                                  {sub.paymentAmount || "—"}
                                </span>
                                {sub.packageDescription && (
                                  <span
                                    className={`inline-flex items-center rounded px-1.5 py-0.2 text-[10px] font-medium border ${
                                      sub.packageDescription === "All Channels"
                                        ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
                                        : "border-zinc-800 bg-zinc-850 text-zinc-400"
                                    }`}
                                  >
                                    {sub.packageDescription}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-zinc-400 font-mono">
                                Ref: {sub.gcashReferenceNumber || "—"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell
                            className="text-zinc-300 max-w-[180px] truncate text-xs px-3.5 py-3"
                            title={sub.address}
                          >
                            {sub.address}
                          </TableCell>
                          <TableCell
                            className="text-zinc-300 max-w-[160px] text-xs px-3.5 py-3"
                            title={sub.note || undefined}
                          >
                            {sub.note && sub.note.trim() ? (
                              <span className="text-zinc-300 break-words line-clamp-1">
                                {sub.note}
                              </span>
                            ) : (
                              <span className="text-zinc-500 italic text-[11px]">
                                {t.admin.noNoteProvided}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-zinc-400 text-xs whitespace-nowrap font-mono px-3.5 py-3">
                            {sub.submittedAt}
                          </TableCell>
                          {/* Actions Column: Verification, Archive, Restore & Permanent Delete */}
                          <TableCell className="text-right whitespace-nowrap px-3.5 py-3">
                            <div className="flex flex-col items-end gap-1.5">
                              {/* Status Badges */}
                              <div className="flex items-center gap-1.5">
                                {isDone ? (
                                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                                    <span className="size-1.5 rounded-full bg-emerald-400" />
                                    <span>{t.admin.doneStatus}</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                                    <span className="size-1.5 rounded-full bg-amber-400" />
                                    <span>{t.admin.pendingStatus}</span>
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
                                    className="cursor-pointer font-medium bg-emerald-600 hover:bg-emerald-500 text-white h-7 px-2 text-xs rounded-md transition-colors"
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
                                      onClick={() => openArchiveDialog("archive", sub)}
                                      className="cursor-pointer border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 h-7 px-2 text-xs rounded-md"
                                      title={t.admin.archiveUi.archiveBtn}
                                    >
                                      <Archive className="mr-1 size-3 text-amber-400" />
                                      <span>{t.admin.archiveUi.archiveBtn}</span>
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openDeleteDialog(sub)}
                                      className="cursor-pointer border-zinc-800 bg-zinc-900/60 hover:bg-rose-950/40 hover:border-rose-500/30 hover:text-rose-300 text-zinc-400 h-7 px-2 text-xs rounded-md transition-colors"
                                      title={t.admin.archiveUi.deleteBtn}
                                    >
                                      <Trash2 className="size-3" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={() => openArchiveDialog("restore", sub)}
                                      className="cursor-pointer font-medium bg-emerald-600 hover:bg-emerald-500 text-white h-7 px-2.5 text-xs rounded-md transition-colors"
                                      title={t.admin.archiveUi.restoreBtn}
                                    >
                                      <RotateCcw className="mr-1 size-3" />
                                      <span>{t.admin.archiveUi.restoreBtn}</span>
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openDeleteDialog(sub)}
                                      className="cursor-pointer border-zinc-800 bg-zinc-900/60 hover:bg-rose-950/40 hover:border-rose-500/30 hover:text-rose-300 text-zinc-400 h-7 px-2 text-xs rounded-md transition-colors"
                                      title={t.admin.archiveUi.deleteBtn}
                                    >
                                      <Trash2 className="size-3" />
                                    </Button>
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
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-2.5">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400">
                    <Inbox className="size-5 text-zinc-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white">
                      {t.admin.emptyTitle}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {t.admin.emptyBody}
                    </p>
                  </div>
                  <Link href="/">
                    <Button
                      size="sm"
                      className="cursor-pointer font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs h-8 px-3 mt-1"
                    >
                      {t.admin.goToUserPovBtn}
                    </Button>
                  </Link>
                </div>
              ) : adminView === "archived" && archivedSubmissions.length === 0 ? (
                /* Archived section empty state on mobile */
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-2.5">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-950/20 text-amber-400">
                    <Archive className="size-5" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h3 className="text-sm font-semibold text-white">
                      {t.admin.archiveUi.archivedEmptyTitle}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {t.admin.archiveUi.archivedEmptyBody}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAdminView("active")}
                    className="cursor-pointer border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 text-xs h-8 px-3 rounded-md mt-1"
                  >
                    {t.admin.archiveUi.viewActiveTab}
                  </Button>
                </div>
              ) : filteredSubmissions.length === 0 ? (
                /* Empty search/filter state on mobile */
                <div className="flex flex-col items-center justify-center p-8 text-center space-y-2.5">
                  <div className="flex size-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400">
                    <Search className="size-5 text-zinc-400" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h3 className="text-sm font-semibold text-white">
                      {t.admin.noSearchResultsTitle}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {t.admin.noSearchResultsBody(searchTerm)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    {searchTerm && (
                      <Button
                        size="sm"
                        onClick={() => setSearchTerm("")}
                        className="cursor-pointer font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs h-8 px-2.5"
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
                        className="cursor-pointer border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 text-xs h-8 px-2.5 rounded-md"
                      >
                        {t.admin.filterAll}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/60">
                  {filteredSubmissions.map((sub) => {
                    const isDone = sub.paymentStatus === "Done";
                    return (
                      <div key={sub.id} className="p-4 space-y-3 bg-zinc-950/20">
                        {/* Card Header: Customer Name, Phone, Unit Type & Status Badges */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <span className="text-zinc-500 block text-[10px] uppercase font-medium">
                              {t.admin.mobile.accountName}
                            </span>
                            <div className="font-semibold text-white text-sm break-words">
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
                            <span className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                              <Radio className="size-2.5" />
                              {sub.unitType}
                            </span>
                            <div className="flex items-center gap-1 flex-wrap justify-end">
                              {isDone ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-2 py-0.5">
                                  <span className="size-1.5 rounded-full bg-emerald-400" />
                                  {t.admin.doneStatus}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-300 bg-amber-500/10 border border-amber-500/25 rounded-full px-2 py-0.5">
                                  <span className="size-1.5 rounded-full bg-amber-400" />
                                  {t.admin.pendingStatus}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Account Number & Time */}
                        <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-zinc-800/40">
                          <div>
                            <span className="text-zinc-500 block text-[10px] uppercase font-medium">
                              {t.admin.mobile.accountNumber}
                            </span>
                            <span className="font-mono text-zinc-200 font-medium break-all text-xs">
                              {sub.receiverNumber}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block text-[10px] uppercase font-medium">
                              {t.admin.mobile.time}
                            </span>
                            <span className="text-zinc-400 flex items-center gap-1 text-[11px] font-mono break-words">
                              <Clock className="size-3 text-zinc-500 shrink-0" />
                              {sub.submittedAt}
                            </span>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div className="text-xs pt-1 border-t border-zinc-800/40 space-y-1">
                          <span className="text-zinc-500 text-[10px] uppercase font-medium block">
                            {t.admin.mobile.paymentGcash}
                          </span>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-emerald-400 font-mono text-xs">
                                {sub.paymentAmount || "—"}
                              </span>
                              {sub.packageDescription && (
                                <span
                                  className={`inline-flex items-center rounded px-1.5 py-0.2 text-[10px] font-medium border ${
                                    sub.packageDescription === "All Channels"
                                      ? "border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
                                      : "border-zinc-800 bg-zinc-850 text-zinc-400"
                                    }`}
                                >
                                  {sub.packageDescription}
                                </span>
                              )}
                            </div>
                            <span className="text-zinc-400 font-mono text-[10px] break-all">
                              Ref: {sub.gcashReferenceNumber || "—"}
                            </span>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="text-xs pt-1 border-t border-zinc-800/40">
                          <span className="text-zinc-500 block text-[10px] uppercase font-medium">
                            {t.admin.mobile.address}
                          </span>
                          <span className="text-zinc-300 break-words text-xs">
                            {sub.address}
                          </span>
                        </div>

                        {/* Note */}
                        <div className="text-xs pt-1 border-t border-zinc-800/40">
                          <span className="text-zinc-500 block text-[10px] uppercase font-medium">
                            {t.admin.mobile.note}
                          </span>
                          {sub.note && sub.note.trim() ? (
                            <div className="rounded-md bg-zinc-900/60 border border-zinc-800/80 p-2 mt-1 text-zinc-300 break-words whitespace-pre-wrap text-xs">
                              {sub.note}
                            </div>
                          ) : (
                            <span className="text-zinc-500 italic text-[11px]">
                              {t.admin.noNoteProvided}
                            </span>
                          )}
                        </div>

                        {/* Mobile Actions: Verification, Archive, Restore & Permanent Delete */}
                        <div className="pt-2 border-t border-zinc-800/60 space-y-2">
                          {!isDone && adminView === "active" && (
                            <Button
                              type="button"
                              onClick={() => updatePaymentStatus(sub.id, "Done")}
                              className="w-full cursor-pointer font-medium bg-emerald-600 hover:bg-emerald-500 text-white min-h-[44px] sm:min-h-[36px] text-xs font-semibold rounded-xl sm:rounded-md transition-colors"
                            >
                              <Check className="mr-1.5 size-3.5" />
                              {t.admin.markAsDoneBtn}
                            </Button>
                          )}

                          <div className="flex items-center gap-2">
                            {adminView === "active" ? (
                              <>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => openArchiveDialog("archive", sub)}
                                  className="flex-1 cursor-pointer border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 min-h-[44px] sm:min-h-[36px] text-xs rounded-xl sm:rounded-md font-medium"
                                >
                                  <Archive className="mr-1.5 size-3.5 text-amber-400" />
                                  {t.admin.archiveUi.archiveBtn}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => openDeleteDialog(sub)}
                                  className="flex-1 cursor-pointer border-zinc-800 bg-zinc-900/60 hover:bg-rose-950/40 hover:border-rose-500/30 hover:text-rose-300 text-zinc-400 min-h-[44px] sm:min-h-[36px] text-xs rounded-xl sm:rounded-md font-medium transition-colors"
                                >
                                  <Trash2 className="mr-1.5 size-3.5" />
                                  {t.admin.archiveUi.deleteBtn}
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  type="button"
                                  onClick={() => openArchiveDialog("restore", sub)}
                                  className="flex-1 cursor-pointer font-medium bg-emerald-600 hover:bg-emerald-500 text-white min-h-[44px] sm:min-h-[36px] text-xs rounded-xl sm:rounded-md transition-colors"
                                >
                                  <RotateCcw className="mr-1.5 size-3.5" />
                                  {t.admin.archiveUi.restoreBtn}
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => openDeleteDialog(sub)}
                                  className="flex-1 cursor-pointer border-zinc-800 bg-zinc-900/60 hover:bg-rose-950/40 hover:border-rose-500/30 hover:text-rose-300 text-zinc-400 min-h-[44px] sm:min-h-[36px] text-xs rounded-xl sm:rounded-md font-medium transition-colors"
                                >
                                  <Trash2 className="mr-1.5 size-3.5" />
                                  {t.admin.archiveUi.deleteBtn}
                                </Button>
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

      {/* Permanent Delete Confirmation Dialog (Yes/No Confirmation) */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) => {
          if (!open && !isProcessingDelete) {
            closeDeleteDialog();
          }
        }}
      >
        <AlertDialogContent className="w-[calc(100%-1.5rem)] max-w-md border-zinc-800 bg-zinc-950/95 text-zinc-100 p-4 sm:p-6 shadow-xl rounded-xl max-h-[88dvh] overflow-y-auto overscroll-contain">
          <AlertDialogHeader className="gap-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-rose-500/30 bg-rose-950/40 px-2 py-0.5 text-[10px] font-medium text-rose-300">
                <AlertTriangle className="size-3 text-rose-400" />
                Permanent Deletion
              </span>
            </div>
            <AlertDialogTitle className="text-base sm:text-lg font-bold text-white">
              {t.admin.archiveUi.confirmDialog.deleteTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {t.admin.archiveUi.confirmDialog.deleteDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {deleteDialog.record && (
            <div className="my-2 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  {t.admin.archiveUi.confirmDialog.customerLabel}
                </span>
                <span className="font-semibold text-white">
                  {deleteDialog.record.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  {t.admin.archiveUi.confirmDialog.unitLabel}
                </span>
                <span className="font-medium text-emerald-400">
                  {deleteDialog.record.unitType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  {t.admin.archiveUi.confirmDialog.accountLabel}
                </span>
                <span className="font-mono text-zinc-200">
                  {deleteDialog.record.receiverNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  {t.admin.archiveUi.confirmDialog.amountLabel}
                </span>
                <span className="font-mono font-semibold text-emerald-400">
                  {deleteDialog.record.paymentAmount}
                </span>
              </div>
            </div>
          )}

          <div className="rounded-md border border-rose-500/20 bg-rose-950/20 p-2.5 text-[11px] text-rose-300/90 leading-relaxed">
            <p>{t.admin.archiveUi.confirmDialog.deleteWarningNote}</p>
          </div>

          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-3 border-t border-zinc-800/80">
            <AlertDialogCancel
              disabled={isProcessingDelete}
              onClick={closeDeleteDialog}
              className="cursor-pointer border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 min-h-[44px] sm:min-h-[36px] text-xs rounded-xl sm:rounded-md font-medium"
            >
              {t.admin.archiveUi.confirmDialog.cancelBtn}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isProcessingDelete}
              onClick={handlePermanentDelete}
              className="cursor-pointer font-medium bg-rose-600 hover:bg-rose-500 text-white min-h-[44px] sm:min-h-[36px] text-xs rounded-xl sm:rounded-md shadow-xs"
            >
              {isProcessingDelete ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  <span>{t.admin.archiveUi.confirmDialog.deletingBtn}</span>
                </>
              ) : (
                <>
                  <Trash2 className="mr-1.5 size-3.5" />
                  <span>{t.admin.archiveUi.confirmDialog.yesDeleteBtn}</span>
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Archive and Restore Confirmation Dialog (Separate from Permanent Deletion) */}
      <Dialog
        open={archiveDialog.isOpen}
        onOpenChange={(open) => {
          if (!open && !isProcessingArchive) {
            closeArchiveDialog();
          }
        }}
      >
        <DialogContent className="w-[calc(100%-1.5rem)] max-w-md border-zinc-800 bg-zinc-950/95 text-zinc-100 p-4 sm:p-6 shadow-xl rounded-xl max-h-[88dvh] overflow-y-auto overscroll-contain">
          <DialogHeader className="gap-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-medium ${
                  archiveDialog.action === "archive"
                    ? "border-amber-500/30 bg-amber-950/40 text-amber-300"
                    : "border-emerald-500/30 bg-emerald-950/40 text-emerald-300"
                }`}
              >
                <ShieldAlert className="size-3" />
                {archiveDialog.action === "archive" ? "Archive Record" : "Restore Record"}
              </span>
            </div>
            <DialogTitle className="text-base sm:text-lg font-bold text-white">
              {archiveDialog.action === "archive"
                ? t.admin.archiveUi.confirmDialog.archiveTitle
                : t.admin.archiveUi.confirmDialog.restoreTitle}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400 leading-relaxed">
              {archiveDialog.action === "archive"
                ? t.admin.archiveUi.confirmDialog.archiveDesc
                : t.admin.archiveUi.confirmDialog.restoreDesc}
            </DialogDescription>
          </DialogHeader>

          {archiveDialog.record && (
            <div className="my-2 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  {t.admin.archiveUi.confirmDialog.customerLabel}
                </span>
                <span className="font-semibold text-white">
                  {archiveDialog.record.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  {t.admin.archiveUi.confirmDialog.unitLabel}
                </span>
                <span className="font-medium text-emerald-400">
                  {archiveDialog.record.unitType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  {t.admin.archiveUi.confirmDialog.accountLabel}
                </span>
                <span className="font-mono text-zinc-200">
                  {archiveDialog.record.receiverNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  {t.admin.archiveUi.confirmDialog.amountLabel}
                </span>
                <span className="font-mono font-semibold text-emerald-400">
                  {archiveDialog.record.paymentAmount}
                </span>
              </div>
            </div>
          )}

          <div className="rounded-md border border-amber-500/20 bg-amber-950/20 p-2.5 text-[11px] text-amber-300/90 leading-relaxed">
            <p>{t.admin.archiveUi.confirmDialog.warningNote}</p>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2 border-t border-zinc-800/80">
            <Button
              type="button"
              variant="outline"
              onClick={closeArchiveDialog}
              disabled={isProcessingArchive}
              className="cursor-pointer border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 min-h-[44px] sm:min-h-[36px] text-xs rounded-xl sm:rounded-md font-medium"
            >
              {t.admin.archiveUi.confirmDialog.cancelBtn}
            </Button>
            <Button
              type="button"
              onClick={handleConfirmArchive}
              disabled={isProcessingArchive}
              className={`cursor-pointer font-medium min-h-[44px] sm:min-h-[36px] text-xs rounded-xl sm:rounded-md shadow-xs ${
                archiveDialog.action === "archive"
                  ? "bg-amber-600 hover:bg-amber-500 text-white"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              {isProcessingArchive && <Loader2 className="mr-1.5 size-3.5 animate-spin" />}
              {archiveDialog.action === "archive"
                ? t.admin.archiveUi.confirmDialog.confirmArchiveBtn
                : t.admin.archiveUi.confirmDialog.confirmRestoreBtn}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Footer */}
      <footer className="border-t border-zinc-800/70 bg-zinc-950 py-5 text-center text-xs text-zinc-500">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-zinc-400 font-medium">
            <Tv className="size-3.5 text-emerald-400" />
            <span>{t.admin.footerTitle}</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            {t.admin.footerSubtitle}
          </p>
        </div>
      </footer>
    </div>
  );
}
