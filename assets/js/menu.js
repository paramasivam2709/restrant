/* ============================================================
   menu.js – category filter, search, sort on menu grids
   ============================================================ */
'use strict';
(function menuTools(){
  const grids = document.querySelectorAll('[data-menu-grid]');
  if(!grids.length) return;

  /* Category filter */
  document.querySelectorAll('[data-filter]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const cat = btn.dataset.filter;
      grids.forEach(grid=>{
        grid.querySelectorAll('.food-card').forEach(card=>{
          const match = cat === 'all' || card.dataset.category === cat;
          card.classList.toggle('is-hidden', !match);
        });
      });
    });
  });

  /* Search */
  const search = document.querySelector('[data-menu-search]');
  if(search) search.addEventListener('input', ()=>{
    const q = search.value.trim().toLowerCase();
    grids.forEach(grid=>{
      grid.querySelectorAll('.food-card').forEach(card=>{
        const name = card.querySelector('.food-card__name').textContent.toLowerCase();
        card.classList.toggle('is-hidden', q && !name.includes(q));
      });
    });
  });

  /* Sort */
  const sort = document.querySelector('[data-menu-sort]');
  if(sort) sort.addEventListener('change', ()=>{
    const mode = sort.value;
    grids.forEach(grid=>{
      const cards = Array.from(grid.querySelectorAll('.food-card'));
      cards.sort((a,b)=>{
        const pa = +a.dataset.price, pb = +b.dataset.price;
        const ra = +a.dataset.rating, rb = +b.dataset.rating;
        if(mode === 'low') return pa - pb;
        if(mode === 'high') return pb - pa;
        if(mode === 'rating') return rb - ra;
        return 0;
      });
      cards.forEach(c=>grid.appendChild(c));
    });
  });

  /* Add-to-cart buttons rendered in cards */
  document.querySelectorAll('[data-add]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      e.preventDefault();
      STACKLY.addToCart({
        id: btn.dataset.id, name: btn.dataset.name,
        price: +btn.dataset.price, img: btn.dataset.img
      });
    });
  });
})();
