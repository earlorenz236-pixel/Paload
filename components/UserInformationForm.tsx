"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSubmissions, Submission } from "@/context/SubmissionContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Send,
  User,
  Phone,
  MapPin,
  Hash,
  Tv,
  Info,
  Pencil,
  LayoutDashboard,
  Wallet,
  ShieldCheck,
  CreditCard,
  Copy,
  Check,
  Clock,
  History,
} from "lucide-react";

export interface PaymentOption {
  amount: string;
  packageName?: string;
  label: string;
}

export const UNIT_PAYMENT_OPTIONS: Record<string, PaymentOption[]> = {
  Satellite: [
    { amount: "₱130", label: "₱130" },
    { amount: "₱250", label: "₱250" },
    { amount: "₱350", label: "₱350" },
    { amount: "₱450", label: "₱450" },
  ],
  GSat: [
    { amount: "₱150", packageName: "Regular Load", label: "₱150 — Regular Load" },
    { amount: "₱250", packageName: "Regular Load", label: "₱250 — Regular Load" },
    { amount: "₱550", packageName: "All Channels", label: "₱550 — All Channels" },
  ],
  "Fili TV": [
    { amount: "₱169", label: "₱169" },
  ],
  "Sky Direct": [
    { amount: "₱140", label: "₱140" },
  ],
  Signal: [
    { amount: "₱230", label: "₱230" },
    { amount: "₱330", label: "₱330" },
    { amount: "₱450", label: "₱450" },
    { amount: "₱650", label: "₱650" },
    { amount: "₱750", label: "₱750" },
    { amount: "₱850", label: "₱850" },
    { amount: "₱1,050", label: "₱1,050" },
  ],
};

const ADMIN_GCASH_NUMBER = "09216005069";

interface FormData {
  name: string;
  phoneNumber: string;
  address: string;
  receiverNumber: string;
  unitType: string;
  paymentMethod: string;
  paymentAmount: string;
  packageDescription: string;
  gcashReferenceNumber: string;
}

interface FormErrors {
  name?: string;
  phoneNumber?: string;
  address?: string;
  receiverNumber?: string;
  unitType?: string;
  paymentAmount?: string;
  gcashReferenceNumber?: string;
}

const INITIAL_FORM: FormData = {
  name: "",
  phoneNumber: "",
  address: "",
  receiverNumber: "",
  unitType: "",
  paymentMethod: "GCash",
  paymentAmount: "",
  packageDescription: "",
  gcashReferenceNumber: "",
};

