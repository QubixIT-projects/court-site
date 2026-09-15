// no page-specific script
/* ============================================================
   HAMBURGER / MOBILE NAV (shared pattern across all pages)
   Single source of truth: body.nav-open. CSS reacts to that class.
============================================================ */
(function(){
  "use strict";
  function initMobileNav(){
    var hamburgerBtn = document.getElementById('hamburger-btn');
    var navClose = document.getElementById('nav-close');
    var navScrim = document.getElementById('nav-scrim');
    var pageNav = document.getElementById('page-nav');
    if(!hamburgerBtn || !pageNav) return;

    function openNav(){ document.body.classList.add('nav-open'); }
    function closeNav(){ document.body.classList.remove('nav-open'); }

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
