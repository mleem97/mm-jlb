import { z } from "zod";

const YYYY_MM_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export const educationTypeEnum = z.enum([
  "Promotion",
  "Master",
  "Bachelor",
  "Ausbildung",
  "Abitur",
  "Mittlere Reife",
  "Hauptschulabschluss",
  "Sonstiges",
]);

export const educationFormSchema = z
  .object({
    type: educationTypeEnum,
    institution: z
      .string()
      .min(2, "Institution muss mindestens 2 Zeichen haben"),
    degree: z.string().optional().or(z.literal("")),
    fieldOfStudy: z.string().optional().or(z.literal("")),
    startDate: z
      .string()
      .regex(YYYY_MM_REGEX, "Startdatum ist erforderlich (YYYY-MM)"),
    endDate: z
      .string()
      .regex(YYYY_MM_REGEX, "Enddatum im Format YYYY-MM")
      .optional()
      .or(z.literal("")),
    grade: z.string().optional().or(z.literal("")),
    description: z.string().optional().or(z.literal("")),
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

export type EducationFormData = z.infer<typeof educationFormSchema>;
