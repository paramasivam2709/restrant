/* ============================================================
   animation.js – GSAP hero reveal, parallax, staggered cards,
            AOS init, reduced-motion guard
   ============================================================ */
'use strict';
(function animations(){
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* AOS */
  if(window.AOS && !reduced){
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 90 });
  } else {
    document.querySelectorAll('[data-aos]').forEach(el=>{ el.removeAttribute('data-aos'); });
  }

  if(reduced || !window.gsap){
    document.body.classList.add('no-gsap');
    document.querySelectorAll('.hero__title').forEach(t=>t.classList.add('is-revealed'));
    return;
  }

  /* Split hero title lines into spans for reveal */
  document.querySelectorAll('.hero__title .line').forEach(line=>{
    line.innerHTML = `<span>${line.innerHTML}</span>`;
  });

  const tl = gsap.timeline({delay:.55, defaults:{ease:'power4.out'}});
  const title = document.querySelector('.hero__title');
  if(title){
    tl.to(title.querySelectorAll('.line > span'),
      {y:0, duration:1.1, stagger:.14}, 0);
    title.classList.add('is-revealed');
  }
  tl.from('.hero__eyebrow', {y:-24, opacity:0, duration:.8}, .1)
    .from('.hero__sub', {y:26, opacity:0, duration:.9}, .55)
    .from('.hero__cta .btn', {y:24, opacity:0, stagger:.12, duration:.7}, .75)
    .from('.hero__meta-item', {y:20, opacity:0, stagger:.1, duration:.6}, .95)
    .from('.hero__visual', {scale:.88, opacity:0, duration:1.2, ease:'power3.out'}, .3)
    .from('.hero__chip', {y:34, opacity:0, stagger:.15, duration:.8}, 1.05)
    .from('.hero__scroll', {opacity:0, duration:.8}, 1.4);

  /* Parallax food plate on scroll */
  const plate = document.querySelector('.hero__plate img');
  if(plate){
    gsap.to(plate, {
      yPercent: 10, ease:'none',
      scrollTrigger: {trigger:'.hero', start:'top top', end:'bottom top', scrub:1}
    });
  }
  gsap.to('.hero__glow--1', {x:-60, y:50, ease:'none',
    scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:1.4}});
  gsap.to('.hero__glow--2', {x:70, y:-40, ease:'none',
    scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:1.4}});

  /* Generic scroll-triggered reveals via GSAP where marked */
  document.querySelectorAll('[data-gsap="rise"]').forEach(el=>{
    gsap.from(el, {y:44, opacity:0, duration:.95, ease:'power3.out',
      scrollTrigger:{trigger:el, start:'top 86%'}});
  });
  document.querySelectorAll('[data-gsap="rise-stagger"]').forEach(wrap=>{
    gsap.from(wrap.children, {y:50, opacity:0, duration:.85, stagger:.11, ease:'power3.out',
      scrollTrigger:{trigger:wrap, start:'top 84%'}});
  });

  /* About media parallax */
  const aboutImg = document.querySelector('.about__media-main img');
  if(aboutImg){
    gsap.fromTo(aboutImg, {yPercent:-6}, {yPercent:6, ease:'none',
      scrollTrigger:{trigger:'.about__media', start:'top bottom', end:'bottom top', scrub:1}});
  }
})();
