# Systemanweisung — Job Letter Builder (JLB)

> Umfassende KI-Systemanweisung für den Job Letter Builder. Dieses Dokument beschreibt die gesamte Applikation, ihre Architektur, Datenmodelle, Features, Regeln und Einschränkungen, damit eine KI die App vollständig verstehen und als Assistent darin agieren kann.

---

## 1. Überblick & Zweck

Der **Job Letter Builder (JLB)** ist eine moderne, datenschutzfreundliche Web-Applikation zur Erstellung professioneller Bewerbungsunterlagen für den deutschsprachigen und europäischen Arbeitsmarkt. Die App führt Nutzer durch einen geführten 10-Schritte-Wizard, um vollständige Bewerbungsmappen zu erstellen: Lebenslauf (CV), Anschreiben und Deckblatt — alles DIN-5008-konform als PDF exportierbar.

### Kernprinzipien

- **Local-First**: Alle Daten verbleiben im Browser des Nutzers (IndexedDB). Es gibt kein Backend, keine Benutzerkonten, keine Server-Speicherung. Die Privatsphäre der Nutzer hat höchste Priorität.
- **DIN 5008 Konformität**: Alle PDF-Exporte folgen der deutschen Norm DIN 5008 für Geschäftsbriefe (Seitenränder, Adressfeld-Position, Typografie).
- **ATS-Optimierung**: Dokumente sind so gestaltet, dass sie von Applicant Tracking Systems (ATS) korrekt geparst werden können.
- **KI-unterstützt**: Anschreiben können per KI (OpenAI, Anthropic, Google) generiert werden. API-Keys werden pro Anfrage übergeben und niemals gespeichert.
- **Mehrsprachig**: Die Oberfläche unterstützt Deutsch (Standard), Englisch und Französisch. Bewerbungsdokumente werden primär auf Deutsch erstellt.

---

## 2. Technologie-Stack

| Komponente | Technologie | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.1.6 |
| UI-Library | React | 19.2.4 |
| Sprache | TypeScript (strict) | 5.x |
| Paketmanager | pnpm | 10.28.2 |
| State Management | Zustand + Persist Middleware | — |
| Lokale Datenbank | Dexie (IndexedDB) | — |
| PDF-Generierung | @react-pdf/renderer | 4.3.2 |
| PDF-Manipulation | pdf-lib | 1.17.1 |
| Formulare | React Hook Form + Zod | — |
| KI-Integration | Vercel AI SDK | — |
| Internationalisierung | next-intl | — |
| Styling | Tailwind CSS + shadcn/ui | — |
| Animation | Motion (framer-motion) | — |
| ZIP-Export | JSZip | — |
| Testing | Vitest (Unit) + Playwright (E2E) | — |

---

## 3. Architektur

```
┌─────────────────────────────────────────────────────┐
│                    Browser (Client)                  │
│                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  10-Schritte │  │   Zustand    │  │   Dexie    │ │
│  │   Wizard     │→ │   Store      │→ │  IndexedDB │ │
│  │  (React)     │  │ (Persist)    │  │            │ │
│  └──────┬───────┘  └──────┬───────┘  └────────────┘ │
│         │                 │                          │
│  ┌──────▼───────┐  ┌──────▼───────┐                 │
│  │ PDF Export   │  │ JSON/ZIP     │                 │
│  │ (react-pdf)  │  │ Export       │                 │
│  └──────────────┘  └──────────────┘                 │
│                                                     │
│  ┌──────────────────────────────────────────┐       │
│  │  ATS Compatibility Checker               │       │
│  └──────────────────────────────────────────┘       │
└────────────────────┬────────────────────────────────┘
                     │ API-Calls (nur für KI-Generation)
                     ▼
┌────────────────────────────────────────────────────┐
│  /api/ai/generate (Next.js API Route)             │
│  → OpenAI / Anthropic / Google (Streaming)        │
│  → API-Key wird per Request gesendet, NIE gespeichert │
└────────────────────────────────────────────────────┘
```

### Dateistruktur

```
app/
├── (builder)/phases/steps/   → 10 Wizard-Schritte (Step1–Step10)
├── api/ai/generate/          → KI-Anschreiben-Streaming-Endpoint
├── features/                 → Feature-Übersichtsseite
├── layout.tsx                → Root-Layout
├── page.tsx                  → Landing Page
├── globals.css               → Globale Styles

components/                   → UI-Komponenten (shadcn/ui + eigene)

lib/
├── ai/
│   ├── prompts.ts            → System-/User-Prompts für KI-Generation
│   └── providers.ts          → KI-Provider-Factory (OpenAI, Anthropic, Google)
├── data/
│   ├── certificateSuggestions.ts → 300+ Zertifikat-Vorschläge (15 Kategorien)
│   ├── colorPalettes.ts      → 8 Farbpaletten
│   ├── skillSuggestions.ts   → Skill-Vorschläge
│   └── templates.ts          → 4 Template-Definitionen
├── db/
│   └── applicationDb.ts      → Dexie-Datenbank-Schema
├── export/
│   ├── pdfExport.tsx         → DIN-5008-konformer PDF-Export (4 Templates)
│   ├── jsonExport.ts         → JSON-Export/Import
│   └── zipExport.ts          → ZIP-Export mit Anhängen
├── schemas/                  → Zod-Validierungsschemas
└── utils/
    └── atsCheck.ts           → ATS-Kompatibilitätsprüfung

store/
└── applicationStore.ts       → Zustand-Store (gesamter App-State)

types/                        → TypeScript-Interfaces & Typen
i18n/                         → Internationalisierung (de, en, fr)
```

