# Hero-Video

Der Hero läuft aktuell **ohne Videodatei**: Das echte Stationsfoto wird kinematisch
inszeniert (langsamer Zoom, warmes Licht, aufsteigender Dampf, Filmkorn).

## Eigenes Video einsetzen

1. Videodatei in diesen Ordner legen, z. B. `station.mp4`.
2. In `assets/js/main.js` ganz oben den Wert ändern:

```js
var HERO_VIDEO = 'assets/video/station.mp4';
```

Fertig. Sobald das Video abspielbar ist, blendet es sich über das Standbild.
Klappt das Autoplay nicht (manche Browser blockieren es), bleibt automatisch
die kinematische Standbild-Version stehen — die Seite sieht nie leer aus.

## Was gut funktioniert

- **Länge:** 8–15 Sekunden, nahtlos loopend
- **Format:** MP4 (H.264), zusätzlich gern WebM
- **Auflösung:** 1920×1080, quer
- **Dateigröße:** unter 6 MB — sonst lädt die Seite auf dem Handy zu langsam
- **Ton:** keiner nötig, das Video läuft stumm

## Motivvorschläge

- Jemand hält den Becher unter den Auslauf, Kaffee läuft ein (Nahaufnahme, flache Tiefenschärfe)
- Hand tippt auf das Touchdisplay, Karte wird aufgelegt
- Studierende gehen im Flur an der Station vorbei, eine Person bleibt stehen
- Dampf über einer frisch gefüllten Tasse vor dem beleuchteten Schriftzug

Dunkel und warm gefilmt passt am besten zum Farbschema der Seite. Da große Schrift
über dem Video liegt, sollte das Motiv **nicht mittig scharf und kontrastreich** sein —
seitlich, unscharf oder abgedunkelt wirkt besser.
