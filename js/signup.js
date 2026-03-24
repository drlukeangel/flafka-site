/* ============================================
   Flafka Signup / Waitlist Modal
   W80-1: Email capture with Formspree integration
   ============================================ */

(function () {
  'use strict';

  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpwzgkby';
  var STORAGE_KEY = 'flafka_signup';

  // --- Modal HTML ---
  function createModalHTML() {
    return '' +
      '<div class="signup-modal" id="signup-modal" role="dialog" aria-modal="true" aria-labelledby="signup-modal-title">' +
      '  <div class="signup-modal__overlay" data-signup-close></div>' +
      '  <div class="signup-modal__container">' +
      '    <button class="signup-modal__close" data-signup-close aria-label="Close signup form">&times;</button>' +
      '    <div class="signup-modal__header">' +
      '      <h2 id="signup-modal-title" class="signup-modal__title">Join the Waitlist</h2>' +
      '      <p class="signup-modal__subtitle">Get early access to Flafka. We will email you when your platform is ready.</p>' +
      '    </div>' +
      '    <form class="signup-modal__form" id="signup-form" novalidate>' +
      '      <div class="form-field">' +
      '        <label for="signup-email">Work Email <span aria-hidden="true">*</span></label>' +
      '        <input type="email" id="signup-email" name="email" placeholder="you@company.com" required autocomplete="email">' +
      '        <span class="form-field__error" aria-live="polite"></span>' +
      '      </div>' +
      '      <div class="form-field">' +
      '        <label for="signup-company">Company Name</label>' +
      '        <input type="text" id="signup-company" name="company" placeholder="Your company" autocomplete="organization">' +
      '        <span class="form-field__error" aria-live="polite"></span>' +
      '      </div>' +
      '      <div class="form-field">' +
      '        <label for="signup-team-size">Team Size</label>' +
      '        <select id="signup-team-size" name="team_size">' +
      '          <option value="">Select team size</option>' +
      '          <option value="1-5">1-5 people</option>' +
      '          <option value="6-20">6-20 people</option>' +
      '          <option value="21-50">21-50 people</option>' +
      '          <option value="50+">50+ people</option>' +
      '        </select>' +
      '      </div>' +
      '      <div class="form-field">' +
      '        <label for="signup-platform">Primary Kafka Platform</label>' +
      '        <select id="signup-platform" name="kafka_platform">' +
      '          <option value="">Select platform</option>' +
      '          <option value="confluent-cloud">Confluent Cloud</option>' +
      '          <option value="aws-msk">AWS MSK</option>' +
      '          <option value="apache-kafka">Apache Kafka (self-managed)</option>' +
      '          <option value="redpanda">Redpanda</option>' +
      '          <option value="aiven">Aiven</option>' +
      '          <option value="other">Other</option>' +
      '        </select>' +
      '      </div>' +
      '      <!-- Hidden UTM fields -->' +
      '      <input type="hidden" name="utm_source" id="signup-utm-source">' +
      '      <input type="hidden" name="utm_medium" id="signup-utm-medium">' +
      '      <input type="hidden" name="utm_campaign" id="signup-utm-campaign">' +
      '      <input type="hidden" name="signup_page" id="signup-page">' +
      '      <!-- Honeypot -->' +
      '      <div class="form-field form-field--hp" aria-hidden="true" tabindex="-1">' +
      '        <label for="signup-website">Website</label>' +
      '        <input type="text" id="signup-website" name="_gotcha" tabindex="-1" autocomplete="off">' +
      '      </div>' +
      '      <div class="signup-modal__consent">' +
      '        <label class="signup-modal__consent-label">' +
      '          <input type="checkbox" id="signup-consent" name="consent" required>' +
      '          <span>I agree to receive product updates from Flafka. You can unsubscribe at any time. <a href="#" target="_blank">Privacy Policy</a></span>' +
      '        </label>' +
      '        <span class="form-field__error" id="signup-consent-error" aria-live="polite"></span>' +
      '      </div>' +
      '      <button type="submit" class="btn btn--primary signup-modal__submit" id="signup-submit">' +
      '        Join Waitlist' +
      '      </button>' +
      '      <p class="signup-modal__note">No spam. Unsubscribe anytime.</p>' +
      '    </form>' +
      '    <!-- Already signed up state -->' +
      '    <div class="signup-modal__already" id="signup-already" style="display:none;">' +
      '      <div class="signup-modal__already-icon">&#10003;</div>' +
      '      <h3>You are already on the list!</h3>' +
      '      <p>We will email you when access is available. In the meantime:</p>' +
      '      <div class="signup-modal__already-links">' +
      '        <a href="demo.html" class="btn btn--secondary btn--sm">Watch Demos</a>' +
      '        <a href="blog.html" class="btn btn--secondary btn--sm">Read Blog</a>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>';
  }

  // --- Inject modal into page ---
  function injectModal() {
    if (document.getElementById('signup-modal')) return;
    var wrapper = document.createElement('div');
    wrapper.innerHTML = createModalHTML();
    document.body.appendChild(wrapper.firstElementChild);
  }

  // --- UTM parameter capture ---
  function captureUTM() {
    var params = new URLSearchParams(window.location.search);
    var src = document.getElementById('signup-utm-source');
    var med = document.getElementById('signup-utm-medium');
    var camp = document.getElementById('signup-utm-campaign');
    var page = document.getElementById('signup-page');
    if (src) src.value = params.get('utm_source') || '';
    if (med) med.value = params.get('utm_medium') || '';
    if (camp) camp.value = params.get('utm_campaign') || '';
    if (page) page.value = window.location.pathname;
  }

  // --- Check localStorage dedup ---
  function isAlreadySignedUp() {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch (e) {
      return false;
    }
  }

  function markSignedUp(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* no-op */ }
  }

  // --- Focus trap ---
  var focusableSelector = 'a[href], button:not([disabled]), input:not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])';
  var previousFocus = null;

  function trapFocus(modal) {
    var focusable = modal.querySelectorAll(focusableSelector);
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    modal.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // --- Open modal ---
  function openSignupModal(platform) {
    var modal = document.getElementById('signup-modal');
    if (!modal) return;

    previousFocus = document.activeElement;
    captureUTM();

    // Pre-select platform if provided
    if (platform) {
      var select = document.getElementById('signup-platform');
      if (select) select.value = platform;
    }

    // Show already-signed-up state or form
    var form = document.getElementById('signup-form');
    var already = document.getElementById('signup-already');
    if (isAlreadySignedUp()) {
      if (form) form.style.display = 'none';
      if (already) already.style.display = '';
    } else {
      if (form) form.style.display = '';
      if (already) already.style.display = 'none';
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Focus first input
    setTimeout(function () {
      var firstInput = modal.querySelector('input[type="email"]');
      if (firstInput && !isAlreadySignedUp()) {
        firstInput.focus();
      }
    }, 100);
  }

  // --- Close modal ---
  function closeSignupModal() {
    var modal = document.getElementById('signup-modal');
    if (!modal) return;

    modal.classList.remove('open');
    document.body.style.overflow = '';

    if (previousFocus) {
      previousFocus.focus();
      previousFocus = null;
    }
  }

  // --- Validation ---
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(input, message) {
    var field = input.closest('.form-field') || input.closest('.signup-modal__consent');
    if (!field) return;
    var err = field.querySelector('.form-field__error');
    if (err) err.textContent = message;
    if (field.classList) field.classList.add('form-field--error');
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError(input) {
    var field = input.closest('.form-field') || input.closest('.signup-modal__consent');
    if (!field) return;
    var err = field.querySelector('.form-field__error');
    if (err) err.textContent = '';
    if (field.classList) field.classList.remove('form-field--error');
    input.removeAttribute('aria-invalid');
  }

  // --- Form submission ---
  function handleSubmit(e) {
    e.preventDefault();

    // Honeypot check
    var hp = document.getElementById('signup-website');
    if (hp && hp.value) return;

    var emailInput = document.getElementById('signup-email');
    var consentInput = document.getElementById('signup-consent');
    var consentError = document.getElementById('signup-consent-error');
    var valid = true;

    // Validate email
    if (!emailInput || !validateEmail(emailInput.value)) {
      showError(emailInput, 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError(emailInput);
    }

    // Validate consent
    if (!consentInput || !consentInput.checked) {
      if (consentError) consentError.textContent = 'Please agree to receive product updates.';
      valid = false;
    } else {
      if (consentError) consentError.textContent = '';
    }

    if (!valid) return;

    // Show loading state
    var submitBtn = document.getElementById('signup-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    // Submit to Formspree
    var form = document.getElementById('signup-form');
    var formData = new FormData(form);

    fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    }).then(function (response) {
      if (response.ok) {
        var data = {
          email: emailInput.value,
          platform: (document.getElementById('signup-platform') || {}).value || '',
          timestamp: new Date().toISOString()
        };
        markSignedUp(data);

        // Redirect to confirmation page
        var confirmUrl = 'signup-confirmation.html';
        var platform = (document.getElementById('signup-platform') || {}).value || '';
        if (platform) confirmUrl += '?platform=' + encodeURIComponent(platform);

        // Handle relative paths for subdirectory pages
        var path = window.location.pathname;
        if (path.indexOf('/blog/') !== -1 || path.indexOf('/guides/') !== -1) {
          confirmUrl = '../' + confirmUrl;
        }

        window.location.href = confirmUrl;
      } else {
        throw new Error('Submission failed');
      }
    }).catch(function () {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Join Waitlist';
      }
      showError(emailInput, 'Something went wrong. Please try again.');
    });
  }

  // --- Wire up event listeners ---
  function initSignup() {
    injectModal();

    var modal = document.getElementById('signup-modal');
    if (!modal) return;

    trapFocus(modal);

    // Close button / overlay clicks
    modal.querySelectorAll('[data-signup-close]').forEach(function (el) {
      el.addEventListener('click', closeSignupModal);
    });

    // Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeSignupModal();
      }
    });

    // Form submit
    var form = document.getElementById('signup-form');
    if (form) {
      form.addEventListener('submit', handleSubmit);
    }

    // Inline validation: clear error on input
    var emailInput = document.getElementById('signup-email');
    if (emailInput) {
      emailInput.addEventListener('input', function () { clearError(emailInput); });
    }

    // Wire up all CTA buttons on the page
    document.querySelectorAll('[data-signup-trigger]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var platform = this.getAttribute('data-signup-platform') || '';
        openSignupModal(platform);
      });
    });
  }

  // --- Expose for external use ---
  window.FlafkaSignup = {
    open: openSignupModal,
    close: closeSignupModal
  };

  // --- Init ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSignup);
  } else {
    initSignup();
  }
})();
