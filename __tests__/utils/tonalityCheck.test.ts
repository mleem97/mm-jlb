import { describe, it, expect } from "vitest";
import { checkTonality } from "@/lib/utils/tonalityCheck";

describe("checkTonality", () => {
  it("returns passend formality for professional text", () => {
    const text =
      "Sehr geehrte Damen und Herren, hiermit bewerbe ich mich auf die ausgeschriebene Stelle als Softwareentwickler. Ich habe umfangreiche Erfahrung in der Webentwicklung gesammelt und optimiert dabei Prozesse.";
    const result = checkTonality(text);
    expect(result.formality).toBe("passend");
    expect(result.score).toBeGreaterThan(50);
  });

  it("detects too informal text", () => {
    const text =
      "Hey, ich finde den Job mega cool und würde da echt gerne arbeiten. Das wäre voll nice!";
    const result = checkTonality(text);
    expect(result.formality).toBe("zu locker");
  });

  it("detects too formal/stiff text", () => {
    const text =
      "Hochverehrte Damen und Herren, ich möchte mich ergebenst um die Stelle bewerben.";
    const result = checkTonality(text);
    expect(result.formality).toBe("zu steif");
  });

  it("warns when text is too long", () => {
    const text = "a".repeat(4000);
    const result = checkTonality(text);
    expect(result.length.ok).toBe(false);
    expect(result.length.chars).toBe(4000);
    expect(result.length.pages).toBeGreaterThan(1);
  });

  it("detects clichés and provides alternatives", () => {
    const text =
      "Ich bin sehr teamfähig und motiviert. Als belastbar Mitarbeiter bringe ich dynamisch Energie mit.";
    const result = checkTonality(text);
    expect(result.cliches.found).toContain("teamfähig");
    expect(result.cliches.found).toContain("motiviert");
    expect(result.cliches.alternatives["teamfähig"]).toBeDefined();
    expect(result.score).toBeLessThan(100);
  });

  it("detects action verbs", () => {
    const text =
      "Ich habe Projekte geleitet, Prozesse optimiert und neue Features implementiert.";
    const result = checkTonality(text);
    expect(result.actionVerbs.count).toBeGreaterThanOrEqual(3);
    expect(result.actionVerbs.examples).toContain("geleitet");
    expect(result.actionVerbs.examples).toContain("optimiert");
    expect(result.actionVerbs.examples).toContain("implementiert");
  });
});
