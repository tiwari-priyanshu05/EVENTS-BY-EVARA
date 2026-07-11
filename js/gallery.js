/* ============================================================
   GALLERY.JS — Events By Evara
   Gallery Filtering & Global Smooth Lightbox
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const galleryGrid = document.getElementById('galleryGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // 1. CATEGORY FILTER FOR GALLERY
  if (galleryGrid && filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        const items = galleryGrid.querySelectorAll('.gallery-item');

        items.forEach((item, index) => {
          const category = item.getAttribute('data-category');
          const shouldShow = filter === 'all' || category === filter;

          // Animate out
          item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';

          setTimeout(() => {
            item.style.display = shouldShow ? 'block' : 'none';
            if (shouldShow) {
              // Stagger the fade-in
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
              }, index * 50);
            }
          }, 300);
        });

        // Update visible images for lightbox
        setTimeout(updateVisibleLightboxImages, 400);
      });
    });
  }

  // 2. GLOBAL SMOOTH LIGHTBOX
  const enlargeableSelectors = [
    '.gallery-item img',
    '.project-img img',
    '.event-card-img img',
    '.about-images img'
  ];
  
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentImageIndex = 0;
  let visibleImages = [];

  function updateVisibleLightboxImages() {
    visibleImages = [];
    const uniqueSrcs = new Set();
    const allImages = document.querySelectorAll(enlargeableSelectors.join(', '));
    
    allImages.forEach(img => {
      // If it's a gallery item, only add it if it's currently visible
      const galleryItem = img.closest('.gallery-item');
      if (galleryItem && galleryItem.style.display === 'none') {
        return;
      }

      if (img.src && !uniqueSrcs.has(img.src)) {
        uniqueSrcs.add(img.src);
        visibleImages.push({ src: img.src, alt: img.alt });
      }
    });
  }

  // Initial population
  updateVisibleLightboxImages();

  // Attach click listeners
  const allImages = document.querySelectorAll(enlargeableSelectors.join(', '));
  allImages.forEach(img => {
    img.style.cursor = 'zoom-in';
    const clickTarget = img.closest('.gallery-item, .project-img, .event-card-img') || img;
    
    clickTarget.addEventListener('click', (e) => {
      e.preventDefault();
      if (!lightbox) return;
      updateVisibleLightboxImages(); // Re-fetch in case filters changed
      currentImageIndex = visibleImages.findIndex(vi => vi.src === img.src);
      if (currentImageIndex === -1) currentImageIndex = 0;
      openLightbox(visibleImages[currentImageIndex]);
    });
  });

  function openLightbox(imageData) {
    if (!lightboxImg || !lightbox) return;
    
    lightboxImg.style.transition = 'none';
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.85) translateY(20px)';
    lightboxImg.style.filter = 'blur(15px)';
    
    lightboxImg.src = imageData.src;
    lightboxImg.alt = imageData.alt;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // 300ms latency/delay for a deliberate, dramatic smooth entrance as requested
    setTimeout(() => {
      lightboxImg.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
      lightboxImg.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1) translateY(0)';
      lightboxImg.style.filter = 'blur(0px)';
    }, 150); 
  }

  function closeLightbox() {
    if (!lightbox) return;
    
    lightboxImg.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = 'scale(0.9) translateY(15px)';
    lightboxImg.style.filter = 'blur(10px)';
    
    setTimeout(() => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    }, 400);
  }

  function navigateLightbox(direction) {
    if (visibleImages.length <= 1) return;

    currentImageIndex += direction;
    if (currentImageIndex >= visibleImages.length) currentImageIndex = 0;
    if (currentImageIndex < 0) currentImageIndex = visibleImages.length - 1;

    lightboxImg.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    lightboxImg.style.opacity = '0';
    lightboxImg.style.transform = `translateX(${direction * 40}px) scale(0.95)`;
    lightboxImg.style.filter = 'blur(8px)';
    
    setTimeout(() => {
      lightboxImg.src = visibleImages[currentImageIndex].src;
      lightboxImg.alt = visibleImages[currentImageIndex].alt;
      
      requestAnimationFrame(() => {
        lightboxImg.style.transition = 'none';
        lightboxImg.style.transform = `translateX(${-direction * 40}px) scale(0.95)`;
        
        setTimeout(() => {
          lightboxImg.style.transition = 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
          lightboxImg.style.opacity = '1';
          lightboxImg.style.transform = 'translateX(0) scale(1)';
          lightboxImg.style.filter = 'blur(0px)';
        }, 50);
      });
    }, 300);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) closeLightbox();
  });
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
});
