# Your Coffee — Website

Marketing website for self-service coffee stations in universities, offices, and public
buildings in Berlin and Potsdam. Static HTML/CSS/JavaScript, no framework and no build step.

## Features

- Landing page presenting the product, benefits, and a location overview
- Contact form that submits inquiries to a Google Sheet via a Google Apps Script
- Imprint and privacy policy compliant with German law
- Custom CSS design system (`assets/css/style.css`), no external UI libraries

## Tech

```
index.html                Home page
impressum.html              Imprint
datenschutz.html            Privacy policy
assets/css/style.css        Design system
assets/js/main.js           Form logic, interactions
google-apps-script/         Backend script for the form integration
```

Local preview:

```bash
python3 -m http.server 8080
```
