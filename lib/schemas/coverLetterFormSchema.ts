import { z } from "zod";

// ─── Job Source enum ───────────────────────────────────────
export const jobSourceEnum = z.enum([
  "website",
  "linkedin",
  "indeed",
  "stepstone",
  "empfehlung",
  "sonstiges",
]);

export const JOB_SOURCE_LABELS: Record<z.infer<typeof jobSourceEnum>, string> = {
  website: "Webseite",
  linkedin: "LinkedIn",
  indeed: "Indeed",
  stepstone: "StepStone",
  empfehlung: "Empfehlung",
  sonstiges: "Sonstiges",
};

// ─── Job Posting Form Schema ───────────────────────────────
export const jobPostingFormSchema = z.object({
  companyName: z
    .string()
    .min(2, "Firmenname muss mindestens 2 Zeichen haben"),
  companyStreet: z.string().optional().or(z.literal("")),
  companyZip: z.string().optional().or(z.literal("")),
  companyCity: z.string().optional().or(z.literal("")),
  contactPerson: z.string().optional().or(z.literal("")),
  jobTitle: z
    .string()
    .min(2, "Stellentitel muss mindestens 2 Zeichen haben"),
  referenceNumber: z.string().optional().or(z.literal("")),
  source: jobSourceEnum.optional(),
  jobDescriptionText: z.string().optional().or(z.literal("")),
});

export type JobPostingFormData = z.infer<typeof jobPostingFormSchema>;

// ─── Cover Letter Mode ─────────────────────────────────────
export const coverLetterModeEnum = z.enum(["ai", "manual"]);

// ─── Cover Letter Form Schema ──────────────────────────────
export const coverLetterFormSchema = z
  .object({
    mode: coverLetterModeEnum,
    introduction: z.string().optional().or(z.literal("")),
    mainBody: z.string().optional().or(z.literal("")),
    closing: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.mode === "manual") {
        return !!data.introduction && data.introduction.length >= 10;
      }
      return true;
    },
    {
      message: "Einleitung muss mindestens 10 Zeichen haben",
      path: ["introduction"],
    },
  )
  .refine(
    (data) => {
      if (data.mode === "manual") {
        return !!data.mainBody && data.mainBody.length >= 50;
      }
      return true;
    },
    {
      message: "Hauptteil muss mindestens 50 Zeichen haben",
      path: ["mainBody"],
    },
  )
  .refine(
    (data) => {
      if (data.mode === "manual") {
        return !!data.closing && data.closing.length >= 10;
      }
      return true;
    },
    {
      message: "Schlusssatz muss mindestens 10 Zeichen haben",
      path: ["closing"],
    },
  );

export type CoverLetterFormData = z.infer<typeof coverLetterFormSchema>;

// ─── Cover Letter Meta Schema ──────────────────────────────
export const coverLetterMetaFormSchema = z.object({
  entryDate: z.string().optional().or(z.literal("")),
  salaryExpectation: z.string().optional().or(z.literal("")),
  noticePeriod: z.string().optional().or(z.literal("")),
});

export type CoverLetterMetaFormData = z.infer<typeof coverLetterMetaFormSchema>;
