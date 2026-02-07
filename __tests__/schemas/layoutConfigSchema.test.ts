import { describe, it, expect } from "vitest";
import {
  layoutConfigSchema,
  documentSelectionSchema,
} from "@/lib/schemas/layoutConfigSchema";

// ═══════════════════════════════════════════════════════════
//  Document Selection Schema
// ═══════════════════════════════════════════════════════════
describe("documentSelectionSchema", () => {
  it("accepts valid default selection (all true)", () => {
    const result = documentSelectionSchema.safeParse({
      includeCoverLetter: true,
      includeCV: true,
      includeCoverPage: true,
    });
    expect(result.success).toBe(true);
  });

  it("accepts partially false selection", () => {
    const result = documentSelectionSchema.safeParse({
      includeCoverLetter: true,
      includeCV: true,
      includeCoverPage: false,
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-boolean values", () => {
    const result = documentSelectionSchema.safeParse({
      includeCoverLetter: "yes",
      includeCV: true,
      includeCoverPage: false,
    });
    expect(result.success).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════
//  Layout Config Schema
// ═══════════════════════════════════════════════════════════
describe("layoutConfigSchema", () => {
  const validConfig = {
    templateId: "classic" as const,
    primaryColor: "#1a365d",
    secondaryColor: "#e2e8f0",
    fontFamily: "Inter" as const,
    fontSize: 12,
    headerStyle: "centered" as const,
    photoPosition: "top-right" as const,
    showPhoto: true,
  };

  it("accepts valid default config", () => {
    const result = layoutConfigSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });

  it("accepts all valid template IDs", () => {
    for (const id of ["classic", "modern", "creative"] as const) {
      const result = layoutConfigSchema.safeParse({ ...validConfig, templateId: id });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid template ID", () => {
    const result = layoutConfigSchema.safeParse({
      ...validConfig,
      templateId: "fancy",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid font family", () => {
    const result = layoutConfigSchema.safeParse({
      ...validConfig,
      fontFamily: "Comic Sans",
    });
    expect(result.success).toBe(false);
  });

  it("rejects font size below 10", () => {
    const result = layoutConfigSchema.safeParse({
      ...validConfig,
      fontSize: 8,
    });
    expect(result.success).toBe(false);
  });

  it("rejects font size above 14", () => {
    const result = layoutConfigSchema.safeParse({
      ...validConfig,
      fontSize: 16,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid hex color", () => {
    const result = layoutConfigSchema.safeParse({
      ...validConfig,
      primaryColor: "blue",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid font families", () => {
    for (const font of ["Inter", "Roboto", "Merriweather", "Open Sans", "Lato"] as const) {
      const result = layoutConfigSchema.safeParse({ ...validConfig, fontFamily: font });
      expect(result.success).toBe(true);
    }
  });

  it("accepts all valid photo positions", () => {
    for (const pos of ["top-right", "top-left", "sidebar"] as const) {
      const result = layoutConfigSchema.safeParse({ ...validConfig, photoPosition: pos });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid photo position", () => {
    const result = layoutConfigSchema.safeParse({
      ...validConfig,
      photoPosition: "bottom",
    });
    expect(result.success).toBe(false);
  });
});
