import { describe, it, expect } from "vitest";
import { educationFormSchema } from "@/lib/schemas/educationFormSchema";

describe("educationFormSchema", () => {
  const validMinimal = {
    type: "Bachelor" as const,
    institution: "TU München",
    startDate: "2018-10",
  };

  const validFull = {
    type: "Master" as const,
    institution: "Universität Stuttgart",
    degree: "Master of Science",
    fieldOfStudy: "Informatik",
    startDate: "2020-04",
    endDate: "2022-09",
    grade: "1,3",
    description: "Schwerpunkt: Kuenstliche Intelligenz, Thesis: Optimierung neuronaler Netze",
  };

  // ─── Valid data ───────────────────────────────────────
  it("accepts valid minimal data", () => {
    const result = educationFormSchema.safeParse(validMinimal);
    expect(result.success).toBe(true);
  });

  it("accepts valid full data", () => {
    const result = educationFormSchema.safeParse(validFull);
    expect(result.success).toBe(true);
  });

  it("accepts valid data with empty optional fields", () => {
    const result = educationFormSchema.safeParse({
      type: "Abitur",
      institution: "Gymnasium München",
      degree: "",
      fieldOfStudy: "",
      startDate: "2012-09",
      endDate: "2015-06",
      grade: "",
      description: "",
    });
    expect(result.success).toBe(true);
  });

  // ─── Required fields ─────────────────────────────────
  it("rejects missing required institution", () => {
    const result = educationFormSchema.safeParse({
      type: "Bachelor",
      institution: "",
      startDate: "2018-10",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path.includes("institution"));
      expect(error).toBeDefined();
    }
  });

  it("rejects institution with less than 2 characters", () => {
    const result = educationFormSchema.safeParse({
      type: "Bachelor",
      institution: "X",
      startDate: "2018-10",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path.includes("institution"));
      expect(error).toBeDefined();
    }
  });

  it("rejects missing required type", () => {
    const result = educationFormSchema.safeParse({
      institution: "TU München",
      startDate: "2018-10",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid type value", () => {
    const result = educationFormSchema.safeParse({
      type: "Diplom",
      institution: "TU München",
      startDate: "2018-10",
    });
    expect(result.success).toBe(false);
  });

  // ─── Date validation ─────────────────────────────────
  it("rejects invalid startDate format", () => {
    const result = educationFormSchema.safeParse({
      type: "Bachelor",
      institution: "TU München",
      startDate: "2018",
    });
    expect(result.success).toBe(false);
  });

  it("rejects endDate before startDate", () => {
    const result = educationFormSchema.safeParse({
      type: "Master",
      institution: "Universität Stuttgart",
      startDate: "2022-04",
      endDate: "2020-01",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) =>
        i.message.includes("nicht vor dem Startdatum"),
      );
      expect(error).toBeDefined();
    }
  });

  it("accepts endDate equal to startDate", () => {
    const result = educationFormSchema.safeParse({
      type: "Ausbildung",
      institution: "IHK Berlin",
      startDate: "2020-01",
      endDate: "2020-01",
    });
    expect(result.success).toBe(true);
  });

  it("accepts endDate after startDate", () => {
    const result = educationFormSchema.safeParse({
      type: "Bachelor",
      institution: "TU München",
      startDate: "2018-10",
      endDate: "2022-03",
    });
    expect(result.success).toBe(true);
  });

  // ─── All education types valid ────────────────────────
  it.each([
    "Promotion",
    "Master",
    "Bachelor",
    "Ausbildung",
    "Abitur",
    "Mittlere Reife",
    "Hauptschulabschluss",
    "Sonstiges",
  ] as const)("accepts education type '%s'", (type) => {
    const result = educationFormSchema.safeParse({
      type,
      institution: "Test-Institution",
      startDate: "2020-01",
    });
    expect(result.success).toBe(true);
  });

  // ─── Invalid month values ────────────────────────────
  it("rejects startDate with invalid month (00)", () => {
    const result = educationFormSchema.safeParse({
      type: "Bachelor",
      institution: "TU München",
      startDate: "2020-00",
    });
    expect(result.success).toBe(false);
  });

  it("rejects startDate with invalid month (13)", () => {
    const result = educationFormSchema.safeParse({
      type: "Bachelor",
      institution: "TU München",
      startDate: "2020-13",
    });
    expect(result.success).toBe(false);
  });
});
