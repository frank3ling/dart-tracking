# Feature #001: Dart Training App - Wurf-Tracking & Statistiken

**Status:** Approved  
**Priorität:** High  
**Epic:** Core  
**Estimated Effort:** L  
**Erstellt am:** 2025-12-04  
**Erstellt von:** Frank  
**Zielgerät:** Pixel 7a mit Chrome  

---

## 📝 Übersicht

### User Story
Als **Dart-Spieler**  
möchte ich **meine Trainingswürfe digital erfassen und auswerten**,  
um **meine Treffgenauigkeit systematisch zu verbessern**.

### Business Value
- **Problem:** Manuelles Tracking von Dart-Würfen ist unpraktisch und fehleranfällig
- **Lösung:** Mobile Web-App für einfache Eingabe und detaillierte Statistiken
- **Nutzen:** Objektive Leistungsmessung und Trainingsoptimierung
- **KPIs:** Anzahl getrackte Würfe, Verbesserung der Trefferquote über Zeit

---

## 🎯 Anforderungen

### Session-Management & UX-Fixes (v1.7)

#### Persistente Ziel-Auswahl
1. **GIVEN** Benutzer wählt ein Trainingsziel
   **WHEN** Browser-Reload erfolgt
   **THEN** Ausgewähltes Ziel bleibt erhalten (localStorage)

#### Dart-Eingaben Persistenz
2. **GIVEN** Benutzer hat Darts eingegeben aber Wurf nicht beendet
   **WHEN** App-Wechsel oder Reload erfolgt
   **THEN** Eingegebene Darts werden wiederhergestellt

#### Smart Data-Liste
3. **GIVEN** Eintrag in Data-Tab wird gelöscht
   **WHEN** Liste aktualisiert wird
   **THEN** Automatische Auffüllung auf 10 Einträge (wenn verfügbar)

#### Vereinfachte Data-Darstellung
4. **GIVEN** Data-Tab Historie wird betrachtet
   **WHEN** Einträge angezeigt werden
   **THEN** Nur Dart-Ergebnisse und Zeitstempel, keine Punktzahl

#### Navigation & Stats-Fixes
5. **GIVEN** Play-Seite wird verwendet
   **WHEN** Bottom-Navigation betrachtet wird
   **THEN** Kein Content-Überlappung und vollständig sichtbares Dropdown

6. **GIVEN** Stats-Seite wird geladen
   **WHEN** Kennzahlen berechnet werden
   **THEN** Alle Statistiken werden korrekt angezeigt (HTML-ID-Konflikte behoben)

#### Korrekte Stats-Berechnungen
7. **GIVEN** Wurf-Kategorien werden berechnet
   **WHEN** 100+ und 140+ Kategorien ausgewertet werden
   **THEN** Keine doppelte Zählung (100+ = nur 100-139, nicht 140+)

8. **GIVEN** Hit%-Berechnungen erfolgen
   **WHEN** Unvollständige Würfe vorhanden sind
   **THEN** Nur tatsächlich geworfene Darts werden gezählt (nicht pauschal 3 pro Wurf)

#### Navigation-Struktur Bereinigung
9. **GIVEN** Play-Seite wird verwendet
   **WHEN** Navigation betrachtet wird
   **THEN** Nur Bottom-Navigation (keine doppelte Top/Bottom-Navigation)

### Stats-Optimierung (v1.6)

#### Kompakte Statistik-Darstellung
1. **GIVEN** Stats-Seite wird betrachtet
   **WHEN** Gesamtstatistik angezeigt wird
   **THEN** 3er-Grid: Darts | Würfe | Hit% (statt Trefferquote)

2. **GIVEN** Wurf-Kategorien werden angezeigt
   **WHEN** Liste betrachtet wird
   **THEN** Kompakte Darstellung als Liste mit Labels: 0, 60+, 80+, 100+, 140+, 180

#### Umstrukturierte "Letzte 10 Würfe"
3. **GIVEN** Letzte 10 Würfe Sektion wird betrachtet
   **WHEN** Dart-Types angezeigt werden
   **THEN** Single/Double/Triple/Miss in 4er-Grid (eine Zeile)

