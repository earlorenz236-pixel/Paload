import { Navbar } from "@/components/Navbar";
import { SubmissionHistory } from "@/components/SubmissionHistory";
import { Footer } from "@/components/Footer";

export default function HistoryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#060807] text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navbar />
      <main className="flex-1 py-6">
        <SubmissionHistory />
      </main>
      <Footer />
    </div>
  );
}
