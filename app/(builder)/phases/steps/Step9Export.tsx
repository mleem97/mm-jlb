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
  ShieldCheck,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

import { useApplicationStore } from "@/store/applicationStore";
import { useTranslations } from "@/i18n/client";
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
import { EmailComposer } from "@/components/features/EmailComposer";
import { runATSCheck } from "@/lib/utils/atsCheck";
import type { ATSCheckResult } from "@/lib/utils/atsCheck";

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

const STATUS_LABEL_KEYS: Record<TrackerStatus, string> = {
  entwurf: "statusDraft",
  gesendet: "statusSent",
  antwort: "statusReply",
  absage: "statusRejection",
  zusage: "statusAccepted",
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
  const t = useTranslations("step9");
  const tc = useTranslations("common");
  const {
    personalData,
    jobPosting,
    exportConfig,
    trackerEntries,
    setExportConfig,
    addTrackerEntry,
    removeTrackerEntry,
    updateTrackerEntry,
  } = store;

  const [isExporting, setIsExporting] = useState(false);
  const [emailExpanded, setEmailExpanded] = useState(false);

  const progress = Math.round((CURRENT_STEP / TOTAL_STEPS) * 100);

  const fileName = useMemo(
    () => buildExportFileName(personalData.lastName, jobPosting?.companyName, exportConfig.format),
    [personalData.lastName, jobPosting?.companyName, exportConfig.format],
  );

  const atsResult: ATSCheckResult = useMemo(() => {
    const state = useApplicationStore.getState();
    return runATSCheck(state);
  }, []);

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

      toast.success(t("exportSuccess"));
    } catch (error) {
      const message = error instanceof Error ? error.message : t("exportFailed");
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
      label: t("pdf"),
      description: t("pdfDescription"),
      icon: FileText,
    },
    {
      value: "zip",
      label: t("zip"),
      description: t("zipDescription"),
      icon: Archive,
    },
    {
      value: "json",
      label: t("json"),
      description: t("jsonDescription"),
      icon: Database,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ── Progress Bar ─────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {tc("stepOf", { current: CURRENT_STEP, total: TOTAL_STEPS })}: {t("title")}
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
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">{tc("tips")}</p>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                {[t("tip1"), t("tip2"), t("tip3")].map((tip) => (
                  <li key={tip}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* ── ATS-Kompatibilitätscheck ────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            ATS-Kompatibilitätsprüfung
          </h2>
          <Card className="p-6 space-y-4">
            {/* Score circle */}
            <div className="flex items-center gap-4">
              <div
                className={`flex flex-col items-center justify-center w-20 h-20 rounded-full border-4 ${
                  atsResult.score >= 80
                    ? "border-green-500 text-green-700 dark:text-green-400"
                    : atsResult.score >= 50
                      ? "border-yellow-500 text-yellow-700 dark:text-yellow-400"
                      : "border-red-500 text-red-700 dark:text-red-400"
                }`}
              >
                <span className="text-2xl font-bold">{atsResult.score}</span>
                <span className="text-xs">/100</span>
              </div>
              <div>
                <p className="font-medium">
                  {atsResult.score >= 80
                    ? "Sehr gute ATS-Kompatibilität"
                    : atsResult.score >= 50
                      ? "Verbesserungspotenzial"
                      : "Dringend optimieren"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {atsResult.checks.filter((c) => c.passed).length} von{" "}
                  {atsResult.checks.length} Prüfungen bestanden
                </p>
              </div>
            </div>
            {/* Check list */}
            <div className="space-y-2">
              {atsResult.checks.map((check) => (
                <div
                  key={check.name}
                  className={`flex items-start gap-2 text-sm rounded-md px-3 py-2 ${
                    check.severity === "error"
                      ? "bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300"
                      : check.severity === "warning"
                        ? "bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300"
                        : "bg-gray-50 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {check.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  ) : (
                    <X className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-medium">{check.name}:</span>{" "}
                    {check.message}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.section>

        {/* ── Section 9.1: Export-Format ─────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-lg font-semibold mb-4">{t("selectFormat")}</h2>

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
                <Label className="text-sm font-medium">{t("pdfMode")}</Label>
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
                    <span className="font-medium">{t("singleDocument")}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("singleDocumentDesc")}
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
                    <span className="font-medium">{t("applicationBundle")}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("applicationBundleDesc")}
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
                    {t("includeAttachments")}
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
          <h2 className="text-lg font-semibold mb-4">{t("download")}</h2>

          <Card className="p-6 space-y-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{t("fileName")}: </span>
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
                  {t("creating")}
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  {exportConfig.format === "pdf"
                    ? t("downloadPdf")
                    : exportConfig.format === "zip"
                      ? t("downloadZip")
                      : t("downloadJson")}
                </>
              )}
            </Button>
          </Card>
        </motion.section>

        {/* ── Section 9.3: E-Mail-Versand ───────────────── */}
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
              {t("sendByEmail")}
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
                <Card className="p-6 mt-4">
                  <EmailComposer />
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
          <h2 className="text-lg font-semibold mb-4">{t("tracker")}</h2>

          {trackerEntries.length === 0 ? (
            <Card className="p-6">
              <p className="text-sm text-muted-foreground text-center">
                {t("trackerEmpty")}
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
                    <select
                      value={entry.status}
                      onChange={(e) =>
                        updateTrackerEntry(entry.id, {
                          status: e.target.value as TrackerStatus,
                        })
                      }
                      className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer ${STATUS_COLORS[entry.status]}`}
                    >
                      {(Object.keys(STATUS_COLORS) as TrackerStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {t(STATUS_LABEL_KEYS[s])}
                        </option>
                      ))}
                    </select>
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
              {tc("back")}
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/phases/abschluss">
              {tc("finish")}
              <CheckCircle2 className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