4. **GIVEN** Wurf-Ergebnisse werden angezeigt
   **WHEN** Liste betrachtet wird
   **THEN** 0/100+/140+/180 als kompakte Liste darunter

5. **GIVEN** Genauigkeit nach Pfeil-Position wird betrachtet
   **WHEN** Sektion angezeigt wird
   **THEN** Integration in "Letzte 10 Würfe" als dritter Bereich

#### Einheitliche Listenhöhen
6. **GIVEN** Beide Listen werden betrachtet
   **WHEN** Zeilenhöhen verglichen werden
   **THEN** Identische Proportionen für visuellen Zusammenhang

#### Popup-freie Oberfläche
7. **GIVEN** Stats-Seite wird verwendet
   **WHEN** Aktionen ausgeführt werden
   **THEN** Keine störenden Popup-Nachrichten mehr

#### Auto-Refresh & Content-Fix
8. **GIVEN** Stats-Seite wird geladen oder fokussiert
   **WHEN** Seitenwechsel stattfindet
   **THEN** Statistiken aktualisieren sich automatisch

9. **GIVEN** Bottom-Navigation wird verwendet
   **WHEN** Content betrachtet wird
   **THEN** Kein verdeckter Inhalt durch besseres Padding (100px)

### Bottom Navigation & Design (v1.5)

#### Bottom Tab-Navigation
1. **GIVEN** Benutzer navigiert zwischen App-Bereichen
   **WHEN** Tab-Navigation betrachtet wird
   **THEN** Navigation ist am unteren Bildschirmrand fixiert

2. **GIVEN** Navigation am Bottom positioniert
   **WHEN** App verwendet wird
   **THEN** Mehr Content-Bereich verfügbar, kompaktere Tab-Höhe

