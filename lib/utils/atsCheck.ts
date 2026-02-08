import type { ApplicationState } from "@/types/application";

export interface ATSCheck {
  name: string;
  passed: boolean;
  message: string;
  severity: "error" | "warning" | "info";
}

export interface ATSCheckResult {
  score: number; // 0-100
  checks: ATSCheck[];
}

const STANDARD_FONTS = [
  "Inter",
  "Roboto",
  "Merriweather",
  "Open Sans",
  "Lato",
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Calibri",
  "Georgia",
];

function hasSpecialCharacters(text: string): boolean {
  // Check for unusual special characters (emojis, uncommon symbols)
  return /[^\w\säöüÄÖÜß.,;:!?@#€$%&*()\-+=/\\'"[\]{}|<>~^°§\n\r\t]/u.test(
    text,
  );
}

function checkStandardFont(state: ApplicationState): ATSCheck {
  const font = state.layoutConfig.fontFamily;
  const passed = STANDARD_FONTS.some(
    (f) => f.toLowerCase() === font.toLowerCase(),
  );
  return {
    name: "Standardschrift",
    passed,
    message: passed
      ? `Schrift "${font}" ist ATS-kompatibel`
      : `Schrift "${font}" könnte von ATS-Systemen nicht erkannt werden`,
    severity: "error",
  };
}

function checkFontSize(state: ApplicationState): ATSCheck {
  const size = state.layoutConfig.fontSize;
  const passed = size >= 11;
  return {
    name: "Schriftgröße",
    passed,
    message: passed
      ? `Schriftgröße ${size}pt ist gut lesbar`
      : `Schriftgröße ${size}pt ist zu klein (mindestens 11pt empfohlen)`,
    severity: "error",
  };
}

function checkSpecialCharacters(state: ApplicationState): ATSCheck {
  const fieldsToCheck = [
    state.personalData.firstName,
    state.personalData.lastName,
    state.personalData.email,
    state.personalData.phone,
  ];

  const found = fieldsToCheck.some(
    (field) => field && hasSpecialCharacters(field),
  );
  return {
    name: "Sonderzeichen",
    passed: !found,
    message: found
      ? "Sonderzeichen in persönlichen Daten könnten Probleme verursachen"
      : "Keine problematischen Sonderzeichen gefunden",
    severity: "warning",
  };
}

function checkContactInfo(state: ApplicationState): ATSCheck {
  const hasEmail = Boolean(
    state.personalData.email && state.personalData.email.includes("@"),
  );
  const hasPhone = Boolean(
    state.personalData.phone && state.personalData.phone.length >= 6,
  );
  const passed = hasEmail && hasPhone;
  return {
    name: "Kontaktdaten",
    passed,
    message: passed
      ? "E-Mail und Telefonnummer vorhanden"
      : `Fehlend: ${!hasEmail ? "E-Mail" : ""}${!hasEmail && !hasPhone ? ", " : ""}${!hasPhone ? "Telefonnummer" : ""}`,
    severity: "error",
  };
}

function checkSkillsPresent(state: ApplicationState): ATSCheck {
  const passed = state.skills.length > 0;
  return {
    name: "Skills-Bereich",
    passed,
    message: passed
      ? `${state.skills.length} Skills vorhanden`
      : "Keine Skills angegeben – ATS-Systeme bewerten dies negativ",
    severity: "error",
  };
}

function checkWorkExperience(state: ApplicationState): ATSCheck {
  const passed = state.workExperience.length > 0;
  return {
    name: "Berufserfahrung",
    passed,
    message: passed
      ? `${state.workExperience.length} Berufserfahrung(en) vorhanden`
      : "Keine Berufserfahrung angegeben",
    severity: "warning",
  };
}

function checkPhotoPosition(state: ApplicationState): ATSCheck {
  const position = state.layoutConfig.photoPosition;
  const showPhoto = state.layoutConfig.showPhoto;
  const safe = !showPhoto || position === "top-right" || position === "top-left";
  return {
    name: "Foto-Platzierung",
    passed: safe,
    message: safe
      ? "Foto-Position beeinträchtigt den Text nicht"
      : "Seitenleisten-Foto könnte den Textfluss für ATS stören",
    severity: "info",
  };
}

