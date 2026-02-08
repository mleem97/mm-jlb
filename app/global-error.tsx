"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html lang="de">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, -apple-system, sans-serif",
            padding: "2rem",
            backgroundColor: "#fafafa",
          }}
        >
          <div style={{ maxWidth: "28rem", textAlign: "center" }}>
            <div
              style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "50%",
                backgroundColor: "#fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                fontSize: "2rem",
              }}
            >
              ⚠️
            </div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "0.5rem",
                color: "#111",
              }}
            >
              Kritischer Fehler
            </h1>
            <p
              style={{
                color: "#666",
                fontSize: "0.875rem",
                marginBottom: "1.5rem",
              }}
            >
              Die Anwendung konnte nicht geladen werden. Ihre gespeicherten Daten sind nicht betroffen.
            </p>
            {error.digest && (
              <p
                style={{
                  color: "#999",
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  marginBottom: "1rem",
                }}
              >
                Fehler-ID: {error.digest}
              </p>
            )}
            <button
              onClick={reset}
              style={{
                backgroundColor: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.625rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Seite neu laden
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
