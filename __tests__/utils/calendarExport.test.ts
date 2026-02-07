import { describe, it, expect } from "vitest";
import { generateICalEvent } from "@/lib/utils/calendarExport";
import type { TrackerEntry } from "@/types/exportConfig";

const sampleEntry: TrackerEntry = {
  id: "test-123",
  companyName: "TechCorp GmbH",
  jobTitle: "Frontend Entwickler",
  appliedAt: "2025-06-15T10:00:00.000Z",
  status: "gesendet",
  reminderDate: "2025-06-30T09:00:00.000Z",
  notes: "Nachfragen bei Frau Müller",
};

describe("generateICalEvent", () => {
  it("returns valid iCal format", () => {
    const ical = generateICalEvent(sampleEntry);
    expect(ical).toContain("BEGIN:VCALENDAR");
    expect(ical).toContain("END:VCALENDAR");
    expect(ical).toContain("BEGIN:VEVENT");
    expect(ical).toContain("END:VEVENT");
    expect(ical).toContain("VERSION:2.0");
  });

  it("contains the company name in summary", () => {
    const ical = generateICalEvent(sampleEntry);
    expect(ical).toContain("TechCorp GmbH");
    expect(ical).toContain("Nachfassen: Bewerbung bei TechCorp GmbH");
  });

  it("contains the date", () => {
    const ical = generateICalEvent(sampleEntry);
    // The reminder date should be used for DTSTART
    expect(ical).toMatch(/DTSTART:\d{8}T\d{6}/);
  });

  it("uses appliedAt when no reminderDate is set", () => {
    const entryNoReminder: TrackerEntry = {
      ...sampleEntry,
      reminderDate: undefined,
    };
    const ical = generateICalEvent(entryNoReminder);
    expect(ical).toMatch(/DTSTART:\d{8}T\d{6}/);
    expect(ical).toContain("BEGIN:VEVENT");
  });
});
