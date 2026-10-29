"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/AuthModal";

/**
 * Global single instance of the customer authentication modal.
 * Rendered at the root layout so that any page or component can
 * trigger login/registration without duplicating modals or losing state.
 */
export function GlobalAuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode } = useAuth();

  return (
    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      initialMode={authModalMode}
    />
  );
}
