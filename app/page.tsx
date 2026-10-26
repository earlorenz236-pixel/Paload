import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { UserInformationForm } from "@/components/UserInformationForm";
import { SubmissionHistory } from "@/components/SubmissionHistory";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#060807] text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <UserInformationForm />
        <SubmissionHistory />
      </main>
      <Footer />
    </div>
  );
}
