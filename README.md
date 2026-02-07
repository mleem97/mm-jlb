<div align="center">

# 📄 Job Letter Builder

**Professionelle Bewerbungen erstellen – 100% offline und datenschutzfreundlich.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tests](https://img.shields.io/badge/Tests-252%20passing-brightgreen?logo=vitest)](https://vitest.dev)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)

Erstelle Anschreiben, Lebensläufe und komplette Bewerbungsmappen direkt im Browser.
Keine Registrierung, keine Cloud, keine Daten auf fremden Servern.

[Funktionen](#-funktionen) · [Quick Start](#-quick-start) · [Tech Stack](#-tech-stack) · [Contributing](#-contributing)

</div>

---

## ✨ Funktionen

### 📝 10-Schritte Bewerbungs-Assistent

| Schritt | Funktion |
| --- | --- |
| 1. Persönliche Daten | Name, Kontakt, Adresse, Foto-Upload mit Komprimierung |
| 2. Berufserfahrung | Positionen mit Drag-&-Drop, automatische Lückenerkennung |
| 3. Bildungsweg | Abschlüsse sortiert nach Relevanz, Smart Tips |
| 4. Skills | 300+ Vorschläge (Hard, Digital, Green, Soft Skills + Sprachen) |
| 5. Zertifikate & Projekte | Portfolio mit Datei-Upload in IndexedDB |
| 6. Anschreiben | Stelleninfos, manueller Editor, Pflichtangaben 2026 |
| 7. Layout & Design | 3 Templates, Farbpaletten, Schriftarten, Live-Preview |
| 8. Anlagen | Drag-&-Drop Upload, Kategorisierung, Anlagenverzeichnis |
| 9. Export | PDF, ZIP, JSON – mit Bewerbungstracker |
| 10. Abschluss | Zusammenfassung, Feedback, Konfetti 🎉 |

### 🔒 Datenschutz

- **100% lokal** – alle Daten bleiben im Browser (localStorage + IndexedDB)
- **Kein Tracking** – keine Analytics, keine Cookies
- **Kein Server** – keine Registrierung, kein Account nötig
- **DSGVO-konform** – Datenschutz-Hinweis beim ersten Start
- **Ein-Klick-Löschung** aller gespeicherten Daten

### 📊 Analyse-Tools

- **ATS-Score** – Keyword-Analyse für Bewerbermanagementsysteme
- **Job-Match-Score** – Abgleich deiner Skills mit der Stellenbeschreibung
- **Tonalitäts-Check** – Formalität, Floskeln, Zeichenlänge prüfen
- **Lücken-Erkennung** – Automatische Warnung bei Karrierelücken > 3 Monate

### 📥 Import & Export

- **JSON Import/Export** – Profile sichern und wiederverwenden
- **ZIP Export** – Komplette Bewerbungsmappe (Anschreiben + CV + Anlagen)
- **PDF Export** – Druckoptimierte PDFs mit `@react-pdf/renderer`
- **LinkedIn/XING Parser** – CSV-Import von Profildaten
- **Kalender-Export** – iCal-Dateien für Nachfass-Reminder

---

## 🚀 Quick Start

### Voraussetzungen

- [Node.js](https://nodejs.org) 18+
- [pnpm](https://pnpm.io) 10+ (empfohlen)

### Installation

```bash
# Repository klonen
git clone https://github.com/mleem97/mm-jlb.git
cd mm-jlb

# Dependencies installieren
pnpm install

# Entwicklungsserver starten
pnpm dev
```

Öffne [http://localhost:3000](http://localhost:3000) im Browser.

### Scripts

| Script | Beschreibung |
| --- | --- |
| `pnpm dev` | Entwicklungsserver starten |
| `pnpm build` | Produktions-Build erstellen |
| `pnpm start` | Produktions-Server starten |
| `pnpm lint` | ESLint prüfen |
| `pnpm type-check` | TypeScript Fehler prüfen |
| `pnpm test:unit` | Unit-Tests ausführen (Vitest) |
| `pnpm test:unit:watch` | Tests im Watch-Modus |
| `pnpm test:unit:ui` | Tests mit Vitest UI |

---

## 🛠 Tech Stack

| Bereich | Technologie |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Sprache | [TypeScript 5](https://www.typescriptlang.org) (strict mode) |
| UI | [React 19](https://react.dev) + [shadcn/ui](https://ui.shadcn.com) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| State | [Zustand 5](https://zustand.docs.pmnd.rs) mit localStorage-Persist |
| Formulare | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| PDF | [@react-pdf/renderer](https://react-pdf.org) |
| Datenbank | [Dexie.js](https://dexie.org) (IndexedDB-Wrapper) |
| Drag & Drop | [@dnd-kit](https://dndkit.com) |
| Animationen | [Motion](https://motion.dev) (Framer Motion) |
| Icons | [Lucide React](https://lucide.dev) |
| Tests | [Vitest](https://vitest.dev) + Testing Library |
| Paketmanager | [pnpm](https://pnpm.io) |

---

## 📂 Projektstruktur

```
mm-jlb/
├── app/                          # Next.js App Router
│   ├── (builder)/                # Bewerbungs-Builder (Route Group)
│   │   ├── phases/steps/         # 10 Wizard-Schritte
│   │   ├── dashboard/            # Bewerbungstracker
│   │   └── intro/                # Onboarding
│   ├── about/                    # Info-Seiten
│   ├── datenschutz/              # Datenschutzerklärung
│   ├── impressum/                # Impressum
│   ├── layout.tsx                # Root Layout
│   └── page.tsx                  # Landing Page
├── components/
│   ├── ui/                       # shadcn/ui Basiskomponenten
│   ├── features/                 # Feature-Komponenten (ATS, Privacy, etc.)
│   ├── site/                     # Header, Footer
│   └── layout/                   # Layout-Helfer
├── hooks/                        # Custom React Hooks
├── lib/
│   ├── data/                     # Skill-Datenbank, Templates, Farben
│   ├── db/                       # IndexedDB (Dexie) Setup
│   ├── export/                   # PDF-, JSON-, ZIP-Export
│   ├── importers/                # LinkedIn, XING, CSV Parser
│   ├── schemas/                  # Zod Validierungsschemas
│   └── utils/                    # Hilfsfunktionen
├── store/                        # Zustand Store
├── types/                        # TypeScript Definitionen
├── __tests__/                    # Unit-Tests (252 Tests)
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## 🧪 Tests

Das Projekt hat **252 Unit-Tests** mit Vitest:

```bash
# Alle Tests ausführen
pnpm test:unit

# Tests im Watch-Modus
pnpm test:unit:watch

# Tests mit Browser-UI
pnpm test:unit:ui
```

Getestet werden:

- Alle Zod-Validierungsschemas (7 Schema-Dateien)
- Store-Actions und State-Management
- Import-Parser (CSV, LinkedIn, XING)
- Utility-Funktionen (ATS-Check, Gap Detection, etc.)

---

## 🤝 Contributing

Beiträge sind willkommen! Lies bitte zuerst die [Contributing-Richtlinien](CONTRIBUTING.md).

```bash
# Fork klonen
git clone https://github.com/<dein-user>/mm-jlb.git
cd mm-jlb
pnpm install

# Feature-Branch erstellen
git checkout -b feat/mein-feature

# Checks vor dem Commit
pnpm type-check && pnpm lint && pnpm test:unit
```

---

## 📋 Roadmap

- [ ] KI-Assistent für Anschreiben (OpenAI, Anthropic, Gemini – mit eigenem API-Key)
- [ ] E-Mail-Versand über eigenen SMTP-Server
- [ ] PDF/A-Kompatibilität für ATS-Systeme
- [ ] Foto-Zuschnitt-Dialog
- [ ] Mehrsprachigkeit (EN, FR)
- [ ] PWA mit Offline-Support
- [ ] E2E-Tests mit Playwright

---

## 📄 Lizenz

MIT License – siehe [LICENSE](LICENSE)

---

<div align="center">

Entwickelt mit ❤️ von [Meyer Media](https://meyer-media.de)

⭐ **Star** das Repo, wenn es dir gefällt · 🐛 [Issues](https://github.com/mleem97/mm-jlb/issues) · 🔀 [Pull Requests](https://github.com/mleem97/mm-jlb/pulls)

</div>
