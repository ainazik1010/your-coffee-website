# Anfragen → Google Sheet + E-Mail

`Code.gs` ist ein fertiges Google-Apps-Script. Einmal eingerichtet, landet
jede Anfrage vom Formular auf yourcoffee24.de automatisch als neue Zeile in
der Google-Tabelle — und gleichzeitig als E-Mail bei info@yourcoffee24.de.

**Wichtig:** Dieses Skript muss über **Erweiterungen → Apps Script direkt in
der Google-Tabelle** erstellt werden (nicht als eigenständiges Projekt auf
script.google.com). Nur so weiß das Skript automatisch, in welche Tabelle es
schreiben soll — und es gibt keine Verwechslungsgefahr zwischen zwei
Google-Konten.

Kurzanleitung siehe Chat. Nach dem Deploy die `/exec`-URL im Chat schicken —
der Rest (Eintragen in `assets/js/main.js`) wird dann erledigt.

## Testen nach der Einrichtung

Die `/exec`-URL im Browser öffnen → es sollte stehen:
„Your Coffee – Formular-Endpunkt ist aktiv.“

Erscheint stattdessen eine Google-Fehlerseite, war ein Schritt beim Deploy
falsch (meist: „Wer hat Zugriff“ steht nicht auf „Jeder“).

## Wenn sich später etwas ändert

- **Andere Empfänger-E-Mail:** in `Code.gs` die Zeile `NOTIFY_EMAIL` ändern.
- **Neues Deployment nötig** ist nur, wenn sich die URL ändern soll. Reine
  Code-Änderungen in `Code.gs` über „Bereitstellen → Bereitstellungen verwalten
  → Bearbeiten (Stift-Symbol) → Version: Neu → Bereitstellen“ übernehmen,
  ohne dass sich die URL ändert.
