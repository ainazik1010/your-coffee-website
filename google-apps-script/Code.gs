/**
 * Your Coffee — Formular-Endpunkt
 *
 * Was das hier macht:
 * 1. Jede Anfrage vom Formular auf yourcoffee24.de landet als neue Zeile
 *    in diesem Google Sheet.
 * 2. Gleichzeitig verschickt es automatisch eine E-Mail an info@yourcoffee24.de
 *    mit denselben Angaben.
 *
 * Einrichtung: siehe Anleitung im Chat / in google-apps-script/README.md.
 * Danach hier nichts mehr ändern nötig — einfach laufen lassen.
 */

var NOTIFY_EMAIL = 'info@yourcoffee24.de';

var HEADER_ROW = [
  'Zeitstempel', 'Name', 'Einrichtung', 'E-Mail',
  'Telefon', 'Adresse', 'Frequenz', 'Nachricht'
];

function doPost(e) {
  // Wichtig: Dieses Skript muss über "Erweiterungen -> Apps Script" DIREKT
  // IN der Google-Tabelle erstellt worden sein (nicht als eigenes Projekt
  // auf script.google.com) — nur dann weiß getActiveSpreadsheet(), welche
  // Tabelle gemeint ist.
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER_ROW);
    sheet.getRange(1, 1, 1, HEADER_ROW.length).setFontWeight('bold');
  }

  var p = (e && e.parameter) || {};

  sheet.appendRow([
    new Date(),
    p.name || '',
    p.org || '',
    p.mail || '',
    p.tel || '',
    p.adresse || '',
    p.freq || '',
    p.msg || ''
  ]);

  var subject = 'Neue Standortanfrage – ' + (p.org || p.name || 'Your Coffee');
  var body = [
    'Neue Anfrage über yourcoffee24.de',
    '',
    'Name:        ' + (p.name || '—'),
    'Einrichtung: ' + (p.org || '—'),
    'E-Mail:      ' + (p.mail || '—'),
    'Telefon:     ' + (p.tel || '—'),
    'Adresse:     ' + (p.adresse || '—'),
    'Frequenz:    ' + (p.freq || '—'),
    '',
    'Nachricht:',
    (p.msg || '—'),
    '',
    'Alle Anfragen in der Tabelle: ' + ss.getUrl()
  ].join('\n');

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: p.mail || NOTIFY_EMAIL,
    subject: subject,
    body: body
  });

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Zum Testen: Diese URL im Browser öffnen sollte diesen Text zeigen. */
function doGet(e) {
  return ContentService.createTextOutput('Your Coffee – Formular-Endpunkt ist aktiv.');
}
