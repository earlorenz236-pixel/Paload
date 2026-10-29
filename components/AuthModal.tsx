"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  User,
  LogIn,
  UserPlus,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Lock,
  Phone,
  AtSign,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
}: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const { language } = useLanguage();

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accountName, setAccountName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isBisaya = language === "ceb";

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setAccountName("");
    setPhoneNumber("");
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleModeSwitch = (newMode: "login" | "register") => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      setErrorMessage(
        isBisaya
          ? "Palihug isulod ang imong username ug password."
          : "Please enter your username and password."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signIn(cleanUsername, password);
      if (error) {
        setErrorMessage(
          error.message?.includes("Invalid login credentials")
            ? (isBisaya
                ? "Dili husto ang username o password."
                : "Invalid username or password.")
            : error.message || (isBisaya ? "Dili makasulod." : "Failed to sign in.")
        );
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(
        isBisaya ? "Malamposong naka-login!" : "Successfully signed in!"
      );
      setTimeout(() => {
        handleClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanName = accountName.trim();
    const cleanUsername = username.trim().toLowerCase();
    const cleanPhone = phoneNumber.trim();

    if (!cleanName || !cleanUsername || !cleanPhone) {
      setErrorMessage(
        isBisaya
          ? "Palihug kompletoha ang Pangalan, Username, ug Numero sa CP."
          : "Please fill out Account Name, Username, and Phone Number."
      );
      return;
    }

    if (cleanUsername.length < 3) {
      setErrorMessage(
        isBisaya
          ? "Ang username kinahanglang labing menos 3 ka letra o numero."
          : "Username must be at least 3 characters long."
      );
      return;
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(cleanUsername)) {
      setErrorMessage(
        isBisaya
          ? "Ang username mahimo ra nga adunay mga letra, numero, underscores, ug tuldok."
          : "Username may only contain letters, numbers, underscores, and dots."
      );
      return;
    }

    if (!password) {
      setErrorMessage(
        isBisaya
          ? "Palihug isulod ang imong password."
          : "Please enter a password."
      );
      return;
    }

    if (password.length < 6) {
      setErrorMessage(
        isBisaya
          ? "Ang password kinahanglang labing menos 6 ka letra/numero."
          : "Password must be at least 6 characters long."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signUp({
        username: cleanUsername,
        password,
        name: cleanName,
        phoneNumber: cleanPhone,
      });

      if (error) {
        const errLower = error.message?.toLowerCase() || "";
        setErrorMessage(
          errLower.includes("already") || errLower.includes("taken")
            ? (isBisaya
                ? "Gigamit na kini nga username. Palihug pagpili og lain."
                : "This username is already taken. Please choose another.")
            : error.message || "Registration failed."
        );
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(
        isBisaya
          ? "Malamposong nahimo ang imong account!"
          : "Account created successfully!"
      );
      setTimeout(() => {
        handleClose();
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-md border-zinc-800 bg-zinc-950/95 text-zinc-100 p-4 sm:p-6 shadow-2xl max-h-[90dvh] overflow-y-auto overscroll-contain">
        <DialogHeader className="gap-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <User className="size-4" />
            </div>
            <DialogTitle className="text-lg font-bold text-white">
              {mode === "login"
                ? isBisaya
                  ? "Sulod sa Imong Account"
                  : "Customer Sign In"
                : isBisaya
                ? "Paghimo og Bag-ong Account"
                : "Create Customer Account"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-zinc-400">
            {mode === "login"
              ? isBisaya
                ? "Isulod ang imong username ug password aron masubay ang imong mga load request."
                : "Sign in with your username to track and view your satellite reloading history."
              : isBisaya
              ? "Rehistro gamit ang imong username aron dali nga makapa-reload."
              : "Register with a unique username to submit reloads and view your orders."}
          </DialogDescription>
        </DialogHeader>

        {/* Tab switchers */}
        <div className="grid grid-cols-2 rounded-lg bg-zinc-900/80 p-1 border border-zinc-800 text-xs mt-2">
          <button
            type="button"
            onClick={() => handleModeSwitch("login")}
            className={`py-1.5 rounded-md font-medium transition-all ${
              mode === "login"
                ? "bg-emerald-500 text-zinc-950 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {isBisaya ? "Sulod (Sign In)" : "Sign In"}
          </button>
          <button
            type="button"
            onClick={() => handleModeSwitch("register")}
            className={`py-1.5 rounded-md font-medium transition-all ${
              mode === "register"
                ? "bg-emerald-500 text-zinc-950 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {isBisaya ? "Rehistro (Register)" : "Register"}
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-950/40 p-2.5 text-xs text-rose-300 mt-2">
            <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-start gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 p-2.5 text-xs text-emerald-300 mt-2">
            <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-3.5 mt-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <User className="size-3 text-emerald-400" />
                <span>Username</span>
              </label>
              <Input
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                required
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
                className="border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 h-9 text-xs focus-visible:ring-emerald-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Lock className="size-3 text-emerald-400" />
                <span>Password</span>
              </label>
              <Input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 h-9 text-xs focus-visible:ring-emerald-500/50"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold h-9 text-xs shadow-md mt-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  {isBisaya ? "Nagasulod..." : "Signing in..."}
                </>
              ) : (
                <>
                  <LogIn className="size-3.5 mr-1.5" />
                  {isBisaya ? "Sulod (Sign In)" : "Sign In"}
                </>
              )}
            </Button>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegister} className="space-y-3 mt-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <User className="size-3 text-emerald-400" />
                <span>{isBisaya ? "Kompletong Pangalan" : "Account Name / Full Name"}</span>
              </label>
              <Input
                type="text"
                required
                placeholder={isBisaya ? "Juan Dela Cruz" : "Juan Dela Cruz"}
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                disabled={isSubmitting}
                className="border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 h-9 text-xs focus-visible:ring-emerald-500/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <AtSign className="size-3 text-emerald-400" />
                  <span>Username</span>
                </label>
                <Input
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  required
                  placeholder={isBisaya ? "Isulod ang imong username" : "Enter your username"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                  className="border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 h-9 text-xs focus-visible:ring-emerald-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                  <Phone className="size-3 text-emerald-400" />
                  <span>{isBisaya ? "Numero sa CP" : "Phone Number"}</span>
                </label>
                <Input
                  type="tel"
                  required
                  placeholder="0912-345-6789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isSubmitting}
                  className="border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 h-9 text-xs focus-visible:ring-emerald-500/50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
                <Lock className="size-3 text-emerald-400" />
                <span>{isBisaya ? "Password (labing menos 6 ka letra)" : "Password (min. 6 characters)"}</span>
              </label>
              <Input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 h-9 text-xs focus-visible:ring-emerald-500/50"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold h-9 text-xs shadow-md mt-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  {isBisaya ? "Naghimo og account..." : "Creating account..."}
                </>
              ) : (
                <>
                  <UserPlus className="size-3.5 mr-1.5" />
                  {isBisaya ? "Kompletoha ang Rehistro" : "Create Customer Account"}
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
