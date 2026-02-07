/**
 * Compresses an image file client-side using the Canvas API.
 * - Max size: 500KB
 * - Converts to WebP if supported, falls back to JPEG
 * - Maintains aspect ratio, resizes if needed
 */

const MAX_FILE_SIZE = 500 * 1024; // 500KB
const MAX_DIMENSION = 1200; // max width or height in px

/**
 * Check if the browser supports WebP encoding via canvas.
 */
function supportsWebP(): boolean {
  if (typeof document === "undefined") return false;
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").startsWith("data:image/webp");
}

/**
 * Load a File as an HTMLImageElement.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Bild konnte nicht geladen werden"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Compress an image using Canvas API.
 * Returns a base64 data URL string.
 */
export async function compressImage(file: File): Promise<string> {
  // If it's already small enough, just return as data URL
  if (file.size <= MAX_FILE_SIZE) {
    const dataUrl = await fileToDataUrl(file);
    return dataUrl;
  }

  const img = await loadImage(file);

  // Calculate new dimensions
  let { width, height } = img;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context nicht verfügbar");
  }

  ctx.drawImage(img, 0, 0, width, height);

  // Clean up object URL
  URL.revokeObjectURL(img.src);

  const mimeType = supportsWebP() ? "image/webp" : "image/jpeg";

  // Try different quality levels to get under MAX_FILE_SIZE
  let quality = 0.85;
  let result = canvas.toDataURL(mimeType, quality);

  while (result.length > MAX_FILE_SIZE * 1.37 && quality > 0.1) {
    // 1.37 factor accounts for base64 overhead
    quality -= 0.1;
    result = canvas.toDataURL(mimeType, quality);
  }

  // If still too large, reduce dimensions further
  if (result.length > MAX_FILE_SIZE * 1.37) {
    const smallerCanvas = document.createElement("canvas");
    const scale = 0.7;
    smallerCanvas.width = Math.round(width * scale);
    smallerCanvas.height = Math.round(height * scale);
    const smallCtx = smallerCanvas.getContext("2d");
    if (smallCtx) {
      smallCtx.drawImage(canvas, 0, 0, smallerCanvas.width, smallerCanvas.height);
      result = smallerCanvas.toDataURL(mimeType, 0.7);
    }
  }

  return result;
}

/**
 * Convert a File to a data URL without compression.
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(typeof reader.result === "string" ? reader.result : "");
    };
    reader.onerror = () => reject(new Error("Datei konnte nicht gelesen werden"));
    reader.readAsDataURL(file);
  });
}