#### Harmonische Button-Farben
3. **GIVEN** Dart-Eingabe Buttons werden betrachtet
   **WHEN** Single/Double/Triple Buttons angezeigt werden
   **THEN** Dezentes Grau (#5a5a5a) für einheitliches Design

4. **GIVEN** Miss-Button wird betrachtet
   **WHEN** Button angezeigt wird
   **THEN** Sanftes Rot (#a85a5a) hebt sich ab, aber nicht zu kräftig

#### Gesamtstatistik in Daten-Tab
5. **GIVEN** Daten-Seite wird betrachtet
   **WHEN** Unter Historie gescrollt wird
   **THEN** "Gesamt: X Würfe" Summary angezeigt

### Tab-Navigation (v1.4)

#### Moderne Tab-Navigation
1. **GIVEN** Benutzer navigiert zwischen App-Bereichen
   **WHEN** Tab-Navigation betrachtet wird
   **THEN** 3 Tabs verfügbar: Play 🎯 | Stats 📊 | Data 🗂️

2. **GIVEN** Benutzer ist auf einer Seite
   **WHEN** Tab betrachtet wird
   **THEN** Aktiver Tab hat blaue Unterline + blaue Schrift

#### Zurück-Button repositioniert
3. **GIVEN** Benutzer macht Dart-Eingabefehler
   **WHEN** Aktueller Wurf Sektion betrachtet wird
   **THEN** Zurück-Button (↶) rechts neben Überschrift positioniert

4. **GIVEN** Button im Kontext der Dart-Eingabe
   **WHEN** Benutzer interagiert
   **THEN** Nur letzte Dart-Eingabe wird zurückgesetzt, nie DB-Daten

### Daten-Management (v1.3)

#### Neue Daten-Seite
1. **GIVEN** Benutzer möchte Daten verwalten
   **WHEN** "Daten" Button im Header geklickt wird
   **THEN** Separate Seite (data.html) für Datenverwaltung öffnet sich

#### Einzelwurf-Löschung
2. **GIVEN** Letzte 10 Würfe werden angezeigt
   **WHEN** "✕" Button neben einem Wurf geklickt wird  
   **THEN** Dieser spezifische Wurf wird nach Bestätigung aus IndexedDB gelöscht

#### Alle-Daten-Löschen entfernt
3. **GIVEN** Daten-Seite wird betrachtet
   **WHEN** Benutzer sucht Lösch-Optionen
   **THEN** Nur individuelle Wurf-Löschung verfügbar, keine Komplett-Löschung

#### Navigation erweitert
4. **GIVEN** Benutzer navigiert zwischen Seiten
   **WHEN** Tab-Navigation betrachtet wird
   **THEN** Alle drei Hauptbereiche sind per Tabs erreichbar

#### Zurück-Button optimiert
5. **GIVEN** Benutzer macht Eingabefehler
   **WHEN** Zurück-Button (↶) geklickt wird
   **THEN** Nur letzter Dart wird entfernt, nie gespeicherte Würfe aus DB

#### Ladeverhalten behoben
6. **GIVEN** App wird neu geladen
   **WHEN** Seite öffnet
   **THEN** Historie zeigt sofort letzte Würfe (await loadRecentThrows)

### UI-Feinschliff (v1.2)

#### Popup-Nachrichten entfernt
1. **GIVEN** Benutzer führt Aktionen aus  
   **WHEN** Wurf gespeichert oder Dart rückgängig gemacht wird
   **THEN** Keine störenden Popup-Nachrichten, die Layout verschieben

#### Kompakte Historie & Wurf-Display
2. **GIVEN** Historie/Wurf-Display wird angezeigt
   **WHEN** Benutzer betrachtet Interface
   **THEN** Kompaktere Darstellung: "20 / D20 / 0" + 10% kleinere Schrift

#### Inline Trainingsziel  
3. **GIVEN** Trainingsziel-Sektion wird angezeigt
   **WHEN** Auf Pixel 7a betrachtet
   **THEN** Label und Dropdown in einer Zeile nebeneinander

### UI-Verbesserungen (v1.1)

#### Zielauswahl-Optimierung
1. **GIVEN** Benutzer öffnet App
   **WHEN** Zielauswahl benötigt wird
   **THEN** Dropdown im Header spart Platz und ist schnell erreichbar

2. **GIVEN** Dropdown ist geöffnet
   **WHEN** Benutzer wählt neues Ziel
   **THEN** Ziel wird sofort aktiv und Dropdown schließt sich

#### Vereinfachter Wurf-Display
3. **GIVEN** Benutzer gibt Darts ein
   **WHEN** Wurf-Status angezeigt wird
   **THEN** Format "- / - / -" zeigt kompakt alle 3 Darts
   
4. **GIVEN** Dart wurde eingegeben
   **WHEN** Display aktualisiert wird  
   **THEN** Format zeigt "T20 / - / -" (T=Triple, D=Double, 0=Miss, B=Bull)

#### Clean Button-Design
5. **GIVEN** Eingabe-Buttons werden angezeigt
   **WHEN** Benutzer sieht Interface
   **THEN** Nur "Single/Double/Triple/Miss" ohne Punkte-Anzeige für sauberes Design
1. **GIVEN** App ist geöffnet  
   **WHEN** User wählt Trainingsziel (1-20, 25)  
   **THEN** Ziel wird gesetzt und Eingabe aktiviert

2. **GIVEN** Trainingsziel ist gesetzt  
   **WHEN** User klickt Single/Double/Triple/Miss für einen Dart  
   **THEN** Ergebnis wird gespeichert und nächster Dart aktiviert

3. **GIVEN** 3 Darts sind eingegeben  
   **WHEN** User bestätigt oder automatisch nach 3. Dart  
   **THEN** Wurf wird in IndexedDB gespeichert

#### Feedback & Historie
4. **GIVEN** Darts werden eingegeben  
   **WHEN** Eingabe erfolgt  
   **THEN** Aktueller Wurf-Status wird live angezeigt (Pfeil 1/2/3)

5. **GIVEN** Würfe sind gespeichert  
   **WHEN** User betrachtet Historie  
   **THEN** Letzten 3 Würfe mit Zeitstempel werden angezeigt

6. **GIVEN** User möchte Korrektur  
   **WHEN** "Letzten Dart zurücksetzen" gedrückt  
   **THEN** Letzter Dart wird rückgängig gemacht

#### Statistiken
7. **GIVEN** Daten sind vorhanden  
   **WHEN** User öffnet Statistik-Seite  
   **THEN** Gesamtstatistiken werden angezeigt:
   - Gesamtzahl Darts & Würfe
   - Wurf-Kategorien: 0, 60-79, 80-99, 100-139, 140-179, 180
   - Letzte 10 Würfe: 0, 100+, 140+, 180
   - Dart-Typen: Single/Double/Triple/Miss
   - Treffergenauigkeit gesamt und pro Dart-Position

### Nicht-funktionale Anforderungen
- **Performance:** App-Start < 2s, Eingabe-Response < 100ms
- **Usability:** Touch-optimiert für Pixel 7a, quadratische Buttons
- **Kompatibilität:** Chrome Mobile (primär), IndexedDB Support
- **Offline:** 100% offline funktional
- **Responsive:** Optimiert für 393x851px (Pixel 7a)

---

## 🎨 UI/UX Spezifikation

#### Layout-Struktur

#### Eingabe-Seite (index.html)
```
┌─────────────────────┐
│ Aktueller Wurf   ↶ │ ← Titel + Zurück-Button rechts
│     - / - / -       │   Vereinfachter Display
├─────────────────────┤
│  ┌──────┐ ┌──────┐  │ ← Single, Double (dezentes Grau)
│  │Single│ │Double│  │   Triple (dezent), Miss (sanft rot)
│  ├──────┤ ├──────┤  │
│  │Triple│ │ Miss │  │
│  └──────┘ └──────┘  │
├─────────────────────┤
│     Historie         │ ← Letzte 3 Würfe (kompakt)
│  20 / 0 / D20       │   Format mit Leerzeichen
│  01.01.25           │
├─────────────────────┤
│   Trainingsziel      │ ← Dropdown vollständig sichtbar
│  [Aktuelles Ziel: 20▼]│   Persistente Auswahl
├─────────────────────┤
│🎯Play│📊Stats│🗂️Data│ ← Bottom Navigation (konsistent mit anderen Seiten)
└─────────────────────┘
```

#### Statistik-Seite (stats.html)  
```
┌─────────────────────┐
│    Statistiken       │ ← Kompakte Gesamtstatistik
│ ┌─────┬─────┬─────┐  │ ← 3er-Grid: Darts|Würfe|Hit%
│ │ 12k │ 4.1k│ 78% │  │
│ └─────┴─────┴─────┘  │
│                     │
│ Wurf-Kategorien     │ ← Kompakte Liste
│ 0        ────── 23  │ ← Niedrigere Zeilen (6px padding)
│ 60+      ────── 45  │
│ 80+      ────── 12  │
│ 100+     ────── 8   │
│ 140+     ────── 2   │
│ 180      ────── 1   │
│                     │
│ Letzte 10 Würfe     │
│ ┌──┬──┬──┬────┐     │ ← 4er-Grid: Single|Double|Triple|Miss
│ │S │D │T │Miss│     │
│ └──┴──┴──┴────┘     │
│                     │
│ Wurf-Ergebnisse     │ ← Liste mit gleicher Zeilenhöhe
│ 0        ────── 2   │
│ 100+     ────── 4   │
│ 140+     ────── 1   │
│ 180      ────── 0   │
│                     │
│ Genauigkeit/Position │
├─────────────────────┤
│🎯Play│📊Stats│🗂️Data│ ← Bottom Navigation
└─────────────────────┘
```

#### Daten-Seite (data.html)
```
┌─────────────────────┐
│  Letzte 10 Würfe    │ ← Historie mit Lösch-Option
│  20 / 0 / D20  [✕]  │   Dart-Ergebnisse + Zeitstempel
│  04.12.25           │   (Punktzahl entfernt)
│                     │
│  Gesamt: 127 Würfe  │ ← Gesamtstatistik aus IndexedDB
├─────────────────────┤
│🎯Play│📊Stats│🗂️Data│ ← Bottom Navigation
└─────────────────────┘
```

#### Statistik-Seite (stats.html)
```
┌─────────────────────┐
│     HEADER          │ ← Titel, Navigation zurück
├─────────────────────┤
│  Gesamtstatistiken  │ ← Darts/Würfe gesamt
├─────────────────────┤
│   Wurf-Kategorien   │ ← 0, 60+, 80+, 100+, 140+, 180
├─────────────────────┤
│  Letzte 10 Würfe    │ ← Detailanalyse
├─────────────────────┤
│   Treffergenauigkeit │ ← % pro Dart-Position
└─────────────────────┘
```

### Farbschema (Dunkel)
- **Background:** #1a1a1a
- **Primary:** #3498db (Blau)
- **Secondary:** #e74c3c (Rot für Highlights)
- **Surface:** #2c2c2c
- **Text:** #ffffff / #cccccc
- **Accent:** #27ae60 (Grün für Erfolg)

### Touch-Optimierung
- **Button-Größe:** Minimum 48x48px
- **Touch-Targets:** Quadratische Buttons mit Padding
- **Spacing:** Ausreichend Abstand zwischen Elementen
- **Font-Size:** Lesbar auf 6.1" Display

---

## 🔧 Technische Spezifikation

### Datenmodell (IndexedDB)
```javascript
// Dart-Wurf Objekt
{
  id: "uuid-v4",
  target: 20,              // 1-20, 25
  darts: [                 // Array mit 3 Elementen
    {type: "single", hit: true, points: 20},
    {type: "miss", hit: false, points: 0},
    {type: "double", hit: true, points: 40}
  ],
  totalPoints: 60,
  timestamp: "2025-12-04T10:30:00.000Z",
  sessionId: "optional"
}

// Statistik-Berechnung (Runtime)
{
  totalDarts: 3000,
  totalThrows: 1000,
  categories: {
    zero: 50,
    sixtyPlus: 200,
    eightyPlus: 150,
    hundredPlus: 100,
    hundredFortyPlus: 30,
    oneEighty: 5
  },
  lastTenThrows: {...},
  accuracy: {
    overall: 0.75,
    byPosition: [0.80, 0.75, 0.70]  // Dart 1, 2, 3
  }
}
```

### IndexedDB Schema
```javascript
// Database: "DartTrainingDB", Version: 1
// Object Store: "throws"
// Index: "timestamp", "target"
```

### Dateien-Struktur
```
/
├── index.html              // Eingabe-Seite
├── stats.html              // Statistik-Seite  
├── data.html               // Daten-Management-Seite (neu v1.3)
├── styles.css              // Shared CSS
├── app.js                  // Database & Utils
├── input.js                // Eingabe-Logik
├── statistics.js           // Statistik-Berechnungen
└── data-management.js      // Datenverwaltung (neu v1.3)
```

### Changelog

#### v1.8.0 (2026-07-16) - Code-Review-Umsetzung, PWA & CI/CD
- Bugfixes: Triple-Bull gesperrt (existiert nicht), Undo-Race beim Auto-Complete,
  Stale-State nach Undo, Ziel-Dropdown-Desync, JSON.parse-Absicherung
- Wurf-Kategorien als lückenlose Bänder inkl. neuer 1–59-Kategorie,
  ehrliche Labels (60–79 statt 60+)
- Genauigkeit pro Position basiert auf tatsächlich geworfenen Darts
- Echte PWA: manifest.json, Service Worker (offline + Auto-Update), Icon
- Export-Button (JSON-Backup) auf der Daten-Seite
- Accessibility: Zoom erlaubt, aria-Labels/aria-live, h1 pro Seite,
  44px-Touch-Targets, Bewertung als Farbe + Text
- Dateien umbenannt: app.js→shared.js, statistics.js→stats.js, data-management.js→data.js
- Toter Code entfernt (stats-backup.html, clearAllData, removeLastThrow)
- Unit-Tests (node --test) für die Statistik-Logik
- GitHub Actions: CI, Pages-Deploy mit Test-Gate, Release-Workflow

#### v1.7.0 (2025-12-04) - Session-Management & UX-Fixes
- Persistente Ziel-Auswahl mit localStorage
- Dart-Eingaben Persistenz bei App-Wechsel/Reload
- Smart Data-Liste: Automatische Auffüllung nach Löschung
- Vereinfachte Data-Darstellung: Punktzahl entfernt
- Robustes Session-Management für Mobile-Nutzung
- Play-Seite Bottom-Navigation: Content-Überlappung behoben
- Stats-Seite Kennzahlen-Fix: HTML-ID-Konflikte behoben
- Dropdown vollständig sichtbar ohne Abschneiden
- Korrekte Stats-Berechnungen: 100+ Kategorie ohne Doppelzählung
- Hit%-Berechnung basiert auf tatsächlich geworfenen Darts
- Navigation-Struktur bereinigt: Play-Seite nur Bottom-Navigation
- Lokales CSS für Play-Seite: 130px Padding + 40px Trainingsziel-Margin

#### v1.6.0 (2025-12-04) - Stats-Optimierung
- Kompakte 3er-Grid Statistik: Darts | Würfe | Hit%
- Wurf-Kategorien als kompakte Liste mit neuen Labels (60+ statt 60-79)
- "Letzte 10 Würfe" umstrukturiert: Dart-Types in 4er-Grid
- Wurf-Ergebnisse (0/100+/140+/180) als einheitliche Liste
- Genauigkeit nach Pfeil-Position in "Letzte 10 Würfe" integriert
- Identische Zeilenhöhen für visuellen Zusammenhang
- Alle Popups aus Stats-Seite entfernt
- Doppelte Sektionen bereinigt
- Auto-Refresh bei Seitenwechsel und Fokus
- Bottom-Navigation Padding-Fix (100px) für vollständig sichtbaren Content
- Gesamtstatistik in Data-Tab als Info über IndexedDB-Umfang

#### v1.5.0 (2025-12-04) - Bottom Navigation & Design
- Tab-Navigation an den unteren Bildschirmrand verschoben
- Kompaktere Tab-Höhe (8px Padding statt 12px)
- Harmonische Button-Farben: Single/Double/Triple in dezentem Grau
- Miss-Button in sanftem Rot (nicht mehr kräftig)
- Gesamtstatistik "Gesamt: X Würfe" in Daten-Seite
- Mehr Content-Bereich durch Bottom-Navigation
- Mobile-First Design wie native Apps

#### v1.4.0 (2025-12-04) - Tab-Navigation
- Moderne Tab-Navigation ersetzt Header
- 3 Tabs: Play 🎯 | Stats 📊 | Data 🗂️
- Zurück-Button in "Aktueller Wurf" Sektion verschoben
- Sticky Navigation auf allen Seiten
- Material Design Tab-Layout mit Icons
- Responsive Design für Mobile

#### v1.3.0 (2025-12-04) - Daten-Management
- Neue Daten-Seite (data.html) für Datenverwaltung
- Einzelwurf-Löschung mit ✕ Button
- Alle-Daten-Löschen komplett entfernt
- Tab-Navigation System implementiert
- Zurück-Button nur für Dart-Eingaben (kein DB-Löschen)
- Smart Button-Zustand (disabled bei leerem Wurf)
- Ladeverhalten behoben (await loadRecentThrows)
- Popup-Nachrichten auf allen Seiten entfernt

#### v1.2.0 (2025-12-04) - UI-Feinschliff
- Popup-Nachrichten komplett entfernt (stabiles Layout)
- Historie kompakter: "20 / D20 / 0" mit Leerzeichen
- Trainingsziel inline auf Pixel 7a
- Wurf-Display 10% kleiner (bessere Proportionen)

#### v1.1.0 (2025-12-04) - UI-Verbesserungen  
- Dropdown für Zielauswahl (platzsparend)
- Vereinfachter Wurf-Display: "- / - / -"
- Clean Button-Design ohne Punkte-Anzeige
- Responsive Header-Layout

#### v1.0.0 (2025-12-04) - Initial Release
- Grundlegende Wurf-Eingabe mit IndexedDB
- Vollständige Statistiken mit Kategorien
- Mobile-optimiertes UI für Pixel 7a
- Offline-Funktionalität

---

## 📋 Definition of Done

### Entwicklung
- [x] Drei separate HTML-Seiten (Play/Stats/Data)
- [x] Bottom Tab-Navigation mit Material Design
- [x] Responsive Design für Pixel 7a
- [x] Harmonisches Farbschema (dezente Grautöne)
- [x] IndexedDB Integration
- [x] Offline-Funktionalität
- [x] Touch-optimierte UI

### Funktionalität
- [x] Zielauswahl (1-20, 25) per Dropdown
- [x] 4-Button Eingabe mit harmonischen Farben
- [x] Live Wurf-Tracking: "- / - / -" Format
- [x] Automatische Speicherung nach 3 Darts
- [x] Historie letzte Würfe mit Zeitstempel
- [x] Rückgängig-Funktion für einzelne Darts
- [x] Einzelwurf-Löschung in Daten-Seite
- [x] Bottom Tab-Navigation zwischen allen Bereichen
- [x] Gesamtstatistik "Gesamt: X Würfe" in Daten-Tab
- [x] Kompakte Stats-Darstellung mit optimierten Listen
- [x] Umstrukturierte "Letzte 10 Würfe" mit 4er-Grid und Liste
- [x] Genauigkeit nach Pfeil-Position in "Letzte 10 Würfe" integriert
- [x] Auto-Refresh für Stats bei Seitenwechsel
- [x] Content-Padding-Fix für Bottom-Navigation (100px)
- [x] Persistente Ziel-Auswahl (localStorage)
- [x] Dart-Eingaben Persistenz bei App-Wechsel
- [x] Smart Data-Liste mit automatischer Auffüllung
- [x] Vereinfachte Data-Darstellung ohne Punktzahl
- [x] Bottom-Navigation ohne Content-Überlappung auf allen Seiten
- [x] Stats-Kennzahlen Berechnung und Anzeige korrekt
- [x] Dropdown vollständig sichtbar und funktional
- [x] Mathematisch korrekte Statistik-Kategorien ohne Doppelzählung
- [x] Hit%-Berechnung basierend auf tatsächlichen Dart-Anzahlen
- [x] Konsistente Navigation-Struktur auf allen Seiten (nur Bottom-Navigation)
- [x] Lokales CSS für garantiert ausreichende Bottom-Abstände
- [x] Live-Feedback aktueller Wurf
- [x] Historie letzte 3 Würfe
- [x] Rückgängig-Funktion
- [x] Vollständige Statistiken

### Testing
- [x] Chrome Mobile auf Pixel 7a getestet
- [x] Touch-Bedienung validiert
- [x] Offline-Funktionalität geprüft
- [x] IndexedDB Persistierung bestätigt

### Performance
- [x] App-Start < 2s
- [x] Eingabe-Response < 100ms
- [x] Smooth Scrolling/Transitions

---

## 🔗 Dependencies

### Browser-APIs
- **IndexedDB:** Für lokale Datenspeicherung
- **Touch Events:** Für mobile Bedienung
- **Local Storage:** Fallback für Session-Daten

### Keine externen Dependencies
- Plain HTML/CSS/JavaScript
- Keine Frameworks/Libraries
- Keine Server-Kommunikation

---

## ⚠️ Constraints

### Technische Beschränkungen
- **Browser:** Chrome Mobile (Pixel 7a)
- **Storage:** Nur IndexedDB/LocalStorage
- **Offline:** Muss komplett ohne Internet funktionieren
- **Frameworks:** Keine externen Dependencies

### Design-Prinzipien
- **KISS:** Keep It Simple, Stupid
- **DRY:** Don't Repeat Yourself
- **Mobile First:** Optimiert für Touch-Bedienung
- **Performance First:** Schnelle Response-Zeiten

---

## 📊 Erfolgsmessung

### Primäre KPIs
- **Anzahl erfasste Würfe:** Nutzungsintensität
- **Session-Länge:** Engagement-Messung
- **Accuracy-Verbesserung:** Training-Erfolg

### Sekundäre Metriken
- **App-Performance:** Ladezeiten, Response-Times
- **Usability:** Touch-Erfolgsrate, Error-Rate
- **Data Persistence:** Verlustfreie Speicherung

---

*Spezifikation bereit für Implementierung - Start: 2025-12-04*