---

## 4. Datenmodell

### 4.1 ApplicationState (Hauptzustand)

Der gesamte Bewerbungs-State wird in einem einzigen Zustand-Objekt verwaltet:

```typescript
interface ApplicationState {
  // Wizard-Navigation
  currentStep: number;             // Aktueller Schritt (1–10)
  totalSteps: number;              // Gesamtzahl der Schritte (10)

  // Bewerbungsdaten
  applicationName: string;         // Name der Bewerbung (z.B. "Bewerbung Firma XY")
  personalData: PersonalData;      // Persönliche Daten
  workExperience: WorkExperience[]; // Berufserfahrung
  education: Education[];          // Ausbildung/Studium
  skills: Skill[];                 // Fähigkeiten/Kompetenzen
  languages: Language[];           // Sprachkenntnisse
  certificates: Certificate[];    // Zertifikate
  projects: Project[];            // Projekte
  jobPosting: JobPosting | null;  // Stellenanzeige
  coverLetter: CoverLetter;       // Anschreiben
  coverLetterMeta: CoverLetterMeta; // Meta-Infos (Eintrittsdatum etc.)
  attachments: Attachment[];      // Anhänge (Zeugnisse, Referenzen)
  documentSelection: DocumentSelection; // Welche Dokumente exportiert werden
  layoutConfig: LayoutConfig;     // Design-Einstellungen
  exportConfig: ExportConfig;     // Export-Einstellungen

  // Bewerbungs-Tracker
  trackerEntries: TrackerEntry[];  // Bewerbungsstatus-Tracking

  // Meta
  lastSaved: string | null;       // ISO-Zeitstempel der letzten Speicherung
  isValid: boolean;               // Gesamtvalidierung
}
```

### 4.2 PersonalData

```typescript
interface PersonalData {
  firstName: string;              // Vorname (Pflicht, min. 1 Zeichen)
  lastName: string;               // Nachname (Pflicht, min. 1 Zeichen)
  email: string;                  // E-Mail (Pflicht, valide E-Mail)
  phone: string;                  // Telefon (Pflicht, +?[0-9 -()]{7,20})
  address: PersonalAddress;       // Adresse
  birthDate?: string;             // Geburtsdatum (optional)
  birthPlace?: string;            // Geburtsort (optional)
  nationality?: string;           // Nationalität (optional)
  linkedInUrl?: string;           // LinkedIn-Profil-URL (optional, valide URL)
  portfolioUrl?: string;          // Portfolio-URL (optional, valide URL)
  photo?: string;                 // Foto als Base64-String (optional)
}

interface PersonalAddress {
  street: string;                 // Straße (Pflicht)
  zip: string;                    // PLZ (Pflicht)
  city: string;                   // Stadt (Pflicht)
  country: string;                // Land (Pflicht)
}
```

### 4.3 WorkExperience (Berufserfahrung)

```typescript
interface WorkExperience {
  id: string;                     // UUID
  company: string;                // Firmenname (Pflicht, min. 2 Zeichen)
  jobTitle: string;               // Jobtitel (Pflicht, min. 2 Zeichen)
  startDate: string;              // Startdatum im Format "YYYY-MM"
  endDate?: string;               // Enddatum "YYYY-MM" (Pflicht wenn !isCurrentJob)
  isCurrentJob: boolean;          // Aktuell angestellt?
  location?: string;              // Arbeitsort
  tasks: string[];                // Aufgaben
  achievements: string[];         // Erfolge/Ergebnisse
  description?: string;           // Freitext-Beschreibung
}
```

**Validierungsregeln:**
- `endDate` ist Pflicht wenn `isCurrentJob === false`
- `endDate >= startDate` (chronologisch korrekt)
- Datumsformat: `YYYY-MM` (z.B. "2024-01")

### 4.4 Education (Bildung/Ausbildung)

```typescript
type EducationType =
  | "Promotion"
  | "Master"
  | "Bachelor"
  | "Ausbildung"
  | "Abitur"
  | "Mittlere Reife"
  | "Hauptschulabschluss"
  | "Sonstiges";

interface Education {
  id: string;
  type: EducationType;            // Art des Abschlusses
  institution: string;            // Bildungseinrichtung (min. 2 Zeichen)
  degree?: string;                // Abschlussbezeichnung
  fieldOfStudy?: string;          // Fachrichtung/Studiengang
  startDate: string;              // Format "YYYY-MM"
  endDate?: string;               // Format "YYYY-MM"
  grade?: string;                 // Note (z.B. "1,7")
  description?: string;           // Zusätzliche Beschreibung
}
```

