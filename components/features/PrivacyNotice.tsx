"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STORAGE_KEY = "jlb-privacy-accepted";

export function PrivacyNotice() {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return !localStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  });

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-title"
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="mx-4 w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h2 id="privacy-title" className="text-lg font-semibold">
            Datenschutzhinweis
          </h2>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          Alle Ihre Daten werden ausschließlich lokal in Ihrem Browser
          gespeichert. Es werden keine Daten an Server oder Cloud-Dienste
          übertragen. Ihre Bewerbungsdaten verlassen niemals Ihren Computer.
        </p>

        <div className="mb-6">
          <Badge variant="secondary" className="gap-1.5">
            <ShieldCheck className="h-3 w-3" />
            DSGVO-konform
          </Badge>
        </div>

        <Button onClick={accept} className="w-full">
          Verstanden
        </Button>
      </div>
    </div>
  );
}
