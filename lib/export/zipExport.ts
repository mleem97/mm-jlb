import JSZip from "jszip";

import type { ApplicationState } from "@/types/application";
import { applicationDb, type AttachmentRecord } from "@/lib/db/applicationDb";
import { exportAsJson } from "@/lib/export/jsonExport";
import { triggerDownload } from "@/lib/export/jsonExport";

/**
 * Create a ZIP blob containing the full application state and all attachment files.
 */
export async function exportAsZip(
  state: ApplicationState,
  attachmentRecords: AttachmentRecord[],
): Promise<Blob> {
  const zip = new JSZip();

  // Add the full state as JSON
  const json = exportAsJson(state);
  zip.file("bewerbung.json", json);

  // Add all attachment blobs under /Anlagen/
  const anlagenFolder = zip.folder("Anlagen");
  if (anlagenFolder) {
    for (const record of attachmentRecords) {
      anlagenFolder.file(record.fileName, record.blob);
    }
  }

  return zip.generateAsync({ type: "blob" });
}

/**
 * Build filename from personal data and company name.
 */
function buildFileName(state: ApplicationState): string {
  const lastName = state.personalData.lastName || "Bewerbung";
  const company = state.jobPosting?.companyName || "Firma";
  const safeLast = lastName.replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, "_");
  const safeCompany = company.replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, "_");
  return `Bewerbung_${safeLast}_${safeCompany}.zip`;
}

/**
 * Fetch attachments from Dexie, create a ZIP blob, and trigger download.
 */
export async function downloadZip(state: ApplicationState): Promise<void> {
  const attachmentRecords = await applicationDb.attachments.toArray();
  const blob = await exportAsZip(state, attachmentRecords);
  const fileName = buildFileName(state);
  triggerDownload(blob, fileName);
}
