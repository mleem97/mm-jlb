import type { Attachment, AttachmentFileType } from "@/types/attachment";

// ─── Constants ─────────────────────────────────────────────
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50 MB

export const ALLOWED_MIME_TYPES: Record<string, AttachmentFileType> = {
  "application/pdf": "pdf",
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "doc",
};

const MIME_TYPE_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WebP",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "DOCX",
};

// ─── Helpers ───────────────────────────────────────────────

/** Determines the `AttachmentFileType` for a given MIME type. */
export function getFileTypeCategory(mimeType: string): AttachmentFileType {
  const mapped = ALLOWED_MIME_TYPES[mimeType];
  if (mapped) return mapped;
  if (mimeType.startsWith("image/")) return "image";
  return "doc";
}

/** Validates a single file for type and size constraints. */
export function validateAttachmentFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!ALLOWED_MIME_TYPES[file.type]) {
    const allowed = Object.values(MIME_TYPE_LABELS).join(", ");
    return {
      valid: false,
      error: `Dateityp „${file.type || "unbekannt"}" ist nicht erlaubt. Erlaubt: ${allowed}`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(1);
    return {
      valid: false,
      error: `Datei ist zu groß (${sizeMB} MB). Maximal 10 MB pro Datei.`,
    };
  }

  return { valid: true };
}

/** Checks if adding a new file would exceed the total size limit. */
export function validateTotalSize(
  attachments: Attachment[],
  newFileSize: number,
): { valid: boolean; error?: string } {
  const currentTotal = attachments.reduce((sum, a) => sum + a.fileSize, 0);
  const newTotal = currentTotal + newFileSize;

  if (newTotal > MAX_TOTAL_SIZE) {
    const currentMB = (currentTotal / 1024 / 1024).toFixed(1);
    const maxMB = (MAX_TOTAL_SIZE / 1024 / 1024).toFixed(0);
    return {
      valid: false,
      error: `Gesamtgröße würde ${maxMB} MB überschreiten (aktuell: ${currentMB} MB).`,
    };
  }

  return { valid: true };
}
