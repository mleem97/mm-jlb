import { describe, it, expect } from "vitest";
import { parseXingExport } from "@/lib/importers/xingParser";

describe("parseXingExport", () => {
  it("parses profile data (Vorname, Nachname)", () => {
    const csvContents = {
      Profil: "Vorname,Nachname,E-Mail,Telefon,Stadt\nMax,Mustermann,max@example.com,+49170123,Berlin",
    };

    const { data } = parseXingExport(csvContents);
    expect(data.personalData.firstName).toBe("Max");
    expect(data.personalData.lastName).toBe("Mustermann");
    expect(data.personalData.email).toBe("max@example.com");
    expect(data.personalData.phone).toBe("+49170123");
    expect(data.personalData.address.city).toBe("Berlin");
  });

  it("parses work experience", () => {
    const csvContents = {
      Profil: "Vorname,Nachname\nMax,Mustermann",
      Berufserfahrung:
        "Unternehmen,Position,Von,Bis,Ort,Beschreibung\nAcme GmbH,Entwickler,03.2020,12.2022,Berlin,Backend-Entwicklung",
    };

    const { data } = parseXingExport(csvContents);
    expect(data.workExperience).toHaveLength(1);
    expect(data.workExperience![0].company).toBe("Acme GmbH");
    expect(data.workExperience![0].jobTitle).toBe("Entwickler");
    expect(data.workExperience![0].startDate).toBe("2020-03");
    expect(data.workExperience![0].endDate).toBe("2022-12");
    expect(data.workExperience![0].isCurrentJob).toBe(false);
    expect(data.workExperience![0].location).toBe("Berlin");
  });

  it("parses education", () => {
    const csvContents = {
      Profil: "Vorname,Nachname\nMax,Mustermann",
      Ausbildung:
        "Einrichtung,Abschluss,Fachrichtung,Von,Bis\nTU Berlin,Bachelor,Informatik,10.2016,03.2020",
    };

    const { data } = parseXingExport(csvContents);
    expect(data.education).toHaveLength(1);
    expect(data.education![0].institution).toBe("TU Berlin");
    expect(data.education![0].degree).toBe("Bachelor");
    expect(data.education![0].fieldOfStudy).toBe("Informatik");
    expect(data.education![0].startDate).toBe("2016-10");
    expect(data.education![0].endDate).toBe("2020-03");
  });

  it('formats German dates: "03.2020" → "2020-03"', () => {
    const csvContents = {
      Profil: "Vorname,Nachname\nMax,Mustermann",
      Berufserfahrung: "Unternehmen,Position,Von,Bis\nFirma,Dev,03.2020,12.2022",
    };

    const { data } = parseXingExport(csvContents);
    expect(data.workExperience![0].startDate).toBe("2020-03");
    expect(data.workExperience![0].endDate).toBe("2022-12");
  });

  it('formats slash dates: "03/2020" → "2020-03"', () => {
    const csvContents = {
      Profil: "Vorname,Nachname\nMax,Mustermann",
      Berufserfahrung: "Unternehmen,Position,Von,Bis\nFirma,Dev,03/2020,12/2022",
    };

    const { data } = parseXingExport(csvContents);
    expect(data.workExperience![0].startDate).toBe("2020-03");
    expect(data.workExperience![0].endDate).toBe("2022-12");
  });

  it("handles missing CSVs gracefully with warnings", () => {
    const csvContents: Record<string, string> = {};

    const { data, warnings } = parseXingExport(csvContents);
    expect(data.personalData.firstName).toBe("");
    expect(data.personalData.lastName).toBe("");
    expect(data.workExperience).toEqual([]);
    expect(data.education).toEqual([]);
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings.some((w) => w.includes("Profildaten"))).toBe(true);
    expect(warnings.some((w) => w.includes("Berufserfahrung"))).toBe(true);
    expect(warnings.some((w) => w.includes("Ausbildung"))).toBe(true);
  });
});
