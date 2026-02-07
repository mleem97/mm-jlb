import { describe, it, expect } from "vitest";
import {
  hardSkillSuggestions,
  digitalSkillSuggestions,
  greenSkillSuggestions,
  softSkillSuggestions,
  languageSuggestions,
  allSkillSuggestions,
  getSkillSuggestions,
  getSubcategories,
  getSkillsBySubcategory,
  skillCategoryDescriptions,
} from "@/lib/data/skillSuggestions";

describe("skillSuggestions", () => {
  it("should have hard skill suggestions", () => {
    expect(hardSkillSuggestions.length).toBeGreaterThan(0);
    for (const s of hardSkillSuggestions) {
      expect(s.category).toBe("hard");
      expect(s.name.length).toBeGreaterThan(0);
    }
  });

  it("should have digital skill suggestions", () => {
    expect(digitalSkillSuggestions.length).toBeGreaterThan(0);
    for (const s of digitalSkillSuggestions) {
      expect(s.category).toBe("digital");
      expect(s.name.length).toBeGreaterThan(0);
    }
  });

  it("should have green skill suggestions", () => {
    expect(greenSkillSuggestions.length).toBeGreaterThan(0);
    for (const s of greenSkillSuggestions) {
      expect(s.category).toBe("green");
      expect(s.name.length).toBeGreaterThan(0);
    }
  });

  it("should have soft skill suggestions", () => {
    expect(softSkillSuggestions.length).toBeGreaterThan(0);
    for (const s of softSkillSuggestions) {
      expect(s.category).toBe("soft");
      expect(s.name.length).toBeGreaterThan(0);
    }
  });

  it("should have language suggestions", () => {
    expect(languageSuggestions.length).toBeGreaterThan(0);
    expect(languageSuggestions).toContain("Deutsch");
    expect(languageSuggestions).toContain("Englisch");
  });

  it("should combine all skill suggestions", () => {
    const expectedTotal =
      hardSkillSuggestions.length +
      digitalSkillSuggestions.length +
      greenSkillSuggestions.length +
      softSkillSuggestions.length;
    expect(allSkillSuggestions.length).toBe(expectedTotal);
  });

  it("getSkillSuggestions returns correct names for each category", () => {
    const hardNames = getSkillSuggestions("hard");
    expect(hardNames.length).toBe(hardSkillSuggestions.length);
    expect(hardNames).toContain("Projektmanagement");

    const digitalNames = getSkillSuggestions("digital");
    expect(digitalNames.length).toBe(digitalSkillSuggestions.length);
    expect(digitalNames).toContain("Python");

    const greenNames = getSkillSuggestions("green");
    expect(greenNames.length).toBe(greenSkillSuggestions.length);
    expect(greenNames).toContain("ESG-Reporting");

    const softNames = getSkillSuggestions("soft");
    expect(softNames.length).toBe(softSkillSuggestions.length);
    expect(softNames).toContain("Teamfähigkeit");
  });

  // ─── New tests for expanded features ────────────────────

  it("should have no duplicate skill names within each category", () => {
    const categories = [
      hardSkillSuggestions,
      digitalSkillSuggestions,
      greenSkillSuggestions,
      softSkillSuggestions,
    ];
    for (const cat of categories) {
      const names = cat.map((s) => s.name.toLowerCase());
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    }
  });

  it("should have subcategories on all skills", () => {
    for (const s of allSkillSuggestions) {
      expect(s.subcategory).toBeDefined();
      expect(s.subcategory!.length).toBeGreaterThan(0);
    }
  });

  it("should have expanded counts (>= 100 hard, >= 80 digital, >= 25 green, >= 30 soft)", () => {
    expect(hardSkillSuggestions.length).toBeGreaterThanOrEqual(100);
    expect(digitalSkillSuggestions.length).toBeGreaterThanOrEqual(80);
    expect(greenSkillSuggestions.length).toBeGreaterThanOrEqual(25);
    expect(softSkillSuggestions.length).toBeGreaterThanOrEqual(30);
  });

  it("should have expanded language suggestions (>= 25)", () => {
    expect(languageSuggestions.length).toBeGreaterThanOrEqual(25);
    expect(languageSuggestions).toContain("Gebärdensprache (DGS)");
    expect(languageSuggestions).toContain("Ukrainisch");
  });

  it("getSubcategories returns subcategories for each category", () => {
    const hardSubs = getSubcategories("hard");
    expect(hardSubs.length).toBeGreaterThan(5);
    expect(hardSubs).toContain("Management");
    expect(hardSubs).toContain("Kaufmännisch");
    expect(hardSubs).toContain("Ingenieurwesen");

    const digitalSubs = getSubcategories("digital");
    expect(digitalSubs.length).toBeGreaterThan(5);
    expect(digitalSubs).toContain("Programmierung");
    expect(digitalSubs).toContain("Cloud & DevOps");

    const greenSubs = getSubcategories("green");
    expect(greenSubs.length).toBeGreaterThan(3);
    expect(greenSubs).toContain("Strategie");
    expect(greenSubs).toContain("Energie & Klima");

    const softSubs = getSubcategories("soft");
    expect(softSubs.length).toBeGreaterThan(3);
    expect(softSubs).toContain("Kommunikation");
    expect(softSubs).toContain("Führung");
  });

  it("getSkillsBySubcategory returns correct filtered skills", () => {
    const management = getSkillsBySubcategory("hard", "Management");
    expect(management.length).toBeGreaterThan(0);
    expect(management).toContain("Projektmanagement");

    const programming = getSkillsBySubcategory("digital", "Programmierung");
    expect(programming.length).toBeGreaterThan(0);
    expect(programming).toContain("Python");
    expect(programming).toContain("TypeScript");

    const energy = getSkillsBySubcategory("green", "Energie & Klima");
    expect(energy.length).toBeGreaterThan(0);
    expect(energy).toContain("Energieeffizienz");
  });

  it("should have skill category descriptions for all 4 categories", () => {
    expect(skillCategoryDescriptions.length).toBe(4);
    const categories = skillCategoryDescriptions.map((d) => d.category);
    expect(categories).toContain("hard");
    expect(categories).toContain("digital");
    expect(categories).toContain("green");
    expect(categories).toContain("soft");

    for (const desc of skillCategoryDescriptions) {
      expect(desc.title.length).toBeGreaterThan(0);
      expect(desc.description.length).toBeGreaterThan(50);
      expect(desc.howToIdentify.length).toBeGreaterThan(50);
      expect(desc.icon.length).toBeGreaterThan(0);
    }
  });
});
