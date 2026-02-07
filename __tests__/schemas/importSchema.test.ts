import { describe, it, expect } from "vitest";
import {
  applicationImportSchema,
  personalDataSchema,
  workExperienceSchema,
  educationSchema,
  skillSchema,
  languageSchema,
  certificateSchema,
  projectSchema,
  jobPostingSchema,
  coverLetterSchema,
  coverLetterMetaSchema,
  attachmentSchema,
} from "@/lib/schemas/importSchema";

// ─── Helpers ────────────────────────────────────────────────
const validPersonalData = {
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
};

const validWorkExperience = {
  id: "we-1",
  company: "Acme GmbH",
  jobTitle: "Software Engineer",
  startDate: "2020-01",
  endDate: "2023-06",
  isCurrentJob: false,
  location: "Berlin",
  tasks: ["Backend-Entwicklung", "Code Reviews"],
  achievements: ["Performance um 40 % verbessert"],
  description: "Fullstack-Entwicklung",
};

const validEducation = {
  id: "edu-1",
  type: "Bachelor" as const,
  institution: "TU Berlin",
  degree: "B.Sc. Informatik",
  fieldOfStudy: "Informatik",
  startDate: "2016-10",
  endDate: "2020-03",
  grade: "1.7",
};

const validSkill = {
  id: "skill-1",
  name: "TypeScript",
  category: "hard" as const,
  level: 4 as const,
};

const validLanguage = {
  id: "lang-1",
  name: "Deutsch",
  level: "Muttersprache" as const,
};

const validCertificate = {
  id: "cert-1",
  name: "AWS Solutions Architect",
  issuingOrganization: "Amazon Web Services",
  issueDate: "2022-05",
};

const validProject = {
  id: "proj-1",
  name: "Open-Source CMS",
  description: "Ein headless CMS mit Next.js",
  startDate: "2021-01",
  technologies: ["Next.js", "TypeScript"],
};

const validJobPosting = {
  companyName: "TechCorp GmbH",
  jobTitle: "Senior Frontend Developer",
};

const validCoverLetter = {
  mode: "manual" as const,
  introduction: "Sehr geehrte Damen und Herren,",
  mainBody: "Ich bewerbe mich auf die ausgeschriebene Stelle.",
  closing: "Mit freundlichen Grüßen",
};

const validFullImport = {
  version: "1.0",
  exportedAt: "2025-01-15T10:00:00Z",
  personalData: validPersonalData,
  workExperience: [validWorkExperience],
  education: [validEducation],
  skills: [validSkill],
  languages: [validLanguage],
  certificates: [validCertificate],
  projects: [validProject],
  jobPosting: validJobPosting,
  coverLetter: validCoverLetter,
};

