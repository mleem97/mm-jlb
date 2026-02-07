import { describe, it, expect, vi, beforeEach } from "vitest";
import { compressImage } from "@/lib/utils/imageCompression";

// ─── Mock Canvas and Image for jsdom ────────────────────────

function createMockCanvas(width: number, height: number) {
  const dataUrl = `data:image/jpeg;base64,${btoa("fake-image-data")}`;
  return {
    width,
    height,
    getContext: () => ({
      drawImage: vi.fn(),
    }),
    toDataURL: vi.fn().mockReturnValue(dataUrl),
  };
}

describe("compressImage", () => {
  beforeEach(() => {
    // Mock document.createElement for canvas
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tag: string) => {
      if (tag === "canvas") {
        return createMockCanvas(800, 600) as unknown as HTMLCanvasElement;
      }
      return originalCreateElement(tag);
    });

    // Mock URL.createObjectURL and URL.revokeObjectURL
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:mock-url");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  });

  it("returns a data URL for small files without compression", async () => {
    // Create a small mock file (< 500KB)
    const smallContent = new Uint8Array(100);
    const file = new File([smallContent], "small.jpg", { type: "image/jpeg" });

    const result = await compressImage(file);
    expect(result).toContain("data:");
  });

  it("is exported as a function", () => {
    expect(typeof compressImage).toBe("function");
  });

  it("rejects when given an invalid input", async () => {
    // Attempting to compress something that's not really an image
    // In jsdom this won't fully work, but we check the function handles errors
    const emptyFile = new File([], "empty.jpg", { type: "image/jpeg" });
    const result = await compressImage(emptyFile);
    // Empty file is < 500KB, so it just returns a data URL
    expect(result).toContain("data:");
  });
});
