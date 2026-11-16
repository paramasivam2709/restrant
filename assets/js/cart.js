/* ============================================================
   cart.js – cart drawer, localStorage cart, wishlist, quick view
   ============================================================ */
'use strict';
(function cartModule(){
  const KEY = 'stackly_cart';
  const WISH = 'stackly_wishlist';

  const money = n => '₹' + Number(n).toLocaleString('en-IN');

  const getCart = ()=> JSON.parse(localStorage.getItem(KEY) || '[]');
  const saveCart = c => localStorage.setItem(KEY, JSON.stringify(c));

  const getWish = ()=> JSON.parse(localStorage.getItem(WISH) || '[]');
  const saveWish = w => localStorage.setItem(WISH, JSON.stringify(w));

  /* badge */
  function updateBadge(){
    const cart = getCart();
    const count = cart.reduce((s,i)=>s+i.qty, 0);
    document.querySelectorAll('.header__cart-count').forEach(b=>{
      b.textContent = count;
      b.style.display = count ? 'grid' : 'none';
    });
  }

  /* drawer refs */
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');

  function openDrawer(){
    if(!drawer) return;
    renderCart();
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer(){
    if(!drawer) return;
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-open-cart]').forEach(b=>b.addEventListener('click', e=>{e.preventDefault(); openDrawer();}));
  document.querySelectorAll('[data-close-cart]').forEach(b=>b.addEventListener('click', closeDrawer));
  if(overlay) overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeDrawer(); });

  function addToCart(item, qty){
    qty = qty || 1;
    const cart = getCart();
    const found = cart.find(i=>i.id===item.id);
    if(found) found.qty += qty;
    else cart.push({...item, qty});
    saveCart(cart);
    updateBadge();
    STACKLY.toast(`${item.name} added to cart`, 'success');
    openDrawer();
  }
  STACKLY.addToCart = addToCart;

  function changeQty(id, delta){
    const cart = getCart();
    const it = cart.find(i=>i.id===id);
    if(!it) return;
    it.qty += delta;
    if(it.qty <= 0) cart.splice(cart.indexOf(it),1);
    saveCart(cart);
    updateBadge();
    renderCart();
  }
  STACKLY.changeQty = changeQty;

  function removeItem(id){
    saveCart(getCart().filter(i=>i.id!==id));
    updateBadge();
    renderCart();
  }

  function renderCart(){
    if(!drawer) return;
    const cart = getCart();
    const body = drawer.querySelector('.cart-drawer__body');
    const foot = drawer.querySelector('.cart-drawer__foot');
    if(!cart.length){
      body.innerHTML = `<div class="cart-empty">
        <svg><use href="assets/svg/sprite.svg#cart"></use></svg>
        <p>Your cart is feeling hungry.<br>Add something delicious!</p></div>`;
      foot.style.display = 'none';
      return;
    }
    foot.style.display = 'block';
    body.innerHTML = cart.map(i=>`
      <div class="cart-item">
        <div class="cart-item__img"><img src="${i.img}" alt="${i.name}"></div>
        <div class="cart-item__info">
          <b>${i.name}</b>
          <span class="price">${money(i.price)}</span>
          <div class="cart-item__row">
            <div class="qty">
              <button data-dec="${i.id}" aria-label="Decrease"><svg><use href="assets/svg/sprite.svg#minus"></use></svg></button>
              <output>${i.qty}</output>
              <button data-inc="${i.id}" aria-label="Increase"><svg><use href="assets/svg/sprite.svg#plus"></use></svg></button>
            </div>
            <button class="cart-item__remove" data-del="${i.id}" aria-label="Remove"><svg><use href="assets/svg/sprite.svg#trash"></use></svg></button>
          </div>
        </div>
      </div>`).join('');

    const sub = cart.reduce((s,i)=>s+i.price*i.qty,0);
    const tax = Math.round(sub*0.05);
    const del = sub > 500 ? 0 : 40;
    drawer.querySelector('[data-cart-sub]').textContent = money(sub);
    drawer.querySelector('[data-cart-tax]').textContent = money(tax);
    drawer.querySelector('[data-cart-del]').textContent = del === 0 ? 'FREE' : money(del);
    drawer.querySelector('[data-cart-total]').textContent = money(sub + tax + del);

    body.querySelectorAll('[data-inc]').forEach(b=>b.onclick = ()=>changeQty(b.dataset.inc, 1));
    body.querySelectorAll('[data-dec]').forEach(b=>b.onclick = ()=>changeQty(b.dataset.dec, -1));
    body.querySelectorAll('[data-del]').forEach(b=>b.onclick = ()=>removeItem(b.dataset.del));
  }

  /* Checkout (demo) */
  const checkoutBtn = document.querySelector('[data-checkout]');
  if(checkoutBtn) checkoutBtn.addEventListener('click', ()=>{
    if(!getCart().length){ STACKLY.toast('Your cart is empty.', 'error'); return; }
    STACKLY.toast('Demo checkout — connect a payment backend to go live.', 'info');
  });

  /* Wishlist toggle buttons */
  document.querySelectorAll('[data-wish]').forEach(btn=>{
    const id = btn.dataset.wish;
    if(getWish().includes(id)) btn.classList.add('is-active');
    btn.addEventListener('click', e=>{
      e.preventDefault();
      let w = getWish();
      if(w.includes(id)){ w = w.filter(x=>x!==id); btn.classList.remove('is-active'); STACKLY.toast('Removed from wishlist', 'info'); }
      else { w.push(id); btn.classList.add('is-active'); STACKLY.toast('Saved to wishlist', 'success'); }
      saveWish(w);
    });
  });

  /* Quick view */
  const modal = document.getElementById('quickView');
  document.querySelectorAll('[data-quickview]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const d = btn.dataset;
      if(!modal) return;
      modal.querySelector('.qv__img img').src = d.img;
      modal.querySelector('.qv__img img').alt = d.name;
      modal.querySelector('.qv__cat').textContent = d.cat || 'Speciality';
      modal.querySelector('.qv__body h3').textContent = d.name;
      modal.querySelector('.qv__desc').textContent = d.desc || '';
      modal.querySelector('.qv__price').innerHTML = money(d.price) + (d.old ? `<s>${money(d.old)}</s>` : '');
      modal.querySelector('.qv__rating span').textContent = d.rating + ' (' + d.reviews + ' reviews)';
      const addBtn = modal.querySelector('[data-qv-add]');
      addBtn.dataset.id = d.id; addBtn.dataset.name = d.name;
      addBtn.dataset.price = d.price; addBtn.dataset.img = d.img;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });
  if(modal){
    modal.querySelectorAll('[data-close-modal]').forEach(b=>b.addEventListener('click', ()=>{
      modal.classList.remove('is-open'); document.body.style.overflow = '';
    }));
    const qvAdd = modal.querySelector('[data-qv-add]');
    if(qvAdd) qvAdd.addEventListener('click', ()=>{
      addToCart({id:qvAdd.dataset.id, name:qvAdd.dataset.name, price:+qvAdd.dataset.price, img:qvAdd.dataset.img}, 1);
    });
    modal.querySelectorAll('.qty button').forEach(b=>{
      b.addEventListener('click', ()=>{
        const out = modal.querySelector('.qty output');
        let v = +out.textContent + (b.dataset.qvQty === 'inc' ? 1 : -1);
        out.textContent = Math.max(1, v);
      });
    });
  }

  updateBadge();
})();
