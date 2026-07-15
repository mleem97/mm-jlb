"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Check,
  Briefcase,
  FileText,
  Paperclip,
  Copy,
  RotateCcw,
  LayoutDashboard,
  Download,
  Star,
} from "lucide-react";
import { toast } from "sonner";

import { useApplicationStore } from "@/store/applicationStore";
import { useTranslations } from "@/i18n/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CONFETTI_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#a855f7",
];

interface ConfettiPiece {
  id: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  shape: "circle" | "square";
  delay: number;
}

function secureRandom(): number {
  if (typeof globalThis.crypto === "undefined") return 0.5;

  const values = new Uint32Array(1);
  globalThis.crypto.getRandomValues(values);
  return values[0] / 2 ** 32;
}

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `confetti-${index}`,
    x: (secureRandom() - 0.5) * 600,
    y: (secureRandom() - 0.5) * 600 - 200,
    rotation: secureRandom() * 720 - 360,
    color:
      CONFETTI_COLORS[
        Math.floor(secureRandom() * CONFETTI_COLORS.length)
      ],
    size: secureRandom() * 8 + 4,
    shape: secureRandom() > 0.5 ? "circle" : "square",
    delay: secureRandom() * 0.3,
  }));
}

const FEEDBACK_KEY = "jlb-builder-feedback";
const FEEDBACK_VALUES = [1, 2, 3, 4, 5] as const;

