/* RS Systems & Solutions: shared page enhancements */
(function () {
  'use strict';
  var PHONE = '919004657056';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---- Hero stage: thumbnail switcher ---- */
  $$('[data-rs-stage]').forEach(function (stage) {
    var main = $('[data-rs-main]', stage), tag = $('.rs-stage-tag', stage), thumbs = $$('.rs-thumb', stage);
    if (!main || !thumbs.length) return;
    function show(btn) {
      thumbs.forEach(function (t) { t.classList.toggle('is-active', t === btn); });
      main.classList.add('is-swapping');
      setTimeout(function () {
        main.src = btn.dataset.src; main.alt = btn.dataset.label;
        if (tag) tag.textContent = btn.dataset.label;
        main.classList.remove('is-swapping');
      }, 220);
    }
    thumbs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(t); });
    });
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (thumbs.length > 1 && !reduce) {
      var idx = 0, timer = setInterval(next, 4500);
      function next() { idx = (idx + 1) % thumbs.length; show(thumbs[idx]); }
      stage.addEventListener('mouseenter', function () { clearInterval(timer); });
      thumbs.forEach(function (t, i) { t.addEventListener('click', function () { idx = i; clearInterval(timer); }); });
    }
  });

  /* ---- Home hero slideshow ---- */
  $$('[data-rs-slides]').forEach(function (box) {
    var root = box.closest('.rs-stage'), imgs = $$('img', box), tag = $('.rs-stage-tag', root), dots = $$('.rs-dots button', root), i = 0;
    function go(n) {
      i = (n + imgs.length) % imgs.length;
      imgs.forEach(function (im, k) { im.classList.toggle('is-on', k === i); });
      dots.forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
      if (tag) tag.textContent = imgs[i].dataset.label;
    }
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); }); });
    go(0);
    if (!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) setInterval(function () { go(i + 1); }, 3800);
  });

  /* ---- Product cards: number badge, zoom hint, WhatsApp / call buttons ---- */
  var page = document.body.getAttribute('data-rs-page');
  if (page === 'product') {
    $$('.reveal.grid[id]').forEach(function (card, n) {
      var panel = $('.rs-imgpanel', card);
      if (panel && !$('.rs-badge-num', panel)) {
        var b = document.createElement('span'); b.className = 'rs-badge-num'; b.textContent = '0' + (n + 1); panel.insertBefore(b, panel.firstChild);
      }
      var cta = $('[data-enquire]', card);
      if (cta && !$('.rs-btn-wa', card)) {
        var name = cta.dataset.enquire, wrap = document.createElement('div'); wrap.className = 'rs-card-actions';
        cta.parentNode.insertBefore(wrap, cta); wrap.appendChild(cta);
        var wa = document.createElement('a'); wa.className = 'rs-btn-wa'; wa.target = '_blank'; wa.rel = 'noopener';
        wa.href = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent('Hello RS Systems, I would like a quote for: ' + name);
        wa.innerHTML = '<i class="fa-brands fa-whatsapp"></i> WhatsApp';
        var call = document.createElement('a'); call.className = 'rs-btn-call'; call.href = 'tel:+' + PHONE;
        call.innerHTML = '<i class="fa-solid fa-phone"></i> Call';
        wrap.appendChild(wa); wrap.appendChild(call);
      }
    });
  }
  $$('.rs-imgpanel').forEach(function (p) {
    if (!$('.rs-zoom-hint', p)) { var z = document.createElement('span'); z.className = 'rs-zoom-hint'; z.innerHTML = '<i class="fa-solid fa-expand"></i>'; p.appendChild(z); }
  });

  /* ---- Lightbox ---- */
  var lb = document.createElement('div'); lb.id = 'rs-lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = '<button type="button" aria-label="Close"><i class="fa-solid fa-xmark"></i></button><figure><img alt=""><figcaption></figcaption></figure>';
  document.body.appendChild(lb);
  var lbImg = $('img', lb), lbCap = $('figcaption', lb);
  function openLb(src, alt) { lbImg.src = src; lbImg.alt = alt || ''; lbCap.textContent = alt || ''; lb.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  function closeLb() { lb.classList.remove('is-open'); document.body.style.overflow = ''; }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('.rs-imgpanel, .rs-stage-main[data-zoomable]');
    if (t && !e.target.closest('a')) { var im = $('img.is-on', t) || $('img', t); if (im) openLb(im.currentSrc || im.src, im.alt); }
    else if (e.target === lb || e.target.closest('#rs-lightbox button')) closeLb();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });

  /* ---- Sticky sub-nav scroll spy ---- */
  var pills = $$('.rs-subnav a.rs-pill');
  if (pills.length && 'IntersectionObserver' in window) {
    var map = {};
    pills.forEach(function (p) { var id = (p.getAttribute('href') || '').slice(1), el = id && document.getElementById(id); if (el) map[id] = { p: p, el: el }; });
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { pills.forEach(function (p) { p.classList.remove('is-active'); }); map[en.target.id].p.classList.add('is-active'); }
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) { spy.observe(map[id].el); });
  }

  /* ---- Mobile action bar ---- */
  if (page === 'product') {
    var bar = document.createElement('div'); bar.className = 'rs-mobilebar';
    var h1 = $('h1'), title = h1 ? h1.textContent.trim() : 'your products';
    bar.innerHTML = '<a class="c" href="tel:+' + PHONE + '"><i class="fa-solid fa-phone"></i> Call</a>' +
      '<a class="w" target="_blank" rel="noopener" href="https://wa.me/' + PHONE + '?text=' + encodeURIComponent('Hello RS Systems, I am interested in: ' + title) + '"><i class="fa-brands fa-whatsapp"></i> WhatsApp</a>' +
      '<a class="q" href="#contact"><i class="fa-solid fa-file-invoice"></i> Get quote</a>';
    document.body.appendChild(bar);
  }
})();

