/* ============================================
   Flafka Marketing Site — JavaScript
   ============================================ */

(function () {
  'use strict';

  // --- Intersection Observer for scroll animations ---
  function initAnimations() {
    var els = document.querySelectorAll('.animate-in');
    if (!els.length) return;

    // prefers-reduced-motion: make everything visible immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    // Defer until after first paint — ensures getBoundingClientRect values are stable and the IO root
    // geometry is correct before any observations are registered.
    requestAnimationFrame(function () {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
        // rootMargin '0px 0px 300px 0px' pre-triggers elements 300px before they
        // reach the viewport bottom edge — ensures scroll animations fire early enough
        // to prevent visible blank flashes on normal scroll speed.
      }, { threshold: 0, rootMargin: '0px 0px 300px 0px' });

      els.forEach(function (el) { observer.observe(el); });

      // Safety fallback: if IO hasn't made all elements visible within 3 seconds
      // mark remaining elements visible so sections never stay blank indefinitely.
      setTimeout(function () {
        els.forEach(function (el) {
          if (!el.classList.contains('visible')) {
            el.classList.add('visible');
          }
        });
      }, 3000);
    });
  }

  // --- Mobile nav toggle ---
  function initMobileNav() {
    var btn = document.querySelector('.nav__hamburger');
    var menu = document.querySelector('.nav__mobile');
    if (!btn || !menu) return;

    // SITE-UX-10: Mark active page in mobile nav
    var currentPage = location.pathname.split('/').pop() || 'index.html';
    menu.querySelectorAll('a').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

    function closeMenu() {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = '&#x2630;';
      document.body.style.overflow = '';
    }

    function openMenu() {
      menu.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      btn.innerHTML = '&#x2715;';
      document.body.style.overflow = 'hidden';
      // Focus the first link for accessibility
      var firstLink = menu.querySelector('a');
      if (firstLink) firstLink.focus();
    }

    btn.addEventListener('click', function () {
      if (menu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu();
        btn.focus();
      }
    });
  }

  // --- FAQ accordion ---
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(function (question) {
      question.addEventListener('click', function () {
        var item = this.closest('.faq-item');
        var wasOpen = item.classList.contains('open');

        // Close all FAQ items in the same parent
        item.parentElement.querySelectorAll('.faq-item').forEach(function (i) {
          i.classList.remove('open');
        });

        if (!wasOpen) {
          item.classList.add('open');
        }
      });
    });
  }

  // --- Comparison page tabs ---
  function initCompareTabs() {
    var tabs = document.querySelectorAll('.compare-tab');
    var sections = document.querySelectorAll('.h2h');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = this.getAttribute('data-target');

        tabs.forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');

        if (target === 'all') {
          sections.forEach(function (s) { s.style.display = ''; });
        } else {
          sections.forEach(function (s) {
            s.style.display = s.getAttribute('data-competitor') === target ? '' : 'none';
          });
        }
      });
    });
  }

  // --- Demo page filter ---
  function initDemoFilters() {
    var btns = document.querySelectorAll('.demo-filter-btn');
    var cards = document.querySelectorAll('.video-card');
    if (!btns.length) return;

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = this.getAttribute('data-category');
        btns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        cards.forEach(function (card) {
          if (cat === 'all' || card.getAttribute('data-category') === cat) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Nav scroll effect ---
  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var scrolled = false;
    window.addEventListener('scroll', function () {
      var isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        scrolled = isScrolled;
        nav.style.borderBottomColor = scrolled
          ? 'var(--border-default)'
          : 'var(--border-subtle)';
      }
    }, { passive: true });
  }

  // --- Smooth scroll for anchor links ---
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (id === '#') return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // --- Active nav link highlight ---
  function initActiveNav() {
    var path = window.location.pathname;
    var filename = path.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav__links a').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === filename || (filename === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  // --- Counter animation for hero stats ---
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var isDecimal = el.getAttribute('data-decimal') === 'true';
        var target = isDecimal ? parseFloat(el.getAttribute('data-count')) : parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var prefix = el.getAttribute('data-prefix') || '';
        var duration = 1200;
        var start = 0;
        var startTime = null;

        function animate(timestamp) {
          if (!startTime) startTime = timestamp;
          var progress = Math.min((timestamp - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
          var current = start + (target - start) * eased;
          if (isDecimal) {
            el.textContent = prefix + current.toFixed(1) + suffix;
          } else {
            el.textContent = prefix + Math.round(current).toLocaleString() + suffix;
          }
          if (progress < 1) requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  // --- Pricing toggle (monthly / annual) ---
  function initPricingToggle() {
    var toggle = document.getElementById('billing-toggle');
    var teamPrice = document.getElementById('team-price');
    var saveBadge = document.getElementById('save-badge');
    var labelMonthly = document.getElementById('toggle-monthly');
    var labelAnnual = document.getElementById('toggle-annual');
    if (!toggle || !teamPrice) return;

    var isAnnual = false;

    function update() {
      toggle.setAttribute('aria-checked', isAnnual ? 'true' : 'false');
      teamPrice.style.opacity = '0';
      setTimeout(function () {
        teamPrice.textContent = isAnnual ? '$15' : '$19';
        teamPrice.style.opacity = '1';
      }, 150);
      if (saveBadge) {
        saveBadge.classList.toggle('visible', isAnnual);
      }
      if (labelMonthly) labelMonthly.classList.toggle('active', !isAnnual);
      if (labelAnnual) labelAnnual.classList.toggle('active', isAnnual);
    }

    toggle.addEventListener('click', function () {
      isAnnual = !isAnnual;
      update();
    });
    toggle.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        isAnnual = !isAnnual;
        update();
      }
    });

    if (labelMonthly) {
      labelMonthly.addEventListener('click', function () {
        isAnnual = false;
        update();
      });
    }
    if (labelAnnual) {
      labelAnnual.addEventListener('click', function () {
        isAnnual = true;
        update();
      });
    }
  }

  // --- Trial form ---
  function initTrialForm() {
    var btn = document.getElementById('start-trial-btn');
    var form = document.getElementById('trial-form');
    var formEl = document.getElementById('trial-form-el');
    var success = document.getElementById('trial-success');
    if (!btn || !form) return;

    btn.addEventListener('click', function () {
      form.classList.toggle('open');
    });

    // Setup tabs
    document.querySelectorAll('.trial-setup__tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = this.getAttribute('data-setup');
        document.querySelectorAll('.trial-setup__tab').forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');
        var dockerContent = document.getElementById('setup-docker');
        var tauriContent = document.getElementById('setup-tauri');
        if (dockerContent) dockerContent.style.display = target === 'docker' ? '' : 'none';
        if (tauriContent) tauriContent.style.display = target === 'tauri' ? '' : 'none';
      });
    });

    if (formEl) {
      formEl.addEventListener('submit', function (e) {
        e.preventDefault();
        var hp = document.getElementById('trial-website');
        if (hp && hp.value) return;

        var email = document.getElementById('trial-email');
        if (!email || !validateEmail(email.value)) {
          showFieldError(email, 'Please enter a valid work email');
          return;
        }
        clearFieldError(email);

        var data = {
          email: email.value,
          company: (document.getElementById('trial-company') || {}).value || '',
          team_size: (document.getElementById('trial-size') || {}).value || '',
          timestamp: new Date().toISOString()
        };

        try { localStorage.setItem('flafka_trial', JSON.stringify(data)); } catch (err) { /* no-op */ }

        // Also open mailto as backup lead capture (CRO mandatory fix)
        var mailBody = 'Trial signup:\nEmail: ' + data.email + '\nCompany: ' + data.company + '\nTeam size: ' + data.team_size;
        var mailLink = 'mailto:hello@flafka.dev?subject=' + encodeURIComponent('Trial Signup: ' + data.email) + '&body=' + encodeURIComponent(mailBody);
        window.open(mailLink, '_blank');

        formEl.style.display = 'none';
        if (success) success.classList.add('visible');
      });
    }
  }

  // --- Contact form ---
  function initContactForm() {
    var formEl = document.getElementById('contact-form');
    var success = document.getElementById('contact-success');
    if (!formEl) return;

    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = document.getElementById('contact-website');
      if (hp && hp.value) return;

      var valid = true;
      var name = document.getElementById('contact-name');
      var email = document.getElementById('contact-email');
      var message = document.getElementById('contact-message');

      if (!name || !name.value.trim()) {
        showFieldError(name, 'Name is required');
        valid = false;
      } else { clearFieldError(name); }

      if (!email || !validateEmail(email.value)) {
        showFieldError(email, 'Please enter a valid email');
        valid = false;
      } else { clearFieldError(email); }

      if (!message || !message.value.trim()) {
        showFieldError(message, 'Message is required');
        valid = false;
      } else { clearFieldError(message); }

      if (!valid) return;

      var company = (document.getElementById('contact-company') || {}).value || '';
      var mailBody = 'Name: ' + name.value + '\nEmail: ' + email.value + '\nCompany: ' + company + '\n\nMessage:\n' + message.value;
      var mailLink = 'mailto:hello@flafka.dev?subject=' + encodeURIComponent('Contact from ' + name.value) + '&body=' + encodeURIComponent(mailBody);
      window.open(mailLink, '_blank');

      formEl.style.display = 'none';
      if (success) success.classList.add('visible');
    });
  }

  // --- Form helpers ---
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFieldError(input, message) {
    if (!input) return;
    var field = input.closest('.form-field');
    if (field) {
      field.classList.add('form-field--error');
      var err = field.querySelector('.form-field__error');
      if (err) err.textContent = message;
    }
    input.focus();
  }

  function clearFieldError(input) {
    if (!input) return;
    var field = input.closest('.form-field');
    if (field) {
      field.classList.remove('form-field--error');
      var err = field.querySelector('.form-field__error');
      if (err) err.textContent = '';
    }
  }

  // --- Newsletter forms (W78-4) ---
  function initNewsletterForms() {
    var forms = document.querySelectorAll('[data-newsletter]');
    if (!forms.length) return;

    // Check if already subscribed
    var subscribed = false;
    try { subscribed = localStorage.getItem('flafka_newsletter') === 'subscribed'; } catch (e) { /* no-op */ }

    forms.forEach(function (form) {
      var wrapper = form.closest('.callout') || form.parentElement;
      var successEl = wrapper ? wrapper.querySelector('.newsletter-form__success') : null;
      var errorEl = form.querySelector('.newsletter-form__error');

      // If already subscribed, show success state immediately
      if (subscribed) {
        form.style.display = 'none';
        if (successEl) successEl.classList.add('visible');
        return;
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Honeypot check
        var hp = form.querySelector('[name="_gotcha"]');
        if (hp && hp.value) return;

        var emailInput = form.querySelector('[name="email"]');
        var consentInput = form.querySelector('[name="consent"]');

        // Validate email
        if (!emailInput || !validateEmail(emailInput.value)) {
          if (errorEl) {
            errorEl.textContent = 'Please enter a valid email address.';
            errorEl.classList.add('visible');
          }
          if (emailInput) emailInput.focus();
          return;
        }

        // Validate consent
        if (consentInput && !consentInput.checked) {
          if (errorEl) {
            errorEl.textContent = 'Please agree to receive product updates.';
            errorEl.classList.add('visible');
          }
          return;
        }

        // Clear error
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.classList.remove('visible');
        }

        // Submit via fetch (progressive enhancement: form action works without JS too)
        var submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
        }

        var formData = new FormData(form);

        fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        }).then(function (response) {
          if (response.ok) {
            // Mark as subscribed in localStorage
            try { localStorage.setItem('flafka_newsletter', 'subscribed'); } catch (err) { /* no-op */ }

            // Show success on ALL newsletter forms on page
            form.style.display = 'none';
            if (successEl) successEl.classList.add('visible');

            // Hide other forms too
            document.querySelectorAll('[data-newsletter]').forEach(function (otherForm) {
              otherForm.style.display = 'none';
              var otherWrapper = otherForm.closest('.callout') || otherForm.parentElement;
              var otherSuccess = otherWrapper ? otherWrapper.querySelector('.newsletter-form__success') : null;
              if (otherSuccess) otherSuccess.classList.add('visible');
            });
          } else {
            throw new Error('Form submission failed');
          }
        }).catch(function () {
          if (errorEl) {
            errorEl.textContent = 'Something went wrong. Please try again.';
            errorEl.classList.add('visible');
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Subscribe';
          }
        });
      });
    });
  }

  // --- Init all ---
  document.addEventListener('DOMContentLoaded', function () {
    initAnimations();
    initMobileNav();
    initFAQ();
    initCompareTabs();
    initDemoFilters();
    initNavScroll();
    initSmoothScroll();
    initActiveNav();
    initCounters();
    initPricingToggle();
    initTrialForm();
    initContactForm();
    initNewsletterForms();
  });
})();
