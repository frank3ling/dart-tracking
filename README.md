# Dart Training App

Eine mobile Web-App zum Tracken von Dart-Würfen mit detaillierten Statistiken.

## 🎯 Features

- **Mobile-optimiert** für Pixel 7a mit Chrome
- **Offline-fähig** - funktioniert ohne Internet
- **IndexedDB** für dauerhafte Datenspeicherung
- **Dunkles Design** mit touch-optimierten Buttons
- **Live-Tracking** von Single/Double/Triple/Miss
- **Detaillierte Statistiken** mit Kategorien und Genauigkeit
- **Rückgängig-Funktion** für Korrekturen

## 📱 Screenshots

### Eingabe-Seite
- Zielauswahl (1-20, 25)
- 3-Dart Wurf-Display
- 4 quadratische Input-Buttons
- Historie der letzten Würfe

### Statistik-Seite  
- Gesamtstatistiken (Darts, Würfe, Ø Punkte)
- Wurf-Kategorien (0, 60+, 80+, 100+, 140+, 180)
- Letzte 10 Würfe Analyse
- Genauigkeit pro Pfeil-Position

## 🚀 Installation

1. Repository klonen:
```bash
git clone [repository-url]
cd dart-app-1
```

2. `index.html` in Chrome Mobile öffnen
3. Optional: Als PWA zum Homescreen hinzufügen

## 💻 Technische Details

### Dateien
- `index.html` - Eingabe-Seite
- `stats.html` - Statistik-Seite
- `styles.css` - Shared CSS Styling
- `app.js` - Database & Utilities
- `input.js` - Eingabe-Logik
- `statistics.js` - Statistik-Berechnungen

### Browser-Unterstützung
- **Primary:** Chrome Mobile (vollständig)
- **Secondary:** Firefox Mobile (eingeschränkt)
- **Requirements:** IndexedDB Support

### Datenstruktur
```javascript
{
  id: "uuid",
  target: 20,
  darts: [
    {type: "single", hit: true, points: 20},
    {type: "miss", hit: false, points: 0},
    {type: "double", hit: true, points: 40}
  ],
  totalPoints: 60,
  timestamp: "2025-12-04T10:30:00.000Z"
}
```

## 📊 Statistiken

### Wurf-Kategorien
- **0 Punkte:** Kompletter Fehlwurf
- **60-79:** Gute Würfe  
- **80-99:** Sehr gute Würfe
- **100-139:** Exzellente Würfe
- **140-179:** Professionelle Würfe
- **180:** Maximum (Triple 20)

### Genauigkeitsmessung
- **Gesamttrefferquote:** % aller getroffenen Darts
- **Pro Position:** Trefferquote für 1./2./3. Dart
- **Farbcodierung:** Grün (>80%), Orange (60-80%), Rot (<60%)

## 🛠️ Entwicklung

### Features hinzufügen
1. Feature in `/docs/features/` spezifizieren
2. PO ChatMode für Requirements nutzen
3. Code implementieren
4. Tests durchführen

### Code-Prinzipien
- **KISS:** Keep It Simple, Stupid
- **DRY:** Don't Repeat Yourself  
- **Mobile First:** Touch-optimiert
- **Performance:** Schnelle Response-Zeiten

## 📝 Changelog

### v1.0.0 (2025-12-04)
- Initial Release
- Grundlegende Wurf-Eingabe
- IndexedDB Speicherung
- Vollständige Statistiken
- Mobile-optimiertes UI
- Offline-Funktionalität

## 📄 Lizenz

MIT License - Siehe [LICENSE](LICENSE) für Details.

## 🤝 Beitragen

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Changes committen (`git commit -m 'Add: Amazing Feature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request öffnen

## 📞 Support

Bei Fragen oder Problemen:
- Issues auf GitHub erstellen
- [Dokumentation](/docs/) durchlesen
- [Feature-Requests](/docs/features/) einreichen

---

**Entwickelt für Dart-Enthusiasten 🎯**