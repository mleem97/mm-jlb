import { describe, it, expect } from "vitest";
import { parseCSV } from "@/lib/importers/csvParser";

describe("parseCSV", () => {
  it("parses simple CSV with headers and rows", () => {
    const csv = "Name,Age,City\nAlice,30,Berlin\nBob,25,München";
    const result = parseCSV(csv);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ Name: "Alice", Age: "30", City: "Berlin" });
    expect(result[1]).toEqual({ Name: "Bob", Age: "25", City: "München" });
  });

  it("handles quoted fields with commas inside", () => {
    const csv = 'Name,Description\nAlice,"Entwicklerin, Backend"\nBob,"Manager, Frontend"';
    const result = parseCSV(csv);

    expect(result).toHaveLength(2);
    expect(result[0]["Description"]).toBe("Entwicklerin, Backend");
    expect(result[1]["Description"]).toBe("Manager, Frontend");
  });

  it("handles quoted fields with newlines inside", () => {
    const csv = 'Name,Bio\nAlice,"Zeile eins\nZeile zwei"\nBob,Kurzbio';
    const result = parseCSV(csv);

    expect(result).toHaveLength(2);
    expect(result[0]["Bio"]).toBe("Zeile eins\nZeile zwei");
    expect(result[1]["Bio"]).toBe("Kurzbio");
  });

  it("skips empty rows", () => {
    const csv = "Name,Age\nAlice,30\n\n\nBob,25\n";
    const result = parseCSV(csv);

    expect(result).toHaveLength(2);
    expect(result[0]["Name"]).toBe("Alice");
    expect(result[1]["Name"]).toBe("Bob");
  });

  it("returns empty array for single row (headers only)", () => {
    const csv = "Name,Age,City";
    const result = parseCSV(csv);

    expect(result).toEqual([]);
  });

  it("returns empty array for empty input", () => {
    const result = parseCSV("");
    expect(result).toEqual([]);
  });
});
