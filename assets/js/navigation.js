/* ============================================================
   navigation.js – mobile menu, active links, dropdowns
   ============================================================ */
'use strict';
(function mobileNav(){
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.mobile-nav');
  if(!burger || !nav) return;
  const closeBtn = nav.querySelector('.mobile-nav__close');

  const open = ()=>{
    nav.classList.add('is-open');
    burger.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const close = ()=>{
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  burger.addEventListener('click', ()=> nav.classList.contains('is-open') ? close() : open());
  if(closeBtn) closeBtn.addEventListener('click', close);
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click', close));
  document.addEventListener('keydown', e=>{ if(e.key === 'Escape') close(); });
})();

/* Active nav link based on current page */
(function activeLink(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .mobile-nav a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href === path) a.classList.add('is-active');
  });
})();