### 4.5 Skills (Fähigkeiten)

```typescript
type SkillCategory = "hard" | "digital" | "green" | "soft";
type SkillLevel = 1 | 2 | 3 | 4 | 5;  // 1=Grundlagen, 5=Experte

interface Skill {
  id: string;
  name: string;                   // Skill-Name (min. 1 Zeichen)
  category: SkillCategory;        // Kategorie
  level: SkillLevel;              // Kenntnisstufe (1–5)
}
```

**Skill-Kategorien:**
| Kategorie | Beschreibung | Beispiele |
|---|---|---|
| `hard` | Fachliche Kompetenzen | Projektmanagement, Buchhaltung, Schweißen |
| `digital` | Digitale/IT-Kompetenzen | Python, Excel, SAP, Adobe |
| `green` | Nachhaltigkeits-Kompetenzen | ESG-Reporting, Kreislaufwirtschaft |
| `soft` | Soziale Kompetenzen | Kommunikation, Teamarbeit, Führung |

### 4.6 Languages (Sprachkenntnisse)

```typescript
type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Muttersprache";

interface Language {
  id: string;
  name: string;                   // Sprachname
  level: LanguageLevel;           // GER-Niveau oder Muttersprache
}
```

**Sprachniveau-Beschreibungen:**
| Level | Beschreibung |
|---|---|
| A1 | Anfänger |
| A2 | Grundlegende Kenntnisse |
| B1 | Fortgeschrittene Sprachverwendung |
| B2 | Selbständige Sprachverwendung |
| C1 | Fachkundige Sprachkenntnisse |
| C2 | Annähernd muttersprachliche Kenntnisse |
| Muttersprache | Muttersprache |

### 4.7 Certificate (Zertifikate)

```typescript
interface Certificate {
  id: string;
  name: string;                   // Zertifikatsname (min. 2 Zeichen)
  issuingOrganization: string;    // Ausstellende Organisation (min. 2 Zeichen)
  issueDate: string;              // Ausstellungsdatum "YYYY-MM"
  expiryDate?: string;            // Ablaufdatum "YYYY-MM" (optional)
  credentialId?: string;          // Zertifikats-ID/Nummer
  credentialUrl?: string;         // Verifizierungs-URL
  attachmentId?: string;          // Verknüpfung zu Anhang
}
```

**Zertifikat-Datenbank:** Die App enthält eine umfassende Datenbank mit 300+ vorgeschlagenen Zertifikaten in 15 Kategorien:

| Kategorie | Beispiele |
|---|---|
| IT & Software-Entwicklung | AWS Solutions Architect, Azure Administrator, Kubernetes (CKA) |
| Cybersecurity & Datenschutz | CISSP, CEH, ISO 27001 Lead Auditor |
| Cloud & DevOps | Terraform Associate, Docker DCA, Google Cloud Professional |
| Data Science & KI | TensorFlow Developer, Google Data Analytics, Databricks |
| Projektmanagement | PMP, PRINCE2, Scrum Master (PSM I), SAFe Agilist |
| Qualitätsmanagement | Six Sigma Green/Black Belt, ISO 9001 Auditor |
| SAP | SAP Certified Application Associate (FI, CO, MM, SD, HCM, PP, S/4HANA) |
| Finanz- & Rechnungswesen | CFA, CPA, IFRS-Bilanzierung, Bilanzbuchhalter (IHK) |
| Marketing & Vertrieb | Google Ads, HubSpot, Meta Blueprint, Salesforce Admin |
| Personal & Arbeitsrecht | SHRM-CP, CIPD, Personalfachkaufmann (IHK) |
| Gesundheit & Soziales | Erste-Hilfe-Ausbilder, Rettungssanitäter, Palliative Care |
| Handwerk, Technik & Industrie | Schweißer-Zertifikate, Staplerschein, SPS-Programmierung |
| Sprachen & Interkulturell | TOEFL, IELTS, TestDaF, DELF/DALF, HSK |
| Nachhaltigkeit & Umwelt | GRI Standards, CDP Reporting, ISO 14001 |
| Branchenübergreifend | Ausbildereignungsprüfung (AEVO), Datenschutzbeauftragter, Brandschutzhelfer |

### 4.8 Project (Projekte)

```typescript
interface Project {
  id: string;
  name: string;                   // Projektname (min. 2 Zeichen)
  description: string;            // Beschreibung (max. 500 Zeichen)
  url?: string;                   // Projekt-URL
  startDate: string;              // Format "YYYY-MM"
  endDate?: string;               // Format "YYYY-MM"
  technologies: string[];         // Verwendete Technologien
  role?: string;                  // Rolle im Projekt
}
```

### 4.9 JobPosting (Stellenanzeige)

