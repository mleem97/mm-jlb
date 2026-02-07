# Contributing zu Job Letter Builder

Vielen Dank für dein Interesse, zum Job Letter Builder beizutragen! 🎉

## Wie kann ich beitragen?

### 🐛 Bugs melden

1. Prüfe, ob das Problem bereits als [Issue](https://github.com/mleem97/mm-jlb/issues) existiert
2. Erstelle ein neues Issue mit:
   - Klarer Beschreibung des Problems
   - Schritte zum Reproduzieren
   - Erwartetes vs. tatsächliches Verhalten
   - Browser und Betriebssystem

### 💡 Feature Requests

1. Erstelle ein [Issue](https://github.com/mleem97/mm-jlb/issues) mit dem Label `enhancement`
2. Beschreibe das gewünschte Feature und den Anwendungsfall

### 🔀 Pull Requests

1. Forke das Repository
2. Erstelle einen Feature-Branch: `git checkout -b feat/mein-feature`
3. Installiere Dependencies: `pnpm install`
4. Nimm deine Änderungen vor
5. Stelle sicher, dass alle Checks bestehen:
   ```bash
   pnpm type-check    # TypeScript Fehler prüfen
   pnpm lint          # ESLint prüfen
   pnpm test:unit     # Unit-Tests ausführen
   pnpm build         # Build testen
   ```
6. Committe mit [Conventional Commits](https://www.conventionalcommits.org/de/):
   ```
   feat: Neue Funktion hinzufügen
   fix: Bug in PDF-Export beheben
   docs: README aktualisieren
   refactor: Code-Struktur verbessern
   test: Neue Tests hinzufügen
   chore: Dependencies aktualisieren
   ```
7. Pushe deinen Branch und erstelle einen Pull Request

## Entwicklungsumgebung

### Voraussetzungen

- **Node.js** 18+
- **pnpm** 10+ (empfohlen)

### Setup

```bash
git clone https://github.com/mleem97/mm-jlb.git
cd mm-jlb
pnpm install
pnpm dev
```

### Projektstruktur

| Ordner | Inhalt |
| --- | --- |
| `app/` | Next.js App Router Seiten |
| `components/` | React-Komponenten (UI, Features, Layout) |
| `hooks/` | Custom React Hooks |
| `lib/` | Utilities, Schemas, Datenbank, Export |
| `store/` | Zustand State Management |
| `types/` | TypeScript Type Definitions |
| `__tests__/` | Unit-Tests (Vitest) |

### Code-Stil

- **TypeScript** strict mode
- **ESLint** mit `eslint-config-next`
- **Prettier** für Formatierung
- Funktionale React-Komponenten mit Hooks
- Deutsche UI-Texte, englischer Code

## Datenschutz-Grundsätze

Da der Job Letter Builder mit sensiblen Bewerbungsdaten arbeitet, gelten folgende Regeln:

- ❌ Keine externen API-Calls ohne explizite Nutzer-Zustimmung
- ❌ Keine Tracking-/Analytics-Services
- ❌ Keine serverseitige Datenspeicherung von Nutzerdaten
- ✅ Alle Daten bleiben im Browser (localStorage / IndexedDB)
- ✅ Datenschutz-Hinweis bei erstem Start

## Lizenz

Mit deinem Beitrag stimmst du zu, dass dieser unter der [MIT-Lizenz](LICENSE) veröffentlicht wird.