export function UserInformationForm() {
  const { addSubmission } = useSubmissions();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<Submission | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const getRequiredReceiverLength = (unitType: string): number | null => {
    if (unitType === "Satellite") return 6;
    if (unitType === "GSat" || unitType === "Fili TV") return 16;
    if (unitType === "Sky Direct") return 13;
    if (unitType === "Signal") return 9;
    return null;
  };

  const receiverReqLength = getRequiredReceiverLength(formData.unitType);

  const handleCopyAdminNumber = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(ADMIN_GCASH_NUMBER);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Account Name validation
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      newErrors.name = "Account name is required.";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Account name must be at least 2 characters.";
    }

    // 2. Phone Number validation: exactly 11 digits, digits only
    const phone = formData.phoneNumber.trim();
    if (!phone) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\d+$/.test(phone)) {
      newErrors.phoneNumber = "Phone number must contain digits only.";
    } else if (phone.length !== 11) {
      newErrors.phoneNumber =
        "Phone number must be exactly 11 digits (e.g. 09171234567).";
    }

    // 3. Unit Type validation
    if (!formData.unitType) {
      newErrors.unitType = "Please select a unit type from the dropdown.";
    } else if (
      !["Satellite", "GSat", "Fili TV", "Sky Direct", "Signal"].includes(
        formData.unitType
      )
    ) {
      newErrors.unitType =
        "Unit type must be Satellite, GSat, Fili TV, Sky Direct, or Signal.";
    }

    // 4. Receiver Number validation
    const receiver = formData.receiverNumber.trim();
    const reqLen = getRequiredReceiverLength(formData.unitType);
    if (!receiver) {
      newErrors.receiverNumber = "Receiver number is required.";
    } else if (!/^\d+$/.test(receiver)) {
      newErrors.receiverNumber = "Receiver number must contain digits only.";
    } else if (!formData.unitType) {
      newErrors.receiverNumber = "Please select a Unit Type first.";
    } else if (reqLen && receiver.length !== reqLen) {
      newErrors.receiverNumber = `Receiver number for ${formData.unitType} must be exactly ${reqLen} digits (currently ${receiver.length} digits).`;
    }

    // 5. Address validation
    const trimmedAddress = formData.address.trim();
    if (!trimmedAddress) {
      newErrors.address = "Complete address is required.";
    } else if (trimmedAddress.length < 5) {
      newErrors.address = "Please provide a complete and specific address.";
    }

    // 6. Payment Amount validation
    if (!formData.paymentAmount) {
      newErrors.paymentAmount = "Please select a payment amount.";
    } else {
      const allowedOptions = UNIT_PAYMENT_OPTIONS[formData.unitType] || [];
      const isValid = allowedOptions.some((opt) => opt.amount === formData.paymentAmount);
      if (!isValid) {
        newErrors.paymentAmount = `Selected amount is invalid for ${formData.unitType || "selected unit"}.`;
      }
    }

    // 7. GCash Reference Number validation: digits only, required
    const refNum = formData.gcashReferenceNumber.trim();
    if (!refNum) {
      newErrors.gcashReferenceNumber = "GCash reference number is required.";
    } else if (!/^\d+$/.test(refNum)) {
      newErrors.gcashReferenceNumber =
        "GCash reference number must contain digits only.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Backspace" ||
      e.key === "Tab" ||
      e.key === "Enter" ||
      e.key === "Delete" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "Home" ||
      e.key === "End" ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    }
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleNumericChange = (
    field: "phoneNumber" | "receiverNumber" | "gcashReferenceNumber",
    rawVal: string,
    hadNonDigitsFlag?: boolean,
    maxLen?: number | null
  ) => {
    const hadNonDigits = hadNonDigitsFlag || /\D/.test(rawVal);
    let cleaned = rawVal.replace(/\D/g, "");
    if (maxLen && cleaned.length > maxLen) {
      cleaned = cleaned.slice(0, maxLen);
    }

    setFormData((prev) => ({ ...prev, [field]: cleaned }));

    setErrors((prev) => {
      const updated = { ...prev };

      if (hadNonDigits) {
        if (field === "phoneNumber") {
          updated.phoneNumber = "Phone number must contain digits only.";
        } else if (field === "receiverNumber") {
          updated.receiverNumber = "Receiver number must contain digits only.";
        } else if (field === "gcashReferenceNumber") {
          updated.gcashReferenceNumber = "GCash reference number must contain digits only.";
        }
        return updated;
      }

      // Live validation on input
      if (field === "phoneNumber") {
        if (cleaned.length === 0) {
          delete updated.phoneNumber;
        } else if (cleaned.length !== 11) {
          updated.phoneNumber =
            "Phone number must be exactly 11 digits (e.g. 09171234567).";
        } else {
          delete updated.phoneNumber;
        }
      } else if (field === "receiverNumber") {
        const req = getRequiredReceiverLength(formData.unitType);
        if (!formData.unitType) {
          updated.receiverNumber = "Please select a Unit Type first.";
        } else if (cleaned.length === 0) {
          delete updated.receiverNumber;
        } else if (req && cleaned.length !== req) {
          updated.receiverNumber = `Receiver number for ${formData.unitType} must be exactly ${req} digits.`;
        } else {
          delete updated.receiverNumber;
        }
      } else if (field === "gcashReferenceNumber") {
        if (cleaned.length === 0) {
          delete updated.gcashReferenceNumber;
        } else {
          delete updated.gcashReferenceNumber;
        }
      }

      return updated;
    });
  };

  const handleNumericPaste = (
    field: "phoneNumber" | "receiverNumber" | "gcashReferenceNumber",
    e: React.ClipboardEvent<HTMLInputElement>,
    maxLen?: number | null
  ) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const hadNonDigits = /\D/.test(pastedText);
    const digitsOnly = pastedText.replace(/\D/g, "");

    const target = e.currentTarget;
    const start = target.selectionStart ?? 0;
    const end = target.selectionEnd ?? target.value.length;
    const prevVal = target.value;
    const nextVal = prevVal.substring(0, start) + digitsOnly + prevVal.substring(end);
    let cleaned = nextVal.replace(/\D/g, "");
    if (maxLen && cleaned.length > maxLen) {
      cleaned = cleaned.slice(0, maxLen);
    }

    handleNumericChange(field, cleaned, hadNonDigits, maxLen);
  };

  const handleTextChange = (field: "name" | "address", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        if (field === "name" && value.trim().length >= 2) {
          delete updated.name;
        }
        if (field === "address" && value.trim().length >= 5) {
          delete updated.address;
        }
        return updated;
      });
    }
  };

  const handleUnitTypeChange = (newUnitType: string) => {
    const reqLen = getRequiredReceiverLength(newUnitType);
    let clampedReceiver = formData.receiverNumber;
    if (reqLen && clampedReceiver.length > reqLen) {
      clampedReceiver = clampedReceiver.slice(0, reqLen);
    }

    // When unit type changes, clear previously selected payment amount and package description
    setFormData((prev) => ({
      ...prev,
      unitType: newUnitType,
      receiverNumber: clampedReceiver,
      paymentAmount: "",
      packageDescription: "",
    }));

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.unitType;
      delete updated.paymentAmount;
      if (clampedReceiver) {
        if (reqLen && clampedReceiver.length !== reqLen) {
          updated.receiverNumber = `Receiver number for ${newUnitType} must be exactly ${reqLen} digits.`;
        } else {
          delete updated.receiverNumber;
        }
      }
      return updated;
    });
  };

  const handlePaymentAmountChange = (amount: string) => {
    const currentOptions = UNIT_PAYMENT_OPTIONS[formData.unitType] || [];
    const matchedOption = currentOptions.find((opt) => opt.amount === amount);

    setFormData((prev) => ({
      ...prev,
      paymentAmount: amount,
      packageDescription: matchedOption?.packageName || "",
    }));

    if (errors.paymentAmount) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.paymentAmount;
        return updated;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const newRecord = addSubmission({
        ...formData,
        adminGcashNumber: ADMIN_GCASH_NUMBER,
        paymentStatus: "Pending Verification",
      });
      setSubmittedData({ ...formData });
      setSubmittedRecord(newRecord);
      setIsSubmitted(true);
      setIsDialogOpen(true);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setIsSubmitted(false);
    setSubmittedData(null);
    setSubmittedRecord(null);
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  return (
    <section id="info-form" className="scroll-mt-20 py-12 md:py-16">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
            <Tv className="size-4" />
            <span>Step 1: Enter Details & Payment</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            User Information Form
          </h2>
          <p className="mt-1.5 text-sm text-zinc-400 sm:text-base">
            Please fill in your contact information, receiver unit details, and GCash payment info below.
          </p>
        </div>

        {/* Prototype Notice Banner */}
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-4 text-xs text-zinc-300 sm:text-sm backdrop-blur-xs">
          <Info className="size-5 shrink-0 text-emerald-400 mt-0.5" />
          <div>
            <p className="font-semibold text-white">Prototype Notice</p>
            <p className="mt-0.5 leading-relaxed text-zinc-400">
              This form is an interactive frontend prototype for{" "}
              <span className="font-semibold text-emerald-300">Paload ko</span>. Input will be validated locally and synced to the Admin Dashboard. No personal information is saved to an external database.
            </p>
          </div>
        </div>

        {/* Form or Confirmation Card */}
        <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/80 p-4 shadow-xl backdrop-blur-sm sm:p-8">
          {isSubmitted && submittedData ? (
            /* Confirmation View */
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 sm:p-5 text-emerald-200">
                <CheckCircle2 className="size-8 shrink-0 text-emerald-400 mt-0.5" />
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-white">
                    Request Submitted for Verification!
                  </h3>
                  <p className="mt-1 text-sm text-emerald-300/90">
                    Your details and GCash payment reference have been submitted and are pending admin verification for your{" "}
                    <strong className="underline decoration-emerald-400 underline-offset-2 text-white">
                      {submittedData.unitType}
                    </strong>{" "}
                    unit.
                  </p>
                </div>
              </div>

              {/* Summary of submitted data */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Submitted Information Summary
                  </h4>
                  <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                    <Clock className="size-3" />
                    Pending Verification
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                  <div className="flex flex-col border-b border-zinc-800/80 pb-2 sm:border-0 sm:pb-0">
                    <span className="text-xs text-zinc-400">Account Name</span>
                    <span className="font-medium text-white mt-0.5 break-words">
                      {submittedData.name}
                    </span>
                  </div>

                  <div className="flex flex-col border-b border-zinc-800/80 pb-2 sm:border-0 sm:pb-0">
                    <span className="text-xs text-zinc-400">Phone Number</span>
                    <span className="font-medium text-white mt-0.5 font-mono">
                      {submittedData.phoneNumber}
                    </span>
                  </div>

                  <div className="flex flex-col border-b border-zinc-800/80 pb-2 sm:border-0 sm:pb-0">
                    <span className="text-xs text-zinc-400">Unit Type</span>
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 mt-0.5">
                      {submittedData.unitType}
                    </span>
                  </div>

                  <div className="flex flex-col border-b border-zinc-800/80 pb-2 sm:border-0 sm:pb-0">
                    <span className="text-xs text-zinc-400">Account Number</span>
                    <span className="font-medium text-white mt-0.5 font-mono text-emerald-400 break-all">
                      {submittedData.receiverNumber}
                    </span>
                  </div>

                  <div className="flex flex-col sm:col-span-2 border-b border-zinc-800/80 pb-2 sm:border-0 sm:pb-0">
                    <span className="text-xs text-zinc-400">Complete Address</span>
                    <span className="font-medium text-white mt-0.5 whitespace-pre-wrap break-words">
                      {submittedData.address}
                    </span>
                  </div>

                  {/* Payment Details in Summary */}
                  <div className="flex flex-col border-b border-zinc-800/80 pb-2 sm:border-0 sm:pb-0">
                    <span className="text-xs text-zinc-400">Payment Destination</span>
                    <span className="font-mono text-white text-xs mt-0.5">
                      GCash ({ADMIN_GCASH_NUMBER})
                    </span>
                  </div>

                  <div className="flex flex-col border-b border-zinc-800/80 pb-2 sm:border-0 sm:pb-0">
                    <span className="text-xs text-zinc-400">Payment Amount</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-bold text-emerald-400 font-mono">
                        {submittedData.paymentAmount}
                      </span>
                      {submittedData.packageDescription && (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold border ${
                            submittedData.packageDescription === "All Channels"
                              ? "border-emerald-500/40 bg-emerald-950/80 text-emerald-300"
                              : "border-zinc-700 bg-zinc-800/80 text-zinc-300"
                          }`}
                        >
                          {submittedData.packageDescription}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:col-span-2">
                    <span className="text-xs text-zinc-400">GCash Reference Number</span>
                    <span className="font-medium text-white mt-0.5 font-mono text-emerald-400 break-all">
                      {submittedData.gcashReferenceNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Prototype Confirmation Note */}
              <p className="text-center text-xs text-zinc-400 italic">
                Note: This frontend prototype validates locally and syncs to the Admin Dashboard. Payment status is marked as pending verification.
              </p>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
                <Link href="/admin" className="w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full sm:w-auto cursor-pointer border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 h-10"
                  >
                    <LayoutDashboard className="mr-2 size-4" />
                    View in Admin Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="w-full sm:w-auto cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 h-10"
                >
                  <Pencil className="mr-2 size-4" />
                  Edit Information
                </Button>
                <Button
                  onClick={handleReset}
                  className="w-full sm:w-auto cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] h-10"
                >
                  <RotateCcw className="mr-2 size-4" />
                  Submit Another Request
                </Button>
              </div>
            </div>
          ) : (
            /* Information Form */
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* 1. Account Name */}
                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="name" className="text-sm font-medium text-zinc-200">
                    <span className="flex items-center gap-1.5">
                      <User className="size-3.5 text-zinc-400" />
                      Account Name <span className="text-red-400 font-bold">*</span>
                    </span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g. Juan Dela Cruz"
                    value={formData.name}
                    onChange={(e) => handleTextChange("name", e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={`h-10 text-base sm:text-sm bg-zinc-950/70 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500 ${
                      errors.name ? "border-red-500 focus-visible:ring-red-500/30" : ""
                    }`}
                  />
                  {errors.name && (
                    <p
                      id="name-error"
                      role="alert"
                      className="flex items-center gap-1 text-xs text-red-400 font-medium"
                    >
                      <AlertCircle className="size-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* 2. Phone Number */}
                <div className="space-y-2 sm:col-span-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="phoneNumber" className="text-sm font-medium text-zinc-200">
                      <span className="flex items-center gap-1.5">
                        <Phone className="size-3.5 text-zinc-400" />
                        Phone Number <span className="text-red-400 font-bold">*</span>
                      </span>
                    </Label>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {formData.phoneNumber.length}/11
                    </span>
                  </div>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    inputMode="numeric"
                    placeholder="e.g. 09171234567"
                    value={formData.phoneNumber}
                    onKeyDown={handleNumericKeyDown}
                    onChange={(e) => handleNumericChange("phoneNumber", e.target.value)}
                    onPaste={(e) => handleNumericPaste("phoneNumber", e)}
                    aria-invalid={!!errors.phoneNumber}
                    aria-describedby={
                      errors.phoneNumber ? "phone-error" : "phone-help"
                    }
                    className={`h-10 text-base sm:text-sm font-mono bg-zinc-950/70 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500 ${
                      errors.phoneNumber
                        ? "border-red-500 focus-visible:ring-red-500/30"
                        : ""
                    }`}
                  />
                  <p id="phone-help" className="text-[11px] text-zinc-400">
                    Exactly 11 digits (digits only, e.g. 09171234567)
                  </p>
                  {errors.phoneNumber && (
                    <p
                      id="phone-error"
                      role="alert"
                      className="flex items-center gap-1 text-xs text-red-400 font-medium"
                    >
                      <AlertCircle className="size-3.5 shrink-0" />
                      <span>{errors.phoneNumber}</span>
                    </p>
                  )}
                </div>

                {/* 3. Unit Type (Satellite, GSat, Fili TV, Sky Direct, Signal) */}
                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="unitType" className="text-sm font-medium text-zinc-200">
                    <span className="flex items-center gap-1.5">
                      <Tv className="size-3.5 text-zinc-400" />
                      Unit Type <span className="text-red-400 font-bold">*</span>
                    </span>
                  </Label>
                  <Select
                    value={formData.unitType}
                    onValueChange={(val) => handleUnitTypeChange(val ?? "")}
                  >
                    <SelectTrigger
                      id="unitType"
                      aria-label="Unit Type"
                      aria-invalid={!!errors.unitType}
                      aria-describedby={
                        errors.unitType ? "unittype-error" : undefined
                      }
                      className={`h-10 w-full text-base sm:text-sm bg-zinc-950/70 border-zinc-800 text-white focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500 ${
                        errors.unitType
                          ? "border-red-500 focus-visible:ring-red-500/30"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder="Select receiver unit type" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                      <SelectItem value="Satellite">Satellite (6 digits)</SelectItem>
                      <SelectItem value="GSat">GSat (16 digits)</SelectItem>
                      <SelectItem value="Fili TV">Fili TV (16 digits)</SelectItem>
                      <SelectItem value="Sky Direct">Sky Direct (13 digits)</SelectItem>
                      <SelectItem value="Signal">Signal (9 digits)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.unitType && (
                    <p
                      id="unittype-error"
                      role="alert"
                      className="flex items-center gap-1 text-xs text-red-400 font-medium"
                    >
                      <AlertCircle className="size-3.5 shrink-0" />
                      <span>{errors.unitType}</span>
                    </p>
                  )}
                </div>

                {/* 4. Account Number */}
                <div className="space-y-2 sm:col-span-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="receiverNumber" className="text-sm font-medium text-zinc-200">
                      <span className="flex items-center gap-1.5">
                        <Hash className="size-3.5 text-zinc-400" />
                        Account Number <span className="text-red-400 font-bold">*</span>
                      </span>
                    </Label>
                    {receiverReqLength && (
                      <span
                        className={`text-[11px] font-mono ${
                          formData.receiverNumber.length === receiverReqLength
                            ? "text-emerald-400 font-semibold"
                            : "text-zinc-500"
                        }`}
                      >
                        {formData.receiverNumber.length}/{receiverReqLength}
                      </span>
                    )}
                  </div>
                  <Input
                    id="receiverNumber"
                    name="receiverNumber"
                    type="text"
                    inputMode="numeric"
                    maxLength={receiverReqLength ?? 16}
                    placeholder={
                      formData.unitType === "Satellite"
                        ? "e.g. 123456 (6 digits)"
                        : formData.unitType === "GSat" || formData.unitType === "Fili TV"
                        ? "e.g. 0254889102145678 (16 digits)"
                        : formData.unitType === "Sky Direct"
                        ? "e.g. 1234567890123 (13 digits)"
                        : formData.unitType === "Signal"
                        ? "e.g. 123456789 (9 digits)"
                        : "Select Unit Type first"
                    }
                    value={formData.receiverNumber}
                    onKeyDown={handleNumericKeyDown}
                    onChange={(e) =>
                      handleNumericChange(
                        "receiverNumber",
                        e.target.value,
                        false,
                        receiverReqLength ?? 16
                      )
                    }
                    onPaste={(e) =>
                      handleNumericPaste(
                        "receiverNumber",
                        e,
                        receiverReqLength ?? 16
                      )
                    }
                    aria-invalid={!!errors.receiverNumber}
                    aria-describedby={
                      errors.receiverNumber ? "receiver-error" : "receiver-help"
                    }
                    className={`h-10 text-base sm:text-sm font-mono bg-zinc-950/70 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500 ${
                      errors.receiverNumber
                        ? "border-red-500 focus-visible:ring-red-500/30"
                        : ""
                    }`}
                  />
                  <div id="receiver-help" className="text-[11px] text-zinc-400">
                    {receiverReqLength
                      ? `Required: exactly ${receiverReqLength} digits for ${formData.unitType}`
                      : "Required digits: Satellite (6), GSat (16), Fili TV (16), Sky Direct (13), Signal (9)"}
                  </div>
                  {errors.receiverNumber && (
                    <p
                      id="receiver-error"
                      role="alert"
                      className="flex items-center gap-1 text-xs text-red-400 font-medium"
                    >
                      <AlertCircle className="size-3.5 shrink-0" />
                      <span>{errors.receiverNumber}</span>
                    </p>
                  )}
                </div>

                {/* 5. Address (Textarea) */}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address" className="text-sm font-medium text-zinc-200">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-zinc-400" />
                      Address <span className="text-red-400 font-bold">*</span>
                    </span>
                  </Label>
                  <Textarea
                    id="address"
                    name="address"
                    rows={3}
                    placeholder="Enter complete address (House/Unit No., Street, Barangay, City, Province)"
                    value={formData.address}
                    onChange={(e) => handleTextChange("address", e.target.value)}
                    aria-invalid={!!errors.address}
                    aria-describedby={
                      errors.address ? "address-error" : undefined
                    }
                    className={`min-h-[88px] text-base sm:text-sm bg-zinc-950/70 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500 ${
                      errors.address
                        ? "border-red-500 focus-visible:ring-red-500/30"
                        : ""
                    }`}
                  />
                  {errors.address && (
                    <p
                      id="address-error"
                      role="alert"
                      className="flex items-center gap-1 text-xs text-red-400 font-medium"
                    >
                      <AlertCircle className="size-3.5 shrink-0" />
                      <span>{errors.address}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* 6. GCash-Only Payment Section */}
              <div className="pt-5 border-t border-zinc-800/80 space-y-5">
                {/* Section Header with Fixed Badge */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Wallet className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        GCash Payment Section
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Payment method is fixed to GCash only.
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-300">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>GCash Only</span>
                  </div>
                </div>

                {/* 1. Admin GCash Number (Fixed Payment Destination) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-4 backdrop-blur-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                        Admin GCash Number
                      </span>
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.2 text-[10px] font-semibold text-emerald-300">
                        Fixed Destination
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-white">
                      {ADMIN_GCASH_NUMBER}
                    </div>
                    <p className="text-xs text-zinc-400">
                      Send your exact reload payment amount to this GCash destination.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyAdminNumber}
                    className="self-stretch sm:self-auto w-full sm:w-auto cursor-pointer border-emerald-500/40 bg-emerald-900/40 hover:bg-emerald-800/50 text-emerald-300 hover:text-white transition-colors h-9"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-1.5 size-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1.5 size-3.5" />
                        <span>Copy Number</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* 4. Payment Instructions */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    <Info className="size-4" />
                    <span>Payment Instructions</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-300 leading-relaxed">
                    <li>
                      Send the selected amount to the admin&apos;s GCash number:{" "}
                      <strong className="text-emerald-300 font-mono font-semibold">
                        {ADMIN_GCASH_NUMBER}
                      </strong>
                      .
                    </li>
                    <li>
                      For <strong className="text-white">GSat</strong>, choose the package carefully: only{" "}
                      <strong className="text-emerald-300 font-semibold">₱550</strong> includes{" "}
                      <strong className="text-emerald-300 underline underline-offset-2">All Channels</strong>;{" "}
                      <strong className="text-white">₱150</strong> and{" "}
                      <strong className="text-white">₱250</strong> are{" "}
                      <strong className="text-zinc-200">Regular Load only</strong>.
                    </li>
                    <li>Complete the GCash transaction.</li>
                    <li>Copy the reference number from the transaction receipt.</li>
                    <li>Paste the reference number into the form.</li>
                    <li>Submit the information.</li>
                  </ol>
                </div>

                {/* Security Warning Notice */}
                <div className="flex items-start gap-2.5 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-xs text-zinc-400">
                  <ShieldCheck className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-200">Security Notice: </span>
                    <span>
                      Never enter or share your GCash MPIN, password, or OTP. Paload ko will never ask for your MPIN or confidential verification codes.
                    </span>
                  </div>
                </div>

                {/* 2 & 3. Payment Amount Dropdown & GCash Reference Number */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Payment Amount Dropdown */}
                  <div className="space-y-2 sm:col-span-1">
                    <Label
                      htmlFor="paymentAmount"
                      className="text-sm font-medium text-zinc-200"
                    >
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="size-3.5 text-zinc-400" />
                        Payment Amount <span className="text-red-400 font-bold">*</span>
                      </span>
                    </Label>
                    <Select
                      value={formData.paymentAmount}
                      onValueChange={(val) => handlePaymentAmountChange(val ?? "")}
                      disabled={!formData.unitType}
                    >
                      <SelectTrigger
                        id="paymentAmount"
                        aria-label="Payment Amount"
                        aria-invalid={!!errors.paymentAmount}
                        aria-describedby={
                          errors.paymentAmount ? "amount-error" : "amount-help"
                        }
                        className={`h-10 w-full text-base sm:text-sm bg-zinc-950/70 border-zinc-800 text-white focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500 ${
                          errors.paymentAmount
                            ? "border-red-500 focus-visible:ring-red-500/30"
                            : ""
                        } ${!formData.unitType ? "opacity-60 cursor-not-allowed" : ""}`}
                      >
                        <SelectValue
                          placeholder={
                            formData.unitType
                              ? `Select ${formData.unitType} amount`
                              : "Select Unit Type first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        {(UNIT_PAYMENT_OPTIONS[formData.unitType] || []).map(
                          (opt) => (
                            <SelectItem key={opt.amount} value={opt.amount}>
                              {opt.label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <p id="amount-help" className="text-[11px] text-zinc-400">
                      {formData.unitType === "GSat"
                        ? "Note: Only ₱550 includes All Channels; ₱150 & ₱250 are Regular Load."
                        : formData.unitType
                        ? `Available packages for ${formData.unitType}`
                        : "Select a Unit Type above to view payment choices."}
                    </p>
                    {errors.paymentAmount && (
                      <p
                        id="amount-error"
                        role="alert"
                        className="flex items-center gap-1 text-xs text-red-400 font-medium"
                      >
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>{errors.paymentAmount}</span>
                      </p>
                    )}
                  </div>

                  {/* GCash Reference Number */}
                  <div className="space-y-2 sm:col-span-1">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="gcashReferenceNumber"
                        className="text-sm font-medium text-zinc-200"
                      >
                        <span className="flex items-center gap-1.5">
                          <Hash className="size-3.5 text-zinc-400" />
                          GCash Reference Number{" "}
                          <span className="text-red-400 font-bold">*</span>
                        </span>
                      </Label>
                      {formData.gcashReferenceNumber && (
                        <span className="text-[11px] text-emerald-400 font-mono">
                          {formData.gcashReferenceNumber.length} digits
                        </span>
                      )}
                    </div>
                    <Input
                      id="gcashReferenceNumber"
                      name="gcashReferenceNumber"
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 100238491823"
                      value={formData.gcashReferenceNumber}
                      onKeyDown={handleNumericKeyDown}
                      onChange={(e) =>
                        handleNumericChange(
                          "gcashReferenceNumber",
                          e.target.value
                        )
                      }
                      onPaste={(e) =>
                        handleNumericPaste("gcashReferenceNumber", e)
                      }
                      aria-invalid={!!errors.gcashReferenceNumber}
                      aria-describedby={
                        errors.gcashReferenceNumber
                          ? "ref-error"
                          : "ref-help"
                      }
                      className={`h-10 text-base sm:text-sm font-mono bg-zinc-950/70 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500 ${
                        errors.gcashReferenceNumber
                          ? "border-red-500 focus-visible:ring-red-500/30"
                          : ""
                      }`}
                    />
                    <p id="ref-help" className="text-[11px] text-zinc-400">
                      Please enter or paste the reference number from your GCash transaction receipt after sending payment.
                    </p>
                    {errors.gcashReferenceNumber && (
                      <p
                        id="ref-error"
                        role="alert"
                        className="flex items-center gap-1 text-xs text-red-400 font-medium"
                      >
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>{errors.gcashReferenceNumber}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-zinc-800/80">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="w-full sm:w-auto cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 h-10"
                >
                  <RotateCcw className="mr-2 size-4" />
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] h-10"
                >
                  <Send className="mr-2 size-4" />
                  Submit Information
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 1. Modern Submission Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100%-1.5rem)] max-w-md border-zinc-800 bg-zinc-950/95 text-zinc-100 shadow-[0_0_50px_rgba(16,185,129,0.15)] p-4 sm:p-6 max-h-[88dvh] overflow-y-auto overscroll-contain">
          <DialogHeader className="items-center text-center sm:items-start sm:text-left gap-2 sm:gap-3">
            <div className="flex size-11 sm:size-12 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] shrink-0">
              <CheckCircle2 className="size-6 text-emerald-400" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Submission Received
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-400 mt-1">
                Your reload request and GCash payment reference have been received.
              </DialogDescription>
            </div>
          </DialogHeader>

          {submittedRecord && (
            <div className="my-2 space-y-3 rounded-xl border border-zinc-800/90 bg-zinc-900/70 p-3.5 sm:p-4 text-xs">
              {/* Payment Status (Pending Verification) */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                <span className="text-zinc-400 text-xs">Payment Status</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-950/60 px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-amber-300">
                  <Clock className="size-3" />
                  Pending Verification
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                <div>
                  <span className="text-[11px] text-zinc-400 block">Account Number</span>
                  <span className="font-mono font-semibold text-emerald-400 mt-0.5 block text-xs sm:text-sm break-all">
                    {submittedRecord.receiverNumber}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-zinc-400 block">Unit Type</span>
                  <span className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-xs font-medium text-white mt-0.5">
                    {submittedRecord.unitType}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-zinc-400 block">Payment Amount</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono font-bold text-white text-xs sm:text-sm">
                      {submittedRecord.paymentAmount}
                    </span>
                    {submittedRecord.packageDescription && (
                      <span className="rounded bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.2 text-[10px] text-emerald-300 font-semibold">
                        {submittedRecord.packageDescription}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-zinc-400 block">GCash Ref No.</span>
                  <span className="font-mono text-zinc-200 mt-0.5 block font-semibold text-xs sm:text-sm break-all">
                    {submittedRecord.gcashReferenceNumber}
                  </span>
                </div>

                <div className="sm:col-span-2 border-t border-zinc-800/60 pt-2">
                  <span className="text-[11px] text-zinc-400 block">Submission Date &amp; Time</span>
                  <span className="text-zinc-300 mt-0.5 block font-mono text-[11px] break-words">
                    {submittedRecord.submittedAt}
                  </span>
                </div>
              </div>
            </div>
          )}

          <p className="text-[11px] text-zinc-400 italic text-center">
            Note: Payment is pending admin verification. Submission is recorded for this session.
          </p>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2 border-t border-zinc-800/80 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                const el = document.getElementById("submission-history");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto cursor-pointer border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 h-10"
            >
              <History className="mr-1.5 size-3.5" />
              View in History
            </Button>
            <Button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="w-full sm:w-auto cursor-pointer font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.35)] h-10"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
