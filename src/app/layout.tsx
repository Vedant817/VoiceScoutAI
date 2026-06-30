import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceScout AI | Market Intelligence MVP",
  description: "Generate structured competitor, market-risk, positioning, and next-step reports from a startup idea.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
