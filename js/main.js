/* ============================================================
   MAIN.JS — Events By Evara
   Core Functionality: Loader, Navbar, Counters, FAQ, etc.
   ============================================================ */

// Force scroll to top on page load
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ── Element References ──
  const loader = document.getElementById('loader');
  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburger');
  const navOverlay = document.getElementById('navOverlay');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const darkToggle = document.getElementById('darkToggle');
  const customCursor = document.getElementById('customCursor');
  const heroGlow = document.getElementById('heroGlow');

  // ══════════════════════════════════════════════
  // 1. LOADER
  // ══════════════════════════════════════════════
  function hideLoader() {
    if (loader) {
      loader.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  }

  // Ensure loader hides after content loads (or max 3.2 seconds)
  window.addEventListener('load', () => {
    setTimeout(hideLoader, 3200);
  });
  // Fallback: hide after 6 seconds no matter what
  setTimeout(hideLoader, 6000);
  // Prevent scrolling while loader is visible
  document.body.style.overflow = 'hidden';

  // ══════════════════════════════════════════════
  // 2. STICKY NAVBAR
  // ══════════════════════════════════════════════
  function handleNavbarScroll() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // ══════════════════════════════════════════════
  // 3. SCROLL PROGRESS BAR
  // ══════════════════════════════════════════════
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    if (scrollProgress) {
      scrollProgress.style.width = progress + '%';
    }
  }

  // ══════════════════════════════════════════════
  // 4. ACTIVE NAV LINK ON SCROLL
  // ══════════════════════════════════════════════
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ══════════════════════════════════════════════
  // 5. BACK TO TOP BUTTON
  // ══════════════════════════════════════════════
  function toggleBackToTop() {
    if (backToTop) {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ══════════════════════════════════════════════
  // COMBINED SCROLL HANDLER
  // ══════════════════════════════════════════════
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleNavbarScroll();
        updateScrollProgress();
        updateActiveLink();
        toggleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial calls
  handleNavbarScroll();
  updateScrollProgress();

  // ══════════════════════════════════════════════
  // 6. HAMBURGER MENU
  // ══════════════════════════════════════════════
  function toggleMenu() {
    const isOpen = hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    navOverlay.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = 'auto';
  }

  if (hamburger) hamburger.addEventListener('click', toggleMenu);
  if (navOverlay) navOverlay.addEventListener('click', closeMenu);

  // Close menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  });

  // ══════════════════════════════════════════════
  // 7. SMOOTH SCROLLING
  // ══════════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ══════════════════════════════════════════════
  // 8. DARK MODE TOGGLE
  // ══════════════════════════════════════════════
  function initDarkMode() {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      document.body.classList.add('dark-mode');
      updateDarkToggleIcon(true);
    }
  }

  function updateDarkToggleIcon(isDark) {
    if (darkToggle) {
      darkToggle.innerHTML = isDark
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    }
  }

  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', isDark);
      updateDarkToggleIcon(isDark);
    });
  }

  initDarkMode();

  // ══════════════════════════════════════════════
  // 9. ANIMATED COUNTERS (Intersection Observer)
  // ══════════════════════════════════════════════
  const counters = document.querySelectorAll('.counter');
  const counterObserverOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, counterObserverOptions);

  counters.forEach(counter => counterObserver.observe(counter));

  // ══════════════════════════════════════════════
  // 10. FAQ ACCORDION
  // ══════════════════════════════════════════════
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQs
      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });



  // ══════════════════════════════════════════════
  // 12. HERO MOUSE GLOW EFFECT
  // ══════════════════════════════════════════════
  if (heroGlow) {
    const hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left - 200;
      const y = e.clientY - rect.top - 200;
      heroGlow.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // ══════════════════════════════════════════════
  // 13. BUTTON RIPPLE EFFECT
  // ══════════════════════════════════════════════
  document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
      ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // ══════════════════════════════════════════════
  // 14. PROCESS TIMELINE ANIMATION
  // ══════════════════════════════════════════════
  const processTimeline = document.getElementById('processTimeline');
  if (processTimeline) {
    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          processTimeline.classList.add('animated');
          processObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    processObserver.observe(processTimeline);
  }

  // ══════════════════════════════════════════════
  // 15. SWIPER TESTIMONIALS
  // ══════════════════════════════════════════════
  if (typeof Swiper !== 'undefined') {
    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1200: { slidesPerView: 3 },
      },
    });
  }

  // ══════════════════════════════════════════════
  // 16. KEYBOARD NAVIGATION
  // ══════════════════════════════════════════════
  document.addEventListener('keydown', (e) => {
    // Escape closes modals and menus
    if (e.key === 'Escape') {
      closeMenu();
      const lightbox = document.getElementById('lightbox');
      if (lightbox && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
      }
      const successModal = document.getElementById('successModal');
      if (successModal && successModal.classList.contains('active')) {
        successModal.classList.remove('active');
      }
    }
  });

  // ══════════════════════════════════════════════
  // 17. SUCCESS MODAL
  // ══════════════════════════════════════════════
  const closeModal = document.getElementById('closeModal');
  const successModal = document.getElementById('successModal');
  if (closeModal && successModal) {
    closeModal.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }

  // ══════════════════════════════════════════════
  // 18. NEWSLETTER FORM
  // ══════════════════════════════════════════════
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]');
      if (email && email.value) {
        if (successModal) successModal.classList.add('active');
        email.value = '';
      }
    });
  }



  // ══════════════════════════════════════════════
  // 20. PREMIUM CURSOR SPOTLIGHT
  // ══════════════════════════════════════════════
  const cursorSpotlight = document.getElementById('cursorSpotlight');
  if (cursorSpotlight && window.matchMedia('(pointer: fine)').matches) {
    let spotlightX = window.innerWidth / 2;
    let spotlightY = window.innerHeight / 2;
    let targetX = spotlightX;
    let targetY = spotlightY;
    
    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    function animateSpotlight() {
      spotlightX += (targetX - spotlightX) * 0.1;
      spotlightY += (targetY - spotlightY) * 0.1;
      cursorSpotlight.style.transform = `translate(calc(${spotlightX}px - 50%), calc(${spotlightY}px - 50%))`;
      requestAnimationFrame(animateSpotlight);
    }
    animateSpotlight();
  }

  // ══════════════════════════════════════════════
  // 21. PREMIUM FLOATING PARTICLES (SPARSE)
  // ══════════════════════════════════════════════
  const canvas = document.getElementById('premiumParticles');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let width, height;
    const particles = [];
    const particleCount = 20; // Very sparse for luxury feel

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speedY: Math.random() * -0.2 - 0.1,
        speedX: Math.random() * 0.2 - 0.1,
        opacity: Math.random() * 0.5 + 0.1
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 196, 48, ${p.opacity})`;
        ctx.fill();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }
});
