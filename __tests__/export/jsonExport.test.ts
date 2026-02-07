import { describe, it, expect } from "vitest";
import { exportAsJson } from "@/lib/export/jsonExport";
import type { ApplicationState } from "@/types/application";

function createMockState(overrides: Partial<ApplicationState> = {}): ApplicationState {
  return {
    currentStep: 1,
    totalSteps: 9,
    applicationName: "",
    personalData: {
      firstName: "Max",
      lastName: "Mustermann",
      email: "max@example.com",
      phone: "+49 170 1234567",
      address: {
        street: "Musterstraße 1",
        zip: "10115",
        city: "Berlin",
        country: "Deutschland",
      },
    },
    workExperience: [
      {
        id: "we-1",
        company: "TechCorp",
        jobTitle: "Software-Entwickler",
        startDate: "2020-01",
        endDate: "2023-06",
        isCurrentJob: false,
        tasks: ["Backend-Entwicklung"],
        achievements: ["Performance-Optimierung"],
      },
    ],
    education: [
      {
        id: "edu-1",
        type: "Bachelor",
        institution: "TU Berlin",
        degree: "B.Sc. Informatik",
        startDate: "2016-10",
        endDate: "2020-09",
      },
    ],
    skills: [
      { id: "sk-1", name: "TypeScript", category: "hard", level: 4 },
    ],
    languages: [
      { id: "lang-1", name: "Deutsch", level: "Muttersprache" },
    ],
    certificates: [],
    projects: [],
    jobPosting: {
      companyName: "FirmaXY",
      jobTitle: "Frontend-Entwickler",
    },
    coverLetter: null,
    coverLetterMeta: null,
    attachments: [],
    documentSelection: {
      includeCoverLetter: true,
      includeCV: true,
      includeCoverPage: false,
    },
    layoutConfig: {
      templateId: "classic",
      primaryColor: "#1a365d",
      secondaryColor: "#e2e8f0",
      fontFamily: "Inter",
      fontSize: 12,
      headerStyle: "centered",
      photoPosition: "top-right",
      showPhoto: true,
    },
    exportConfig: {
      format: "pdf",
      pdfMode: "bundle",
      includeAttachments: true,
    },
    trackerEntries: [],
    lastSaved: null,
    isValid: false,
    ...overrides,
  };
}

describe("exportAsJson", () => {
  it("creates a valid JSON string", () => {
    const state = createMockState();
    const json = exportAsJson(state);

    expect(() => JSON.parse(json)).not.toThrow();
  });

  it("contains a schema version field", () => {
    const state = createMockState();
    const json = exportAsJson(state);
    const parsed = JSON.parse(json);

    expect(parsed.version).toBeDefined();
    expect(typeof parsed.version).toBe("string");
    expect(parsed.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("contains personalData with correct values", () => {
    const state = createMockState();
    const json = exportAsJson(state);
    const parsed = JSON.parse(json);

    expect(parsed.personalData).toBeDefined();
    expect(parsed.personalData.firstName).toBe("Max");
    expect(parsed.personalData.lastName).toBe("Mustermann");
    expect(parsed.personalData.email).toBe("max@example.com");
  });

  it("contains an exportedAt timestamp", () => {
    const state = createMockState();
    const json = exportAsJson(state);
    const parsed = JSON.parse(json);

    expect(parsed.exportedAt).toBeDefined();
    expect(typeof parsed.exportedAt).toBe("string");
    // ISO date string should be parseable
    expect(new Date(parsed.exportedAt).getTime()).not.toBeNaN();
  });

  it("includes workExperience and education arrays", () => {
    const state = createMockState();
    const json = exportAsJson(state);
    const parsed = JSON.parse(json);

    expect(Array.isArray(parsed.workExperience)).toBe(true);
    expect(parsed.workExperience).toHaveLength(1);
    expect(parsed.workExperience[0].company).toBe("TechCorp");

    expect(Array.isArray(parsed.education)).toBe(true);
    expect(parsed.education).toHaveLength(1);
    expect(parsed.education[0].institution).toBe("TU Berlin");
  });

  it("excludes blob data from attachments", () => {
    const state = createMockState({
      attachments: [
        {
          id: "att-1",
          fileName: "zeugnis.pdf",
          fileType: "pdf",
          fileSize: 12345,
          category: "zeugnis",
          blob: new Blob(["test"]),
          addedAt: "2024-01-01T00:00:00.000Z",
        },
      ],
    });
    const json = exportAsJson(state);
    const parsed = JSON.parse(json);

    expect(parsed.attachments).toHaveLength(1);
    expect(parsed.attachments[0].fileName).toBe("zeugnis.pdf");
    expect(parsed.attachments[0].blob).toBeUndefined();
  });

  it("includes jobPosting data when present", () => {
    const state = createMockState();
    const json = exportAsJson(state);
    const parsed = JSON.parse(json);

    expect(parsed.jobPosting).toBeDefined();
    expect(parsed.jobPosting.companyName).toBe("FirmaXY");
    expect(parsed.jobPosting.jobTitle).toBe("Frontend-Entwickler");
  });

  it("produces pretty-printed JSON with indentation", () => {
    const state = createMockState();
    const json = exportAsJson(state);

    // Pretty-printed JSON contains newlines and indentation
    expect(json).toContain("\n");
    expect(json).toContain("  ");
  });
});