function FeedbackStars() {
  const t = useTranslations("step10");
  const [rating, setRating] = useState(() => {
    if (typeof window === "undefined") return 0;
    const stored = localStorage.getItem(FEEDBACK_KEY);
    return stored ? Number.parseInt(stored, 10) : 0;
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitted, setSubmitted] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(FEEDBACK_KEY) !== null;
  });

  const handleRate = useCallback((value: number) => {
    setRating(value);
    setSubmitted(true);
    localStorage.setItem(FEEDBACK_KEY, String(value));
    toast.success("Vielen Dank für dein Feedback! ⭐");
  }, []);

  if (submitted) {
    return (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <span>{t("feedbackThanksShort")}</span>
        {FEEDBACK_VALUES.map((value) => (
          <Star
            key={value}
            className={`size-4 ${value <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {t("feedbackQuestion")}
      </span>
      <div className="flex gap-1">
        {FEEDBACK_VALUES.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              handleRate(value);
            }}
            onMouseEnter={() => {
              setHoveredStar(value);
            }}
            onMouseLeave={() => {
              setHoveredStar(0);
            }}
            className="rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`${value} Stern${value > 1 ? "e" : ""}`}
          >
            <Star
              className={`size-6 transition-colors ${
                value <= (hoveredStar || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/40"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Step10Complete() {
  const { push } = useRouter();
  const t = useTranslations("step10");
  const personalData = useApplicationStore((state) => state.personalData);
  const jobPosting = useApplicationStore((state) => state.jobPosting);
  const coverLetter = useApplicationStore((state) => state.coverLetter);
  const attachments = useApplicationStore((state) => state.attachments);
  const exportConfig = useApplicationStore((state) => state.exportConfig);
  const documentSelection = useApplicationStore(
    (state) => state.documentSelection,
  );
  const resetApplication = useApplicationStore(
    (state) => state.resetApplication,
  );
  const [completionDate, setCompletionDate] = useState<Date | null>(null);

  const confetti = useMemo(() => generateConfetti(28), []);

  useEffect(() => {
    setCompletionDate(new Date());
  }, []);

  const fullName = useMemo(() => {
    const parts = [personalData.firstName, personalData.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : t("notSpecified");
  }, [personalData.firstName, personalData.lastName, t]);

  const documentsCreated = useMemo(() => {
    const documents: string[] = [];
    if (documentSelection.includeCV) documents.push(t("cvLabel"));
    if (documentSelection.includeCoverLetter && coverLetter) {
      documents.push(t("coverLetterLabel"));
    }
    if (documentSelection.includeCoverPage) documents.push(t("coverPageLabel"));
    if (attachments.length > 0) {
      documents.push(
        attachments.length > 1
          ? t("attachmentsCount", { count: attachments.length })
          : t("attachmentCount", { count: attachments.length }),
      );
    }
    return documents;
  }, [documentSelection, coverLetter, attachments, t]);

  const formatLabel = useMemo(() => {
    switch (exportConfig.format) {
      case "pdf":
        return "PDF";
      case "zip":
        return t("zipArchive");
      case "json":
        return "JSON";
      default:
        return String(exportConfig.format).toUpperCase();
    }
  }, [exportConfig.format, t]);

  const handleNewApplication = useCallback(() => {
    resetApplication();
    push("/intro");
  }, [resetApplication, push]);

  const handleDuplicate = useCallback(() => {
    toast.info("Duplizierung kommt bald", {
      description: "Diese Funktion wird in Kürze verfügbar sein.",
    });
  }, []);

  const handleDashboard = useCallback(() => {
    push("/dashboard");
  }, [push]);

  const handleReExport = useCallback(() => {
    push("/phases/export");
  }, [push]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="relative flex flex-col items-center justify-center py-12 overflow-hidden">
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute"
            style={{
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              borderRadius: piece.shape === "circle" ? "50%" : "2px",
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.95, rotate: 0 }}
            animate={{
              x: piece.x,
              y: piece.y,
              opacity: 0,
              scale: 1,
              rotate: piece.rotation,
            }}
            transition={{
              duration: 1.4,
              ease: "easeOut",
              delay: piece.delay,
            }}
          />
        ))}

        <motion.div
          className="relative z-10 flex size-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
          >
            <Check className="size-12 text-green-600 dark:text-green-400" strokeWidth={3} />
          </motion.div>
        </motion.div>

        <motion.h1
          className="mt-6 text-2xl sm:text-3xl font-semibold text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {t("successHeading")}
        </motion.h1>
        <motion.p
          className="mt-2 text-muted-foreground text-center max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {t("successSubtext")}
        </motion.p>
      </div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">{t("summary")}</h2>

          <div className="grid gap-3 text-sm">
            <div className="flex items-start gap-3">
              <FileText className="size-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <span className="text-muted-foreground">{t("nameLabel")}</span>{" "}
                <span className="font-medium">{fullName}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="size-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <span className="text-muted-foreground">{t("companyLabel")}</span>{" "}
                <span className="font-medium">
                  {jobPosting?.companyName || t("notSpecified")}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="size-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <span className="text-muted-foreground">{t("jobTitleLabel")}</span>{" "}
                <span className="font-medium">
                  {jobPosting?.jobTitle || t("notSpecified")}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Paperclip className="size-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <span className="text-muted-foreground">{t("documentsLabel")}</span>{" "}
                <span className="font-medium">
                  {documentsCreated.length > 0
                    ? documentsCreated.join(", ")
                    : t("noDocsSelected")}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Download className="size-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <span className="text-muted-foreground">
                  {t("exportFormatLabel")}
                </span>{" "}
                <Badge variant="secondary" className="ml-1">
                  {formatLabel}
                </Badge>
              </div>
            </div>
          </div>

          {completionDate ? (
            <div className="pt-3 border-t text-xs text-muted-foreground">
              {t("completedAt", {
                date: completionDate.toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }),
                time: completionDate.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              })}
            </div>
          ) : null}
        </Card>
      </motion.div>

      <motion.div
        className="grid gap-3 sm:grid-cols-2"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <Button onClick={handleNewApplication} variant="default" className="gap-2">
          <RotateCcw className="size-4" />
          {t("newApplication")}
        </Button>

        <Button onClick={handleDuplicate} variant="outline" className="gap-2">
          <Copy className="size-4" />
          {t("duplicateApplication")}
        </Button>

        <Button onClick={handleDashboard} variant="outline" className="gap-2">
          <LayoutDashboard className="size-4" />
          {t("showAllApplications")}
        </Button>

        <Button onClick={handleReExport} variant="outline" className="gap-2">
          <Download className="size-4" />
          {t("reExport")}
        </Button>
      </motion.div>

      <motion.div
        className="flex justify-center pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        <FeedbackStars />
      </motion.div>
    </div>
  );
}