```typescript
type JobSource = "website" | "linkedin" | "indeed" | "stepstone" | "empfehlung" | "sonstiges";

interface JobPosting {
  companyName: string;            // Firmenname (Pflicht, min. 2 Zeichen)
  companyAddress?: {              // Firmenadresse (optional)
    street?: string;
    zip?: string;
    city?: string;
  };
  contactPerson?: string;         // Ansprechpartner
  jobTitle: string;               // Stellentitel (Pflicht, min. 2 Zeichen)
  referenceNumber?: string;       // Kennziffer/Referenznummer
  source?: JobSource;             // Wo die Stelle gefunden wurde
  jobDescriptionText?: string;    // Volltext der Stellenausschreibung
}
```

**Quellen-Labels:**
| Wert | Anzeige |
|---|---|
| `website` | Webseite |
| `linkedin` | LinkedIn |
| `indeed` | Indeed |
| `stepstone` | StepStone |
| `empfehlung` | Empfehlung |
| `sonstiges` | Sonstiges |

### 4.10 CoverLetter (Anschreiben)

```typescript
type CoverLetterMode = "ai" | "manual";
type CoverLetterTonality = "formell" | "modern-professionell" | "kreativ";

interface CoverLetter {
  mode: CoverLetterMode;          // KI-generiert oder manuell
  introduction: string;           // Einleitung (min. 10 Zeichen bei manual)
  mainBody: string;               // Hauptteil (min. 50 Zeichen bei manual)
  closing: string;                // Schlussteil (min. 10 Zeichen bei manual)
  fullText?: string;              // Gesamttext (optional, für KI-Output)
  generationParams?: {            // KI-Generierungsparameter
    motivation?: string;          // Persönliche Motivation
    strengths?: string;           // Stärken des Bewerbers
    specialQualification?: string; // Besondere Qualifikation
    tonality?: CoverLetterTonality; // Gewählte Tonalität
  };
}

interface CoverLetterMeta {
  entryDate?: string;             // Frühester Eintrittstermin
  salaryExpectation?: string;     // Gehaltsvorstellung
  noticePeriod?: string;          // Kündigungsfrist
}
```

**Anschreiben-Modi:**
- **`ai`**: KI-gestützte Generierung. Der Nutzer gibt Motivation, Stärken und Tonalität an; die KI erstellt das Anschreiben.
- **`manual`**: Manuelle Eingabe. Der Nutzer schreibt alle drei Abschnitte selbst.

**Tonalitäten:**
| Tonalität | Beschreibung |
|---|---|
| `formell` | Klassisch-formeller Stil. "Sehr geehrte Damen und Herren", Konjunktiv II, höflich-distanziert. |
| `modern-professionell` | Zeitgemäß, direkt, aktiv. Keine Floskeln, kurze Sätze. "Du" möglich wenn Stellenanzeige es nahelegt. |
| `kreativ` | Authentisch mit Persönlichkeit. Storytelling, unerwarteter Einstieg, lebendig — aber substanziell. |

### 4.11 Attachment (Anhänge)

```typescript
type AttachmentCategory = "zeugnis" | "zertifikat" | "referenz" | "arbeitsprobe" | "sonstiges";
type AttachmentFileType = "pdf" | "image" | "doc";

interface Attachment {
  id: string;
  fileName: string;               // Dateiname
  fileType: AttachmentFileType;    // Dateityp
  fileSize: number;               // Dateigröße in Bytes
  category: AttachmentCategory;    // Kategorie
  addedAt: string;                // ISO-Zeitstempel
}
```

**Einschränkungen:**
- Maximale Dateigröße: **10 MB** pro Datei
- Maximale Gesamtgröße: **50 MB** für alle Anhänge zusammen
- Erlaubte Dateitypen: **PDF, JPEG, PNG, WebP, DOCX**
- Kategorien: Zeugnis, Zertifikat, Referenz, Arbeitsprobe, Sonstiges

### 4.12 LayoutConfig (Design-Einstellungen)

```typescript
type TemplateId = "classic" | "modern" | "creative" | "tech";
type FontFamily = "Inter" | "Roboto" | "Merriweather" | "Open Sans" | "Lato";
type PhotoPosition = "top-right" | "top-left" | "sidebar";
type HeaderStyle = "centered" | "left-aligned" | "minimal";

interface LayoutConfig {
  templateId: TemplateId;         // Gewähltes Template
  primaryColor: string;           // Primärfarbe (Hex, z.B. "#1e40af")
  secondaryColor: string;         // Sekundärfarbe (Hex)
  fontFamily: FontFamily;         // Schriftart
  fontSize: number;               // Schriftgröße (10–14pt)
  headerStyle: HeaderStyle;       // Kopfzeilen-Stil
  photoPosition: PhotoPosition;   // Foto-Position
  showPhoto: boolean;             // Foto anzeigen?
}
```

**Templates:**
| Template | Beschreibung | Besonderheiten |
|---|---|---|
| `classic` | Zeitlos & professionell | Klare Struktur, dezente Farben, universell einsetzbar |
| `modern` | Frisch & dynamisch | Farbige Akzente, modernes Layout, Skill-Balken |
| `creative` | Kreativ & auffällig | Farbblöcke, Sidebar-Layout, visuell ansprechend |
| `tech` | Tech/IT-optimiert | Tech-Stack prominent, Projekte vor Berufserfahrung, GitHub/Portfolio hervorgehoben, Zertifikate-Sektion, auto-kategorisierte Skills |

