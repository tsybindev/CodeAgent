/* COD-10 landing v2 — vanilla JS: burger + overlay + counters + reveal */
(function () {
  'use strict';

  var burgerBtn = document.getElementById('burgerBtn');
  var mainNav = document.getElementById('mainNav');
  var overlay = document.getElementById('navOverlay');

  function isOpen() {
    return mainNav && mainNav.classList.contains('open');
  }

  function openNav() {
    if (!mainNav || !burgerBtn) return;
    mainNav.classList.add('open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    burgerBtn.setAttribute('aria-label', 'Close menu');
    if (overlay) overlay.hidden = false;
  }

  function closeNav() {
    if (!mainNav || !burgerBtn) return;
    mainNav.classList.remove('open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    burgerBtn.setAttribute('aria-label', 'Open menu');
    if (overlay) overlay.hidden = true;
  }

  if (burgerBtn && mainNav) {
    burgerBtn.addEventListener('click', function () {
      if (isOpen()) {
        closeNav();
      } else {
        openNav();
      }
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) {
        closeNav();
        burgerBtn.focus();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeNav);
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Reveal-on-load for hero elements only; stats use scroll-triggered reveal */
  var revealEls = document.querySelectorAll('.hero .reveal, .hero .revealPulse');
  var statRevealEls = document.querySelectorAll('.stats .stat.reveal');
  function showAll() {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }
  // Elements enter shortly after first paint
  requestAnimationFrame(function () {
    requestAnimationFrame(showAll);
  });

  /* Scroll-triggered reveal for stats footer sections */
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    statRevealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  } else if (statRevealEls.length) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    statRevealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* Animated stat counters, IntersectionObserver threshold 0.25 */
  var counters = document.querySelectorAll('.count');

  function formatValue(target, decimals, suffix) {
    var num = Number(target);
    if (suffix === 'ms') return Math.round(num) + 'ms';
    if (suffix === '%') return num.toFixed(decimals) + '%';
    if (suffix === 'M') return num.toFixed(decimals) + 'M';
    return String(num) + (suffix || '');
  }

  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduceMotion.matches) {
      el.textContent = formatValue(target, decimals, suffix);
      return;
    }
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - p, 3);
      var current = target * eased;
      if (suffix === 'ms') {
        el.textContent = Math.round(current) + 'ms';
      } else {
        el.textContent = current.toFixed(decimals) + suffix;
      }
      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatValue(target, decimals, suffix);
      }
    }
    requestAnimationFrame(step);
  }

  var counted = new WeakSet();
  if ('IntersectionObserver' in window && counters.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !counted.has(entry.target)) {
            counted.add(entry.target);
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    counters.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    counters.forEach(animateCount);
  }

  if (reduceMotion.matches) {
    counters.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-target'));
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var suffix = el.getAttribute('data-suffix') || '';
      el.textContent = formatValue(target, decimals, suffix);
    });
  }
})();
