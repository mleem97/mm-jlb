import { z } from "zod";

const YYYY_MM_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export const certificateFormSchema = z
  .object({
    name: z.string().min(2, "Name muss mindestens 2 Zeichen haben"),
    issuingOrganization: z
      .string()
      .min(2, "Organisation muss mindestens 2 Zeichen haben"),
    issueDate: z
      .string()
      .regex(YYYY_MM_REGEX, "Ausstellungsdatum ist erforderlich (YYYY-MM)"),
    expiryDate: z
      .string()
      .regex(YYYY_MM_REGEX, "Ablaufdatum im Format YYYY-MM")
      .optional()
      .or(z.literal("")),
    credentialId: z.string().optional().or(z.literal("")),
    credentialUrl: z
      .string()
      .url("Bitte geben Sie eine gültige URL ein")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      if (
        data.expiryDate &&
        YYYY_MM_REGEX.test(data.expiryDate) &&
        YYYY_MM_REGEX.test(data.issueDate)
      ) {
        return data.expiryDate >= data.issueDate;
      }
      return true;
    },
    {
      message: "Ablaufdatum darf nicht vor dem Ausstellungsdatum liegen",
      path: ["expiryDate"],
    },
  );

export type CertificateFormData = z.infer<typeof certificateFormSchema>;

export const projectFormSchema = z
  .object({
    name: z.string().min(2, "Name muss mindestens 2 Zeichen haben"),
    description: z
      .string()
      .min(1, "Beschreibung ist erforderlich")
      .max(500, "Beschreibung darf maximal 500 Zeichen haben"),
    url: z
      .string()
      .url("Bitte geben Sie eine gültige URL ein")
      .optional()
      .or(z.literal("")),
    startDate: z
      .string()
      .regex(YYYY_MM_REGEX, "Startdatum ist erforderlich (YYYY-MM)"),
    endDate: z
      .string()
      .regex(YYYY_MM_REGEX, "Enddatum im Format YYYY-MM")
      .optional()
      .or(z.literal("")),
    technologies: z.string().optional().or(z.literal("")),
    role: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (
        data.endDate &&
        YYYY_MM_REGEX.test(data.endDate) &&
        YYYY_MM_REGEX.test(data.startDate)
      ) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: "Enddatum darf nicht vor dem Startdatum liegen",
      path: ["endDate"],
    },
  );

export type ProjectFormData = z.infer<typeof projectFormSchema>;
