# Job Letter Builder
> 🚀 Ein moderner, datenschutzfreundlicher Bewerbungsgenerator mit Next.js 16 – Erstelle professionelle Anschreiben, Lebensläufe und komplette Bewerbungsmappen direkt im Browser. 100% offline-fähig, keine Daten auf externen Servern.

## ✨ Features

### 📄 Dokumenten-Generation
- **Anschreiben-Editor**: Intuitive Formulare mit Live-Vorschau für verschiedene Anschreiben-Typen (Initiativbewerbung, Stellenanzeige, Praktikum, Ausbildung)
- **Lebenslauf-Builder**: Modularer Aufbau mit Drag-&-Drop, mehrere Layout-Varianten (klassisch, modern, kreativ)
- **Deckblatt-Generator**: Optional professionelles Deckblatt mit Foto-Upload
- **Anlagenverzeichnis**: Automatisch generierte Liste aller Anhänge
- **Bewerbungs-Mappe**: Zusammenstellung von Anschreiben + Lebenslauf + Anlagen als ZIP-Download

### 💾 Speicherung & Datenschutz
- **Lokale Speicherung**: Alle Daten werden im Browser (IndexedDB) gespeichert – keine Cloud, keine Server
- **JSON-Export**: Speichere Bewerbungsprofile als JSON für Backup oder Wiederverwendung
- **JSON-Import**: Lade vorhandene Profile wieder ein
- **Vertse-History**: Versionsverwaltung mit Zeitstempel, um frühere Entwürfe wiederherzustellen
- **Daten-Löschung**: Ein-Klick-Löschung aller gespeicherten Daten

### 🎨 Vorlagen & Customizing
- **Template-Galerie**: Vorinstallierte, professionelle Designs für verschiedene Branchen
- **Custom Templates**: Lade eigene Word- oder PDF-Vorlagen hoch (Client-seitige PDF-Manipulation)
- **Echtzeit-Editor**: Farben, Schriftarten und Layouts direkt anpassen
- **Dark Mode**: Augenfreundliche Darstellung bei längerer Bearbeitung

### 🤖 KI-Integration (Optional)
- **AI Writing Assistant**: Mit eigener OpenAI/Anthropic API-Key generiert die App:
  - Passende Anschreiben-Texte basierend auf Job-Beschreibung
  - Lebenslauf-Formulierungen
  - Keywords-Optimierung für ATS-Systeme
- **Stil-Anpassung**: Formal, kreativ, verkürzt, ausführlich wählbar
- **Hinweis**: API-Key bleibt lokal im Browser, KI-Anfragen werden direkt vom Client aus geführt

### 📥 Import & Datenübernahme
- **LinkedIn-Import**: Import von Profildaten über LinkedIn-Export (CSV/JSON)
- **XING-Import**: Import von XING-Profildaten
- **PDF-Parser**: Extrahiere Daten aus vorhandenen PDF-Lebensläufen (Client-seitige OCR)
- **JSON-Profile**: Wiederverwendbare Profile für verschiedene Bewerbungen

### 📧 Versand & Export
- **PDF-Export**: Hochwertige, druckoptimierte PDFs (Einzelseiten oder Mappe)
- **ZIP-Export**: Komplette Bewerbung mit Anschreiben, Lebenslauf und Anlagen als ZIP
- **E-Mail-Versand**: Direkter Versand über eigenen IMAP/SMTP-Server (kein externer Mail-Service)
  - Anhänge automatisch anhängen
  - Betreffzeile individuell anpassbar
  - E-Mail-Text-Vorlagen
- **Teilen**: Generiere temporäre Links (via Data-URL) für direkte Vorschau

### 🛠️ Bewerbungs-Management
- **Bewerbungs-Tracker**: Verwalte alle versendeten Bewerbungen mit Status (gesendet, in Prüfung, Absage, Einladung)
- **Unternehmens-Datenbank**: Speichere Firmen-Informationen für spätere Nachfass-E-Mails
- **Fristen-Übersicht**: Kalenderansicht mit Deadlines für Bewerbungseingänge
- **Nachfass-Reminder**: Erinnere dich an Follow-Up-E-Mails nach definiertem Zeitraum

## 🛠️ Tech Stack

