/**
 * Seed data for E2E tests.
 */

export const testPersonalData = {
  firstName: "Max",
  lastName: "Mustermann",
  email: "max.mustermann@example.com",
  phone: "+49 170 1234567",
  address: {
    street: "Musterstraße 42",
    zip: "30159",
    city: "Hannover",
    country: "Deutschland",
  },
};

export const testJobPosting = {
  companyName: "TechCorp GmbH",
  companyAddress: {
    street: "Techstraße 1",
    zip: "10115",
    city: "Berlin",
  },
  contactPerson: "Frau Schmidt",
  jobTitle: "Senior Frontend-Entwickler",
  referenceNumber: "REF-2026-042",
  source: "linkedin" as const,
  jobDescriptionText:
    "Wir suchen einen erfahrenen Frontend-Entwickler mit React-Kenntnissen für unser Berliner Team.",
};

export const testWorkExperience = {
  id: "test-exp-1",
  company: "WebDev AG",
  position: "Frontend-Entwickler",
  startDate: "2020-01",
  endDate: "2024-12",
  description: "Entwicklung von React-Anwendungen",
  isCurrent: false,
};

export const testEducation = {
  id: "test-edu-1",
  institution: "TU München",
  degree: "Bachelor of Science",
  fieldOfStudy: "Informatik",
  startDate: "2016-10",
  endDate: "2020-03",
};

/**
 * Build a Zustand-compatible localStorage payload for seeding the app state.
 */
export function buildStorageState(overrides?: Record<string, unknown>) {
  return JSON.stringify({
    state: {
      currentStep: 1,
      totalSteps: 9,
      applicationName: "",
      personalData: {
        ...testPersonalData,
        birthDate: undefined,
        birthPlace: undefined,
        nationality: undefined,
        linkedInUrl: undefined,
        portfolioUrl: undefined,
        photo: undefined,
      },
      workExperience: [testWorkExperience],
      education: [testEducation],
      skills: [
        { id: "s1", name: "React", level: "expert", category: "frontend" },
        { id: "s2", name: "TypeScript", level: "advanced", category: "frontend" },
      ],
      languages: [
        { id: "l1", name: "Deutsch", level: "native" },
        { id: "l2", name: "Englisch", level: "fluent" },
      ],
      certificates: [],
      projects: [],
      jobPosting: testJobPosting,
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
    },
    version: 2,
  });
}
