import { describe, it, expect } from "vitest";
import { runATSCheck } from "@/lib/utils/atsCheck";
import type { ApplicationState } from "@/types/application";

function createFullState(
  overrides?: Partial<ApplicationState>,
): ApplicationState {
  return {
    currentStep: 1,
    totalSteps: 10,
    applicationName: "Test Application",
    personalData: {
      firstName: "Max",
      lastName: "Mustermann",
      email: "max@example.com",
      phone: "+49 123 456789",
      address: {
        street: "Musterstraße 1",
        zip: "12345",
        city: "Berlin",
        country: "Deutschland",
      },
    },
    workExperience: [
      {
        id: "1",
        company: "TechCorp",
        jobTitle: "Entwickler",
        startDate: "2020-01",
        isCurrentJob: true,
        tasks: [],
        achievements: [],
      },
    ],
    education: [
      {
        id: "1",
        type: "Bachelor",
        institution: "TU Berlin",
        startDate: "2016-10",
        endDate: "2020-06",
      },
    ],
    skills: [
      { id: "1", name: "React", category: "hard", level: 4 },
      { id: "2", name: "TypeScript", category: "hard", level: 3 },
    ],
    languages: [],
    certificates: [],
    projects: [],
    jobPosting: {
      jobTitle: "Softwareentwickler",
      companyName: "TechCorp GmbH",
      jobDescriptionText: "Wir suchen einen erfahrenen Softwareentwickler mit React und TypeScript Kenntnissen für unser Team.",
      contactPerson: "Frau Schmidt",
    },
    coverLetter: {
      mode: "manual" as const,
      introduction: "Sehr geehrte Frau Schmidt, mit großem Interesse habe ich Ihre Stellenanzeige gelesen.",
      mainBody: "In meiner bisherigen Tätigkeit als Softwareentwickler bei der TechCorp konnte ich umfangreiche Erfahrungen in der Webentwicklung sammeln. Besonders meine Kenntnisse in React und TypeScript würde ich gerne in Ihr Team einbringen. Ich bin überzeugt, dass ich mit meiner Erfahrung einen wertvollen Beitrag leisten kann. Die Arbeit in agilen Teams ist mir bestens vertraut und ich freue mich auf neue Herausforderungen. Meine Stärken liegen in der Entwicklung skalierbarer Frontend-Architekturen. Darüber hinaus verfüge ich über ausgeprägte Problemlösungsfähigkeiten und eine hohe Lernbereitschaft, die es mir ermöglichen, mich schnell in neue Technologien und Frameworks einzuarbeiten. Ich bin teamfähig und bringe eine strukturierte Arbeitsweise mit, die zu einer effizienten Projektdurchführung beiträgt.",
      closing: "Über eine Einladung zu einem persönlichen Gespräch würde ich mich sehr freuen. Gerne erläutere ich Ihnen meine Qualifikationen und Erfahrungen im Detail. Ich stehe Ihnen ab sofort für ein Vorstellungsgespräch zur Verfügung und freue mich darauf, Sie und Ihr Team persönlich kennenzulernen. Mit freundlichen Grüßen, Max Mustermann",
    },
    coverLetterMeta: null,
    attachments: [],
    documentSelection: {
      includeCoverLetter: true,
      includeCV: true,
      includeCoverPage: true,
    },
    layoutConfig: {
      templateId: "modern",
      primaryColor: "#1a1a2e",
      secondaryColor: "#e94560",
      fontFamily: "Inter",
      fontSize: 12,
      headerStyle: "centered",
      photoPosition: "top-right",
      showPhoto: true,
    },
    exportConfig: {
      format: "pdf",
      pdfMode: "single",
      includeAttachments: false,
    },
    trackerEntries: [],
    lastSaved: null,
    isValid: true,
    ...overrides,
  };
}

describe("runATSCheck", () => {
  it("passes all checks for a complete state", () => {
    const result = runATSCheck(createFullState());
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.checks.every((c) => c.passed)).toBe(true);
  });

  it("fails when email is missing", () => {
    const state = createFullState({
      personalData: {
        firstName: "Max",
        lastName: "Mustermann",
        email: "",
        phone: "+49 123 456789",
        address: {
          street: "Musterstraße 1",
          zip: "12345",
          city: "Berlin",
          country: "Deutschland",
        },
      },
    });
    const result = runATSCheck(state);
    const contactCheck = result.checks.find((c) => c.name === "Kontaktdaten");
    expect(contactCheck?.passed).toBe(false);
    expect(result.score).toBeLessThan(100);
  });

  it("warns when skills section is empty", () => {
    const state = createFullState({ skills: [] });
    const result = runATSCheck(state);
    const skillsCheck = result.checks.find((c) => c.name === "Skills-Bereich");
    expect(skillsCheck?.passed).toBe(false);
    expect(skillsCheck?.severity).toBe("error");
  });

  it("warns when work experience is empty", () => {
    const state = createFullState({ workExperience: [] });
    const result = runATSCheck(state);
    const expCheck = result.checks.find((c) => c.name === "Berufserfahrung");
    expect(expCheck?.passed).toBe(false);
    expect(expCheck?.severity).toBe("warning");
  });

  it("fails for small font size", () => {
    const state = createFullState({
      layoutConfig: {
        templateId: "modern",
        primaryColor: "#1a1a2e",
        secondaryColor: "#e94560",
        fontFamily: "Inter",
        fontSize: 9,
        headerStyle: "centered",
        photoPosition: "top-right",
        showPhoto: true,
      },
    });
    const result = runATSCheck(state);
    const fontCheck = result.checks.find((c) => c.name === "Schriftgröße");
    expect(fontCheck?.passed).toBe(false);
  });

  it("calculates score as percentage of passed checks", () => {
    const result = runATSCheck(createFullState());
    const passed = result.checks.filter((c) => c.passed).length;
    const expected = Math.round((passed / result.checks.length) * 100);
    expect(result.score).toBe(expected);
  });
});
