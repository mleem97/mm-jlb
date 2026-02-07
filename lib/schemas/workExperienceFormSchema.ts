import { z } from "zod";

const YYYY_MM_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export const workExperienceFormSchema = z
  .object({
    company: z
      .string()
      .min(2, "Firmenname muss mindestens 2 Zeichen haben"),
    jobTitle: z
      .string()
      .min(2, "Jobtitel muss mindestens 2 Zeichen haben"),
    startDate: z
      .string()
      .regex(YYYY_MM_REGEX, "Startdatum ist erforderlich (YYYY-MM)"),
    endDate: z
      .string()
      .regex(YYYY_MM_REGEX, "Enddatum im Format YYYY-MM")
      .optional()
      .or(z.literal("")),
    isCurrentJob: z.boolean(),
    location: z.string().optional().or(z.literal("")),
    tasks: z.string(),
    achievements: z.string(),
    description: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      // If not current job, endDate must be provided
      if (!data.isCurrentJob) {
        return !!data.endDate && YYYY_MM_REGEX.test(data.endDate);
      }
      return true;
    },
    {
      message: "Enddatum ist erforderlich, wenn die Position nicht aktuell ist",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      // endDate must be >= startDate
      if (data.endDate && YYYY_MM_REGEX.test(data.endDate) && YYYY_MM_REGEX.test(data.startDate)) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: "Enddatum darf nicht vor dem Startdatum liegen",
      path: ["endDate"],
    }
  );

export type WorkExperienceFormData = z.infer<typeof workExperienceFormSchema>;
