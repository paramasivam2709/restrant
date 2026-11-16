/* ============================================================
   dashboard.js – sidebar toggle, tab navigation, charts,
                  order status updates, demo data
   ============================================================ */
'use strict';
(function dash(){
  /* Links that jump to another panel */
  document.addEventListener('click', e=>{
    const link = e.target.closest('[data-panel-link]');
    if(!link) return;
    e.preventDefault();
    const target = document.querySelector(`.dash__nav a[data-panel="${link.dataset.panelLink}"]`);
    if(target) target.click();
  });
  /* Sidebar (mobile) */
  const sidebar = document.querySelector('.dash__sidebar');
  const burger = document.querySelector('.dash__burger');
  const overlay = document.querySelector('.dash__overlay');
  const toggle = force =>{
    const open = force !== undefined ? force : !sidebar.classList.contains('is-open');
    sidebar.classList.toggle('is-open', open);
    if(overlay) overlay.classList.toggle('is-show', open);
  };
  if(burger) burger.addEventListener('click', ()=>toggle());
  if(overlay) overlay.addEventListener('click', ()=>toggle(false));

  /* Sidebar nav: switch panels without reload */
  const links = document.querySelectorAll('.dash__nav a[data-panel]');
  const panels = document.querySelectorAll('.dash-panel');
  if(links.length && panels.length){
    links.forEach(a=>{
      a.addEventListener('click', e=>{
        e.preventDefault();
        links.forEach(x=>x.classList.remove('is-active'));
        a.classList.add('is-active');
        panels.forEach(p=>p.style.display = 'none');
        const target = document.getElementById(a.dataset.panel);
        if(target) target.style.display = 'block';
        const title = document.querySelector('[data-dash-title]');
        if(title) title.textContent = a.querySelector('span').textContent;
        toggle(false);
        window.scrollTo({top:0, behavior:'smooth'});
      });
    });
  }

  /* Logout */
  document.querySelectorAll('[data-logout]').forEach(b=>
    b.addEventListener('click', e=>{ e.preventDefault(); STACKLY.logout(); }));

  /* Order status select */
  document.querySelectorAll('[data-order-status]').forEach(sel=>{
    sel.addEventListener('change', ()=>{
      sel.className = 'status status--' + sel.value.toLowerCase().replace(/\s/g,'');
      STACKLY.toast(`Order ${sel.dataset.order} marked as ${sel.value}`, 'success');
    });
  });

  /* ---- Charts (canvas, no library dependency) ---- */
  function drawLine(canvas, data, labels, color){
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W*dpr; canvas.height = H*dpr;
    ctx.scale(dpr,dpr);
    const max = Math.max(...data)*1.15;
    const pad = {l:44,r:14,t:16,b:30};
    const iw = W-pad.l-pad.r, ih = H-pad.t-pad.b;
    const px = i => pad.l + iw*i/(data.length-1);
    const py = v => pad.t + ih*(1 - v/max);

    ctx.strokeStyle = '#EFE6D9'; ctx.lineWidth = 1;
    ctx.fillStyle = '#9c948a'; ctx.font = '10px Inter, sans-serif';
    for(let g=0; g<=4; g++){
      const y = pad.t + ih*g/4;
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W-pad.r, y); ctx.stroke();
      ctx.fillText(Math.round(max*(1-g/4)), 6, y+3);
    }
    /* area fill */
    const grad = ctx.createLinearGradient(0,pad.t,0,H-pad.b);
    grad.addColorStop(0, color+'33'); grad.addColorStop(1, color+'00');
    ctx.beginPath();
    data.forEach((v,i)=> i? ctx.lineTo(px(i),py(v)) : ctx.moveTo(px(0),py(v)));
    ctx.lineTo(px(data.length-1), H-pad.b); ctx.lineTo(pad.l, H-pad.b); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();
    /* line */
    ctx.beginPath();
    data.forEach((v,i)=> i? ctx.lineTo(px(i),py(v)) : ctx.moveTo(px(0),py(v)));
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin='round'; ctx.stroke();
    /* points */
    data.forEach((v,i)=>{
      ctx.beginPath(); ctx.arc(px(i),py(v),3.6,0,7);
      ctx.fillStyle='#fff'; ctx.fill(); ctx.strokeStyle=color; ctx.lineWidth=2; ctx.stroke();
    });
    /* labels */
    ctx.fillStyle = '#9c948a'; ctx.textAlign='center';
    labels.forEach((l,i)=> ctx.fillText(l, px(i), H-10));
    ctx.textAlign='left';
  }

  function drawBar(canvas, data, labels, color){
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W*dpr; canvas.height = H*dpr;
    ctx.scale(dpr,dpr);
    const max = Math.max(...data)*1.15;
    const pad = {l:40,r:10,t:14,b:30};
    const iw = W-pad.l-pad.r, ih = H-pad.t-pad.b;
    const bw = iw/data.length*0.52;
    ctx.fillStyle = '#9c948a'; ctx.font='10px Inter, sans-serif';
    for(let g=0; g<=4; g++){
      const y = pad.t + ih*g/4;
      ctx.strokeStyle='#EFE6D9'; ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(W-pad.r,y); ctx.stroke();
      ctx.fillText(Math.round(max*(1-g/4)), 4, y+3);
    }
    data.forEach((v,i)=>{
      const x = pad.l + iw*(i+.5)/data.length - bw/2;
      const h = ih*v/max;
      const grad = ctx.createLinearGradient(0, pad.t+ih-h, 0, pad.t+ih);
      grad.addColorStop(0,color); grad.addColorStop(1,color+'99');
      ctx.fillStyle = grad;
      const r = Math.min(6, bw/2);
      ctx.beginPath();
      ctx.moveTo(x, pad.t+ih);
      ctx.lineTo(x, pad.t+ih-h+r); ctx.quadraticCurveTo(x, pad.t+ih-h, x+r, pad.t+ih-h);
      ctx.lineTo(x+bw-r, pad.t+ih-h); ctx.quadraticCurveTo(x+bw, pad.t+ih-h, x+bw, pad.t+ih-h+r);
      ctx.lineTo(x+bw, pad.t+ih); ctx.closePath(); ctx.fill();
      ctx.fillStyle='#9c948a'; ctx.textAlign='center';
      ctx.fillText(labels[i], pad.l + iw*(i+.5)/data.length, H-10);
      ctx.textAlign='left';
    });
  }

  function drawDonut(canvas, parts, colors){
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W*dpr; canvas.height = H*dpr;
    ctx.scale(dpr,dpr);
    const cx = W/2, cy = H/2, r = Math.min(W,H)/2 - 12, thick = r*.42;
    const total = parts.reduce((s,p)=>s+p.value,0);
    let a = -Math.PI/2;
    parts.forEach((p,i)=>{
      const a2 = a + Math.PI*2*p.value/total;
      ctx.beginPath();
      ctx.arc(cx,cy,r,a+.03,a2-.03);
      ctx.strokeStyle = colors[i%colors.length];
      ctx.lineWidth = thick; ctx.stroke();
      a = a2;
    });
    ctx.fillStyle='#252525'; ctx.font='700 22px "Playfair Display", serif'; ctx.textAlign='center';
    ctx.fillText(total.toLocaleString('en-IN'), cx, cy+2);
    ctx.fillStyle='#777'; ctx.font='10px Inter, sans-serif';
    ctx.fillText('TOTAL', cx, cy+18); ctx.textAlign='left';
  }

  const charts = {
    revenue: {el:'chartRevenue', fn:drawLine, data:[42,58,47,66,73,61,84,78,92,86,98,110], labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], color:'#FF6B1A'},
    orders:  {el:'chartOrders', fn:drawBar, data:[65,82,74,95,88,102,94], labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], color:'#D6AD60'},
    category:{el:'chartCategory', fn:drawDonut, parts:[{value:38,label:'Main Course'},{value:22,label:'Fast Food'},{value:18,label:'Desserts'},{value:14,label:'Beverages'},{value:8,label:'Salads'}], colors:['#FF6B1A','#D6AD60','#171717','#F0A868','#8a8078']},
    sellerSales: {el:'chartSellerSales', fn:drawLine, data:[12,18,15,24,20,28,26,32], labels:['W1','W2','W3','W4','W5','W6','W7','W8'], color:'#FF6B1A'},
    sellerRev: {el:'chartSellerRev', fn:drawBar, data:[8,12,10,16,14,19,17,22], labels:['W1','W2','W3','W4','W5','W6','W7','W8'], color:'#D6AD60'}
  };

  function renderCharts(){
    Object.values(charts).forEach(c=>{
      const el = document.getElementById(c.el);
      if(!el) return;
      if(c.fn === drawDonut) c.fn(el, c.parts, c.colors);
      else c.fn(el, c.data, c.labels, c.color);
    });
  }
  window.addEventListener('resize', renderCharts);
  renderCharts();

  /* Seller: add product (demo) */
  const addForm = document.getElementById('addFoodForm');
  if(addForm){
    addForm.addEventListener('submit', e=>{
      e.preventDefault();
      const name = addForm.fname.value.trim();
      const price = +addForm.fprice.value;
      if(!name || !price){ STACKLY.toast('Fill in dish name and price.', 'error'); return; }
      const tbody = document.querySelector('[data-product-rows]');
      const tr = document.createElement('tr');
      tr.innerHTML = `<td><div class="cell-prod"><img src="../assets/img/food/biryani.webp" alt=""><div><b></b><small>Newly added</small></div></div></td>
        <td>Main Course</td><td>₹${price.toLocaleString('en-IN')}</td>
        <td><span class="status status--active">Available</span></td>
        <td><div class="cell-actions"><button aria-label="Edit"><svg><use href="../assets/svg/sprite.svg#edit"></use></svg></button>
        <button class="danger" aria-label="Delete"><svg><use href="../assets/svg/sprite.svg#trash"></use></svg></button></div></td>`;
      tr.querySelector('b').textContent = name;
      tbody.prepend(tr);
      addForm.reset();
      STACKLY.toast(`${name} added to your menu.`, 'success');
    });
    /* delete row buttons */
    document.querySelectorAll('[data-product-rows] .danger, #productTable .danger').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const tr = btn.closest('tr');
        tr.style.opacity = '.4';
        setTimeout(()=>tr.remove(), 350);
        STACKLY.toast('Product removed.', 'info');
      });
    });
  }

  /* User profile save (demo) */
  const profileForm = document.getElementById('profileForm');
  if(profileForm){
    profileForm.addEventListener('submit', e=>{
      e.preventDefault();
      STACKLY.toast('Profile updated successfully.', 'success');
    });
  }
})();
