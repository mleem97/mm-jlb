import { parseCSV } from "./csvParser";
import type { PersonalData } from "@/types/application";
import type { WorkExperience } from "@/types/workExperience";
import type { Education } from "@/types/education";
import type { ApplicationImportData } from "@/types/import";

interface XingExportResult {
  data: ApplicationImportData;
  warnings: string[];
}

/**
 * Parse a XING data export.
 * XING exports typically come as CSV or JSON files.
 * The CSV format may vary; this parser handles common formats:
 * - Personal data: Name, Email, Phone, Address
 * - Work experience: Company, Title, Period
 * - Education: Institution, Degree, Period
 */
export function parseXingExport(
  csvContents: Record<string, string>,
): XingExportResult {
  const warnings: string[] = [];

  const personalData = parseXingProfile(csvContents, warnings);
  const workExperience = parseXingExperience(csvContents["Berufserfahrung"] || csvContents["experience"] || csvContents["Work Experience"] || "", warnings);
  const education = parseXingEducation(csvContents["Ausbildung"] || csvContents["education"] || csvContents["Education"] || "", warnings);

  return {
    data: {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      personalData,
      workExperience,
      education,
      skills: [],
      languages: [],
      certificates: [],
      projects: [],
    },
    warnings,
  };
}

function parseXingProfile(
  csvContents: Record<string, string>,
  warnings: string[],
): PersonalData {
  const profileCsv = csvContents["Profil"] || csvContents["Profile"] || csvContents["profile"] || "";

  let firstName = "";
  let lastName = "";
  let email = "";
  let phone = "";
  let city = "";

  if (profileCsv) {
    const rows = parseCSV(profileCsv);
    if (rows.length > 0) {
      const row = rows[0];
      firstName = row["Vorname"] || row["First Name"] || row["first_name"] || "";
      lastName = row["Nachname"] || row["Last Name"] || row["last_name"] || "";
      email = row["E-Mail"] || row["Email"] || row["email"] || "";
      phone = row["Telefon"] || row["Phone"] || row["phone"] || "";
      city = row["Stadt"] || row["City"] || row["city"] || "";
    }
  }

  if (!firstName && !lastName) {
    warnings.push("Profildaten (Name) konnten nicht aus dem XING-Export extrahiert werden.");
  }

  return {
    firstName,
    lastName,
    email,
    phone,
    address: {
      street: "",
      zip: "",
      city,
      country: "Deutschland",
    },
  };
}

function parseXingExperience(csv: string, warnings: string[]): WorkExperience[] {
  if (!csv) {
    warnings.push("Keine Berufserfahrungs-Daten im XING-Export gefunden.");
    return [];
  }

  const rows = parseCSV(csv);
  return rows.map((row, i) => ({
    id: `xing-pos-${i}`,
    company: row["Unternehmen"] || row["Company"] || row["company"] || "",
    jobTitle: row["Position"] || row["Titel"] || row["Title"] || row["title"] || "",
    startDate: formatXingDate(row["Von"] || row["Start"] || row["start_date"] || ""),
    endDate: row["Bis"] || row["End"] || row["end_date"] ? formatXingDate(row["Bis"] || row["End"] || row["end_date"] || "") : undefined,
    isCurrentJob: (row["Bis"] || row["End"] || row["end_date"] || "").toLowerCase() === "heute" || !(row["Bis"] || row["End"] || row["end_date"]),
    location: row["Ort"] || row["Location"] || row["location"] || undefined,
    tasks: row["Beschreibung"] ? [row["Beschreibung"]] : [],
    achievements: [],
    description: row["Beschreibung"] || row["Description"] || undefined,
  }));
}

function parseXingEducation(csv: string, warnings: string[]): Education[] {
  if (!csv) {
    warnings.push("Keine Ausbildungs-Daten im XING-Export gefunden.");
    return [];
  }

  const rows = parseCSV(csv);
  return rows.map((row, i) => ({
    id: `xing-edu-${i}`,
    type: "Sonstiges" as const,
    institution: row["Einrichtung"] || row["Institution"] || row["School"] || "",
    degree: row["Abschluss"] || row["Degree"] || undefined,
    fieldOfStudy: row["Fachrichtung"] || row["Field"] || undefined,
    startDate: formatXingDate(row["Von"] || row["Start"] || ""),
    endDate: row["Bis"] || row["End"] ? formatXingDate(row["Bis"] || row["End"] || "") : undefined,
  }));
}

/**
 * XING dates can be "MM/YYYY", "YYYY", or German format "MM.YYYY".
 */
function formatXingDate(dateStr: string): string {
  if (!dateStr) return "";

  // Already YYYY-MM
  if (/^\d{4}-\d{2}$/.test(dateStr)) return dateStr;

  // YYYY only
  if (/^\d{4}$/.test(dateStr)) return `${dateStr}-01`;

  // MM/YYYY
  const slashMatch = dateStr.match(/^(\d{1,2})\/(\d{4})$/);
  if (slashMatch) return `${slashMatch[2]}-${slashMatch[1].padStart(2, "0")}`;

  // MM.YYYY (German)
  const dotMatch = dateStr.match(/^(\d{1,2})\.(\d{4})$/);
  if (dotMatch) return `${dotMatch[2]}-${dotMatch[1].padStart(2, "0")}`;

  return dateStr;
}
