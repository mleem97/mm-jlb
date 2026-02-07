import type { TrackerEntry } from "@/types/exportConfig";

function formatDateToICS(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}T090000`;
}

function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Generate iCal VCALENDAR string for a tracker entry reminder.
 */
export function generateICalEvent(entry: TrackerEntry): string {
  const dateStr = entry.reminderDate ?? entry.appliedAt;
  const dtStart = formatDateToICS(dateStr);

  // End date is same day, 1 hour later
  const endDate = new Date(dateStr);
  endDate.setHours(endDate.getHours() + 1);
  const dtEnd = formatDateToICS(endDate.toISOString());

  const summary = escapeICalText(
    `Nachfassen: Bewerbung bei ${entry.companyName}`,
  );
  const description = escapeICalText(
    `Position: ${entry.jobTitle}\nStatus: ${entry.status}${entry.notes ? `\nNotizen: ${entry.notes}` : ""}`,
  );

  const now = new Date();
  const dtstamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//JobLetterBuilder//DE",
    "BEGIN:VEVENT",
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `DTSTAMP:${dtstamp}`,
    `UID:${entry.id}@jobletterbuilder`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${summary}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/**
 * Trigger browser download of an .ics file.
 */
export function downloadICalFile(entry: TrackerEntry): void {
  const content = generateICalEvent(entry);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `bewerbung-${entry.companyName.toLowerCase().replace(/\s+/g, "-")}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
