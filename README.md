# 🎯 Dart Training Tracker

[![CI](https://github.com/frank3ling/dart-tracking/actions/workflows/ci.yml/badge.svg)](https://github.com/frank3ling/dart-tracking/actions/workflows/ci.yml)
[![Deploy](https://github.com/frank3ling/dart-tracking/actions/workflows/deploy.yml/badge.svg)](https://github.com/frank3ling/dart-tracking/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Eine mobile Web-App (PWA) zum Tracken von Dart-Trainingswürfen mit detaillierten Statistiken — offline, kostenlos, ohne Anmeldung, ohne Server.

*A mobile-first dart practice tracker PWA: log your training throws, analyze hit rates per dart position, and improve systematically. Works fully offline, no account needed.*

**▶️ Live-Demo / App: https://frank3ling.github.io/dart-tracking/**

## Features

- **Trainingsziel wählen** (1–20, Bull) und Würfe mit vier Buttons erfassen: Single / Double / Triple / Miss
- **Detaillierte Statistiken:** Wurf-Kategorien (0, 1–59, 60–79, 80–99, 100–139, 140–179, 180), Trefferquote gesamt und pro Pfeil-Position
- **Letzte-10-Würfe-Analyse** mit Dart-Typ-Verteilung
- **Offline-fähig (PWA):** Service Worker + Manifest, installierbar auf dem Homescreen
- **Lokale Datenhaltung:** Alle Daten bleiben im Browser (IndexedDB), nichts verlässt das Gerät
- **JSON-Export** als Backup der Trainingsdaten
- **Rückgängig-Funktion** für Eingabefehler
- **Dunkles, touch-optimiertes Design**, ausgelegt für Smartphones (entwickelt auf einem Pixel 7a)

## Nutzung

Einfach die [Web-App öffnen](https://frank3ling.github.io/dart-tracking/) und optional über das Browser-Menü **„Zum Startbildschirm hinzufügen"** installieren — danach funktioniert die App komplett offline.

### Lokal entwickeln

```bash
git clone https://github.com/frank3ling/dart-tracking.git
cd dart-tracking
npx serve .        # oder ein beliebiger statischer Webserver
```

Kein Build-Schritt, keine Dependencies — reines HTML/CSS/JavaScript.

### Tests

```bash
node --test 'tests/*.test.js'
```

## Technik

| Datei | Zweck |
|---|---|
| `index.html` + `input.js` | Wurf-Eingabe (Spiel) |
| `stats.html` + `stats.js` | Statistiken |
| `data.html` + `data.js` | Datenverwaltung & Export |
| `shared.js` | IndexedDB-Layer, Utilities, Statistik-Berechnung |
| `styles.css` | Gemeinsames Styling |
| `sw.js` + `manifest.json` | PWA (Offline & Installation) |

### Datenstruktur

```javascript
{
  id: "uuid",
  target: 20,
  darts: [
    { type: "single", hit: true,  points: 20, target: 20 },
    { type: "miss",   hit: false, points: 0,  target: 20 },
    { type: "double", hit: true,  points: 40, target: 20 }
  ],
  totalPoints: 60,
  timestamp: "2026-07-16T10:30:00.000Z"
}
```

### Statistik-Logik

- **Wurf-Kategorien** sind Punktebänder: 0, 1–59, 60–79, 80–99, 100–139, 140–179, 180
- **Trefferquote:** getroffene Darts / geworfene Darts, gesamt und je Pfeil-Position (1./2./3. Dart)
- **Bewertung:** sehr gut (≥80 %), gut (≥60 %), ausbaufähig (≥40 %), schwach (<40 %) — als Farbe *und* Text

## CI/CD

- **CI** ([ci.yml](.github/workflows/ci.yml)): Unit-Tests bei jedem Push und Pull Request
- **Deploy** ([deploy.yml](.github/workflows/deploy.yml)): Tests → automatisches GitHub-Pages-Deployment bei jedem Push auf `master`
- **Release** ([release.yml](.github/workflows/release.yml)): Git-Tag `v*` → Tests → GitHub-Release mit generierten Release Notes

## Mitmachen

1. Repository forken
2. Feature-Branch erstellen (`git checkout -b feature/mein-feature`)
3. Änderungen committen und pushen
4. Pull Request öffnen — die CI läuft automatisch

Feature-Ideen und Spezifikationen liegen unter [docs/features/](docs/features/).

## Lizenz

[MIT](LICENSE) © 2025 Frank Dreiling

---

**Entwickelt für Dart-Enthusiasten 🎯**
