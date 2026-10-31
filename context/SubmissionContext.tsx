"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export interface Submission {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  note?: string;
  receiverNumber: string;
  unitType: "Satellite" | "GSat" | "Fili TV" | "Sky Direct" | "Signal" | string;
  paymentMethod: string;
  adminGcashNumber: string;
  paymentAmount: string;
  packageDescription?: string;
  gcashReferenceNumber: string;
  paymentStatus: string;
  submittedAt: string;
  archivedAt?: string | null;
}

export interface AddSubmissionResult {
  success: boolean;
  data?: Submission;
  error?: string;
}

interface SubmissionContextType {
  submissions: Submission[];
  loading: boolean;
  error: string | null;
  refreshSubmissions: () => Promise<void>;
  addSubmission: (data: Omit<Submission, "id" | "submittedAt">) => Promise<AddSubmissionResult>;
  updatePaymentStatus: (id: string, status: string) => Promise<{ success: boolean; error?: string }>;
  archiveSubmission: (id: string, archive: boolean) => Promise<{ success: boolean; error?: string }>;
  deleteSubmission: (id: string) => Promise<{ success: boolean; error?: string }>;
  clearSubmissions: () => void;
}

const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined);

function mapDbRowToSubmission(row: any): Submission {
  const payment = Array.isArray(row.payments) ? row.payments[0] : row.payments;
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  const createdDate = row.created_at ? new Date(row.created_at) : new Date(0);
  const dateStr = createdDate.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timeStr = createdDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const rawAmount = typeof row.amount === "number" ? row.amount : parseFloat(row.amount || "0");
  const formattedAmount = isNaN(rawAmount) ? "₱0" : `₱${rawAmount.toLocaleString()}`;

  return {
    id: row.id,
    name: profile?.account_name || "Customer",
    phoneNumber: profile?.phone_number || "",
    address: row.address || profile?.address || "",
    note: row.note || "",
    receiverNumber: row.account_number,
    unitType: row.unit_type,
    paymentMethod: payment?.payment_method || "GCash",
    adminGcashNumber: "09216005069",
    paymentAmount: formattedAmount,
    packageDescription: row.package_name || "",
    gcashReferenceNumber: payment?.gcash_reference_number || "",
    paymentStatus: payment?.verification_status || row.status || "Pending Verification",
    submittedAt: `${dateStr}, ${timeStr}`,
    archivedAt: row.archived_at || null,
  };
}


