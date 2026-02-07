# Atomic Tasks (Job Letter Builder)

> Legende: ✅ erledigt · 🔧 in Arbeit · ⬜ offen

---

## Phase 0 – Start & Import

### 0.1 Welcome Screen

- [x] 0.1.1 Route `/intro` anlegen + Layout mit `(builder)` Route Group
- [x] 0.1.2 Welcome-Karte: „Neue Bewerbung starten" Button
- [x] 0.1.3 Welcome-Karte: „JSON importieren" Button + Datei-Dialog
- [x] 0.1.4 Welcome-Karte: „ZIP importieren" Button + Datei-Dialog
- [x] 0.1.5 Welcome-Karte: „PDF importieren" Button + Datei-Dialog
- [x] 0.1.6 Modus + Payload in `localStorage` speichern (`jlb:builder:mode`, `jlb:builder:payload`)
- [x] 0.1.7 Weiterleitung zu `/phases/persoenliche-daten` nach Auswahl
- [ ] 0.1.8 Animierter Übergang (Framer Motion) zwischen Welcome → Phase 1

### 0.2 JSON Import

- [x] 0.2.1 JSON-Datei laden + `FileReader` als Text lesen
- [x] 0.2.2 Zod-Schema für das gesamte Bewerbungs-JSON definieren (`lib/schemas/importSchema.ts`)
- [x] 0.2.3 JSON-Validierung gegen das Schema + Fehlermeldung bei ungültigem Format
- [x] 0.2.4 Felder in Zustand-Store mappen (`personalData`, `experience[]`, etc.)
- [x] 0.2.5 Import-Daten in IndexedDB persistieren
- [x] 0.2.6 Erfolgs-Toast anzeigen + Weiterleitung zu Phase 1

### 0.3 ZIP Import

- [x] 0.3.1 ZIP-Datei entgegennehmen + mit JSZip entpacken
- [x] 0.3.2 JSON-Datei innerhalb ZIP finden + validieren (wie 0.2.2–0.2.3)
- [x] 0.3.3 Anhänge (PDFs, Bilder) aus ZIP extrahieren + in IndexedDB speichern
- [x] 0.3.4 Felder in Store mappen + Anhänge verknüpfen
- [ ] 0.3.5 Fortschrittsbalken während Entpacken anzeigen
- [x] 0.3.6 Erfolgs-Toast + Weiterleitung

### 0.4 LinkedIn/XING Import

- [x] 0.4.1 LinkedIn CSV-Export Dateiformat analysieren + Parser schreiben (`lib/importers/linkedinParser.ts`)
- [x] 0.4.2 XING CSV-Export Dateiformat analysieren + Parser schreiben (`lib/importers/xingParser.ts`)
- [ ] 0.4.3 Upload-Dialog mit Dropdown: „LinkedIn" / „XING" Auswahl
- [x] 0.4.4 Felder mappen: Name, Position, Firma → `PersonalData` + `WorkExperience[]`
- [x] 0.4.5 Skills aus LinkedIn-Skills-CSV extrahieren → `Skills[]`
- [x] 0.4.6 Bildungseinträge mappen → `Education[]`
- [ ] 0.4.7 Unmappbare Felder als Warnung anzeigen
- [x] 0.4.8 Daten in Store + IndexedDB persistieren

### 0.5 PDF OCR Import

- [ ] 0.5.1 PDF hochladen + serverseitig an Tesseract.js oder externen OCR-Service senden
- [ ] 0.5.2 OCR-Text zurückbekommen + mit Regex/NLP Felder extrahieren
- [ ] 0.5.3 Erkannte Felder als Vorschläge anzeigen (editierbar)
- [ ] 0.5.4 Bestätigung durch User → in Store mappen
- [ ] 0.5.5 Konfidenz-Indikator pro erkanntem Feld anzeigen
- [ ] 0.5.6 Fallback: manueller Modus, wenn OCR fehlschlägt

---

## Phase 1 – Persönliche Grunddaten

### 1.1 Typen & Schema

- [x] 1.1.1 `PersonalData` Interface in `types/application.ts` definieren
- [x] 1.1.2 `PersonalAddress` Interface (street, zip, city, country)
- [x] 1.1.3 Zod-Schema `personalDataSchema` mit allen Validierungsregeln
- [x] 1.1.4 Schema für optionale Felder (birthDate, birthPlace, nationality) erweitern
- [ ] 1.1.5 Internationale Telefonnummern unterstützen (nicht nur DE)

### 1.2 Store & Persistence

