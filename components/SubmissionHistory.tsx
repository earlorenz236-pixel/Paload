"use client";

import React from "react";
import Link from "next/link";
import { useSubmissions } from "@/context/SubmissionContext";
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
  History,
  Clock,
  ArrowUp,
  Inbox,
  Info,
  Radio,
  ExternalLink,
} from "lucide-react";

export function SubmissionHistory() {
  const { submissions } = useSubmissions();

  const scrollToForm = () => {
    const el = document.getElementById("info-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
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
              <span>Session Log</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Submission History
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Review your previously submitted reload requests from this session.
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
              Return to Submission Form
            </Button>
          </div>
        </div>

        {/* Temporary Storage Notice */}
        <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs text-zinc-400 backdrop-blur-xs">
          <Info className="size-4 shrink-0 text-emerald-400 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-zinc-200">
              Session-Only Application State
            </p>
            <p className="leading-relaxed">
              Records are held in temporary shared React memory. Because this prototype does not connect to an external database, submission history is active for this session only and will reset upon page refresh or app restart.
            </p>
          </div>
        </div>

        {/* Submissions Container */}
        <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/80 shadow-xl overflow-hidden backdrop-blur-sm">
          <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">
                Your Submitted Requests
              </span>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 text-xs font-medium text-emerald-300">
                {submissions.length} {submissions.length === 1 ? "record" : "records"}
              </span>
            </div>

            <Link href="/admin" className="text-xs text-zinc-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors">
              <span>Admin View</span>
              <ExternalLink className="size-3" />
            </Link>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader className="bg-zinc-950/60 border-zinc-800">
                <TableRow className="border-zinc-800/80 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Account Name
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Unit Type
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Account Number
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Payment Amount
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    GCash Ref No.
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Submission Date &amp; Time
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400 text-right">
                    Payment Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-zinc-800/60">
                {submissions.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={7} className="h-56 text-center">
                      <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                        <div className="flex size-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/80 text-zinc-400">
                          <Inbox className="size-6 text-zinc-400" />
                        </div>
                        <div className="space-y-1 max-w-sm">
                          <h4 className="text-base font-bold text-white">
                            No submission history yet
                          </h4>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            Once you fill out and submit your receiver information and GCash payment reference, your request will appear here.
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={scrollToForm}
                          className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] mt-1"
                        >
                          Fill Out Information
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  submissions.map((sub) => (
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
                      <TableCell className="text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/50 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                          <Clock className="size-3" />
                          {sub.paymentStatus || "Pending Verification"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Responsive Cards */}
          <div className="md:hidden">
            {submissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 text-center space-y-3">
                <div className="flex size-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/80 text-zinc-400">
                  <Inbox className="size-6 text-zinc-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">
                    No submission history yet
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Submitted requests will appear here once entered.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={scrollToForm}
                  className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] mt-1"
                >
                  Fill Out Information
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/80">
                {submissions.map((sub) => (
                  <div key={sub.id} className="p-4 space-y-3 bg-zinc-950/30">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase text-zinc-500 block">
                          Account Name
                        </span>
                        <div className="font-bold text-white text-sm break-words">
                          {sub.name}
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 shrink-0">
                        {sub.unitType}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-zinc-800/40">
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">
                          Account Number
                        </span>
                        <span className="font-mono text-emerald-400 font-semibold break-all text-xs sm:text-sm">
                          {sub.receiverNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">
                          Payment Amount
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

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-zinc-800/40">
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">
                          GCash Ref No.
                        </span>
                        <span className="font-mono text-zinc-200 break-all text-xs sm:text-sm">
                          {sub.gcashReferenceNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">
                          Status
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/30 rounded-full px-2 py-0.5 mt-0.5">
                          <Clock className="size-2.5" />
                          {sub.paymentStatus || "Pending Verification"}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs pt-1 border-t border-zinc-800/40">
                      <span className="text-zinc-500 block text-[10px] uppercase">
                        Date &amp; Time
                      </span>
                      <span className="text-zinc-400 font-mono text-[11px] sm:text-xs break-words">
                        {sub.submittedAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
