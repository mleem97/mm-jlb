import { parseCSV } from "./csvParser";
import type { PersonalData } from "@/types/application";
import type { WorkExperience } from "@/types/workExperience";
import type { Education } from "@/types/education";
import type { Skill } from "@/types/skills";
import type { ApplicationImportData } from "@/types/import";

interface LinkedInExportResult {
  data: ApplicationImportData;
  warnings: string[];
}

/**
 * Parse a LinkedIn data export.
 * LinkedIn exports come as a ZIP with multiple CSV files:
 * - Profile.csv: Name, headline, etc.
 * - Positions.csv: Work experience
 * - Education.csv: Education history
 * - Skills.csv: Skills list
 * - Email Addresses.csv: Email addresses
 * - PhoneNumbers.csv: Phone numbers
 *
 * This parser can handle either:
 * 1. Individual CSV files (pass the content + type)
 * 2. Pre-extracted CSV contents as a map
 */
export function parseLinkedInExport(
  csvContents: Record<string, string>,
): LinkedInExportResult {
  const warnings: string[] = [];

  const personalData = parseProfileData(csvContents, warnings);
  const workExperience = parsePositions(csvContents["Positions"] || csvContents["positions"], warnings);
  const education = parseEducation(csvContents["Education"] || csvContents["education"], warnings);
  const skills = parseSkills(csvContents["Skills"] || csvContents["skills"], warnings);

  return {
    data: {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      personalData,
      workExperience,
      education,
      skills,
      languages: [],
      certificates: [],
      projects: [],
    },
    warnings,
  };
}

function parseProfileData(
  csvContents: Record<string, string>,
  warnings: string[],
): PersonalData {
  const profileCsv = csvContents["Profile"] || csvContents["profile"] || "";
  const emailCsv = csvContents["Email Addresses"] || csvContents["email addresses"] || csvContents["Email_Addresses"] || "";
  const phoneCsv = csvContents["PhoneNumbers"] || csvContents["phonenumbers"] || csvContents["Phone_Numbers"] || "";

  let firstName = "";
  let lastName = "";

  if (profileCsv) {
    const rows = parseCSV(profileCsv);
    if (rows.length > 0) {
      const row = rows[0];
      firstName = row["First Name"] || row["first_name"] || row["Vorname"] || "";
      lastName = row["Last Name"] || row["last_name"] || row["Nachname"] || "";
    }
  }

  let email = "";
  if (emailCsv) {
    const rows = parseCSV(emailCsv);
    if (rows.length > 0) {
      email = rows[0]["Email Address"] || rows[0]["email"] || rows[0]["E-Mail"] || "";
    }
  }

  let phone = "";
  if (phoneCsv) {
    const rows = parseCSV(phoneCsv);
    if (rows.length > 0) {
      phone = rows[0]["Number"] || rows[0]["phone"] || rows[0]["Telefon"] || "";
    }
  }

  if (!firstName && !lastName) {
    warnings.push("Profildaten (Name) konnten nicht aus dem LinkedIn-Export extrahiert werden.");
  }
  if (!email) {
    warnings.push("E-Mail-Adresse nicht im LinkedIn-Export gefunden.");
  }

  return {
    firstName,
    lastName,
    email,
    phone,
    address: {
      street: "",
      zip: "",
      city: "",
      country: "Deutschland",
    },
  };
}

function parsePositions(csv: string | undefined, warnings: string[]): WorkExperience[] {
  if (!csv) {
    warnings.push("Keine Positions-Daten im LinkedIn-Export gefunden.");
    return [];
  }

  const rows = parseCSV(csv);
  return rows.map((row, i) => ({
    id: `li-pos-${i}`,
    company: row["Company Name"] || row["company_name"] || row["Unternehmen"] || "",
    jobTitle: row["Title"] || row["title"] || row["Titel"] || "",
    startDate: formatLinkedInDate(row["Started On"] || row["started_on"] || ""),
    endDate: row["Finished On"] || row["finished_on"] ? formatLinkedInDate(row["Finished On"] || row["finished_on"] || "") : undefined,
    isCurrentJob: !(row["Finished On"] || row["finished_on"]),
    location: row["Location"] || row["location"] || row["Standort"] || undefined,
    tasks: row["Description"] ? [row["Description"]] : [],
    achievements: [],
    description: row["Description"] || row["description"] || undefined,
  }));
}

function parseEducation(csv: string | undefined, warnings: string[]): Education[] {
  if (!csv) {
    warnings.push("Keine Education-Daten im LinkedIn-Export gefunden.");
    return [];
  }

  const rows = parseCSV(csv);
  return rows.map((row, i) => ({
    id: `li-edu-${i}`,
    type: "Sonstiges" as const,
    institution: row["School Name"] || row["school_name"] || row["Einrichtung"] || "",
    degree: row["Degree Name"] || row["degree_name"] || row["Abschluss"] || undefined,
    fieldOfStudy: row["Notes"] || row["notes"] || undefined,
    startDate: formatLinkedInDate(row["Start Date"] || row["start_date"] || ""),
    endDate: row["End Date"] || row["end_date"] ? formatLinkedInDate(row["End Date"] || row["end_date"] || "") : undefined,
  }));
}

function parseSkills(csv: string | undefined, warnings: string[]): Skill[] {
  if (!csv) {
    warnings.push("Keine Skills-Daten im LinkedIn-Export gefunden.");
    return [];
  }

  const rows = parseCSV(csv);
  return rows.map((row, i) => ({
    id: `li-skill-${i}`,
    name: row["Name"] || row["name"] || "",
    category: "hard" as const,
    level: 3 as const,
  }));
}

/**
 * LinkedIn dates are typically "MMM YYYY" (e.g., "Jan 2020") or "YYYY".
 * Convert to "YYYY-MM" format.
 */
function formatLinkedInDate(dateStr: string): string {
  if (!dateStr) return "";

  // Already YYYY-MM format
  if (/^\d{4}-\d{2}$/.test(dateStr)) return dateStr;

  // YYYY only
  if (/^\d{4}$/.test(dateStr)) return `${dateStr}-01`;

  // "MMM YYYY" format
  const months: Record<string, string> = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  };

  const match = dateStr.match(/^(\w{3})\s+(\d{4})$/);
  if (match && months[match[1]]) {
    return `${match[2]}-${months[match[1]]}`;
  }

  return dateStr;
}