/* ---- Hero background carousel (home + inner pages) ---- */
(function () {
  'use strict';
  var hero = document.querySelector('[data-rs-hero]');
  if (!hero) return;
  var slides = [].slice.call(hero.querySelectorAll('.hs'));
  if (!slides.length) return;
  var dots = [].slice.call(hero.querySelectorAll('.rs-hero-dots button'));
  var bar = hero.querySelector('.rs-hero-progress i');
  var tag = hero.querySelector('[data-rs-tag]');
  var cap = hero.querySelector('.rs-hero-caption');
  var prev = hero.querySelector('.rs-hero-arrow.prev'), next = hero.querySelector('.rs-hero-arrow.next');
  var cur = 0, timer = null, reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (slides.length < 2) hero.classList.add('is-single');
  function show(n) {
    cur = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('active', i === cur); });
    dots.forEach(function (d, i) { d.classList.toggle('on', i === cur); });
    var d = slides[cur].dataset;
    if (tag) tag.lastChild.textContent = d.name;
    if (cap) {
      cap.querySelector('.hc-cat').textContent = d.cat || '';
      cap.querySelector('.hc-name').textContent = d.name;
      cap.querySelector('.hc-tag').textContent = d.tagline || '';
      if (d.enq) cap.setAttribute('data-enquire', d.enq);
    }
    if (bar && !reduce) { bar.classList.remove('run'); void bar.offsetWidth; bar.classList.add('run'); }
  }
  function start() { clearInterval(timer); if (slides.length > 1 && !reduce) timer = setInterval(function () { show(cur + 1); }, 5000); }
  function stop() { clearInterval(timer); if (bar) bar.classList.remove('run'); }
  dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); start(); }); });
  if (prev) prev.addEventListener('click', function () { show(cur - 1); start(); });
  if (next) next.addEventListener('click', function () { show(cur + 1); start(); });
  hero.addEventListener('mouseenter', stop);
  hero.addEventListener('mouseleave', function () { show(cur); start(); });
  show(0); start();
})();

