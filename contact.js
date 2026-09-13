var toastEl = document.getElementById('toast');
  document.getElementById('contact-form').addEventListener('submit', function(e){
    e.preventDefault();
    toastEl.textContent = "Message sent — we'll be in touch soon";
    toastEl.classList.add('show');
    setTimeout(function(){ toastEl.classList.remove('show'); }, 2600);
    this.reset();
  });
/* ============================================================
   HAMBURGER / MOBILE NAV (shared pattern across all pages)
============================================================ */
(function(){
  "use strict";
  function initMobileNav(){
    var hamburgerBtn = document.getElementById('hamburger-btn');
    var pageNav = document.getElementById('page-nav');
    var navClose = document.getElementById('nav-close');
    var navScrim = document.getElementById('nav-scrim');
    if(!hamburgerBtn || !pageNav) return;

    function openNav(){
      pageNav.classList.add('mobile-open');
      if(navScrim) navScrim.classList.add('show');
      hamburgerBtn.style.display = 'none';
      hamburgerBtn.setAttribute('aria-expanded', 'true');
    }
    function closeNav(){
      pageNav.classList.remove('mobile-open');
      if(navScrim) navScrim.classList.remove('show');
      hamburgerBtn.style.display = '';
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }

    hamburgerBtn.addEventListener('click', openNav);
    if(navClose) navClose.addEventListener('click', closeNav);
    if(navScrim) navScrim.addEventListener('click', closeNav);

    pageNav.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', closeNav);
    });

    window.addEventListener('resize', function(){
      if(window.innerWidth > 760) closeNav();
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
})();
