export type AttachmentCategory =
  | "zeugnis"
  | "zertifikat"
  | "referenz"
  | "arbeitsprobe"
  | "sonstiges";

export type AttachmentFileType = "pdf" | "image" | "doc";

export interface Attachment {
  id: string;
  fileName: string;
  fileType: AttachmentFileType;
  fileSize: number;
  category: AttachmentCategory;
  blob?: Blob;
  addedAt: string; // ISO date string
}
