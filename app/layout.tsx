import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { KeyboardShortcutsProvider } from "@/components/providers/KeyboardShortcutsProvider";
import { PrivacyNotice } from "@/components/features/PrivacyNotice";
import { PWAInstallPrompt } from "@/components/features/PWAInstallPrompt";
import { LocaleProvider } from "@/i18n/client";

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
      <head>
        <meta name="theme-color" content="#5B6DEE" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LocaleProvider>
          <KeyboardShortcutsProvider>
            {children}
            <PrivacyNotice />
            <PWAInstallPrompt />
          </KeyboardShortcutsProvider>
          <Toaster />
        </LocaleProvider>
      </body>
    </html>
  );
}