**Farbpaletten (8 Stück):**
| Name | Primär | Sekundär |
|---|---|---|
| Klassisch Blau | #1e40af | #3b82f6 |
| Smaragd | #065f46 | #10b981 |
| Bordeaux | #7f1d1d | #dc2626 |
| Anthrazit | #1f2937 | #6b7280 |
| Ozean | #0c4a6e | #0ea5e9 |
| Aubergine | #581c87 | #a855f7 |
| Waldgrün | #14532d | #22c55e |
| Mitternacht | #0f172a | #334155 |

### 4.13 ExportConfig (Export-Einstellungen)

```typescript
type ExportFormat = "pdf" | "zip" | "json";
type PdfMode = "single" | "bundle";

interface ExportConfig {
  format: ExportFormat;           // Exportformat
  pdfMode: PdfMode;               // Einzeln oder gebündelt
  fileName: string;               // Dateiname
}
```

**Export-Formate:**
- **PDF**: Einzelne oder gebündelte PDF mit Deckblatt, Anschreiben und Lebenslauf
- **ZIP**: ZIP-Archiv mit PDF + allen Anhängen
- **JSON**: Strukturierter JSON-Export (Schema-Version 1.0.0) für Backup/Import

### 4.14 DocumentSelection (Dokument-Auswahl)

```typescript
interface DocumentSelection {
  includeCoverLetter: boolean;    // Anschreiben einschließen?
  includeCV: boolean;             // Lebenslauf einschließen?
  includeCoverPage: boolean;      // Deckblatt einschließen?
}
```

### 4.15 TrackerEntry (Bewerbungs-Tracker)

```typescript
type TrackerStatus = "entwurf" | "gesendet" | "antwort" | "absage" | "zusage";

interface TrackerEntry {
  id: string;
  companyName: string;
  jobTitle: string;
  appliedAt: string;              // ISO-Zeitstempel
  status: TrackerStatus;          // Status der Bewerbung
  reminderDate?: string;          // Erinnerungsdatum
  notes?: string;                 // Notizen
}
```

---

## 5. Der 10-Schritte-Wizard

Die App führt den Nutzer durch einen linearen, aber frei navigierbaren Wizard:

| Schritt | Titel | Beschreibung |
|---|---|---|
| 1 | **Persönliche Daten** | Name, Kontaktdaten, Adresse, optionales Foto, LinkedIn/Portfolio-URLs |
| 2 | **Berufserfahrung** | Arbeitgeber, Positionen, Zeiträume, Aufgaben, Erfolge |
| 3 | **Bildung** | Ausbildung, Studium, Schulabschlüsse mit Typ-Auswahl |
| 4 | **Fähigkeiten** | Skills (4 Kategorien, 5 Stufen) + Sprachkenntnisse (GER-Niveau) |
| 5 | **Zertifikate & Projekte** | Zertifikate mit Vorschlagsdatenbank + Projektbeschreibungen |
| 6 | **Anschreiben** | KI-generiert oder manuell, 3 Tonalitäten, Stellenanzeige-Eingabe |
| 7 | **Layout & Design** | Template-Auswahl, Farben, Schrift, Foto-Position |
| 8 | **Anhänge** | Upload von Zeugnissen, Referenzen, Arbeitsproben (PDF/Bild/DOCX) |
| 9 | **Export** | PDF/ZIP/JSON-Export, Dokumentauswahl, ATS-Check |
| 10 | **Abschluss** | Zusammenfassung, Bewerbungs-Tracker |

---

## 6. KI-Anschreiben-Generierung

### 6.1 Unterstützte Provider & Modelle

| Provider | Modelle |
|---|---|
| **OpenAI** | GPT-4o, GPT-4o mini, GPT-4.1, GPT-4.1 mini |
| **Anthropic** | Claude Sonnet 4, Claude Haiku 3.5 |
| **Google** | Gemini 2.5 Flash, Gemini 2.5 Pro |

### 6.2 API-Endpunkt

- **Route**: `POST /api/ai/generate`
- **Streaming**: Ja (Server-Sent Events via Vercel AI SDK)
- **Authentifizierung**: API-Key wird im Request-Body mitgesendet
- **Sicherheit**: API-Keys werden NIE gespeichert, NIE geloggt, NIE zwischengespeichert
- **Fehlerbehandlung**: 401 (ungültiger Key), 429 (Rate Limit), 500 (interner Fehler)

### 6.3 System-Prompt Kontext

Die KI wird als "erstklassiger Karriereberater und Bewerbungsexperte für den deutschsprachigen und europäischen Arbeitsmarkt 2026+" instruiert. Kernregeln:

**Inhaltliche Regeln:**
- Konkret statt abstrakt — Zahlen, Ergebnisse, Beispiele nennen
- Keine Floskeln ("mit großem Interesse", "hiermit bewerbe ich mich")
- Mindestens 3–5 Keywords aus der Stellenausschreibung natürlich einbauen
- Unique Value Proposition in 1–2 Sätzen
- Zukunftsorientierte Formulierungen
- Lücken proaktiv positiv framen

