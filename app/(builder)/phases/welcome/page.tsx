"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { SiLinkedin, SiXing } from "react-icons/si";
import { toast } from "sonner";
import { Upload, FileText, Loader2 } from "lucide-react";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useApplicationStore } from "@/store/applicationStore";
import { applicationImportSchema } from "@/lib/schemas/importSchema";
import { SavedStateDialog } from "@/components/features/SavedStateDialog";
import { importFromZip } from "@/lib/importers/zipImporter";
import type { ApplicationImportData } from "@/types/import";

export default function Phase01Page() {
  const router = useRouter();
  const { importApplicationData, resetApplication } = useApplicationStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingLabel, setProcessingLabel] = useState("");
  const linkedInInputRef = useRef<HTMLInputElement>(null);
  const xingInputRef = useRef<HTMLInputElement>(null);

  // ─── A) Neu beginnen ─────────────────────────────────────
  const handleNewStart = useCallback(() => {
    resetApplication();
    localStorage.setItem("jlb:builder:mode", "new");
    localStorage.removeItem("jlb:builder:payload");
    toast.success("Neues Projekt angelegt", {
      description: "Du kannst jetzt Schritt für Schritt deine Daten erfassen.",
    });
    router.push("/phases/persoenliche-daten");
  }, [resetApplication, router]);

  // ─── B) JSON Import ──────────────────────────────────────
  const handleJsonImport = useCallback(
    async (file?: File | null) => {
      if (!file) return;
      setIsProcessing(true);
      setProcessingLabel("JSON wird geladen…");
      setProgress(20);

      try {
        const text = await file.text();
        setProgress(40);

        let parsed: unknown;
        try {
          parsed = JSON.parse(text);
        } catch {
          toast.error("Ungültiges JSON", {
            description: "Die Datei enthält kein gültiges JSON-Format.",
          });
          return;
        }
        setProgress(60);

        // Zod validation
        const result = applicationImportSchema.safeParse(parsed);
        if (!result.success) {
          const firstError = result.error.issues[0];
          toast.error("Import-Validierung fehlgeschlagen", {
            description: firstError
              ? `${firstError.path.join(".")}: ${firstError.message}`
              : "Die JSON-Datei entspricht nicht dem erwarteten Format.",
          });
          return;
        }
        setProgress(80);

        // Map to store
        importApplicationData(result.data);
        localStorage.setItem("jlb:builder:mode", "import");
        localStorage.setItem("jlb:builder:import:source", "json");
        setProgress(100);

        toast.success("JSON-Import erfolgreich", {
          description: `${file.name} wurde importiert und alle Daten übernommen.`,
        });
        router.push("/phases/persoenliche-daten");
      } catch {
        toast.error("Import fehlgeschlagen", {
          description: "Ein unerwarteter Fehler ist aufgetreten.",
        });
      } finally {
        setIsProcessing(false);
        setProgress(0);
        setProcessingLabel("");
      }
    },
    [importApplicationData, router],
  );

  // ─── B) ZIP Import ───────────────────────────────────────
  const handleZipImport = useCallback(
    async (file?: File | null) => {
      if (!file) return;
      setIsProcessing(true);
      setProcessingLabel("ZIP wird verarbeitet…");
      setProgress(10);

      try {
        // Dynamic import JSZip (code-splitting)
        const JSZip = (await import("jszip")).default;
        setProgress(20);

        const zip = await JSZip.loadAsync(file);
        setProgress(40);

        // Find JSON file in ZIP
        const jsonFileName = Object.keys(zip.files).find(
          (name) => name.endsWith(".json") && !name.startsWith("__MACOSX"),
        );

        if (!jsonFileName) {
          toast.error("Keine JSON-Datei gefunden", {
            description: "Das ZIP-Archiv enthält keine .json-Datei mit Bewerbungsdaten.",
          });
          return;
        }

        const jsonContent = await zip.files[jsonFileName].async("string");
        setProgress(60);

        let parsed: unknown;
        try {
          parsed = JSON.parse(jsonContent);
        } catch {
          toast.error("Ungültiges JSON im ZIP", {
            description: `Die Datei ${jsonFileName} enthält kein gültiges JSON.`,
          });
          return;
        }

        // Zod validation
        const result = applicationImportSchema.safeParse(parsed);
        if (!result.success) {
          const firstError = result.error.issues[0];
          toast.error("Import-Validierung fehlgeschlagen", {
            description: firstError
              ? `${firstError.path.join(".")}: ${firstError.message}`
              : "Die JSON-Datei im ZIP entspricht nicht dem erwarteten Format.",
          });
          return;
        }
        setProgress(80);

        // Extract attachment files from ZIP (PDFs, images)
        const attachmentFiles = Object.keys(zip.files).filter((name) => {
          const lower = name.toLowerCase();
          return (
            !name.endsWith(".json") &&
            !name.startsWith("__MACOSX") &&
            !zip.files[name].dir &&
            (lower.endsWith(".pdf") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".docx"))
          );
        });

        // Store attachment blobs in IndexedDB
        if (attachmentFiles.length > 0) {
          const { applicationDb } = await import("@/lib/db/applicationDb");
          for (const attachName of attachmentFiles) {
            const blob = await zip.files[attachName].async("blob");
            await applicationDb.attachments.put({
              id: attachName,
              fileName: attachName.split("/").pop() || attachName,
              fileType: attachName.toLowerCase().endsWith(".pdf") ? "pdf" : "image",
              fileSize: blob.size,
              category: "sonstiges",
              blob,
              addedAt: new Date(),
            });
          }
        }

        // Map to store
        importApplicationData(result.data);
        localStorage.setItem("jlb:builder:mode", "import");
        localStorage.setItem("jlb:builder:import:source", "zip");
        setProgress(100);

        toast.success("ZIP-Import erfolgreich", {
          description: `${file.name} importiert. ${attachmentFiles.length} Anhänge extrahiert.`,
        });
        router.push("/phases/persoenliche-daten");
      } catch (err) {
        toast.error("ZIP-Import fehlgeschlagen", {
          description: err instanceof Error ? err.message : "Ein unerwarteter Fehler ist aufgetreten.",
        });
      } finally {
        setIsProcessing(false);
        setProgress(0);
        setProcessingLabel("");
      }
    },
    [importApplicationData, router],
  );

  // ─── File handler: JSON or ZIP ────────────────────────────
  const handleFileImport = useCallback(
    (file?: File | null) => {
      if (!file) return;
      const isZip = file.name.toLowerCase().endsWith(".zip") || file.type.includes("zip");
      if (isZip) {
        handleZipImport(file);
      } else {
        handleJsonImport(file);
      }
    },
    [handleJsonImport, handleZipImport],
  );

  // ─── C) LinkedIn / XING ──────────────────────────────────
  const handleLinkedInConnect = useCallback(() => {
    linkedInInputRef.current?.click();
  }, []);

  const handleXingConnect = useCallback(() => {
    xingInputRef.current?.click();
  }, []);

  const handleLinkedInFileChange = useCallback(
    async (file?: File | null) => {
      if (!file) return;
      setIsProcessing(true);
      setProcessingLabel("LinkedIn-Export wird verarbeitet…");
      setProgress(10);

      try {
        const result = await importFromZip(file, (p) => setProgress(p));
        setProgress(95);

        importApplicationData(result.data);
        localStorage.setItem("jlb:builder:mode", "import");
        localStorage.setItem("jlb:builder:import:source", "linkedin");

        if (result.warnings.length > 0) {
          for (const warning of result.warnings) {
            toast.warning("Hinweis", { description: warning });
          }
        }

        setProgress(100);
        toast.success("LinkedIn-Import erfolgreich", {
          description: `${file.name} wurde importiert und alle Daten übernommen.`,
        });
        router.push("/phases/persoenliche-daten");
      } catch (err) {
        toast.error("LinkedIn-Import fehlgeschlagen", {
          description:
            err instanceof Error
              ? err.message
              : "Ein unerwarteter Fehler ist aufgetreten.",
        });
      } finally {
        setIsProcessing(false);
        setProgress(0);
        setProcessingLabel("");
        if (linkedInInputRef.current) linkedInInputRef.current.value = "";
      }
    },
    [importApplicationData, router],
  );

  const handleXingFileChange = useCallback(
    async (file?: File | null) => {
      if (!file) return;
      setIsProcessing(true);
      setProcessingLabel("XING-Export wird verarbeitet…");
      setProgress(10);

      try {
        let result: { data: ApplicationImportData; warnings: string[] };
        const isCSV =
          file.name.toLowerCase().endsWith(".csv") ||
          file.type === "text/csv";

        if (isCSV) {
          const { parseXingExport } = await import(
            "@/lib/importers/xingParser"
          );
          const text = await file.text();
          setProgress(50);
          const baseName =
            file.name.replace(/\.csv$/i, "") || "Profil";
          result = parseXingExport({ [baseName]: text });
        } else {
          result = await importFromZip(file, (p) => setProgress(p));
        }
        setProgress(95);

        importApplicationData(result.data);
        localStorage.setItem("jlb:builder:mode", "import");
        localStorage.setItem("jlb:builder:import:source", "xing");

        if (result.warnings.length > 0) {
          for (const warning of result.warnings) {
            toast.warning("Hinweis", { description: warning });
          }
        }

        setProgress(100);
        toast.success("XING-Import erfolgreich", {
          description: `${file.name} wurde importiert und alle Daten übernommen.`,
        });
        router.push("/phases/persoenliche-daten");
      } catch (err) {
        toast.error("XING-Import fehlgeschlagen", {
          description:
            err instanceof Error
              ? err.message
              : "Ein unerwarteter Fehler ist aufgetreten.",
        });
      } finally {
        setIsProcessing(false);
        setProgress(0);
        setProcessingLabel("");
        if (xingInputRef.current) xingInputRef.current.value = "";
      }
    },
    [importApplicationData, router],
  );

  // ─── D) PDF Import ───────────────────────────────────────
  const handlePdfImport = useCallback(
    async (file?: File | null) => {
      if (!file) return;
      setIsProcessing(true);
      setProcessingLabel("PDF wird vorbereitet…");
      setProgress(30);

      try {
        // For now: store raw PDF as base64 for later OCR processing
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        setProgress(70);

        const payload = {
          source: "pdf",
          fileName: file.name,
          mimeType: file.type || "application/pdf",
          data: `base64:${base64}`,
          status: "pending_ocr",
        };

        localStorage.setItem("jlb:builder:payload", JSON.stringify(payload));
        localStorage.setItem("jlb:builder:mode", "import");
        localStorage.setItem("jlb:builder:import:source", "pdf");
        setProgress(100);

        toast.info("PDF gespeichert", {
          description: "OCR/KI-Verarbeitung folgt im nächsten Schritt.",
        });
        router.push("/phases/persoenliche-daten");
      } catch {
        toast.error("PDF-Import fehlgeschlagen", {
          description: "Die PDF-Datei konnte nicht gelesen werden.",
        });
      } finally {
        setIsProcessing(false);
        setProgress(0);
        setProcessingLabel("");
      }
    },
    [router],
  );

  return (
    <AnimatePresence mode="wait">
    <SavedStateDialog
      onContinue={() => router.push("/phases/persoenliche-daten")}
      onNewStart={() => {
        resetApplication();
        localStorage.setItem("jlb:builder:mode", "new");
        localStorage.removeItem("jlb:builder:payload");
        router.push("/phases/persoenliche-daten");
      }}
    />
    <motion.main
      key="welcome-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <SiteHeader />
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
          >
            Willkommen & Auswahl
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-muted-foreground text-lg"
          >
            Starte ein neues Projekt oder importiere vorhandene Daten.
          </motion.p>

          {/* Global processing indicator */}
          {isProcessing && (
            <div className="mt-6 max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{processingLabel}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid gap-4 sm:grid-cols-2">
          {/* A – Neu beginnen */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border/50 h-full">
              <CardContent className="relative p-6 pl-16 space-y-4">
                <span className="absolute left-4 top-6 text-4xl font-bold text-muted-foreground/20">
                  A
                </span>
                <h2 className="text-lg font-semibold">Neu beginnen</h2>
                <p className="text-sm text-muted-foreground">
                  Leeres Projekt starten und alle Daten Schritt für Schritt erfassen.
                </p>
                <Button
                  onClick={handleNewStart}
                  disabled={isProcessing}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Neu starten
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* B – JSON/ZIP Import */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-border/50 h-full">
              <CardContent className="relative p-6 pl-16 space-y-4">
                <span className="absolute left-4 top-6 text-4xl font-bold text-muted-foreground/20">
                  B
                </span>
                <h2 className="text-lg font-semibold">JSON/ZIP importieren</h2>
                <p className="text-sm text-muted-foreground">
                  Export aus der App (JSON/ZIP) importieren und fortsetzen.
                </p>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  <Upload className="h-4 w-4" />
                  Datei auswählen
                  <input
                    type="file"
                    accept="application/json,.json,application/zip,.zip"
                    onChange={(e) => handleFileImport(e.target.files?.[0])}
                    disabled={isProcessing}
                    className="sr-only"
                  />
                </label>
              </CardContent>
            </Card>
          </motion.div>

          {/* C – LinkedIn / XING */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-border/50 h-full">
              <CardContent className="relative p-6 pl-16 space-y-4">
                <span className="absolute left-4 top-6 text-4xl font-bold text-muted-foreground/20">
                  C
                </span>
                <h2 className="text-lg font-semibold">LinkedIn / XING importieren</h2>
                <p className="text-sm text-muted-foreground">
                  CSV-Export von LinkedIn oder XING importieren.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleLinkedInConnect}
                    disabled={isProcessing}
                    className="justify-start gap-2 bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90"
                  >
                    <SiLinkedin size={20} aria-hidden />
                    LinkedIn CSV
                  </Button>
                  <Button
                    onClick={handleXingConnect}
                    disabled={isProcessing}
                    className="justify-start gap-2 bg-[#006567] text-white hover:bg-[#006567]/90"
                  >
                    <SiXing size={20} aria-hidden />
                    XING CSV
                  </Button>
                  <input
                    ref={linkedInInputRef}
                    type="file"
                    accept=".zip,application/zip"
                    onChange={(e) => handleLinkedInFileChange(e.target.files?.[0])}
                    disabled={isProcessing}
                    className="sr-only"
                  />
                  <input
                    ref={xingInputRef}
                    type="file"
                    accept=".zip,.csv,application/zip,text/csv"
                    onChange={(e) => handleXingFileChange(e.target.files?.[0])}
                    disabled={isProcessing}
                    className="sr-only"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* D – PDF Import */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="border-border/50 h-full">
              <CardContent className="relative p-6 pl-16 space-y-4">
                <span className="absolute left-4 top-6 text-4xl font-bold text-muted-foreground/20">
                  D
                </span>
                <h2 className="text-lg font-semibold">PDF-Lebenslauf auslesen</h2>
                <p className="text-sm text-muted-foreground">
                  PDF hochladen – Parsing per OCR (mit KI‑Extraktion).
                </p>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                  <FileText className="h-4 w-4" />
                  PDF auswählen
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(e) => handlePdfImport(e.target.files?.[0])}
                    disabled={isProcessing}
                    className="sr-only"
                  />
                </label>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      <SiteFooter />
    </motion.main>
    </AnimatePresence>
  );
}