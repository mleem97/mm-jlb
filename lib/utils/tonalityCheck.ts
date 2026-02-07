export interface TonalityResult {
  formality: "zu locker" | "passend" | "zu steif";
  length: { chars: number; pages: number; ok: boolean };
  actionVerbs: { count: number; examples: string[] };
  cliches: { found: string[]; alternatives: Record<string, string> };
  score: number; // 0-100
}

const INFORMAL_WORDS = [
  "hi",
  "hey",
  "cool",
  "mega",
  "krass",
  "geil",
  "super",
  "echt",
  "halt",
  "voll",
  "chillig",
  "nice",
];

const OVERLY_FORMAL_WORDS = [
  "hochverehrte",
  "hochverehrter",
  "geruhen",
  "hochwohlgeboren",
  "ergebenst",
  "untertänigst",
  "hochachtungsvoll",
];

const ACTION_VERBS = [
  "entwickelt",
  "geleitet",
  "optimiert",
  "implementiert",
  "gesteigert",
  "koordiniert",
  "verantwortet",
  "initiiert",
  "realisiert",
  "akquiriert",
];

const CLICHE_ALTERNATIVES: Record<string, string> = {
  teamfähig: 'Habe in einem 5-köpfigen Team...',
  motiviert: "Begeistert mich für...",
  belastbar: "Habe unter Zeitdruck...",
  dynamisch: "Habe in schnelllebigen Projekten agil reagiert",
  "mit großem interesse":
    "Weil ich [konkreter Grund]...",
};

const MAX_CHARS = 3500;
const CHARS_PER_PAGE = 3500;

function normalizeForSearch(text: string): string {
  return text.toLowerCase();
}

function checkFormality(text: string): "zu locker" | "passend" | "zu steif" {
  const lower = normalizeForSearch(text);
  const words = lower.split(/\s+/);

  let informalCount = 0;
  let formalCount = 0;

  for (const word of words) {
    const cleaned = word.replace(/[^a-zäöüß]/g, "");
    if (INFORMAL_WORDS.includes(cleaned)) informalCount++;
    if (OVERLY_FORMAL_WORDS.includes(cleaned)) formalCount++;
  }

  if (informalCount >= 2) return "zu locker";
  if (formalCount >= 1) return "zu steif";
  return "passend";
}

function checkLength(text: string): {
  chars: number;
  pages: number;
  ok: boolean;
} {
  const chars = text.length;
  const pages = Math.round((chars / CHARS_PER_PAGE) * 10) / 10;
  return {
    chars,
    pages,
    ok: chars <= MAX_CHARS,
  };
}

function findActionVerbs(text: string): { count: number; examples: string[] } {
  const lower = normalizeForSearch(text);
  const found: string[] = [];

  for (const verb of ACTION_VERBS) {
    if (lower.includes(verb)) {
      found.push(verb);
    }
  }

  return {
    count: found.length,
    examples: found,
  };
}

function findCliches(
  text: string,
): { found: string[]; alternatives: Record<string, string> } {
  const lower = normalizeForSearch(text);
  const found: string[] = [];
  const alternatives: Record<string, string> = {};

  for (const [cliche, alternative] of Object.entries(CLICHE_ALTERNATIVES)) {
    if (lower.includes(cliche.toLowerCase())) {
      found.push(cliche);
      alternatives[cliche] = alternative;
    }
  }

  return { found, alternatives };
}

function calculateScore(
  formality: "zu locker" | "passend" | "zu steif",
  length: { ok: boolean },
  actionVerbs: { count: number },
  cliches: { found: string[] },
): number {
  let score = 100;

  // Formality: -20 if not passend
  if (formality !== "passend") score -= 20;

  // Length: -15 if too long
  if (!length.ok) score -= 15;

  // Action verbs: bonus for using them, penalty for none
  if (actionVerbs.count === 0) {
    score -= 15;
  } else if (actionVerbs.count >= 3) {
    score = Math.min(100, score + 5);
  }

  // Clichés: -10 per cliché (max -30)
  score -= Math.min(30, cliches.found.length * 10);

  return Math.max(0, Math.min(100, score));
}

export function checkTonality(coverLetterText: string): TonalityResult {
  const formality = checkFormality(coverLetterText);
  const length = checkLength(coverLetterText);
  const actionVerbs = findActionVerbs(coverLetterText);
  const cliches = findCliches(coverLetterText);
  const score = calculateScore(formality, length, actionVerbs, cliches);

  return {
    formality,
    length,
    actionVerbs,
    cliches,
    score,
  };
}
