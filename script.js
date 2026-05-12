/* ============================================================
   MD Rafidul Islam — Portfolio JavaScript
   Features:
   1. Mobile navigation toggle
   2. Navbar scroll effect (shrink on scroll)
   3. Scroll-triggered fade-in animations
   4. Active nav link highlighting
   ============================================================ */

/* ---- Wait for DOM to be ready ---- */
document.addEventListener('DOMContentLoaded', function () {

  /* ===========================================================
     1. MOBILE NAV TOGGLE
     Click the hamburger button to open/close the nav links
  =========================================================== */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      // Toggle the 'open' class on the nav links list
      navLinks.classList.toggle('open');
      // Add aria-expanded for accessibility
      const isOpen = navLinks.classList.contains('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close nav when any link is clicked (good for single-page scrolling)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      });
    });

    // Close nav if user clicks outside it
    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      }
    });
  }


  /* ===========================================================
     2. NAVBAR SCROLL EFFECT
     Add a CSS class 'scrolled' when page is scrolled down,
     which you can use in style.css to change navbar appearance.
     Currently the CSS already handles this with backdrop-filter.
  =========================================================== */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Listen for scroll events (throttled slightly for performance)
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run once on load in case page is already scrolled


  /* ===========================================================
     3. SCROLL-TRIGGERED FADE-IN ANIMATIONS
     Elements with class 'fade-in' will animate into view
     when they enter the viewport (using IntersectionObserver).
  =========================================================== */

  // Select all elements that should animate in
  const fadeEls = document.querySelectorAll(
    '.exp-card, .snapshot-card, .skill-group, .project-card, ' +
    '.workflow-block, .gallery-card, .edu-card, .contact-card'
  );

  // Add the fade-in class to all selected elements
  fadeEls.forEach(function (el) {
    el.classList.add('fade-in');
  });

  // Create an IntersectionObserver
  // 'entries' are the elements being observed
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once it has animated (no need to re-trigger)
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,      // Trigger when 12% of element is visible
        rootMargin: '0px 0px -40px 0px' // Slightly before reaching bottom of viewport
      }
    );

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: if browser doesn't support IntersectionObserver,
    // just make all elements visible immediately
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ===========================================================
     4. ACTIVE NAV LINK HIGHLIGHTING
     Highlights the correct nav link based on which section
     is currently visible in the viewport.
  =========================================================== */

  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveLink() {
    let currentId = '';
    const scrollY = window.scrollY + 100; // offset for navbar height

    sections.forEach(function (section) {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = section.id;
      }
    });

    navAnchors.forEach(function (a) {
      a.classList.remove('active-nav');
      if (a.getAttribute('href') === '#' + currentId) {
        a.classList.add('active-nav');
      }
    });
  }

  // Inject active nav style dynamically (avoids adding a CSS dependency)
  const activeStyle = document.createElement('style');
  activeStyle.textContent = '.nav-links a.active-nav { color: #ffffff !important; background: rgba(61,139,205,0.18) !important; }';
  document.head.appendChild(activeStyle);

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink(); // run once on load


  /* ===========================================================
     5. SMOOTH SCROLL for older browsers (polyfill)
     Modern browsers handle this via CSS scroll-behavior: smooth,
     but this adds support for browsers that don't.
  =========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 62;
        const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });


  /* ===========================================================
     6. CURRENT YEAR IN FOOTER (optional)
     Automatically keeps the copyright year up to date.
  =========================================================== */
  // Uncomment the line below if you add id="footer-year" to the footer span:
  // const yearEl = document.getElementById('footer-year');
  // if (yearEl) yearEl.textContent = new Date().getFullYear();

}); // end DOMContentLoaded
