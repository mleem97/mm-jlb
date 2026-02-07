import type { Skill } from "@/types/skills";
import type { WorkExperience } from "@/types/workExperience";
import type { Education } from "@/types/education";

export interface MatchResult {
  score: number; // 0-100
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

const GERMAN_STOP_WORDS = new Set([
  "und",
  "oder",
  "der",
  "die",
  "das",
  "in",
  "von",
  "für",
  "mit",
  "zu",
  "auf",
  "an",
  "ist",
  "ein",
  "eine",
  "als",
  "auch",
  "es",
  "sie",
  "er",
  "wir",
  "den",
  "dem",
  "des",
  "im",
  "nicht",
  "sich",
  "werden",
  "wird",
  "sind",
  "hat",
  "haben",
  "dass",
  "nach",
  "bei",
  "aus",
  "über",
  "wie",
  "aber",
  "so",
  "um",
  "wenn",
  "noch",
  "nur",
  "mehr",
  "am",
  "man",
  "zum",
  "sehr",
  "kann",
  "alle",
  "durch",
  "ihre",
  "sein",
  "vor",
  "uns",
  "diese",
  "unter",
  "zwischen",
  "ohne",
]);

function normalizeWord(word: string): string {
  return word
    .toLowerCase()
    .replace(/[^a-zäöüß0-9+#]/g, "")
    .trim();
}

function extractKeywords(text: string): string[] {
  const words = text.split(/[\s,;.!?:()[\]{}"'\/\\|–—\-_]+/);
  const keywords: string[] = [];
  const seen = new Set<string>();

  for (const word of words) {
    const normalized = normalizeWord(word);
    if (
      normalized.length >= 2 &&
      !GERMAN_STOP_WORDS.has(normalized) &&
      !seen.has(normalized)
    ) {
      seen.add(normalized);
      keywords.push(normalized);
    }
  }

  return keywords;
}

function buildProfileTerms(
  skills: Skill[],
  workExperience: WorkExperience[],
  education: Education[],
): Set<string> {
  const terms = new Set<string>();

  for (const skill of skills) {
    const normalized = normalizeWord(skill.name);
    if (normalized) terms.add(normalized);
    // Also add individual words for multi-word skills
    for (const part of skill.name.split(/\s+/)) {
      const normalizedPart = normalizeWord(part);
      if (normalizedPart.length >= 2) terms.add(normalizedPart);
    }
  }

  for (const exp of workExperience) {
    for (const part of exp.jobTitle.split(/\s+/)) {
      const normalized = normalizeWord(part);
      if (normalized.length >= 2 && !GERMAN_STOP_WORDS.has(normalized)) {
        terms.add(normalized);
      }
    }
    for (const part of exp.company.split(/\s+/)) {
      const normalized = normalizeWord(part);
      if (normalized.length >= 2 && !GERMAN_STOP_WORDS.has(normalized)) {
        terms.add(normalized);
      }
    }
  }

  for (const edu of education) {
    for (const part of edu.institution.split(/\s+/)) {
      const normalized = normalizeWord(part);
      if (normalized.length >= 2 && !GERMAN_STOP_WORDS.has(normalized)) {
        terms.add(normalized);
      }
    }
    if (edu.fieldOfStudy) {
      for (const part of edu.fieldOfStudy.split(/\s+/)) {
        const normalized = normalizeWord(part);
        if (normalized.length >= 2 && !GERMAN_STOP_WORDS.has(normalized)) {
          terms.add(normalized);
        }
      }
    }
  }

  return terms;
}

export function calculateJobMatch(
  jobDescriptionText: string,
  skills: Skill[],
  workExperience: WorkExperience[],
  education: Education[],
): MatchResult {
  if (!jobDescriptionText.trim()) {
    return {
      score: 0,
      matchedKeywords: [],
      missingKeywords: [],
      suggestions: [],
    };
  }

  const keywords = extractKeywords(jobDescriptionText);

  if (keywords.length === 0) {
    return {
      score: 0,
      matchedKeywords: [],
      missingKeywords: [],
      suggestions: [],
    };
  }

  const profileTerms = buildProfileTerms(skills, workExperience, education);

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const keyword of keywords) {
    if (profileTerms.has(keyword)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  }

  const score = Math.round((matchedKeywords.length / keywords.length) * 100);

  const suggestions = missingKeywords
    .slice(0, 3)
    .map((kw) => `Fügen Sie '${kw}' als Skill hinzu`);

  return {
    score,
    matchedKeywords,
    missingKeywords,
    suggestions,
  };
}
