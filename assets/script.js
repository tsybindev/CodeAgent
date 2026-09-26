/**
 * AI Development Pipeline — Interactive Scripts
 * Vanilla JS: burger menu, scroll reveal, prefers-reduced-motion
 */

(function () {
  'use strict';

  /* ===== Burger Menu ===== */
  const burgerBtn = document.getElementById('burgerBtn');
  const mainNav = document.getElementById('mainNav');

  if (burgerBtn && mainNav) {
    burgerBtn.addEventListener('click', function () {
      const isOpen = burgerBtn.getAttribute('aria-expanded') === 'true';
      burgerBtn.setAttribute('aria-expanded', String(!isOpen));
      mainNav.classList.toggle('open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close nav when a link is clicked
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        burgerBtn.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        burgerBtn.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('open');
        document.body.style.overflow = '';
        burgerBtn.focus();
      }
    });
  }

  /* ===== Scroll Reveal ===== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ===== Prefers Reduced Motion ===== */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (prefersReducedMotion.matches) {
    // Show all elements immediately, disable scroll-reveal animations
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ===== Handle Hero background image fallback ===== */
  const heroBgImg = document.querySelector('.hero-bg-img');
  if (heroBgImg) {
    heroBgImg.addEventListener('error', function () {
      this.style.display = 'none';
      const heroBg = document.querySelector('.hero-bg');
      if (heroBg) {
        heroBg.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1e 50%, #000000 100%)';
      }
    });
  }

  /* ===== Smooth scroll for anchor links ===== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

})();
