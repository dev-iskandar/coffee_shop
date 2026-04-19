/* ============================================
   COFFEE SHOP — MAIN.JS
   General UI logic: navbar, ripple, scroll, toasts, reveal
   ============================================ */

'use strict';

// ── NAVBAR SCROLL EFFECT ──────────────────────────────────────────────────────

(function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


// ── HAMBURGER MENU ────────────────────────────────────────────────────────────

(function initMobileMenu() {
  const toggler  = document.querySelector('.navbar-toggler');
  const collapse = document.querySelector('.navbar-collapse');
  if (!toggler || !collapse) return;

  toggler.addEventListener('click', () => {
    toggler.classList.toggle('open');
    collapse.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!toggler.contains(e.target) && !collapse.contains(e.target)) {
      toggler.classList.remove('open');
      collapse.classList.remove('open');
    }
  });

  // Close on link click
  collapse.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggler.classList.remove('open');
      collapse.classList.remove('open');
    });
  });
})();


// ── RIPPLE EFFECT ─────────────────────────────────────────────────────────────

function createRipple(btn, e) {
  const rect   = btn.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height);
  const x      = e ? e.clientX - rect.left - size / 2 : rect.width / 2 - size / 2;
  const y      = e ? e.clientY - rect.top  - size / 2 : rect.height / 2 - size / 2;

  const ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;

  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

// Apply to all .btn and .btn-add-cart elements
document.querySelectorAll('.btn, .btn-add-cart, .btn-submit, .btn-checkout').forEach(btn => {
  btn.addEventListener('click', (e) => createRipple(btn, e));
});

// Also export for dynamic buttons
window.createRipple = createRipple;


// ── SMOOTH SCROLL ─────────────────────────────────────────────────────────────

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ── INTERSECTION OBSERVER — REVEAL ON SCROLL ──────────────────────────────────

(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
})();


// ── TOAST NOTIFICATIONS ───────────────────────────────────────────────────────

// ✅ GLOBAL TOAST SYSTEM (FIXED)
window.showToast = function (message, type = 'info', duration = 3500) {

  // ✔ FIX 1: контейнер создаётся один раз и не дублируется
  let container = document.querySelector('.messages-container');

  if (!container) {
    container = document.createElement('div');
    container.className = 'messages-container';
    document.body.appendChild(container);
  }

  // ✔ FIX 2: защита от неправильного type
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠'
  };

  const safeType = icons[type] ? type : 'info';

  // ✔ FIX 3: безопасный HTML (не ломается при пустом message)
  const toast = document.createElement('div');
  toast.className = `alert-toast ${safeType}`;

  const icon = icons[safeType];

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span>${message ?? ''}</span>
  `;

  container.appendChild(toast);

  // ✔ FIX 4: плавное удаление без конфликтов
  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';

    setTimeout(() => toast.remove(), 400);
  }, duration);

  // ✔ FIX 5: click-to-close (не ломает другие события)
  toast.addEventListener('click', () => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 300);
  });
};


// ── AUTO-DISMISS DJANGO MESSAGES ──────────────────────────────────────────────

document.querySelectorAll('.alert-toast').forEach(toast => {
  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity    = '0';
    toast.style.transform  = 'translateX(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
});


// ── ACTIVE NAV LINK ───────────────────────────────────────────────────────────

(function setActiveNavLink() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.startsWith(href) && href !== '/') {
      link.classList.add('active');
    } else if (href === '/' && currentPath === '/') {
      link.classList.add('active');
    }
  });
})();


// ── INITIALIZE RIPPLE ON DYNAMIC ELEMENTS ─────────────────────────────────────

// MutationObserver to add ripple to dynamically added buttons
const bodyObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return;
      const buttons = node.matches('.btn, .btn-add-cart')
        ? [node]
        : [...node.querySelectorAll('.btn, .btn-add-cart')];
      buttons.forEach(btn => {
        if (!btn._hasRipple) {
          btn._hasRipple = true;
          btn.addEventListener('click', (e) => createRipple(btn, e));
        }
      });
    });
  });
});

bodyObserver.observe(document.body, { childList: true, subtree: true });


// ── ANIMATE NUMBERS (counter effect) ─────────────────────────────────────────

window.animateNumber = function(el, from, to, duration = 600, prefix = '', suffix = '') {
  const start  = performance.now();
  const range  = to - from;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current  = Math.round(from + range * eased);

    el.textContent = prefix + current.toLocaleString() + suffix;

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
};

