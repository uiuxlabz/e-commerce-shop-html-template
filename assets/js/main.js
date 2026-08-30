/* ============================================================
   ESHOP — E-Commerce Shop HTML Template
   Main JavaScript (Vanilla, No Frameworks)
   ============================================================ */

(function () {
  'use strict';

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNav();
    initBurger();
    initHeroSlider();
    initScrollReveal();
    initProductFilters();
    initCartDemo();
    initContactForm();
    initDataYear();
    initScrollTop();
  }

  /* ---------- Sticky Nav ---------- */
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          nav.classList.toggle('scrolled', window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Active link based on current page
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav__link').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ---------- Burger Menu ---------- */
  function initBurger() {
    const burger = document.querySelector('.nav__burger');
    const mobile = document.querySelector('.nav__mobile');
    if (!burger || !mobile) return;

    burger.addEventListener('click', function () {
      burger.classList.toggle('open');
      mobile.classList.toggle('open');
      document.body.style.overflow = mobile.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobile.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('open');
        mobile.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Hero Slider ---------- */
  function initHeroSlider() {
    const slides = document.querySelectorAll('.hero__slide');
    const dots = document.querySelectorAll('.hero__dot');
    if (slides.length < 2) return;

    let current = 0;
    let interval;

    function goTo(index) {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    function next() {
      goTo((current + 1) % slides.length);
    }

    function startAuto() {
      interval = setInterval(next, 5000);
    }

    function stopAuto() {
      clearInterval(interval);
    }

    // Dot clicks
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        stopAuto();
        goTo(i);
        startAuto();
      });
    });

    // Pause on hover
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('mouseenter', stopAuto);
      hero.addEventListener('mouseleave', startAuto);
    }

    startAuto();
  }

  /* ---------- Scroll Reveal (IntersectionObserver) ---------- */
  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length || !('IntersectionObserver' in window)) {
      // Fallback: show everything
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Product Filters ---------- */
  function initProductFilters() {
    var filtersContainer = document.querySelector('.products__filters');
    var productCards = document.querySelectorAll('.product-card[data-category]');
    if (!filtersContainer || !productCards.length) return;

    var activeFilter = filtersContainer.querySelector('.products__filter.active');
    var currentCategory = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';

    filtersContainer.addEventListener('click', function (e) {
      var btn = e.target.closest('.products__filter');
      if (!btn) return;

      // Update active state
      filtersContainer.querySelector('.products__filter.active').classList.remove('active');
      btn.classList.add('active');

      currentCategory = btn.getAttribute('data-filter');

      productCards.forEach(function (card) {
        var category = card.getAttribute('data-category');
        var show = currentCategory === 'all' || category === currentCategory;
        card.style.display = show ? '' : 'none';

        // Animate in
        if (show) {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              card.style.transition = 'opacity .35s ease, transform .35s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        }
      });
    });
  }

  /* ---------- Cart Demo ---------- */
  function initCartDemo() {
    var countEl = document.querySelector('[data-cart-count]');
    var toast = document.querySelector('.cart-toast');
    var toastName = toast ? toast.querySelector('.cart-toast__name') : null;
    var count = 0;

    // Add-to-cart buttons
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-add]');
      if (!btn) return;

      e.preventDefault();

      var name = btn.getAttribute('data-add') || 'Product';
      count++;

      // Update counter
      if (countEl) {
        countEl.textContent = count;
        countEl.classList.add('bump');
        setTimeout(function () {
          countEl.classList.remove('bump');
        }, 300);
      }

      // Show toast
      if (toast && toastName) {
        toastName.textContent = name;
        toast.classList.add('show');
        setTimeout(function () {
          toast.classList.remove('show');
        }, 2500);
      }

      // Button feedback
      var original = btn.innerHTML;
      btn.innerHTML = '&#10003; Added';
      btn.disabled = true;
      setTimeout(function () {
        btn.innerHTML = original;
        btn.disabled = false;
      }, 1200);
    });
  }

  /* ---------- Contact Form ---------- */
  function initContactForm() {
    var form = document.querySelector('[data-form]');
    if (!form) return;

    var okMsg = form.querySelector('.form-ok');
    var errMsg = form.querySelector('.form-err');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simple validation
      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      var message = form.querySelector('[name="message"]');
      var valid = true;

      [name, email, message].forEach(function (field) {
        if (field && !field.value.trim()) {
          valid = false;
          field.style.borderColor = 'var(--clr-sale)';
        } else if (field) {
          field.style.borderColor = '';
        }
      });

      // Email format check
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        valid = false;
        email.style.borderColor = 'var(--clr-sale)';
      }

      if (okMsg) okMsg.style.display = 'none';
      if (errMsg) errMsg.style.display = 'none';

      if (valid) {
        if (okMsg) okMsg.style.display = 'block';
        form.reset();
      } else {
        if (errMsg) errMsg.style.display = 'block';
      }

      // Auto-hide messages
      setTimeout(function () {
        if (okMsg) okMsg.style.display = 'none';
        if (errMsg) errMsg.style.display = 'none';
      }, 5000);
    });
  }

  /* ---------- Data Year ---------- */
  function initDataYear() {
    var yearEls = document.querySelectorAll('[data-year]');
    var year = new Date().getFullYear();
    yearEls.forEach(function (el) {
      el.textContent = year;
    });
  }

  /* ---------- Scroll to Top ---------- */
  function initScrollTop() {
    var btn = document.querySelector('.scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      btn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();
