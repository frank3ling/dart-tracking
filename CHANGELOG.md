# Changelog

Alle nennenswerten Änderungen an diesem Projekt. Format angelehnt an
[Keep a Changelog](https://keepachangelog.com/de/), Versionierung nach [SemVer](https://semver.org/lang/de/).

## [1.8.0] – 2026-07-16

### Fixed
- Triple-Bull gesperrt (existiert auf dem Board nicht; zeigte zuvor „T16.67")
- Undo-Race während des Auto-Complete-Timers (Wurf ging verloren)
- Stale-State im localStorage nach Undo auf null Darts
- Ziel-Dropdown-Desync nach State-Wiederherstellung
- `JSON.parse` des gespeicherten Wurfs abgesichert
- Doppelte Event-Listener auf der Statistik-Seite

### Added
- Echte PWA: `manifest.json`, Service Worker (offline + Auto-Update), Icon
- JSON-Export-Button auf der Daten-Seite
- Fehlende Wurf-Kategorie 1–59 (Kategorien jetzt lückenlos)
- Unit-Tests für die Statistik-Logik (`node --test`)
- CI/CD: Tests + HTML-Validierung, Pages-Deploy mit Test-Gate, Tag-basierte Releases
- SEO-Metadaten, Repo-Beschreibung und Topics

### Changed
- Accessibility: Zoom erlaubt, aria-Labels/aria-live, h1 pro Seite,
  44-px-Touch-Targets, Genauigkeits-Bewertung als Farbe **und** Text
- Ehrliche Kategorie-Labels (60–79 statt „60+")
- Genauigkeit pro Position basiert auf tatsächlich geworfenen Darts
- Dateien umbenannt: `app.js`→`shared.js`, `statistics.js`→`stats.js`, `data-management.js`→`data.js`
- README neu geschrieben, LICENSE-Copyright korrigiert
- Externe PRs werden automatisch geschlossen (Fork statt PR)

### Removed
- Toter Code: `stats-backup.html`, `clearAllData`, `removeLastThrow`

## [1.7.0] – 2025-12-04
- Persistente Ziel-Auswahl (localStorage) und Dart-Eingaben-Persistenz bei App-Wechsel/Reload
- Smart Data-Liste: automatische Auffüllung nach Löschung; Punktzahl aus Data-Ansicht entfernt
- Navigation bereinigt (nur Bottom-Navigation), Stats-Kennzahlen-Fixes (ID-Konflikte, Doppelzählung)
- Hit%-Berechnung auf Basis tatsächlich geworfener Darts

## [1.6.0] – 2025-12-04
- Kompakte 3er-Grid-Statistik (Darts | Würfe | Hit%), Kategorien als Liste
- „Letzte 10 Würfe" umstrukturiert: Dart-Typen im 4er-Grid, Genauigkeit pro Position integriert
- Auto-Refresh bei Seitenwechsel/Fokus, Popups entfernt

## [1.5.0] – 2025-12-04
- Bottom-Tab-Navigation, kompaktere Tabs, harmonische Button-Farben
- Gesamtstatistik („Gesamt: X Würfe") in der Daten-Seite

## [1.4.0] – 2025-12-04
- Tab-Navigation (Play | Stats | Data) ersetzt Header, Zurück-Button in „Aktueller Wurf"

## [1.3.0] – 2025-12-04
- Daten-Seite (data.html) mit Einzelwurf-Löschung; Komplett-Löschung entfernt
- Zurück-Button wirkt nur auf Eingaben, nie auf gespeicherte Würfe

## [1.2.0] – 2025-12-04
- UI-Feinschliff: kompaktere Historie/Wurf-Display, Trainingsziel inline, Popups entfernt

## [1.1.0] – 2025-12-04
- Dropdown-Zielauswahl, vereinfachter Wurf-Display („- / - / -"), Clean Button-Design

## [1.0.0] – 2025-12-04
- Initial Release: Wurf-Eingabe mit IndexedDB, Statistiken, mobiles Dark-UI
