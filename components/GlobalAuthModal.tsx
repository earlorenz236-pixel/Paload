"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";
import { RegistrationSuccessDialog } from "@/components/RegistrationSuccessDialog";

/**
 * Global single instance of the customer authentication modal and registration success dialog.
 * Rendered at the root layout so that any page or component can
 * trigger login/registration without duplicating modals or losing state.
 */
export function GlobalAuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    authPrefilledUsername,
    isSuccessDialogOpen,
    closeSuccessDialog,
    successDialogData,
    handleSuccessDialogContinue,
  } = useAuth();

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
        prefilledUsername={authPrefilledUsername}
      />
      <RegistrationSuccessDialog
        isOpen={isSuccessDialogOpen}
        onClose={closeSuccessDialog}
        onContinue={handleSuccessDialogContinue}
        username={successDialogData?.username}
        requiresVerification={successDialogData?.requiresVerification}
      />
    </>
  );
}
