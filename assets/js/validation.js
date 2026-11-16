/* ============================================================
   validation.js – reusable validators + contact form logic
   ============================================================ */
'use strict';
STACKLY.validators = {
  required: v => v.trim().length > 0 || 'This field is required.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Enter a valid email address.',
  phone: v => /^[+\d][\d\s\-()]{7,15}$/.test(v.trim()) || 'Enter a valid phone number.',
  min: n => v => v.trim().length >= n || `Must be at least ${n} characters.`,
  match: other => v => v === document.querySelector(other).value || 'Passwords do not match.'
};

STACKLY.validateField = function(input, rules){
  const group = input.closest('.form-group');
  const errEl = group ? group.querySelector('.field-error') : null;
  for(const rule of rules){
    const res = STACKLY.validators[rule](input.value);
    if(res !== true){
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      if(errEl) errEl.textContent = res;
      if(group) group.classList.add('has-error');
      return false;
    }
  }
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
  if(group) group.classList.remove('has-error');
  return true;
};

/* Contact form */
(function contactForm(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  const fields = {
    name: ['required','min:2'],
    email: ['required','email'],
    phone: ['phone'],
    subject: ['required'],
    message: ['required','min:10']
  };
  Object.keys(fields).forEach(name=>{
    const input = form.querySelector(`[name="${name}"]`);
    input.addEventListener('blur', ()=>STACKLY.validateField(input, fields[name]));
  });
  form.addEventListener('submit', e=>{
    e.preventDefault();
    let ok = true;
    Object.keys(fields).forEach(name=>{
      const input = form.querySelector(`[name="${name}"]`);
      if(!STACKLY.validateField(input, fields[name])) ok = false;
    });
    if(!ok){ STACKLY.toast('Please fix the highlighted fields.', 'error'); return; }
    const msgs = JSON.parse(localStorage.getItem('stackly_messages')||'[]');
    msgs.push({
      name: form.name.value, email: form.email.value,
      subject: form.subject.value, message: form.message.value,
      at: new Date().toISOString()
    });
    localStorage.setItem('stackly_messages', JSON.stringify(msgs));
    form.reset();
    form.querySelectorAll('.form-control').forEach(i=>i.classList.remove('is-valid'));
    STACKLY.toast('Message sent! We will reply within 24 hours.', 'success');
  });
})();
