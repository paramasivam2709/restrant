/* ============================================================
   blog.js – blog category filter, search, pagination
   ============================================================ */
'use strict';
(function blogTools(){
  const grid = document.querySelector('[data-blog-grid]');
  if(!grid) return;
  const cards = Array.from(grid.querySelectorAll('.blog-card'));
  const perPage = 6;
  let currentPage = 1;
  let activeCat = 'all';
  let query = '';

  const pager = document.querySelector('[data-pagination]');

  function visible(){
    return cards.filter(c=>{
      const catOk = activeCat === 'all' || c.dataset.category === activeCat;
      const qOk = !query || c.querySelector('.blog-card__title').textContent.toLowerCase().includes(query);
      return catOk && qOk;
    });
  }

  function render(){
    const list = visible();
    const pages = Math.max(1, Math.ceil(list.length / perPage));
    currentPage = Math.min(currentPage, pages);
    cards.forEach(c=>c.style.display = 'none');
    list.slice((currentPage-1)*perPage, currentPage*perPage)
        .forEach(c=>{ c.style.display = ''; });
    if(pager){
      pager.innerHTML = '';
      for(let i=1;i<=pages;i++){
        const b = document.createElement('button');
        b.className = 'filter-pill' + (i===currentPage?' is-active':'');
        b.textContent = i;
        b.addEventListener('click', ()=>{ currentPage = i; render(); });
        pager.appendChild(b);
      }
    }
  }

  document.querySelectorAll('[data-blog-filter]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('[data-blog-filter]').forEach(b=>b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeCat = btn.dataset.blogFilter;
      currentPage = 1;
      render();
    });
  });

  const search = document.querySelector('[data-blog-search]');
  if(search) search.addEventListener('input', ()=>{
    query = search.value.trim().toLowerCase();
    currentPage = 1;
    render();
  });

  render();
})();

/* Comment form (blog details) */
(function comments(){
  const form = document.getElementById('commentForm');
  if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name = form.cname, msg = form.cmessage;
    let ok = true;
    if(!STACKLY.validateField(name, ['required','min:2'])) ok = false;
    if(!STACKLY.validateField(msg, ['required','min:5'])) ok = false;
    if(!ok) return;
    const list = document.getElementById('commentList');
    const div = document.createElement('div');
    div.className = 'review-item';
    div.innerHTML = `<div class="review-item__head">
        <img src="assets/img/testimonials/aarav-sharma.webp" alt="">
        <div><b></b><small>Just now</small></div></div>
      <p></p>`;
    div.querySelector('b').textContent = name.value.trim();
    div.querySelector('p').textContent = msg.value.trim();
    list.prepend(div);
    form.reset();
    STACKLY.toast('Comment posted. Thanks for sharing!', 'success');
  });
})();
