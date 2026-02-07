"use client";

import { useCallback, useMemo, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ─── Confetti Particle ──────────────────────────────────
const CONFETTI_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316",
  "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#a855f7",
];

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  shape: "circle" | "square";
}

interface ConfettiPieceWithDelay extends ConfettiPiece {
  delay: number;
}

function generateConfetti(count: number): ConfettiPieceWithDelay[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 600,
    y: (Math.random() - 0.5) * 600 - 200,
    rotation: Math.random() * 720 - 360,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() * 8 + 4,
    shape: Math.random() > 0.5 ? "circle" : "square",
    delay: Math.random() * 0.3,
  }));
}

// ─── Feedback Stars ─────────────────────────────────────
const FEEDBACK_KEY = "jlb-builder-feedback";

function FeedbackStars() {
  const [rating, setRating] = useState(() => {
    if (typeof window === "undefined") return 0;
    const stored = localStorage.getItem(FEEDBACK_KEY);
    return stored ? parseInt(stored, 10) : 0;
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
        <span>Danke!</span>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm text-muted-foreground">
        War dieser Builder hilfreich?
      </span>
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => {
          const value = i + 1;
          return (
            <button
              key={i}
              onClick={() => handleRate(value)}
              onMouseEnter={() => setHoveredStar(value)}
              onMouseLeave={() => setHoveredStar(0)}
              className="p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              aria-label={`${value} Stern${value > 1 ? "e" : ""}`}
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  value <= (hoveredStar || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/40"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────
export default function Step10Complete() {
  const router = useRouter();
  const personalData = useApplicationStore((s) => s.personalData);
  const jobPosting = useApplicationStore((s) => s.jobPosting);
  const coverLetter = useApplicationStore((s) => s.coverLetter);
  const attachments = useApplicationStore((s) => s.attachments);
  const exportConfig = useApplicationStore((s) => s.exportConfig);
  const documentSelection = useApplicationStore((s) => s.documentSelection);
  const resetApplication = useApplicationStore((s) => s.resetApplication);

  const confetti = useMemo(() => generateConfetti(28), []);
  const completionDate = useMemo(() => new Date(), []);

  const fullName = useMemo(() => {
    const parts = [personalData.firstName, personalData.lastName].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : "Nicht angegeben";
  }, [personalData.firstName, personalData.lastName]);

  const documentsCreated = useMemo(() => {
    const docs: string[] = [];
    if (documentSelection.includeCV) docs.push("Lebenslauf");
    if (documentSelection.includeCoverLetter && coverLetter) docs.push("Anschreiben");
    if (documentSelection.includeCoverPage) docs.push("Deckblatt");
    if (attachments.length > 0)
      docs.push(`${attachments.length} Anhang${attachments.length > 1 ? "e" : ""}`);
    return docs;
  }, [documentSelection, coverLetter, attachments]);

  const formatLabel = useMemo(() => {
    const labels: Record<string, string> = {
      pdf: "PDF",
      zip: "ZIP-Archiv",
      json: "JSON",
    };
    return labels[exportConfig.format] ?? exportConfig.format.toUpperCase();
  }, [exportConfig.format]);

  const handleNewApplication = useCallback(() => {
    resetApplication();
    router.push("/intro");
  }, [resetApplication, router]);

  const handleDuplicate = useCallback(() => {
    toast.info("Duplizierung kommt bald", {
      description: "Diese Funktion wird in Kürze verfügbar sein.",
    });
  }, []);

  const handleDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  const handleReExport = useCallback(() => {
    router.push("/phases/export");
  }, [router]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* ── Success Animation ───────────────────────── */}
      <div className="relative flex flex-col items-center justify-center py-12 overflow-hidden">
        {/* Confetti */}
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
            initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
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

        {/* Checkmark circle */}
        <motion.div
          className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
          >
            <Check className="w-12 h-12 text-green-600 dark:text-green-400" strokeWidth={3} />
          </motion.div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="mt-6 text-2xl sm:text-3xl font-bold text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          🎉 Bewerbung erfolgreich erstellt!
        </motion.h1>
        <motion.p
          className="mt-2 text-muted-foreground text-center max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Alle Dokumente wurden generiert und stehen zum Export bereit.
        </motion.p>
      </div>

      {/* ── Summary Card ────────────────────────────── */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Zusammenfassung</h2>

          <div className="grid gap-3 text-sm">
            <div className="flex items-start gap-3">
              <FileText className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <span className="text-muted-foreground">Name:</span>{" "}
                <span className="font-medium">{fullName}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <span className="text-muted-foreground">Unternehmen:</span>{" "}
                <span className="font-medium">
                  {jobPosting?.companyName || "Nicht angegeben"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Briefcase className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <span className="text-muted-foreground">Stellentitel:</span>{" "}
                <span className="font-medium">
                  {jobPosting?.jobTitle || "Nicht angegeben"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Paperclip className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <span className="text-muted-foreground">Dokumente:</span>{" "}
                <span className="font-medium">
                  {documentsCreated.length > 0
                    ? documentsCreated.join(", ")
                    : "Keine Dokumente ausgewählt"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Download className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <div>
                <span className="text-muted-foreground">Exportformat:</span>{" "}
                <Badge variant="secondary" className="ml-1">
                  {formatLabel}
                </Badge>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t text-xs text-muted-foreground">
            Abgeschlossen am{" "}
            {completionDate.toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}{" "}
            um{" "}
            {completionDate.toLocaleTimeString("de-DE", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            Uhr
          </div>
        </Card>
      </motion.div>

      {/* ── Quick Actions ───────────────────────────── */}
      <motion.div
        className="grid gap-3 sm:grid-cols-2"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <Button
          onClick={handleNewApplication}
          variant="default"
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Neue Bewerbung starten
        </Button>

        <Button onClick={handleDuplicate} variant="outline" className="gap-2">
          <Copy className="h-4 w-4" />
          Bewerbung duplizieren
        </Button>

        <Button onClick={handleDashboard} variant="outline" className="gap-2">
          <LayoutDashboard className="h-4 w-4" />
          Alle Bewerbungen anzeigen
        </Button>

        <Button onClick={handleReExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export wiederholen
        </Button>
      </motion.div>

      {/* ── Feedback ────────────────────────────────── */}
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
