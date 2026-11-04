/* ============================================================
   CitySmile — shared front-end script (multilingual)
   Reads the active language from window.I18N (assets/i18n.js),
   fills every [data-i18n] / [data-i18n-html] element, renders the
   data-driven sections (services, why-us, team, service pages) in
   that language, and drives the flag language switcher, mobile nav,
   booking widget, checkout and contact form.
   Team names, GDC numbers, images and colours are language-neutral.
   Pure vanilla JS, no build step.
   ============================================================ */
(function () {
  'use strict';

  var IMG  = (document.body.getAttribute('data-img-base') || '../images') + '/';
  var MODE = document.body.getAttribute('data-mode'); // 'book' | 'nobook' | null
  var LANGS = window.SITE_LANGS || [{ code: 'en', flag: 'gb', label: 'English' }];
  var DEFAULT = 'en';

  function getLang() {
    try { var l = localStorage.getItem('cs_lang'); if (l && window.I18N[l]) return l; } catch (e) {}
    return DEFAULT;
  }
  var lang = getLang();
  function dict() { return window.I18N[lang] || window.I18N.en; }
  function T(k) { var d = dict(); return (d.ui && d.ui[k] != null) ? d.ui[k] : (window.I18N.en.ui[k] != null ? window.I18N.en.ui[k] : k); }

  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function autoSerif(name) { var p = String(name).split(' '); if (p.length < 2) return esc(name); var last = p.pop(); return esc(p.join(' ')) + ' <span class="serif">' + esc(last) + '</span>'; }
  function set(id, fn) { var n = document.getElementById(id); if (n) fn(n); }

  // ---------- Language-neutral meta ----------
  var SVC_META = [
    { n: '01', img: 'service-01.jpg', pos: '50% 50%' }, { n: '02', img: 'service-02.jpg', pos: '50% 50%' },
    { n: '03', img: 'service-03.jpg', pos: '50% 40%' }, { n: '04', img: 'service-04.jpg', pos: '50% 50%' },
    { n: '05', img: 'service-05.jpg', pos: '50% 50%' }, { n: '06', img: 'service-06.jpg', pos: '50% 50%' },
    { n: '07', img: 'service-07.jpg', pos: '50% 50%' }, { n: '08', img: 'service-08.jpg', pos: '50% 40%' },
    { n: '09', img: 'service-09.jpg', pos: '50% 40%' }
  ];
  var REASON_META = [
    { bg: 'var(--bg-blue)', c: 'var(--sky)' }, { bg: 'var(--mint-tint)', c: 'var(--teal)' },
    { bg: 'var(--pink-tint)', c: 'var(--pink)' }, { bg: 'var(--navy-tint)', c: 'var(--navy)' }
  ];
  var BLUE = 'var(--sky-dark)', TEAL = 'var(--teal-dark)', PINK = 'var(--pink-dark)', NAVY = 'var(--navy)';
  var TEAM = [
    { name: 'Dr Leo Rom',          role: 'principal',    bio: 'Cologne 1995 · GDC 75506',       img: 'dr-leo-rom.jpg',          pos: '50% 30%', c: BLUE },
    { name: 'Dr Leo Mashensky',    role: 'principal',    bio: 'Frankfurt 1996 · GDC 73674',     img: 'dr-leo-mashensky.jpg',    pos: '45% 30%', c: BLUE },
    { name: 'Lior Burg',           role: 'surgeon',      bio: 'Budapest 2003 · GDC 84953',      img: 'lior-burg.jpg',           pos: '50% 30%', c: TEAL },
    { name: 'Shimon Dantsis',      role: 'surgeon',      bio: 'Debrecen 2009 · GDC 249447',     img: 'shimon-dantsis.jpg',      pos: '72% 30%', c: TEAL },
    { name: 'Vana Vlastaki',       role: 'surgeon',      bio: 'Budapest 1999 · GDC 209525',     img: 'vana-vlastaki.jpg',       pos: '50% 30%', c: TEAL },
    { name: 'Salim Zniber',        role: 'surgeon',      bio: 'Paris · GDC 291038',             img: 'salim-zniber.jpg',        pos: '52% 30%', c: TEAL },
    { name: 'Anna Krajewski',      role: 'perio',        bio: 'Berlin 2002 · GDC 169375',       img: 'anna-krajewski.jpg',      pos: '48% 30%', c: PINK },
    { name: 'Oksana Rudak',        role: 'hygienist',    bio: 'Klaipeda · GDC 219740',          img: 'oksana-rudak.jpg',        pos: '60% 30%', c: PINK },
    { name: 'Rasa Virsyle',        role: 'hygienist',    bio: 'London since 2016 · GDC 261860', img: 'rasa-virsyle.jpg',        pos: '42% 30%', c: PINK },
    { name: 'Maryna Zakharchenko', role: 'manager',      bio: 'Practice team',                  img: 'maryna-zakharchenko.jpg', pos: '45% 30%', c: NAVY },
    { name: 'Natalia Lopusneac',   role: 'admin',        bio: 'Practice team',                  img: 'natalia-lopusneac.jpg',   pos: '55% 30%', c: NAVY },
    { name: 'Viktoria Hromovcsuk', role: 'receptionist', bio: 'Practice team',                  img: 'viktoria-hromovcsuk.jpg', pos: '45% 30%', c: NAVY },
    { name: 'Victoria Kharandiuk', role: 'receptionist', bio: 'Practice team',                  img: 'victoria-kharandiuk.jpg', pos: '55% 30%', c: NAVY }
  ];
  var RESERVE = { en: 'Reserve', de: 'Reservieren', fr: 'Réserver', el: 'Κράτηση', ru: 'Забронировать' };

  // ---------- Renderers ----------
  function renderServices() {
    var host = document.getElementById('services-grid'); if (!host) return;
    var names = dict().services; host.innerHTML = '';
    SVC_META.forEach(function (s, i) {
      host.appendChild(el(
        '<a class="svc" href="service.html?s=' + s.n + '">' +
          '<div class="svc-top"><img src="' + IMG + s.img + '" alt="" loading="lazy" style="object-position:' + s.pos + '"><span class="plus">( + )</span></div>' +
          '<div class="svc-body"><span class="n">(' + s.n + ')</span><span class="name">' + autoSerif(names[i]) + '</span></div>' +
        '</a>'));
    });
  }
  function renderReasons() {
    var host = document.getElementById('reasons-grid'); if (!host) return;
    var rs = dict().reasons.slice();
    if (MODE === 'nobook') rs[2] = dict().reasonNobook;
    host.innerHTML = '';
    REASON_META.forEach(function (m, i) {
      var r = rs[i];
      host.appendChild(el(
        '<div class="reason" style="background:' + m.bg + '">' +
          '<span class="big" style="color:' + m.c + '">(0' + (i + 1) + ')</span>' +
          '<div><h3>' + esc(r.t) + '</h3><p>' + esc(r.d) + '</p></div>' +
        '</div>'));
    });
  }
  function renderTeam() {
    var host = document.getElementById('team-grid'); if (!host) return;
    var roles = dict().roles; host.innerHTML = '';
    TEAM.forEach(function (p) {
      host.appendChild(el(
        '<article class="member">' +
          '<img src="' + IMG + p.img + '" alt="' + esc(p.name) + '" loading="lazy" style="object-position:' + p.pos + '">' +
          '<div class="info"><h3>' + esc(p.name) + '</h3><span class="role" style="color:' + p.c + '">' + esc(roles[p.role]) + '</span><span class="bio">' + esc(p.bio) + '</span></div>' +
        '</article>'));
    });
  }
  function renderServiceDetail() {
    var sdHost = document.getElementById('service-detail'); if (!sdHost) return;
    var sParam = new URLSearchParams(location.search).get('s');
    var idx = SVC_META.map(function (x) { return x.n; }).indexOf(sParam);
    var svc = SVC_META[idx], det = dict().serviceDetails[sParam];
    if (!svc || !det) { location.replace('index.html#services'); return; }
    var name = dict().services[idx];
    document.title = 'CitySmile · ' + name;
    set('sd-num',   function (n) { n.textContent = '(' + svc.n + ')'; });
    set('sd-name',  function (n) { n.innerHTML = autoSerif(name); });
    set('sd-lead',  function (n) { n.textContent = det.lead; });
    set('sd-img',   function (n) { n.src = IMG + svc.img; n.alt = name; });
    set('sd-body',  function (n) { n.innerHTML = ''; det.body.forEach(function (p) { n.appendChild(el('<p>' + esc(p) + '</p>')); }); });
    set('sd-points',function (n) { n.innerHTML = ''; det.points.forEach(function (pt) { n.appendChild(el('<li>' + esc(pt) + '</li>')); }); });
    set('sd-related', function (n) {
      n.innerHTML = '';
      SVC_META.filter(function (x) { return x.n !== sParam; }).slice(0, 4).forEach(function (x) {
        var j = SVC_META.indexOf(x);
        n.appendChild(el('<a class="sd-rel" href="service.html?s=' + x.n + '"><img src="' + IMG + x.img + '" alt="" loading="lazy" style="object-position:' + x.pos + '"><span>' + autoSerif(dict().services[j]) + '</span></a>'));
      });
    });
  }

  // ---------- Static text ----------
  function applyText() {
    document.documentElement.lang = lang;
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (n) {
      var v = T(n.getAttribute('data-i18n')); if (v != null) n.textContent = v;
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-html]'), function (n) {
      var k = n.getAttribute('data-i18n-html'), v;
      if (k.indexOf('headings.') === 0) { v = (dict().headings || {})[k.slice(9)]; }
      else { v = T(k); }
      if (v != null) n.innerHTML = v;
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-ph]'), function (n) {
      var v = T(n.getAttribute('data-i18n-ph')); if (v != null) n.setAttribute('placeholder', v);
    });
  }

  // ---------- Booking widget ----------
  var DAYS = [['Wed', '4'], ['Thu', '5'], ['Fri', '6'], ['Sat', '7'], ['Mon', '9']];
  var SLOTS = [
    ['08:30', '09:15', '12:40', '16:00', '17:20', '18:10'], ['09:45', '11:00', '13:30', '14:15', '15:50', '16:40'],
    ['09:30', '10:20', '11:40', '13:00', '14:30', '16:10'], ['09:30', '10:15', '11:00', '12:30', '13:15', '14:00'],
    ['09:40', '10:30', '12:00', '14:20', '15:10', '16:30']
  ];
  var MONTH = 'Nov', bk = null;
  function initBooking() {
    var daysHost = document.getElementById('book-days'), slotsHost = document.getElementById('book-slots');
    if (!daysHost || !slotsHost) return;
    var state = { day: 0, slot: 3 };
    var reserveBtn = document.getElementById('reserve-btn'), bookbarBtn = document.getElementById('bookbar-btn');
    function summary() { var d = DAYS[state.day]; return d[0] + ' ' + d[1] + ' ' + MONTH + ', ' + SLOTS[state.day][state.slot]; }
    function href() { var d = DAYS[state.day]; return 'booking.html?when=' + encodeURIComponent(d[0] + ' ' + d[1] + ' ' + MONTH) + '&at=' + encodeURIComponent(SLOTS[state.day][state.slot]); }
    function renderDays() {
      daysHost.innerHTML = '';
      DAYS.forEach(function (d, i) {
        var b = el('<button type="button" class="day' + (i === state.day ? ' on' : '') + '"><span class="dow">' + d[0] + '</span><span class="num">' + d[1] + '</span></button>');
        b.addEventListener('click', function () { state.day = i; state.slot = 0; renderDays(); renderSlots(); cta(); });
        daysHost.appendChild(b);
      });
    }
    function renderSlots() {
      slotsHost.innerHTML = '';
      SLOTS[state.day].forEach(function (t, i) {
        var b = el('<button type="button" class="slot' + (i === state.slot ? ' on' : '') + '">' + t + '</button>');
        b.addEventListener('click', function () { state.slot = i; renderSlots(); cta(); });
        slotsHost.appendChild(b);
      });
    }
    function cta() {
      if (reserveBtn) { reserveBtn.textContent = '( ' + (RESERVE[lang] || 'Reserve') + ' ' + summary() + ' )'; reserveBtn.href = href(); }
      if (bookbarBtn) bookbarBtn.href = href();
    }
    bk = { refresh: cta };
    renderDays(); renderSlots(); cta();
  }

  // ---------- Language switcher ----------
  function buildSwitcher() {
    Array.prototype.forEach.call(document.querySelectorAll('.lang-switch'), function (host) {
      host.innerHTML = '';
      LANGS.forEach(function (L) {
        var b = el('<button type="button" class="lang-btn" data-lang="' + L.code + '" title="' + L.label + '" aria-label="' + L.label + '"><span class="fi fi-' + L.flag + '"></span></button>');
        b.addEventListener('click', function () { applyLang(L.code); });
        host.appendChild(b);
      });
    });
  }
  function updateSwitcher() {
    Array.prototype.forEach.call(document.querySelectorAll('.lang-btn'), function (b) {
      b.classList.toggle('on', b.getAttribute('data-lang') === lang);
    });
  }

  function applyLang(l) {
    if (!window.I18N[l]) l = 'en';
    lang = l;
    try { localStorage.setItem('cs_lang', l); } catch (e) {}
    applyText();
    renderServices(); renderReasons(); renderTeam(); renderServiceDetail();
    if (bk) bk.refresh();
    updateSwitcher();
  }

  // ---------- Mobile nav ----------
  function initNav() {
    var toggle = document.querySelector('.nav-toggle'), links = document.querySelector('.nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  // ---------- Contact form (contact.html) ----------
  function initContact() {
    var form = document.getElementById('contact-form'); if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var panel = document.getElementById('contact-panel'), done = document.getElementById('contact-done');
      if (panel) panel.style.display = 'none';
      if (done) done.style.display = 'flex';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Checkout (booking.html) ----------
  function initCheckout() {
    var checkout = document.getElementById('checkout'); if (!checkout) return;
    var params = new URLSearchParams(location.search);
    var whenEl = document.getElementById('sum-when');
    if (whenEl) { var when = params.get('when'), at = params.get('at'); if (when && at) whenEl.textContent = when + ' · ' + at; }
    document.querySelectorAll('.pay-method').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.pay-method').forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
      });
    });
    var form = document.getElementById('checkout-form');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var doneWhen = document.getElementById('done-when');
      if (doneWhen && whenEl) doneWhen.textContent = whenEl.textContent;
      var pf = document.getElementById('panel-form'), pd = document.getElementById('panel-done');
      if (pf) pf.style.display = 'none';
      if (pd) pd.style.display = 'flex';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Boot ----------
  initBooking();
  initNav();
  initContact();
  initCheckout();
  buildSwitcher();
  applyLang(lang);
})();
