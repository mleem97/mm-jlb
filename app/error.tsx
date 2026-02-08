"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    console.error("[Error Boundary]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Etwas ist schiefgelaufen
          </h1>
          <p className="text-muted-foreground text-sm">
            Ein unerwarteter Fehler ist aufgetreten. Ihre Daten sind sicher gespeichert.
          </p>
          {error.digest && (
            <p className="text-xs text-muted-foreground/60 font-mono">
              Fehler-ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Erneut versuchen
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
          >
            <Home className="h-4 w-4" />
            Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
