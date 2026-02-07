/**
 * WCAG 2.1 Accessibility helpers for color contrast checking.
 */

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleaned = hex.replace(/^#/, "");

  // Support shorthand hex (#abc → #aabbcc)
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (cleaned.length !== 6) {
    return { r: 0, g: 0, b: 0 };
  }

  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Calculate relative luminance per WCAG 2.1.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function getRelativeLuminance(
  r: number,
  g: number,
  b: number,
): number {
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Check WCAG contrast ratio between two hex colors.
 */
export function checkColorContrast(
  foreground: string,
  background: string,
): {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
} {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  const lumFg = getRelativeLuminance(fg.r, fg.g, fg.b);
  const lumBg = getRelativeLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(lumFg, lumBg);
  const darker = Math.min(lumFg, lumBg);

  const ratio = Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100;

  return {
    ratio,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7,
  };
}
