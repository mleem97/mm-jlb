import { z } from "zod";

// ─── Personal Data ──────────────────────────────────────────
const personalAddressSchema = z.object({
  street: z.string().min(1, "Straße ist erforderlich"),
  zip: z.string().min(1, "PLZ ist erforderlich"),
  city: z.string().min(1, "Stadt ist erforderlich"),
  country: z.string().min(1, "Land ist erforderlich"),
});

const personalDataSchema = z.object({
  firstName: z.string().min(1, "Vorname ist erforderlich"),
  lastName: z.string().min(1, "Nachname ist erforderlich"),
  email: z.string().email("Gültige E-Mail erforderlich"),
  phone: z
    .string()
    .min(1, "Telefonnummer ist erforderlich")
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Gültige Telefonnummer (international erlaubt)"),
  address: personalAddressSchema,
  birthDate: z.string().optional(),
  birthPlace: z.string().optional(),
  nationality: z.string().optional(),
  linkedInUrl: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  photo: z.string().optional(),
});

// ─── Work Experience ────────────────────────────────────────
const workExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  jobTitle: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  isCurrentJob: z.boolean(),
  location: z.string().optional(),
  tasks: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  description: z.string().optional(),
});

// ─── Education ──────────────────────────────────────────────
const educationTypeEnum = z.enum([
  "Promotion",
  "Master",
  "Bachelor",
  "Ausbildung",
  "Abitur",
  "Mittlere Reife",
  "Hauptschulabschluss",
  "Sonstiges",
]);

const educationSchema = z.object({
  id: z.string(),
  type: educationTypeEnum,
  institution: z.string().min(1),
  degree: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
});

// ─── Skills & Languages ────────────────────────────────────
const skillCategoryEnum = z.enum(["hard", "digital", "green", "soft"]);
const skillLevelSchema = z.number().int().min(1).max(5) as z.ZodType<1 | 2 | 3 | 4 | 5>;

const skillSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  category: skillCategoryEnum,
  level: skillLevelSchema,
});

const languageLevelEnum = z.enum(["A1", "A2", "B1", "B2", "C1", "C2", "Muttersprache"]);

const languageSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  level: languageLevelEnum,
});

// ─── Certificates ───────────────────────────────────────────
const certificateSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  issuingOrganization: z.string().min(1),
  issueDate: z.string().min(1),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional().or(z.literal("")),
  attachmentId: z.string().optional(),
});

// ─── Projects ───────────────────────────────────────────────
const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  url: z.string().url().optional().or(z.literal("")),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  role: z.string().optional(),
});

// ─── Job Posting ────────────────────────────────────────────
const jobSourceEnum = z.enum([
  "website",
  "linkedin",
  "indeed",
  "stepstone",
  "empfehlung",
  "sonstiges",
]);

const jobPostingSchema = z.object({
  companyName: z.string().min(1),
  companyAddress: z
    .object({
      street: z.string().optional(),
      zip: z.string().optional(),
      city: z.string().optional(),
    })
    .optional(),
  contactPerson: z.string().optional(),
  jobTitle: z.string().min(1),
  referenceNumber: z.string().optional(),
  source: jobSourceEnum.optional(),
  jobDescriptionText: z.string().optional(),
});

// ─── Cover Letter ───────────────────────────────────────────
const coverLetterModeEnum = z.enum(["ai", "manual"]);
const coverLetterTonalityEnum = z.enum(["formell", "modern-professionell", "kreativ"]);

const coverLetterSchema = z.object({
  mode: coverLetterModeEnum,
  introduction: z.string(),
  mainBody: z.string(),
  closing: z.string(),
  fullText: z.string().optional(),
  generationParams: z
    .object({
      motivation: z.string().optional(),
      strengths: z.string().optional(),
      specialQualification: z.string().optional(),
      tonality: coverLetterTonalityEnum.optional(),
    })
    .optional(),
});

const coverLetterMetaSchema = z.object({
  entryDate: z.string().optional(),
  salaryExpectation: z.string().optional(),
  noticePeriod: z.string().optional(),
});

// ─── Attachments ────────────────────────────────────────────
const attachmentCategoryEnum = z.enum([
  "zeugnis",
  "zertifikat",
  "referenz",
  "arbeitsprobe",
  "sonstiges",
]);

const attachmentFileTypeEnum = z.enum(["pdf", "image", "doc"]);

const attachmentSchema = z.object({
  id: z.string(),
  fileName: z.string().min(1),
  fileType: attachmentFileTypeEnum,
  fileSize: z.number().positive(),
  category: attachmentCategoryEnum,
  addedAt: z.string(),
});

// ─── Full Application Import Schema ────────────────────────
export const applicationImportSchema = z.object({
  version: z.string().min(1, "Version ist erforderlich"),
  exportedAt: z.string().optional(),
  personalData: personalDataSchema,
  workExperience: z.array(workExperienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  skills: z.array(skillSchema).default([]),
  languages: z.array(languageSchema).default([]),
  certificates: z.array(certificateSchema).default([]),
  projects: z.array(projectSchema).default([]),
  jobPosting: jobPostingSchema.optional(),
  coverLetter: coverLetterSchema.optional(),
  coverLetterMeta: coverLetterMetaSchema.optional(),
  attachments: z.array(attachmentSchema).default([]),
});

export type ApplicationImportResult = z.infer<typeof applicationImportSchema>;

// Re-export sub-schemas for individual use
export {
  personalDataSchema,
  workExperienceSchema,
  educationSchema,
  skillSchema,
  languageSchema,
  certificateSchema,
  projectSchema,
  jobPostingSchema,
  coverLetterSchema,
  coverLetterMetaSchema,
  attachmentSchema,
};