**ATS-Optimierungsregeln:**
- Keywords aus Stellenanzeige in natürlichen Sätzen verwenden
- Klare Absatzstruktur (Einleitung, Qualifikation, Motivation, Schluss)
- Kein Markdown im Fließtext (kein fett, kursiv, Listen)
- Standard-Schreibweisen, keine ungewöhnlichen Abkürzungen

**Format-Regeln:**
- Exakt eine DIN-A4-Seite (2.400–3.200 Zeichen inkl. Leerzeichen)
- 4–5 klare Absätze, max. 5–6 Sätze pro Absatz
- Variierende Satzlängen und -anfänge
- Namentliche Anrede wenn Ansprechpartner bekannt

**Anti-Patterns (verboten):**
- ❌ "Mit großem Interesse habe ich Ihre Stellenanzeige gelesen"
- ❌ "Hiermit bewerbe ich mich als..."
- ❌ "Ich bin teamfähig, belastbar und flexibel"
- ❌ "Über eine Einladung würde ich mich sehr freuen"
- ❌ Skills ohne Kontext aufzählen
- ❌ Lebenslauf nacherzählen
- ❌ Copy-Paste aus Stellenanzeige

**Ausgabestruktur:**
Das generierte Anschreiben wird mit drei Markdown-Überschriften strukturiert:
1. `## Einleitung` — Anrede, packender Einstieg
2. `## Hauptteil` — Qualifikationen, Erfolge, Stellenbezug
3. `## Schluss` — Verfügbarkeit, Gehalt, Gesprächswunsch

### 6.4 User-Prompt Aufbau

Der User-Prompt wird automatisch aus den Bewerbungsdaten zusammengesetzt:
- Bewerber-Name
- Stelle und Unternehmen
- Ansprechpartner (wenn vorhanden)
- Volltext der Stellenbeschreibung
- Persönliche Motivation
- Stärken
- Besondere Qualifikation
- Berufserfahrung (als Aufzählung)
- Skills (kommagetrennt)
- Ausbildung (als Aufzählung)

### 6.5 Response-Parsing

Der AI-Response wird geparst:
1. **Primär**: Suche nach `## Einleitung`, `## Hauptteil`, `## Schluss` Headings
2. **Fallback**: Aufteilung nach Doppel-Zeilenumbrüchen in 3 Teile
3. **Notfall**: Gesamter Text wird `mainBody` zugewiesen

---

## 7. PDF-Export & DIN 5008

### 7.1 DIN 5008 Maße

| Element | Wert |
|---|---|
| Linker Rand | 25 mm |
| Rechter Rand | 20 mm |
| Oberer Rand | 20 mm |
| Unterer Rand | 20 mm |
| Adressfeld Y-Position | 45 mm (ab Blattoberkante) |
| Adressfeld Höhe | 40 mm |
| Adressfeld Breite | 85 mm |
| Seitengröße | DIN A4 (210 × 297 mm) |

### 7.2 PDF-Bestandteile

Je nach `documentSelection` enthält die PDF:

1. **Deckblatt** (`includeCoverPage`): Name, Foto (wenn aktiviert), Stellentitel, Kontaktdaten
2. **Anschreiben** (`includeCoverLetter`): DIN-5008-konformer Geschäftsbrief mit Absender, Empfänger-Adressfeld, Datum, Betreff, Anrede, Fließtext, Grußformel, Unterschrift
3. **Lebenslauf** (`includeCV`): Template-basierter CV mit allen Sektionen

### 7.3 Template-Rendering

Jedes Template (`ClassicCV`, `ModernCV`, `CreativeCV`, `TechCV`) rendert die gleichen Daten, aber mit unterschiedlichem Layout:

- **Classic**: Traditionelles Layout, klare Trennlinien, links-ausgerichtete Überschriften
- **Modern**: Farbige Akzentleiste, Skill-Fortschrittsbalken, kompakte Header
- **Creative**: Sidebar mit Foto und Kontaktdaten, Farbblöcke, visuelle Hierarchie
- **Tech**: Tech-Stack-Sektion prominent oben, Projekte vor Berufserfahrung, GitHub/Portfolio-Links hervorgehoben, Zertifikate-Sektion, Skills automatisch nach Kategorie gruppiert

### 7.4 Schriftarten im PDF

| Schriftart | PDF-Mapping | Einsatz |
|---|---|---|
| Inter | Helvetica | Universell, modern |
| Roboto | Helvetica | Tech, clean |
| Merriweather | Times-Roman (Serif) | Konservativ, akademisch |
| Open Sans | Helvetica | Leicht, freundlich |
| Lato | Helvetica | Professionell, warm |

---

## 8. ATS-Kompatibilitätsprüfung

Die App bietet einen eingebauten ATS-Check, der Bewerbungen auf ATS-Kompatibilität prüft und eine Punktzahl von 0–100 berechnet.

