"use client";

import React, { createContext, useContext, useState, useMemo } from "react";

export type Language = "en" | "ceb";

export interface ArchiveUiTranslations {
  archiveBtn: string;
  softDeleteBtn: string;
  deleteBtn: string;
  restoreBtn: string;
  viewActiveTab: string;
  viewArchivedTab: (count: number) => string;
  archivedSectionTitle: string;
  archivedSectionSub: string;
  archivedEmptyTitle: string;
  archivedEmptyBody: string;
  uiPreviewBadge: string;
  uiPreviewNotice: string;
  softDeletedBadge: string;
  archivedBadge: string;
  activeBadge: string;
  confirmDialog: {
    archiveTitle: string;
    archiveDesc: string;
    softDeleteTitle: string;
    softDeleteDesc: string;
    restoreTitle: string;
    restoreDesc: string;
    deleteTitle: string;
    deleteDesc: string;
    warningNote: string;
    deleteWarningNote: string;
    customerLabel: string;
    accountLabel: string;
    unitLabel: string;
    amountLabel: string;
    cancelBtn: string;
    confirmArchiveBtn: string;
    confirmSoftDeleteBtn: string;
    confirmRestoreBtn: string;
    confirmDeleteBtn: string;
  };
}

export interface Translations {
  nav: {
    portalSubtitle: string;
    prototype: string;
    history: string;
    admin: string;
    enterInfoDesktop: string;
    enterInfoMobile: string;
    userPovForm: string;
    userPovMobile: string;
    adminBadge: string;
    adminSubtitle: string;
  };
  hero: {
    pill: string;
    headline: string;
    descriptionWelcome: string;
    descriptionBrand: string;
    descriptionBody: string;
    fillButton: string;
    supportedUnitsTitle: string;
  };
  form: {
    stepBadge: string;
    formTitle: string;
    formSubtitle: string;
    prototypeNoticeTitle: string;
    prototypeNoticeBody: string;
    accountNameLabel: string;
    accountNamePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    phoneHelp: string;
    unitTypeLabel: string;
    unitTypePlaceholder: string;
    accountNumberLabel: string;
    accountNumberHelpGeneral: string;
    accountNumberHelpSpecific: (req: number, unit: string) => string;
    accountNumberPlaceholder: (unit: string) => string;
    addressLabel: string;
    addressPlaceholder: string;
    noteLabel: string;
    notePlaceholder: string;
    noNoteProvided: string;
    gcashSectionTitle: string;
    gcashSectionSubtitle: string;
    gcashOnlyBadge: string;
    adminGcashNumberLabel: string;
    recipientBadge: string;
    adminGcashSubtext: string;
    copyNumberBtn: string;
    copiedNumberBtn: string;
    selectedAmountLabel: string;
    sendExactPrompt: (amount: string) => string;
    selectAmountPrompt: string;
    sendToAdminLabel: string;
    paymentInstructionsTitle: string;
    step1: string;
    step2Prefix: string;
    step2Amount: (amount?: string) => string;
    step2AdminPrompt: string;
    step2GsatNotice: string;
    step3: string;
    step4: string;
    step5: string;
    step6: string;
    securityNoticeTitle: string;
    securityNoticeBody: string;
    paymentAmountLabel: string;
    paymentAmountPlaceholder: (unit?: string) => string;
    paymentAmountHelpGsat: string;
    paymentAmountHelpUnit: (unit: string) => string;
    paymentAmountHelpEmpty: string;
    gcashRefLabel: string;
    gcashRefPlaceholder: string;
    gcashRefHelp: string;
    digitsLabel: string;
    clearFormBtn: string;
    submitBtn: string;
    submittingBtn: string;
    validation: {
      accountNameRequired: string;
      accountNameMin: string;
      phoneRequired: string;
      phoneDigitsOnly: string;
      phoneInvalidLength: string;
      unitTypeRequired: string;
      unitTypeInvalid: string;
      receiverRequired: string;
      receiverDigitsOnly: string;
      receiverSelectUnitFirst: string;
      receiverInvalidLength: (unit: string, req: number, cur: number) => string;
      receiverExactLength: (unit: string, req: number) => string;
      addressRequired: string;
      addressMin: string;
      amountRequired: string;
      amountInvalid: (unit: string) => string;
      refRequired: string;
      refDigitsOnly: string;
    };
    summary: {
      successTitle: string;
      successMessage: (unit: string) => string;
      summaryHeading: string;
      pendingVerification: string;
      accountName: string;
      phoneNumber: string;
      unitType: string;
      accountNumber: string;
      address: string;
      note: string;
      paymentDestination: string;
      paymentAmount: string;
      gcashRef: string;
      prototypeNote: string;
      viewAdminBtn: string;
      editInfoBtn: string;
      submitAnotherBtn: string;
    };
    modal: {
      title: string;
      description: string;
      paymentStatus: string;
      pendingVerification: string;
      accountNumber: string;
      unitType: string;
      paymentAmount: string;
      gcashRef: string;
      submittedAt: string;
      footnote: string;
      viewInHistory: string;
      done: string;
    };
  };
  history: {
    sessionLogBadge: string;
    title: string;
    subtitle: string;
    returnToForm: string;
    temporaryNoticeTitle: string;
    temporaryNoticeBody: string;
    submittedRequestsTitle: string;
    recordCount: (count: number) => string;
    adminViewLink: string;
    emptyTitle: string;
    emptyBody: string;
    fillOutButton: string;
    table: {
      accountName: string;
      unitType: string;
      accountNumber: string;
      paymentAmount: string;
      gcashRef: string;
      submittedAt: string;
      paymentStatus: string;
    };
    mobile: {
      accountName: string;
      accountNumber: string;
      paymentAmount: string;
      gcashRef: string;
      status: string;
      dateTime: string;
    };
    pendingStatus: string;
    doneStatus: string;
    archiveUi: ArchiveUiTranslations;
  };
  auth: {
    registrationSuccessTitle: string;
    registrationSuccessMessage: string;
    registrationSuccessVerificationRequired: string;
    continueBtn: string;
    okBtn: string;
    signInToViewHistory: string;
    signInPromptMessage: string;
    loadingHistory: string;
  };
  admin: {
    liveBadge: string;
    title: string;
    subtitle: string;
    clearSubmissionsBtn: string;
    refreshDataBtn: string;
    noticeTitle: string;
    noticeBody: string;
    totalSubmissionsTitle: string;
    totalSubmissionsSub: string;
    pendingCountTitle: string;
    pendingCountSub: (count: number) => string;
    doneCountTitle: string;
    doneCountSub: (count: number) => string;
    realtimeCardTitle: string;
    realtimeCardSub: string;
    testUserPovBtn: string;
    tableCardTitle: string;
    tableCardSub: string;
    searchPlaceholder: string;
    clearSearch: string;
    clearSearchBtn: string;
    noSearchResultsTitle: string;
    noSearchResultsBody: (query: string) => string;
    showingResults: (matching: number, total: number) => string;
    filterLabel: string;
    filterAll: string;
    filterPending: string;
    filterDone: string;
    submissionCount: (count: number) => string;
    emptyTitle: string;
    emptyBody: string;
    goToUserPovBtn: string;
    table: {
      accountName: string;
      phoneNumber: string;
      unitType: string;
      accountNumber: string;
      paymentGcash: string;
      address: string;
      note: string;
      submittedAt: string;
      action: string;
    };
    mobile: {
      accountName: string;
      accountNumber: string;
      time: string;
      paymentGcash: string;
      address: string;
      note: string;
    };
    noNoteProvided: string;
    pendingStatus: string;
    doneStatus: string;
    markAsDoneBtn: string;
    completedBadge: string;
    archiveUi: ArchiveUiTranslations;
    footerTitle: string;
    footerSubtitle: string;
  };
  footer: {
    brandSubtitle: string;
    disclaimer: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      portalSubtitle: "TV & Satellite Reload Portal",
      prototype: "Prototype",
      history: "History",
      admin: "Admin",
      enterInfoDesktop: "Enter Information",
      enterInfoMobile: "Reload",
      userPovForm: "User POV Form",
      userPovMobile: "User POV",
      adminBadge: "Admin",
      adminSubtitle: "System Administration Dashboard",
    },
    hero: {
      pill: "Simple & Direct Receiver Information Portal",
      headline: "Fast & Easy Reloading for Your TV & Satellite Receivers",
      descriptionWelcome: "Welcome to",
      descriptionBrand: "Paload ko",
      descriptionBody:
        ". Provide your receiver details in a few quick steps. We support Satellite, GSat, Fili TV, Sky Direct, and Signal units for a hassle-free reloading experience.",
      fillButton: "Fill Out Information",
      supportedUnitsTitle: "Supported Unit Types",
    },
    form: {
      stepBadge: "Step 1: Enter Details & Payment",
      formTitle: "User Information Form",
      formSubtitle:
        "Please fill in your contact information, receiver unit details, and GCash payment info below.",
      prototypeNoticeTitle: "Prototype Notice",
      prototypeNoticeBody:
        "This form is an interactive frontend prototype for Paload ko. Input will be validated locally and synced to the Admin Dashboard. No personal information is saved to an external database.",
      accountNameLabel: "Account Name",
      accountNamePlaceholder: "e.g. Juan Dela Cruz",
      phoneLabel: "Phone Number",
      phonePlaceholder: "e.g. 09171234567",
      phoneHelp: "Exactly 11 digits (digits only, e.g. 09171234567)",
      unitTypeLabel: "Unit Type",
      unitTypePlaceholder: "Select receiver unit type",
      accountNumberLabel: "Account Number",
      accountNumberHelpGeneral:
        "Required digits: Satellite (6), GSat (16), Fili TV (16), Sky Direct (13), Signal (9)",
      accountNumberHelpSpecific: (req: number, unit: string) =>
        `Required: exactly ${req} digits for ${unit}`,
      accountNumberPlaceholder: (unit: string) => {
        if (unit === "Satellite") return "e.g. 123456 (6 digits)";
        if (unit === "GSat" || unit === "Fili TV")
          return "e.g. 0254889102145678 (16 digits)";
        if (unit === "Sky Direct") return "e.g. 1234567890123 (13 digits)";
        if (unit === "Signal") return "e.g. 123456789 (9 digits)";
        return "Select Unit Type first";
      },
      addressLabel: "Address",
      addressPlaceholder:
        "Enter complete address (House/Unit No., Street, Barangay, City, Province)",
      noteLabel: "Note (Optional)",
      notePlaceholder: "Add any additional instructions or details here...",
      noNoteProvided: "No note provided",
      gcashSectionTitle: "GCash Payment Section",
      gcashSectionSubtitle: "Payment method is fixed to GCash only.",
      gcashOnlyBadge: "GCash Only",
      adminGcashNumberLabel: "Admin GCash Number",
      recipientBadge: "Recipient",
      adminGcashSubtext:
        "Official receiving GCash account for customer reload payments.",
      copyNumberBtn: "Copy Number",
      copiedNumberBtn: "Copied Number!",
      selectedAmountLabel: "Selected Package Amount",
      sendExactPrompt: (amount: string) =>
        `Send exactly ${amount} via GCash to complete reloading.`,
      selectAmountPrompt:
        "Select your Unit Type & Payment Amount below to view the total to send.",
      sendToAdminLabel: "Send to Admin:",
      paymentInstructionsTitle: "Payment Instructions",
      step1: "Open your GCash app and select Express Send.",
      step2Prefix: "Send",
      step2Amount: (amount?: string) =>
        amount ? `the exact amount of ${amount}` : "the selected amount",
      step2AdminPrompt: "to the admin's GCash number:",
      step2GsatNotice:
        "For GSat, choose the package carefully: only ₱550 includes All Channels; ₱150 and ₱250 are Regular Load only.",
      step3: "Complete the GCash transaction.",
      step4: "Copy the reference number from the transaction receipt.",
      step5: "Paste the reference number into the form.",
      step6: "Submit the information.",
      securityNoticeTitle: "Security Notice:",
      securityNoticeBody:
        "Never enter or share your GCash MPIN, password, or OTP. Paload ko will never ask for your MPIN or confidential verification codes.",
      paymentAmountLabel: "Payment Amount",
      paymentAmountPlaceholder: (unit?: string) =>
        unit ? `Select ${unit} amount` : "Select Unit Type first",
      paymentAmountHelpGsat:
        "Note: Only ₱550 includes All Channels; ₱150 & ₱250 are Regular Load.",
      paymentAmountHelpUnit: (unit: string) => `Available packages for ${unit}`,
      paymentAmountHelpEmpty:
        "Select a Unit Type above to view payment choices.",
      gcashRefLabel: "GCash Reference Number",
      gcashRefPlaceholder: "e.g. 100238491823",
      gcashRefHelp:
        "Please enter or paste the reference number from your GCash transaction receipt after sending payment.",
      digitsLabel: "digits",
      clearFormBtn: "Clear Form",
      submitBtn: "Submit Information",
      submittingBtn: "Submitting...",
      validation: {
        accountNameRequired: "Account name is required.",
        accountNameMin: "Account name must be at least 2 characters.",
        phoneRequired: "Phone number is required.",
        phoneDigitsOnly: "Phone number must contain digits only.",
        phoneInvalidLength:
          "Phone number must be exactly 11 digits (e.g. 09171234567).",
        unitTypeRequired: "Please select a unit type from the dropdown.",
        unitTypeInvalid:
          "Unit type must be Satellite, GSat, Fili TV, Sky Direct, or Signal.",
        receiverRequired: "Receiver number is required.",
        receiverDigitsOnly: "Receiver number must contain digits only.",
        receiverSelectUnitFirst: "Please select a Unit Type first.",
        receiverInvalidLength: (unit: string, req: number, cur: number) =>
          `Receiver number for ${unit} must be exactly ${req} digits (currently ${cur} digits).`,
        receiverExactLength: (unit: string, req: number) =>
          `Receiver number for ${unit} must be exactly ${req} digits.`,
        addressRequired: "Complete address is required.",
        addressMin: "Please provide a complete and specific address.",
        amountRequired: "Please select a payment amount.",
        amountInvalid: (unit: string) =>
          `Selected amount is invalid for ${unit || "selected unit"}.`,
        refRequired: "GCash reference number is required.",
        refDigitsOnly: "GCash reference number must contain digits only.",
      },
      summary: {
        successTitle: "Request Submitted for Verification!",
        successMessage: (unit: string) =>
          `Your details and GCash payment reference have been submitted and are pending admin verification for your ${unit} unit.`,
        summaryHeading: "Submitted Information Summary",
        pendingVerification: "Pending Verification",
        accountName: "Account Name",
        phoneNumber: "Phone Number",
        unitType: "Unit Type",
        accountNumber: "Account Number",
        address: "Complete Address",
        note: "Note",
        paymentDestination: "Payment Destination",
        paymentAmount: "Payment Amount",
        gcashRef: "GCash Reference Number",
        prototypeNote:
          "Note: This frontend prototype validates locally and syncs to the Admin Dashboard. Payment status is marked as pending verification.",
        viewAdminBtn: "View in Admin Dashboard",
        editInfoBtn: "Edit Information",
        submitAnotherBtn: "Submit Another Request",
      },
      modal: {
        title: "Submission Received",
        description:
          "Your reload request and GCash payment reference have been received.",
        paymentStatus: "Payment Status",
        pendingVerification: "Pending Verification",
        accountNumber: "Account Number",
        unitType: "Unit Type",
        paymentAmount: "Payment Amount",
        gcashRef: "GCash Ref No.",
        submittedAt: "Submission Date & Time",
        footnote:
          "Note: Payment is pending admin verification. Submission is recorded for this session.",
        viewInHistory: "View in History",
        done: "Done",
      },
    },
    history: {
      sessionLogBadge: "Session Log",
      title: "Submission History",
      subtitle:
        "Review and track reload requests submitted from your authenticated customer account.",
      returnToForm: "Return to Submission Form",
      temporaryNoticeTitle: "Account-Linked History",
      temporaryNoticeBody:
        "Your reload requests and payment references are securely saved in Supabase and associated with your authenticated account. Your records remain permanently accessible across sessions and devices.",
      submittedRequestsTitle: "Your Submitted Requests",
      recordCount: (count: number) =>
        `${count} ${count === 1 ? "record" : "records"}`,
      adminViewLink: "Admin View",
      emptyTitle: "No submission history yet",
      emptyBody:
        "Once you fill out and submit your receiver information and GCash payment reference, your request will appear here.",
      fillOutButton: "Fill Out Information",
      table: {
        accountName: "Account Name",
        unitType: "Unit Type",
        accountNumber: "Account Number",
        paymentAmount: "Payment Amount",
        gcashRef: "GCash Ref No.",
        submittedAt: "Submission Date & Time",
        paymentStatus: "Payment Status",
      },
      mobile: {
        accountName: "Account Name",
        accountNumber: "Account Number",
        paymentAmount: "Payment Amount",
        gcashRef: "GCash Ref No.",
        status: "Status",
        dateTime: "Date & Time",
      },
      pendingStatus: "Pending Verification",
      doneStatus: "Done",
      archiveUi: {
        archiveBtn: "Archive",
        softDeleteBtn: "Archive",
        deleteBtn: "Delete",
        restoreBtn: "Restore",
        viewActiveTab: "Active Submissions",
        viewArchivedTab: (count: number) => `Archived (${count})`,
        archivedSectionTitle: "Archived Submissions",
        archivedSectionSub:
          "Review reload submissions that have been archived. Archived records do not count toward active submission statistics.",
        archivedEmptyTitle: "No archived submissions yet",
        archivedEmptyBody:
          "You can archive your reload requests using the Archive button on any record above.",
        uiPreviewBadge: "Live Database",
        uiPreviewNotice:
          "Record updated in Supabase database.",
        softDeletedBadge: "Archived",
        archivedBadge: "Archived",
        activeBadge: "Active",
        confirmDialog: {
          archiveTitle: "Archive Submission",
          archiveDesc:
            "This will move the selected submission to your Archived section. It can be restored at any time.",
          softDeleteTitle: "Archive Submission",
          softDeleteDesc:
            "This moves the submission to the archived section without permanently deleting it.",
          restoreTitle: "Restore Submission",
          restoreDesc:
            "This reactivates this submission back into your primary active submissions list.",
          deleteTitle: "Permanently Delete Record",
          deleteDesc:
            "This will permanently remove this submission from the database. This action cannot be undone.",
          warningNote:
            "Notice: Changes are saved to your authenticated account in Supabase.",
          deleteWarningNote:
            "Warning: This will permanently delete this record from the database.",
          customerLabel: "Customer Name",
          accountLabel: "Account Number",
          unitLabel: "Unit Type",
          amountLabel: "Payment Amount",
          cancelBtn: "Cancel",
          confirmArchiveBtn: "Confirm Archive",
          confirmSoftDeleteBtn: "Confirm Archive",
          confirmRestoreBtn: "Confirm Restore",
          confirmDeleteBtn: "Delete Permanently",
        },
      },
    },
    admin: {
      liveBadge: "Live Management",
      title: "Admin Dashboard",
      subtitle:
        "Connected live to Supabase PostgreSQL database.",
      clearSubmissionsBtn: "Clear Submissions",
      refreshDataBtn: "Refresh Data",
      noticeTitle: "Live Database Synchronization",
      noticeBody:
        "Submissions and payment records are synchronized live with Supabase PostgreSQL (load_requests, payments, and profiles). All active and archived records persist securely across sessions and page refreshes.",
      totalSubmissionsTitle: "Total Submissions",
      totalSubmissionsSub: "Active reload requests awaiting or completed (excludes archived).",
      pendingCountTitle: "Pending Verification",
      pendingCountSub: (count: number) =>
        count === 1 ? "1 order awaiting review" : `${count} orders awaiting review`,
      doneCountTitle: "Done / Verified",
      doneCountSub: (count: number) =>
        count === 1 ? "1 verified order" : `${count} verified orders`,
      realtimeCardTitle: "Real-Time User POV Connection",
      realtimeCardSub:
        "When a user submits their receiver details, they appear here instantly via Supabase real-time sync.",
      testUserPovBtn: "Test User POV Form",
      tableCardTitle: "User Submissions",
      tableCardSub: "Detailed view of all submitted receiver reload requests.",
      searchPlaceholder: "Search customer name...",
      clearSearch: "Clear",
      clearSearchBtn: "Clear Search",
      noSearchResultsTitle: "No matching customers found",
      noSearchResultsBody: (query: string) =>
        `No customer records match "${query}". Check spelling or try clearing the search filter.`,
      showingResults: (matching: number, total: number) =>
        `Showing ${matching} of ${total} records`,
      filterLabel: "Filter by status:",
      filterAll: "All",
      filterPending: "Pending Verification",
      filterDone: "Done",
      submissionCount: (count: number) =>
        count === 1 ? "1 submission recorded" : `${count} submissions recorded`,
      emptyTitle: "No submissions yet",
      emptyBody:
        "When users fill out and submit the information form on the user-facing page, their details will immediately appear in this table.",
      goToUserPovBtn: "Go to User POV Form",
      table: {
        accountName: "Account Name",
        phoneNumber: "Phone Number",
        unitType: "Unit Type",
        accountNumber: "Account Number",
        paymentGcash: "Payment (GCash)",
        address: "Address",
        note: "Note",
        submittedAt: "Submitted At",
        action: "Status & Action",
      },
      mobile: {
        accountName: "Account Name",
        accountNumber: "Account Number",
        time: "Time",
        paymentGcash: "Payment (GCash)",
        address: "Address",
        note: "Note",
      },
      noNoteProvided: "No note provided",
      pendingStatus: "Pending Verification",
      doneStatus: "Done",
      markAsDoneBtn: "Mark as Done",
      completedBadge: "Done",
      archiveUi: {
        archiveBtn: "Archive",
        softDeleteBtn: "Archive",
        deleteBtn: "Delete",
        restoreBtn: "Restore",
        viewActiveTab: "Active Records",
        viewArchivedTab: (count: number) => `Archived Records (${count})`,
        archivedSectionTitle: "Archived Customer Records",
        archivedSectionSub:
          "Organize and inspect customer orders that have been archived. Archived records do not contribute to active submission statistics.",
        archivedEmptyTitle: "No archived records yet",
        archivedEmptyBody:
          "Click the 'Archive' action on any customer record in the active table above to move it to the archived records view.",
        uiPreviewBadge: "Live Supabase Database",
        uiPreviewNotice:
          "Action successfully synchronized with the Supabase database.",
        softDeletedBadge: "Archived",
        archivedBadge: "Archived",
        activeBadge: "Active",
        confirmDialog: {
          archiveTitle: "Archive Customer Record",
          archiveDesc:
            "This action moves this customer order to the Archived section and excludes it from active dashboard statistics. It can be restored at any time.",
          softDeleteTitle: "Archive Customer Record",
          softDeleteDesc:
            "This moves this customer order to the Archived section without permanently deleting it.",
          restoreTitle: "Restore Customer Record",
          restoreDesc:
            "This reactivates the customer order and restores it back to active records and statistics.",
          deleteTitle: "Permanently Delete Record",
          deleteDesc:
            "This will permanently remove this load request and associated payment records from Supabase. This action cannot be undone.",
          warningNote:
            "Notice: This change is saved directly to the Supabase database.",
          deleteWarningNote:
            "Warning: This action permanently deletes the data from Supabase PostgreSQL. This cannot be undone.",
          customerLabel: "Customer Name",
          accountLabel: "Account Number",
          unitLabel: "Unit Type",
          amountLabel: "Payment Amount",
          cancelBtn: "Cancel",
          confirmArchiveBtn: "Confirm Archive",
          confirmSoftDeleteBtn: "Confirm Archive",
          confirmRestoreBtn: "Confirm Restore",
          confirmDeleteBtn: "Delete Permanently",
        },
      },
      footerTitle: "Paload ko • Admin Console",
      footerSubtitle: "Connected directly to live Supabase PostgreSQL database.",
    },
    footer: {
      brandSubtitle:
        "Initial UI Prototype • Receiver Reload Information System",
      disclaimer: "Frontend prototype only. No data stored.",
    },
    auth: {
      registrationSuccessTitle: "Account Created Successfully!",
      registrationSuccessMessage:
        "Your Paload ko account has been created. You can now sign in and start using the system.",
      registrationSuccessVerificationRequired:
        "Your Paload ko account has been created, but verification is still needed. Please check your email to verify your account before signing in.",
      continueBtn: "Continue",
      okBtn: "OK",
      signInToViewHistory: "Sign In to View History",
      signInPromptMessage:
        "Please sign in to your customer account to view your reload history and transactions.",
      loadingHistory: "Loading your submission history...",
    },
  },
  ceb: {
    nav: {
      portalSubtitle: "Portal sa Pagpaload sa TV ug Satellite",
      prototype: "Prototype",
      history: "Kasaysayan",
      admin: "Admin",
      enterInfoDesktop: "Sulati ang Impormasyon",
      enterInfoMobile: "Paload",
      userPovForm: "Porma sa Kustomer",
      userPovMobile: "Kustomer POV",
      adminBadge: "Admin",
      adminSubtitle: "Dashboard sa Tagdumala sa Sistema",
    },
    hero: {
      pill: "Yano ug Diretso nga Portal sa Impormasyon sa Receiver",
      headline:
        "Paspas ug Sayon nga Pagpaload para sa Imong TV ug Satellite Receivers",
      descriptionWelcome: "Maayong pag-abot sa",
      descriptionBrand: "Paload ko",
      descriptionBody:
        ". Isulod ang detalye sa imong receiver sa pipila ka sayon nga lakang. Nagsuporta kami sa Satellite, GSat, Fili TV, Sky Direct, ug Signal units para sa walay hasol nga pagpaload.",
      fillButton: "Sulati ang Impormasyon",
      supportedUnitsTitle: "Mga Gisuportahang Klase sa Unit",
    },
    form: {
      stepBadge: "Lakang 1: Isulod ang Detalye ug Bayad",
      formTitle: "Porma sa Impormasyon sa Kustomer",
      formSubtitle:
        "Palihug sulati ang imong impormasyon sa kontak, detalye sa receiver unit, ug impormasyon sa bayad sa GCash sa ubos.",
      prototypeNoticeTitle: "Pahibalo sa Prototype",
      prototypeNoticeBody:
        "Kini nga porma usa ka interactive nga frontend prototype para sa Paload ko. Ang gipasulod susihon sa lokal ug i-sync sa Admin Dashboard. Walay personal nga impormasyon nga itipig sa gawas nga database.",
      accountNameLabel: "Pangalan sa Account",
      accountNamePlaceholder: "pananglitan: Juan Dela Cruz",
      phoneLabel: "Numero sa Telepono",
      phonePlaceholder: "pananglitan: 09171234567",
      phoneHelp: "Eksaktong 11 ka digit (numero lamang, pananglitan: 09171234567)",
      unitTypeLabel: "Klase sa Unit",
      unitTypePlaceholder: "Pilia ang klase sa receiver",
      accountNumberLabel: "Numero sa Account",
      accountNumberHelpGeneral:
        "Gikinahanglang digit: Satellite (6), GSat (16), Fili TV (16), Sky Direct (13), Signal (9)",
      accountNumberHelpSpecific: (req: number, unit: string) =>
        `Gikinahanglan: eksaktong ${req} ka digit para sa ${unit}`,
      accountNumberPlaceholder: (unit: string) => {
        if (unit === "Satellite") return "pananglitan: 123456 (6 ka digit)";
        if (unit === "GSat" || unit === "Fili TV")
          return "pananglitan: 0254889102145678 (16 ka digit)";
        if (unit === "Sky Direct") return "pananglitan: 1234567890123 (13 ka digit)";
        if (unit === "Signal") return "pananglitan: 123456789 (9 ka digit)";
        return "Pilia una ang Klase sa Unit";
      },
      addressLabel: "Address",
      addressPlaceholder:
        "Isulod ang tibuok address (Balay/Unit No., Dalan, Barangay, Dakbayan, Probinsya)",
      noteLabel: "Pahinumdom (Opsyonal)",
      notePlaceholder: "Ibutang ang bisan unsang dugang instruksyon o detalye dinhi...",
      noNoteProvided: "Walay gibutang nga pahinumdom",
      gcashSectionTitle: "Seksyon sa Bayad pinaagi sa GCash",
      gcashSectionSubtitle: "Ang paagi sa pagbayad kay GCash lamang.",
      gcashOnlyBadge: "GCash Lamang",
      adminGcashNumberLabel: "Numero sa GCash sa Admin",
      recipientBadge: "Tigdawat",
      adminGcashSubtext:
        "Opisyal nga GCash account nga modawat sa bayad sa pagpaload sa kustomer.",
      copyNumberBtn: "Kopyaha ang Numero",
      copiedNumberBtn: "Nakopya na ang Numero!",
      selectedAmountLabel: "Napili nga Kantidad sa Package",
      sendExactPrompt: (amount: string) =>
        `Ipadala ang eksaktong ${amount} pinaagi sa GCash aron makompleto ang pagpaload.`,
      selectAmountPrompt:
        "Pilia ang imong Klase sa Unit ug Kantidad sa Bayad sa ubos aron makita ang kinatibuk-ang ipadala.",
      sendToAdminLabel: "Ipadala sa Admin:",
      paymentInstructionsTitle: "Mga Instruksyon sa Pagbayad",
      step1: "Ablihi ang imong GCash app ug pilia ang Express Send.",
      step2Prefix: "Ipadala",
      step2Amount: (amount?: string) =>
        amount ? `ang eksaktong kantidad nga ${amount}` : "ang napiling kantidad",
      step2AdminPrompt: "sa numero sa GCash sa admin:",
      step2GsatNotice:
        "Para sa GSat, pilia og tarong ang package: ang ₱550 lamang ang naglakip sa All Channels; ang ₱150 ug ₱250 kay Regular Load lamang.",
      step3: "Kompletoha ang transaksyon sa GCash.",
      step4: "Kopyaha ang reference number gikan sa resibo sa transaksyon.",
      step5: "I-paste ang reference number sa porma.",
      step6: "Isumite ang impormasyon.",
      securityNoticeTitle: "Pahibalo sa Seguridad:",
      securityNoticeBody:
        "Ayaw gayod isulod o ipaambit ang imong GCash MPIN, password, o OTP. Ang Paload ko dili gayod mangayo sa imong MPIN o kumpidensyal nga verification codes.",
      paymentAmountLabel: "Kantidad sa Bayad",
      paymentAmountPlaceholder: (unit?: string) =>
        unit ? `Pilia ang kantidad para sa ${unit}` : "Pilia una ang Klase sa Unit",
      paymentAmountHelpGsat:
        "Pahinumdom: Ang ₱550 lamang ang naglakip sa All Channels; ang ₱150 ug ₱250 kay Regular Load.",
      paymentAmountHelpUnit: (unit: string) => `Mga available nga package para sa ${unit}`,
      paymentAmountHelpEmpty:
        "Pilia una ang Klase sa Unit sa ibabaw aron makita ang mga kapilian sa bayad.",
      gcashRefLabel: "Numero sa Reperensya sa GCash",
      gcashRefPlaceholder: "pananglitan: 100238491823",
      gcashRefHelp:
        "Palihug isulod o i-paste ang reference number gikan sa resibo sa imong GCash human makapadala og bayad.",
      digitsLabel: "ka digit",
      clearFormBtn: "Hawani ang Porma",
      submitBtn: "Isumite ang Impormasyon",
      submittingBtn: "Nagsumite...",
      validation: {
        accountNameRequired: "Gikinahanglan ang pangalan sa account.",
        accountNameMin: "Ang pangalan sa account kinahanglan labing menos 2 ka letra.",
        phoneRequired: "Gikinahanglan ang numero sa telepono.",
        phoneDigitsOnly: "Numero lamang ang pwede sa numero sa telepono.",
        phoneInvalidLength:
          "Kinahanglan eksaktong 11 ka digit ang numero sa telepono (pananglitan: 09171234567).",
        unitTypeRequired: "Palihug pilia ang klase sa unit gikan sa dropdown.",
        unitTypeInvalid:
          "Ang klase sa unit kinahanglan Satellite, GSat, Fili TV, Sky Direct, o Signal.",
        receiverRequired: "Gikinahanglan ang numero sa receiver.",
        receiverDigitsOnly: "Numero lamang ang pwede sa numero sa receiver.",
        receiverSelectUnitFirst: "Palihug pilia una ang Klase sa Unit.",
        receiverInvalidLength: (unit: string, req: number, cur: number) =>
          `Ang numero sa receiver para sa ${unit} kinahanglan eksaktong ${req} ka digit (karon ${cur} ka digit).`,
        receiverExactLength: (unit: string, req: number) =>
          `Ang numero sa receiver para sa ${unit} kinahanglan eksaktong ${req} ka digit.`,
        addressRequired: "Gikinahanglan ang tibuok address.",
        addressMin: "Palihug paghatag og kompleto ug eksaktong address.",
        amountRequired: "Palihug pilia ang kantidad sa bayad.",
        amountInvalid: (unit: string) =>
          `Ang napiling kantidad dili balido para sa ${unit || "napiling unit"}.`,
        refRequired: "Gikinahanglan ang GCash reference number.",
        refDigitsOnly: "Numero lamang ang pwede sa GCash reference number.",
      },
      summary: {
        successTitle: "Naisumite na ang Hangyo para sa Pag-beripika!",
        successMessage: (unit: string) =>
          `Naisumite na ang imong mga detalye ug reference number sa GCash ug naghulat sa pag-beripika sa admin para sa imong ${unit} unit.`,
        summaryHeading: "Summary sa Naisumite nga Impormasyon",
        pendingVerification: "Gipaabot ang Pag-beripika",
        accountName: "Pangalan sa Account",
        phoneNumber: "Numero sa Telepono",
        unitType: "Klase sa Unit",
        accountNumber: "Numero sa Account",
        address: "Tibuok Address",
        note: "Pahinumdom",
        paymentDestination: "Padulngan sa Bayad",
        paymentAmount: "Kantidad sa Bayad",
        gcashRef: "Numero sa Reperensya sa GCash",
        prototypeNote:
          "Pahinumdom: Kini nga frontend prototype mosusi sa lokal ug mo-sync sa Admin Dashboard. Ang kahimtang sa bayad gimarkahan nga naghulat sa pag-beripika.",
        viewAdminBtn: "Tan-awa sa Admin Dashboard",
        editInfoBtn: "Usba ang Impormasyon",
        submitAnotherBtn: "Magsumite og Lain nga Hangyo",
      },
      modal: {
        title: "Nadawat na ang Gisumite",
        description:
          "Nadawat na ang imong hangyo sa pagpaload ug reference sa bayad sa GCash.",
        paymentStatus: "Kahimtang sa Bayad",
        pendingVerification: "Gipaabot ang Pag-beripika",
        accountNumber: "Numero sa Account",
        unitType: "Klase sa Unit",
        paymentAmount: "Kantidad sa Bayad",
        gcashRef: "Numero sa GCash Ref",
        submittedAt: "Petsa ug Oras sa Pagsumite",
        footnote:
          "Pahinumdom: Ang bayad naghulat sa pag-beripika sa admin. Narekord ang gisumite para niini nga sesyon.",
        viewInHistory: "Tan-awa sa Kasaysayan",
        done: "Nahuman",
      },
    },
    history: {
      sessionLogBadge: "Log sa Sesyon",
      title: "Kasaysayan sa mga Gisumite",
      subtitle:
        "Susiha ug subaya ang mga hangyo sa pagpaload nga konektado sa imong rehistradong account.",
      returnToForm: "Balik sa Porma sa Pagsumite",
      temporaryNoticeTitle: "Kasaysayan nga Nakakonekta sa Account",
      temporaryNoticeBody:
        "Ang imong mga hangyo sa reload ug reference sa bayad luwas nga gitipigan sa Supabase ug konektado sa imong authenticated account. Ang imong mga rekord magpabilin bisan kanus-a ka mo-sign out o mobalhin og device.",
      submittedRequestsTitle: "Imong mga Naisumite nga Hangyo",
      recordCount: (count: number) =>
        count === 1 ? "1 ka rekord" : `${count} ka mga rekord`,
      adminViewLink: "Tan-awa ang Admin",
      emptyTitle: "Wala pay kasaysayan sa gisumite",
      emptyBody:
        "Sa higayon nga imong masulatan ug maisumite ang imong impormasyon sa receiver ug reference sa GCash, makita dinhi ang imong hangyo.",
      fillOutButton: "Sulati ang Impormasyon",
      table: {
        accountName: "Pangalan sa Account",
        unitType: "Klase sa Unit",
        accountNumber: "Numero sa Account",
        paymentAmount: "Kantidad sa Bayad",
        gcashRef: "Numero sa GCash Ref",
        submittedAt: "Petsa ug Oras sa Pagsumite",
        paymentStatus: "Kahimtang sa Bayad",
      },
      mobile: {
        accountName: "Pangalan sa Account",
        accountNumber: "Numero sa Account",
        paymentAmount: "Kantidad sa Bayad",
        gcashRef: "Numero sa GCash Ref",
        status: "Kahimtang",
        dateTime: "Petsa ug Oras",
      },
      pendingStatus: "Gipaabot ang Pag-beripika",
      doneStatus: "Nahuman na",
      archiveUi: {
        archiveBtn: "I-archive",
        softDeleteBtn: "I-archive",
        deleteBtn: "Papason",
        restoreBtn: "Ibalik",
        viewActiveTab: "Aktibong mga Gisumite",
        viewArchivedTab: (count: number) => `Naka-archive (${count})`,
        archivedSectionTitle: "Mga Naka-archive nga Gisumite",
        archivedSectionSub:
          "Susiha ang mga hangyo sa pagpaload nga gi-archive. Ang mga naka-archive dili maapil sa estadistika sa aktibong mga gisumite.",
        archivedEmptyTitle: "Wala pay naka-archive nga gisumite",
        archivedEmptyBody:
          "Mahimo nimong i-archive ang imong mga naunang gisumite gamit ang Archive nga aksyon sa bisan unsang rekord sa ibabaw.",
        uiPreviewBadge: "Live nga Database",
        uiPreviewNotice:
          "Narekord sa database sa Supabase.",
        softDeletedBadge: "Naka-archive",
        archivedBadge: "Naka-archive",
        activeBadge: "Aktibo",
        confirmDialog: {
          archiveTitle: "I-archive ang Gisumite",
          archiveDesc:
            "Ibalhin niini ang napiling gisumite ngadto sa seksyon sa Naka-archive. Mahimo kining ibalik bisan unsang orasa.",
          softDeleteTitle: "I-archive ang Gisumite",
          softDeleteDesc:
            "Ibalhin niini ang gisumite ngadto sa naka-archive nga dili kini permanenteng papason.",
          restoreTitle: "Ibalik ang Gisumite",
          restoreDesc:
            "Ibalik niini kini nga gisumite ngadto sa imong pangunang aktibong listahan sa mga gisumite.",
          deleteTitle: "Permanenteng Papason ang Rekord",
          deleteDesc:
            "Permanenteng kuhaon niini nga hangyo sa reload gikan sa database. Dili na kini mabalik.",
          warningNote:
            "Pahibalo: Ang mga kausaban gitipigan sa imong authenticated account sa Supabase.",
          deleteWarningNote:
            "Pahibalo: Kini nga aksyon permanente ug dili na mabalik gikan sa database.",
          customerLabel: "Pangalan sa Kustomer",
          accountLabel: "Numero sa Account",
          unitLabel: "Klase sa Unit",
          amountLabel: "Kantidad sa Bayad",
          cancelBtn: "Kanselahon",
          confirmArchiveBtn: "Kumpirmaha ang Pag-archive",
          confirmSoftDeleteBtn: "Kumpirmaha ang Pag-archive",
          confirmRestoreBtn: "Kumpirmaha ang Pagbalik",
          confirmDeleteBtn: "Permanenteng Papason",
        },
      },
    },
    admin: {
      liveBadge: "Buhi nga Pagdumala",
      title: "Admin Dashboard",
      subtitle:
        "Direktang konektado sa Supabase PostgreSQL database.",
      clearSubmissionsBtn: "Hawani ang mga Gisumite",
      refreshDataBtn: "I-refresh ang Datos",
      noticeTitle: "Buhi nga Koneksyon sa Supabase Database",
      noticeBody:
        "Ang mga hangyo sa reload ug rekord sa bayad direktang nakasubay sa Supabase PostgreSQL (load_requests, payments, ug profiles). Ang tanang aktibo ug naka-archive nga rekord magpabilin bisan i-refresh ang panid.",
      totalSubmissionsTitle: "Kinatibuk-ang Gisumite",
      totalSubmissionsSub:
        "Aktibong mga hangyo sa pagpaload (wala giapil ang naka-archive).",
      pendingCountTitle: "Gipaabot ang Pag-beripika",
      pendingCountSub: (count: number) =>
        count === 1
          ? "1 ka order nagkinahanglan og pag-beripika"
          : `${count} ka mga order nagkinahanglan og pag-beripika`,
      doneCountTitle: "Nahuman / Nakumpirma",
      doneCountSub: (count: number) =>
        count === 1
          ? "1 ka order ang nakumpirma"
          : `${count} ka mga order ang nakumpirma`,
      realtimeCardTitle: "Koneksyon sa Kustomer sa Tinuod nga Oras",
      realtimeCardSub:
        "Kung ang kustomer magsumite sa ilang detalye sa receiver, makita dayon kini dinhi pinaagi sa Supabase real-time sync.",
      testUserPovBtn: "Sulayi ang Porma sa Kustomer",
      tableCardTitle: "Mga Gisumite sa Kustomer",
      tableCardSub:
        "Detalyadong pagtan-aw sa tanang hangyo sa pagpaload sa receiver.",
      searchPlaceholder: "Pangitaa ang pangalan sa kustomer...",
      clearSearch: "Hawani",
      clearSearchBtn: "Hawani ang Pagpangita",
      noSearchResultsTitle: "Walay kustomer nga nakit-an",
      noSearchResultsBody: (query: string) =>
        `Walay rekord sa kustomer nga mitukma sa "${query}". Susiha ang spelling o sulayi paghawani ang filter.`,
      showingResults: (matching: number, total: number) =>
        `Gipakita ang ${matching} sa ${total} ka rekord`,
      filterLabel: "I-filter pinaagi sa status:",
      filterAll: "Tanan",
      filterPending: "Gipaabot ang Pag-beripika",
      filterDone: "Nahuman na",
      submissionCount: (count: number) =>
        count === 1
          ? "1 ka gisumite ang narekord"
          : `${count} ka mga gisumite ang narekord`,
      emptyTitle: "Wala pay naisumite",
      emptyBody:
        "Kung ang mga kustomer mosulat ug magsumite sa porma sa impormasyon, makita dayon dinhi sa lamesa ang ilang mga detalye.",
      goToUserPovBtn: "Adto sa Porma sa Kustomer",
      table: {
        accountName: "Pangalan sa Account",
        phoneNumber: "Numero sa Telepono",
        unitType: "Klase sa Unit",
        accountNumber: "Numero sa Account",
        paymentGcash: "Bayad (GCash)",
        address: "Address",
        note: "Pahinumdom",
        submittedAt: "Gisumite Niadtong",
        action: "Status ug Aksyon",
      },
      mobile: {
        accountName: "Pangalan sa Account",
        accountNumber: "Numero sa Account",
        time: "Oras",
        paymentGcash: "Bayad (GCash)",
        address: "Address",
        note: "Pahinumdom",
      },
      noNoteProvided: "Walay gibutang nga pahinumdom",
      pendingStatus: "Gipaabot ang Pag-beripika",
      doneStatus: "Nahuman na",
      markAsDoneBtn: "Markahi nga Nahuman",
      completedBadge: "Nahuman na",
      archiveUi: {
        archiveBtn: "I-archive",
        softDeleteBtn: "I-archive",
        deleteBtn: "Papason",
        restoreBtn: "Ibalik",
        viewActiveTab: "Aktibong mga Rekord",
        viewArchivedTab: (count: number) => `Naka-archive nga Rekord (${count})`,
        archivedSectionTitle: "Mga Naka-archive nga Rekord sa Kustomer",
        archivedSectionSub:
          "Organisaha ug susiha ang mga order sa kustomer nga gi-archive. Ang mga naka-archive dili maapil sa estadistika sa aktibong mga gisumite.",
        archivedEmptyTitle: "Wala pay naka-archive nga rekord",
        archivedEmptyBody:
          "I-click ang 'I-archive' sa bisan unsang aktibong rekord sa ibabaw aron ibalhin kini ngadto sa naka-archive.",
        uiPreviewBadge: "Live Supabase Database",
        uiPreviewNotice:
          "Malampusong narekord ang aksyon sa Supabase database.",
        softDeletedBadge: "Naka-archive",
        archivedBadge: "Naka-archive",
        activeBadge: "Aktibo",
        confirmDialog: {
          archiveTitle: "I-archive ang Rekord sa Kustomer",
          archiveDesc:
            "Ibalhin niini nga aksyon kini nga order sa kustomer ngadto sa seksyon sa Naka-archive ug tangtangon sa aktibong estadistika. Mahimo kining ibalik bisan unsang orasa.",
          softDeleteTitle: "I-archive ang Rekord sa Kustomer",
          softDeleteDesc:
            "Ibalhin niini ang order sa kustomer ngadto sa Naka-archive nga dili permanenteng magpapas og datos.",
          restoreTitle: "Ibalik ang Rekord sa Kustomer",
          restoreDesc:
            "Ibalik niini ang order sa kustomer ngadto sa pangunang lamesa sa mga aktibong rekord ug estadistika.",
          deleteTitle: "Permanenteng Papason ang Rekord",
          deleteDesc:
            "Permanenteng kuhaon niini nga hangyo sa reload ug rekord sa bayad gikan sa Supabase. Dili na kini mabalik.",
          warningNote:
            "Pahibalo: Kini nga aksyon gitipigan direkta sa database sa Supabase.",
          deleteWarningNote:
            "Pahibalo: Kini nga aksyon permanente ug dili na mabalik gikan sa database.",
          customerLabel: "Pangalan sa Kustomer",
          accountLabel: "Numero sa Account",
          unitLabel: "Klase sa Unit",
          amountLabel: "Kantidad sa Bayad",
          cancelBtn: "Kanselahon",
          confirmArchiveBtn: "Kumpirmaha ang Pag-archive",
          confirmSoftDeleteBtn: "Kumpirmaha ang Pag-archive",
          confirmRestoreBtn: "Kumpirmaha ang Pagbalik",
          confirmDeleteBtn: "Permanenteng Papason",
        },
      },
      footerTitle: "Paload ko • Admin Console",
      footerSubtitle: "Direktang konektado sa Supabase PostgreSQL database.",
    },
    footer: {
      brandSubtitle:
        "Inisyal nga UI Prototype • Sistema sa Impormasyon sa Pag-reload sa Receiver",
      disclaimer: "Frontend prototype lamang. Walay data nga gitipigan.",
    },
    auth: {
      registrationSuccessTitle: "Malamposong Nahimo ang Account!",
      registrationSuccessMessage:
        "Nahimo na ang imong Paload ko account. Mahimo ka na karon nga mosulod ug magsugod sa paggamit sa sistema.",
      registrationSuccessVerificationRequired:
        "Nahimo na ang imong Paload ko account, apan gikinahanglan pa ang beripikasyon. Palihug kumpirmaha ang imong account sa dili pa mosulod.",
      continueBtn: "Padayon (Continue)",
      okBtn: "OK",
      signInToViewHistory: "Sulod aron Makita ang Kasaysayan",
      signInPromptMessage:
        "Palihug sulod sa imong account aron makita ang imong personal nga kasaysayan sa pagpaload ug mga transaksyon.",
      loadingHistory: "Gakarga sa imong kasaysayan sa pagpaload...",
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "paload_ko_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "en" || saved === "ceb") {
          return saved;
        }
      } catch {
        // Ignore localStorage access errors
      }
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore errors
    }
  };

  const t = useMemo(() => translations[language], [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
