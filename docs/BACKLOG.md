# Backlog

Ideen und offene Punkte, die (noch) kein spezifiziertes Feature sind.
Umsetzungsreife Features werden als Spezifikation nach [features/](features/) überführt.

## Produkt-Ideen

### JSON-Import (Backup wiederherstellen)
Gegenstück zum bestehenden Export auf der Daten-Seite. Ohne Import ist ein
Gerätewechsel oder eine Wiederherstellung nach Browser-Datenlöschung nicht möglich —
aktuell der fehlende Baustein im Backup-Konzept.
- Datei-Auswahl → Validierung des Export-Formats → Einspielen in IndexedDB
- Strategie klären: ersetzen vs. zusammenführen (Duplikate über `id`)

### Trend-Statistik über Zeit
Der Kern-KPI aus der Spec („Verbesserung der Trefferquote über Zeit") ist bisher
nicht messbar. Trefferquote/Punkteschnitt pro Tag oder Session als einfacher
Verlauf (Liste oder Chart) auf der Statistik-Seite.

### Ziel-Typ beim Training (z. B. T20 vs. Single 20)
„Hit" ist aktuell zu grob: Wer auf Triple 20 trainiert und Single 20 trifft,
zählt als Treffer. Ein wählbarer Ziel-Typ (Single/Double/Triple) würde die
Trefferquote erst wirklich aussagekräftig machen.

### Sessions
Würfe zu Trainingseinheiten gruppieren (Start/Ende oder Zeitfenster-Heuristik).
Voraussetzung für sinnvolle Trend-Statistik und Session-Vergleiche.

## Repo & Doku

### Screenshots im README
Echte App-Screenshots (Play/Statistik/Daten, Mobile-Viewport) — das wichtigste
fehlende Element für die GitHub-Präsentation.

### Feature-Spec umstrukturieren
`features/feature-001` ist als rückwärtslaufendes Changelog (v1.7 → v1.0)
organisiert. Besser: eine „Current State"-Spezifikation + separates Changelog.
