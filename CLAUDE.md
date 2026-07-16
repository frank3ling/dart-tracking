# Dart Training Tracker

Mobile-first PWA zum Tracken von Dart-Trainingswürfen. Reines HTML/CSS/JavaScript —
**kein Build-Schritt, keine Runtime-Dependencies** (bewusste Entscheidung, beibehalten).

## Struktur

- `index.html` + `input.js` — Wurf-Eingabe (Spiel)
- `stats.html` + `stats.js` — Statistiken
- `data.html` + `data.js` — Datenverwaltung & JSON-Export
- `shared.js` — IndexedDB-Layer (`DartDB`), Utilities, `calculateStatistics` (pure, getestet)
- `sw.js` + `manifest.json` — PWA; Service Worker ist Network-First (Auto-Update der Page)
- `docs/BACKLOG.md` — Ideen; `docs/features/` — spezifizierte Features

## Kommandos

```bash
node --test 'tests/*.test.js'                          # Unit-Tests
npx --yes html-validate index.html stats.html data.html  # HTML-Validierung
npx serve .                                            # Lokaler Dev-Server
```

## Domänen-Regeln

- Ein **Wurf** (throw) = 3 **Darts**. `totalThrows` ≠ `totalDarts`.
- Wurf-Kategorien sind lückenlose Punktebänder: 0, 1–59, 60–79, 80–99, 100–139, 140–179, 180.
- Bull (25) hat kein Triple — der Triple-Button ist bei Ziel 25 gesperrt.
- Alle Daten bleiben lokal im Browser (IndexedDB). Kein Server, keine Accounts.

## Release-Prozess

1. `CHANGELOG.md` ergänzen
2. `CACHE_VERSION` in `sw.js` auf den neuen Tag setzen (z. B. `v1.9.0`) —
   der Release-Workflow bricht ab, wenn Version und Tag nicht übereinstimmen
3. Committen, pushen, taggen: `git tag -a v1.9.0 -m "..." && git push origin v1.9.0`
4. Pipeline erledigt den Rest (Tests → GitHub Release; Pages deployt bei jedem master-Push)

## Repo-Policies

- **Keine externen PRs** — werden automatisch geschlossen (`close-prs.yml`);
  Ausnahme: Dependabot-Update-PRs bleiben offen
- Commits unter der GitHub-Identität `frank3ling` (noreply-E-Mail, repo-lokal konfiguriert)
- Direkte Pushes auf `master` sind gewollt; das Test-Gate sitzt im Deploy-Workflow