export function SubmissionProvider({ children }: { children: React.ReactNode }) {
  const { user, profile, role } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    if (!user) {
      setSubmissions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("load_requests")
        .select(`
          id,
          unit_type,
          account_number,
          package_name,
          amount,
          address,
          note,
          status,
          created_at,
          updated_at,
          archived_at,
          customer_id,
          profiles:customer_id (
            account_name,
            phone_number,
            address
          ),
          payments (
            id,
            payment_method,
            amount,
            gcash_reference_number,
            verification_status,
            verified_at,
            verified_by
          )
        `)
        .order("created_at", { ascending: false });

      // If user is a customer, only fetch their own load requests
      if (role !== "admin") {
        query = query.eq("customer_id", user.id);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error("Error fetching submissions from Supabase:", fetchError);
        setError(fetchError.message);
      } else if (data) {
        const mapped = data.map((row: any) => mapDbRowToSubmission(row));
        setSubmissions(mapped);
      }
    } catch (err: any) {
      console.error("Unexpected error fetching submissions:", err);
      setError(err.message || "Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  }, [user, role, profile]);

  // Refetch submissions when authenticated user or role changes
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Subscribe to real-time database changes on load_requests and payments
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`customer-db-changes-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "load_requests",
          filter: role !== "admin" ? `customer_id=eq.${user.id}` : undefined,
        },
        () => {
          fetchSubmissions();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "payments",
        },
        () => {
          fetchSubmissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, role, fetchSubmissions]);

  const addSubmission = async (
    data: Omit<Submission, "id" | "submittedAt">
  ): Promise<AddSubmissionResult> => {
    // 1. Enforce verified session check
    const {
      data: { user: currentUser },
      error: sessionError,
    } = await supabase.auth.getUser();

    if (sessionError || !currentUser) {
      return {
        success: false,
        error: "Please sign in to an authenticated customer account before submitting a reload request.",
      };
    }

    // 2. Parse clean numeric amount
    const cleanAmountStr = data.paymentAmount.replace(/[^\d.]/g, "");
    const numericAmount = parseFloat(cleanAmountStr);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return {
        success: false,
        error: "Invalid reload package amount. Please select a valid package.",
      };
    }

    // 3. Prevent duplicate submissions with the same GCash reference number
    const cleanRef = data.gcashReferenceNumber?.trim();
    if (cleanRef) {
      const { data: existingPayment } = await supabase
        .from("payments")
        .select("id")
        .eq("gcash_reference_number", cleanRef)
        .maybeSingle();

      if (existingPayment) {
        return {
          success: false,
          error: `The GCash reference number (${cleanRef}) has already been recorded. Please verify your reference number.`,
        };
      }
    }

    try {
      // 4. Keep customer profile synchronized with the submitted name, phone, and address
      if (data.name?.trim() || data.phoneNumber?.trim() || data.address?.trim()) {
        await supabase
          .from("profiles")
          .update({
            account_name: data.name.trim(),
            phone_number: data.phoneNumber.trim(),
            address: data.address.trim(),
          })
          .eq("id", currentUser.id);
      }

      // 5. Insert load request into public.load_requests
      const { data: loadRequest, error: lrError } = await supabase
        .from("load_requests")
        .insert({
          customer_id: currentUser.id,
          unit_type: data.unitType,
          account_number: data.receiverNumber.trim(),
          package_name: data.packageDescription?.trim() || null,
          amount: numericAmount,
          address: data.address.trim(),
          note: data.note?.trim() || null,
          status: "Pending Verification",
        })
        .select()
        .single();

      if (lrError || !loadRequest) {
        console.error("Supabase load_requests insert failed:", lrError);
        return {
          success: false,
          error: `Failed to save reload request: ${lrError?.message || "Unknown database error"}`,
        };
      }

      // 6. Insert GCash payment record into public.payments
      const { data: payment, error: pError } = await supabase
        .from("payments")
        .insert({
          load_request_id: loadRequest.id,
          payment_method: data.paymentMethod || "GCash",
          amount: numericAmount,
          gcash_reference_number: cleanRef || data.gcashReferenceNumber.trim(),
          verification_status: "Pending Verification",
        })
        .select()
        .single();

      if (pError || !payment) {
        console.error("Supabase payments insert failed:", pError);
        return {
          success: false,
          error: `Payment registration failed: ${pError?.message || "Could not save payment reference"}.`,
        };
      }

      // 7. Construct mapped submission using customer's actual submitted data
      const createdRecord = mapDbRowToSubmission({
        ...loadRequest,
        profiles: {
          account_name: data.name.trim(),
          phone_number: data.phoneNumber.trim(),
          address: data.address.trim(),
        },
        payments: [payment],
      });

      setSubmissions((prev) => [createdRecord, ...prev.filter((s) => s.id !== createdRecord.id)]);
      return {
        success: true,
        data: createdRecord,
      };
    } catch (err: any) {
      console.error("Error during database submission:", err);
      return {
        success: false,
        error: err.message || "An unexpected error occurred during submission.",
      };
    }
  };

  const updatePaymentStatus = async (
    id: string,
    status: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Update payment record in database
      const { error: pError } = await supabase
        .from("payments")
        .update({
          verification_status: status,
          verified_at: new Date().toISOString(),
        })
        .eq("load_request_id", id);

      if (pError) {
        console.error("Error updating payment verification_status:", pError);
        return { success: false, error: pError.message };
      }

      // Update load_request status in database
      const { error: lrError } = await supabase
        .from("load_requests")
        .update({
          status: status,
        })
        .eq("id", id);

      if (lrError) {
        console.error("Error updating load_request status:", lrError);
        return { success: false, error: lrError.message };
      }

      // Optimistically update local state
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, paymentStatus: status } : sub))
      );

      return { success: true };
    } catch (err: any) {
      console.error("Error in updatePaymentStatus:", err);
      return { success: false, error: err.message || "Failed to update payment status." };
    }
  };

  const archiveSubmission = async (
    id: string,
    archive: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error: lrError } = await supabase
        .from("load_requests")
        .update({
          archived_at: archive ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (lrError) {
        console.error("Error updating archived_at:", lrError);
        return { success: false, error: lrError.message };
      }

      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === id
            ? { ...sub, archivedAt: archive ? new Date().toISOString() : null }
            : sub
        )
      );

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to archive record." };
    }
  };

  const deleteSubmission = async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error: delError } = await supabase
        .from("load_requests")
        .delete()
        .eq("id", id);

      if (delError) {
        console.error("Error deleting load_request from Supabase:", delError);
        return { success: false, error: delError.message };
      }

      setSubmissions((prev) => prev.filter((sub) => sub.id !== id));
      return { success: true };
    } catch (err: any) {
      console.error("Unexpected error in deleteSubmission:", err);
      return { success: false, error: err.message || "Failed to delete record." };
    }
  };

  const clearSubmissions = () => {
    setSubmissions([]);
  };

  return (
    <SubmissionContext.Provider
      value={{
        submissions,
        loading,
        error,
        refreshSubmissions: fetchSubmissions,
        addSubmission,
        updatePaymentStatus,
        archiveSubmission,
        deleteSubmission,
        clearSubmissions,
      }}
    >
      {children}
    </SubmissionContext.Provider>
  );
}

export function useSubmissions() {
  const context = useContext(SubmissionContext);
  if (!context) {
    throw new Error("useSubmissions must be used within a SubmissionProvider");
  }
  return context;
}
