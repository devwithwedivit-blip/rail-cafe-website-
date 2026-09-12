/**
 * THE ROYAL RAIL CAFE — Main Application Coordinator
 * 1. Custom Train-Lantern Cursor Tracker
 * 2. Split-Flap Letter Flip Transitions on Navbar
 * 3. Live Station Clock
 * 4. Sound Engine Control Horn
 * 5. Railway Coupling Section Scroll Snapping / Transition Cues
 * 6. Mobile Drawer Navigation & Touch Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initSplitFlapNav();
  initStationClock();
  initSoundButton();
  initCouplingScrollCues();
  initMobileNav();
  initWhatsAppFoodOrdering();
  initShutterAnimation();
});

// 1. Custom Train-Signal Lantern Cursor
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  // Scale up slightly on clickable elements
  const interactives = document.querySelectorAll('a, button, input, select, .coach-window-item, .gallery-card, .category-tab');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.4)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });

  // Hide when cursor leaves window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });
}

// 2. Split-Flap Hover Effect on Navbar Links
function initSplitFlapNav() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const originalText = link.textContent.trim();
    link.innerHTML = '';

    // Wrap each character in an individual span
    originalText.split('').forEach((char, idx) => {
      const span = document.createElement('span');
      span.className = 'flap-letter';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = `${idx * 0.035}s`;
      link.appendChild(span);
    });

    // Mechanical split-flap cycling on hover
    link.addEventListener('mouseenter', () => {
      const letters = link.querySelectorAll('.flap-letter');
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

      letters.forEach((span, i) => {
        const targetChar = span.textContent;
        let cycles = 0;
        const maxCycles = 3 + (i % 3);

        const interval = setInterval(() => {
          if (cycles >= maxCycles || targetChar === '\u00A0') {
            span.textContent = targetChar;
            clearInterval(interval);
          } else {
            span.textContent = alphabet[Math.floor(Math.random() * alphabet.length)];
            cycles++;
          }
        }, 40);
      });
    });
  });
}

// 3. Live Indian Railway Station Master Clock
function initStationClock() {
  const clockEl = document.getElementById('stationMasterClock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${mins}:${secs} IST`;
  }

  update();
  setInterval(update, 1000);
}

// 4. Sound Engine Control Toggle
function initSoundButton() {
  const soundBtn = document.getElementById('soundToggleBtn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent trigger of hole punch
    if (window.railAudio) {
      window.railAudio.toggleSound(soundBtn);
    }
  });
}

// 5. Coupling Visual & Sound Cues on Section Transitions
function initCouplingScrollCues() {
  const couplingDividers = document.querySelectorAll('.coupling-divider');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const knuckle = entry.target.querySelector('.coupling-knuckle');
        if (knuckle) {
          knuckle.style.transform = 'scale(1.15)';
          knuckle.style.borderColor = 'var(--rail-mustard)';
          setTimeout(() => {
            knuckle.style.transform = 'scale(1)';
            knuckle.style.borderColor = 'var(--rail-brass)';
          }, 400);
        }
      }
    });
  }, { threshold: 0.5 });

  couplingDividers.forEach(divider => observer.observe(divider));

  // Header background on scroll
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });
}

// 6. Mobile Navigation Drawer Controller
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const drawer = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const backdrop = document.getElementById('mobileNavBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, #mobDrawerReserveBtn');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-locked');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-locked');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
  }

  // Close when clicking any menu link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

// 7. WhatsApp Food Ordering Integration (07500045675 / +91 75000 45675)
function initWhatsAppFoodOrdering() {
  // Only the designated 'Order on WhatsApp' buttons redirect to WhatsApp.
  // Clicking anywhere else in the picture or card does NOT redirect to WhatsApp.
  const waButtons = document.querySelectorAll('a.btn-order-whatsapp');
  waButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Ensure the order button event propagates cleanly without interference
      e.stopPropagation();
    });
  });
}

// 8. Carriage Window Shutter-over-Picture Animation (PC Hover & Mobile Tap Toggle)
function initShutterAnimation() {
  const windowCards = document.querySelectorAll('.coach-window-item');
  if (!windowCards.length) return;

  // On PC: Pure CSS :hover smoothly slides shutters open and closed as cursor enters and leaves.
  // On Mobile / Touch: Tapping on the window picture viewport slides the shutters open/closed!
  windowCards.forEach(card => {
    const viewport = card.querySelector('.window-glass-viewport');
    if (!viewport) return;

    // Make picture viewport explicitly indicate interactivity
    viewport.style.cursor = 'pointer';

    viewport.addEventListener('click', (e) => {
      e.stopPropagation(); // Never redirect to WhatsApp when clicking anywhere in the picture!
      
      const isCurrentlyOpen = card.classList.contains('curtains-open');
      
      // Close any other open carriage window so only one is active at a time
      windowCards.forEach(otherCard => {
        if (otherCard !== card) {
          otherCard.classList.remove('curtains-open');
        }
      });

      // Toggle this card's shutters
      if (isCurrentlyOpen) {
        card.classList.remove('curtains-open');
      } else {
        card.classList.add('curtains-open');
      }
    });
  });

  // Tap anywhere outside on document closes open shutters on mobile
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.coach-window-item')) {
      windowCards.forEach(card => card.classList.remove('curtains-open'));
    }
  });
}

