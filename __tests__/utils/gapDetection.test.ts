import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { detectGaps, formatGapDuration, formatYearMonth } from "@/lib/utils/gapDetection";
import type { WorkExperience } from "@/types/workExperience";

function makePosition(
  overrides: Partial<WorkExperience> & { id: string; startDate: string }
): WorkExperience {
  return {
    company: "Test GmbH",
    jobTitle: "Developer",
    isCurrentJob: false,
    location: "Berlin",
    tasks: [],
    achievements: [],
    endDate: "2024-01",
    ...overrides,
  };
}

describe("detectGaps", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns empty array for no positions", () => {
    expect(detectGaps([])).toEqual([]);
  });

  it("returns empty array for single position", () => {
    const positions = [
      makePosition({ id: "1", startDate: "2022-01", endDate: "2024-01" }),
    ];
    expect(detectGaps(positions)).toEqual([]);
  });

  it("returns empty array for consecutive positions (no gap)", () => {
    const positions = [
      makePosition({ id: "1", startDate: "2024-01", endDate: "2024-06" }),
      makePosition({ id: "2", startDate: "2022-01", endDate: "2023-12" }),
    ];
    expect(detectGaps(positions)).toEqual([]);
  });

  it("returns empty array for overlapping positions", () => {
    const positions = [
      makePosition({ id: "1", startDate: "2023-06", endDate: "2024-06" }),
      makePosition({ id: "2", startDate: "2022-01", endDate: "2023-08" }),
    ];
    expect(detectGaps(positions)).toEqual([]);
  });

  it("returns empty array for gap of exactly 3 months (not > 3)", () => {
    const positions = [
      makePosition({ id: "1", startDate: "2024-04", endDate: "2024-12" }),
      makePosition({ id: "2", startDate: "2022-01", endDate: "2024-01" }),
    ];
    // Gap: 2024-01 end → 2024-04 start = 3 months, not > 3
    expect(detectGaps(positions)).toEqual([]);
  });

  it("detects a gap > 3 months", () => {
    const positions = [
      makePosition({ id: "1", startDate: "2024-06", endDate: "2025-01" }),
      makePosition({ id: "2", startDate: "2022-01", endDate: "2024-01" }),
    ];
    // Gap: 2024-01 end → 2024-06 start = 5 months
    const gaps = detectGaps(positions);
    expect(gaps).toHaveLength(1);
    expect(gaps[0].months).toBe(5);
    expect(gaps[0].afterPositionId).toBe("1");
    expect(gaps[0].beforePositionId).toBe("2");
    expect(gaps[0].startDate).toBe("2024-02");
    expect(gaps[0].endDate).toBe("2024-05");
  });

  it("detects multiple gaps", () => {
    const positions = [
      makePosition({ id: "1", startDate: "2024-06", endDate: "2025-01" }),
      makePosition({ id: "2", startDate: "2023-01", endDate: "2023-06" }),
      makePosition({ id: "3", startDate: "2020-01", endDate: "2022-06" }),
    ];
    const gaps = detectGaps(positions);
    expect(gaps).toHaveLength(2);
  });

  it("handles current job positions", () => {
    const positions = [
      makePosition({
        id: "1",
        startDate: "2025-01",
        isCurrentJob: true,
        endDate: undefined,
      }),
      makePosition({ id: "2", startDate: "2022-01", endDate: "2024-06" }),
    ];
    // Gap: 2024-06 end → 2025-01 start = 7 months
    const gaps = detectGaps(positions);
    expect(gaps).toHaveLength(1);
    expect(gaps[0].months).toBe(7);
  });

  it("sorts positions by startDate regardless of input order", () => {
    const positions = [
      makePosition({ id: "2", startDate: "2022-01", endDate: "2023-01" }),
      makePosition({ id: "1", startDate: "2024-06", endDate: "2025-01" }),
    ];
    // Same as above, just different input order
    const gaps = detectGaps(positions);
    expect(gaps).toHaveLength(1);
    expect(gaps[0].afterPositionId).toBe("1");
    expect(gaps[0].beforePositionId).toBe("2");
  });
});

describe("formatGapDuration", () => {
  it("formats months less than 12", () => {
    expect(formatGapDuration(1)).toBe("1 Monat");
    expect(formatGapDuration(5)).toBe("5 Monate");
    expect(formatGapDuration(11)).toBe("11 Monate");
  });

  it("formats exactly 1 year", () => {
    expect(formatGapDuration(12)).toBe("1 Jahr");
  });

  it("formats years with remaining months", () => {
    expect(formatGapDuration(14)).toBe("1 Jahr, 2 Monate");
    expect(formatGapDuration(25)).toBe("2 Jahre, 1 Monat");
  });

  it("formats exact multiple years", () => {
    expect(formatGapDuration(24)).toBe("2 Jahre");
    expect(formatGapDuration(36)).toBe("3 Jahre");
  });
});

describe("formatYearMonth", () => {
  it("formats YYYY-MM to German month name and year", () => {
    expect(formatYearMonth("2024-01")).toBe("Januar 2024");
    expect(formatYearMonth("2023-06")).toBe("Juni 2023");
    expect(formatYearMonth("2022-12")).toBe("Dezember 2022");
    expect(formatYearMonth("2024-03")).toBe("März 2024");
  });
});
