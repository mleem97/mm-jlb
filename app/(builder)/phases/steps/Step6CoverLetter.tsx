"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Info,
  Lightbulb,
  PenLine,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

import { useApplicationStore } from "@/store/applicationStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OnlineStatus } from "@/components/ui/online-status";
import { formatRelativeTime } from "@/lib/utils/relativeTime";
import {
  jobPostingFormSchema,
  coverLetterFormSchema,
  coverLetterMetaFormSchema,
  JOB_SOURCE_LABELS,
  jobSourceEnum,
  type JobPostingFormData,
  type CoverLetterMetaFormData,
} from "@/lib/schemas/coverLetterFormSchema";

import type { CoverLetterMode, CoverLetterTonality } from "@/types/coverLetter";

// ─── Constants ─────────────────────────────────────────────
const SUB_STEPS = [
  { id: 1, label: "Stelleninfos", icon: Briefcase },
  { id: 2, label: "Anschreiben", icon: PenLine },
  { id: 3, label: "Pflichtangaben", icon: CalendarDays },
] as const;

const NOTICE_PERIOD_OPTIONS = [
  "sofort",
  "2 Wochen",
  "4 Wochen",
  "6 Wochen",
  "3 Monate",
  "6 Monate",
  "Sonstiges",
] as const;

const TONALITY_OPTIONS: { value: CoverLetterTonality; label: string }[] = [
  { value: "formell", label: "Formell" },
  { value: "modern-professionell", label: "Modern-professionell" },
  { value: "kreativ", label: "Kreativ" },
];

const SMART_TIPS: Record<number, { title: string; tip: string }[]> = {
  1: [
    {
      title: "Firmenadresse im Anschreiben",
      tip: "Die Firmenadresse wird im Anschreiben als Empfänger verwendet. Achten Sie auf korrekte Schreibweise.",
    },
    {
      title: "Stellenbeschreibung analysieren",
      tip: "Fügen Sie den Stellentext ein — er hilft später bei der KI-gestützten Anschreibenerstellung.",
    },
  ],
  2: [
    {
      title: "Max. 1 DIN-A4-Seite",
      tip: "Ein gutes Anschreiben hat maximal eine DIN-A4-Seite (ca. 3.000 Zeichen).",
    },
    {
      title: "Vermeiden Sie Floskeln",
      tip: 'Seien Sie konkret statt allgemein. Statt "Ich bin teamfähig" lieber ein konkretes Beispiel nennen.',
    },
  ],
  3: [
    {
      title: "Gehaltsvorstellung als Spanne",
      tip: 'Gehaltsvorstellungen als Spanne angeben wirkt verhandlungsbereit, z.\u00a0B. "55.000\u00a0–\u00a065.000\u00a0€".',
    },
    {
      title: "Pflichtangaben seit 2026",
      tip: "Viele Arbeitgeber erwarten diese Angaben. Sie beschleunigen den Bewerbungsprozess.",
    },
  ],
};

const MAX_CHARS = 3000;

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

