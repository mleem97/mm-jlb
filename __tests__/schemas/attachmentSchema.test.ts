import { describe, it, expect } from "vitest";
import {
  validateAttachmentFile,
  validateTotalSize,
  getFileTypeCategory,
  MAX_FILE_SIZE,
  MAX_TOTAL_SIZE,
  ALLOWED_MIME_TYPES,
} from "@/lib/schemas/attachmentSchema";
import type { Attachment } from "@/types/attachment";

// ─── Helpers ────────────────────────────────────────────────

function createMockFile(
  name: string,
  size: number,
  type: string,
): File {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], name, { type });
}

function createMockAttachment(
  overrides: Partial<Attachment> = {},
): Attachment {
  return {
    id: crypto.randomUUID(),
    fileName: "test.pdf",
    fileType: "pdf",
    fileSize: 1024 * 1024, // 1 MB
    category: "sonstiges",
    addedAt: new Date().toISOString(),
    ...overrides,
  };
}

// ─── Tests ──────────────────────────────────────────────────

describe("attachmentSchema", () => {
  // ─── Constants ───────────────────────────────────────────
  describe("constants", () => {
    it("MAX_FILE_SIZE is 10 MB", () => {
      expect(MAX_FILE_SIZE).toBe(10 * 1024 * 1024);
    });

    it("MAX_TOTAL_SIZE is 50 MB", () => {
      expect(MAX_TOTAL_SIZE).toBe(50 * 1024 * 1024);
    });

    it("ALLOWED_MIME_TYPES contains all expected types", () => {
      expect(ALLOWED_MIME_TYPES).toHaveProperty("application/pdf");
      expect(ALLOWED_MIME_TYPES).toHaveProperty("image/jpeg");
      expect(ALLOWED_MIME_TYPES).toHaveProperty("image/png");
      expect(ALLOWED_MIME_TYPES).toHaveProperty("image/webp");
      expect(ALLOWED_MIME_TYPES).toHaveProperty(
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      );
    });
  });

  // ─── validateAttachmentFile ──────────────────────────────
  describe("validateAttachmentFile", () => {
    it("accepts a valid PDF file under 10 MB", () => {
      const file = createMockFile("document.pdf", 5 * 1024 * 1024, "application/pdf");
      const result = validateAttachmentFile(file);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("accepts a valid JPEG image", () => {
      const file = createMockFile("photo.jpg", 2 * 1024 * 1024, "image/jpeg");
      const result = validateAttachmentFile(file);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("accepts a valid PNG image", () => {
      const file = createMockFile("screenshot.png", 1 * 1024 * 1024, "image/png");
      const result = validateAttachmentFile(file);
      expect(result.valid).toBe(true);
    });

    it("rejects a file exceeding 10 MB", () => {
      const file = createMockFile("huge.pdf", 11 * 1024 * 1024, "application/pdf");
      const result = validateAttachmentFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("zu groß");
    });

    it("rejects an invalid file type", () => {
      const file = createMockFile("script.exe", 1024, "application/x-msdownload");
      const result = validateAttachmentFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("nicht erlaubt");
    });

    it("rejects a file with empty/unknown MIME type", () => {
      const file = createMockFile("unknown.xyz", 1024, "");
      const result = validateAttachmentFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("nicht erlaubt");
    });
  });

  // ─── validateTotalSize ───────────────────────────────────
  describe("validateTotalSize", () => {
    it("accepts when total remains under limit", () => {
      const attachments = [createMockAttachment({ fileSize: 10 * 1024 * 1024 })];
      const result = validateTotalSize(attachments, 5 * 1024 * 1024);
      expect(result.valid).toBe(true);
    });

    it("rejects when total would exceed 50 MB", () => {
      const attachments = [createMockAttachment({ fileSize: 45 * 1024 * 1024 })];
      const result = validateTotalSize(attachments, 6 * 1024 * 1024);
      expect(result.valid).toBe(false);
      expect(result.error).toContain("überschreiten");
    });

    it("accepts when total is exactly 50 MB", () => {
      const attachments = [createMockAttachment({ fileSize: 40 * 1024 * 1024 })];
      const result = validateTotalSize(attachments, 10 * 1024 * 1024);
      expect(result.valid).toBe(true);
    });
  });

  // ─── getFileTypeCategory ─────────────────────────────────
  describe("getFileTypeCategory", () => {
    it("returns 'pdf' for application/pdf", () => {
      expect(getFileTypeCategory("application/pdf")).toBe("pdf");
    });

    it("returns 'image' for image/jpeg", () => {
      expect(getFileTypeCategory("image/jpeg")).toBe("image");
    });

    it("returns 'image' for image/png", () => {
      expect(getFileTypeCategory("image/png")).toBe("image");
    });

    it("returns 'image' for image/webp", () => {
      expect(getFileTypeCategory("image/webp")).toBe("image");
    });

    it("returns 'doc' for DOCX MIME type", () => {
      expect(
        getFileTypeCategory(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ),
      ).toBe("doc");
    });

    it("returns 'image' for unknown image/* types", () => {
      expect(getFileTypeCategory("image/gif")).toBe("image");
    });

    it("returns 'doc' for unrecognized types", () => {
      expect(getFileTypeCategory("application/octet-stream")).toBe("doc");
    });
  });
});