// ─── Tests ──────────────────────────────────────────────────
describe("applicationImportSchema", () => {
  it("validates a full import object", () => {
    const result = applicationImportSchema.safeParse(validFullImport);
    expect(result.success).toBe(true);
  });

  it("validates minimal import (version + personalData with required fields)", () => {
    const minimal = {
      version: "1.0",
      personalData: validPersonalData,
    };
    const result = applicationImportSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it("fails when version is missing", () => {
    const noVersion = {
      personalData: validPersonalData,
    };
    const result = applicationImportSchema.safeParse(noVersion);
    expect(result.success).toBe(false);
  });

  it("fails when personalData is missing", () => {
    const noPersonal = {
      version: "1.0",
    };
    const result = applicationImportSchema.safeParse(noPersonal);
    expect(result.success).toBe(false);
  });

  it("fails with an invalid email", () => {
    const badEmail = {
      version: "1.0",
      personalData: { ...validPersonalData, email: "not-an-email" },
    };
    const result = applicationImportSchema.safeParse(badEmail);
    expect(result.success).toBe(false);
  });

  it("fails when skill level is 0 (below minimum)", () => {
    const badSkill = {
      version: "1.0",
      personalData: validPersonalData,
      skills: [{ ...validSkill, level: 0 }],
    };
    const result = applicationImportSchema.safeParse(badSkill);
    expect(result.success).toBe(false);
  });

  it("fails when skill level is 6 (above maximum)", () => {
    const badSkill = {
      version: "1.0",
      personalData: validPersonalData,
      skills: [{ ...validSkill, level: 6 }],
    };
    const result = applicationImportSchema.safeParse(badSkill);
    expect(result.success).toBe(false);
  });

  it("fails with an invalid language level", () => {
    const badLang = {
      version: "1.0",
      personalData: validPersonalData,
      languages: [{ ...validLanguage, level: "D1" }],
    };
    const result = applicationImportSchema.safeParse(badLang);
    expect(result.success).toBe(false);
  });

  it("defaults optional arrays to empty arrays when not provided", () => {
    const minimal = {
      version: "1.0",
      personalData: validPersonalData,
    };
    const result = applicationImportSchema.parse(minimal);
    expect(result.workExperience).toEqual([]);
    expect(result.education).toEqual([]);
    expect(result.skills).toEqual([]);
    expect(result.languages).toEqual([]);
    expect(result.certificates).toEqual([]);
    expect(result.projects).toEqual([]);
    expect(result.attachments).toEqual([]);
  });
});

// ─── Sub-schema tests ───────────────────────────────────────
describe("sub-schemas validate individually", () => {
  it("personalDataSchema", () => {
    expect(personalDataSchema.safeParse(validPersonalData).success).toBe(true);
  });

  it("workExperienceSchema", () => {
    expect(workExperienceSchema.safeParse(validWorkExperience).success).toBe(true);
  });

  it("educationSchema", () => {
    expect(educationSchema.safeParse(validEducation).success).toBe(true);
  });

  it("skillSchema", () => {
    expect(skillSchema.safeParse(validSkill).success).toBe(true);
  });

  it("languageSchema", () => {
    expect(languageSchema.safeParse(validLanguage).success).toBe(true);
  });

  it("certificateSchema", () => {
    expect(certificateSchema.safeParse(validCertificate).success).toBe(true);
  });

  it("projectSchema", () => {
    expect(projectSchema.safeParse(validProject).success).toBe(true);
  });

  it("jobPostingSchema", () => {
    expect(jobPostingSchema.safeParse(validJobPosting).success).toBe(true);
  });

  it("coverLetterSchema", () => {
    expect(coverLetterSchema.safeParse(validCoverLetter).success).toBe(true);
  });

  it("coverLetterMetaSchema", () => {
    expect(
      coverLetterMetaSchema.safeParse({ entryDate: "01.04.2025" }).success,
    ).toBe(true);
  });

  it("attachmentSchema", () => {
    const validAttachment = {
      id: "att-1",
      fileName: "zeugnis.pdf",
      fileType: "pdf" as const,
      fileSize: 102400,
      category: "zeugnis" as const,
      addedAt: "2025-01-15T10:00:00Z",
    };
    expect(attachmentSchema.safeParse(validAttachment).success).toBe(true);
  });
});

// ─── International phone number tests ───────────────────────
describe("personalDataSchema phone validation", () => {
  const baseData = {
    firstName: "Max",
    lastName: "Mustermann",
    email: "max@example.com",
    address: {
      street: "Musterstraße 1",
      zip: "10115",
      city: "Berlin",
      country: "Deutschland",
    },
  };

  it("accepts German phone number with +49", () => {
    const result = personalDataSchema.safeParse({ ...baseData, phone: "+49 170 1234567" });
    expect(result.success).toBe(true);
  });

  it("accepts US phone number with +1", () => {
    const result = personalDataSchema.safeParse({ ...baseData, phone: "+1 555 123-4567" });
    expect(result.success).toBe(true);
  });

  it("accepts UK phone number", () => {
    const result = personalDataSchema.safeParse({ ...baseData, phone: "+44 20 7946 0958" });
    expect(result.success).toBe(true);
  });

  it("accepts phone with parentheses", () => {
    const result = personalDataSchema.safeParse({ ...baseData, phone: "+49 (170) 1234567" });
    expect(result.success).toBe(true);
  });

  it("accepts simple local number", () => {
    const result = personalDataSchema.safeParse({ ...baseData, phone: "0170 1234567" });
    expect(result.success).toBe(true);
  });

  it("accepts Austrian number", () => {
    const result = personalDataSchema.safeParse({ ...baseData, phone: "+43 664 1234567" });
    expect(result.success).toBe(true);
  });

  it("accepts Swiss number", () => {
    const result = personalDataSchema.safeParse({ ...baseData, phone: "+41 79 123 45 67" });
    expect(result.success).toBe(true);
  });

  it("rejects too short phone number", () => {
    const result = personalDataSchema.safeParse({ ...baseData, phone: "12345" });
    expect(result.success).toBe(false);
  });

  it("rejects phone with letters", () => {
    const result = personalDataSchema.safeParse({ ...baseData, phone: "+49 abc defghij" });
    expect(result.success).toBe(false);
  });

  it("rejects empty phone", () => {
    const result = personalDataSchema.safeParse({ ...baseData, phone: "" });
    expect(result.success).toBe(false);
  });
});
