import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { KeyboardShortcutsProvider } from "@/components/providers/KeyboardShortcutsProvider";
import { PrivacyNotice } from "@/components/features/PrivacyNotice";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Letter Builder",
  description: "Professionelle Bewerbungen erstellen – 100% offline und Datenschutz-freundlich",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <KeyboardShortcutsProvider>
          {children}
          <PrivacyNotice />
        </KeyboardShortcutsProvider>
        <Toaster />
      </body>
    </html>
  );
}
