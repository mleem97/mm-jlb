"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  FileText,
  Archive,
  Database,
  Download,
  Loader2,
  Lightbulb,
  Mail,
  CheckCircle2,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

import { useApplicationStore } from "@/store/applicationStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { downloadJson } from "@/lib/export/jsonExport";
import { downloadZip } from "@/lib/export/zipExport";
import type { ExportFormat, TrackerStatus } from "@/types/exportConfig";

// ─── Constants ─────────────────────────────────────────────
const CURRENT_STEP = 9;
const TOTAL_STEPS = 9;

const SMART_TIPS = [
  "PDF/A-Format ist optimal für ATS-Systeme",
  "ZIP-Export eignet sich als Backup aller Bewerbungsdaten",
  "JSON-Export ermöglicht den Import in eine neue Bewerbung",
];

const STATUS_COLORS: Record<TrackerStatus, string> = {
  entwurf: "bg-gray-100 text-gray-800",
  gesendet: "bg-blue-100 text-blue-800",
  antwort: "bg-yellow-100 text-yellow-800",
  absage: "bg-red-100 text-red-800",
  zusage: "bg-green-100 text-green-800",
};

const STATUS_LABELS: Record<TrackerStatus, string> = {
  entwurf: "Entwurf",
  gesendet: "Gesendet",
  antwort: "Antwort",
  absage: "Absage",
  zusage: "Zusage",
};

// ─── Helpers ──────────────────────────────────────────────

function buildExportFileName(
  lastName: string,
  companyName: string | undefined,
  format: ExportFormat,
): string {
  const safeLast = (lastName || "Bewerbung").replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, "_");
  const safeCompany = (companyName || "Firma").replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, "_");
  const ext = format === "zip" ? "zip" : format === "json" ? "json" : "pdf";
  return `Bewerbung_${safeLast}_${safeCompany}.${ext}`;
}

// ─── Component ────────────────────────────────────────────

