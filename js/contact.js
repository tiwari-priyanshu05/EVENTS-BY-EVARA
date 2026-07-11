/* ============================================================
   CONTACT.JS — Events By Evara
   Contact Form Validation & Submission Handling
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const contactForm = document.getElementById('contactForm');
  const successModal = document.getElementById('successModal');

  if (!contactForm) return;

  // ══════════════════════════════════════════════
  // 1. VALIDATION RULES
  // ══════════════════════════════════════════════
  const validators = {
    name: {
      validate: (value) => value.trim().length >= 2,
      message: 'Please enter your full name (at least 2 characters)'
    },
    email: {
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Please enter a valid email address'
    },
    phone: {
      validate: (value) => /^[\+]?[\d\s\-\(\)]{8,15}$/.test(value.replace(/\s/g, '')),
      message: 'Please enter a valid phone number'
    },
    eventType: {
      validate: (value) => value !== '' && value !== null,
      message: 'Please select an event type'
    }
  };

  // ══════════════════════════════════════════════
  // 2. FIELD VALIDATION
  // ══════════════════════════════════════════════
  function validateField(fieldName, value) {
    const rule = validators[fieldName];
    if (!rule) return true;
    return rule.validate(value);
  }

  function showError(field, message) {
    const group = field.closest('.form-group');
    if (group) {
      group.classList.add('error');
      const errorMsg = group.querySelector('.error-message');
      if (errorMsg) errorMsg.textContent = message;
    }
  }

  function clearError(field) {
    const group = field.closest('.form-group');
    if (group) {
      group.classList.remove('error');
    }
  }

  // ══════════════════════════════════════════════
  // 3. REAL-TIME FIELD VALIDATION
  // ══════════════════════════════════════════════
  const requiredFields = contactForm.querySelectorAll('[required]');

  requiredFields.forEach(field => {
    // Validate on blur
    field.addEventListener('blur', () => {
      const name = field.getAttribute('name');
      const value = field.value;
      if (!validateField(name, value)) {
        showError(field, validators[name]?.message || 'This field is required');
      } else {
        clearError(field);
      }
    });

    // Clear error on input
    field.addEventListener('input', () => {
      clearError(field);
    });

    // For select elements
    field.addEventListener('change', () => {
      clearError(field);
    });
  });

  // ══════════════════════════════════════════════
  // 4. PHONE NUMBER FORMATTING
  // ══════════════════════════════════════════════
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/[^\d+\-\s\(\)]/g, '');
      e.target.value = value;
    });
  }

  // ══════════════════════════════════════════════
  // 5. FORM FOCUS ANIMATIONS
  // ══════════════════════════════════════════════
  const formInputs = contactForm.querySelectorAll('input, select, textarea');

  formInputs.forEach(input => {
    input.addEventListener('focus', () => {
      const group = input.closest('.form-group');
      if (group) {
        group.style.transition = 'transform 0.2s ease';
      }
    });
  });

  // ══════════════════════════════════════════════
  // 6. FORM SUBMISSION
  // ══════════════════════════════════════════════
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all required fields
    let isValid = true;
    requiredFields.forEach(field => {
      const name = field.getAttribute('name');
      const value = field.value;
      if (!validateField(name, value)) {
        showError(field, validators[name]?.message || 'This field is required');
        isValid = false;
      }
    });

    if (!isValid) {
      // Scroll to first error
      const firstError = contactForm.querySelector('.form-group.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      // Simulate network request
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Show success modal
        if (successModal) {
          successModal.classList.add('active');
        }

        // Reset form
        contactForm.reset();

        // Clear any errors
        contactForm.querySelectorAll('.form-group').forEach(group => {
          group.classList.remove('error');
        });
      }, 1500);
    }
  });

  // ══════════════════════════════════════════════
  // 7. DATE INPUT MIN DATE (Today)
  // ══════════════════════════════════════════════
  const eventDate = document.getElementById('eventDate');
  if (eventDate) {
    const today = new Date().toISOString().split('T')[0];
    eventDate.setAttribute('min', today);
  }
});
