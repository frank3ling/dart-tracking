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

### Daten-Management (v1.3)

#### Neue Daten-Seite
1. **GIVEN** Benutzer möchte Daten verwalten
   **WHEN** "Daten" Button im Header geklickt wird
   **THEN** Separate Seite (data.html) für Datenverwaltung öffnet sich

#### Einzelwurf-Löschung
2. **GIVEN** Letzte 10 Würfe werden angezeigt
   **WHEN** "✕" Button neben einem Wurf geklickt wird  
   **THEN** Dieser spezifische Wurf wird nach Bestätigung aus IndexedDB gelöscht

#### Alle-Daten-Löschen verschoben
3. **GIVEN** Alle Daten sollen gelöscht werden
   **WHEN** Funktion aufgerufen wird
   **THEN** Doppelte Sicherheitsabfrage mit Text-Eingabe "ALLES LÖSCHEN"

#### Navigation erweitert
4. **GIVEN** Benutzer navigiert zwischen Seiten
   **WHEN** Header betrachtet wird
   **THEN** Alle drei Hauptbereiche sind erreichbar: Training | Statistiken | Daten

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
│ HEADER              │ ← Titel, Navigation (Statistiken|Daten), Zurück-Icon
├─────────────────────┤
│   Aktueller Wurf    │ ← Vereinfachter Display
│     - / - / -       │   Format: Dart1/Dart2/Dart3 (kompakt)
├─────────────────────┤
│  ┌──────┐ ┌──────┐  │ ← Single, Double (2x2 Grid)
│  │Single│ │Double│  │   Clean Labels ohne Punkte
│  ├──────┤ ├──────┤  │
│  │Triple│ │ Miss │  │
│  └──────┘ └──────┘  │
├─────────────────────┤
│     Historie         │ ← Letzte 3 Würfe (kompakt)
│  20 / 0 / D20       │   Format mit Leerzeichen
│  01.01.25           │
├─────────────────────┤
│   Trainingsziel      │ ← Dropdown inline
│  [Aktuelles Ziel: 20▼]│
└─────────────────────┘
```

#### Statistik-Seite (stats.html)  
- Gesamtstatistiken & Kategorien
- Navigation: ← Zurück | Daten

#### Daten-Seite (data.html)
```
┌─────────────────────┐
│ HEADER              │ ← Titel, Navigation (← Zurück|Statistiken)
├─────────────────────┤
│  Letzte 10 Würfe    │ ← Historie mit Lösch-Option
│  20 / 0 / D20  [✕]  │   Einzelne Würfe löschbar
│  60p • 01.01.25     │
├─────────────────────┤
│ ⚠️ Alle Daten löschen│ ← Danger Zone
│ [🗑️ Unwiderruflich]  │   Doppelte Sicherheitsabfrage
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

---

## 📋 Definition of Done

### Entwicklung
- [x] Zwei separate HTML-Seiten (Eingabe + Statistik)
- [x] Responsive Design für Pixel 7a
- [x] Dunkles Farbschema implementiert
- [x] IndexedDB Integration
- [x] Offline-Funktionalität
- [x] Touch-optimierte UI

### Funktionalität
- [x] Zielauswahl (1-20, 25)
- [x] 4-Button Eingabe (Single/Double/Triple/Miss)
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