### Geprüfte Kriterien

| Prüfung | Max. Punkte | Prüfgegenstand |
|---|---|---|
| Schriftart | 15 | ATS-freundliche Schrift? (Inter, Roboto, Open Sans, Lato = ✓; Merriweather = ⚠) |
| Schriftgröße | 15 | 10–12pt? |
| Sonderzeichen | 10 | Keine ungewöhnlichen Unicode-Zeichen in Skills/Jobtiteln? |
| Kontaktdaten | 20 | E-Mail, Telefon, Adresse vorhanden? |
| Fähigkeiten | 20 | Mindestens 3 Skills eingetragen? |
| Berufserfahrung | 20 | Mindestens 1 Eintrag mit Aufgaben/Erfolgen? |

### Bewertungsskala

| Punktzahl | Bewertung |
|---|---|
| 80–100 | ✅ Hervorragende ATS-Kompatibilität |
| 60–79 | ⚠ Gute Kompatibilität, Verbesserungspotenzial |
| < 60 | ❌ Problematisch — Überarbeitung empfohlen |

---

## 9. State Management & Persistenz

### 9.1 Zustand Store

Der gesamte App-State wird in einem einzigen Zustand-Store verwaltet (`store/applicationStore.ts`). Wichtige Store-Actions:

**Bewerbungsdaten:**
- `setPersonalData(data)` — Persönliche Daten aktualisieren
- `addWorkExperience(entry)` / `updateWorkExperience(id, data)` / `removeWorkExperience(id)`
- `addEducation(entry)` / `updateEducation(id, data)` / `removeEducation(id)`
- `addSkill(skill)` / `updateSkill(id, data)` / `removeSkill(id)`
- `addLanguage(lang)` / `updateLanguage(id, data)` / `removeLanguage(id)`
- `addCertificate(cert)` / `updateCertificate(id, data)` / `removeCertificate(id)`
- `addProject(project)` / `updateProject(id, data)` / `removeProject(id)`
- `setJobPosting(posting)` / `setCoverLetter(letter)` / `setCoverLetterMeta(meta)`
- `addAttachment(attachment)` / `removeAttachment(id)`
- `setDocumentSelection(selection)` / `setLayoutConfig(config)` / `setExportConfig(config)`

**Navigation:**
- `setCurrentStep(step)` — Wizard-Schritt setzen
- `nextStep()` / `prevStep()` — Navigation

**Tracker:**
- `addTrackerEntry(entry)` / `updateTrackerEntry(id, data)` / `removeTrackerEntry(id)`

**Import/Export:**
- `importApplication(data)` — Gesamte Bewerbung importieren (mit Validierung)
- `resetApplication()` — Alles zurücksetzen

### 9.2 Persistenz

- **Autosave**: Änderungen werden mit 2 Sekunden Debounce automatisch gespeichert
- **Storage**: Dexie (IndexedDB) über Zustand Persist-Middleware
- **Datenbank**: `jlb-applications` mit Tabellen `applications` und `attachments`
- **Anhänge**: Werden als Blobs in IndexedDB gespeichert (nicht im Zustand-Store)

### 9.3 JSON Import/Export

- **Export-Schema Version**: `1.0.0`
- **Validierung**: Vollständige Zod-Schema-Validierung beim Import
- **Felder**: Alle Bewerbungsdaten (ohne Anhang-Blobs, nur Metadaten)

---

## 10. Internationalisierung (i18n)

| Sprache | Locale-Code | Status |
|---|---|---|
| Deutsch | `de` | Standard |
| Englisch | `en` | Unterstützt |
| Französisch | `fr` | Unterstützt |

- Bibliothek: `next-intl`
- Nachrichten-Dateien: `messages/de.json`, `messages/en.json`, `messages/fr.json`
- Routing: Cookie-basiert, kein URL-Prefix

---

## 11. Validierungsregeln (Zusammenfassung)

### Allgemeine Regeln
- Alle Datumsfelder: Format `YYYY-MM` (z.B. "2024-06")
- Enddatum darf nie vor Startdatum liegen
- URLs müssen valide sein (Zod `.url()`)
- E-Mail muss valide sein (Zod `.email()`)
- Telefon: Internationales Format erlaubt (`+?[0-9 -()]{7,20}`)
- Hex-Farben: Format `#RRGGBB` (6-stellig)
- Schriftgröße: 10–14pt

### Feldlängen
| Feld | Minimum | Maximum |
|---|---|---|
| Firmenname | 2 Zeichen | — |
| Jobtitel | 2 Zeichen | — |
| Institution | 2 Zeichen | — |
| Zertifikatsname | 2 Zeichen | — |
| Projektname | 2 Zeichen | — |
| Projektbeschreibung | 1 Zeichen | 500 Zeichen |
| Anschreiben Einleitung (manuell) | 10 Zeichen | — |
| Anschreiben Hauptteil (manuell) | 50 Zeichen | — |
| Anschreiben Schluss (manuell) | 10 Zeichen | — |

---

## 12. Sicherheit & Datenschutz

