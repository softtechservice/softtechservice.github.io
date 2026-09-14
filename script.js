/* ==========================================================================
   SoftTech Service — interactions
   ========================================================================== */
(function () {
  'use strict';

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------------
     Navigation: stuck state + scroll progress
     ---------------------------------------------------------------------- */
  const navbar   = $('#navbar');
  const progress = $('#navProgress');

  function onScroll() {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('is-stuck', y > 8);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = max > 0 ? ((y / max) * 100).toFixed(2) + '%' : '0%';
    }

    const toTop = $('#toTop');
    if (toTop) toTop.classList.toggle('show', y > 700);
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  /* ----------------------------------------------------------------------
     Mobile menu
     ---------------------------------------------------------------------- */
  const burger = $('#hamburger');
  const menu   = $('#navMenu');

  function setMenu(open) {
    if (!menu || !burger) return;
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  }

  if (burger && menu) {
    burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));

    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('click', (e) => {
      if (!menu.classList.contains('open')) return;
      if (!e.target.closest('#navMenu') && !e.target.closest('#hamburger')) setMenu(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        setMenu(false);
        burger.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) setMenu(false);
    });
  }

  /* ----------------------------------------------------------------------
     Scroll reveal
     ---------------------------------------------------------------------- */
  const revealables = $$('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(el => el.classList.add('is-in'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealables.forEach(el => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------------------
     Animated counters
     ---------------------------------------------------------------------- */
  const counters = $$('[data-count]');

  function runCounter(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (reduceMotion) { el.textContent = String(target); return; }

    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countObserver.observe(el));
  } else {
    counters.forEach(runCounter);
  }

  /* ----------------------------------------------------------------------
     Active section highlight in nav
     ---------------------------------------------------------------------- */
  const navLinks = $$('.nav-menu a[href^="#"]');
  const sections = navLinks
    .map(a => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(s => sectionObserver.observe(s));
  }

  /* ----------------------------------------------------------------------
     Seamless marquee (clone the track)
     ---------------------------------------------------------------------- */
  const track = $('#mq1');
  if (track && !reduceMotion) {
    const clone = track.cloneNode(true);
    clone.removeAttribute('id');
    clone.setAttribute('aria-hidden', 'true');
    track.parentElement.appendChild(clone);
  }

  /* ----------------------------------------------------------------------
     Portfolio: category filter + live search
     ---------------------------------------------------------------------- */
  const searchBox  = $('#appSearch');
  const emptyState = $('#emptyState');
  const filterBtns = $$('.filter-btn');
  const cards      = $$('.app-card');

  let activeFilter = 'all';

  function haystack(card) {
    if (!card._hay) {
      card._hay = ((card.dataset.name || '') + ' ' + card.textContent).toLowerCase();
    }
    return card._hay;
  }

  function applyFilter() {
    const q = (searchBox ? searchBox.value : '').trim().toLowerCase();
    let shown = 0;

    cards.forEach(card => {
      const matchesCat = activeFilter === 'all' || card.dataset.cat === activeFilter;
      const matchesText = !q || haystack(card).includes(q);
      const show = matchesCat && matchesText;
      const wasHidden = card.classList.contains('is-hidden');

      card.classList.toggle('is-hidden', !show);

      if (show) {
        // Newly revealed cards get a staggered entrance.
        if (wasHidden && !reduceMotion) {
          card.classList.remove('pop');
          void card.offsetWidth;                     // restart the animation
          card.style.animationDelay = Math.min(shown * 24, 260) + 'ms';
          card.classList.add('pop');
        }
        shown++;
      }
    });

    if (emptyState) emptyState.classList.toggle('show', shown === 0);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter;
      filterBtns.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      applyFilter();
    });
  });

  if (searchBox) {
    let debounce;
    searchBox.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(applyFilter, 120);
    });
  }

  cards.forEach(card => {
    card.addEventListener('animationend', () => {
      card.classList.remove('pop');
      card.style.animationDelay = '';
    });
  });

  /* ----------------------------------------------------------------------
     Contact form — validates, then hands off to the visitor's mail client.
     This site is static, so there is no server to post to. Rather than
     pretend a message was sent, we compose a real, pre-filled email.
     ---------------------------------------------------------------------- */
  const form   = $('#contactForm');
  const status = $('#formStatus');
  const MAILTO = 'contect@softtechservice.site';

  const rules = {
    name:    { required: true,  test: v => v.trim().length >= 2,              msg: 'Please enter your name.' },
    email:   { required: true,  test: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), msg: 'Please enter a valid email address.' },
    phone:   { required: false, test: v => !v.trim() || /^[\d\s+()-]{6,20}$/.test(v.trim()), msg: 'Please enter a valid phone number.' },
    message: { required: true,  test: v => v.trim().length >= 10,             msg: 'Please add at least a sentence about the project.' }
  };

  function showError(field, message) {
    const box = $('#' + field.id + '-err');
    if (message) {
      field.setAttribute('aria-invalid', 'true');
      if (box) { box.textContent = message; box.classList.add('show'); }
    } else {
      field.setAttribute('aria-invalid', 'false');
      if (box) { box.textContent = ''; box.classList.remove('show'); }
    }
  }

  function validateField(id) {
    const field = $('#' + id);
    const rule  = rules[id];
    if (!field || !rule) return true;

    const value = field.value;
    if (rule.required && !value.trim()) {
      showError(field, rule.msg);
      return false;
    }
    if (!rule.test(value)) {
      showError(field, rule.msg);
      return false;
    }
    showError(field, null);
    return true;
  }

  if (form) {
    Object.keys(rules).forEach(id => {
      const field = $('#' + id);
      if (!field) return;
      field.addEventListener('blur', () => validateField(id));
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') validateField(id);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const results = Object.keys(rules).map(validateField);
      if (results.includes(false)) {
        const firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) {
          firstBad.focus();
          firstBad.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        }
        return;
      }

      const val = id => { const f = $('#' + id); return f ? f.value.trim() : ''; };
      const service = val('service') || 'General enquiry';

      const subject = 'Project enquiry — ' + service;
      const body = [
        'Name:    ' + val('name'),
        'Email:   ' + val('email'),
        'Phone:   ' + (val('phone') || '—'),
        'Service: ' + service,
        'Budget:  ' + (val('budget') || 'Not specified'),
        '',
        'Project details',
        '---------------',
        val('message'),
        '',
        '— Sent from softtechservice.site'
      ].join('\n');

      const href = 'mailto:' + MAILTO
                 + '?subject=' + encodeURIComponent(subject)
                 + '&body='    + encodeURIComponent(body);

      window.location.href = href;

      if (status) {
        status.className = 'form-status ok show';
        status.innerHTML =
          '<svg class="ic" aria-hidden="true"><use href="#i-circle-check"/></svg>' +
          '<span>Your email app should now be open with the message ready to send. ' +
          'If nothing happened, write to <a href="mailto:' + MAILTO + '">' + MAILTO + '</a> directly.</span>';
        status.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
      }
    });
  }

  /* ----------------------------------------------------------------------
     Back to top
     ---------------------------------------------------------------------- */
  const toTop = $('#toTop');
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ----------------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------------- */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

})();
