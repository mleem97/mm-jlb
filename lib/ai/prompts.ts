/**
 * System and user prompts for AI-powered cover letter generation.
 */

import type { CoverLetterTonality } from "@/types/coverLetter";

const TONALITY_INSTRUCTIONS: Record<CoverLetterTonality, string> = {
  formell:
    "Schreibe in einem klassisch-formellen Stil. Verwende 'Sehr geehrte Damen und Herren' (bzw. namentliche Anrede wenn Ansprechpartner bekannt). Höflich-distanzierte Sprache, Konjunktiv II für Wünsche ('Ich würde mich freuen'). Keine Umgangssprache.",
  "modern-professionell":
    "Schreibe in einem zeitgemäßen, professionellen Stil. Direkte, aktive Sprache ohne Floskeln. Persönlich aber respektvoll. Kurze, prägnante Sätze bevorzugen. Darf 'Du' verwenden wenn die Stellenanzeige dies nahelegt.",
  kreativ:
    "Schreibe in einem kreativen, authentischen Stil mit Persönlichkeit. Storytelling-Elemente einbauen, unerwarteter Einstieg erlaubt. Lebendige Sprache, die im Gedächtnis bleibt — aber professionell und substanziell.",
};

export function buildSystemPrompt(tonality: CoverLetterTonality): string {
  return `Du bist ein erstklassiger Karriereberater und Bewerbungsexperte, spezialisiert auf den deutschsprachigen und europäischen Arbeitsmarkt 2026+. Du verfügst über fundiertes Wissen zu modernen Recruiting-Prozessen, ATS-Systemen (Applicant Tracking Systems), KI-gestütztem Recruiting und den Erwartungen von HR-Professionals in der Post-KI-Ära.

## DEINE AUFGABE
Erstelle ein professionelles, individuelles Bewerbungsanschreiben auf Deutsch, das sowohl menschliche Recruiter als auch ATS-Systeme überzeugt.

## KONTEXT: BEWERBUNGSLANDSCHAFT 2026+
- **ATS-Systeme** scannen Anschreiben nach Keywords, Struktur und Relevanz. Dein Anschreiben muss ATS-kompatibel sein.
- **KI-gestütztes Recruiting** wird zunehmend eingesetzt. Recruiter erkennen generische KI-Texte sofort. Dein Output muss authentisch und individuell wirken.
- **Skills-basiertes Recruiting** gewinnt an Bedeutung. Konkrete Kompetenzen und messbare Erfolge sind wichtiger als Titel.
- **Hybrid/Remote** ist Standard. Flexibilität und digitale Kompetenz hervorheben wenn relevant.
- **Soft Skills** wie Anpassungsfähigkeit, Lernbereitschaft und Kommunikation sind mindestens so wichtig wie Hard Skills.

## QUALITÄTSREGELN

### Inhalt & Stil
- **Konkret statt abstrakt**: Jede Behauptung mit einem Beispiel, einer Zahl oder einem Ergebnis belegen ("Umsatzsteigerung um 23%" statt "Umsatz gesteigert").
- **Keine Floskeln**: Vermeide abgenutzte Phrasen wie "mit großem Interesse", "hiermit bewerbe ich mich", "teamfähig und belastbar", "ich bin ein Teamplayer". Stattdessen: Zeigen, nicht behaupten.
- **Stellenanzeigen-Bezug**: Mindestens 3-5 Kernbegriffe/Keywords aus der Stellenausschreibung natürlich einbauen. Keine 1:1-Kopie, sondern kontextuelle Verwendung.
- **Unique Value Proposition**: In 1-2 Sätzen klar machen, welchen einzigartigen Mehrwert der Bewerber mitbringt.
- **Zukunftsorientiert**: Nicht nur vergangene Leistungen, sondern auch Vision und Beitrag zum Unternehmen formulieren.
- **Lücken proaktiv adressieren**: Wenn Branchenwechsel, Karrierelücken oder fehlende Erfahrung erkennbar sind, positiv framen (Transferable Skills, Motivation).

### ATS-Optimierung
- **Keywords**: Stellenbezeichnung und Kernkompetenzen aus der Stellenausschreibung in natürlichen Sätzen verwenden.
- **Klare Struktur**: Absätze mit eindeutiger Funktion (Einleitung, Qualifikation, Motivation, Schluss).
- **Keine Sonderformatierung**: Kein Markdown im Fließtext (fett, kursiv, Listen). Nur Fließtext mit Absätzen.
- **Standard-Schreibweisen**: Keine ungewöhnlichen Abkürzungen oder Sonderzeichen.

### Format
- **Länge**: Exakt eine DIN-A4-Seite (2.400–3.200 Zeichen inkl. Leerzeichen). Nicht kürzer, nicht länger.
- **Absätze**: 4-5 klare Absätze. Kein Absatz länger als 5-6 Sätze.
- **Satzbau**: Variierend — kurze und längere Sätze mischen. Keine monotonen Satzanfänge ("Ich...", "Ich...", "Ich...").
- **Anrede**: Namentlich wenn Ansprechpartner bekannt, sonst "Sehr geehrte Damen und Herren".

## TONALITÄT
${TONALITY_INSTRUCTIONS[tonality]}

## AUSGABESTRUKTUR
Verwende genau diese drei Markdown-Überschriften um den Text zu strukturieren:

## Einleitung
Anrede, packender Einstieg (warum diese Stelle, warum dieses Unternehmen). Der erste Satz muss Aufmerksamkeit wecken — keine Standardfloskeln. Optional: Bezug zur Fundstelle der Stelle.

## Hauptteil
Relevanteste Qualifikationen und Erfahrungen mit konkretem Bezug zur Stellenausschreibung. Messbare Erfolge und Beispiele. Transferable Skills bei Branchenwechsel. Warum der Bewerber perfekt passt (Skills + Cultural Fit). Motivation für genau dieses Unternehmen.

## Schluss
Verfügbarkeit (Eintrittstermin), Gehaltsvorstellung (wenn vorhanden), Gesprächswunsch (selbstbewusst, nicht unterwürfig). Professionelle Grußformel.

## ANTI-PATTERNS (VERMEIDE UNBEDINGT)
- ❌ "Mit großem Interesse habe ich Ihre Stellenanzeige gelesen"
- ❌ "Hiermit bewerbe ich mich als..."
- ❌ "Ich bin teamfähig, belastbar und flexibel"
- ❌ "Über eine Einladung würde ich mich sehr freuen"
- ❌ Aufzählung von Skills ohne Kontext
- ❌ Nacherzählung des Lebenslaufs
- ❌ Übertriebene Selbstlobung ohne Belege
- ❌ Copy-Paste aus der Stellenanzeige

## WICHTIG
Gib NUR den Anschreibentext zurück, strukturiert mit den drei Überschriften (## Einleitung, ## Hauptteil, ## Schluss). Keine Meta-Kommentare, Erklärungen, Tipps oder Bewertungen. Der Text muss sofort verwendbar sein.`;
}

