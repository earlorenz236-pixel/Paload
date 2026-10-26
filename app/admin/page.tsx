"use client";

import React from "react";
import Link from "next/link";
import { useSubmissions } from "@/context/SubmissionContext";
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
import { Button } from "@/components/ui/button";
import {
  Tv,
  ArrowLeft,
  Users,
  Inbox,
  Shield,
  Info,
  Trash2,
  ExternalLink,
  Radio,
  Clock,
  Phone,
} from "lucide-react";
import BlurText from "@/components/BlurText";

export default function AdminPage() {
  const { submissions, clearSubmissions } = useSubmissions();

  return (
    <div className="flex min-h-screen flex-col bg-[#060807] text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#060807]/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
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
                    Admin
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 hidden sm:inline">
                  System Administration Dashboard
                </span>
              </div>
            </Link>
          </div>

          <div className="shrink-0">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer font-medium border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs sm:text-sm px-2.5 sm:px-3 h-8 sm:h-9"
              >
                <ArrowLeft className="mr-1.5 size-3.5 sm:size-4" />
                <span className="hidden sm:inline">User POV Form</span>
                <span className="sm:hidden">User POV</span>
              </Button>
            </Link>
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
                <span>Live Management</span>
              </div>
              <div className="flex items-center gap-3">
                <BlurText
                  text="Admin Dashboard"
                  delay={60}
                  animateBy="words"
                  direction="top"
                  className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl"
                />
              </div>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                Connected directly to the User POV form in shared application state.
              </p>
            </div>

            {submissions.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearSubmissions}
                className="w-full sm:w-auto cursor-pointer border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors h-9"
                title="Reset temporary submissions"
              >
                <Trash2 className="mr-1.5 size-3.5" />
                Clear Submissions
              </Button>
            )}
          </div>

          {/* Temporary State Notice Banner */}
          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/25 bg-emerald-950/20 p-4 text-xs text-zinc-300 sm:text-sm backdrop-blur-xs">
            <Info className="size-5 shrink-0 text-emerald-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-white">In-Memory Application State</p>
              <p className="text-zinc-400 leading-relaxed">
                Submissions are held in temporary shared React memory between the User POV form and this Admin Dashboard. This prototype does not use a persistent database; records will reset if the server restarts or browser storage is cleared.
              </p>
            </div>
          </div>

          {/* Metrics Overview Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sm:col-span-1 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Total Submissions
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
                  Calculated from actual user form submissions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sm:col-span-2 shadow-md flex flex-col justify-center">
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-white block text-sm">
                      Real-Time User POV Connection
                    </span>
                    <span className="text-zinc-400">
                      When a user submits their receiver details, they appear here instantly without refreshing.
                    </span>
                  </div>
                  <Link href="/" className="shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer border-emerald-500/30 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 text-xs"
                    >
                      <ExternalLink className="mr-1.5 size-3.5" />
                      Test User POV Form
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Submissions Table / Empty State Card */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-xl overflow-hidden backdrop-blur-sm">
            <div className="p-5 sm:p-6 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white">
                  User Submissions
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Detailed view of all submitted receiver reload requests.
                </p>
              </div>
              <span className="text-xs text-zinc-500">
                {submissions.length === 1
                  ? "1 submission recorded"
                  : `${submissions.length} submissions recorded`}
              </span>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table className="min-w-[760px]">
                <TableHeader className="bg-zinc-950/60 border-zinc-800">
                  <TableRow className="border-zinc-800/80 hover:bg-transparent">
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Account Name
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Phone Number
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Unit Type
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Account Number
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Payment (GCash)
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      Address
                    </TableHead>
                    <TableHead className="text-xs font-semibold uppercase tracking-wider text-zinc-400 text-right">
                      Submitted At
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-zinc-800/60">
                  {submissions.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={7} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                          <div className="flex size-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/80 text-zinc-400">
                            <Inbox className="size-6 text-zinc-400" />
                          </div>
                          <div className="space-y-1 max-w-sm">
                            <h4 className="text-base font-bold text-white">
                              No submissions yet
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              When users fill out and submit the information form on the user-facing page, their details will immediately appear in this table.
                            </p>
                          </div>
                          <Link href="/">
                            <Button
                              size="sm"
                              className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] mt-1"
                            >
                              Go to User POV Form
                            </Button>
                          </Link>
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
                            <span className="inline-flex w-fit items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5">
                              <Clock className="size-2.5" />
                              {sub.paymentStatus || "Pending Verification"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-zinc-300 max-w-xs truncate text-xs" title={sub.address}>
                          {sub.address}
                        </TableCell>
                        <TableCell className="text-zinc-400 text-xs text-right whitespace-nowrap">
                          {sub.submittedAt}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Responsive View */}
            <div className="md:hidden">
              {submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 text-center space-y-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/80 text-zinc-400">
                    <Inbox className="size-6 text-zinc-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white">
                      No submissions yet
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Submissions entered on the User POV form will appear here.
                    </p>
                  </div>
                  <Link href="/">
                    <Button
                      size="sm"
                      className="cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] mt-1"
                    >
                      Go to User POV Form
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/80">
                  {submissions.map((sub) => (
                    <div key={sub.id} className="p-4 space-y-3 bg-zinc-950/30">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-zinc-500 block text-[10px] uppercase">
                            Account Name
                          </span>
                          <div className="font-bold text-white text-sm break-words">
                            {sub.name}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-zinc-400 font-mono mt-0.5">
                            <Phone className="size-3 text-zinc-500" />
                            {sub.phoneNumber}
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 shrink-0">
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
                            Time
                          </span>
                          <span className="text-zinc-400 flex items-center gap-1 text-[11px] sm:text-xs break-words">
                            <Clock className="size-3 text-zinc-500 shrink-0" />
                            {sub.submittedAt}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs pt-1 border-t border-zinc-800/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500 text-[10px] uppercase">
                            Payment (GCash)
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded px-1.5 py-0.5">
                            <Clock className="size-2.5" />
                            {sub.paymentStatus || "Pending Verification"}
                          </span>
                        </div>
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
                        <span className="text-zinc-400 block text-[11px] font-mono break-all">
                          Ref: {sub.gcashReferenceNumber || "—"}
                        </span>
                      </div>

                      <div className="text-xs pt-1 border-t border-zinc-800/40">
                        <span className="text-zinc-500 block text-[10px] uppercase">
                          Address
                        </span>
                        <span className="text-zinc-300 break-words">
                          {sub.address}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>

      {/* Admin Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#060807] py-6 text-center text-xs text-zinc-500">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-zinc-300 font-semibold">
            <Tv className="size-4 text-emerald-400" />
            <span>Paload ko • Admin Console</span>
          </div>
          <p className="text-[11px]">
            In-memory prototype connected to User POV form.
          </p>
        </div>
      </footer>
    </div>
  );
}
