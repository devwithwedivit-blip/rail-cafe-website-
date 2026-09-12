/**
 * THE ROYAL RAIL CAFE — Parallax & 3D Tilt Systems
 * 1. Multi-layer scroll scenery parallax (sky, hills, telegraph poles)
 * 2. Mouse-tracked 3D card tilt for Coach Window menu cards
 * 3. Menu category filter tabs
 */

// 1. Scroll Parallax Engine
function initScrollParallax() {
  const hillsLayer = document.querySelector('.scenery-hills');
  const polesLayer = document.querySelector('.scenery-poles');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    if (scrollY < window.innerHeight * 1.5) {
      if (hillsLayer) {
        hillsLayer.style.transform = `translate3d(${scrollY * -0.25}px, 0, 0)`;
      }
      if (polesLayer) {
        polesLayer.style.transform = `translate3d(${scrollY * -0.6}px, 0, 0)`;
      }
    }
  }, { passive: true });
}

// 2. Mouse-Tracked 3D Tilt for Coach Window Cards
function initCoachWindow3DTilt() {
  if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 900) return;

  const windowCards = document.querySelectorAll('.coach-window-item');

  windowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cardX = e.clientX - rect.left;
      const cardY = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max tilt degrees: +/- 12deg
      const rotateX = ((cardY - centerY) / centerY) * -10;
      const rotateY = ((cardX - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// 3. Menu Category Filter Tabs
function initMenuFilters() {
  const tabs = document.querySelectorAll('.category-tab');
  const cards = document.querySelectorAll('.coach-window-item');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.getAttribute('data-category');

      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initScrollParallax();
  initCoachWindow3DTilt();
  initMenuFilters();
});
