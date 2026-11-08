"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { UserInformationForm } from "@/components/UserInformationForm";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-[#060807] text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />
      <main className="flex-1">
        {/* Render public landing page Hero ONLY when the customer is unauthenticated */}
        {!loading && !user && <Hero />}
        <UserInformationForm />
      </main>
      <Footer />
    </div>
  );
}
