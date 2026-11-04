/* ============================================================
   CitySmile — shared front-end script
   Renders the data-driven grids (services, why-us, team) from the
   content spec, wires the mobile nav, and (on the booking build)
   drives the date/slot picker and the checkout demo.
   Pure vanilla JS, no build step — works on static hosting.
   ============================================================ */
(function () {
  'use strict';

  // ---- image base is resolved relative to each page (../images) ----
  var IMG = (document.body.getAttribute('data-img-base') || '../images') + '/';

  // ---------- Content (from the design spec) ----------
  var SERVICES = [
    { n:'01', a:'Check-ups &', b:'hygiene',     img:'site-whoarewe.jpg',  pos:'40% 50%' },
    { n:'02', a:'Teeth',        b:'whitening',   img:'site-home-1.jpg',    pos:'50% 40%' },
    { n:'03', a:'Porcelain',    b:'veneers',     img:'site-whatwedo.jpg',  pos:'75% 50%' },
    { n:'04', a:'Dental',       b:'implants',    img:'site-whatwedo3.jpg', pos:'40% 40%' },
    { n:'05', a:'Invisalign',   b:'aligners',    img:'site-form.jpg',      pos:'65% 35%' },
    { n:'06', a:'Crowns &',     b:'bridges',     img:'site-whatwedo2.jpg', pos:'60% 40%' },
    { n:'07', a:'Root canal',   b:'treatment',   img:'shimon-dantsis.jpg', pos:'75% 30%' },
    { n:'08', a:'Gum disease',  b:'care',        img:'anna-krajewski.jpg', pos:'45% 30%' },
    { n:'09', a:'Facial',       b:'rejuvenation',img:'vana-vlastaki.jpg',  pos:'50% 30%' }
  ];

  var REASONS = [
    { n:'01', t:'Five Languages',    d:'Explain what worries you in English, German, French, Greek or Russian — and understand every step of your plan.', bg:'var(--bg-blue)',  c:'var(--sky)'  },
    { n:'02', t:'Open When You Are', d:'Wednesdays from 8am to 7pm and Saturdays until 3pm — easy to fit around work in the City.',                      bg:'var(--mint-tint)',c:'var(--teal)' },
    { n:'03', t:'Book Online, 24/7', d:'Choose a slot in seconds and secure it with a small refundable deposit. Reminders by email and text.',           bg:'var(--pink-tint)',c:'var(--pink)' },
    { n:'04', t:'Specialists In-House', d:'Implants, gum disease and cosmetic work under one roof, every clinician GDC-registered.',                      bg:'var(--navy-tint)',c:'var(--navy)' }
  ];
  // "Why us" reason 03 talks about online booking — swapped out on the no-booking build.
  var REASONS_NOBOOK = REASONS.slice();
  REASONS_NOBOOK[2] = { n:'03', t:'Call & Walk-in', d:'Reach the practice by phone six days a week — same-day and emergency appointments whenever we can.', bg:'var(--pink-tint)', c:'var(--pink)' };

  var BLUE='var(--sky-dark)', TEAL='var(--teal-dark)', PINK='var(--pink-dark)', NAVY='var(--navy)';
  var TEAM = [
    { name:'Dr Leo Rom',          role:'Principal',               bio:'Cologne 1995 · GDC 75506',       img:'dr-leo-rom.jpg',          pos:'50% 30%', c:BLUE },
    { name:'Dr Leo Mashensky',    role:'Principal',               bio:'Frankfurt 1996 · GDC 73674',     img:'dr-leo-mashensky.jpg',    pos:'45% 30%', c:BLUE },
    { name:'Lior Burg',           role:'Dental surgeon',          bio:'Budapest 2003 · GDC 84953',      img:'lior-burg.jpg',           pos:'50% 30%', c:TEAL },
    { name:'Shimon Dantsis',      role:'Dental surgeon',          bio:'Debrecen 2009 · GDC 249447',     img:'shimon-dantsis.jpg',      pos:'72% 30%', c:TEAL },
    { name:'Vana Vlastaki',       role:'Dental surgeon',          bio:'Budapest 1999 · GDC 209525',     img:'vana-vlastaki.jpg',       pos:'50% 30%', c:TEAL },
    { name:'Salim Zniber',        role:'Dental surgeon',          bio:'Paris · GDC 291038',             img:'salim-zniber.jpg',        pos:'52% 30%', c:TEAL },
    { name:'Anna Krajewski',      role:'Periodontal specialist',  bio:'Berlin 2002 · GDC 169375',       img:'anna-krajewski.jpg',      pos:'48% 30%', c:PINK },
    { name:'Oksana Rudak',        role:'Dental hygienist',        bio:'Klaipeda · GDC 219740',          img:'oksana-rudak.jpg',        pos:'60% 30%', c:PINK },
    { name:'Rasa Virsyle',        role:'Dental hygienist',        bio:'London since 2016 · GDC 261860', img:'rasa-virsyle.jpg',        pos:'42% 30%', c:PINK },
    { name:'Maryna Zakharchenko', role:'Practice manager',        bio:'Practice team',                  img:'maryna-zakharchenko.jpg', pos:'45% 30%', c:NAVY },
    { name:'Natalia Lopusneac',   role:'Administrator',           bio:'Practice team',                  img:'natalia-lopusneac.jpg',   pos:'55% 30%', c:NAVY },
    { name:'Viktoria Hromovcsuk', role:'Receptionist',            bio:'Practice team',                  img:'viktoria-hromovcsuk.jpg', pos:'45% 30%', c:NAVY },
    { name:'Victoria Kharandiuk', role:'Receptionist',            bio:'Practice team',                  img:'victoria-kharandiuk.jpg', pos:'55% 30%', c:NAVY }
  ];

  function el(html){ var t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstChild; }
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }

  // ---------- Render services ----------
  var svcHost = document.getElementById('services-grid');
  if (svcHost) {
    SERVICES.forEach(function (s) {
      svcHost.appendChild(el(
        '<a class="svc" href="#services">'+
          '<div class="svc-top">'+
            '<img src="'+IMG+s.img+'" alt="" loading="lazy" style="object-position:'+s.pos+'">'+
            '<span class="plus">( + )</span>'+
          '</div>'+
          '<div class="svc-body">'+
            '<span class="n">('+s.n+')</span>'+
            '<span class="name">'+esc(s.a)+' <span class="serif">'+esc(s.b)+'</span></span>'+
            '<span class="price">from £[PRICE]</span>'+
          '</div>'+
        '</a>'
      ));
    });
  }

  // ---------- Render why-us ----------
  var whyHost = document.getElementById('reasons-grid');
  if (whyHost) {
    var list = (document.body.getAttribute('data-mode') === 'nobook') ? REASONS_NOBOOK : REASONS;
    list.forEach(function (r) {
      whyHost.appendChild(el(
        '<div class="reason" style="background:'+r.bg+'">'+
          '<span class="big" style="color:'+r.c+'">('+r.n+')</span>'+
          '<div><h3>'+esc(r.t)+'</h3><p>'+esc(r.d)+'</p></div>'+
        '</div>'
      ));
    });
  }

  // ---------- Render team ----------
  var teamHost = document.getElementById('team-grid');
  if (teamHost) {
    TEAM.forEach(function (p) {
      teamHost.appendChild(el(
        '<article class="member">'+
          '<img src="'+IMG+p.img+'" alt="'+esc(p.name)+'" loading="lazy" style="object-position:'+p.pos+'">'+
          '<div class="info">'+
            '<h3>'+esc(p.name)+'</h3>'+
            '<span class="role" style="color:'+p.c+'">'+esc(p.role)+'</span>'+
            '<span class="bio">'+esc(p.bio)+'</span>'+
          '</div>'+
        '</article>'
      ));
    });
  }

  // ---------- Mobile nav ----------
  var toggle = document.querySelector('.nav-toggle');
  var links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { links.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }
    });
  }

  // ---------- Booking widget (homepage, booking build only) ----------
  var DAYS  = [['Wed','4'],['Thu','5'],['Fri','6'],['Sat','7'],['Mon','9']];
  var SLOTS = [
    ['08:30','09:15','12:40','16:00','17:20','18:10'],
    ['09:45','11:00','13:30','14:15','15:50','16:40'],
    ['09:30','10:20','11:40','13:00','14:30','16:10'],
    ['09:30','10:15','11:00','12:30','13:15','14:00'],
    ['09:40','10:30','12:00','14:20','15:10','16:30']
  ];
  var MONTH = 'Nov';

  var daysHost = document.getElementById('book-days');
  var slotsHost = document.getElementById('book-slots');
  if (daysHost && slotsHost) {
    var state = { day: 0, slot: 3 };
    var reserveBtn = document.getElementById('reserve-btn');
    var bookbarBtn = document.getElementById('bookbar-btn');

    function summary() {
      var d = DAYS[state.day];
      return d[0] + ' ' + d[1] + ' ' + MONTH + ', ' + SLOTS[state.day][state.slot];
    }
    function bookingHref() {
      var d = DAYS[state.day];
      var q = '?when=' + encodeURIComponent(d[0] + ' ' + d[1] + ' ' + MONTH) + '&at=' + encodeURIComponent(SLOTS[state.day][state.slot]);
      return 'booking.html' + q;
    }
    function renderDays() {
      daysHost.innerHTML = '';
      DAYS.forEach(function (d, i) {
        var b = el('<button type="button" class="day'+(i===state.day?' on':'')+'"><span class="dow">'+d[0]+'</span><span class="num">'+d[1]+'</span></button>');
        b.addEventListener('click', function () { state.day = i; state.slot = 0; renderDays(); renderSlots(); });
        daysHost.appendChild(b);
      });
    }
    function renderSlots() {
      slotsHost.innerHTML = '';
      SLOTS[state.day].forEach(function (t, i) {
        var b = el('<button type="button" class="slot'+(i===state.slot?' on':'')+'">'+t+'</button>');
        b.addEventListener('click', function () { state.slot = i; renderSlots(); });
        slotsHost.appendChild(b);
      });
    }
    function renderCTA() {
      if (reserveBtn) { reserveBtn.textContent = '( Reserve ' + summary() + ' )'; reserveBtn.href = bookingHref(); }
      if (bookbarBtn) { bookbarBtn.href = bookingHref(); }
    }
    // re-render CTAs on every pick without recreating listeners
    var _rd = renderDays, _rs = renderSlots;
    renderDays = function(){ _rd(); renderCTA(); };
    renderSlots = function(){ _rs(); renderCTA(); };
    renderDays(); renderSlots();
  }

  // ---------- Checkout page (booking.html) ----------
  var checkout = document.getElementById('checkout');
  if (checkout) {
    // reflect chosen slot from the query string into the summary
    var params = new URLSearchParams(location.search);
    var whenEl = document.getElementById('sum-when');
    if (whenEl) {
      var when = params.get('when'), at = params.get('at');
      if (when && at) whenEl.textContent = when + ' · ' + at;
    }
    // payment method pills
    document.querySelectorAll('.pay-method').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.pay-method').forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
      });
    });
    // confirm (demo): no real charge — shows the confirmation panel
    var form = document.getElementById('checkout-form');
    var panelForm = document.getElementById('panel-form');
    var panelDone = document.getElementById('panel-done');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.reportValidity()) return;
        var doneWhen = document.getElementById('done-when');
        if (doneWhen && whenEl) doneWhen.textContent = whenEl.textContent;
        if (panelForm) panelForm.style.display = 'none';
        if (panelDone) panelDone.style.display = 'flex';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }
})();
