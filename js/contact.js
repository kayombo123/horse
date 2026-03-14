(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var nameEl = document.getElementById('contact-name');
  var emailEl = document.getElementById('contact-email');
  var serviceEl = document.getElementById('contact-service');
  var messageEl = document.getElementById('contact-message');
  var hpEl = document.getElementById('hp');
  var successEl = document.getElementById('form-success');
  var errorEl = document.getElementById('form-error');
  var errorName = document.getElementById('error-name');
  var errorEmail = document.getElementById('error-email');
  var errorMessage = document.getElementById('error-message');

  function showFieldError(el, msgEl, text) {
    if (el) el.classList.add('error');
    if (msgEl) {
      msgEl.textContent = text || '';
      msgEl.hidden = !text;
    }
  }

  function clearFieldError(el, msgEl) {
    if (el) el.classList.remove('error');
    if (msgEl) {
      msgEl.textContent = '';
      msgEl.hidden = true;
    }
  }

  function validate() {
    var valid = true;
    clearFieldError(nameEl, errorName);
    clearFieldError(emailEl, errorEmail);
    clearFieldError(messageEl, errorMessage);
    if (successEl) successEl.hidden = true;
    if (errorEl) errorEl.hidden = true;

    if (!nameEl.value.trim()) {
      showFieldError(nameEl, errorName, 'Please enter your name.');
      valid = false;
    }
    var email = emailEl.value.trim();
    if (!email) {
      showFieldError(emailEl, errorEmail, 'Please enter your email.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFieldError(emailEl, errorEmail, 'Please enter a valid email address.');
      valid = false;
    }
    if (!messageEl.value.trim()) {
      showFieldError(messageEl, errorMessage, 'Please enter a message.');
      valid = false;
    }
    if (hpEl && hpEl.value) {
      valid = false; // honeypot filled = bot
    }
    return valid;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    var body = {
      name: nameEl.value.trim(),
      email: emailEl.value.trim(),
      service: serviceEl ? serviceEl.value : '',
      message: messageEl.value.trim(),
      hp: hpEl ? hpEl.value : ''
    };

    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw new Error(data.error || data.message || 'Something went wrong');
          return data;
        });
      })
      .then(function () {
        if (successEl) {
          successEl.hidden = false;
          form.reset();
          clearFieldError(nameEl, errorName);
          clearFieldError(emailEl, errorEmail);
          clearFieldError(messageEl, errorMessage);
        }
      })
      .catch(function (err) {
        if (errorEl) {
          errorEl.textContent = err.message || 'Something went wrong. Please try again.';
          errorEl.hidden = false;
        }
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
})();