/* ---- Popup enquiry forms: every quote / enquiry / request button opens a form named after the button ---- */
(function () {
  'use strict';
  var EMAIL = 'sales@rssystems.in', PHONE = '919004657056';
  var PRODUCTS = ['Online UPS', 'Line Interactive UPS', 'Smart UPS', 'UPS with Inbuilt Batteries', 'Domestic Inverter', 'Lift Inverter', 'Solar On-Grid Inverter', 'Solar Off-Grid Inverter', 'Servo Voltage Stabilizer', 'Lithium UPS', 'Lithium MPPT Inverter', 'Lithium range', 'AMC / Service', 'Other'];
  var DOCS = ['ISO 9001:2015 certificate', 'CE certificate', 'NABL test report', 'Company profile / brochure', 'GST & registration details', 'Client list / credentials', 'Other'];
  var PROJECT = ['UPS system', 'Inverter / lift backup', 'Solar power plant', 'Voltage stabilizer', 'Lithium battery solution', 'Complete power-quality project', 'AMC / Service', 'Other'];
  var CTA = /(quote|enquir|inquir|request|ask about|talk to|discuss|start your project)/i;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function opts(list, sel) { return list.map(function (o) { return '<option' + (o === sel ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join(''); }

  var modal = document.createElement('div');
  modal.id = 'rs-modal'; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-labelledby', 'rs-modal-title');
  modal.innerHTML =
    '<div class="rs-modal-box" tabindex="-1">' +
    '<button type="button" class="rs-modal-x" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>' +
    '<p class="rs-modal-kicker">RS Systems &amp; Solutions</p>' +
    '<h3 id="rs-modal-title"></h3><p class="rs-modal-sub"></p>' +
    '<form novalidate></form></div>';
  document.body.appendChild(modal);
  var box = modal.querySelector('.rs-modal-box'), form = modal.querySelector('form'), titleEl = modal.querySelector('#rs-modal-title'),
    subEl = modal.querySelector('.rs-modal-sub'), lastFocus = null, current = {};

  function open(label, product) {
    var isDoc = /document/i.test(label), isProject = /project|expert/i.test(label);
    var list = isDoc ? DOCS : isProject ? PROJECT : PRODUCTS;
    var fieldLabel = isDoc ? 'Documents required' : isProject ? 'Type of project' : 'Product';
    var reqLabel = isDoc ? 'Your requirement' : 'Your requirement';
    current = { label: label, fieldLabel: fieldLabel };
    titleEl.textContent = label;
    subEl.textContent = product ? 'Regarding: ' + product + '. Share your details and we will get back to you shortly.' : 'Share your details and our team will get back to you shortly.';
    form.innerHTML =
      '<div class="rs-row"><label>Name *<input name="name" type="text" required autocomplete="name" placeholder="Your name"></label>' +
      '<label>Phone *<input name="phone" type="tel" required autocomplete="tel" inputmode="tel" placeholder="Mobile number"></label></div>' +
      '<div class="rs-row"><label>Email<input name="email" type="email" autocomplete="email" placeholder="you@company.com"></label>' +
      '<label>Company / City<input name="company" type="text" autocomplete="organization" placeholder="Company name, city"></label></div>' +
      '<label>' + fieldLabel + '<select name="product">' + opts(list, product) + '</select></label>' +
      '<label>' + reqLabel + '<textarea name="msg" rows="3" placeholder="' + (isDoc ? 'Which documents, and for what purpose?' : 'Load, capacity (KVA), location, backup time...') + '"></textarea></label>' +
      '<p class="rs-err" role="alert" hidden>Please enter your name and a valid phone number.</p>' +
      '<input type="text" name="website" class="rs-hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<div class="rs-actions"><button type="submit" class="rs-send" data-via="save"><i class="fa-solid fa-paper-plane"></i> Submit enquiry</button>' +
      '<button type="submit" class="rs-send wa" data-via="wa"><i class="fa-brands fa-whatsapp"></i> Submit &amp; WhatsApp</button></div>' +
      '<p class="rs-note">Our team will call you back shortly. Your details are used only to respond to this enquiry.</p>';
    lastFocus = document.activeElement;
    modal.classList.add('is-open'); document.body.style.overflow = 'hidden';
    setTimeout(function () { var f = form.querySelector('input'); if (f) f.focus(); }, 30);
  }
  function close() {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open'); document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  var via = 'save';
  form.addEventListener('click', function (e) { var b = e.target.closest('.rs-send'); if (b) via = b.dataset.via; });
  /* Firebase (loaded on first submit only; config lives in assets/firebase-config.js) */
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/[^\/]*$/, '') || 'assets/', fb = null, FBV = '10.12.2';
  function getDb() {
    if (fb) return fb;
    fb = import(BASE + 'firebase-config.js').then(function (m) {
      var cfg = m.firebaseConfig;
      if (!cfg || !cfg.projectId || /YOUR_/.test(cfg.apiKey + cfg.projectId)) throw new Error('not-configured');
      return Promise.all([import('https://www.gstatic.com/firebasejs/' + FBV + '/firebase-app.js'), import('https://www.gstatic.com/firebasejs/' + FBV + '/firebase-firestore.js')]).then(function (r) {
        return { db: r[1].getFirestore(r[0].initializeApp(cfg)), fs: r[1] };
      });
    });
    fb.catch(function () { fb = null; });
    return fb;
  }
  function saveEnquiry(rec) {
    return getDb().then(function (x) { rec.createdAt = x.fs.serverTimestamp(); return x.fs.addDoc(x.fs.collection(x.db, 'enquiries'), rec); });
  }
  function thanks(msg) {
    form.innerHTML = '<div class="rs-thanks"><i class="fa-solid fa-circle-check"></i><h4>Thank you!</h4><p>' + esc(msg) + '</p><button type="button" class="rs-send" data-close>Close</button></div>';
    subEl.textContent = '';
  }
  form.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) close(); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, ok = f.name.value.trim() && /^[0-9+()\-\s]{7,}$/.test(f.phone.value.trim()) && (!f.email.value || f.email.checkValidity());
    form.querySelector('.rs-err').hidden = !!ok;
    if (!ok) return;
    if (f.website.value) { thanks('We have received your enquiry.'); return; }   // honeypot
    var rec = {
      request: current.label.slice(0, 120), name: f.name.value.trim().slice(0, 100), phone: f.phone.value.trim().slice(0, 30),
      email: f.email.value.trim().slice(0, 120), company: f.company.value.trim().slice(0, 150),
      product: (current.fieldLabel + ': ' + f.product.value).slice(0, 150), message: f.msg.value.trim().slice(0, 2000),
      status: 'New', via: via, page: location.pathname.split('/').pop() || 'index.html'
    };
    var text = 'Request: ' + rec.request + '\nName: ' + rec.name + '\nPhone: ' + rec.phone + (rec.email ? '\nEmail: ' + rec.email : '') +
      (rec.company ? '\nCompany / City: ' + rec.company : '') + '\n' + rec.product + '\n\nRequirement:\n' + (rec.message || '-');
    var btns = [].slice.call(form.querySelectorAll('.rs-send')), wasWa = via === 'wa';
    btns.forEach(function (b) { b.disabled = true; });
    var waWin = wasWa ? window.open('', '_blank') : null;      // open synchronously so popup blockers allow it
    saveEnquiry(rec).then(function () {
      if (waWin) waWin.location = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent('Hello RS Systems,\n' + text);
      thanks('Your enquiry has been submitted. Our team will contact you shortly.');
    }).catch(function () {
      // Firebase not configured or unreachable: fall back to WhatsApp / email so no lead is lost
      if (waWin) waWin.location = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent('Hello RS Systems,\n' + text);
      else window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(rec.request + ': ' + f.product.value) + '&body=' + encodeURIComponent(text);
      btns.forEach(function (b) { b.disabled = false; });
      close();
    });
  });

  modal.addEventListener('click', function (e) { if (e.target === modal || e.target.closest('.rs-modal-x')) close(); });
  document.addEventListener('keydown', function (e) {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      var els = [].slice.call(box.querySelectorAll('button, input, select, textarea')).filter(function (x) { return !x.disabled && x.offsetParent !== null; });
      if (!els.length) return;
      var first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  function labelOf(el) { return (el.getAttribute('data-popup') || el.textContent || '').replace(/\s+/g, ' ').trim(); }
  function isCta(el) {
    if (el.closest('#rs-modal, form') || el.hasAttribute('data-no-popup')) return false;
    var href = el.getAttribute('href') || '';
    var toContact = /^(contact\.html)?(#contact)?$/.test(href) || href === 'contact.html#contact';
    if (!toContact || href === '') return false;
    var t = labelOf(el);
    if (!t) return false;
    return el.hasAttribute('data-enquire') || el.hasAttribute('data-popup') || CTA.test(t);
  }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var el = e.target.closest('a[href]');
    if (!el || !isCta(el)) return;
    var product = el.getAttribute('data-enquire') || '';
    var label = labelOf(el);
    if (product && /^(enquire|get a quote|request a quote|get quote)$/i.test(label)) label = label + ' - ' + product;
    e.preventDefault(); e.stopPropagation();
    open(label, PRODUCTS.indexOf(product) > -1 ? product : (product ? 'Other' : ''));
    if (product && PRODUCTS.indexOf(product) < 0) subEl.textContent = 'Regarding: ' + product + '. Share your details and we will get back to you shortly.';
  }, true);
})();
