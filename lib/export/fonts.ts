import { Font } from "@react-pdf/renderer";

// ─── Register Local Fonts ──────────────────────────────────
// Fonts are loaded from public/fonts/ directory.
// Each font is registered as two separate families: regular and bold.
// This matches the existing FONT_MAP pattern used throughout templates
// (e.g. fontFamily: font.regular / fontFamily: font.bold).

const FONTS = [
  { name: "Inter", regular: "/fonts/Inter-Regular.ttf", bold: "/fonts/Inter-Bold.ttf" },
  { name: "Roboto", regular: "/fonts/Roboto-Regular.ttf", bold: "/fonts/Roboto-Bold.ttf" },
  { name: "Merriweather", regular: "/fonts/Merriweather-Regular.ttf", bold: "/fonts/Merriweather-Bold.ttf" },
  { name: "OpenSans", regular: "/fonts/OpenSans-Regular.ttf", bold: "/fonts/OpenSans-Bold.ttf" },
  { name: "Lato", regular: "/fonts/Lato-Regular.ttf", bold: "/fonts/Lato-Bold.ttf" },
];

for (const font of FONTS) {
  Font.register({ family: font.name, src: font.regular });
  Font.register({ family: `${font.name}-Bold`, src: font.bold });
}

// Disable hyphenation for German text
Font.registerHyphenationCallback((word) => [word]);

// ─── Font Map ──────────────────────────────────────────────
// Maps user-facing font names to registered PDF font family names.
// Both "regular" and "bold" keys map to distinct registered families
// so that `fontFamily: font.bold` works the same as the old
// Helvetica / Helvetica-Bold pattern.
export const PDF_FONT_MAP: Record<string, { regular: string; bold: string }> = {
  Inter: { regular: "Inter", bold: "Inter-Bold" },
  Roboto: { regular: "Roboto", bold: "Roboto-Bold" },
  Merriweather: { regular: "Merriweather", bold: "Merriweather-Bold" },
  "Open Sans": { regular: "OpenSans", bold: "OpenSans-Bold" },
  Lato: { regular: "Lato", bold: "Lato-Bold" },
};

export function getPdfFont(fontFamily: string) {
  return PDF_FONT_MAP[fontFamily] ?? PDF_FONT_MAP.Inter;
}
