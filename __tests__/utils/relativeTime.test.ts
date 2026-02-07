import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatRelativeTime } from "@/lib/utils/relativeTime";

describe("formatRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns empty string for null", () => {
    expect(formatRelativeTime(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(formatRelativeTime(undefined)).toBe("");
  });

  it('returns "gerade eben" for less than 5 seconds ago', () => {
    const date = new Date("2025-06-15T11:59:57Z"); // 3 seconds ago
    expect(formatRelativeTime(date)).toBe("gerade eben");
  });

  it('returns "gerade eben" for dates in the future', () => {
    const date = new Date("2025-06-15T12:00:05Z"); // 5 seconds in the future
    expect(formatRelativeTime(date)).toBe("gerade eben");
  });

  it("returns seconds for 5–59 seconds ago", () => {
    const date = new Date("2025-06-15T11:59:50Z"); // 10 seconds ago
    expect(formatRelativeTime(date)).toBe("vor 10 Sek.");
  });

  it("returns seconds for exactly 5 seconds ago", () => {
    const date = new Date("2025-06-15T11:59:55Z"); // 5 seconds ago
    expect(formatRelativeTime(date)).toBe("vor 5 Sek.");
  });

  it("returns minutes for 1–59 minutes ago", () => {
    const date = new Date("2025-06-15T11:57:00Z"); // 3 minutes ago
    expect(formatRelativeTime(date)).toBe("vor 3 Min.");
  });

  it("returns hours for 1–23 hours ago", () => {
    const date = new Date("2025-06-15T10:00:00Z"); // 2 hours ago
    expect(formatRelativeTime(date)).toBe("vor 2 Std.");
  });

  it("returns days for 24+ hours ago", () => {
    const date = new Date("2025-06-13T12:00:00Z"); // 2 days ago
    expect(formatRelativeTime(date)).toBe("vor 2 Tagen");
  });

  it("returns singular day for exactly 1 day ago", () => {
    const date = new Date("2025-06-14T12:00:00Z"); // 1 day ago
    expect(formatRelativeTime(date)).toBe("vor 1 Tag");
  });

  it("handles 30 seconds ago", () => {
    const date = new Date("2025-06-15T11:59:30Z");
    expect(formatRelativeTime(date)).toBe("vor 30 Sek.");
  });

  it("handles exactly 1 minute ago", () => {
    const date = new Date("2025-06-15T11:59:00Z");
    expect(formatRelativeTime(date)).toBe("vor 1 Min.");
  });

  it("handles exactly 1 hour ago", () => {
    const date = new Date("2025-06-15T11:00:00Z");
    expect(formatRelativeTime(date)).toBe("vor 1 Std.");
  });
});
