import type { ApplicationState } from "@/types/application";

const SCHEMA_VERSION = "1.0.0";

/**
 * Serialize the full application state as a JSON string with schema version.
 */
export function exportAsJson(state: ApplicationState): string {
  const exportData = {
    version: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    personalData: state.personalData,
    workExperience: state.workExperience,
    education: state.education,
    skills: state.skills,
    languages: state.languages,
    certificates: state.certificates,
    projects: state.projects,
    jobPosting: state.jobPosting,
    coverLetter: state.coverLetter,
    coverLetterMeta: state.coverLetterMeta,
    documentSelection: state.documentSelection,
    layoutConfig: state.layoutConfig,
    attachments: state.attachments.map((att) => {
      const { blob, ...rest } = att;
      void blob;
      return rest;
    }),
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Create a Blob from the state JSON and trigger a browser download.
 */
export function downloadJson(state: ApplicationState): void {
  const json = exportAsJson(state);
  const blob = new Blob([json], { type: "application/json" });
  const dateStr = new Date().toISOString().slice(0, 10);
  const fileName = `bewerbung_${dateStr}.json`;

  triggerDownload(blob, fileName);
}

/**
 * Trigger a browser download for a given blob and filename.
 */
export function triggerDownload(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
