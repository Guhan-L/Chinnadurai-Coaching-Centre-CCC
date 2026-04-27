/* ═══════════════════════════════════════════════════
   CHINNADURAI COACHING CENTRE — SCRIPT
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── NAVBAR SCROLL SHADOW ────────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 16) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* ── MOBILE HAMBURGER ────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ── SCROLL ANIMATION (fade-up) ─────────────────── */
  const fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -48px 0px' }
    );

    fadeEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: show all
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── ACTIVE NAV HIGHLIGHT ON SCROLL ─────────────── */
  const sections    = document.querySelectorAll('section[id], div[id]');
  const navAnchors  = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveNav() {
    let current = '';
    sections.forEach(function (section) {
      const top = section.getBoundingClientRect().top;
      if (top <= 90) current = section.getAttribute('id');
    });

    navAnchors.forEach(function (a) {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });

  /* ── SMOOTH OFFSET SCROLL FOR FIXED NAVBAR ───────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const offset = navbar ? navbar.offsetHeight + 16 : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── FORM SUBMISSION FEEDBACK ────────────────────── */
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', function (e) {
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;

      // Optimistic UI — actual submission handled by Formspree
      btn.textContent = 'Sending…';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      // Re-enable after timeout in case of issues
      setTimeout(function () {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '';
      }, 6000);
    });
  }

  /* ── COUNTER ANIMATION (trust badges) ───────────── */
  function animateCount(el, target, suffix) {
    let start = 0;
    const duration = 1400;
    const step = Math.ceil(target / (duration / 16));

    const timer = setInterval(function () {
      start = Math.min(start + step, target);
      el.textContent = start + suffix;
      if (start >= target) clearInterval(timer);
    }, 16);
  }

  const trustBadges = document.querySelectorAll('.trust-badge strong');
  let countersStarted = false;

  function startCounters() {
    if (countersStarted) return;
    const firstBadge = document.querySelector('.trust-badges');
    if (!firstBadge) return;

    const rect = firstBadge.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      countersStarted = true;
      const targets = [28, 1000, 100];
      const suffixes = ['+', '+', '%'];
      trustBadges.forEach(function (el, i) {
        animateCount(el, targets[i], suffixes[i]);
      });
    }
  }

  window.addEventListener('scroll', startCounters, { passive: true });
  startCounters();

  /* ── GALLERY LIGHTBOX (simple) ───────────────────── */
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(function (item) {
    item.addEventListener('click', function () {
      const img = item.querySelector('img');
      if (!img) return;

      const overlay = document.createElement('div');
      overlay.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:9999',
        'background:rgba(15,23,42,.92)', 'display:flex',
        'align-items:center', 'justify-content:center',
        'cursor:zoom-out', 'backdrop-filter:blur(8px)',
        'animation:fadeInOverlay .2s ease'
      ].join(';');

      const style = document.createElement('style');
      style.textContent = '@keyframes fadeInOverlay{from{opacity:0}to{opacity:1}}';
      document.head.appendChild(style);

      const clone = new Image();
      clone.src = img.src;
      clone.alt = img.alt;
      clone.style.cssText = [
        'max-width:92vw', 'max-height:88vh',
        'object-fit:contain', 'border-radius:12px',
        'box-shadow:0 40px 100px rgba(0,0,0,.5)'
      ].join(';');

      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '✕';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.style.cssText = [
        'position:absolute', 'top:20px', 'right:24px',
        'background:rgba(255,255,255,.1)', 'border:1px solid rgba(255,255,255,.2)',
        'color:#fff', 'font-size:1.2rem', 'width:44px', 'height:44px',
        'border-radius:50%', 'cursor:pointer', 'display:flex',
        'align-items:center', 'justify-content:center'
      ].join(';');

      overlay.appendChild(clone);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      function closeLightbox() {
        overlay.remove();
        style.remove();
        document.body.style.overflow = '';
      }

      overlay.addEventListener('click', closeLightbox);
      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeLightbox();
      });

      document.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Escape') {
          closeLightbox();
          document.removeEventListener('keydown', onKey);
        }
      });
    });
  });

})();