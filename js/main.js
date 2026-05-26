/**
 * t-riseup site interactions
 * Loaded after i18n.js (which exposes window.i18n)
 */

document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitch();
  initDropdowns();
  initSmoothScroll();
  initImageFallback();
  initDragScroll();
  initScrollReveal();
  initCountUp();
  initHeaderAutoHide();
  initMobileMenu();
  initCaseFilter();
});

/* ============ Cases page filter (no-op if no chips on the page) ============ */
function initCaseFilter() {
  const chips = document.querySelectorAll('[data-case-filter]');
  const cards = document.querySelectorAll('[data-case-category]');
  if (!chips.length || !cards.length) return;
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.getAttribute('data-case-filter');
      chips.forEach((c) => c.classList.toggle('is-active', c === chip));
      cards.forEach((card) => {
        const cat = card.getAttribute('data-case-category');
        card.style.display = (filter === 'all' || filter === cat) ? '' : 'none';
      });
    });
  });
}

/* ============ Mobile menu drawer ============ */
function initMobileMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    document.body.classList.toggle('menu-open', open);
  };

  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));

  // Links close the menu (language button does not)
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 640) setOpen(false); });
}

/* ============ Auto-hide header (down = hide, up = show) ============ */
function initHeaderAutoHide() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const DELTA = 6;                                  // ignore tiny scroll jitter
  const topZone = () => header.offsetHeight || 80;  // always show near the very top
  let lastY = Math.max(window.scrollY, 0);
  let ticking = false;

  const update = () => {
    if (document.body.classList.contains('menu-open')) { ticking = false; return; }
    const y = Math.max(window.scrollY, 0);
    if (y <= topZone()) {
      header.classList.remove('site-header--hidden');
    } else if (y > lastY + DELTA) {
      header.classList.add('site-header--hidden');     // scrolling down
    } else if (y < lastY - DELTA) {
      header.classList.remove('site-header--hidden');   // scrolling up
    }
    lastY = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
}

/* ============ Scroll reveal: fade + slide-up per section ============ */
function initScrollReveal() {
  document.documentElement.classList.add('reveal-init');  // tell head safety-net we ran
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = document.querySelectorAll('main > section');

  const STEP = 80;     // ms between consecutive elements
  const MAX_DELAY = 600;

  // Layout wrappers we descend INTO so their children animate one by one
  // (title, desc, cards, images...). Everything else is a single reveal unit.
  const isGroup = (el) => {
    if (!el.children || el.children.length === 0) return false;
    if (el.classList.contains('case-grid')) return false;  // carousel: reveal as one block
    return Array.from(el.classList).some((cls) =>
      cls === 'container' ||
      cls === 'tag-list' ||
      cls === 'arch-rows' ||         // PMS/TMS 4-channel rows
      cls.includes('__inner') ||
      cls.includes('__head') ||      // __head, __head-text, __header, __header-text
      cls.includes('__content') ||   // cta-section__content
      cls.includes('__images') ||
      cls.includes('-grid')          // solution-grid, customer-grid, mode-grid, feat-grid (case-grid excluded above)
    );
  };

  const collect = (node, out) => {
    Array.from(node.children).forEach((child) => {
      if (isGroup(child)) collect(child, out);
      else out.push(child);
    });
  };

  const targets = [];
  sections.forEach((section) => {
    if (section.classList.contains('hero')) return;
    const units = [];
    collect(section, units);
    if (!units.length) units.push(section);
    units.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', Math.min(i * STEP, MAX_DELAY) + 'ms');
      targets.push(el);
    });
    section.classList.add('reveal-ready');  // unhide the section; units stay hidden via .reveal
  });

  // Hero: fade + slide-up for main copy → sub copy → buttons (plays on load,
  // since the hero is in view; background stays visible the whole time)
  document.querySelectorAll('.hero__title, .hero__subtitle, .hero__actions').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', (i * STEP) + 'ms');
    targets.push(el);
  });

  if (prefersReduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-revealed', 'reveal-done'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('is-revealed');
        io.unobserve(el);
        // Free the GPU-layer hint once the fade/slide finishes
        el.addEventListener('transitionend', () => el.classList.add('reveal-done'), { once: true });
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  targets.forEach((el) => io.observe(el));
}

