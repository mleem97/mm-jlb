import { describe, it, expect } from "vitest";
import { calculateStats } from "@/lib/utils/trackerStats";
import type { TrackerEntry } from "@/types/exportConfig";

function entry(status: TrackerEntry["status"], id = "1"): TrackerEntry {
  return {
    id,
    companyName: "Firma",
    jobTitle: "Entwickler",
    appliedAt: "2025-06-15T12:00:00Z",
    status,
  };
}

describe("calculateStats", () => {
  it("returns zeros for an empty array", () => {
    const stats = calculateStats([]);
    expect(stats).toEqual({
      total: 0,
      open: 0,
      responses: 0,
      successRate: 0,
    });
  });

  it("counts all entries with the same status correctly", () => {
    const entries = [entry("gesendet", "1"), entry("gesendet", "2"), entry("gesendet", "3")];
    const stats = calculateStats(entries);
    expect(stats.total).toBe(3);
    expect(stats.open).toBe(3);
    expect(stats.responses).toBe(0);
    expect(stats.successRate).toBe(0);
  });

  it("counts open entries (entwurf + gesendet)", () => {
    const entries = [entry("entwurf", "1"), entry("gesendet", "2"), entry("absage", "3")];
    const stats = calculateStats(entries);
    expect(stats.open).toBe(2);
  });

  it("counts responses (antwort) separately", () => {
    const entries = [
      entry("antwort", "1"),
      entry("antwort", "2"),
      entry("gesendet", "3"),
    ];
    const stats = calculateStats(entries);
    expect(stats.responses).toBe(2);
  });

  it("calculates success rate correctly", () => {
    const entries = [
      entry("zusage", "1"),
      entry("absage", "2"),
      entry("absage", "3"),
      entry("absage", "4"),
    ];
    const stats = calculateStats(entries);
    expect(stats.total).toBe(4);
    expect(stats.successRate).toBe(25);
  });

  it("handles mixed statuses with correct totals", () => {
    const entries = [
      entry("entwurf", "1"),
      entry("gesendet", "2"),
      entry("antwort", "3"),
      entry("absage", "4"),
      entry("zusage", "5"),
    ];
    const stats = calculateStats(entries);
    expect(stats.total).toBe(5);
    expect(stats.open).toBe(2);
    expect(stats.responses).toBe(1);
    expect(stats.successRate).toBe(20);
  });
});
