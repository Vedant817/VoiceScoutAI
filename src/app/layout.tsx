import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VoiceScout AI - Voice-First Market Intelligence",
  description:
    "Voice-activated AI agent for on-the-go market intelligence. Simply call or speak your request for competitor analysis, industry trends, or product research.",
  keywords: [
    "AI",
    "market research",
    "voice interface",
    "competitor analysis",
    "business intelligence",
  ],
  authors: [{ name: "Vedant Mahajan" }],
  openGraph: {
    title: "VoiceScout AI - Voice-First Market Intelligence",
    description: "Voice-activated AI agent for on-the-go market intelligence.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceScout AI - Voice-First Market Intelligence",
    description: "Voice-activated AI agent for on-the-go market intelligence.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}