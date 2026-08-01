/* ============================================================
   YOUR COFFEE — Interaktion
   ============================================================ */
(function () {
  'use strict';

  /* ------------------------------------------------------------
     HERO-VIDEO
     Eigenes Video einsetzen: Datei nach assets/video/ legen und
     hier den Pfad eintragen, z. B. 'assets/video/station.mp4'.
     Bleibt der Wert null, läuft die kinematische Standbild-Version.
     ------------------------------------------------------------ */
  var HERO_VIDEO = null;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------
     FORMULAR-ENDPUNKT
     Nach der Einrichtung des Google-Skripts (siehe google-apps-script/)
     hier die "/exec"-URL der Bereitstellung eintragen. Solange das leer
     bleibt, öffnet das Formular wie bisher nur das E-Mail-Programm.
     ------------------------------------------------------------ */
  var FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwIPDm9JF2054lC5-JdgfWfOM00G37zyLaOt3ADXVM_1Gm4kLTulKUTZJu6cmZ20JXoiQ/exec';

  /* ---------------- Hero-Video ---------------- */
  (function heroVideo() {
    if (!HERO_VIDEO) return;
    var v = $('.hero__video');
    if (!v) return;
    v.src = HERO_VIDEO;
    v.poster = 'assets/img/station.jpg';
    v.hidden = false;
    v.addEventListener('canplay', function () {
      v.classList.add('is-live');
      var a = $('.hero__ambient'), s = $('.hero__subject');
      if (a) a.style.opacity = '0';
      if (s) s.style.opacity = '0';
    });
    var p = v.play();
    if (p && p.catch) p.catch(function () { /* Autoplay blockiert – Standbild bleibt */ });
  })();

  /* ---------------- Navigation ---------------- */
  (function nav() {
    var bar = $('#nav');
    var fill = $('.nav__progress i');
    var burger = $('.nav__burger');
    var menu = $('#mobile-menu');
    var links = $$('.nav__links a');
    var sections = links.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
    var ticking = false;

    function frame() {
      var y = window.scrollY;
      bar.classList.toggle('is-stuck', y > 40);

      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (fill) fill.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

      var mark = y + window.innerHeight * 0.35, active = -1;
      sections.forEach(function (s, i) { if (s.offsetTop <= mark) active = i; });
      links.forEach(function (a, i) { a.classList.toggle('is-current', i === active); });

      ticking = false;
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    frame();

    function setMenu(open) {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      menu.hidden = !open;
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); }
    });
  })();

  /* ---------------- Scroll-Reveal ---------------- */
  (function reveal() {
    var items = $$('.reveal');
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var siblings = $$('.reveal', e.target.parentElement);
        var idx = Math.max(0, siblings.indexOf(e.target));
        e.target.style.setProperty('--rd', Math.min(idx, 6) * 80 + 'ms');
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ---------------- Zahlen hochzählen ---------------- */
  (function counters() {
    var nums = $$('[data-count]');
    if (!nums.length) return;
    if (reduced || !('IntersectionObserver' in window)) return;

    function run(el) {
      var target = parseFloat(el.dataset.count);
      var dec = parseInt(el.dataset.decimals || '0', 10);
      var dur = 1400, t0 = performance.now();
      (function step(now) {
        var p = Math.min(1, (now - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = (target * eased).toFixed(dec);
        el.textContent = dec ? val.replace('.', ',') : Math.round(target * eased).toLocaleString('de-DE');
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  })();

  /* ---------------- Hotspots auf dem Stationsfoto ---------------- */
  (function hotspots() {
    var frame = $('.station__frame');
    if (!frame) return;
    var card = $('.hot__card', frame);
    var title = $('strong', card);
    var text = $('p', card);
    var spots = $$('.hot', frame);

    function close() {
      card.hidden = true;
      spots.forEach(function (s) { s.classList.remove('is-open'); s.setAttribute('aria-expanded', 'false'); });
    }
    spots.forEach(function (s, i) {
      s.type = 'button';
      s.setAttribute('aria-expanded', 'false');
      s.setAttribute('aria-label', s.dataset.title);
      s.addEventListener('click', function () {
        var wasOpen = s.classList.contains('is-open');
        close();
        if (wasOpen) return;
        title.textContent = s.dataset.title;
        text.textContent = s.dataset.text;
        card.hidden = false;
        s.classList.add('is-open');
        s.setAttribute('aria-expanded', 'true');
      });
    });
    $('.hot__close', card).addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    document.addEventListener('click', function (e) {
      if (!frame.contains(e.target)) close();
    });
  })();

  /* ---------------- Das bedienbare Display ---------------- */
  (function device() {
    var root = $('#device');
    if (!root) return;

    var screen = $('#screen', root);
    var views = {};
    $$('.screen__view', screen).forEach(function (v) { views[v.dataset.view] = v; });
    var stepTags = $$('.device__steps span', root);

    var slotDrink  = $('[data-slot="drink"]', screen);
    var slotDrink2 = $('[data-slot="drink2"]', screen);
    var slotMl     = $('[data-slot="ml"]', screen);
    var slotBar    = $('[data-slot="bar"]', screen);
    var slotPhase  = $('[data-slot="phase"]', screen);
    var fillGroup  = $('.cup__fill', screen);

    var COLORS = {
      espresso: '#3a2015', crema: '#c08a4a', milch: '#f1e6d4',
      schaum: '#fbf5ea',  wasser: '#93a7a2', schoko: '#472619'
    };
    var PHASE = {
      espresso: 'Brühen', crema: 'Brühen', milch: 'Milch erhitzen',
      schaum: 'Aufschäumen', wasser: 'Heißwasser', schoko: 'Schokolade dosieren'
    };

    var TOP = 32, BOTTOM = 120, SPAN = BOTTOM - TOP;
    var timers = [];
    var raf = null;
    var busy = false;

    function clearAll() {
      timers.forEach(clearTimeout);
      timers = [];
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    }
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

    function show(name) {
      Object.keys(views).forEach(function (k) { views[k].classList.toggle('is-active', k === name); });
      var group = name === 'done' ? 'brew' : name;
      stepTags.forEach(function (t) { t.classList.toggle('is-on', t.dataset.step === group); });
    }

    function parseLayers(str) {
      return str.split(',').map(function (part) {
        var bits = part.split(':');
        return { key: bits[0], pct: parseFloat(bits[1]) };
      });
    }

    function buildCup(layers) {
      fillGroup.innerHTML = '';
      var start = 0;
      return layers.map(function (l) {
        var r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        r.setAttribute('x', '0');
        r.setAttribute('width', '120');
        r.setAttribute('fill', COLORS[l.key] || '#888');
        r.setAttribute('y', String(BOTTOM));
        r.setAttribute('height', '0');
        fillGroup.appendChild(r);
        var band = { rect: r, from: start, to: start + l.pct, key: l.key };
        start += l.pct;
        return band;
      });
    }

    function paint(bands, progress) {
      var filled = progress * 100;
      bands.forEach(function (b) {
        var v = Math.max(0, Math.min(b.to, filled) - b.from);
        var h = (v / 100) * SPAN;
        b.rect.setAttribute('height', String(h));
        b.rect.setAttribute('y', String(BOTTOM - (b.from / 100) * SPAN - h));
      });
    }

    function currentPhase(bands, progress) {
      var filled = progress * 100;
      for (var i = 0; i < bands.length; i++) {
        if (filled <= bands[i].to) return PHASE[bands[i].key] || 'Zubereitung';
      }
      return 'Ausgabe';
    }

    function serve(btn) {
      if (busy) return;
      busy = true;
      clearAll();

      var name   = btn.dataset.name;
      var ml     = parseInt(btn.dataset.ml, 10);
      var sec    = parseInt(btn.dataset.sec, 10);
      var layers = parseLayers(btn.dataset.layers);
      var grind  = layers.some(function (l) { return l.key === 'espresso'; });

      slotDrink.textContent = name;
      slotDrink2.textContent = name;
      slotMl.textContent = '0';
      slotBar.style.width = '0%';
      var bands = buildCup(layers);
      paint(bands, 0);

      show('pay');

      later(function () {
        show('brew');
        slotPhase.textContent = grind ? 'Bohnen mahlen' : 'Wasser erhitzen';

        var dur = 3000 + (sec / 34) * 1800;
        var t0 = performance.now();
        var lead = 0.18;              // Mahlen / Erhitzen vor dem ersten Tropfen

        (function tick(now) {
          var p = Math.min(1, (now - t0) / dur);
          var pour = Math.max(0, (p - lead) / (1 - lead));
          paint(bands, pour);
          slotBar.style.width = (p * 100).toFixed(1) + '%';
          slotMl.textContent = Math.round(ml * pour).toLocaleString('de-DE');
          if (p > lead) slotPhase.textContent = currentPhase(bands, pour);
          if (p < 1) { raf = requestAnimationFrame(tick); }
          else {
            slotMl.textContent = ml.toLocaleString('de-DE');
            later(function () { show('done'); }, 450);
            later(function () { show('select'); busy = false; }, 3200);
          }
        })(t0);
      }, 1700);
    }

    /* Kleine Rezept-Vorschau auf jeder Taste */
    $$('.drink', screen).forEach(function (b) {
      b.type = 'button';
      var stops = [], at = 0;
      parseLayers(b.dataset.layers).forEach(function (l) {
        var c = COLORS[l.key] || '#888';
        stops.push(c + ' ' + at.toFixed(1) + '% ' + (at + l.pct).toFixed(1) + '%');
        at += l.pct;
      });
      var cup = document.createElement('span');
      cup.className = 'drink__cup';
      cup.style.background = 'linear-gradient(to top,' + stops.join(',') + ')';
      b.insertBefore(cup, b.firstChild);
      b.addEventListener('click', function () { root.dataset.touched = '1'; serve(b); });
    });

    /* Einmalige Vorführung, sobald das Display sichtbar wird */
    if (!reduced && 'IntersectionObserver' in window) {
      var demo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          demo.disconnect();
          later(function () {
            if (root.dataset.touched || busy) return;
            var cappu = $$('.drink', screen).filter(function (d) { return d.dataset.name === 'Cappuccino'; })[0];
            if (cappu) serve(cappu);
          }, 2200);
        });
      }, { threshold: 0.55 });
      demo.observe(root);
    }
  })();

  /* ---------------- Formular → E-Mail ---------------- */
  (function form() {
    var f = $('#anfrage');
    if (!f) return;
    var status = $('.form__status', f);
    var sel = $('#f-freq', f);

    if (sel) {
      sel.addEventListener('change', function () { sel.classList.toggle('has-value', !!sel.value); });
    }

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      status.classList.remove('is-error');

      var missing = null;
      $$('input, select, textarea', f).forEach(function (el) {
        var wrap = el.closest('.field');
        var bad = el.hasAttribute('required') && !el.value.trim();
        if (el.type === 'email' && el.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value)) bad = true;
        if (wrap) wrap.classList.toggle('is-invalid', bad);
        if (bad && !missing) missing = el;
      });

      if (missing) {
        status.textContent = 'Bitte füllen Sie die markierten Felder aus.';
        status.classList.add('is-error');
        missing.focus();
        return;
      }

      var d = new FormData(f);

      function openMailFallback() {
        var body = [
          'Anfrage für einen Coffeecorner', '',
          'Name:        ' + d.get('name'),
          'Einrichtung: ' + d.get('org'),
          'E-Mail:      ' + d.get('mail'),
          'Telefon:     ' + (d.get('tel') || '—'),
          'Standort:    ' + d.get('adresse'),
          'Frequenz:    ' + d.get('freq'), '',
          'Nachricht:',
          (d.get('msg') || '—'), '',
          '— gesendet über yourcoffee24.de'
        ].join('\n');

        var href = 'mailto:info@yourcoffee24.de'
          + '?subject=' + encodeURIComponent('Standortanfrage: ' + d.get('org'))
          + '&body=' + encodeURIComponent(body);

        status.textContent = 'Ihr E-Mail-Programm öffnet sich – bitte einmal auf Senden klicken.';
        window.location.href = href;
      }

      var submitBtn = $('.form__submit', f);

      if (!FORM_ENDPOINT) {
        openMailFallback();
        return;
      }

      status.classList.remove('is-error');
      status.textContent = 'Wird gesendet …';
      if (submitBtn) submitBtn.disabled = true;

      fetch(FORM_ENDPOINT, { method: 'POST', body: new URLSearchParams(d) })
        .then(function (res) { return res.ok ? res.json() : Promise.reject(new Error('bad status')); })
        .then(function (json) {
          if (!json || json.ok !== true) throw new Error('bad payload');
          status.textContent = 'Danke! Ihre Anfrage ist bei uns eingegangen — wir melden uns.';
          f.reset();
          if (sel) sel.classList.remove('has-value');
        })
        .catch(function () { openMailFallback(); })
        .finally(function () { if (submitBtn) submitBtn.disabled = false; });
    });
  })();

  /* ---------------- Kleinkram ---------------- */
  var y = $('#year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
