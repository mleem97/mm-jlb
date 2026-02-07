import { describe, it, expect } from "vitest";
import { workExperienceFormSchema } from "@/lib/schemas/workExperienceFormSchema";

describe("workExperienceFormSchema", () => {
  const validData = {
    company: "Acme GmbH",
    jobTitle: "Software Engineer",
    startDate: "2022-01",
    endDate: "2024-06",
    isCurrentJob: false,
    location: "Berlin",
    tasks: "Backend-Entwicklung\nCode Reviews",
    achievements: "Performance verbessert",
    description: "Fullstack-Entwicklung",
  };

  it("accepts valid data", () => {
    const result = workExperienceFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("accepts valid data with current job (no endDate)", () => {
    const result = workExperienceFormSchema.safeParse({
      ...validData,
      isCurrentJob: true,
      endDate: "",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid data with empty optional fields", () => {
    const result = workExperienceFormSchema.safeParse({
      company: "Test",
      jobTitle: "Dev",
      startDate: "2022-01",
      endDate: "2024-01",
      isCurrentJob: false,
      tasks: "",
      achievements: "",
      location: "",
      description: "",
    });
    expect(result.success).toBe(true);
  });

  // ─── Company validation ───────────────────────────────
  it("rejects company with less than 2 characters", () => {
    const result = workExperienceFormSchema.safeParse({
      ...validData,
      company: "A",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const companyError = result.error.issues.find((i) => i.path.includes("company"));
      expect(companyError).toBeDefined();
    }
  });

  it("rejects empty company", () => {
    const result = workExperienceFormSchema.safeParse({
      ...validData,
      company: "",
    });
    expect(result.success).toBe(false);
  });

  // ─── Job Title validation ─────────────────────────────
  it("rejects jobTitle with less than 2 characters", () => {
    const result = workExperienceFormSchema.safeParse({
      ...validData,
      jobTitle: "X",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const jobTitleError = result.error.issues.find((i) => i.path.includes("jobTitle"));
      expect(jobTitleError).toBeDefined();
    }
  });

  // ─── Start Date validation ────────────────────────────
  it("rejects invalid startDate format", () => {
    const result = workExperienceFormSchema.safeParse({
      ...validData,
      startDate: "2022",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty startDate", () => {
    const result = workExperienceFormSchema.safeParse({
      ...validData,
      startDate: "",
    });
    expect(result.success).toBe(false);
  });

  // ─── End Date conditional requirement ─────────────────
  it("requires endDate when not current job", () => {
    const result = workExperienceFormSchema.safeParse({
      ...validData,
      isCurrentJob: false,
      endDate: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const endDateError = result.error.issues.find((i) => i.path.includes("endDate"));
      expect(endDateError).toBeDefined();
    }
  });

  it("does not require endDate when current job", () => {
    const result = workExperienceFormSchema.safeParse({
      ...validData,
      isCurrentJob: true,
      endDate: "",
    });
    expect(result.success).toBe(true);
  });

  // ─── End Date must be >= Start Date ───────────────────
  it("rejects endDate before startDate", () => {
    const result = workExperienceFormSchema.safeParse({
      ...validData,
      startDate: "2024-06",
      endDate: "2022-01",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const endDateError = result.error.issues.find((i) =>
        i.message.includes("nicht vor dem Startdatum")
      );
      expect(endDateError).toBeDefined();
    }
  });

  it("accepts endDate equal to startDate", () => {
    const result = workExperienceFormSchema.safeParse({
      ...validData,
      startDate: "2024-01",
      endDate: "2024-01",
    });
    expect(result.success).toBe(true);
  });

  it("accepts endDate after startDate", () => {
    const result = workExperienceFormSchema.safeParse({
      ...validData,
      startDate: "2022-01",
      endDate: "2024-06",
    });
    expect(result.success).toBe(true);
  });

  // ─── Invalid month values ────────────────────────────
  it("rejects startDate with invalid month (13)", () => {
    const result = workExperienceFormSchema.safeParse({
      ...validData,
      startDate: "2022-13",
    });
    expect(result.success).toBe(false);
  });

  it("rejects startDate with invalid month (00)", () => {
    const result = workExperienceFormSchema.safeParse({
      ...validData,
      startDate: "2022-00",
    });
    expect(result.success).toBe(false);
  });
});