// ─── Sub-Step 6.1: Stelleninfos ────────────────────────────
function SubStepJobPosting({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const { jobPosting, setJobPosting } = useApplicationStore();

  const defaultValues: JobPostingFormData = {
    companyName: jobPosting?.companyName ?? "",
    companyStreet: jobPosting?.companyAddress?.street ?? "",
    companyZip: jobPosting?.companyAddress?.zip ?? "",
    companyCity: jobPosting?.companyAddress?.city ?? "",
    contactPerson: jobPosting?.contactPerson ?? "",
    jobTitle: jobPosting?.jobTitle ?? "",
    referenceNumber: jobPosting?.referenceNumber ?? "",
    source: jobPosting?.source,
    jobDescriptionText: jobPosting?.jobDescriptionText ?? "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobPostingFormData>({
    resolver: zodResolver(jobPostingFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = useCallback(
    (data: JobPostingFormData) => {
      setJobPosting({
        companyName: data.companyName,
        companyAddress:
          data.companyStreet || data.companyZip || data.companyCity
            ? {
                street: data.companyStreet || undefined,
                zip: data.companyZip || undefined,
                city: data.companyCity || undefined,
              }
            : undefined,
        contactPerson: data.contactPerson || undefined,
        jobTitle: data.jobTitle,
        referenceNumber: data.referenceNumber || undefined,
        source: data.source,
        jobDescriptionText: data.jobDescriptionText || undefined,
      });
      toast.success("Stelleninfos gespeichert");
      onComplete();
    },
    [setJobPosting, onComplete],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="companyName">
          Firmenname <span className="text-destructive">*</span>
        </Label>
        <Input
          id="companyName"
          placeholder="z. B. Musterfirma GmbH"
          {...register("companyName")}
        />
        {errors.companyName && (
          <p className="text-sm text-destructive">{errors.companyName.message}</p>
        )}
      </div>

      {/* Company Address */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Firmenadresse (optional)</legend>
        <div className="grid sm:grid-cols-[1fr_120px_1fr] gap-3">
          <div className="space-y-1">
            <Label htmlFor="companyStreet">Straße</Label>
            <Input
              id="companyStreet"
              placeholder="Musterstraße 1"
              {...register("companyStreet")}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="companyZip">PLZ</Label>
            <Input
              id="companyZip"
              placeholder="12345"
              {...register("companyZip")}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="companyCity">Ort</Label>
            <Input
              id="companyCity"
              placeholder="Berlin"
              {...register("companyCity")}
            />
          </div>
        </div>
      </fieldset>

      {/* Contact Person */}
      <div className="space-y-2">
        <Label htmlFor="contactPerson">Ansprechpartner (optional)</Label>
        <Input
          id="contactPerson"
          placeholder="z. B. Frau Müller"
          {...register("contactPerson")}
        />
      </div>

      {/* Job Title */}
      <div className="space-y-2">
        <Label htmlFor="jobTitle">
          Stellentitel <span className="text-destructive">*</span>
        </Label>
        <Input
          id="jobTitle"
          placeholder="z. B. Senior Frontend-Entwickler"
          {...register("jobTitle")}
        />
        {errors.jobTitle && (
          <p className="text-sm text-destructive">{errors.jobTitle.message}</p>
        )}
      </div>

      {/* Reference Number */}
      <div className="space-y-2">
        <Label htmlFor="referenceNumber">Referenznummer (optional)</Label>
        <Input
          id="referenceNumber"
          placeholder="z. B. REF-2026-042"
          {...register("referenceNumber")}
        />
      </div>

      {/* Source */}
      <div className="space-y-2">
        <Label htmlFor="source">Quelle (optional)</Label>
        <select id="source" className={selectClassName} {...register("source")}>
          <option value="">Bitte wählen…</option>
          {jobSourceEnum.options.map((value) => (
            <option key={value} value={value}>
              {JOB_SOURCE_LABELS[value]}
            </option>
          ))}
        </select>
      </div>

      {/* Job Description Text */}
      <div className="space-y-2">
        <Label htmlFor="jobDescriptionText">
          Stellenbeschreibung (optional)
        </Label>
        <Textarea
          id="jobDescriptionText"
          placeholder="Fügen Sie hier den Stellentext ein — er kann später für die KI-Analyse verwendet werden."
          rows={5}
          {...register("jobDescriptionText")}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" className="gap-2">
          Speichern & weiter
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}

// ─── Sub-Step 6.2: Anschreiben verfassen ───────────────────
function SubStepCoverLetterCompose({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const { coverLetter, setCoverLetter } = useApplicationStore();
  const [mode, setMode] = useState<CoverLetterMode>(coverLetter?.mode ?? "manual");

  // ─── AI stub state ──────────────────────────────────
  const [aiMotivation, setAiMotivation] = useState(
    coverLetter?.generationParams?.motivation ?? "",
  );
  const [aiStrengths, setAiStrengths] = useState(
    coverLetter?.generationParams?.strengths ?? "",
  );
  const [aiSpecialQualification, setAiSpecialQualification] = useState(
    coverLetter?.generationParams?.specialQualification ?? "",
  );
  const [aiTonality, setAiTonality] = useState<CoverLetterTonality>(
    coverLetter?.generationParams?.tonality ?? "modern-professionell",
  );

  // ─── Manual mode state ──────────────────────────────
  const [introduction, setIntroduction] = useState(coverLetter?.introduction ?? "");
  const [mainBody, setMainBody] = useState(coverLetter?.mainBody ?? "");
  const [closing, setClosing] = useState(coverLetter?.closing ?? "");

  const totalChars = introduction.length + mainBody.length + closing.length;

  const handleSaveManual = useCallback(() => {
    const result = coverLetterFormSchema.safeParse({
      mode: "manual",
      introduction,
      mainBody,
      closing,
    });

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      toast.error(firstIssue?.message ?? "Bitte alle Pflichtfelder ausfüllen");
      return;
    }

    setCoverLetter({
      mode: "manual",
      introduction,
      mainBody,
      closing,
      fullText: `${introduction}\n\n${mainBody}\n\n${closing}`,
    });
    toast.success("Anschreiben gespeichert");
    onComplete();
  }, [introduction, mainBody, closing, setCoverLetter, onComplete]);

  const handleSaveAi = useCallback(() => {
    setCoverLetter({
      mode: "ai",
      introduction: "",
      mainBody: "",
      closing: "",
      generationParams: {
        motivation: aiMotivation || undefined,
        strengths: aiStrengths || undefined,
        specialQualification: aiSpecialQualification || undefined,
        tonality: aiTonality,
      },
    });
    toast.success("KI-Parameter gespeichert");
    onComplete();
  }, [
    aiMotivation,
    aiStrengths,
    aiSpecialQualification,
    aiTonality,
    setCoverLetter,
    onComplete,
  ]);

  const handleGenerate = useCallback(() => {
    toast.info("KI-Integration kommt bald!", {
      description:
        "Die automatische Anschreibenerstellung wird in einer zukünftigen Version verfügbar sein.",
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setMode("ai")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "ai"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          KI-Assistent
        </button>
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            mode === "manual"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <PenLine className="w-4 h-4" />
          Manuell schreiben
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "ai" ? (
          <motion.div
            key="ai"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* AI Input Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aiMotivation">Ihre Motivation</Label>
                <Textarea
                  id="aiMotivation"
                  placeholder="Was motiviert Sie an dieser Stelle? Was reizt Sie am Unternehmen?"
                  rows={3}
                  value={aiMotivation}
                  onChange={(e) => setAiMotivation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiStrengths">Ihre Stärken</Label>
                <Textarea
                  id="aiStrengths"
                  placeholder="Welche relevanten Stärken bringen Sie mit? (z. B. Teamführung, analytisches Denken)"
                  rows={3}
                  value={aiStrengths}
                  onChange={(e) => setAiStrengths(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiSpecialQualification">
                  Besondere Qualifikation (optional)
                </Label>
                <Textarea
                  id="aiSpecialQualification"
                  placeholder="Gibt es etwas, das Sie von anderen Bewerbern abhebt?"
                  rows={2}
                  value={aiSpecialQualification}
                  onChange={(e) => setAiSpecialQualification(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiTonality">Tonalität</Label>
                <select
                  id="aiTonality"
                  className={selectClassName}
                  value={aiTonality}
                  onChange={(e) =>
                    setAiTonality(e.target.value as CoverLetterTonality)
                  }
                >
                  {TONALITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              type="button"
              onClick={handleGenerate}
              className="gap-2"
              variant="secondary"
            >
              <Sparkles className="w-4 h-4" />
              Generieren
            </Button>

            {/* Generated Text Placeholder */}
            <Card className="p-6 border-dashed">
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-8">
                <FileText className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm font-medium">
                  Hier erscheint Ihr generiertes Anschreiben
                </p>
                <p className="text-xs mt-1">
                  Die KI-Funktion wird in einer zukünftigen Version verfügbar
                  sein.
                </p>
              </div>
            </Card>

            <div className="flex justify-end pt-2">
              <Button type="button" onClick={handleSaveAi} className="gap-2">
                Parameter speichern & weiter
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="manual"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Introduction */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="introduction">
                  Einleitung <span className="text-destructive">*</span>
                </Label>
                <span className="text-xs text-muted-foreground">
                  {introduction.length} Zeichen
                </span>
              </div>
              <Textarea
                id="introduction"
                placeholder="Sehr geehrte/r Frau/Herr [Name], mit großem Interesse habe ich Ihre Stellenausschreibung als [Position] gelesen…"
                rows={4}
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
              />
              {introduction.length > 0 && introduction.length < 10 && (
                <p className="text-sm text-destructive">
                  Einleitung muss mindestens 10 Zeichen haben
                </p>
              )}
            </div>

            {/* Main Body */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="mainBody">
                  Hauptteil <span className="text-destructive">*</span>
                </Label>
                <span className="text-xs text-muted-foreground">
                  {mainBody.length} Zeichen
                </span>
              </div>
              <Textarea
                id="mainBody"
                placeholder="Beschreiben Sie Ihre relevante Berufserfahrung, Fähigkeiten und Erfolge. Gehen Sie auf die Anforderungen der Stellenausschreibung ein…"
                rows={8}
                value={mainBody}
                onChange={(e) => setMainBody(e.target.value)}
              />
              {mainBody.length > 0 && mainBody.length < 50 && (
                <p className="text-sm text-destructive">
                  Hauptteil muss mindestens 50 Zeichen haben
                </p>
              )}
              <Card className="p-3 bg-muted/50 border-none">
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <Lightbulb className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Tipps für den Hauptteil:</p>
                    <ul className="space-y-0.5 list-disc list-inside">
                      <li>Bezug zur Stellenausschreibung herstellen</li>
                      <li>Konkrete Beispiele und Erfolge nennen</li>
                      <li>Fachliche und soziale Kompetenzen belegen</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Closing */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="closing">
                  Schlusssatz <span className="text-destructive">*</span>
                </Label>
                <span className="text-xs text-muted-foreground">
                  {closing.length} Zeichen
                </span>
              </div>
              <Textarea
                id="closing"
                placeholder="Über die Einladung zu einem persönlichen Gespräch freue ich mich sehr. Für Rückfragen stehe ich Ihnen gerne zur Verfügung."
                rows={3}
                value={closing}
                onChange={(e) => setClosing(e.target.value)}
              />
              {closing.length > 0 && closing.length < 10 && (
                <p className="text-sm text-destructive">
                  Schlusssatz muss mindestens 10 Zeichen haben
                </p>
              )}
            </div>

            {/* Total Character Counter */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Gesamt: {totalChars} / {MAX_CHARS} Zeichen empfohlen
              </span>
              {totalChars > MAX_CHARS && (
                <Badge variant="destructive" className="text-xs">
                  Über dem Limit
                </Badge>
              )}
              {totalChars > 0 && totalChars <= MAX_CHARS && (
                <Badge variant="secondary" className="text-xs">
                  ≈ 1 DIN-A4-Seite
                </Badge>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button type="button" onClick={handleSaveManual} className="gap-2">
                Speichern & weiter
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-Step 6.3: Pflichtangaben 2026 ─────────────────────
function SubStepMeta({ onComplete }: { onComplete: () => void }) {
  const { coverLetterMeta, setCoverLetterMeta } = useApplicationStore();
  const [noticePeriodCustom, setNoticePeriodCustom] = useState(false);

  const defaultValues: CoverLetterMetaFormData = {
    entryDate: coverLetterMeta?.entryDate ?? "",
    salaryExpectation: coverLetterMeta?.salaryExpectation ?? "",
    noticePeriod: coverLetterMeta?.noticePeriod ?? "",
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {},
  } = useForm<CoverLetterMetaFormData>({
    resolver: zodResolver(coverLetterMetaFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Check if current value is a custom value
  const noticePeriodValue = watch("noticePeriod");
  useEffect(() => {
    if (
      noticePeriodValue &&
      !NOTICE_PERIOD_OPTIONS.includes(
        noticePeriodValue as (typeof NOTICE_PERIOD_OPTIONS)[number],
      )
    ) {
      setNoticePeriodCustom(true);
    }
  }, [noticePeriodValue]);

  const handleNoticePeriodSelect = (value: string) => {
    if (value === "Sonstiges") {
      setNoticePeriodCustom(true);
      setValue("noticePeriod", "", { shouldValidate: true });
    } else {
      setNoticePeriodCustom(false);
      setValue("noticePeriod", value, { shouldValidate: true });
    }
  };

  const onSubmit = useCallback(
    (data: CoverLetterMetaFormData) => {
      const hasData = data.entryDate || data.salaryExpectation || data.noticePeriod;
      setCoverLetterMeta(
        hasData
          ? {
              entryDate: data.entryDate || undefined,
              salaryExpectation: data.salaryExpectation || undefined,
              noticePeriod: data.noticePeriod || undefined,
            }
          : null,
      );
      toast.success("Pflichtangaben gespeichert");
      onComplete();
    },
    [setCoverLetterMeta, onComplete],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Info Box */}
      <div className="rounded-lg bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
          <div className="text-sm text-sky-800 dark:text-sky-300">
            <p className="font-medium mb-1">Pflichtangaben seit 2026</p>
            <p>
              Seit 2026 werden diese Angaben in vielen Stellenausschreibungen
              erwartet. Sie helfen dem Arbeitgeber, den Bewerbungsprozess
              effizienter zu gestalten.
            </p>
          </div>
        </div>
      </div>

      {/* Entry Date */}
      <div className="space-y-2">
        <Label htmlFor="entryDate">Frühestmögliches Eintrittsdatum</Label>
        <Input
          id="entryDate"
          type="date"
          {...register("entryDate")}
        />
      </div>

      {/* Salary Expectation */}
      <div className="space-y-2">
        <Label htmlFor="salaryExpectation">
          Gehaltsvorstellung (Brutto/Jahr, optional)
        </Label>
        <Input
          id="salaryExpectation"
          placeholder='z. B. 55.000 - 65.000 €'
          {...register("salaryExpectation")}
        />
        <p className="text-xs text-muted-foreground">
          Tipp: Eine Spanne signalisiert Verhandlungsbereitschaft.
        </p>
      </div>

      {/* Notice Period */}
      <div className="space-y-2">
        <Label htmlFor="noticePeriod">Kündigungsfrist</Label>
        {!noticePeriodCustom ? (
          <select
            id="noticePeriod"
            className={selectClassName}
            value={noticePeriodValue ?? ""}
            onChange={(e) => handleNoticePeriodSelect(e.target.value)}
          >
            <option value="">Bitte wählen…</option>
            {NOTICE_PERIOD_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <div className="flex gap-2">
            <Input
              id="noticePeriod"
              placeholder="z. B. zum Quartalsende"
              {...register("noticePeriod")}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setNoticePeriodCustom(false);
                setValue("noticePeriod", "", { shouldValidate: true });
              }}
            >
              Zurück
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" className="gap-2">
          Speichern & abschließen
          <CheckCircle2 className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}

// ═══════════════════════════════════════════════════════════
//  Main Component: Step6CoverLetter
// ═══════════════════════════════════════════════════════════
export default function Step6CoverLetter() {
  const router = useRouter();
  const { lastSaved } = useApplicationStore();
  const [activeSubStep, setActiveSubStep] = useState(1);
  const [lastSavedText, setLastSavedText] = useState("");

  // Update "last saved" text periodically
  useEffect(() => {
    const update = () => setLastSavedText(formatRelativeTime(lastSaved));
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, [lastSaved]);

  const currentTips = SMART_TIPS[activeSubStep] ?? [];
  const currentTip = currentTips[0];

  const handleSubStepComplete = useCallback(() => {
    setActiveSubStep((prev) => (prev < 3 ? prev + 1 : prev));
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* ─── Progress Bar ─────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Schritt 6 von 9: Anschreiben
          </span>
          <span className="text-sm text-muted-foreground">67%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-[67%] transition-all duration-300" />
        </div>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        {/* ─── Sidebar ──────────────────────────────── */}
        <Card className="p-6 h-fit sticky top-6 space-y-4">
          {/* Smart Tips */}
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-sky-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">{currentTip?.title}</h3>
              <p className="text-sm text-muted-foreground">{currentTip?.tip}</p>
            </div>
          </div>

          {currentTips.length > 1 && (
            <div className="space-y-2">
              {currentTips.slice(1).map((t) => (
                <div key={t.title} className="flex items-start gap-3">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium">{t.title}</h4>
                    <p className="text-xs text-muted-foreground">{t.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Privacy badges */}
          <div className="space-y-2 text-sm border-t pt-3">
            {[
              "100% lokal gespeichert",
              "Keine Server-Übertragung",
              "Jederzeit löschbar",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Last saved + online status */}
          <div className="border-t pt-3 flex items-center justify-between gap-2">
            {lastSaved ? (
              <p className="text-xs text-muted-foreground">
                Zuletzt gespeichert: {lastSavedText}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Noch nicht gespeichert</p>
            )}
            <OnlineStatus />
          </div>
        </Card>

        {/* ─── Main Content ─────────────────────────── */}
        <div className="space-y-8">
          {/* Sub-Step Tabs */}
          <div className="flex gap-1 border-b">
            {SUB_STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = activeSubStep === step.id;
              const isCompleted = activeSubStep > step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveSubStep(step.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                    isActive
                      ? "border-primary text-primary"
                      : isCompleted
                        ? "border-emerald-500 text-emerald-600 hover:text-emerald-700"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{step.id}</span>
                </button>
              );
            })}
          </div>

          {/* Sub-Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeSubStep === 1 && (
                <SubStepJobPosting onComplete={handleSubStepComplete} />
              )}
              {activeSubStep === 2 && (
                <SubStepCoverLetterCompose onComplete={handleSubStepComplete} />
              )}
              {activeSubStep === 3 && (
                <SubStepMeta
                  onComplete={() => {
                    router.push("/phases/layout-design");
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* ─── Navigation ──────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/phases/zertifikate")}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Zurück
            </Button>

            <Button
              type="button"
              size="lg"
              onClick={() => router.push("/phases/layout-design")}
              className="gap-2"
            >
              Weiter
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
