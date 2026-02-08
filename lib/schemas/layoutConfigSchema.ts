import { z } from "zod";

// ─── Document Selection Schema ─────────────────────────────
export const documentSelectionSchema = z.object({
  includeCoverLetter: z.boolean(),
  includeCV: z.boolean(),
  includeCoverPage: z.boolean(),
});

export type DocumentSelectionFormData = z.infer<typeof documentSelectionSchema>;

// ─── Layout Config Schema ──────────────────────────────────
export const templateIdSchema = z.enum(["classic", "modern", "creative", "tech", "executive", "academic"]);

export const fontFamilySchema = z.enum([
  "Inter",
  "Roboto",
  "Merriweather",
  "Open Sans",
  "Lato",
]);

export const photoPositionSchema = z.enum(["top-right", "top-left", "sidebar"]);

export const headerStyleSchema = z.enum(["centered", "left-aligned", "minimal"]);

export const layoutConfigSchema = z.object({
  templateId: templateIdSchema,
  primaryColor: z
    .string()
    .min(1, "Primärfarbe ist erforderlich")
    .regex(/^#[0-9a-fA-F]{6}$/, "Ungültiges Hex-Farbformat"),
  secondaryColor: z
    .string()
    .min(1, "Sekundärfarbe ist erforderlich")
    .regex(/^#[0-9a-fA-F]{6}$/, "Ungültiges Hex-Farbformat"),
  fontFamily: fontFamilySchema,
  fontSize: z
    .number()
    .min(10, "Schriftgröße muss mindestens 10pt sein")
    .max(14, "Schriftgröße darf maximal 14pt sein"),
  headerStyle: headerStyleSchema,
  photoPosition: photoPositionSchema,
  showPhoto: z.boolean(),
});

export type LayoutConfigFormData = z.infer<typeof layoutConfigSchema>;
