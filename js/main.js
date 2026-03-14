(function () {
  'use strict';

  var nav = document.getElementById('main-nav');
  var hamburger = document.querySelector('.nav-hamburger');
  var dropdown = document.querySelector('.nav-dropdown');

  // Scroll behaviour: add .scrolled after 60px
  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      nav.classList.toggle('menu-open');
      document.body.style.overflow = nav.classList.contains('menu-open') ? 'hidden' : '';
    });
  }

  // Services dropdown — desktop hover, mobile click
  if (dropdown) {
    var trigger = dropdown.querySelector('.nav-dropdown-trigger');
    var menu = dropdown.querySelector('.nav-dropdown-menu');

    function open() {
      dropdown.classList.add('open');
    }
    function close() {
      dropdown.classList.remove('open');
    }

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      if (window.innerWidth < 768) {
        dropdown.classList.toggle('open');
        trigger.setAttribute('aria-expanded', dropdown.classList.contains('open'));
      }
    });

    trigger.addEventListener('mouseenter', function () {
      if (window.innerWidth >= 768) open();
    });
    dropdown.addEventListener('mouseleave', function () {
      if (window.innerWidth >= 768) close();
    });

    // Close dropdown when clicking a link (mobile)
    if (menu) {
      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          close();
          nav.classList.remove('menu-open');
          document.body.style.overflow = '';
        });
      });
    }
  }

  // Smooth scroll for anchor links (handled by CSS scroll-behavior: smooth)
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute('href');
    if (id === '#') return;
    a.addEventListener('click', function (e) {
      var el = document.querySelector(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        nav.classList.remove('menu-open');
        document.body.style.overflow = '';
      }
    });
  });
})();