export default function Step9Export() {
  const store = useApplicationStore();
  const {
    personalData,
    jobPosting,
    exportConfig,
    trackerEntries,
    setExportConfig,
    addTrackerEntry,
    removeTrackerEntry,
  } = store;

  const [isExporting, setIsExporting] = useState(false);
  const [emailExpanded, setEmailExpanded] = useState(false);

  const progress = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const fileName = useMemo(
    () => buildExportFileName(personalData.lastName, jobPosting?.companyName, exportConfig.format),
    [personalData.lastName, jobPosting?.companyName, exportConfig.format],
  );

  // ── Export handler ────────────────────────────────────────
  const handleExport = useCallback(async () => {
    setIsExporting(true);

    try {
      const state = useApplicationStore.getState();

      switch (exportConfig.format) {
        case "json":
          downloadJson(state);
          break;

        case "zip":
          await downloadZip(state);
          break;

        case "pdf":
          // Attempt dynamic import of PDF generation
          try {
            const { downloadPdf } = await import("@/lib/export/pdfExport");
            await downloadPdf(state);
          } catch {
            toast.error("PDF-Generierung ist derzeit nicht verfügbar. Bitte nutze den ZIP- oder JSON-Export.");
            setIsExporting(false);
            return;
          }
          break;
      }

      // Auto-create tracker entry
      const entry = {
        id: crypto.randomUUID(),
        companyName: jobPosting?.companyName || "Unbekannt",
        jobTitle: jobPosting?.jobTitle || "Unbekannt",
        appliedAt: new Date().toISOString(),
        status: "gesendet" as const,
        exportFormat: exportConfig.format,
      };
      addTrackerEntry(entry);

      toast.success("Bewerbung erfolgreich exportiert und im Tracker gespeichert");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Export fehlgeschlagen";
      toast.error(message);
    } finally {
      setIsExporting(false);
    }
  }, [exportConfig.format, jobPosting, addTrackerEntry]);

  // ── Format selection helper ────────────────────────────
  const formatOptions: {
    value: ExportFormat;
    label: string;
    description: string;
    icon: typeof FileText;
  }[] = [
    {
      value: "pdf",
      label: "PDF",
      description: "Bewerbungsmappe als PDF",
      icon: FileText,
    },
    {
      value: "zip",
      label: "ZIP",
      description: "Komplettpaket als ZIP",
      icon: Archive,
    },
    {
      value: "json",
      label: "JSON",
      description: "Daten als JSON sichern",
      icon: Database,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ── Progress Bar ─────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Schritt {CURRENT_STEP} von {TOTAL_STEPS}: Export & Versand
          </span>
          <span className="text-sm text-muted-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="space-y-8">
        {/* ── Smart Tips ────────────────────────────────── */}
        <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <div className="flex gap-3">
            <Lightbulb className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Tipps</p>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                {SMART_TIPS.map((tip) => (
                  <li key={tip}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* ── Section 9.1: Export-Format ─────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-lg font-semibold mb-4">Export-Format wählen</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {formatOptions.map(({ value, label, description, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setExportConfig({ format: value })}
                className={`
                  relative flex flex-col items-center gap-3 rounded-xl border-2 p-6
                  transition-all duration-200 cursor-pointer text-center
                  ${
                    exportConfig.format === value
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-muted hover:border-primary/40 hover:bg-muted/50"
                  }
                `}
              >
                <Icon
                  className={`h-8 w-8 ${exportConfig.format === value ? "text-primary" : "text-muted-foreground"}`}
                />
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{description}</p>
                </div>
                {exportConfig.format === value && (
                  <motion.div
                    layoutId="format-indicator"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>

          {/* PDF sub-options */}
          <AnimatePresence>
            {exportConfig.format === "pdf" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 space-y-3"
              >
                <Label className="text-sm font-medium">PDF-Modus</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setExportConfig({ pdfMode: "single" })}
                    className={`flex-1 rounded-lg border p-3 text-sm text-left transition-colors ${
                      exportConfig.pdfMode === "single"
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/40"
                    }`}
                  >
                    <span className="font-medium">Einzeldokument</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Nur das Anschreiben als PDF
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setExportConfig({ pdfMode: "bundle" })}
                    className={`flex-1 rounded-lg border p-3 text-sm text-left transition-colors ${
                      exportConfig.pdfMode === "bundle"
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/40"
                    }`}
                  >
                    <span className="font-medium">Bewerbungsmappe</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Alles in einer PDF
                    </p>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Include attachments checkbox */}
          <AnimatePresence>
            {(exportConfig.format === "zip" ||
              (exportConfig.format === "pdf" && exportConfig.pdfMode === "bundle")) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="includeAttachments"
                    checked={exportConfig.includeAttachments}
                    onCheckedChange={(checked) =>
                      setExportConfig({ includeAttachments: checked === true })
                    }
                  />
                  <Label htmlFor="includeAttachments" className="text-sm cursor-pointer">
                    Anlagen einschließen
                  </Label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ── Section 9.2: Download ─────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold mb-4">Download</h2>

          <Card className="p-6 space-y-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Dateiname: </span>
              <code className="bg-muted px-2 py-1 rounded text-xs">{fileName}</code>
            </div>

            <Button
              size="lg"
              className="w-full gap-2"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Wird erstellt…
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  {exportConfig.format === "pdf"
                    ? "PDF herunterladen"
                    : exportConfig.format === "zip"
                      ? "ZIP herunterladen"
                      : "JSON herunterladen"}
                </>
              )}
            </Button>
          </Card>
        </motion.section>

        {/* ── Section 9.3: E-Mail-Versand (Stub) ────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <button
            type="button"
            onClick={() => setEmailExpanded(!emailExpanded)}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Per E-Mail senden
            </h2>
            {emailExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>

          <AnimatePresence>
            {emailExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="p-6 mt-4 space-y-4 opacity-60">
                  <Badge variant="secondary" className="gap-1">
                    <Mail className="h-3 w-3" />
                    E-Mail-Versand wird in einer zukünftigen Version verfügbar
                  </Badge>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">Empfänger</Label>
                      <Input placeholder="bewerbung@firma.de" disabled />
                    </div>
                    <div>
                      <Label className="text-sm">Betreff</Label>
                      <Input
                        placeholder="Bewerbung als Software-Entwickler"
                        disabled
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Nachricht</Label>
                      <Textarea
                        placeholder="Sehr geehrte Damen und Herren..."
                        rows={4}
                        disabled
                      />
                    </div>
                  </div>

                  <Button disabled className="w-full gap-2">
                    <Mail className="h-4 w-4" />
                    E-Mail senden (demnächst)
                  </Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ── Section 9.4: Tracker ──────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold mb-4">Bewerbungs-Tracker</h2>

          {trackerEntries.length === 0 ? (
            <Card className="p-6">
              <p className="text-sm text-muted-foreground text-center">
                Noch keine Bewerbungen exportiert. Nach dem Export wird hier ein Eintrag erstellt.
              </p>
            </Card>
          ) : (
            <Card className="divide-y overflow-hidden">
              {trackerEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.companyName}</p>
                    <p className="text-xs text-muted-foreground truncate">{entry.jobTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.appliedAt).toLocaleDateString("de-DE")}
                      {entry.exportFormat && (
                        <span className="ml-2 uppercase text-[10px] font-mono">
                          {entry.exportFormat}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[entry.status]}`}
                    >
                      {STATUS_LABELS[entry.status]}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeTrackerEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </motion.section>

        {/* ── Navigation ────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/phases/anlagen">
              <ChevronLeft className="h-4 w-4" />
              Zurück
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/phases/abschluss">
              Fertig
              <CheckCircle2 className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
