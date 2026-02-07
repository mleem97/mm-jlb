import type { WorkExperience } from "@/types/workExperience";

export interface GapInfo {
  afterPositionId: string;
  beforePositionId: string;
  startDate: string; // YYYY-MM — end of the earlier (chronologically) position
  endDate: string; // YYYY-MM — start of the later position
  months: number;
  explanation?: string;
  explanationType?: "Elternzeit" | "Sabbatical" | "Weiterbildung" | "Arbeitssuche" | "Sonstiges";
}

/**
 * Parse a "YYYY-MM" string into year and month (1-based).
 */
function parseYearMonth(ym: string): { year: number; month: number } {
  const [y, m] = ym.split("-").map(Number);
  return { year: y, month: m };
}

/**
 * Calculate the difference in months between two YYYY-MM strings.
 * Returns a positive number if `b` is after `a`.
 */
function monthDiff(a: string, b: string): number {
  const pa = parseYearMonth(a);
  const pb = parseYearMonth(b);
  return (pb.year - pa.year) * 12 + (pb.month - pa.month);
}

/**
 * Add one month to a YYYY-MM string (to get the "gap start" after a position ends).
 */
function addMonth(ym: string): string {
  const { year, month } = parseYearMonth(ym);
  if (month === 12) {
    return `${year + 1}-01`;
  }
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

/**
 * Subtract one month from a YYYY-MM string (to get the "gap end" before a position starts).
 */
function subtractMonth(ym: string): string {
  const { year, month } = parseYearMonth(ym);
  if (month === 1) {
    return `${year - 1}-12`;
  }
  return `${year}-${String(month - 1).padStart(2, "0")}`;
}

/**
 * Detect employment gaps longer than 3 months between sorted work positions.
 *
 * Positions are sorted by startDate descending (newest first), which matches
 * how they appear in the UI. The returned gaps reference `afterPositionId`
 * (the newer/upper position) and `beforePositionId` (the older/lower position).
 */
export function detectGaps(positions: WorkExperience[]): GapInfo[] {
  if (positions.length < 2) return [];

  // Only consider positions that have end dates (or use current date for current jobs)
  const withDates = positions
    .map((p) => ({
      id: p.id,
      start: p.startDate,
      end: p.isCurrentJob ? getCurrentYearMonth() : p.endDate,
    }))
    .filter((p): p is { id: string; start: string; end: string } => !!p.start && !!p.end);

  // Sort by startDate descending (newest first)
  const sorted = [...withDates].sort((a, b) => (b.start > a.start ? 1 : b.start < a.start ? -1 : 0));

  const gaps: GapInfo[] = [];

  for (let i = 0; i < sorted.length - 1; i++) {
    const newer = sorted[i]; // the position that comes later in time (appears first)
    const older = sorted[i + 1]; // the position that comes earlier in time (appears after)

    // The gap is between the end of the older position and the start of the newer one
    const gapMonths = monthDiff(older.end, newer.start);

    if (gapMonths > 3) {
      gaps.push({
        afterPositionId: newer.id,
        beforePositionId: older.id,
        startDate: addMonth(older.end),
        endDate: subtractMonth(newer.start),
        months: gapMonths,
      });
    }
  }

  return gaps;
}

/**
 * Get the current year-month as "YYYY-MM".
 */
function getCurrentYearMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Format a gap duration for display (German).
 */
export function formatGapDuration(months: number): string {
  if (months < 12) {
    return `${months} Monat${months === 1 ? "" : "e"}`;
  }
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  const yearStr = `${years} Jahr${years === 1 ? "" : "e"}`;
  if (remaining === 0) return yearStr;
  return `${yearStr}, ${remaining} Monat${remaining === 1 ? "" : "e"}`;
}

/**
 * Format a YYYY-MM string to German display format (e.g. "Januar 2024").
 */
export function formatYearMonth(ym: string): string {
  const { year, month } = parseYearMonth(ym);
  const monthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
  ];
  return `${monthNames[month - 1]} ${year}`;
}