/* ============ Hero stat count-up ============ */
function initCountUp() {
  const nums = document.querySelectorAll('.stat__num[data-count-to]');
  if (!nums.length) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const format = (n, comma) => (comma ? Math.round(n).toLocaleString('en-US') : String(Math.round(n)));

  const run = (el) => {
    const target = parseFloat(el.getAttribute('data-count-to'));
    const comma = el.hasAttribute('data-comma');
    if (prefersReduced || !('requestAnimationFrame' in window)) {
      el.textContent = format(target, comma);
      return;
    }
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);   // easeOutCubic
      el.textContent = format(target * eased, comma);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = format(target, comma);
    };
    requestAnimationFrame(tick);
  };

  // Start from 0 so the count-up is visible (HTML keeps final value as no-JS fallback)
  if (!prefersReduced) {
    nums.forEach((el) => { el.textContent = format(0, el.hasAttribute('data-comma')); });
  }

  if (prefersReduced || !('IntersectionObserver' in window)) {
    nums.forEach(run);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        run(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach((el) => io.observe(el));
}

/* ============ Mouse click-drag scrolling for carousels ============ */
function initDragScroll() {
  document.querySelectorAll('.case-grid, .tag-row').forEach((track) => {
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    track.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;   // touch/pen use native scrolling
      isDown = true;
      moved = false;
      startX = e.clientX;
      startScroll = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
      track.classList.add('is-dragging');
    });

    track.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startScroll - dx;
    });

    const end = (e) => {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('is-dragging');
      if (track.hasPointerCapture && e.pointerId != null) {
        try { track.releasePointerCapture(e.pointerId); } catch (_) {}
      }
    };
    track.addEventListener('pointerup', end);
    track.addEventListener('pointercancel', end);

    // Swallow the click that follows a drag so card links don't fire
    track.addEventListener('click', (e) => {
      if (moved) { e.preventDefault(); e.stopPropagation(); }
    }, true);

    // Block native image/link ghost-drag
    track.addEventListener('dragstart', (e) => e.preventDefault());
  });
}

/* ============ Image extension auto-fallback (.jpg / .png / .svg) ============ */
function initImageFallback() {
  const exts = ['.jpg', '.jpeg', '.png', '.svg'];
  const elements = document.querySelectorAll('[style*="background-image"]');
  elements.forEach((el) => {
    const match = el.style.backgroundImage.match(/url\(['"]?(.+?)['"]?\)/);
    if (!match) return;
    const url = match[1];
    const extMatch = url.match(/\.(jpg|jpeg|png|svg)$/i);
    if (!extMatch) return;

    const baseUrl = url.slice(0, url.length - extMatch[0].length);
    const currentExt = extMatch[0].toLowerCase();
    const tryList = exts.filter(e => e !== currentExt);

    const tryNext = (i) => {
      if (i >= tryList.length) {
        el.style.backgroundImage = '';  // all failed → show placeholder
        return;
      }
      const altUrl = baseUrl + tryList[i];
      const img = new Image();
      img.onload = () => { el.style.backgroundImage = `url('${altUrl}')`; };
      img.onerror = () => tryNext(i + 1);
      img.src = altUrl;
    };

    const test = new Image();
    test.onerror = () => tryNext(0);
    test.src = url;
  });
}

/* ============ Language toggle (KO ↔ EN) ============ */
function initLanguageSwitch() {
  const btns = document.querySelectorAll('.lang-switch');
  if (!btns.length || !window.i18n) return;

  const updateLabels = () => {
    const lang = window.i18n.getLang();
    document.querySelectorAll('.lang-switch [data-current-lang]').forEach((el) => {
      el.textContent = lang === 'ko' ? 'KO' : 'EN';
    });
  };

  updateLabels();

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = window.i18n.getLang() === 'ko' ? 'en' : 'ko';
      window.i18n.setLang(next);
      updateLabels();
    });
  });
}

/* ============ Header dropdowns ============ */
function initDropdowns() {
  document.querySelectorAll('[data-dropdown-trigger]').forEach((trigger) => {
    const name = trigger.getAttribute('data-dropdown-trigger');
    const menu = document.querySelector(`[data-dropdown="${name}"]`);
    if (!menu) return;

    // Click toggles (for mobile/touch)
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = menu.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !trigger.contains(e.target)) {
        menu.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    // ESC closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        menu.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* ============ Smooth anchor scrolling ============ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
