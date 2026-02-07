import JSZip from "jszip";
import { applicationImportSchema } from "@/lib/schemas/importSchema";
import type { ApplicationImportData } from "@/types/import";
import { parseLinkedInExport } from "./linkedinParser";
import { parseXingExport } from "./xingParser";

export interface ZipImportResult {
  data: ApplicationImportData;
  attachmentFiles: Array<{
    name: string;
    blob: Blob;
    type: string;
  }>;
  warnings: string[];
}

/**
 * Unpack a ZIP file and extract:
 * 1. A JSON file with application data
 * 2. Any attachment files (PDF, images, docs)
 *
 * Also supports LinkedIn/XING ZIP exports with CSV files.
 */
export async function importFromZip(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<ZipImportResult> {
  const warnings: string[] = [];

  onProgress?.(10);
  const zip = await JSZip.loadAsync(file);
  onProgress?.(30);

  const fileNames = Object.keys(zip.files).filter(
    (name) => !name.startsWith("__MACOSX") && !zip.files[name].dir,
  );

  // Try to find a JSON file first (JLB export)
  const jsonFileName = fileNames.find((name) =>
    name.toLowerCase().endsWith(".json"),
  );

  if (jsonFileName) {
    return importJlbZip(zip, jsonFileName, fileNames, onProgress, warnings);
  }

  // Check for LinkedIn CSV structure
  const csvFiles = fileNames.filter((name) =>
    name.toLowerCase().endsWith(".csv"),
  );

  if (csvFiles.length > 0) {
    return importCsvZip(zip, csvFiles, onProgress, warnings);
  }

  throw new Error(
    "Keine JSON- oder CSV-Dateien im ZIP-Archiv gefunden. Bitte ein gültiges Export-Archiv verwenden.",
  );
}

async function importJlbZip(
  zip: JSZip,
  jsonFileName: string,
  fileNames: string[],
  onProgress?: (progress: number) => void,
  warnings: string[] = [],
): Promise<ZipImportResult> {
  const jsonContent = await zip.files[jsonFileName].async("string");
  onProgress?.(50);

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonContent);
  } catch {
    throw new Error(
      `Die Datei ${jsonFileName} enthält kein gültiges JSON.`,
    );
  }

  const result = applicationImportSchema.safeParse(parsed);
  if (!result.success) {
    const firstError = result.error.issues[0];
    throw new Error(
      firstError
        ? `Validierung: ${firstError.path.join(".")}: ${firstError.message}`
        : "Die JSON-Datei entspricht nicht dem erwarteten Format.",
    );
  }
  onProgress?.(70);

  // Extract attachment files
  const attachmentFiles: ZipImportResult["attachmentFiles"] = [];
  const attachmentNames = fileNames.filter((name) => {
    const lower = name.toLowerCase();
    return (
      !lower.endsWith(".json") &&
      (lower.endsWith(".pdf") ||
        lower.endsWith(".jpg") ||
        lower.endsWith(".jpeg") ||
        lower.endsWith(".png") ||
        lower.endsWith(".docx"))
    );
  });

  for (const name of attachmentNames) {
    const blob = await zip.files[name].async("blob");
    const ext = name.split(".").pop()?.toLowerCase() || "";
    attachmentFiles.push({
      name: name.split("/").pop() || name,
      blob,
      type: ext === "pdf" ? "pdf" : ext === "docx" ? "doc" : "image",
    });
  }
  onProgress?.(90);

  return { data: result.data, attachmentFiles, warnings };
}

async function importCsvZip(
  zip: JSZip,
  csvFiles: string[],
  onProgress?: (progress: number) => void,
  warnings: string[] = [],
): Promise<ZipImportResult> {
  // Read all CSV files
  const csvContents: Record<string, string> = {};
  for (const csvFile of csvFiles) {
    const name = csvFile
      .split("/")
      .pop()
      ?.replace(/\.csv$/i, "") || csvFile;
    csvContents[name] = await zip.files[csvFile].async("string");
  }
  onProgress?.(60);

  // Detect if it's LinkedIn or XING based on file names
  const fileNamesLower = csvFiles.map((f) => f.toLowerCase());
  const isLinkedIn = fileNamesLower.some(
    (f) =>
      f.includes("positions") ||
      f.includes("profile") ||
      f.includes("connections"),
  );
  const isXing = fileNamesLower.some(
    (f) =>
      f.includes("berufserfahrung") ||
      f.includes("profil") ||
      f.includes("xing"),
  );

  let result;
  if (isLinkedIn) {
    result = parseLinkedInExport(csvContents);
    warnings.push(...result.warnings);
  } else if (isXing) {
    result = parseXingExport(csvContents);
    warnings.push(...result.warnings);
  } else {
    // Try LinkedIn format as default
    result = parseLinkedInExport(csvContents);
    warnings.push(...result.warnings);
    warnings.push(
      "CSV-Format konnte nicht eindeutig als LinkedIn oder XING erkannt werden. LinkedIn-Format wurde versucht.",
    );
  }
  onProgress?.(90);

  return { data: result.data, attachmentFiles: [], warnings };
}
