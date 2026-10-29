"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSubmissions, Submission } from "@/context/SubmissionContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  History,
  Clock,
  CheckCircle2,
  ArrowUp,
  Inbox,
  Info,
  Radio,
  ExternalLink,
  Archive,
  RotateCcw,
  Trash2,
  ShieldAlert,
  X,
  LogIn,
} from "lucide-react";

interface ConfirmDialogState {
  isOpen: boolean;
  action: "archive" | "soft-delete" | "restore";
  record: Submission | null;
}

export function SubmissionHistory() {
  const { submissions, archiveSubmission } = useSubmissions();
  const { t } = useLanguage();
  const { user, openAuthModal } = useAuth();

  const [historyView, setHistoryView] = useState<"active" | "archived">("active");
  const [previewArchivedIds, setPreviewArchivedIds] = useState<Set<string>>(new Set());
  const [previewSoftDeletedIds, setPreviewSoftDeletedIds] = useState<Set<string>>(new Set());
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    action: "archive",
    record: null,
  });
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const scrollToForm = () => {
    const el = document.getElementById("info-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    if (!user) {
      openAuthModal("login");
    }
  };

  const formatStatus = (status?: string) => {
    if (!status || status === "Pending Verification") {
      return t.history.pendingStatus;
    }
    if (status === "Done") {
      return t.history.doneStatus;
    }
    return status;
  };

  // Segregated active vs archived submissions based on database state and UI preview
  const activeSubmissions = useMemo(
    () => submissions.filter((s) => !previewArchivedIds.has(s.id) && !s.archivedAt),
    [submissions, previewArchivedIds]
  );

  const archivedSubmissions = useMemo(
    () => submissions.filter((s) => previewArchivedIds.has(s.id) || !!s.archivedAt),
    [submissions, previewArchivedIds]
  );

  const currentViewList = historyView === "active" ? activeSubmissions : archivedSubmissions;

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
      archiveSubmission?.(recId, true);
      setPreviewArchivedIds((prev) => new Set([...prev, recId]));
      setActionFeedback(t.history.archiveUi.confirmDialog.archiveTitle);
    } else if (confirmDialog.action === "soft-delete") {
      archiveSubmission?.(recId, true);
      setPreviewSoftDeletedIds((prev) => new Set([...prev, recId]));
      setPreviewArchivedIds((prev) => new Set([...prev, recId]));
      setActionFeedback(t.history.archiveUi.confirmDialog.softDeleteTitle);
    } else if (confirmDialog.action === "restore") {
      archiveSubmission?.(recId, false);
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
      setActionFeedback(t.history.archiveUi.confirmDialog.restoreTitle);
    }

    closeDialog();
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <section
      id="submission-history"
      className="scroll-mt-20 py-12 md:py-16 border-t border-zinc-800/80 bg-zinc-950/40"
    >
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 space-y-6">
        {/* Header & Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
              <History className="size-3.5" />
              <span>{t.history.sessionLogBadge}</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {t.history.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              {t.history.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-stretch sm:self-auto w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={scrollToForm}
              className="cursor-pointer border-emerald-500/30 bg-emerald-950/30 text-emerald-300 hover:bg-emerald-900/50 hover:text-white text-xs font-medium w-full sm:w-auto h-9"
            >
              <ArrowUp className="mr-1.5 size-3.5" />
              {t.history.returnToForm}
            </Button>
          </div>
        </div>

        {/* Temporary Storage Notice */}
        <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs text-zinc-400 backdrop-blur-xs">
          <Info className="size-4 shrink-0 text-emerald-400 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-zinc-200">
              {t.history.temporaryNoticeTitle}
            </p>
            <p className="leading-relaxed">
              {t.history.temporaryNoticeBody}
            </p>
          </div>
        </div>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-amber-950/30 p-3.5 text-xs text-amber-200 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-amber-400 shrink-0" />
              <span>
                <strong>{actionFeedback}:</strong> {t.history.archiveUi.uiPreviewNotice}
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

        {/* Submissions Container */}
        <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/80 shadow-xl overflow-hidden backdrop-blur-sm">
          {/* Container Header with Active / Archived Tabs */}
          <div className="p-4 sm:p-5 border-b border-zinc-800/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              {/* Tab Switcher: Active Submissions vs Archived */}
              <div className="inline-flex items-center rounded-xl border border-zinc-800 bg-zinc-950/90 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setHistoryView("active")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    historyView === "active"
                      ? "bg-emerald-500 text-zinc-950 shadow-xs"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {t.history.archiveUi.viewActiveTab} ({activeSubmissions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryView("archived")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    historyView === "archived"
                      ? "bg-amber-500 text-zinc-950 shadow-xs"
                      : "text-zinc-400 hover:text-amber-300"
                  }`}
                >
                  <Archive className="size-3" />
                  <span>{t.history.archiveUi.viewArchivedTab(archivedSubmissions.length)}</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-950/40 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
                  <ShieldAlert className="size-3" />
                  <span>{t.history.archiveUi.uiPreviewBadge}</span>
                </span>

                <Link
                  href="/admin"
                  className="text-xs text-zinc-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors"
                >
                  <span>{t.history.adminViewLink}</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            </div>

            {/* Archived Section Description Notice when in Archived View */}
            {historyView === "archived" && (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-200">
                <Archive className="size-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-amber-300">
                    {t.history.archiveUi.archivedSectionTitle}
                  </span>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    {t.history.archiveUi.archivedSectionSub}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table className="min-w-[760px]">
              <TableHeader className="bg-zinc-950/60 border-zinc-800">
                <TableRow className="border-zinc-800/80 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {t.history.table.accountName}
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {t.history.table.unitType}
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {t.history.table.accountNumber}
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {t.history.table.paymentAmount}
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {t.history.table.gcashRef}
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {t.history.table.submittedAt}
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {t.history.table.paymentStatus}
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-zinc-800/60">
                {submissions.length === 0 ? (
                  /* Initial empty state when no submissions exist */
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={8} className="h-56 text-center">
                      <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                        <div className="flex size-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/80 text-zinc-400">
                          <Inbox className="size-6 text-zinc-400" />
                        </div>
                        <div className="space-y-1 max-w-sm">
                          <h4 className="text-base font-bold text-white">
                            {t.history.emptyTitle}
                          </h4>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            {t.history.emptyBody}
                          </p>
                        </div>
                        {!user ? (
                          <Button
                            size="sm"
                            onClick={() => openAuthModal("login")}
                            className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] mt-1"
                          >
                            <LogIn className="size-3.5 mr-1.5" />
                            <span>Sign In to View History</span>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={scrollToForm}
                            className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] mt-1"
                          >
                            {t.history.fillOutButton}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : historyView === "archived" && archivedSubmissions.length === 0 ? (
                  /* Empty state for archived submissions */
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={8} className="h-56 text-center">
                      <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                        <div className="flex size-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-950/30 text-amber-400">
                          <Archive className="size-6" />
                        </div>
                        <div className="space-y-1 max-w-sm">
                          <h4 className="text-base font-bold text-white">
                            {t.history.archiveUi.archivedEmptyTitle}
                          </h4>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            {t.history.archiveUi.archivedEmptyBody}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setHistoryView("active")}
                          className="cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 text-xs mt-1"
                        >
                          {t.history.archiveUi.viewActiveTab}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentViewList.map((sub) => {
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
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-white text-sm">
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
                        </TableCell>
                        <TableCell className="font-mono text-xs text-zinc-200 whitespace-nowrap">
                          {sub.gcashReferenceNumber}
                        </TableCell>
                        <TableCell className="text-zinc-400 text-xs font-mono whitespace-nowrap">
                          {sub.submittedAt}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {isDone ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/70 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                                <CheckCircle2 className="size-3 text-emerald-400" />
                                {formatStatus(sub.paymentStatus)}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-950/70 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                                <Clock className="size-3" />
                                {formatStatus(sub.paymentStatus)}
                              </span>
                            )}
                            {isSoftDeleted && (
                              <span className="inline-flex items-center rounded bg-rose-950/70 border border-rose-500/40 px-1.5 py-0.2 text-[10px] font-semibold text-rose-300">
                                {t.history.archiveUi.softDeletedBadge}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        {/* Archive & Soft Delete Actions */}
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {historyView === "active" ? (
                              <>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openDialog("archive", sub)}
                                  className="cursor-pointer border-amber-500/30 bg-amber-950/30 hover:bg-amber-900/50 text-amber-300 h-7 px-2 text-xs"
                                  title={t.history.archiveUi.archiveBtn}
                                >
                                  <Archive className="mr-1 size-3" />
                                  <span>{t.history.archiveUi.archiveBtn}</span>
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openDialog("soft-delete", sub)}
                                  className="cursor-pointer border-zinc-700 bg-zinc-800/50 hover:bg-rose-950/50 hover:border-rose-500/40 hover:text-rose-300 text-zinc-400 h-7 px-2 text-xs"
                                  title={t.history.archiveUi.softDeleteBtn}
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
                                  className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 h-7 px-2.5 text-xs shadow-xs"
                                  title={t.history.archiveUi.restoreBtn}
                                >
                                  <RotateCcw className="mr-1 size-3" />
                                  <span>{t.history.archiveUi.restoreBtn}</span>
                                </Button>
                                {!isSoftDeleted && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openDialog("soft-delete", sub)}
                                    className="cursor-pointer border-zinc-700 bg-zinc-800/50 hover:bg-rose-950/50 hover:border-rose-500/40 hover:text-rose-300 text-zinc-400 h-7 px-2 text-xs"
                                    title={t.history.archiveUi.softDeleteBtn}
                                  >
                                    <Trash2 className="size-3" />
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Responsive Cards */}
          <div className="md:hidden">
            {submissions.length === 0 ? (
              /* Initial empty state on mobile */
              <div className="flex flex-col items-center justify-center p-10 text-center space-y-3">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/80 text-zinc-400">
                  <Inbox className="size-6 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">
                    {t.history.emptyTitle}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {t.history.emptyBody}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={scrollToForm}
                  className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] mt-1"
                >
                  {t.history.fillOutButton}
                </Button>
              </div>
            ) : historyView === "archived" && archivedSubmissions.length === 0 ? (
              /* Empty state for archived submissions on mobile */
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-950/30 text-amber-400">
                  <Archive className="size-6" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h4 className="text-base font-bold text-white">
                    {t.history.archiveUi.archivedEmptyTitle}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {t.history.archiveUi.archivedEmptyBody}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setHistoryView("active")}
                  className="cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 text-xs mt-1"
                >
                  {t.history.archiveUi.viewActiveTab}
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/80">
                {currentViewList.map((sub) => {
                  const isDone = sub.paymentStatus === "Done";
                  const isSoftDeleted = previewSoftDeletedIds.has(sub.id);
                  return (
                    <div key={sub.id} className="p-4 space-y-3 bg-zinc-950/30">
                      {/* Header: Name, Unit Type & Badges */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] uppercase text-zinc-500 block">
                            {t.history.mobile.accountName}
                          </span>
                          <div className="font-bold text-white text-sm break-words">
                            {sub.name}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                            {sub.unitType}
                          </span>
                          {isSoftDeleted && (
                            <span className="inline-flex items-center rounded bg-rose-950/70 border border-rose-500/40 px-1.5 py-0.2 text-[10px] font-semibold text-rose-300">
                              {t.history.archiveUi.softDeletedBadge}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Account Number & Payment Amount */}
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-zinc-800/40">
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">
                            {t.history.mobile.accountNumber}
                          </span>
                          <span className="font-mono text-emerald-400 font-semibold break-all text-xs sm:text-sm">
                            {sub.receiverNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">
                            {t.history.mobile.paymentAmount}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono font-bold text-white text-xs sm:text-sm">
                              {sub.paymentAmount || "—"}
                            </span>
                            {sub.packageDescription && (
                              <span
                                className={`inline-flex items-center rounded-full px-1.5 py-0.2 text-[9px] font-semibold border ${
                                  sub.packageDescription === "All Channels"
                                    ? "border-emerald-500/40 bg-emerald-950/80 text-emerald-300"
                                    : "border-zinc-700 bg-zinc-800/80 text-zinc-300"
                                }`}
                              >
                                {sub.packageDescription}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* GCash Reference & Payment Status */}
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-zinc-800/40">
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">
                            {t.history.mobile.gcashRef}
                          </span>
                          <span className="font-mono text-zinc-200 break-all text-xs sm:text-sm">
                            {sub.gcashReferenceNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[10px] uppercase">
                            {t.history.mobile.status}
                          </span>
                          {isDone ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded-full px-2 py-0.5 mt-0.5">
                              <CheckCircle2 className="size-2.5 text-emerald-400" />
                              {formatStatus(sub.paymentStatus)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/30 rounded-full px-2 py-0.5 mt-0.5">
                              <Clock className="size-2.5" />
                              {formatStatus(sub.paymentStatus)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Submission Date & Time */}
                      <div className="text-xs pt-1 border-t border-zinc-800/40">
                        <span className="text-zinc-500 block text-[10px] uppercase">
                          {t.history.mobile.dateTime}
                        </span>
                        <span className="text-zinc-400 font-mono text-[11px] sm:text-xs break-words">
                          {sub.submittedAt}
                        </span>
                      </div>

                      {/* Mobile Archive & Soft Delete Actions */}
                      <div className="pt-2 border-t border-zinc-800/60 flex items-center gap-2">
                        {historyView === "active" ? (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => openDialog("archive", sub)}
                              className="flex-1 cursor-pointer border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 h-10 sm:h-9 text-xs font-semibold focus-visible:ring-amber-500/50"
                            >
                              <Archive className="mr-1.5 size-3.5" />
                              {t.history.archiveUi.archiveBtn}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => openDialog("soft-delete", sub)}
                              className="flex-1 cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-rose-950/50 hover:border-rose-500/40 hover:text-rose-300 text-zinc-300 h-10 sm:h-9 text-xs font-semibold focus-visible:ring-rose-500/50"
                            >
                              <Trash2 className="mr-1.5 size-3.5" />
                              {t.history.archiveUi.softDeleteBtn}
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
                              {t.history.archiveUi.restoreBtn}
                            </Button>
                            {!isSoftDeleted && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => openDialog("soft-delete", sub)}
                                className="flex-1 cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-rose-950/50 hover:border-rose-500/40 hover:text-rose-300 text-zinc-300 h-10 sm:h-9 text-xs font-semibold focus-visible:ring-rose-500/50"
                              >
                                <Trash2 className="mr-1.5 size-3.5" />
                                {t.history.archiveUi.softDeleteBtn}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog Modal for Customer Submissions View */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="w-[calc(100%-1.5rem)] max-w-md border-zinc-800 bg-zinc-950/95 text-zinc-100 p-4 sm:p-6 shadow-2xl max-h-[88dvh] overflow-y-auto overscroll-contain">
          <DialogHeader className="gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-950/60 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
                <ShieldAlert className="size-3 text-amber-400" />
                {t.history.archiveUi.uiPreviewBadge}
              </span>
            </div>
            <DialogTitle className="text-lg font-bold text-white">
              {confirmDialog.action === "archive"
                ? t.history.archiveUi.confirmDialog.archiveTitle
                : confirmDialog.action === "soft-delete"
                ? t.history.archiveUi.confirmDialog.softDeleteTitle
                : t.history.archiveUi.confirmDialog.restoreTitle}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400 leading-relaxed">
              {confirmDialog.action === "archive"
                ? t.history.archiveUi.confirmDialog.archiveDesc
                : confirmDialog.action === "soft-delete"
                ? t.history.archiveUi.confirmDialog.softDeleteDesc
                : t.history.archiveUi.confirmDialog.restoreDesc}
            </DialogDescription>
          </DialogHeader>

          {confirmDialog.record && (
            <div className="my-2 rounded-xl border border-zinc-800/90 bg-zinc-900/70 p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  {t.history.archiveUi.confirmDialog.customerLabel}
                </span>
                <span className="font-semibold text-white">
                  {confirmDialog.record.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  {t.history.archiveUi.confirmDialog.unitLabel}
                </span>
                <span className="font-medium text-emerald-400">
                  {confirmDialog.record.unitType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  {t.history.archiveUi.confirmDialog.accountLabel}
                </span>
                <span className="font-mono text-zinc-200">
                  {confirmDialog.record.receiverNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">
                  {t.history.archiveUi.confirmDialog.amountLabel}
                </span>
                <span className="font-mono font-bold text-white">
                  {confirmDialog.record.paymentAmount}
                </span>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-amber-500/25 bg-amber-950/20 p-2.5 text-[11px] text-amber-200/90">
            <p>{t.history.archiveUi.confirmDialog.warningNote}</p>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2 border-t border-zinc-800">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              className="cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 h-9 text-xs"
            >
              {t.history.archiveUi.confirmDialog.cancelBtn}
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
                ? t.history.archiveUi.confirmDialog.confirmArchiveBtn
                : confirmDialog.action === "soft-delete"
                ? t.history.archiveUi.confirmDialog.confirmSoftDeleteBtn
                : t.history.archiveUi.confirmDialog.confirmRestoreBtn}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
