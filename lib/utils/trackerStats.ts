import type { TrackerEntry } from "@/types/exportConfig";

export interface TrackerStats {
  total: number;
  open: number;
  responses: number;
  successRate: number;
}

/**
 * Calculates statistics from an array of TrackerEntry items.
 *
 * - total: total number of entries
 * - open: entries with status "entwurf" or "gesendet"
 * - responses: entries with status "antwort"
 * - successRate: (zusage / total) * 100, or 0 if no entries
 */
export function calculateStats(entries: TrackerEntry[]): TrackerStats {
  if (entries.length === 0) {
    return { total: 0, open: 0, responses: 0, successRate: 0 };
  }

  const total = entries.length;
  const open = entries.filter(
    (e) => e.status === "entwurf" || e.status === "gesendet",
  ).length;
  const responses = entries.filter((e) => e.status === "antwort").length;
  const zusage = entries.filter((e) => e.status === "zusage").length;
  const successRate = Math.round((zusage / total) * 100);

  return { total, open, responses, successRate };
}
