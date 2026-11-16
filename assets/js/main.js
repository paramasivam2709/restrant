/* ============================================================
   main.js – preloader, scroll UI, counters, faq, newsletter,
            toast, back-to-top, countdown
   ============================================================ */
'use strict';

/* ---------- Preloader ---------- */
(function preloader(){
  const pre = document.getElementById('preloader');
  if(!pre) return;
  const bar = pre.querySelector('.preloader__bar span');
  const pct = pre.querySelector('.preloader__pct');
  let progress = 0;
  const tick = setInterval(()=>{
    progress = Math.min(progress + Math.random()*16, 92);
    if(bar) bar.style.width = progress + '%';
    if(pct) pct.textContent = Math.round(progress) + '%';
  }, 160);
  const finish = ()=>{
    clearInterval(tick);
    if(bar) bar.style.width = '100%';
    if(pct) pct.textContent = '100%';
    setTimeout(()=>{ pre.classList.add('is-done'); document.body.classList.add('is-loaded'); }, 420);
  };
  if(document.readyState === 'complete') setTimeout(finish, 500);
  else window.addEventListener('load', ()=>setTimeout(finish, 400));
  setTimeout(finish, 4500); // safety fallback
})();

/* ---------- Scroll progress + back-to-top ---------- */
(function scrollUI(){
  const bar = document.querySelector('.scroll-progress');
  const toTop = document.getElementById('toTop');
  const onScroll = ()=>{
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    if(bar) bar.style.width = (scrolled*100) + '%';
    if(toTop) toTop.classList.toggle('is-visible', h.scrollTop > 500);
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  if(toTop) toTop.addEventListener('click', ()=>window.scrollTo({top:0, behavior:'smooth'}));
})();

/* ---------- Sticky header ---------- */
(function stickyHeader(){
  const header = document.querySelector('.header');
  if(!header) return;
  const onScroll = ()=> header.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();

/* ---------- Animated counters ---------- */
(function counters(){
  const els = document.querySelectorAll('[data-count]');
  if(!els.length) return;
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting) return;
      const el = en.target;
      io.unobserve(el);
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1800;
      const start = performance.now();
      const step = now=>{
        const p = Math.min((now-start)/dur, 1);
        const eased = 1 - Math.pow(1-p, 3);
        el.textContent = Math.round(target*eased) + suffix;
        if(p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, {threshold:.5});
  els.forEach(el=>io.observe(el));
})();

/* ---------- FAQ accordion ---------- */
(function faq(){
  document.querySelectorAll('.faq__item').forEach(item=>{
    const q = item.querySelector('.faq__q');
    const a = item.querySelector('.faq__a');
    if(!q || !a) return;
    q.addEventListener('click', ()=>{
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq__item.is-open').forEach(o=>{
        o.classList.remove('is-open');
        o.querySelector('.faq__a').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('is-open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
})();

/* ---------- Newsletter ---------- */
(function newsletter(){
  const form = document.querySelector('.newsletter__form');
  if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const email = input.value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){
      input.classList.add('is-invalid');
      STACKLY.toast('Please enter a valid email address.', 'error');
      return;
    }
    input.classList.remove('is-invalid');
    const subs = JSON.parse(localStorage.getItem('stackly_subs')||'[]');
    if(!subs.includes(email)) subs.push(email);
    localStorage.setItem('stackly_subs', JSON.stringify(subs));
    input.value = '';
    STACKLY.toast('Subscribed! Fresh flavours coming to your inbox.', 'success');
  });
})();

/* ---------- Countdown timers ---------- */
(function countdown(){
  document.querySelectorAll('[data-countdown]').forEach(el=>{
    const end = new Date(el.dataset.countdown).getTime();
    const cells = {
      d: el.querySelector('[data-cd="days"]'),
      h: el.querySelector('[data-cd="hours"]'),
      m: el.querySelector('[data-cd="mins"]'),
      s: el.querySelector('[data-cd="secs"]')
    };
    const pad = n => String(n).padStart(2,'0');
    const tick = ()=>{
      const diff = Math.max(0, end - Date.now());
      if(cells.d) cells.d.textContent = pad(Math.floor(diff/864e5));
      if(cells.h) cells.h.textContent = pad(Math.floor(diff/36e5)%24);
      if(cells.m) cells.m.textContent = pad(Math.floor(diff/6e4)%60);
      if(cells.s) cells.s.textContent = pad(Math.floor(diff/1e3)%60);
    };
    tick();
    setInterval(tick, 1000);
  });
})();

/* ---------- Stagger reveal (CSS-driven) ---------- */
(function stagger(){
  const els = document.querySelectorAll('[data-stagger]');
  if(!els.length) return;
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('is-in'); io.unobserve(en.target); }});
  }, {threshold:.2});
  els.forEach(el=>io.observe(el));
})();

/* ---------- GLOBAL STACKLY helpers ---------- */
window.STACKLY = window.STACKLY || {};

STACKLY.icon = function(name, cls){
  return `<svg class="${cls||''}" aria-hidden="true"><use href="assets/svg/sprite.svg#${name}"></use></svg>`;
};

STACKLY.toast = function(msg, type){
  type = type || 'info';
  let wrap = document.querySelector('.toast-wrap');
  if(!wrap){
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const icons = {success:'check', error:'close', info:'sparkle'};
  const t = document.createElement('div');
  t.className = 'toast toast--' + type;
  t.innerHTML = `<svg><use href="assets/svg/sprite.svg#${icons[type]||'sparkle'}"></use></svg><span>${msg}</span>`;
  wrap.appendChild(t);
  setTimeout(()=>{ t.classList.add('is-leaving'); setTimeout(()=>t.remove(), 400); }, 3200);
};