function checkKeywordDensity(state: ApplicationState): ATSCheck {
  if (!state.jobPosting?.jobDescriptionText || !state.coverLetter) {
    return {
      name: "Keyword-Dichte",
      passed: true,
      message: "Kein Stellentext oder Anschreiben zum Vergleich vorhanden",
      severity: "info",
    };
  }

  const jobText = state.jobPosting.jobDescriptionText.toLowerCase();
  const jobWords = jobText
    .split(/[\s,;.!?:()[\]{}"'\/\\|–—\-_]+/)
    .filter((w) => w.length >= 3);
  const uniqueJobWords = [...new Set(jobWords)];

  const coverText = [
    state.coverLetter.introduction,
    state.coverLetter.mainBody,
    state.coverLetter.closing,
    state.coverLetter.fullText ?? "",
  ]
    .join(" ")
    .toLowerCase();

  let matchCount = 0;
  for (const word of uniqueJobWords) {
    if (coverText.includes(word)) {
      matchCount++;
    }
  }

  const density =
    uniqueJobWords.length > 0
      ? Math.round((matchCount / uniqueJobWords.length) * 100)
      : 0;
  const passed = density >= 20;

  return {
    name: "Keyword-Dichte",
    passed,
    message: passed
      ? `${density}% der Stellenanzeigen-Keywords im Anschreiben gefunden`
      : `Nur ${density}% Keyword-Übereinstimmung – mehr Schlüsselwörter einbauen`,
    severity: passed ? "info" : "warning",
  };
}

function checkJobDescriptionPresent(state: ApplicationState): ATSCheck {
  const hasJobDescription = Boolean(
    state.jobPosting?.jobDescriptionText &&
      state.jobPosting.jobDescriptionText.trim().length > 50,
  );
  return {
    name: "Stellenbeschreibung",
    passed: hasJobDescription,
    message: hasJobDescription
      ? "Stellenbeschreibung vorhanden – ermöglicht Keyword-Matching"
      : "Keine Stellenbeschreibung hinterlegt – Keyword-Optimierung nicht möglich",
    severity: "info",
  };
}

function checkCoverLetterLength(state: ApplicationState): ATSCheck {
  const coverText = [
    state.coverLetter?.introduction ?? "",
    state.coverLetter?.mainBody ?? "",
    state.coverLetter?.closing ?? "",
    state.coverLetter?.fullText ?? "",
  ].join(" ");

  const wordCount = coverText
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const passed = wordCount >= 150;

  return {
    name: "Anschreiben-Länge",
    passed,
    message: passed
      ? `Anschreiben hat ${wordCount} Wörter – gute Länge`
      : `Anschreiben hat nur ${wordCount} Wörter (mindestens 150 empfohlen)`,
    severity: passed ? "info" : "warning",
  };
}

function checkEducationPresent(state: ApplicationState): ATSCheck {
  const passed = state.education.length > 0;
  return {
    name: "Bildungsweg",
    passed,
    message: passed
      ? `${state.education.length} Bildungseinträge vorhanden`
      : "Kein Bildungsweg angegeben – viele ATS-Systeme erwarten diesen Abschnitt",
    severity: "warning",
  };
}

function checkContactCompleteness(state: ApplicationState): ATSCheck {
  const hasStreet = Boolean(state.personalData.address?.street);
  const hasCity = Boolean(state.personalData.address?.city);
  const hasZip = Boolean(state.personalData.address?.zip);
  const passed = hasStreet && hasCity && hasZip;
  return {
    name: "Vollständige Adresse",
    passed,
    message: passed
      ? "Vollständige Postadresse vorhanden"
      : `Adresse unvollständig: ${[!hasStreet && "Straße", !hasCity && "Stadt", !hasZip && "PLZ"].filter(Boolean).join(", ")} fehlt`,
    severity: "warning",
  };
}

export function runATSCheck(state: ApplicationState): ATSCheckResult {
  const checks: ATSCheck[] = [
    checkStandardFont(state),
    checkFontSize(state),
    checkSpecialCharacters(state),
    checkContactInfo(state),
    checkContactCompleteness(state),
    checkSkillsPresent(state),
    checkWorkExperience(state),
    checkEducationPresent(state),
    checkPhotoPosition(state),
    checkKeywordDensity(state),
    checkJobDescriptionPresent(state),
    checkCoverLetterLength(state),
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  return { score, checks };
}
