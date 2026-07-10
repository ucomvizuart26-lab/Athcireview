var ROUTES_G = ['accueil', 'services', 'apropos', 'realisations', 'partenaires', 'contact', 'devis'];

window.goTo = function(route) {
  document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('is-active'); });
  var el = document.getElementById('view-' + route);
  if (el) el.classList.add('is-active');
  document.querySelectorAll('[data-route]').forEach(function(l) {
    l.classList.toggle('is-active', l.getAttribute('data-route') === route);
  });
  var nav = document.getElementById('main-nav');
  var toggle = document.getElementById('nav-toggle');
  if (nav) nav.classList.remove('open');
  if (toggle) { toggle.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); }
  document.body.classList.remove('nav-open');
  window.location.hash = route;
  window.scrollTo(0,0);
};

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

  var ROUTES = ['accueil', 'services', 'apropos', 'realisations', 'partenaires', 'contact', 'devis'];
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
    renderRoute(route);
    window.location.hash = route;
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
      realisations: 'Réalisations — ATH CI',
      partenaires: 'Nos partenaires — ATH CI',
      contact: 'Contact — ATH CI',
      devis: 'Demander un devis — ATH CI'
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
      if (key === route) { el.classList.add('is-active'); }
      else { el.classList.remove('is-active'); }
    });

    navLinks.forEach(function (link) {
      var isMatch = link.getAttribute('data-route') === route;
      link.classList.toggle('is-active', isMatch);
      if (isMatch) { link.setAttribute('aria-current', 'page'); }
      else { link.removeAttribute('aria-current'); }
    });

    document.title = routeTitle(route);
    if (!opts.skipScroll) { window.scrollTo({ top: 0, behavior: 'auto' }); }
    if (mainNav) mainNav.classList.remove('open');
    if (navToggle) { navToggle.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); }
    body.classList.remove('nav-open');
    initRevealFor(views[route]);

    setTimeout(function() {
      var pageHero = views[route] ? views[route].querySelector('.page-hero') : null;
      if (pageHero) {
        pageHero.classList.remove('hero-animate');
        void pageHero.offsetWidth;
        pageHero.classList.add('hero-animate');
      }
    }, 50);

    if (route === 'devis') {
      setTimeout(function() { initCustomSelects(); }, 100);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {

    var navToggle = document.getElementById('nav-toggle');
    var mainNav = document.getElementById('main-nav');
    var body = document.body;
    var touchHandled = false;

    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    if (!window.location.hash) { window.location.hash = 'accueil'; }
    renderRoute(parseRoute(), { skipScroll: true });

    /* ── BURGER MENU ── */
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

    if (navToggle && mainNav) {
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

    document.querySelectorAll('[data-route]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var route = this.getAttribute('data-route');
        if (this.closest('#main-nav')) closeNav();
        navigateTo(route);
      });
    });

    /* ── PACKETS ANIMATION ── */
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
            if (cyclePos < fadeDuration) { opacity = cyclePos / fadeDuration; }
            else if (cyclePos > tripDuration - fadeDuration) { opacity = (tripDuration - cyclePos) / fadeDuration; }
          } else if (cyclePos < tripDuration + pauseDuration) {
            t = 1; opacity = 0;
          } else if (cyclePos < tripDuration * 2 + pauseDuration) {
            var retourPos = cyclePos - tripDuration - pauseDuration;
            t = 1 - retourPos / tripDuration;
            if (retourPos < fadeDuration) { opacity = retourPos / fadeDuration; }
            else if (retourPos > tripDuration - fadeDuration) { opacity = (tripDuration - retourPos) / fadeDuration; }
          } else {
            t = 0; opacity = 0;
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

    /* ── FORMS ── */
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

    /* ── HEADER SHADOW ── */
    var header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', function () {
        header.style.boxShadow = window.scrollY > 8 ? '0 6px 24px rgba(16,19,26,0.06)' : 'none';
      }, { passive: true });
    }

    /* ── CUSTOM SELECT ── */
    initCustomSelects();
    document.addEventListener('click', function() {
      document.querySelectorAll('.custom-select.open').forEach(function(s) {
        s.classList.remove('open');
      });
    });

  });

  /* ── GALERIES LIGHTBOX ── */
  var galleries = {
    negoce: [
      { src: 'https://i.ibb.co/jk5NfhPG/Entrepo-ts-exterieur-Anyama.jpg', label: 'Entrepôts extérieur — Anyama' },
      { src: 'https://i.ibb.co/CjSFKW3/IMG-20260228-WA0005.jpg', label: 'Entrepôts intérieur — Anyama' },
      { src: 'https://i.ibb.co/60R2y5qT/Chargement-coque-de-palmiste.jpg', label: 'Chargement coque de palmiste' },
      { src: 'https://i.ibb.co/GjYHYRD/Chargement-coque-de-palmiste-2.jpg', label: 'Chargement coque de palmiste 2' },
      { src: 'https://i.ibb.co/bMVxz6Rv/TSR-10-en-vrac.jpg', label: 'TSR 10 en vrac' },
      { src: 'https://i.ibb.co/wNtWwgTK/TSR10-sur-palettes.jpg', label: 'TSR 10 sur palettes' },
      { src: 'https://i.ibb.co/TB5rKG5Z/Pommes-et-Noix-de-cajou.jpg', label: 'Pommes et noix de cajou' },
      { src: 'https://i.ibb.co/rR12w7f3/Noix-de-cajou-se-che-es.jpg', label: 'Noix de cajou' },
      { src: 'https://i.ibb.co/Kj6WVqq1/Ope-ration-Hinterland.jpg', label: 'Opération Hinterland' },
      { src: 'https://i.ibb.co/kgBWYWt3/Ope-ration-Hinterland-2.jpg', label: 'Opération Hinterland 2' },
      { src: 'https://i.ibb.co/tTt4sWwZ/Transport.jpg', label: 'Transport' }
    ],
    vehicules: [
      { src: 'https://i.ibb.co/ds3gvrJV/Jetour-exte-rieur.jpg', label: 'Véhicule dédouané et immatriculé — Jetour X70 plus' },
      { src: 'https://i.ibb.co/KTTpKgJ/Jetour-inte-rieur.jpg', label: 'Jetour X70 plus — intérieur' },
      { src: 'https://i.ibb.co/1fr0m8GL/Chery-Tiggo-3x.jpg', label: 'Chery Tiggo 3x' },
      { type: 'youtube', src: 'uiu85CyyJIc', label: 'Livraison véhicule — ATH CI' },
      { type: 'youtube', src: 'tI7PA8BLjYI', label: 'Présentation véhicule — ATH CI' }
    ]
  };

  var lbData = [];
  var lbCurrent = 0;
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbLabel = document.getElementById('lb-label');

  function openGallery(name, index) {
  lbData = galleries[name];
  lbCurrent = index || 0;
  showSlide();
  lb.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
}

  function showSlide() {
    var item = lbData[lbCurrent];
    lbLabel.textContent = (lbCurrent + 1) + ' / ' + lbData.length + ' — ' + item.label;
    if (item.type === 'youtube') {
      lbImg.style.display = 'none';
      var existing = document.getElementById('lb-yt');
      if (existing) existing.remove();
      var iframe = document.createElement('iframe');
      iframe.id = 'lb-yt';
      iframe.src = 'https://www.youtube.com/embed/' + item.src + '?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3&enablejsapi=1';
      iframe.allow = 'autoplay; fullscreen';
      iframe.style.cssText = 'width:90vw;max-width:900px;height:50vw;max-height:500px;border:none;border-radius:8px;';
      lbImg.parentNode.insertBefore(iframe, lbImg);
    } else {
      lbImg.style.display = 'block';
      var yt = document.getElementById('lb-yt');
      if (yt) yt.remove();
      lbImg.src = item.src;
      lbImg.alt = item.label;
    }
  }

  function closeLb() {
  lb.style.display = 'none';
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';
  var yt = document.getElementById('lb-yt');
  if (yt) yt.remove();
}

  document.querySelectorAll('.real-gallery-card').forEach(function(el) {
    el.addEventListener('click', function() {
      openGallery(el.getAttribute('data-gallery'), 0);
    });
  });

  document.getElementById('lb-prev').addEventListener('click', function() {
    lbCurrent = (lbCurrent - 1 + lbData.length) % lbData.length;
    showSlide();
  });

  document.getElementById('lb-next').addEventListener('click', function() {
    lbCurrent = (lbCurrent + 1) % lbData.length;
    showSlide();
  });

  document.getElementById('lb-close').addEventListener('click', closeLb);

  lb.addEventListener('click', function(e) {
    if (e.target === lb) closeLb();
  });

  window.addEventListener('keydown', function(e) {
    if (!lb || lb.style.display === 'none') return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') { lbCurrent = (lbCurrent - 1 + lbData.length) % lbData.length; showSlide(); }
    if (e.key === 'ArrowRight') { lbCurrent = (lbCurrent + 1) % lbData.length; showSlide(); }
  });

  var touchX = 0;
  lb.addEventListener('touchstart', function(e) { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function(e) {
    var diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      lbCurrent = diff > 0 ? (lbCurrent + 1) % lbData.length : (lbCurrent - 1 + lbData.length) % lbData.length;
      showSlide();
    }
  }, { passive: true });

})();