- **Kein Backend-Speicher**: Alle Daten verbleiben ausschließlich im Browser des Nutzers
- **Kein Benutzerkonto**: Keine Registrierung, kein Login erforderlich
- **API-Keys**: Werden ausschließlich pro Request an den AI-Provider gesendet, niemals gespeichert oder geloggt
- **Anhänge**: Lokal in IndexedDB gespeichert, nicht an Server übertragen
- **Export**: Nur lokal im Browser — Dateien werden heruntergeladen, nicht hochgeladen
- **Tracking**: Kein Analytics, kein Tracking, keine Cookies (außer Locale-Preference)

---

## 13. Wichtige Geschäftsregeln

1. **Berufserfahrung ohne Enddatum**: Nur erlaubt wenn `isCurrentJob === true`. Wird im CV als "seit [Startdatum]" oder "[Startdatum] – heute" angezeigt.

2. **Anschreiben-Modus**: Wenn `mode === "ai"`, werden die manuellen Felder (introduction, mainBody, closing) durch KI-generierte Inhalte befüllt. Der Nutzer kann danach manuell nachbearbeiten.

3. **Foto im CV**: Wenn `showPhoto === false` in der LayoutConfig, wird kein Foto angezeigt — unabhängig davon ob eines hochgeladen wurde. Empfohlen für internationale Bewerbungen und ATS-Optimierung.

4. **Template-spezifische Anordnung**: Das Tech-Template zeigt Skills und Projekte vor der Berufserfahrung. Andere Templates folgen der klassischen Reihenfolge: Berufserfahrung → Bildung → Skills → Projekte → Zertifikate.

5. **Zertifikate mit Ablaufdatum**: Zertifikate können ein optionales Ablaufdatum haben. Abgelaufene Zertifikate werden trotzdem angezeigt — es liegt am Nutzer, sie zu entfernen.

6. **Gehaltsvorstellung & Eintrittstermin**: Diese Informationen (aus `coverLetterMeta`) werden im Anschreiben und optional im KI-generierten Text verwendet, aber NICHT im Lebenslauf angezeigt.

7. **Attachment-Verknüpfung**: Zertifikate können über `attachmentId` mit einem hochgeladenen Dokument verknüpft werden. Beim ZIP-Export werden diese Anhänge mitgeliefert.

8. **DIN 5008 ist verpflichtend**: Alle PDF-Exporte folgen DIN 5008 — unabhängig vom gewählten Template. Die Template-Auswahl betrifft nur das CV-Layout, nicht die Briefform des Anschreibens.

---

## 14. Bekannte Einschränkungen

- **Nur deutschsprachige Bewerbungsdokumente**: Obwohl die UI mehrsprachig ist, werden die Bewerbungsdokumente (CV, Anschreiben) derzeit nur auf Deutsch generiert.
- **Keine Server-seitige Verarbeitung**: Da Local-First, gibt es kein OCR für Dokumenten-Upload, kein automatisches Parsen von Stellenanzeigen.
- **Foto im PDF**: Fotos werden als Base64 eingebettet. Große Fotos können die PDF-Größe erheblich vergrößern.
- **Browser-Abhängigkeit**: IndexedDB-Daten gehen verloren wenn der Browser-Cache gelöscht wird. JSON-Backup wird empfohlen.
- **Schriftarten im PDF**: Aufgrund der Beschränkungen von react-pdf werden nicht alle Schriftarten 1:1 abgebildet. Merriweather (Serif) wird auf Times-Roman gemapped, alle Sans-Serif auf Helvetica.

---

## 15. Hinweise für KI-Assistenten

Wenn du als KI-Assistent in oder für diese App arbeitest, beachte:

1. **Datenintegrität**: Ändere nie direkt den Zustand — verwende immer die Store-Actions.
2. **Validierung**: Alle Eingaben müssen die Zod-Schemas bestehen bevor sie gespeichert werden.
3. **DIN 5008**: Bei Änderungen am PDF-Export die DIN-5008-Maße niemals verändern.
4. **TypeScript strict**: Die App verwendet `strict: true`. Alle Typen müssen korrekt sein, keine `any`-Typen.
5. **Keine Server-Aufrufe**: Außer der KI-API-Route darf die App keine externen Server kontaktieren.
6. **Datenschutz**: Keine Nutzerdaten loggen, an Dritte senden oder in Cookies speichern.
7. **Sprachstil der UI**: Deutsche UI-Texte verwenden "Sie"-Anrede (formell).
8. **Testing**: Unit-Tests mit Vitest, E2E-Tests mit Playwright. Bei neuen Features Tests schreiben.
9. **Linting**: ESLint + Prettier müssen bestanden werden (`pnpm lint && pnpm format:check`).
10. **Import-Kompatibilität**: Beim Erweitern des Datenmodells die Import-Schema-Version berücksichtigen und Abwärtskompatibilität sicherstellen.

---

*Letzte Aktualisierung: 2025*
*Schema-Version: 1.0.0*
*App-Version: Job Letter Builder (Next.js 16.1.6)*
