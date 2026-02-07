import { describe, it, expect } from "vitest";
import {
  certificateFormSchema,
  projectFormSchema,
} from "@/lib/schemas/certificateProjectFormSchema";

describe("certificateFormSchema", () => {
  const validMinimal = {
    name: "AWS Solutions Architect",
    issuingOrganization: "Amazon Web Services",
    issueDate: "2023-06",
  };

  const validFull = {
    name: "AWS Solutions Architect Professional",
    issuingOrganization: "Amazon Web Services",
    issueDate: "2023-06",
    expiryDate: "2026-06",
    credentialId: "ABC-123-XYZ",
    credentialUrl: "https://verify.aws.com/abc123",
  };

  // ─── Valid data ───────────────────────────────────────
  it("accepts valid minimal data", () => {
    const result = certificateFormSchema.safeParse(validMinimal);
    expect(result.success).toBe(true);
  });

  it("accepts valid full data", () => {
    const result = certificateFormSchema.safeParse(validFull);
    expect(result.success).toBe(true);
  });

  it("accepts valid data with empty optional fields", () => {
    const result = certificateFormSchema.safeParse({
      name: "Scrum Master",
      issuingOrganization: "Scrum Alliance",
      issueDate: "2022-01",
      expiryDate: "",
      credentialId: "",
      credentialUrl: "",
    });
    expect(result.success).toBe(true);
  });

  // ─── Required fields ─────────────────────────────────
  it("rejects missing name", () => {
    const result = certificateFormSchema.safeParse({
      name: "",
      issuingOrganization: "AWS",
      issueDate: "2023-06",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path.includes("name"));
      expect(error).toBeDefined();
    }
  });

  it("rejects name with less than 2 characters", () => {
    const result = certificateFormSchema.safeParse({
      name: "A",
      issuingOrganization: "AWS",
      issueDate: "2023-06",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing issuingOrganization", () => {
    const result = certificateFormSchema.safeParse({
      name: "AWS Cert",
      issuingOrganization: "",
      issueDate: "2023-06",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) =>
        i.path.includes("issuingOrganization"),
      );
      expect(error).toBeDefined();
    }
  });

  it("rejects missing issueDate", () => {
    const result = certificateFormSchema.safeParse({
      name: "AWS Cert",
      issuingOrganization: "AWS",
      issueDate: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path.includes("issueDate"));
      expect(error).toBeDefined();
    }
  });

  // ─── Date validation ─────────────────────────────────
  it("rejects expiryDate before issueDate", () => {
    const result = certificateFormSchema.safeParse({
      name: "AWS Cert",
      issuingOrganization: "AWS",
      issueDate: "2023-06",
      expiryDate: "2022-01",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) =>
        i.message.includes("nicht vor dem Ausstellungsdatum"),
      );
      expect(error).toBeDefined();
    }
  });

  // ─── URL validation ──────────────────────────────────
  it("rejects invalid credentialUrl", () => {
    const result = certificateFormSchema.safeParse({
      name: "AWS Cert",
      issuingOrganization: "AWS",
      issueDate: "2023-06",
      credentialUrl: "not-a-url",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) =>
        i.path.includes("credentialUrl"),
      );
      expect(error).toBeDefined();
    }
  });
});

describe("projectFormSchema", () => {
  const validMinimal = {
    name: "E-Commerce Plattform",
    description: "Redesign der bestehenden E-Commerce Plattform mit React und Node.js",
    startDate: "2022-01",
  };

  const validFull = {
    name: "E-Commerce Plattform Redesign",
    description: "Komplettes Redesign der Plattform mit modernem Tech-Stack",
    url: "https://github.com/user/project",
    startDate: "2022-01",
    endDate: "2023-06",
    technologies: "React, TypeScript, Node.js",
    role: "Lead Developer",
  };

  // ─── Valid data ───────────────────────────────────────
  it("accepts valid minimal data", () => {
    const result = projectFormSchema.safeParse(validMinimal);
    expect(result.success).toBe(true);
  });

  it("accepts valid full data", () => {
    const result = projectFormSchema.safeParse(validFull);
    expect(result.success).toBe(true);
  });

  // ─── Required fields ─────────────────────────────────
  it("rejects missing name", () => {
    const result = projectFormSchema.safeParse({
      name: "",
      description: "Some description",
      startDate: "2022-01",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path.includes("name"));
      expect(error).toBeDefined();
    }
  });

  it("rejects description longer than 500 characters", () => {
    const result = projectFormSchema.safeParse({
      name: "Test Project",
      description: "A".repeat(501),
      startDate: "2022-01",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) =>
        i.path.includes("description"),
      );
      expect(error).toBeDefined();
    }
  });

  // ─── Date validation ─────────────────────────────────
  it("rejects endDate before startDate", () => {
    const result = projectFormSchema.safeParse({
      name: "Test Project",
      description: "A valid description",
      startDate: "2023-06",
      endDate: "2022-01",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) =>
        i.message.includes("nicht vor dem Startdatum"),
      );
      expect(error).toBeDefined();
    }
  });

  // ─── URL validation ──────────────────────────────────
  it("accepts valid URL", () => {
    const result = projectFormSchema.safeParse({
      name: "Test Project",
      description: "A valid description",
      startDate: "2022-01",
      url: "https://github.com/user/project",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid URL", () => {
    const result = projectFormSchema.safeParse({
      name: "Test Project",
      description: "A valid description",
      startDate: "2022-01",
      url: "not-a-url",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const error = result.error.issues.find((i) => i.path.includes("url"));
      expect(error).toBeDefined();
    }
  });

  it("accepts empty optional fields", () => {
    const result = projectFormSchema.safeParse({
      name: "Test Project",
      description: "A valid description",
      startDate: "2022-01",
      endDate: "",
      url: "",
      technologies: "",
      role: "",
    });
    expect(result.success).toBe(true);
  });
});
