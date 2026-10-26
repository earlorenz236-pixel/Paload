"use client";

import React, { createContext, useContext, useState } from "react";

export interface Submission {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  receiverNumber: string;
  unitType: "Satellite" | "GSat" | "Fili TV" | "Sky Direct" | "Signal" | string;
  paymentMethod: string;
  adminGcashNumber: string;
  paymentAmount: string;
  packageDescription?: string;
  gcashReferenceNumber: string;
  paymentStatus: string;
  submittedAt: string;
}

interface SubmissionContextType {
  submissions: Submission[];
  addSubmission: (submission: Omit<Submission, "id" | "submittedAt">) => Submission;
  clearSubmissions: () => void;
}

const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined);

export function SubmissionProvider({ children }: { children: React.ReactNode }) {
  // Pure in-memory shared React state between User POV and Admin POV
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const addSubmission = (data: Omit<Submission, "id" | "submittedAt">): Submission => {
    const now = new Date();
    const dateStr = now.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const newSubmission: Submission = {
      ...data,
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `sub-${Date.now()}`,
      submittedAt: `${dateStr}, ${timeStr}`,
    };

    setSubmissions((prev) => [newSubmission, ...prev]);
    return newSubmission;
  };

  const clearSubmissions = () => {
    setSubmissions([]);
  };

  return (
    <SubmissionContext.Provider value={{ submissions, addSubmission, clearSubmissions }}>
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