- [x] 1.2.1 Zustand Store `useApplicationStore` mit `setPersonalData()` Action
- [x] 1.2.2 `persist` Middleware für localStorage
- [x] 1.2.3 Auto-Save Timer (2s Debounce) → IndexedDB
- [x] 1.2.4 `lastSaved` Anzeige im UI (relative Zeitangabe „vor 3 Sek.")
- [x] 1.2.5 Offline-Indikator (online/offline Event-Listener)

### 1.3 Pflichtfelder-Formular

- [x] 1.3.1 Input-Felder: Vorname, Nachname, E-Mail, Telefon
- [x] 1.3.2 Adress-Felder: Straße, PLZ (5-stellig), Stadt, Land (Default: Deutschland)
- [x] 1.3.3 Echtzeit-Validierung mit `react-hook-form` + `zodResolver`
- [x] 1.3.4 Fehlermeldungen inline unter jedem Feld
- [ ] 1.3.5 Feld-Fokus-Indikator + Tab-Reihenfolge optimieren
- [ ] 1.3.6 Autovervollständigung für PLZ → Stadt (optional, lokale PLZ-DB)

### 1.4 Optionale Felder

- [x] 1.4.1 Collapsible Section „Optionale Angaben"
- [x] 1.4.2 Geburtsdatum (Date-Picker oder Input type=date)
- [x] 1.4.3 Geburtsort (Text-Input)
- [x] 1.4.4 Staatsangehörigkeit (Text-Input)
- [x] 1.4.5 LinkedIn-URL (URL-Validierung)
- [x] 1.4.6 Portfolio/Website URL (URL-Validierung)

### 1.5 Foto-Upload

- [x] 1.5.1 Foto-Upload-Button mit Drag-&-Drop-Zone
- [x] 1.5.2 Preview des hochgeladenen Fotos (rund, 120×120px)
- [x] 1.5.3 Client-seitige Bildkomprimierung (max 500KB, WebP)
- [ ] 1.5.4 Foto-Zuschnitt-Dialog (Crop-Funktion)
- [x] 1.5.5 Foto löschen Button
- [x] 1.5.6 Foto als Base64 in Store + IndexedDB speichern

### 1.6 Sidebar & Hilfe

- [x] 1.6.1 Info-Sidebar mit Tipps zu jedem Feld
- [ ] 1.6.2 Kontext-sensitive Hilfe (ändert sich je nach aktivem Feld)
- [ ] 1.6.3 Tooltip bei Hover über Info-Icon
- [ ] 1.6.4 Fortschrittsanzeige: ausgefüllte Pflichtfelder / gesamt

### 1.7 Navigation

- [x] 1.7.1 „Zurück"-Button → `/intro`
- [x] 1.7.2 „Weiter"-Button → `/phases/berufserfahrung` (nur wenn valide)
- [ ] 1.7.3 Guard: Redirect zu `/intro` wenn kein Profil existiert
- [ ] 1.7.4 Unsaved-Changes-Warning beim Verlassen (beforeunload)

---

## Phase 2 – Berufserfahrung

### 2.1 Typen & Schema

- [x] 2.1.1 `WorkExperience` Interface definieren (`types/workExperience.ts`)
- [x] 2.1.2 Zod-Schema `workExperienceSchema` mit Validierung
- [x] 2.1.3 `endDate` muss nach `startDate` liegen (custom refinement)
- [x] 2.1.4 Array-Schema `workExperienceArraySchema` (min 0, empfohlen ≥ 1)

### 2.2 Store-Erweiterung

- [x] 2.2.1 `workExperience: WorkExperience[]` zum `ApplicationState` hinzufügen
- [x] 2.2.2 Actions: `addExperience()`, `updateExperience(id)`, `removeExperience(id)`
- [x] 2.2.3 Action: `reorderExperience(fromIndex, toIndex)` für Drag-&-Drop
- [x] 2.2.4 Autosave für Berufserfahrung → IndexedDB

### 2.3 Erste Position (Formular)

- [x] 2.3.1 Eingabefelder: Firma, Jobtitel, Standort (Stadt)
- [x] 2.3.2 Datumsfelder: Start (Monat/Jahr), Ende (Monat/Jahr) oder „Bis heute" Checkbox
- [x] 2.3.3 Textarea: Aufgabenbeschreibung (Freitext oder Bullet-Points)
- [x] 2.3.4 Textarea: Erfolge/Achievements (optional, Bullet-Points)
- [x] 2.3.5 Echtzeit-Validierung aller Felder
- [x] 2.3.6 „Position speichern" Button → zur Liste

### 2.4 Positions-Liste (Repeatable)

- [x] 2.4.1 Übersichtskarte pro Position (Firma, Titel, Zeitraum)
- [x] 2.4.2 „+ Weitere Position hinzufügen" Button
- [x] 2.4.3 Bearbeiten-Button → Formular im Edit-Modus öffnen
- [x] 2.4.4 Löschen-Button mit Bestätigungs-Dialog
- [x] 2.4.5 Drag-&-Drop Handles zur Sortierung (dnd-kit)
- [x] 2.4.6 Visuelle Sortierungsanimation

### 2.5 Lücken-Erkennung

- [x] 2.5.1 Automatische Lücken-Berechnung zwischen Positionen (>3 Monate)
- [x] 2.5.2 Gelbe Warnung-Badge zwischen betroffenen Positionen anzeigen
- [x] 2.5.3 Lücken-Erklärungsfeld (optional): „Elternzeit", „Sabbatical", „Weiterbildung", Freitext
- [x] 2.5.4 Lücke als erklärt markieren → Warnung wird grün

### 2.6 Navigation & UX

- [x] 2.6.1 „Zurück"-Button → `/phases/persoenliche-daten`
- [x] 2.6.2 „Weiter"-Button → `/phases/ausbildung`
- [x] 2.6.3 Fortschrittsbalken aktualisieren (Step 2/9)
- [x] 2.6.4 Smart-Tip: „Beschreiben Sie Erfolge quantifizierbar (z.B. +20% Umsatz)"

---

## Phase 3 – Bildungsweg

### 3.1 Typen & Schema

- [x] 3.1.1 `Education` Interface definieren (`types/education.ts`)
- [x] 3.1.2 Zod-Schema `educationSchema`
- [x] 3.1.3 Enum für Abschlusstypen definieren

### 3.2 Store-Erweiterung

- [x] 3.2.1 `education: Education[]` zum `ApplicationState` hinzufügen
- [x] 3.2.2 Actions: `addEducation()`, `updateEducation(id)`, `removeEducation(id)`
- [x] 3.2.3 Action: `reorderEducation(fromIndex, toIndex)`
- [x] 3.2.4 Autosave für Bildungsweg → IndexedDB

### 3.3 Abschluss-Formular

- [x] 3.3.1 Dropdown: Abschlusstyp (Promotion → Hauptschulabschluss)
- [x] 3.3.2 Input: Institution/Hochschule/Schule
- [x] 3.3.3 Input: Studiengang / Fachrichtung
- [x] 3.3.4 Datumsfelder: Start + Ende (Monat/Jahr)
- [x] 3.3.5 Input: Note (optional, z.B. „1,7" oder „gut")
- [x] 3.3.6 Textarea: Schwerpunkte / Thesis-Titel (optional)
- [x] 3.3.7 Echtzeit-Validierung

### 3.4 Bildungs-Liste (Repeatable)

- [x] 3.4.1 Übersichtskarte pro Abschluss (Typ-Badge, Institution, Zeitraum)
- [x] 3.4.2 „+ Weiteren Abschluss hinzufügen" Button
- [x] 3.4.3 Bearbeiten + Löschen Buttons
- [x] 3.4.4 Sortierung: neuester Abschluss zuerst (default) oder Drag-&-Drop

### 3.5 Smart Tips

- [x] 3.5.1 Tipp: „Grundschule weglassen bei >5 Jahren Berufserfahrung"
- [x] 3.5.2 Tipp: „Relevante Schwerpunkte/Thesis hervorheben"
- [x] 3.5.3 Berechnung: Jahre Berufserfahrung aus Phase 2 auslesen

### 3.6 Navigation

- [x] 3.6.1 „Zurück"-Button → `/phases/berufserfahrung`
- [x] 3.6.2 „Weiter"-Button → `/phases/skills`
- [x] 3.6.3 Fortschrittsbalken (Step 3/9)

---

## Phase 4 – Skills & Kompetenzen

### 4.1 Typen & Schema

- [x] 4.1.1 `Skill` Interface definieren (`types/skills.ts`)
- [x] 4.1.2 `Language` Interface definieren
- [x] 4.1.3 Zod-Schemas für Skills + Languages

### 4.2 Store-Erweiterung

- [x] 4.2.1 `skills: Skill[]` + `languages: Language[]` zum `ApplicationState` hinzufügen
- [x] 4.2.2 Actions: `addSkill()`, `updateSkill(id)`, `removeSkill(id)`
- [x] 4.2.3 Actions: `addLanguage()`, `updateLanguage(id)`, `removeLanguage(id)`
- [x] 4.2.4 Autosave → IndexedDB

### 4.3 Hard Skills

- [x] 4.3.1 Kombobox/Autocomplete für Skill-Eingabe (Vorschlagsliste)
- [x] 4.3.2 Skill-Level Slider oder Stern-Bewertung (1–5)
- [x] 4.3.3 Skill-Tags Ansicht (Chip/Badge pro Skill)
- [x] 4.3.4 Kategorisierung mit Unterkategorien (Management, Kaufmännisch, Ingenieurwesen etc.)
- [x] 4.3.5 Vordefinierte Skill-Vorschlagsliste (`lib/data/skillSuggestions.ts`) — 100+ Hard Skills

### 4.4 Digitale & Green Skills

- [x] 4.4.1 Separate Sektion „Digitale Kompetenzen"
- [x] 4.4.2 Vorschläge: KI-Tools, Programmiersprachen, Cloud, Design-Tools, ERP etc. — 110+ Skills
- [x] 4.4.3 Separate Sektion „Green Skills / Nachhaltigkeit"
- [x] 4.4.4 Vorschläge: ESG, Kreislaufwirtschaft, Energie, Umwelt etc. — 35+ Skills

### 4.5 Sprachen

- [x] 4.5.1 Sprach-Dropdown (häufige Sprachen priorisiert: Deutsch, Englisch, Französisch …)
- [x] 4.5.2 Level-Dropdown nach GER (A1–C2 + Muttersprache)
- [x] 4.5.3 „+ Weitere Sprache" Button
- [x] 4.5.4 Info-Tooltip: „Was bedeuten die GER-Stufen?"

### 4.6 Soft Skills (optional)

- [x] 4.6.1 Auswahl aus vordefinierten Soft Skills (45+ mit Unterkategorien)
- [x] 4.6.2 Freitext-Eingabe für zusätzliche Soft Skills
- [x] 4.6.3 Max 5–8 Soft Skills empfehlen (Smart Tip)

### 4.7 Skill-Beschreibungen & Hilfe

- [x] 4.7.1 Beschreibung pro Skill-Kategorie (Was sind Hard/Digital/Green/Soft Skills?)
- [x] 4.7.2 „Wie finde ich meine Skills?" — Hilfetext pro Kategorie
- [x] 4.7.3 Aufklappbare Info-Box in jeder Skill-Sektion

### 4.8 Navigation

- [x] 4.8.1 „Zurück"-Button → `/phases/ausbildung`
- [x] 4.8.2 „Weiter"-Button → `/phases/zertifikate`
- [x] 4.8.3 Fortschrittsbalken (Step 4/9)

---

## Phase 5 – Zertifikate & Projekte (optional)

### 5.1 Typen & Schema

- [x] 5.1.1 `Certificate` Interface definieren (`types/certificate.ts`)
- [x] 5.1.2 `Project` Interface definieren (`types/project.ts`)
- [x] 5.1.3 Zod-Schemas für Certificate + Project

### 5.2 Store-Erweiterung

- [x] 5.2.1 `certificates: Certificate[]` + `projects: Project[]` zum State hinzufügen
- [x] 5.2.2 CRUD-Actions für Certificates
- [x] 5.2.3 CRUD-Actions für Projects
- [x] 5.2.4 Autosave → IndexedDB

### 5.3 Zertifikate-Formular

- [x] 5.3.1 Input: Zertifikatsname
- [x] 5.3.2 Input: Ausstellende Organisation
- [x] 5.3.3 Datumsfelder: Ausstellungsdatum + optionaler Ablauf
- [x] 5.3.4 Input: Credential-ID / Verifizierungs-URL (optional)
- [x] 5.3.5 Datei-Upload: Zertifikat als PDF/Bild
- [x] 5.3.6 Upload in IndexedDB als Blob speichern
- [x] 5.3.7 Zertifikate-Liste mit Bearbeiten/Löschen

### 5.4 Projekte/Portfolio-Formular

- [x] 5.4.1 Input: Projektname
- [x] 5.4.2 Textarea: Beschreibung (max 500 Zeichen)
- [x] 5.4.3 Input: URL/Link zum Projekt (optional)
- [x] 5.4.4 Tag-Input: Verwendete Technologien
- [x] 5.4.5 Input: Rolle im Projekt (optional)
- [x] 5.4.6 Datumsfelder: Zeitraum
- [x] 5.4.7 Projekte-Liste mit Bearbeiten/Löschen

### 5.5 Navigation

- [x] 5.5.1 „Zurück"-Button → `/phases/skills`
- [x] 5.5.2 „Weiter"-Button → `/phases/anschreiben`
- [x] 5.5.3 „Überspringen" Link (Phase ist optional)
- [x] 5.5.4 Fortschrittsbalken (Step 5/9)

---

## Phase 6 – Anschreiben

### 6.1 Typen & Schema

- [x] 6.1.1 `JobPosting` Interface definieren (`types/jobPosting.ts`)
- [x] 6.1.2 `CoverLetter` Interface definieren (`types/coverLetter.ts`)
- [x] 6.1.3 `CoverLetterMeta` Interface (entryDate, salaryExpectation, noticePeriod)
- [x] 6.1.4 Zod-Schemas für alle Interfaces

### 6.2 Store-Erweiterung

- [x] 6.2.1 `jobPosting: JobPosting` + `coverLetter: CoverLetter` + `coverLetterMeta: CoverLetterMeta` zum State
- [x] 6.2.2 Actions: `setJobPosting()`, `setCoverLetter()`, `setCoverLetterMeta()`
- [x] 6.2.3 Autosave → IndexedDB

### 6.3 Stelleninfos-Formular (Step 6.1)

- [x] 6.3.1 Input: Firmenname
- [x] 6.3.2 Inputs: Firmenadresse (Straße, PLZ, Stadt)
- [x] 6.3.3 Input: Ansprechperson (optional)
- [x] 6.3.4 Input: Stellentitel
- [x] 6.3.5 Input: Referenznummer (optional)
- [x] 6.3.6 Dropdown: Quelle (Webseite, LinkedIn, Indeed, StepStone, Empfehlung, Sonstiges)
- [x] 6.3.7 Textarea: Stellenbeschreibung (für KI-Analyse, optional)

### 6.4 KI-Assistent (Step 6.2a)

- [ ] 6.4.1 Modus-Toggle: „KI-Assistent" / „Manuell schreiben"
- [ ] 6.4.2 Eingabefelder für KI: Motivation, Stärken, besondere Qualifikation
- [ ] 6.4.3 Dropdown: Tonalität (formell, modern-professionell, kreativ)
- [ ] 6.4.4 „Generieren" Button → API-Call an LLM (OpenAI/Anthropic/lokal)
- [ ] 6.4.5 Generiertes Anschreiben in editierbarem Rich-Text-Editor anzeigen
- [ ] 6.4.6 „Neu generieren" Button mit veränderten Parametern
- [ ] 6.4.7 Loading-State + Error-Handling bei API-Ausfall
- [ ] 6.4.8 Wort-/Zeichenzähler

### 6.5 Manueller Modus (Step 6.2b)

- [x] 6.5.1 Textarea: Einleitung (mit Platzhalter-Vorschlag)
- [x] 6.5.2 Textarea: Hauptteil (mit Tipps in Sidebar)
- [x] 6.5.3 Textarea: Schlusssatz (mit Platzhalter-Vorschlag)
- [ ] 6.5.4 Rich-Text-Formatierung (Fett, Kursiv, Aufzählung)
- [x] 6.5.5 Zeichenzähler + Empfehlung (max ~1 DIN-A4-Seite)

### 6.6 Pflichtangaben 2026 (Step 6.3)

- [x] 6.6.1 Datepicker: Frühestmögliches Eintrittsdatum
- [x] 6.6.2 Input: Gehaltsvorstellung (Brutto/Jahr, optional als Spanne)
- [x] 6.6.3 Dropdown: Kündigungsfrist (sofort, 4 Wochen, 3 Monate, …, Freitext)
- [x] 6.6.4 Info-Box: „Warum diese Angaben 2026 erwartet werden"

### 6.7 Navigation

- [x] 6.7.1 „Zurück"-Button → `/phases/zertifikate`
- [x] 6.7.2 „Weiter"-Button → `/phases/layout-design`
- [x] 6.7.3 Fortschrittsbalken (Step 6/9)

---

## Phase 7 – Dokument-Auswahl & Layout

### 7.1 Typen & Schema

- [x] 7.1.1 `DocumentSelection` Interface (`types/documentSelection.ts`)
- [x] 7.1.2 `LayoutConfig` Interface (`types/layoutConfig.ts`)

### 7.2 Store-Erweiterung

- [x] 7.2.1 `documentSelection: DocumentSelection` + `layoutConfig: LayoutConfig` zum State
- [x] 7.2.2 Actions: `setDocumentSelection()`, `setLayoutConfig()`
- [x] 7.2.3 Autosave → IndexedDB

### 7.3 Dokument-Auswahl (Step 7.1)

- [x] 7.3.1 Checkbox: Anschreiben (Pflicht, standardmäßig an)
- [x] 7.3.2 Checkbox: Lebenslauf (Pflicht, standardmäßig an)
- [x] 7.3.3 Checkbox: Deckblatt (optional)
- [ ] 7.3.4 Vorschau-Thumbnails pro Dokument

### 7.4 Template-Auswahl (Step 7.2)

- [x] 7.4.1 Template-Grid (3 Templates) mit Thumbnail-Preview
- [x] 7.4.2 Template „Klassisch" (konservativ, Serif)
- [x] 7.4.3 Template „Modern" (clean, Sans-Serif, Akzentfarbe)
- [x] 7.4.4 Template „Kreativ" (Sidebar-Layout, Infografik-Elemente)
- [x] 7.4.5 Ausgewähltes Template hervorheben (Border/Badge)

### 7.5 Design-Anpassung

- [x] 7.5.1 Color-Picker: Primärfarbe
- [x] 7.5.2 Color-Picker: Sekundärfarbe
- [x] 7.5.3 Vordefinierte Farbpaletten (8 Paletten)
- [x] 7.5.4 Font-Dropdown: Schriftart (Inter, Roboto, Merriweather, Open Sans …)
- [x] 7.5.5 Slider: Schriftgröße (10–14pt)
- [x] 7.5.6 Toggle: Foto im CV anzeigen ja/nein
- [x] 7.5.7 Dropdown: Foto-Position (oben-rechts, oben-links, Sidebar)

### 7.6 Live-Preview

- [x] 7.6.1 HTML-Preview Komponente (Live-Vorschau)
- [x] 7.6.2 Echtzeit-Update bei jeder Änderung
- [ ] 7.6.3 Zoom-Steuerung (50%, 75%, 100%)
- [ ] 7.6.4 Seiten-Navigation (wenn >1 Seite)
- [ ] 7.6.5 Responsive: Preview unter dem Formular auf Mobile

### 7.7 Navigation

- [x] 7.7.1 „Zurück"-Button → `/phases/anschreiben`
- [x] 7.7.2 „Weiter"-Button → `/phases/anlagen`
- [x] 7.7.3 Fortschrittsbalken (Step 7/9)

---

## Phase 8 – Anlagen (optional)

### 8.1 Typen & Schema

- [x] 8.1.1 `Attachment` Interface definieren (`types/attachment.ts`)
- [x] 8.1.2 Zod-Schema für Validierung (max Dateigröße, erlaubte Typen)

### 8.2 Store-Erweiterung

- [x] 8.2.1 `attachments: Attachment[]` zum State hinzufügen
- [x] 8.2.2 Actions: `addAttachment()`, `removeAttachment(id)`, `reorderAttachments()`
- [x] 8.2.3 Attachments als Blobs in IndexedDB speichern (nicht localStorage!)

### 8.3 Datei-Upload

- [x] 8.3.1 Drag-&-Drop Upload-Zone (multiple files)
- [x] 8.3.2 Datei-Browser Button als Fallback
- [x] 8.3.3 Erlaubte Typen: PDF, JPG, PNG, DOCX
- [x] 8.3.4 Max Dateigröße: 10MB pro Datei, 50MB gesamt
- [ ] 8.3.5 Upload-Fortschrittsbalken pro Datei
- [x] 8.3.6 Fehlerbehandlung: ungültiger Typ, zu groß

### 8.4 Anlagen-Liste

- [x] 8.4.1 Karte pro Anlage: Dateiname, Typ-Icon, Größe, Kategorie
- [x] 8.4.2 Kategorie-Dropdown pro Anlage (Zeugnis, Zertifikat, Referenz, Arbeitsprobe, Sonstiges)
- [ ] 8.4.3 Vorschau-Button (PDF im Modal, Bild als Lightbox)
- [x] 8.4.4 Löschen-Button mit Bestätigung
- [x] 8.4.5 Drag-&-Drop Sortierung der Reihenfolge
- [x] 8.4.6 Gesamtgröße-Anzeige + Warnung wenn >50MB

### 8.5 Anlagenverzeichnis

- [x] 8.5.1 Automatische Generierung des Anlagenverzeichnisses aus Upload-Liste
- [x] 8.5.2 Preview des Verzeichnisses (nummeriert, mit Kategorien)
- [x] 8.5.3 Manuelle Titel-Überschreibung pro Anlage
- [ ] 8.5.4 Toggle: Anlagenverzeichnis als eigene Seite oder im Anschreiben

### 8.6 Navigation

- [x] 8.6.1 „Zurück"-Button → `/phases/layout-design`
- [x] 8.6.2 „Weiter"-Button → `/phases/export`
- [x] 8.6.3 „Überspringen" Link (Phase ist optional)
- [x] 8.6.4 Fortschrittsbalken (Step 8/9)

---

## Phase 9 – Export & Versand

### 9.1 Typen & Schema

- [x] 9.1.1 `ExportConfig` Interface (`types/exportConfig.ts`)
- [ ] 9.1.2 `EmailConfig` Interface
- [x] 9.1.3 `TrackerEntry` Interface

### 9.2 Store-Erweiterung

- [x] 9.2.1 `exportConfig: ExportConfig` + `trackerEntries: TrackerEntry[]` zum State
- [x] 9.2.2 Actions: `setExportConfig()`, `addTrackerEntry()`, `updateTrackerEntry()`

### 9.3 PDF-Export

- [x] 9.3.1 PDF-Generierung mit react-pdf/renderer
- [x] 9.3.2 Einzeldokument-Export: nur Anschreiben ODER nur Lebenslauf
- [ ] 9.3.3 Bewerbungsmappe: alle Dokumente in einer PDF zusammengefügt
- [ ] 9.3.4 Seitenzahlen + Header/Footer konfigurierbar
- [ ] 9.3.5 PDF/A-Kompatibilität für ATS-Systeme
- [x] 9.3.6 Download-Button mit Dateiname-Vorschlag
- [x] 9.3.7 Loading-State während PDF-Generierung

### 9.4 ZIP-Export

- [x] 9.4.1 ZIP erstellen mit JSZip (Anschreiben + CV + Anlagen + JSON-Daten)
- [x] 9.4.2 Ordnerstruktur im ZIP
- [x] 9.4.3 Download als `Bewerbung_[Name]_[Firma].zip`

### 9.5 JSON-Export

- [x] 9.5.1 Kompletten Bewerbungs-State als JSON serialisieren
- [x] 9.5.2 Schema-Version im JSON-Header (`{ version: "1.0", data: {...} }`)
- [x] 9.5.3 Download als `bewerbung_[datum].json`
- [x] 9.5.4 Kompatibilitäts-Prüfung mit Import-Schema (Round-Trip-Test)

### 9.6 E-Mail-Versand (optional)

- [ ] 9.6.1 SMTP-Konfigurationsformular (Host, Port, User, Passwort)
- [ ] 9.6.2 Verbindungstest-Button
- [ ] 9.6.3 E-Mail-Composer: Empfänger, Betreff (Vorschlag), Text (Vorschlag)
- [ ] 9.6.4 Anhänge auswählen (PDF-Mappe und/oder einzelne Dokumente)
- [ ] 9.6.5 „Senden" Button mit Bestätigung
- [ ] 9.6.6 Gesendete E-Mail in IMAP-Ordner ablegen (optional)
- [ ] 9.6.7 Error-Handling: Timeout, Auth-Fehler, Größenlimit

### 9.7 Tracker-Integration

- [x] 9.7.1 Automatischer Tracker-Eintrag nach Export/Versand
- [x] 9.7.2 Status-Dropdown: Entwurf → Gesendet → Antwort → Absage/Zusage
- [x] 9.7.3 Reminder-Datum setzen
- [x] 9.7.4 Notizen-Feld pro Eintrag

### 9.8 Navigation

- [x] 9.8.1 „Zurück"-Button → `/phases/anlagen`
- [x] 9.8.2 „Fertig"-Button → Phase 10 (Abschluss)
- [x] 9.8.3 Fortschrittsbalken (Step 9/9, 100%)

---

## Phase 10 – Speichern & Abschluss

### 10.1 Speichern

- [x] 10.1.1 Auto-Save alle 30 Sekunden (IndexedDB)
- [x] 10.1.2 „Jetzt speichern" Button (manuell)
- [x] 10.1.3 Input: Bewerbungsname vergeben / umbenennen
- [x] 10.1.4 Speicher-Bestätigung als Toast anzeigen
- [ ] 10.1.5 Versionierung: letzte 5 Versionen aufbewahren (IndexedDB)

### 10.2 Bewerbungsverwaltung

- [x] 10.2.1 „Neue Bewerbung starten" → Store zurücksetzen + zu Phase 0
- [ ] 10.2.2 „Bewerbung duplizieren" → Kopie mit neuem Namen
- [x] 10.2.3 „Alle Bewerbungen anzeigen" → Dashboard/Tracker-Übersicht
- [x] 10.2.4 „Export wiederholen" → zurück zu Phase 9

### 10.3 Dashboard / Tracker

- [x] 10.3.1 Route `/dashboard` anlegen
- [x] 10.3.2 Tabelle: alle Bewerbungen (Name, Firma, Status, Datum)
- [x] 10.3.3 Filter: nach Status (Entwurf, Gesendet, Antwort, Absage, Zusage)
- [x] 10.3.4 Sortierung: nach Datum, Firma, Status
- [ ] 10.3.5 Bewerbung öffnen / bearbeiten → zu Phase 1 mit geladenen Daten
- [x] 10.3.6 Bewerbung löschen mit Bestätigung
- [x] 10.3.7 Statistiken: Gesamt, Offen, Erfolgsquote

### 10.4 Abschluss-Screen

- [x] 10.4.1 Erfolgs-Animation (Konfetti)
- [x] 10.4.2 Zusammenfassung: was wurde erstellt (Dokumente, Firma, Datum)
- [x] 10.4.3 Quick-Actions: Neue Bewerbung, Dashboard, Export nochmal
- [ ] 10.4.4 Feedback-Möglichkeit: „War dieser Builder hilfreich?" (optional)

---

## Cross-Cutting Features

### CC.1 Job-Match-Score

- [x] CC.1.1 Stellenbeschreibung-Textfeld (aus Phase 6) als Basis
- [x] CC.1.2 Keyword-Extraktion aus Stellenbeschreibung (Regex)
- [x] CC.1.3 Abgleich mit eigenen Skills, Erfahrung, Bildung
- [x] CC.1.4 Score-Berechnung (0–100%) + Visualisierung
- [x] CC.1.5 Detailansicht: welche Keywords fehlen / vorhanden
- [x] CC.1.6 Verbesserungsvorschläge

### CC.2 ATS-Optimierung

- [x] CC.2.1 ATS-kompatibles PDF-Format sicherstellen
- [x] CC.2.2 Keyword-Dichte-Analyse (Stellenbeschreibung vs. Anschreiben + CV)
- [x] CC.2.3 Formatierungs-Checks
- [x] CC.2.4 ATS-Score anzeigen (Ampel: rot/gelb/grün)
- [x] CC.2.5 Warnungen mit konkreten Fix-Vorschlägen

### CC.3 Tonalitäts-Check

- [x] CC.3.1 Anschreiben auf Formalität prüfen (zu locker / zu steif)
- [x] CC.3.2 Längencheck: Anschreiben ≤ 1 DIN-A4-Seite
- [x] CC.3.3 Überzeugungskraft-Score (Aktionsverben, quantifizierbare Erfolge)
- [x] CC.3.4 Floskeln erkennen + Alternativen vorschlagen
- [ ] CC.3.5 Rechtschreibprüfung-Integration (optional, via API)

### CC.4 Barrierefreiheit (WCAG 2.1 AA)

- [ ] CC.4.1 PDF-Tagging für Screenreader (Heading-Struktur, Alt-Texte)
- [x] CC.4.2 Kontrast-Check für gewählte Farben (>= 4.5:1)
- [x] CC.4.3 Schriftgröße-Minimum (11pt im PDF)
- [x] CC.4.4 Builder-UI: Keyboard-Navigation für alle Interaktionen
- [x] CC.4.5 Builder-UI: ARIA-Labels + Screenreader-Announcements
- [ ] CC.4.6 Farbblindheits-Simulation für Design-Preview

### CC.5 Kalender-Integration

- [x] CC.5.1 iCal-Export für Reminder (Nachfass-Datum)
- [ ] CC.5.2 Google Calendar API-Integration (optional, OAuth)
- [ ] CC.5.3 Reminder-Notification im Browser (Push-API)
- [ ] CC.5.4 Kalender-Widget im Dashboard

### CC.6 Globale UI-Komponenten

- [x] CC.6.1 Toast/Notification-System (Sonner)
- [x] CC.6.2 Bestätigungs-Dialog (AlertDialog, wiederverwendbar)
- [x] CC.6.3 Loading-Spinner + Skeleton-Screens
- [x] CC.6.4 Responsive Layout (Mobile ≥ 375px, Tablet, Desktop)
- [x] CC.6.5 Dark-Mode Support (Theme-Toggle)
- [x] CC.6.6 Keyboard-Shortcuts (Ctrl+S speichern, Ctrl+→ weiter)

### CC.7 Daten & Sicherheit

- [x] CC.7.1 Alle Daten lokal (kein Server, kein Cloud-Upload)
- [ ] CC.7.2 IndexedDB-Verschlüsselung (optional, z.B. mit crypto.subtle)
- [ ] CC.7.3 Export-Passwortschutz für PDF (optional)
- [x] CC.7.4 „Alle Daten löschen" Button mit doppelter Bestätigung
- [x] CC.7.5 Datenschutz-Hinweis beim ersten Start (DSGVO-konform)

### CC.8 Testing

- [x] CC.8.1 Unit-Tests für alle Zod-Schemas (Vitest) — 7 Schema-Testdateien
- [x] CC.8.2 Unit-Tests für Store-Actions — applicationStore.test.ts
- [x] CC.8.3 Unit-Tests für Import-Parser (CSV, LinkedIn, XING) — 3 Testdateien
- [ ] CC.8.4 Component-Tests für alle Formular-Schritte (Testing Library)
- [ ] CC.8.5 E2E-Tests: kompletter Bewerbungs-Flow (Playwright)
- [ ] CC.8.6 Accessibility-Tests (axe-core)
- [ ] CC.8.7 Performance-Tests (Lighthouse CI)
- [ ] CC.8.8 Visual Regression Tests (optional, Playwright Screenshots)

---

## Skill-Datenbank

### SK.1 Umfassende Skill-Vorschlagsliste

- [x] SK.1.1 100+ Hard Skills über 14 Branchen (Management, Kaufmännisch, Marketing, HR, Qualität, Logistik, Ingenieurwesen, Gesundheitswesen, Finanzen, Recht, Handwerk, Gastronomie, Wissenschaft, Bildung, Medien)
- [x] SK.1.2 110+ Digitale Skills über 13 Unterkategorien (Programmierung, Web, Mobile, Datenbanken, Cloud/DevOps, KI/Data Science, BI/Analyse, Office, ERP, PM-Tools, Design-Tools, Marketing-Tools, IT-Sicherheit, IT-Administration)
- [x] SK.1.3 35+ Green Skills über 5 Unterkategorien (Strategie, Energie/Klima, Kreislauf/Ressourcen, Umwelt, Green Finance/Mobilität)
- [x] SK.1.4 45+ Soft Skills über 5 Unterkategorien (Kommunikation, Führung, Denken, Organisation, Persönlichkeit)
- [x] SK.1.5 32 Sprachen inkl. Gebärdensprache (DGS)
- [x] SK.1.6 Subcategory-Feld auf SkillSuggestion Interface
- [x] SK.1.7 `getSubcategories()` Helper-Funktion
- [x] SK.1.8 `getSkillsBySubcategory()` Helper-Funktion

### SK.2 Skill-Beschreibungen & Hilfe

- [x] SK.2.1 `SkillCategoryInfo` Interface mit Beschreibung + Identifikationstipp
- [x] SK.2.2 Beschreibung für Hard Skills
- [x] SK.2.3 Beschreibung für Digitale Skills
- [x] SK.2.4 Beschreibung für Green Skills
- [x] SK.2.5 Beschreibung für Soft Skills
- [x] SK.2.6 „Wie finde ich meine Skills?" Hilfetext pro Kategorie
- [x] SK.2.7 Aufklappbare Info-Box in jeder Skill-Sektion der Step4Skills-Komponente

### SK.3 Skill-Datenbank Tests

- [x] SK.3.1 Test: Keine doppelten Skill-Namen innerhalb einer Kategorie
- [x] SK.3.2 Test: Alle Skills haben Subcategory
- [x] SK.3.3 Test: Mindestanzahlen pro Kategorie (100 hard, 80 digital, 25 green, 30 soft)
- [x] SK.3.4 Test: Erweiterte Sprachliste (>= 25)
- [x] SK.3.5 Test: getSubcategories gibt korrekte Unterkategorien zurück
- [x] SK.3.6 Test: getSkillsBySubcategory filtert korrekt
- [x] SK.3.7 Test: skillCategoryDescriptions hat alle 4 Kategorien mit Beschreibung + Identifikationstipp
