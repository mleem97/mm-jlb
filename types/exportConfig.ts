export type ExportFormat = "pdf" | "zip" | "json";
export type PdfMode = "single" | "bundle";

export interface ExportConfig {
  format: ExportFormat;
  pdfMode: PdfMode;
  includeAttachments: boolean;
}

export interface EmailConfig {
  recipientEmail: string;
  senderEmail: string;
  senderName: string;
  subject: string;
  body: string;
}

export type TrackerStatus = "entwurf" | "gesendet" | "antwort" | "absage" | "zusage";

export interface TrackerEntry {
  id: string;
  companyName: string;
  jobTitle: string;
  appliedAt: string; // ISO date
  status: TrackerStatus;
  reminderDate?: string;
  notes?: string;
  exportFormat?: ExportFormat;
}
