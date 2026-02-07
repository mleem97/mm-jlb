export type SkillCategory = "hard" | "digital" | "green" | "soft";
export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
}

export type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Muttersprache";

export interface Language {
  id: string;
  name: string;
  level: LanguageLevel;
}
