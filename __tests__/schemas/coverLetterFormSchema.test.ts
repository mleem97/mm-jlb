import { describe, it, expect } from "vitest";
import {
  jobPostingFormSchema,
  coverLetterFormSchema,
  coverLetterMetaFormSchema,
} from "@/lib/schemas/coverLetterFormSchema";

// ═══════════════════════════════════════════════════════════
//  Job Posting Form Schema
// ═══════════════════════════════════════════════════════════
describe("jobPostingFormSchema", () => {
  const validMinimal = {
    companyName: "Musterfirma GmbH",
    jobTitle: "Frontend-Entwickler",
  };

  const validFull = {
    companyName: "Musterfirma GmbH",
    companyStreet: "Musterstraße 1",
    companyZip: "12345",
    companyCity: "Berlin",
    contactPerson: "Frau Müller",
    jobTitle: "Senior Frontend-Entwickler",
    referenceNumber: "REF-2026-042",
    source: "linkedin" as const,
    jobDescriptionText: "Wir suchen einen erfahrenen Frontend-Entwickler...",
  };

  it("accepts valid minimal data (company + jobTitle)", () => {
    const result = jobPostingFormSchema.safeParse(validMinimal);
    expect(result.success).toBe(true);
  });

  it("accepts valid full data", () => {
    const result = jobPostingFormSchema.safeParse(validFull);
    expect(result.success).toBe(true);
  });

  it("rejects missing companyName", () => {
    const result = jobPostingFormSchema.safeParse({
      companyName: "",
      jobTitle: "Entwickler",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) =>
        i.path.includes("companyName"),
      );
      expect(error).toBeDefined();
    }
  });

  it("rejects missing jobTitle", () => {
    const result = jobPostingFormSchema.safeParse({
      companyName: "Firma AG",
      jobTitle: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) =>
        i.path.includes("jobTitle"),
      );
      expect(error).toBeDefined();
    }
  });

  it("accepts data with empty optional fields", () => {
    const result = jobPostingFormSchema.safeParse({
      companyName: "Firma AG",
      jobTitle: "Entwickler",
      companyStreet: "",
      companyZip: "",
      companyCity: "",
      contactPerson: "",
      referenceNumber: "",
      jobDescriptionText: "",
    });
    expect(result.success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════
//  Cover Letter Form Schema
// ═══════════════════════════════════════════════════════════
describe("coverLetterFormSchema", () => {
  it("accepts valid manual cover letter with all sections", () => {
    const result = coverLetterFormSchema.safeParse({
      mode: "manual",
      introduction:
        "Sehr geehrte Frau Müller, mit großem Interesse habe ich Ihre Stellenausschreibung gelesen.",
      mainBody:
        "In meiner bisherigen Tätigkeit als Frontend-Entwickler konnte ich umfangreiche Erfahrung mit React und TypeScript sammeln. Besonders hervorzuheben ist mein Beitrag zur Modernisierung unserer Web-Applikation.",
      closing:
        "Über die Einladung zu einem persönlichen Gespräch freue ich mich sehr.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects manual mode with missing introduction", () => {
    const result = coverLetterFormSchema.safeParse({
      mode: "manual",
      introduction: "",
      mainBody:
        "In meiner bisherigen Tätigkeit als Frontend-Entwickler konnte ich umfangreiche Erfahrung mit React und TypeScript sammeln. Besonders hervorzuheben ist mein Beitrag.",
      closing: "Über die Einladung zu einem persönlichen Gespräch freue ich mich.",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) =>
        i.path.includes("introduction"),
      );
      expect(error).toBeDefined();
    }
  });

  it("rejects manual mode with mainBody too short", () => {
    const result = coverLetterFormSchema.safeParse({
      mode: "manual",
      introduction: "Sehr geehrte Frau Müller, ich bewerbe mich.",
      mainBody: "Zu kurz.",
      closing: "Mit freundlichen Grüßen und besten Wünschen.",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) =>
        i.path.includes("mainBody"),
      );
      expect(error).toBeDefined();
    }
  });

  it("accepts AI mode without text sections", () => {
    const result = coverLetterFormSchema.safeParse({
      mode: "ai",
      introduction: "",
      mainBody: "",
      closing: "",
    });
    expect(result.success).toBe(true);
  });

  it("accepts AI mode with optional text sections filled", () => {
    const result = coverLetterFormSchema.safeParse({
      mode: "ai",
      introduction: "Einleitung vom KI-Assistenten",
      mainBody: "Hauptteil generiert durch künstliche Intelligenz",
      closing: "Schluss vom KI-Assistenten",
    });
    expect(result.success).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════
//  Cover Letter Meta Schema
// ═══════════════════════════════════════════════════════════
describe("coverLetterMetaFormSchema", () => {
  it("accepts valid meta with all fields", () => {
    const result = coverLetterMetaFormSchema.safeParse({
      entryDate: "2026-04-01",
      salaryExpectation: "55.000 - 65.000 €",
      noticePeriod: "3 Monate",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid meta with no fields (all optional)", () => {
    const result = coverLetterMetaFormSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts meta with empty strings", () => {
    const result = coverLetterMetaFormSchema.safeParse({
      entryDate: "",
      salaryExpectation: "",
      noticePeriod: "",
    });
    expect(result.success).toBe(true);
  });
});
