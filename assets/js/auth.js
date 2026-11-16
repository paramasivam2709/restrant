/* ============================================================
   auth.js – demo auth flows (localStorage only, NOT secure)
   Role-based redirect: user / admin / seller dashboards
   ============================================================ */
'use strict';
(function auth(){

  /* Password visibility toggles */
  document.querySelectorAll('[data-toggle-pw]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const input = document.querySelector(btn.dataset.togglePw);
      if(!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      btn.setAttribute('aria-pressed', String(show));
      btn.querySelector('use').setAttribute('href',
        'assets/svg/sprite.svg#' + (show ? 'eye-off' : 'eye'));
    });
  });

  /* Password strength meter */
  const pwInput = document.querySelector('[data-pw-strength]');
  if(pwInput){
    const meter = document.querySelector('.pw-strength');
    const label = document.querySelector('.pw-strength-label');
    pwInput.addEventListener('input', ()=>{
      const v = pwInput.value;
      let level = 0;
      if(v.length >= 8) level++;
      if(/[A-Z]/.test(v) && /[a-z]/.test(v)) level++;
      if(/\d/.test(v)) level++;
      if(/[^A-Za-z0-9]/.test(v)) level++;
      if(!v.length) level = 0;
      meter.dataset.level = level;
      label.textContent = ['','Weak','Fair','Good','Strong'][level] || '';
      label.style.color = ['','var(--danger)','var(--warning)','#7BA428','var(--success)'][level] || '';
    });
  }

  /* Local account store is used by registration; login is a frontend-only role demo. */
  const USERS_KEY = 'stackly_users';
  const SESSION_KEY = 'stackly_session';
  const users = ()=> JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  STACKLY.logout = function(){
    localStorage.removeItem(SESSION_KEY);
    location.href = '../login.html';
  };

  /* LOGIN */
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', e=>{
      e.preventDefault();
      const email = loginForm.email.value.trim().toLowerCase();
      const emailInput = loginForm.querySelector('[name="email"]');
      const passwordInput = loginForm.querySelector('[name="password"]');
      const emailValid = STACKLY.validateField(emailInput, ['required','email']);
      const passwordValid = STACKLY.validateField(passwordInput, ['required','min:6']);
      if(!emailValid || !passwordValid) return;
      const role = loginForm.querySelector('[name="role"]').value;
      const dest = {user:'dashboard/user-dashboard.html', admin:'dashboard/admin-dashboard.html'}[role];
      if(!dest){
        STACKLY.toast('Choose a valid login role.', 'error');
        return;
      }
      const name = email.split('@')[0];
      localStorage.setItem(SESSION_KEY, JSON.stringify({email, name, role}));
      STACKLY.toast(`Welcome, ${name}!`, 'success');
      setTimeout(()=>location.href = dest, 700);
    });
  }

  /* REGISTER */
  const regForm = document.getElementById('registerForm');
  if(regForm){
    const rules = {
      name: ['required','min:2'],
      email: ['required','email'],
      phone: ['required','phone'],
      password: ['required','min:8'],
      confirm: ['required']
    };
    Object.keys(rules).forEach(n=>{
      const input = regForm.querySelector(`[name="${n}"]`);
      input.addEventListener('blur', ()=>{
        if(n === 'confirm'){
          STACKLY.validateField(input, ['required', () => input.value === regForm.password.value || 'Passwords do not match.']);
        } else STACKLY.validateField(input, rules[n]);
      });
    });
    regForm.addEventListener('submit', e=>{
      e.preventDefault();
      let ok = true;
      Object.keys(rules).forEach(n=>{
        const input = regForm.querySelector(`[name="${n}"]`);
        const rs = rules[n].slice();
        if(n==='confirm') rs.push(() => input.value === regForm.password.value || 'Passwords do not match.');
        if(!STACKLY.validateField(input, rs)) ok = false;
      });
      if(!regForm.terms.checked){
        STACKLY.toast('Please accept the terms & conditions.', 'error'); ok = false;
      }
      if(!ok) return;
      const list = users();
      if(list.some(u=>u.email.toLowerCase()===regForm.email.value.trim().toLowerCase())){
        STACKLY.toast('An account with this email already exists.', 'error');
        return;
      }
      list.push({
        name: regForm.name.value.trim(),
        email: regForm.email.value.trim(),
        phone: regForm.phone.value.trim(),
        password: regForm.password.value,
        role: regForm.querySelector('[name="role"]:checked')?.value || 'user'
      });
      localStorage.setItem(USERS_KEY, JSON.stringify(list));
      const success = document.querySelector('.auth__success');
      if(success){
        regForm.style.display = 'none';
        document.querySelector('.auth__alt').style.display = 'none';
        success.classList.add('is-show');
      }
    });
  }

  /* FORGOT PASSWORD */
  const forgotForm = document.getElementById('forgotForm');
  if(forgotForm){
    forgotForm.addEventListener('submit', e=>{
      e.preventDefault();
      const input = forgotForm.email;
      if(!STACKLY.validateField(input, ['required','email'])) return;
      const box = document.querySelector('.auth__success');
      if(box){
        box.querySelector('h2').textContent = 'Reset link sent';
        box.querySelector('p').textContent = `If an account exists for ${input.value.trim()}, a password reset link is on its way. (Demo only — no email is actually sent.)`;
        forgotForm.style.display = 'none';
        box.classList.add('is-show');
      }
    });
  }
})();
