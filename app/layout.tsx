import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SubmissionProvider } from "@/context/SubmissionContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#060807",
};

export const metadata: Metadata = {
  title: "Paload ko — TV & Satellite Reloading System",
  description: "Easily submit receiver details and reload Satellite, GSat, Fili TV, Sky Direct, and Signal units.",
};

import { GlobalAuthModal } from "@/components/GlobalAuthModal";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${inter.className} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#060807] text-zinc-100 overflow-x-hidden w-full">
        <LanguageProvider>
          <AuthProvider>
            <SubmissionProvider>
              {children}
              <GlobalAuthModal />
            </SubmissionProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
