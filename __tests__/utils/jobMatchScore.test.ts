import { describe, it, expect } from "vitest";
import { calculateJobMatch } from "@/lib/utils/jobMatchScore";
import type { Skill } from "@/types/skills";
import type { WorkExperience } from "@/types/workExperience";
import type { Education } from "@/types/education";

const makeSkill = (name: string): Skill => ({
  id: crypto.randomUUID(),
  name,
  category: "hard",
  level: 3,
});

const makeWorkExp = (
  jobTitle: string,
  company: string,
): WorkExperience => ({
  id: crypto.randomUUID(),
  company,
  jobTitle,
  startDate: "2020-01",
  endDate: "2023-01",
  isCurrentJob: false,
  tasks: [],
  achievements: [],
});

const makeEdu = (
  institution: string,
  fieldOfStudy?: string,
): Education => ({
  id: crypto.randomUUID(),
  type: "Bachelor",
  institution,
  fieldOfStudy,
  startDate: "2016-10",
  endDate: "2020-06",
});

describe("calculateJobMatch", () => {
  it("returns score 0 for empty job description", () => {
    const result = calculateJobMatch("", [makeSkill("React")], [], []);
    expect(result.score).toBe(0);
    expect(result.matchedKeywords).toHaveLength(0);
    expect(result.missingKeywords).toHaveLength(0);
    expect(result.suggestions).toHaveLength(0);
  });

  it("returns score 0 when only stop words in description", () => {
    const result = calculateJobMatch(
      "und oder der die das in von",
      [makeSkill("React")],
      [],
      [],
    );
    expect(result.score).toBe(0);
  });

  it("matches skills from job description", () => {
    const skills = [makeSkill("React"), makeSkill("TypeScript")];
    const result = calculateJobMatch(
      "Wir suchen React TypeScript Entwickler",
      skills,
      [],
      [],
    );
    expect(result.matchedKeywords).toContain("react");
    expect(result.matchedKeywords).toContain("typescript");
    expect(result.score).toBeGreaterThan(0);
  });

  it("identifies missing keywords", () => {
    const result = calculateJobMatch(
      "Python Django PostgreSQL",
      [makeSkill("React")],
      [],
      [],
    );
    expect(result.missingKeywords).toContain("python");
    expect(result.missingKeywords).toContain("django");
    expect(result.missingKeywords).toContain("postgresql");
  });

  it("matches job titles from work experience", () => {
    const result = calculateJobMatch(
      "Senior Frontend Entwickler gesucht",
      [],
      [makeWorkExp("Frontend Entwickler", "TechCorp")],
      [],
    );
    expect(result.matchedKeywords).toContain("frontend");
    expect(result.matchedKeywords).toContain("entwickler");
  });

  it("matches education institution and field of study", () => {
    const result = calculateJobMatch(
      "Informatik Studium TU München",
      [],
      [],
      [makeEdu("TU München", "Informatik")],
    );
    expect(result.matchedKeywords).toContain("informatik");
    expect(result.matchedKeywords).toContain("münchen");
  });

  it("calculates score correctly as percentage", () => {
    const skills = [makeSkill("React"), makeSkill("Node")];
    // "React Node Docker" = 3 keywords, 2 match
    const result = calculateJobMatch("React Node Docker", skills, [], []);
    expect(result.score).toBe(67); // 2/3 * 100 ≈ 67
  });

  it("generates up to 3 suggestions for missing keywords", () => {
    const result = calculateJobMatch(
      "Python Django PostgreSQL Redis Celery",
      [],
      [],
      [],
    );
    expect(result.suggestions.length).toBeLessThanOrEqual(3);
    expect(result.suggestions[0]).toMatch(/Fügen Sie '.+' als Skill hinzu/);
  });
});
