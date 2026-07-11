/* ============================================================
   ANIMATIONS.JS — Events By Evara
   AOS Initialization, Parallax, Card Tilt, Decorative Effects
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ══════════════════════════════════════════════
  // 1. AOS (Animate On Scroll) INITIALIZATION
  // ══════════════════════════════════════════════
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,        // Animate only once
      offset: 0,         // Trigger instantly upon entering viewport
      delay: 0,
      anchorPlacement: 'top-bottom',
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }

  // ══════════════════════════════════════════════
  // 2. SCROLL REVEAL (for elements without AOS)
  // ══════════════════════════════════════════════
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ══════════════════════════════════════════════
  // 3. CARD TILT EFFECT (3D Transform on Hover)
  // ══════════════════════════════════════════════
  const tiltCards = document.querySelectorAll('.premium-card, .event-card, .project-card');

  // Only enable on desktop (no touch)
  if (window.matchMedia('(pointer: fine)').matches) {
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4; // Max 4deg
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => {
          card.style.transition = '';
        }, 500);
      });
    });
  }

  // ══════════════════════════════════════════════
  // 4. PARALLAX SCROLL EFFECT
  // ══════════════════════════════════════════════
  const parallaxBgs = document.querySelectorAll('.hero-bg img, .cta-bg img');

  function handleParallax() {
    parallaxBgs.forEach(bg => {
      const section = bg.closest('section') || bg.closest('.cta-banner');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.bottom > 0 && rect.top < windowHeight) {
        const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
        const translateY = (scrollPercent - 0.5) * 40; // Max 20px parallax
        bg.style.transform = `translateY(${translateY}px) scale(1.05)`;
      }
    });
  }

  let parallaxTicking = false;
  window.addEventListener('scroll', () => {
    if (!parallaxTicking) {
      requestAnimationFrame(() => {
        handleParallax();
        parallaxTicking = false;
      });
      parallaxTicking = true;
    }
  }, { passive: true });

  // ══════════════════════════════════════════════
  // 5. FLOATING DECORATIVE PARTICLES
  // ══════════════════════════════════════════════
  function createDecorativeParticles(container, count = 5) {
    if (!container) return;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 6 + 2}px;
        height: ${Math.random() * 6 + 2}px;
        background: rgba(244, 196, 48, ${Math.random() * 0.3 + 0.1});
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: particleFloat${(i % 3) + 1} ${Math.random() * 6 + 6}s ease-in-out infinite ${Math.random() * 3}s;
        pointer-events: none;
        z-index: 1;
      `;
      container.appendChild(particle);
    }
  }

  // Add particles to the CTA banner
  const ctaBanner = document.querySelector('.cta-banner');
  if (ctaBanner) createDecorativeParticles(ctaBanner, 6);

  // ══════════════════════════════════════════════
  // 6. STAGGERED ENTRANCE ANIMATION
  // ══════════════════════════════════════════════
  const staggerContainers = document.querySelectorAll('.services-grid, .awards-grid');

  staggerContainers.forEach(container => {
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = entry.target.children;
          Array.from(children).forEach((child, index) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            setTimeout(() => {
              child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, index * 60);
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    staggerObserver.observe(container);
  });

  // ══════════════════════════════════════════════
  // 7. MARQUEE PAUSE ON HOVER
  // ══════════════════════════════════════════════
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    const marquee = marqueeTrack.closest('.marquee');
    if (marquee) {
      marquee.addEventListener('mouseenter', () => {
        marqueeTrack.style.animationPlayState = 'paused';
      });
      marquee.addEventListener('mouseleave', () => {
        marqueeTrack.style.animationPlayState = 'running';
      });
    }
  }

  // ══════════════════════════════════════════════
  // 8. IMAGE LAZY LOADING (native fallback)
  // ══════════════════════════════════════════════
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // Add fade-in effect once loaded
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.5s ease';
          if (img.complete) {
            img.style.opacity = '1';
          } else {
            img.addEventListener('load', () => {
              img.style.opacity = '1';
            }, { once: true });
          }
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ══════════════════════════════════════════════
  // 9. NAVBAR LINK HOVER EFFECT (magnetic)
  // ══════════════════════════════════════════════
  if (window.matchMedia('(pointer: fine)').matches) {
    const navLinksDesktop = document.querySelectorAll('.nav-link');
    navLinksDesktop.forEach(link => {
      link.addEventListener('mouseenter', function() {
        this.style.transition = 'color 0.2s ease';
      });
    });
  }

  // ══════════════════════════════════════════════
  // 10. MAGNETIC BUTTON EFFECT
  // ══════════════════════════════════════════════
  if (window.matchMedia('(pointer: fine)').matches) {
    const magneticButtons = document.querySelectorAll('.hero-buttons .btn, .cta-banner .btn');
    
    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Move the button slightly towards the cursor
        this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      
      btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // ══════════════════════════════════════════════
  // 11. SAFE PREMIUM 3D SCROLL & PARALLAX
  // ══════════════════════════════════════════════
  const heroContent = document.querySelector('.hero-content');
  
  function handleSafeScroll3D() {
    const scrollY = window.scrollY;
    
    // Update CSS variable for background parallax (creates huge depth without breaking layout)
    document.body.style.setProperty('--scroll-y', scrollY);
    
    // 3D Hero fold effect (only on hero section to avoid clipping)
    if (heroContent && scrollY < window.innerHeight) {
      const rotateX = Math.min(scrollY * 0.03, 30);
      const translateZ = scrollY * -0.5;
      const translateY = scrollY * 0.2;
      const opacity = Math.max(1 - (scrollY / 600), 0);
      
      heroContent.style.transform = `perspective(1200px) rotateX(${rotateX}deg) translateZ(${translateZ}px) translateY(${translateY}px)`;
      heroContent.style.opacity = opacity;
    }
  }

  let safe3DTicking = false;
  window.addEventListener('scroll', () => {
    if (!safe3DTicking) {
      requestAnimationFrame(() => {
        handleSafeScroll3D();
        safe3DTicking = false;
      });
      safe3DTicking = true;
    }
  }, { passive: true });
  
  handleSafeScroll3D();
});
