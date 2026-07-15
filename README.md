# Job Letter Builder

> Datenschutzfreundlicher Bewerbungs-Builder für Anschreiben, Lebensläufe und komplette Bewerbungsmappen – lokal im Browser, ohne Benutzerkonto und ohne zentrale Profildatenbank.

[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](./Dockerfile)

## Links

- **Repository:** [github.com/mleem97/mm-jlb](https://github.com/mleem97/mm-jlb)
- **Issues:** [github.com/mleem97/mm-jlb/issues](https://github.com/mleem97/mm-jlb/issues)
- **Pull Requests:** [github.com/mleem97/mm-jlb/pulls](https://github.com/mleem97/mm-jlb/pulls)
- **Contributing:** [`CONTRIBUTING.md`](./CONTRIBUTING.md)

## Überblick

**Job Letter Builder** führt durch einen strukturierten Bewerbungsprozess und erzeugt Anschreiben, Lebensläufe, Anlagenverzeichnisse und vollständige Bewerbungsmappen. Profildaten und hochgeladene Dokumente werden im Browser über `localStorage` und IndexedDB gespeichert.

Die Anwendung benötigt keine Registrierung, keine serverseitige Datenbank und keine serverseitige Dateispeicherung. Der Server liefert die Next.js-Anwendung aus und übernimmt nur die optionalen Netzwerkfunktionen für KI-Generierung und SMTP-Versand.

## Funktionen

- 10-Schritte-Assistent für persönliche Daten, Berufserfahrung, Bildung, Skills, Projekte, Anschreiben, Layout, Anlagen und Export
- Lebenslauf- und Anschreiben-Editor mit Live-Vorschau
- mehrere Layout-Vorlagen, Farbpaletten und Schriftarten
- Foto-Upload mit Komprimierung und Zuschneiden
- ATS-Score, Job-Match, Tonalitätsprüfung und Erkennung von Karrierelücken
- PDF-, ZIP-, JSON- und iCal-Export
- LinkedIn-, XING- und CSV-Import
- Bewerbungstracker und Nachfass-Erinnerungen
- PWA-Installation und Offline-Unterstützung über Serwist
- Benutzeroberfläche auf Deutsch, Englisch und Französisch
- optionale KI-Unterstützung mit OpenAI, Anthropic, Google Gemini, Ollama, Perplexity und Kimi
- optionaler E-Mail-Versand über einen eigenen SMTP-Zugang

## Datenschutz und Vertrauensmodell

- Bewerbungsdaten, Anhänge, KI-Konfiguration und SMTP-Konfiguration werden im Browser der jeweiligen Domain gespeichert.
- Die Anwendung verwendet keine zentrale Benutzer- oder Profildatenbank.
- Für die Kernfunktionen sind keine externen Dienste erforderlich.
- Bei einer KI-Anfrage werden Prompt, Modell und der im Browser gespeicherte API-Key an den selbst gehosteten Next.js-Server gesendet. Der Server leitet die Anfrage an den gewählten Anbieter weiter.
- Beim E-Mail-Versand werden SMTP-Zugangsdaten und Anhänge für den Versand an den selbst gehosteten Server übertragen.
- Die Anwendung speichert diese Zugangsdaten nicht in einer serverseitigen Datenbank. Reverse Proxies, Plattform-Logs oder eigene Infrastruktur können jedoch Metadaten protokollieren.

> Für öffentlich erreichbare Instanzen wird ein vorgeschalteter Zugriffsschutz empfohlen. Die Anwendung besitzt derzeit keine integrierte Benutzerverwaltung, Mandantentrennung oder Rate-Limits.

## Lokale Entwicklung

### Voraussetzungen

- Node.js 20.9 oder neuer
- pnpm 10 oder neuer

### Installation

```bash
git clone https://github.com/mleem97/mm-jlb.git
cd mm-jlb
pnpm install
pnpm dev
```

Anschließend ist die Anwendung unter [http://localhost:3000](http://localhost:3000) erreichbar.

### Scripts

| Script | Beschreibung |
|---|---|
| `pnpm dev` | Entwicklungsserver starten |
| `pnpm build` | Produktions-Build erstellen |
| `pnpm start` | Produktionsserver starten |
| `pnpm lint` | ESLint ausführen |
| `pnpm type-check` | TypeScript prüfen |
| `pnpm test:unit` | Unit-Tests einmalig ausführen |
| `pnpm test:unit:watch` | Unit-Tests im Watch-Modus ausführen |
| `pnpm test:unit:ui` | Vitest UI starten |
| `pnpm test:e2e` | Playwright E2E-Tests ausführen |
| `pnpm test:e2e:ui` | Playwright UI starten |
| `pnpm test:e2e:headed` | E2E-Tests mit sichtbarem Browser ausführen |

## Self-Hosting mit Docker

Das Repository enthält ein Multi-Stage-`Dockerfile`, eine `.dockerignore`, einen Health-Endpunkt und eine `docker-compose.yml`. Das Produktions-Image verwendet die Next.js-Standalone-Ausgabe, läuft als nicht privilegierter Benutzer und lauscht auf Port `3000`.

### Docker Compose

```bash
git clone https://github.com/mleem97/mm-jlb.git
cd mm-jlb
docker compose up -d --build
```

Standardmäßig ist die Anwendung unter `http://localhost:3000` erreichbar. Ein anderer Host-Port kann über `APP_PORT` gesetzt werden:

```bash
APP_PORT=8080 docker compose up -d --build
```

Status prüfen:

```bash
docker compose ps
curl http://localhost:3000/api/health
```

Aktualisieren:

```bash
git pull
docker compose up -d --build --remove-orphans
```

### Docker ohne Compose

```bash
docker build -t mm-jlb .
docker run -d \
  --name mm-jlb \
  --restart unless-stopped \
  -p 3000:3000 \
  mm-jlb
```

## Deployment auf Coolify

1. In Coolify ein neues **Application**-Resource anlegen und dieses Repository verbinden.
2. Als Build Pack **Dockerfile** auswählen.
3. Als Dockerfile-Pfad `Dockerfile` verwenden.
4. Den Container-Port auf `3000` setzen.
5. Als Healthcheck-Pfad `/api/health` konfigurieren.
6. Domain und HTTPS konfigurieren und das Deployment starten.

Für den normalen Betrieb sind keine serverseitigen Secrets oder Datenbankvariablen erforderlich. KI-Keys und SMTP-Zugänge werden von den Benutzern in der Oberfläche hinterlegt.

## Deployment auf Dokploy

1. In Dokploy ein neues **Docker Compose**-Projekt anlegen und das Repository verbinden.
2. Als Compose-Datei `docker-compose.yml` auswählen.
3. Den Service `app` verwenden und die Domain auf Container-Port `3000` routen.
4. Deployment starten und `/api/health` als Healthcheck verwenden.

Es wird kein Volume benötigt, weil die Anwendung keine serverseitigen Bewerbungsdaten persistiert. Dokploy-Umgebungsvariablen werden nur benötigt, wenn `APP_PORT` für eine direkte Host-Port-Bindung angepasst werden soll.

## Datenhaltung und Backups

Die Daten gehören zum Browser-Origin. Das bedeutet:

- Ein Container-Neustart oder Deployment löscht die Bewerbungsdaten nicht.
- Ein Wechsel von Domain, Subdomain, Protokoll oder Port erzeugt aus Browsersicht einen neuen Speicherbereich.
- Vor einem Domainwechsel sollte ein JSON-Export erstellt und auf der neuen Instanz importiert werden.
- Server-Volumes und Datenbank-Backups ersetzen keinen Browser-Export.

## Ollama im Docker-Betrieb

Die Ollama-URL wird in der Oberfläche konfiguriert und vom Next.js-Server aufgerufen. `http://localhost:11434/v1` verweist innerhalb eines Containers auf den Anwendungscontainer, nicht auf den Docker-Host.

Je nach Umgebung kann beispielsweise verwendet werden:

- Docker Desktop: `http://host.docker.internal:11434/v1`
- gemeinsames Compose-Netzwerk: `http://ollama:11434/v1`
- externer Ollama-Server: eine intern erreichbare HTTPS- oder HTTP-URL

Die Zieladresse sollte nur für vertrauenswürdige Benutzer konfigurierbar sein, da der Server ausgehende Requests an diese Adresse ausführt.

## Produktionshinweise

- TLS/HTTPS am Reverse Proxy aktivieren.
- Öffentliche Instanzen mit SSO, Basic Auth, VPN oder einem Access-Proxy schützen.
- Ausgehende Netzwerkverbindungen des Containers auf benötigte KI- und SMTP-Ziele begrenzen, sofern die Infrastruktur dies unterstützt.
- Proxy- und Plattform-Logs auf sensible Request-Daten prüfen.
- Regelmäßig JSON-Exporte als benutzerseitige Backups erstellen.
- Nach Updates den Healthcheck und mindestens `pnpm type-check`, `pnpm lint` und `pnpm test:unit` ausführen.

## Healthcheck

```http
GET /api/health
```

Beispielantwort:

```json
{
  "status": "ok",
  "service": "job-letter-builder",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Tech Stack

| Bereich | Technologie |
|---|---|
| Framework | Next.js 16, App Router, Turbopack |
| UI | React 19, shadcn/ui, Radix UI |
| Sprache | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| State | Zustand 5 mit Browser-Persistenz |
| Formulare | React Hook Form und Zod |
| Browser-Datenbank | Dexie / IndexedDB |
| PDF | `@react-pdf/renderer` und `pdf-lib` |
| KI | Vercel AI SDK mit mehreren Providern |
| E-Mail | Nodemailer über Server Actions |
| PWA | Serwist |
| Internationalisierung | next-intl, Deutsch/Englisch/Französisch |
| Tests | Vitest, Testing Library und Playwright |
| Deployment | Docker, Docker Compose, Next.js Standalone |

## Repository-Struktur

```text
.
├── app/                         # Next.js App Router
│   ├── (builder)/               # Bewerbungs-Assistent und Dashboard
│   ├── actions/                 # Server Actions, unter anderem SMTP
│   ├── api/                     # KI- und Health-Endpunkte
│   └── sw.ts                    # Service Worker
├── components/                  # UI-, Feature- und Layout-Komponenten
├── e2e/                         # Playwright E2E-Tests
├── hooks/                       # React Hooks
├── i18n/                        # Locale-Konfiguration und Provider
├── lib/                         # AI, Exporte, Imports, Schemas und Utilities
├── messages/                    # Übersetzungen für de, en und fr
├── public/                      # Statische Assets und PWA-Manifest
├── store/                       # Zustand Store
├── types/                       # TypeScript-Typen
├── __tests__/                   # Unit-Tests
├── Dockerfile                   # Produktions-Container
├── docker-compose.yml           # Lokales und plattformfähiges Compose-Setup
├── next.config.ts               # Next.js-, Security- und Standalone-Konfiguration
└── package.json
```

## Tests und Qualitätschecks

```bash
pnpm type-check
pnpm lint
pnpm test:unit
pnpm test:e2e
pnpm build
```

Die Unit-Tests decken unter anderem Schemas, State-Management, Importer und Utility-Funktionen ab. Playwright testet zentrale Abläufe auf Desktop- und Mobile-Viewport.

## Bekannte Einschränkungen

- Keine integrierte Authentifizierung oder serverseitige Mandantentrennung
- Keine serverseitige Synchronisierung zwischen Browsern oder Geräten
- API- und SMTP-Zugangsdaten liegen im Browser-Speicher und sollten nur auf vertrauenswürdigen Geräten verwendet werden
- Keine PDF/A-Garantie für erzeugte Dokumente
- Ollama und SMTP müssen aus dem Container-Netzwerk erreichbar sein

## Contributing

Beiträge sind willkommen. Siehe [`CONTRIBUTING.md`](./CONTRIBUTING.md) für Entwicklungsablauf und Qualitätschecks.

```bash
git checkout -b feat/mein-feature
pnpm install
pnpm type-check
pnpm lint
pnpm test:unit
```

## Lizenz

Dieses Projekt steht unter der **MIT License**. Siehe [`LICENSE`](./LICENSE).

---

**Job Letter Builder — Bewerbungsunterlagen unter eigener Kontrolle.**
