// ===================================================================
// ATH CI — SPA router + interactions
// ===================================================================

// SPLASH SCREEN
(function() {
  var splash = document.getElementById('splash');
  var progress = document.getElementById('splash-progress');
  var start = null;
  var duration = 5000;
  var circumference = 2 * Math.PI * 120;
  var hero = document.querySelector('.hero');
  var heroGrid = document.querySelector('.hero-grid');

  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:#000;z-index:99998;opacity:1;pointer-events:none;transition:opacity 0.8s ease;';
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  function animateRing(ts) {
    if (!start) start = ts;
    var elapsed = ts - start;
    var t = Math.min(elapsed / duration, 1);
    var offset = circumference * (1 - t);
    progress.setAttribute('stroke-dashoffset', offset);
    if (t < 1) {
      requestAnimationFrame(animateRing);
    } else {
      splash.style.transition = 'opacity 0.5s ease';
      splash.style.opacity = '0';
      setTimeout(function() {
        splash.style.display = 'none';
        if (hero) hero.classList.add('hero-animate');
        if (heroGrid) heroGrid.classList.add('hero-animate');
        setTimeout(function() {
          overlay.style.opacity = '0';
          document.body.style.overflow = '';
          setTimeout(function() { overlay.remove(); }, 800);
        }, 100);
      }, 500);
    }
  }

  requestAnimationFrame(animateRing);
})();

