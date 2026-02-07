import { describe, it, expect, beforeEach, vi } from "vitest";
import type { WorkExperience } from "@/types/workExperience";
import type { Education } from "@/types/education";
import type { Skill } from "@/types/skills";

// Mock Dexie / IndexedDB so saveToIndexedDB doesn't blow up
vi.mock("@/lib/db/applicationDb", () => ({
  applicationDb: {
    applications: { put: vi.fn().mockResolvedValue(undefined), clear: vi.fn().mockResolvedValue(undefined) },
    attachments: { clear: vi.fn().mockResolvedValue(undefined) },
  },
}));

// Mock the persist middleware to be a pass-through so we don't need real localStorage
vi.mock("zustand/middleware", async (importOriginal) => {
  const actual = await importOriginal<typeof import("zustand/middleware")>();
  return {
    ...actual,
    persist: (config: Parameters<typeof actual.persist>[0]) => config,
  };
});

// Import store AFTER mocks are set up
const { useApplicationStore } = await import("@/store/applicationStore");

const initialState = useApplicationStore.getState();

function resetStore() {
  useApplicationStore.setState({ ...initialState }, true);
}

describe("applicationStore", () => {
  beforeEach(() => {
    resetStore();
  });

  // ─── Personal Data ────────────────────────────────────────
  it("setPersonalData merges fields correctly", () => {
    useApplicationStore.getState().setPersonalData({ firstName: "Max", lastName: "Muster" });
    const { personalData } = useApplicationStore.getState();
    expect(personalData.firstName).toBe("Max");
    expect(personalData.lastName).toBe("Muster");
    expect(personalData.email).toBe(""); // untouched
  });

  it("setPersonalData merges nested address", () => {
    useApplicationStore.getState().setPersonalData({ address: { street: "Hauptstr. 1", zip: "10115", city: "Berlin", country: "Deutschland" } });
    useApplicationStore.getState().setPersonalData({ address: { street: "Nebenstr. 2", zip: "10115", city: "Berlin", country: "Deutschland" } });
    const { personalData } = useApplicationStore.getState();
    expect(personalData.address.street).toBe("Nebenstr. 2");
    expect(personalData.address.city).toBe("Berlin");
  });

  // ─── Work Experience ──────────────────────────────────────
  const sampleWork: WorkExperience = {
    id: "w1",
    company: "Firma A",
    jobTitle: "Entwickler",
    startDate: "2022-01",
    endDate: "2023-06",
    isCurrentJob: false,
    tasks: ["Task 1"],
    achievements: [],
  };

  it("addWorkExperience adds to array", () => {
    useApplicationStore.getState().addWorkExperience(sampleWork);
    expect(useApplicationStore.getState().workExperience).toHaveLength(1);
    expect(useApplicationStore.getState().workExperience[0].company).toBe("Firma A");
  });

  it("removeWorkExperience removes by id", () => {
    useApplicationStore.getState().addWorkExperience(sampleWork);
    useApplicationStore.getState().addWorkExperience({ ...sampleWork, id: "w2", company: "Firma B" });
    useApplicationStore.getState().removeWorkExperience("w1");
    const { workExperience } = useApplicationStore.getState();
    expect(workExperience).toHaveLength(1);
    expect(workExperience[0].id).toBe("w2");
  });

  it("reorderWorkExperience reorders correctly", () => {
    useApplicationStore.getState().addWorkExperience({ ...sampleWork, id: "w1" });
    useApplicationStore.getState().addWorkExperience({ ...sampleWork, id: "w2" });
    useApplicationStore.getState().addWorkExperience({ ...sampleWork, id: "w3" });
    useApplicationStore.getState().reorderWorkExperience(0, 2);
    const ids = useApplicationStore.getState().workExperience.map((w) => w.id);
    expect(ids).toEqual(["w2", "w3", "w1"]);
  });

  it("updateWorkExperience merges partial data", () => {
    useApplicationStore.getState().addWorkExperience(sampleWork);
    useApplicationStore.getState().updateWorkExperience("w1", { company: "Firma X" });
    expect(useApplicationStore.getState().workExperience[0].company).toBe("Firma X");
    expect(useApplicationStore.getState().workExperience[0].jobTitle).toBe("Entwickler");
  });

  // ─── Education ────────────────────────────────────────────
  const sampleEdu: Education = {
    id: "e1",
    type: "Bachelor",
    institution: "TU Berlin",
    startDate: "2018-10",
    endDate: "2022-03",
  };

  it("addEducation adds to array", () => {
    useApplicationStore.getState().addEducation(sampleEdu);
    expect(useApplicationStore.getState().education).toHaveLength(1);
  });

  it("removeEducation removes by id", () => {
    useApplicationStore.getState().addEducation(sampleEdu);
    useApplicationStore.getState().removeEducation("e1");
    expect(useApplicationStore.getState().education).toHaveLength(0);
  });

  // ─── Skills ───────────────────────────────────────────────
  const sampleSkill: Skill = {
    id: "s1",
    name: "TypeScript",
    category: "hard",
    level: 4,
  };

  it("addSkill and removeSkill work correctly", () => {
    useApplicationStore.getState().addSkill(sampleSkill);
    expect(useApplicationStore.getState().skills).toHaveLength(1);
    useApplicationStore.getState().removeSkill("s1");
    expect(useApplicationStore.getState().skills).toHaveLength(0);
  });

  // ─── Reset ────────────────────────────────────────────────
  it("resetApplication clears all state", () => {
    useApplicationStore.getState().setPersonalData({ firstName: "Max" });
    useApplicationStore.getState().addWorkExperience(sampleWork);
    useApplicationStore.getState().addSkill(sampleSkill);
    useApplicationStore.getState().setApplicationName("Meine Bewerbung");

    useApplicationStore.getState().resetApplication();

    const state = useApplicationStore.getState();
    expect(state.personalData.firstName).toBe("");
    expect(state.workExperience).toHaveLength(0);
    expect(state.skills).toHaveLength(0);
    expect(state.applicationName).toBe("");
    expect(state.currentStep).toBe(1);
    expect(state.lastSaved).toBeNull();
  });

  // ─── Import ───────────────────────────────────────────────
  it("importApplicationData sets all fields", () => {
    useApplicationStore.getState().importApplicationData({
      version: "1.0",
      personalData: {
        firstName: "Erika",
        lastName: "Mustermann",
        email: "e@m.de",
        phone: "0123",
        address: { street: "S", zip: "1", city: "B", country: "DE" },
      },
      workExperience: [sampleWork],
      education: [sampleEdu],
      skills: [sampleSkill],
    });

    const state = useApplicationStore.getState();
    expect(state.personalData.firstName).toBe("Erika");
    expect(state.workExperience).toHaveLength(1);
    expect(state.education).toHaveLength(1);
    expect(state.skills).toHaveLength(1);
    expect(state.isValid).toBe(true);
  });

  // ─── Navigation ───────────────────────────────────────────
  it("nextStep increments and clamps at totalSteps", () => {
    useApplicationStore.getState().nextStep();
    expect(useApplicationStore.getState().currentStep).toBe(2);

    // Go to max
    for (let i = 0; i < 20; i++) useApplicationStore.getState().nextStep();
    expect(useApplicationStore.getState().currentStep).toBe(useApplicationStore.getState().totalSteps);
  });

  it("prevStep decrements and clamps at 1", () => {
    useApplicationStore.setState({ currentStep: 3 });
    useApplicationStore.getState().prevStep();
    expect(useApplicationStore.getState().currentStep).toBe(2);

    useApplicationStore.getState().prevStep();
    useApplicationStore.getState().prevStep();
    expect(useApplicationStore.getState().currentStep).toBe(1);
  });

  // ─── Application Name ────────────────────────────────────
  it("setApplicationName updates the name", () => {
    useApplicationStore.getState().setApplicationName("Bewerbung ABC");
    expect(useApplicationStore.getState().applicationName).toBe("Bewerbung ABC");
    expect(useApplicationStore.getState().lastSaved).not.toBeNull();
  });
});