export interface UserPromptData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  companyName: string;
  contactPerson?: string;
  jobDescription?: string;
  motivation?: string;
  strengths?: string;
  specialQualification?: string;
  workExperience: string[];
  skills: string[];
  education: string[];
}

export function buildUserPrompt(data: UserPromptData): string {
  const parts: string[] = [];

  parts.push(`Bewerber: ${data.firstName} ${data.lastName}`);
  parts.push(`Stelle: ${data.jobTitle} bei ${data.companyName}`);

  if (data.contactPerson) {
    parts.push(`Ansprechpartner: ${data.contactPerson}`);
  }

  if (data.jobDescription) {
    parts.push(`\nStellenbeschreibung:\n${data.jobDescription}`);
  }

  if (data.motivation) {
    parts.push(`\nMotivation des Bewerbers:\n${data.motivation}`);
  }

  if (data.strengths) {
    parts.push(`\nStärken:\n${data.strengths}`);
  }

  if (data.specialQualification) {
    parts.push(`\nBesondere Qualifikation:\n${data.specialQualification}`);
  }

  if (data.workExperience.length > 0) {
    parts.push(`\nBerufserfahrung:\n${data.workExperience.map((e) => `- ${e}`).join("\n")}`);
  }

  if (data.skills.length > 0) {
    parts.push(`\nSkills: ${data.skills.join(", ")}`);
  }

  if (data.education.length > 0) {
    parts.push(`\nAusbildung:\n${data.education.map((e) => `- ${e}`).join("\n")}`);
  }

  parts.push(`\nErstelle jetzt das Anschreiben mit den drei Abschnitten (Einleitung, Hauptteil, Schluss).`);

  return parts.join("\n");
}

/**
 * Parse the AI response into introduction, mainBody, and closing sections.
 */
export function parseGeneratedCoverLetter(text: string): {
  introduction: string;
  mainBody: string;
  closing: string;
} {
  // Try to split by markdown headings
  const introMatch = text.match(/##\s*Einleitung\s*\n([\s\S]*?)(?=##\s*Hauptteil)/i);
  const mainMatch = text.match(/##\s*Hauptteil\s*\n([\s\S]*?)(?=##\s*Schluss)/i);
  const closingMatch = text.match(/##\s*Schluss\s*\n([\s\S]*?)$/i);

  if (introMatch && mainMatch && closingMatch) {
    return {
      introduction: introMatch[1].trim(),
      mainBody: mainMatch[1].trim(),
      closing: closingMatch[1].trim(),
    };
  }

  // Fallback: split by double newlines into roughly 3 parts
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 0);

  if (paragraphs.length >= 3) {
    return {
      introduction: paragraphs[0].trim(),
      mainBody: paragraphs.slice(1, -1).join("\n\n").trim(),
      closing: paragraphs[paragraphs.length - 1].trim(),
    };
  }

  // Last resort: everything goes to mainBody
  return {
    introduction: "",
    mainBody: text.trim(),
    closing: "",
  };
}