(function () {

  var ROUTES = ['accueil', 'services', 'apropos', 'realisations', 'contact', 'devis'];
  var DEFAULT_ROUTE = 'accueil';

  var views = {};
  ROUTES.forEach(function (r) {
    views[r] = document.getElementById('view-' + r);
  });

  function parseRoute() {
    var hash = window.location.hash.replace('#', '').trim();
    if (!hash) return DEFAULT_ROUTE;
    return ROUTES.indexOf(hash) !== -1 ? hash : DEFAULT_ROUTE;
  }

  function navigateTo(route) {
    if (ROUTES.indexOf(route) === -1) route = DEFAULT_ROUTE;
    if (window.location.hash.replace('#', '') === route) {
      renderRoute(route);
    } else {
      window.location.hash = route;
    }
  }

  window.addEventListener('hashchange', function () {
    renderRoute(parseRoute());
  });

  var prefersReducedMotionGlobal = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initRevealFor(viewEl) {
    if (!viewEl) return;
    var targets = viewEl.querySelectorAll(
      '.service-card, .why-item, .process-step, .manifest-row, .section-head, .contact-form, .contact-intro, .teaser-card, .real-card'
    );

    targets.forEach(function (el) { el.classList.add('reveal'); });

    if ('IntersectionObserver' in window && !prefersReducedMotionGlobal) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var delay = (i % 4) * 60;
            setTimeout(function () { el.classList.add('is-visible'); }, delay);
            io.unobserve(el);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      targets.forEach(function (el) { io.observe(el); });
    } else {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  function routeTitle(route) {
    var titles = {
      accueil: 'ATH CI — The Best Forwarder | Transit & Logistique',
      services: 'Nos prestations — ATH CI',
      apropos: 'Qui sommes-nous — ATH CI',
      contact: 'Contact — ATH CI',
      devis: 'Demander un devis — ATH CI',
      realisations: 'Réalisations — ATH CI'
    };
    return titles[route] || titles[DEFAULT_ROUTE];
  }

  function initCustomSelects() {
    document.querySelectorAll('.custom-select').forEach(function(select) {
      if (select.dataset.bound) return;
      select.dataset.bound = 'true';

      var trigger = select.querySelector('.custom-select-trigger');
      var options = select.querySelectorAll('.custom-option');
      var input = select.querySelector('input[type="hidden"]');

      trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        document.querySelectorAll('.custom-select.open').forEach(function(s) {
          if (s !== select) s.classList.remove('open');
        });
        select.classList.toggle('open');
      });

      options.forEach(function(option) {
        option.addEventListener('click', function(e) {
          e.stopPropagation();
          options.forEach(function(o) { o.classList.remove('selected'); });
          option.classList.add('selected');
          trigger.textContent = option.textContent;
          trigger.classList.remove('placeholder');
          input.value = option.getAttribute('data-value');
          select.classList.remove('open');
        });
      });
    });
  }

  function renderRoute(route, opts) {
    opts = opts || {};

    var navLinks = document.querySelectorAll('[data-route]');
    var mainNav = document.getElementById('main-nav');
    var navToggle = document.getElementById('nav-toggle');
    var body = document.body;

    Object.keys(views).forEach(function (key) {
      var el = views[key];
      if (!el) return;
      if (key === route) {
        el.classList.add('is-active');
      } else {
        el.classList.remove('is-active');
      }
    });

    navLinks.forEach(function (link) {
      var isMatch = link.getAttribute('data-route') === route;
      link.classList.toggle('is-active', isMatch);
      if (isMatch) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    document.title = routeTitle(route);

    if (!opts.skipScroll) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    // Fermer le menu mobile
    if (mainNav) mainNav.classList.remove('open');
    if (navToggle) {
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
    body.classList.remove('nav-open');

    initRevealFor(views[route]);

    // Reset animations contact
    var contactIntro = document.querySelector('.contact-intro');
    var contactFormSimple = document.querySelector('#contact-form-simple');
    if (contactIntro) {
      contactIntro.classList.remove('is-visible', 'reveal');
      void contactIntro.offsetWidth;
    }
    if (contactFormSimple) {
      contactFormSimple.classList.remove('is-visible', 'reveal');
      void contactFormSimple.offsetWidth;
    }

    setTimeout(function() {
      var pageHero = views[route] ? views[route].querySelector('.page-hero') : null;
      if (pageHero) {
        pageHero.classList.remove('hero-animate');
        void pageHero.offsetWidth;
        pageHero.classList.add('hero-animate');
      }
    }, 50);

    if (route === 'devis') {
      setTimeout(function() {
        initCustomSelects();
      }, 100);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {

    var navToggle = document.getElementById('nav-toggle');
    var mainNav = document.getElementById('main-nav');
    var body = document.body;

    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    if (!window.location.hash) {
      window.location.hash = 'accueil';
    }
    renderRoute(parseRoute(), { skipScroll: true });
    
document.querySelectorAll('[data-route]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    var route = this.getAttribute('data-route');
    navigateTo(route);
  });
});
    // -------------------------------------------------------
    // BURGER MENU
    // -------------------------------------------------------
    if (navToggle && mainNav) {
  var touchHandled = false;

  function openNav() {
    mainNav.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    body.classList.add('nav-open');
  }

  function closeNav() {
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('nav-open');
  }

  navToggle.addEventListener('touchstart', function(e) {
    e.preventDefault();
    e.stopPropagation();
    touchHandled = true;
    mainNav.classList.contains('open') ? closeNav() : openNav();
    setTimeout(function() { touchHandled = false; }, 500);
  }, { passive: false });

  navToggle.addEventListener('click', function(e) {
    if (touchHandled) return;
    e.stopPropagation();
    mainNav.classList.contains('open') ? closeNav() : openNav();
  });

  document.addEventListener('click', function(e) {
    if (touchHandled) return;
    if (body.classList.contains('nav-open') &&
        !mainNav.contains(e.target) &&
        !navToggle.contains(e.target)) {
      closeNav();
    }
  });

  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeNav();
  });
}

    // -------------------------------------------------------
    // PACKETS ANIMATION
    // -------------------------------------------------------
    var routeIds = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9'];
    var packetsLayer = document.querySelector('.packets');
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (packetsLayer && !prefersReducedMotion) {
      routeIds.forEach(function (id, idx) {
        var path = document.getElementById(id);
        if (!path) return;
        var len = path.getTotalLength();

        var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('r', '3');
        dot.setAttribute('fill', '#ffffff');
        dot.style.filter = 'drop-shadow(0 0 4px rgba(255,255,255,0.85))';
        packetsLayer.appendChild(dot);

        var tripDuration = 4000 + idx * 400;
        var pauseDuration = 2000;
        var fadeDuration = 400;
        var cycleDuration = (tripDuration + pauseDuration) * 2;
        var delay = idx * 700;
        var startTime = null;

        function frame(ts) {
          if (startTime === null) startTime = ts;
          var elapsed = ts - startTime - delay;
          if (elapsed < 0) { requestAnimationFrame(frame); return; }

          var cyclePos = elapsed % cycleDuration;
          var t = 0;
          var opacity = 1;

          if (cyclePos < tripDuration) {
            t = cyclePos / tripDuration;
            if (cyclePos < fadeDuration) {
              opacity = cyclePos / fadeDuration;
            } else if (cyclePos > tripDuration - fadeDuration) {
              opacity = (tripDuration - cyclePos) / fadeDuration;
            }
          } else if (cyclePos < tripDuration + pauseDuration) {
            t = 1;
            opacity = 0;
          } else if (cyclePos < tripDuration * 2 + pauseDuration) {
            var retourPos = cyclePos - tripDuration - pauseDuration;
            t = 1 - retourPos / tripDuration;
            if (retourPos < fadeDuration) {
              opacity = retourPos / fadeDuration;
            } else if (retourPos > tripDuration - fadeDuration) {
              opacity = (tripDuration - retourPos) / fadeDuration;
            }
          } else {
            t = 0;
            opacity = 0;
          }

          var point = path.getPointAtLength(t * len);
          dot.setAttribute('cx', point.x);
          dot.setAttribute('cy', point.y);
          dot.setAttribute('opacity', opacity);
          requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
      });
    }

    // -------------------------------------------------------
    // FORMS
    // -------------------------------------------------------
    function bindForm(formId, noteId) {
      var form = document.getElementById(formId);
      var note = document.getElementById(noteId);
      if (!form || !note) return;

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var nameField = form.querySelector('[name="name"]');
        var emailField = form.querySelector('[name="email"]');
        var name = nameField ? nameField.value.trim() : '';
        var email = emailField ? emailField.value.trim() : '';

        if (!name || !email) {
          note.textContent = 'Merci de renseigner votre nom et votre e-mail.';
          note.style.color = '#C0392B';
          return;
        }

        var submitBtn = form.querySelector('button[type="submit"] .btn-text');
        var originalText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) submitBtn.textContent = 'Envoi en cours...';

        setTimeout(function () {
          note.style.color = '';
          note.textContent = 'Merci ' + name.split(' ')[0] + ', votre demande a bien été enregistrée. Notre équipe vous recontacte sous 24h.';
          if (submitBtn) submitBtn.textContent = originalText;
          form.reset();
        }, 900);
      });
    }

    bindForm('contact-form', 'form-note');
    bindForm('contact-form-simple', 'form-note-simple');

    // -------------------------------------------------------
    // HEADER SHADOW
    // -------------------------------------------------------
    var header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', function () {
        header.style.boxShadow = window.scrollY > 8 ? '0 6px 24px rgba(16,19,26,0.06)' : 'none';
      }, { passive: true });
    }

    // -------------------------------------------------------
    // FILTRES RÉALISATIONS
    // -------------------------------------------------------
    var filterBtns = document.querySelectorAll('.real-filter');
    var realCards = document.querySelectorAll('.real-card');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var filter = btn.getAttribute('data-filter');
        realCards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-type') === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // -------------------------------------------------------
    // CUSTOM SELECT
    // -------------------------------------------------------
    initCustomSelects();

    document.addEventListener('click', function() {
      document.querySelectorAll('.custom-select.open').forEach(function(s) {
        s.classList.remove('open');
      });
    });

  });

})();