| Bereich | Technologie |
|---------|-------------|
| Framework | **Next.js 16.1.6** (App Router, Server Components) |
| Sprache | **TypeScript** (strict mode) |
| Styling | **Tailwind CSS 4.2** |
| State | **Zustand** + React Context |
| Formulare | **React Hook Form** + **Zod** Validation |
| PDF | **@react-pdf/renderer** (React-Komponenten zu PDF) |
| Datenbank | **IndexedDB** (Dexie.js für einfache API) |
| KI | OpenAI/Anthropic API, Google, Perplexity, Claude oder Kimi (Client-seitig, API-Key erforderlich) |
| E-Mail | **Nodemailer** (für Server Actions) oder **EmailJS** (Client-seitig) |
| Icons | Lucide React |
| UI-Komponenten | shadcn/ui (optional anpassbar) |

## 🚀 Quick Start

```bash
# Repository klonen
git clone https://github.com/[username]/bewerbung-generator.git

# Dependencies installieren
npm install

# Development-Server starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000)

## 📂 Projektstruktur

```
/app
  /(editor)           # Bewerbungs-Editor Routes
  /api                # API Routes (KI-Calls, PDF-Export)
  /preview            # Live-Vorschau Komponenten
/components
  /forms              # Formular-Komponenten
  /templates          # Anschreiben-/Lebenslauf-Vorlagen
  /pdf                # PDF-Renderer Komponenten
/lib
  /db                 # IndexedDB Wrapper (Dexie)
  /validators         # Zod Schemas
  /templates          # Template-Logik
/hooks               # Custom React Hooks
/types               # TypeScript Interfaces
```

## 🔒 Datenschutz & Security

- ✅ **Zero-Server-Storage**: Keine persönlichen Daten verlassen den Browser
- ✅ **API-Keys lokal**: KI-Schlüssel werden nur im LocalStorage gespeichert
- ✅ **Kein Tracking**: Keine Analytics, keine Cookies ohne Zustimmung
- ✅ **Export-Kontrolle**: Du bestimmst, wohin deine Daten gehen
- ✅ **Offline-fähig**: Funktioniert ohne Internet nach dem ersten Laden (PWA)

## 📋 Roadmap

### Phase 1 – Core (MVP)
- [x] Anschreiben-Editor mit Live-Vorschau
- [x] Lebenslauf-Builder mit Basis-Templates
- [x] PDF-Export (Einzeldateien)
- [x] Lokale IndexedDB-Speicherung
- [x] JSON Export/Import

### Phase 2 – Advanced Features
- [ ] Eigene Vorlagen hochladen (PDF-Manipulation)
- [ ] ZIP-Export kompletter Bewerbungsmappen
- [ ] Bewerbungs-Tracker mit Status-Verwaltung
- [ ] Templates für verschiedene Branchen

### Phase 3 – KI & Integrationen
- [ ] AI Writing Assistant (mit eigener API-Key)
- [ ] LinkedIn/XING-Profil-Import
- [ ] ATS-Optimierung (Keyword-Analyse)
- [ ] PDF-Parser für bestehende Lebensläufe

### Phase 4 – Versand & Workflow
- [ ] E-Mail-Versand über eigenen IMAP/SMTP
- [ ] Kalender-Integration für Fristen
- [ ] Follow-Up-Reminder
- [ ] PWA-Features (Offline-Nutzung)

### Phase 5 – Collaboration
- [ ] Cloud-Sync (optional, verschlüsselt)
- [ ] Teilen von Templates mit Community
- [ ] Multi-Language Support (DE, EN, FR)

## 💡 Use Cases

- **Job-Suchende**: Schnelle Erstellung professioneller Bewerbungsunterlagen
- **Berufseinsteiger**: Leitfaden für die erste Bewerbung mit Templates
- **Karriere-Wechsler**: Anpassbare Profile für verschiedene Branchen
- **Recruiter**: Schnelle Erstellung von Stellenanzeigen-Beispielen
- **Bewerbungs-Coaches**: Tool für Workshops und Einzelberatungen
- **Schüler/Studenten**: Praktikums- und Ausbildungsbewerbungen

## 📄 Lizenz

MIT License – Nutzung, Modifikation und Weiterverbreitung erlaubt.

## 👤 Autor

Entwickelt mit ❤️ in Hannover  
[Meyer Media](https://meyer-media.de) – Digitale Lösungen für Kreative

---

⭐ **Star** das Repository, wenn es dir gefällt!  
🐛 **Issues** für Bugs oder Feature-Requests  
🔀 **Pull Requests** sind willkommen
