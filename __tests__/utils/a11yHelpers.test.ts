import { describe, it, expect } from "vitest";
import {
  checkColorContrast,
  hexToRgb,
  getRelativeLuminance,
} from "@/lib/utils/a11yHelpers";

describe("hexToRgb", () => {
  it("converts 6-digit hex correctly", () => {
    expect(hexToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb("#ff0000")).toEqual({ r: 255, g: 0, b: 0 });
  });

  it("handles shorthand hex (#abc)", () => {
    expect(hexToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("#000")).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("handles hex without #", () => {
    expect(hexToRgb("ff0000")).toEqual({ r: 255, g: 0, b: 0 });
  });
});

describe("getRelativeLuminance", () => {
  it("returns 1 for white", () => {
    expect(getRelativeLuminance(255, 255, 255)).toBeCloseTo(1, 2);
  });

  it("returns 0 for black", () => {
    expect(getRelativeLuminance(0, 0, 0)).toBeCloseTo(0, 2);
  });
});

describe("checkColorContrast", () => {
  it("returns high contrast for black on white", () => {
    const result = checkColorContrast("#000000", "#ffffff");
    expect(result.ratio).toBeGreaterThanOrEqual(21);
    expect(result.passesAA).toBe(true);
    expect(result.passesAAA).toBe(true);
  });

  it("returns 1:1 ratio for same colors", () => {
    const result = checkColorContrast("#ff0000", "#ff0000");
    expect(result.ratio).toBe(1);
    expect(result.passesAA).toBe(false);
    expect(result.passesAAA).toBe(false);
  });

  it("correctly evaluates AA compliance for medium contrast", () => {
    // Gray (#767676) on white is the threshold for AA (~4.54:1)
    const result = checkColorContrast("#767676", "#ffffff");
    expect(result.passesAA).toBe(true);
  });
});
