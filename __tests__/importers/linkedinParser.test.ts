import { describe, it, expect } from "vitest";
import { parseLinkedInExport } from "@/lib/importers/linkedinParser";

describe("parseLinkedInExport", () => {
  it("parses profile data (firstName, lastName) from Profile CSV", () => {
    const csvContents = {
      Profile: "First Name,Last Name,Headline\nMax,Mustermann,Software Engineer",
      "Email Addresses": "Email Address\nmax@example.com",
    };

    const { data } = parseLinkedInExport(csvContents);
    expect(data.personalData.firstName).toBe("Max");
    expect(data.personalData.lastName).toBe("Mustermann");
  });

  it("parses email from Email Addresses CSV", () => {
    const csvContents = {
      Profile: "First Name,Last Name\nMax,Mustermann",
      "Email Addresses": "Email Address\nmax@example.com",
    };

    const { data } = parseLinkedInExport(csvContents);
    expect(data.personalData.email).toBe("max@example.com");
  });

  it("parses positions with date conversion", () => {
    const csvContents = {
      Profile: "First Name,Last Name\nMax,Mustermann",
      Positions:
        "Company Name,Title,Started On,Finished On,Location,Description\nAcme GmbH,Developer,Jan 2020,Dec 2022,Berlin,Backend work",
    };

    const { data } = parseLinkedInExport(csvContents);
    expect(data.workExperience).toHaveLength(1);
    expect(data.workExperience![0].company).toBe("Acme GmbH");
    expect(data.workExperience![0].jobTitle).toBe("Developer");
    expect(data.workExperience![0].startDate).toBe("2020-01");
    expect(data.workExperience![0].endDate).toBe("2022-12");
    expect(data.workExperience![0].isCurrentJob).toBe(false);
  });

  it("parses education entries", () => {
    const csvContents = {
      Profile: "First Name,Last Name\nMax,Mustermann",
      Education:
        "School Name,Degree Name,Start Date,End Date,Notes\nTU Berlin,B.Sc.,2016,2020,Informatik",
    };

    const { data } = parseLinkedInExport(csvContents);
    expect(data.education).toHaveLength(1);
    expect(data.education![0].institution).toBe("TU Berlin");
    expect(data.education![0].degree).toBe("B.Sc.");
    expect(data.education![0].startDate).toBe("2016-01");
    expect(data.education![0].endDate).toBe("2020-01");
    expect(data.education![0].fieldOfStudy).toBe("Informatik");
  });

  it("parses skills", () => {
    const csvContents = {
      Profile: "First Name,Last Name\nMax,Mustermann",
      Skills: "Name\nTypeScript\nReact\nNode.js",
    };

    const { data } = parseLinkedInExport(csvContents);
    expect(data.skills).toHaveLength(3);
    expect(data.skills![0].name).toBe("TypeScript");
    expect(data.skills![1].name).toBe("React");
    expect(data.skills![2].name).toBe("Node.js");
    // default category and level
    expect(data.skills![0].category).toBe("hard");
    expect(data.skills![0].level).toBe(3);
  });

  it("handles missing CSVs gracefully with warnings", () => {
    const csvContents: Record<string, string> = {};

    const { data, warnings } = parseLinkedInExport(csvContents);
    expect(data.personalData.firstName).toBe("");
    expect(data.personalData.lastName).toBe("");
    expect(data.workExperience).toEqual([]);
    expect(data.education).toEqual([]);
    expect(data.skills).toEqual([]);
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings.some((w) => w.includes("Profildaten"))).toBe(true);
    expect(warnings.some((w) => w.includes("Positions"))).toBe(true);
    expect(warnings.some((w) => w.includes("Education"))).toBe(true);
    expect(warnings.some((w) => w.includes("Skills"))).toBe(true);
  });

  it('formats dates: "Jan 2020" → "2020-01"', () => {
    const csvContents = {
      Profile: "First Name,Last Name\nMax,Mustermann",
      Positions:
        "Company Name,Title,Started On,Finished On\nAcme,Dev,Jan 2020,Mar 2023",
    };

    const { data } = parseLinkedInExport(csvContents);
    expect(data.workExperience![0].startDate).toBe("2020-01");
    expect(data.workExperience![0].endDate).toBe("2023-03");
  });

  it('formats dates: "2020" → "2020-01"', () => {
    const csvContents = {
      Profile: "First Name,Last Name\nMax,Mustermann",
      Education: "School Name,Degree Name,Start Date,End Date\nTU Berlin,BSc,2016,2020",
    };

    const { data } = parseLinkedInExport(csvContents);
    expect(data.education![0].startDate).toBe("2016-01");
    expect(data.education![0].endDate).toBe("2020-01");
  });
});
