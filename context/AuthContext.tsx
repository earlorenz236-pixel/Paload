"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface SignUpResult {
  error: Error | null;
  user: { id: string; username: string; name: string } | null;
  requiresVerification: boolean;
  registeredUsername: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: "customer" | "admin" | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: "login" | "register";
  authPrefilledUsername: string;
  openAuthModal: (mode?: "login" | "register", prefilledUsername?: string) => void;
  closeAuthModal: () => void;
  isSuccessDialogOpen: boolean;
  successDialogData: { username: string; requiresVerification: boolean } | null;
  openSuccessDialog: (data: { username: string; requiresVerification?: boolean }) => void;
  closeSuccessDialog: () => void;
  handleSuccessDialogContinue: () => void;
  signIn: (identifier: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (data: {
    username: string;
    password: string;
    name: string;
    phoneNumber: string;
    address?: string;
  }) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const [authPrefilledUsername, setAuthPrefilledUsername] = useState("");
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successDialogData, setSuccessDialogData] = useState<{
    username: string;
    requiresVerification: boolean;
  } | null>(null);

  const openAuthModal = (mode: "login" | "register" = "login", prefilledUsername?: string) => {
    setAuthModalMode(mode);
    if (prefilledUsername !== undefined) {
      setAuthPrefilledUsername(prefilledUsername);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openSuccessDialog = (data: { username: string; requiresVerification?: boolean }) => {
    setSuccessDialogData({
      username: data.username,
      requiresVerification: Boolean(data.requiresVerification),
    });
    setIsSuccessDialogOpen(true);
  };

  const closeSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
  };

  const handleSuccessDialogContinue = () => {
    const regUsername = successDialogData?.username || "";
    setIsSuccessDialogOpen(false);
    if (!user) {
      openAuthModal("login", regUsername);
    }
  };

  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch {
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Check active session on mount
    supabase.auth
      .getUser()
      .then(({ data: { user } }) => {
        if (!mounted) return;
        setUser(user);
        if (user) {
          fetchProfile(user.id).finally(() => {
            if (mounted) setLoading(false);
          });
        } else {
          setProfile(null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = async (identifier: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        return { error: new Error(result.error || "Invalid username or password.") };
      }

      // Refresh active user from Supabase cookie session
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        await fetchProfile(user.id);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUp = async ({
    username,
    password,
    name,
    phoneNumber,
  }: {
    username: string;
    password: string;
    name: string;
    phoneNumber: string;
    address?: string;
  }): Promise<SignUpResult> => {
    const cleanUsername = username.trim().toLowerCase();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cleanUsername,
          password,
          name: name.trim(),
          phoneNumber: phoneNumber.trim(),
        }),
      });

      const result = await res.json();
      if (!res.ok || result.error) {
        return {
          error: new Error(result.error || "Registration failed."),
          user: null,
          requiresVerification: false,
          registeredUsername: cleanUsername,
        };
      }

      return {
        error: null,
        user: result.user || null,
        requiresVerification: Boolean(result.requiresVerification),
        registeredUsername: cleanUsername,
      };
    } catch (err: any) {
      return {
        error: err,
        user: null,
        requiresVerification: false,
        registeredUsername: cleanUsername,
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const role: "customer" | "admin" | null = useMemo(() => {
    if (!user || !profile) return null;
    if (
      user.email?.toLowerCase().trim() === "sylaselienorballesteros@gmail.com" &&
      profile.role === "admin"
    ) {
      return "admin";
    }
    return "customer";
  }, [user, profile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        isAuthModalOpen,
        authModalMode,
        authPrefilledUsername,
        openAuthModal,
        closeAuthModal,
        isSuccessDialogOpen,
        successDialogData,
        openSuccessDialog,
        closeSuccessDialog,
        handleSuccessDialogContinue,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
