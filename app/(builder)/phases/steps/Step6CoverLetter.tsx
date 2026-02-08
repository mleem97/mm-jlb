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
  Settings,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

import { useApplicationStore } from "@/store/applicationStore";
import { useTranslations } from "@/i18n/client";
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
import { useCompletion } from "@ai-sdk/react";
import { AISettings, useAIConfig } from "@/components/features/AISettings";
import { buildSystemPrompt, buildUserPrompt, parseGeneratedCoverLetter } from "@/lib/ai/prompts";

// ─── Constants ─────────────────────────────────────────────
const SUB_STEPS = [
  { id: 1, key: "subStepJobInfo", icon: Briefcase },
  { id: 2, key: "subStepCoverLetter", icon: PenLine },
  { id: 3, key: "subStepMandatory", icon: CalendarDays },
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

const TONALITY_OPTIONS: { value: CoverLetterTonality; key: string }[] = [
  { value: "formell", key: "formal" },
  { value: "modern-professionell", key: "modernProfessional" },
  { value: "kreativ", key: "creative" },
];

const SMART_TIPS: Record<number, { titleKey: string; tipKey: string }[]> = {
  1: [
    { titleKey: "tipCompanyAddressTitle", tipKey: "tipCompanyAddress" },
    { titleKey: "tipJobDescriptionTitle", tipKey: "tipJobDescription" },
  ],
  2: [
    { titleKey: "tipMaxPageTitle", tipKey: "tipMaxPage" },
    { titleKey: "tipNoClichesTitle", tipKey: "tipNoClichesDesc" },
  ],
  3: [
    { titleKey: "tipSalaryRangeTitle", tipKey: "tipSalaryRange" },
    { titleKey: "tipMandatoryTitle", tipKey: "tipMandatory" },
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
  const t = useTranslations("step6");
  const tc = useTranslations("common");

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
      toast.success(t("jobInfoSaved"));
      onComplete();
    },
    [setJobPosting, onComplete],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="companyName">
          {t("companyName")} <span className="text-destructive">*</span>
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
        <legend className="text-sm font-medium">{t("companyAddress")}</legend>
        <div className="grid sm:grid-cols-[1fr_120px_1fr] gap-3">
          <div className="space-y-1">
            <Label htmlFor="companyStreet">{t("street")}</Label>
            <Input
              id="companyStreet"
              placeholder="Musterstraße 1"
              {...register("companyStreet")}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="companyZip">{t("zip")}</Label>
            <Input
              id="companyZip"
              placeholder="12345"
              {...register("companyZip")}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="companyCity">{t("city")}</Label>
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
        <Label htmlFor="contactPerson">{t("contactPerson")}</Label>
        <Input
          id="contactPerson"
          placeholder="z. B. Frau Müller"
          {...register("contactPerson")}
        />
      </div>

      {/* Job Title */}
      <div className="space-y-2">
        <Label htmlFor="jobTitle">
          {t("jobTitle")} <span className="text-destructive">*</span>
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
        <Label htmlFor="referenceNumber">{t("referenceNumber")}</Label>
        <Input
          id="referenceNumber"
          placeholder="z. B. REF-2026-042"
          {...register("referenceNumber")}
        />
      </div>

      {/* Source */}
      <div className="space-y-2">
        <Label htmlFor="source">{t("source")}</Label>
        <select id="source" className={selectClassName} {...register("source")}>
          <option value="">{tc("pleaseSelect")}</option>
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
          {t("jobDescription")}
        </Label>
        <Textarea
          id="jobDescriptionText"
          placeholder={t("jobDescriptionPlaceholder")}
          rows={5}
          {...register("jobDescriptionText")}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" className="gap-2">
          {tc("saveAndContinue")}
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
  const t = useTranslations("step6");
  const tc = useTranslations("common");
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
      toast.error(firstIssue?.message ?? t("fillRequired"));
      return;
    }

    setCoverLetter({
      mode: "manual",
      introduction,
      mainBody,
      closing,
      fullText: `${introduction}\n\n${mainBody}\n\n${closing}`,
    });
    toast.success(t("coverLetterSaved"));
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
    toast.success(t("aiParamsSaved"));
    onComplete();
  }, [
    aiMotivation,
    aiStrengths,
    aiSpecialQualification,
    aiTonality,
    setCoverLetter,
    onComplete,
  ]);

  // ─── AI Settings & Generation ──────────────────────
  const { config: aiConfig } = useAIConfig();
  const [showAISettings, setShowAISettings] = useState(false);
  const [generatedText, setGeneratedText] = useState("");

  const { personalData, jobPosting, workExperience, skills, education } = useApplicationStore();

  const { complete, isLoading: isGenerating, error: aiError } = useCompletion({
    api: "/api/ai/generate",
    streamProtocol: "text",
    body: {
      provider: aiConfig.provider,
      apiKey: aiConfig.apiKey,
      model: aiConfig.model,
      baseURL: aiConfig.baseURL,
    },
    onFinish: (_prompt: string, completion: string) => {
      setGeneratedText(completion);
      const parsed = parseGeneratedCoverLetter(completion);
      setIntroduction(parsed.introduction);
      setMainBody(parsed.mainBody);
      setClosing(parsed.closing);
      toast.success(t("coverLetterGenerated"));
    },
    onError: (err: Error) => {
      toast.error(err.message || t("aiError"));
    },
  });

  const handleGenerate = useCallback(async () => {
    if (!aiConfig.apiKey) {
      toast.error(t("apiKeyMissing"), {
        action: {
          label: t("settingsLabel"),
          onClick: () => setShowAISettings(true),
        },
      });
      return;
    }

    if (!jobPosting?.jobTitle || !jobPosting?.companyName) {
      toast.error(t("fillJobInfoFirst"));
      return;
    }

    const systemPrompt = buildSystemPrompt(aiTonality);
    const userPrompt = buildUserPrompt({
      firstName: personalData.firstName,
      lastName: personalData.lastName,
      jobTitle: jobPosting.jobTitle,
      companyName: jobPosting.companyName,
      contactPerson: jobPosting.contactPerson,
      jobDescription: jobPosting.jobDescriptionText,
      motivation: aiMotivation || undefined,
      strengths: aiStrengths || undefined,
      specialQualification: aiSpecialQualification || undefined,
      workExperience: workExperience.map(
        (w: { jobTitle: string; company: string; startDate: string; endDate?: string }) => `${w.jobTitle} bei ${w.company} (${w.startDate}–${w.endDate ?? "heute"})`,
      ),
      skills: skills.map((s) => s.name),
      education: education.map(
        (e) => `${e.degree} ${e.fieldOfStudy ?? ""} - ${e.institution} (${e.startDate}–${e.endDate ?? "heute"})`,
      ),
    });

    await complete(userPrompt, {
      body: {
        provider: aiConfig.provider,
        apiKey: aiConfig.apiKey,
        model: aiConfig.model,
        systemPrompt,
        userPrompt,
      },
    });
  }, [
    aiConfig,
    aiTonality,
    aiMotivation,
    aiStrengths,
    aiSpecialQualification,
    personalData,
    jobPosting,
    workExperience,
    skills,
    education,
    complete,
  ]);

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
          {t("ai")}
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
          {t("manual")}
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
                <Label htmlFor="aiMotivation">{t("motivation")}</Label>
                <Textarea
                  id="aiMotivation"
                  placeholder={t("motivationPlaceholder")}
                  rows={3}
                  value={aiMotivation}
                  onChange={(e) => setAiMotivation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiStrengths">{t("strengths")}</Label>
                <Textarea
                  id="aiStrengths"
                  placeholder={t("strengthsPlaceholder")}
                  rows={3}
                  value={aiStrengths}
                  onChange={(e) => setAiStrengths(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiSpecialQualification">
                  {t("specialQualification")}
                </Label>
                <Textarea
                  id="aiSpecialQualification"
                  placeholder={t("specialQualificationPlaceholder")}
                  rows={2}
                  value={aiSpecialQualification}
                  onChange={(e) => setAiSpecialQualification(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiTonality">{t("tonality")}</Label>
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
                      {t(opt.key)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={handleGenerate}
                className="gap-2"
                variant="secondary"
                disabled={isGenerating}
              >
                <Sparkles className="w-4 h-4" />
                {isGenerating ? t("generating") : t("generate")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAISettings(true)}
                className="gap-1.5"
              >
                <Settings className="w-4 h-4" />
                {t("aiSettings")}
              </Button>
            </div>

            {/* AI Error Display */}
            {aiError ? (
              <Card className="p-4 border-destructive bg-destructive/5">
                <p className="text-sm text-destructive">{aiError.message}</p>
              </Card>
            ) : null}

            {/* Generated Text or Placeholder */}
            {generatedText || isGenerating ? (
              <Card className="p-6">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {isGenerating ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span className="text-sm">{t("aiGenerating")}</span>
                    </div>
                  ) : null}
                  <div className="whitespace-pre-wrap">{generatedText}</div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 border-dashed">
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-8">
                  <FileText className="w-10 h-10 mb-3 opacity-40" />
                  <p className="text-sm font-medium">
                    {t("generatedPreviewTitle")}
                  </p>
                  <p className="text-xs mt-1">
                    {t("generatedPreviewHint")}
                  </p>
                </div>
              </Card>
            )}

            {/* AI Settings Dialog */}
            <AISettings open={showAISettings} onClose={() => setShowAISettings(false)} />

            <div className="flex justify-end pt-2">
              <Button type="button" onClick={handleSaveAi} className="gap-2">
                {t("saveParamsAndContinue")}
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
                  {t("introduction")} <span className="text-destructive">*</span>
                </Label>
                <span className="text-xs text-muted-foreground">
                  {t("characterCount", { count: introduction.length })}
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
                  {t("introMinChars")}
                </p>
              )}
            </div>

            {/* Main Body */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="mainBody">
                  {t("mainBody")} <span className="text-destructive">*</span>
                </Label>
                <span className="text-xs text-muted-foreground">
                  {t("characterCount", { count: mainBody.length })}
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
                  {t("mainBodyMinChars")}
                </p>
              )}
              <Card className="p-3 bg-muted/50 border-none">
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <Lightbulb className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-1">{t("mainBodyTipsTitle")}</p>
                    <ul className="space-y-0.5 list-disc list-inside">
                      <li>{t("mainBodyTip1")}</li>
                      <li>{t("mainBodyTip2")}</li>
                      <li>{t("mainBodyTip3")}</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Closing */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="closing">
                  {t("closing")} <span className="text-destructive">*</span>
                </Label>
                <span className="text-xs text-muted-foreground">
                  {t("characterCount", { count: closing.length })}
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
                  {t("closingMinChars")}
                </p>
              )}
            </div>

            {/* Total Character Counter */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t("charsRecommended", { current: totalChars, max: MAX_CHARS })}
              </span>
              {totalChars > MAX_CHARS && (
                <Badge variant="destructive" className="text-xs">
                  {tc("overLimit")}
                </Badge>
              )}
              {totalChars > 0 && totalChars <= MAX_CHARS && (
                <Badge variant="secondary" className="text-xs">
                  {t("approxOnePage")}
                </Badge>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <Button type="button" onClick={handleSaveManual} className="gap-2">
                {tc("saveAndContinue")}
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
  const t = useTranslations("step6");
  const tc = useTranslations("common");
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
    if (value === "Sonstiges" || value === "__custom__") {
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
      toast.success(t("mandatoryInfoSaved"));
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
            <p className="font-medium mb-1">{t("mandatoryInfoTitle")}</p>
            <p>
              {t("mandatoryInfoDescription")}
            </p>
          </div>
        </div>
      </div>

      {/* Entry Date */}
      <div className="space-y-2">
        <Label htmlFor="entryDate">{t("entryDate")}</Label>
        <Input
          id="entryDate"
          type="date"
          {...register("entryDate")}
        />
      </div>

      {/* Salary Expectation */}
      <div className="space-y-2">
        <Label htmlFor="salaryExpectation">
          {t("salaryExpectation")}
        </Label>
        <Input
          id="salaryExpectation"
          placeholder='z. B. 55.000 - 65.000 €'
          {...register("salaryExpectation")}
        />
        <p className="text-xs text-muted-foreground">
          {t("salaryTip")}
        </p>
      </div>

      {/* Notice Period */}
      <div className="space-y-2">
        <Label htmlFor="noticePeriod">{t("noticePeriod")}</Label>
        {!noticePeriodCustom ? (
          <select
            id="noticePeriod"
            className={selectClassName}
            value={noticePeriodValue ?? ""}
            onChange={(e) => handleNoticePeriodSelect(e.target.value)}
          >
            <option value="">{tc("pleaseSelect")}</option>
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
              {tc("back")}
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" className="gap-2">
          {tc("saveAndFinish")}
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
  const t = useTranslations("step6");
  const tc = useTranslations("common");
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
            {tc("stepOf", { current: 6, total: 9 })}: {t("title")}
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
              <h3 className="font-semibold mb-1">{currentTip ? t(currentTip.titleKey) : null}</h3>
              <p className="text-sm text-muted-foreground">{currentTip ? t(currentTip.tipKey) : null}</p>
            </div>
          </div>

          {currentTips.length > 1 && (
            <div className="space-y-2">
              {currentTips.slice(1).map((tip) => (
                <div key={tip.titleKey} className="flex items-start gap-3">
                  <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium">{t(tip.titleKey)}</h4>
                    <p className="text-xs text-muted-foreground">{t(tip.tipKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Privacy badges */}
          <div className="space-y-2 text-sm border-t pt-3">
            {[
              tc("locallyStored"),
              tc("noServerTransfer"),
              tc("deletableAnytime"),
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
                {tc("lastSaved")}: {lastSavedText}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">{tc("notSavedYet")}</p>
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
                  <span className="hidden sm:inline">{t(step.key)}</span>
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
              {tc("back")}
            </Button>

            <Button
              type="button"
              size="lg"
              onClick={() => router.push("/phases/layout-design")}
              className="gap-2"
            >
              {tc("next")}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
