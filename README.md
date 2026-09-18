# Your Coffee — Website

Marketing-Website für Self-Service-Kaffeestationen in Universitäten, Büros und
öffentlichen Gebäuden in Berlin und Potsdam. Statisches HTML/CSS/JavaScript ohne
Framework und ohne Build-Schritt.

## Funktionen

- Landingpage mit Vorstellung des Produkts, Vorteilen und Standortübersicht
- Kontaktformular, das Anfragen über ein Google Apps Script in ein Google Sheet schreibt
- Impressum und Datenschutzerklärung nach deutschem Recht
- Eigenes CSS-Design-System (`assets/css/style.css`), keine externen UI-Bibliotheken

## Technik

```
index.html                Startseite
impressum.html             Impressum
datenschutz.html           Datenschutzerklärung
assets/css/style.css       Design-System
assets/js/main.js          Formular-Logik, Interaktionen
google-apps-script/        Backend-Skript für die Formular-Anbindung
```

Lokal ansehen:

```bash
python3 -m http.server 8080
```
