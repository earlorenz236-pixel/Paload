"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Shield,
  Lock,
  ArrowLeft,
  Tv,
  LogIn,
  AlertCircle,
  ShieldAlert,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const AUTHORIZED_ADMIN_EMAIL = "sylaselienorballesteros@gmail.com";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, role, signIn, signOut, loading: authLoading } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check URL query error flags
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "forbidden") {
      setErrorMessage(
        "Access Denied: Administrative privileges are strictly required to access the dashboard."
      );
    }
  }, [searchParams]);

  // If already authenticated as the designated administrator, automatically forward to /admin
  useEffect(() => {
    if (
      !authLoading &&
      user &&
      role === "admin" &&
      user.email?.toLowerCase().trim() === AUTHORIZED_ADMIN_EMAIL
    ) {
      const redirectUrl = searchParams.get("redirect") || "/admin";
      router.replace(redirectUrl);
    }
  }, [user, role, authLoading, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const inputEmail = email.trim().toLowerCase();
    if (!inputEmail || !password) {
      setErrorMessage("Please enter both administrator email and password.");
      return;
    }

    if (inputEmail !== AUTHORIZED_ADMIN_EMAIL) {
      setErrorMessage(
        "Access Denied: This email address is not authorized for administrator access."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signIn(inputEmail, password);

      if (error) {
        setErrorMessage(error.message || "Failed to sign in. Please verify your credentials.");
        setIsSubmitting(false);
        return;
      }

      // Verification will occur in AuthContext and effect above
      const redirectUrl = searchParams.get("redirect") || "/admin";
      router.refresh();
      router.push(redirectUrl);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during authentication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchAccount = async () => {
    await signOut();
    setErrorMessage(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#060807] text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top bar with back link and language switcher */}
      <header className="border-b border-zinc-800/80 bg-[#060807]/90 backdrop-blur-md px-4 sm:px-6 py-3.5">
        <div className="container mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors group"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Paload ko</span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <div className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11px] font-semibold text-zinc-400">
              <Shield className="size-3 text-emerald-400" />
              <span>Admin Portal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Login Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md">
          {/* Card Header Branding */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-3 flex size-14 items-center justify-center rounded-2xl bg-zinc-900 border border-emerald-500/30 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
              <Shield className="size-7" />
              <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-zinc-950 font-bold text-[10px]">
                <Lock className="size-3" />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Administrator Login
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Restricted management portal for Paload ko operators
            </p>
          </div>

          {/* If the current session does not belong to the designated admin, show a strict warning */}
          {user && (role !== "admin" || user.email?.toLowerCase().trim() !== AUTHORIZED_ADMIN_EMAIL) ? (
            <Card className="border-amber-500/30 bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 shadow-xl backdrop-blur-md">
              <CardHeader className="pb-3 text-center">
                <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <ShieldAlert className="size-5" />
                </div>
                <CardTitle className="text-base text-amber-200">
                  Unauthorized Account Detected
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  You are currently signed in as <span className="font-semibold text-zinc-200">{profile?.username || user.email}</span>. This account does not possess administrator privileges.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <Button
                  onClick={handleSwitchAccount}
                  variant="outline"
                  className="w-full border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs sm:text-sm h-10"
                >
                  <LogIn className="size-4 mr-2 text-emerald-400" />
                  Sign Out & Sign in as Administrator
                </Button>

                <Link href="/" className="block">
                  <Button
                    variant="ghost"
                    className="w-full text-xs text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  >
                    Return to Customer Home
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            /* Administrator Login Form */
            <Card className="border-zinc-800 bg-zinc-900/80 shadow-2xl backdrop-blur-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-white">
                  Enter Admin Credentials
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Protected by server-side verification and PostgreSQL Row Level Security.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {errorMessage && (
                  <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300">
                    <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">
                      Admin Email Address
                    </label>
                    <Input
                      type="email"
                      required
                      placeholder="admin@paloadko.ph"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      className="border-zinc-800 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-zinc-300">
                        Password
                      </label>
                    </div>
                    <Input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                      className="border-zinc-800 bg-zinc-950/70 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-emerald-500/50"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all h-10 mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Verifying Admin Session...
                      </>
                    ) : (
                      <>
                        <LogIn className="size-4 mr-2" />
                        Sign In to Dashboard
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
                  <p className="text-[11px] text-zinc-500">
                    Not an administrator?{" "}
                    <Link href="/" className="text-emerald-400 hover:underline">
                      Return to customer portal
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security footnote */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-zinc-500">
            <Lock className="size-3 text-emerald-500" />
            <span>End-to-end encrypted session with Supabase Auth</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#060807] text-zinc-400">
          <div className="flex items-center gap-2 text-xs">
            <Loader2 className="size-4 animate-spin text-emerald-400" />
            <span>Loading admin portal...</span>
          </div>
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}

