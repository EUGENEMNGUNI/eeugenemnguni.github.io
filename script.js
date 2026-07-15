function showTab(name){
    document.querySelectorAll('nav.tabs button').forEach(b=>b.classList.toggle('active', b.dataset.tab===name));
    document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active', p.id==='panel-'+name));
    window.scrollTo({top:0,behavior:'smooth'});
  }
  document.getElementById('tabs').addEventListener('click', e=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    showTab(btn.dataset.tab);
  });
  document.querySelectorAll('.option-grid').forEach(grid=>{
    grid.addEventListener('click', e=>{
      const opt = e.target.closest('.option');
      if(!opt) return;
      grid.querySelectorAll('.option').forEach(o=>o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
  document.querySelectorAll('.pay-methods').forEach(grid=>{
    grid.addEventListener('click', e=>{
      const pm = e.target.closest('.pm');
      if(!pm) return;
      grid.querySelectorAll('.pm').forEach(o=>o.classList.remove('selected'));
      pm.classList.add('selected');
    });
  });

  /* =============== AUTH =============== */
  // Demo-only "database" of registered accounts. Starts with one seeded user
  // so signing in immediately works without registering first.
  const accounts = {
    'thabo.mokoena@example.com': { password: 'password123', name: 'Thabo Mokoena', phone: '082 000 0000' }
  };
  let currentUser = null;

  function showAuth(which){
    document.getElementById('login-error').classList.remove('show');
    document.getElementById('register-error').classList.remove('show');
    document.getElementById('form-login').classList.toggle('active', which==='login');
    document.getElementById('form-register').classList.toggle('active', which==='register');
  }

  function handleLogin(e){
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const account = accounts[email];
    const errorEl = document.getElementById('login-error');
    if(!account || account.password !== password){
      errorEl.textContent = 'Email or password is incorrect. Please try again.';
      errorEl.classList.add('show');
      return false;
    }
    errorEl.classList.remove('show');
    signIn(email, account);
    return false;
  }

  function handleRegister(e){
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const phone = document.getElementById('reg-phone').value.trim();
    const password = document.getElementById('reg-password').value;
    const errorEl = document.getElementById('register-error');
    if(accounts[email]){
      errorEl.textContent = 'An account with this email already exists. Please sign in instead.';
      errorEl.classList.add('show');
      return false;
    }
    errorEl.classList.remove('show');
    accounts[email] = { password, name, phone };
    signIn(email, accounts[email]);
    return false;
  }

  function signIn(email, account){
    currentUser = email;
    document.getElementById('auth').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    const initials = account.name.split(' ').filter(Boolean).map(p=>p[0]).slice(0,2).join('').toUpperCase();
    document.getElementById('avatarBtn').textContent = initials || 'U';
    document.querySelector('.dropdown-name').textContent = account.name;
    document.querySelector('.dropdown-email').textContent = email;
    document.getElementById('set-name').value = account.name;
    document.getElementById('set-email').value = email;
    document.getElementById('set-signed-in-email').textContent = email;
    showTab('home');
  }

  function handleLogout(){
    currentUser = null;
    document.getElementById('app').style.display = 'none';
    document.getElementById('auth').style.display = 'flex';
    document.getElementById('login-password').value = '';
    showAuth('login');
    closeAccountMenu();
  }

  /* =============== ACCOUNT DROPDOWN =============== */
  function toggleAccountMenu(e){
    e.stopPropagation();
    document.getElementById('accountDropdown').classList.toggle('open');
  }
  function closeAccountMenu(){
    document.getElementById('accountDropdown').classList.remove('open');
  }
  document.addEventListener('click', ()=> closeAccountMenu());

  /* =============== MY CARDS & TICKETS =============== */
  function setDefaultCard(cardKey, btn){
    document.querySelectorAll('.ticket-card').forEach(c=> c.classList.remove('active-card'));
    const card = document.querySelector('.ticket-card[data-card="'+cardKey+'"]');
    card.classList.add('active-card');
    document.querySelectorAll('.ticket-card .tag.ok').forEach(t=>{ if(t.textContent==='Default') t.textContent='Active'; });
    const tag = card.querySelector('.tag');
    if(tag) tag.textContent = 'Default';
  }
  function toggleFreeze(cardKey, btn){
    const card = document.querySelector('.ticket-card[data-card="'+cardKey+'"]');
    const frozen = card.classList.toggle('frozen');
    btn.textContent = frozen ? 'Unfreeze' : 'Freeze';
  }
  function reportLost(cardKey, btn){
    const card = document.querySelector('.ticket-card[data-card="'+cardKey+'"]');
    card.classList.add('frozen');
    const tag = card.querySelector('.tag');
    if(tag){ tag.textContent = 'Reported lost'; tag.classList.remove('ok'); tag.classList.add('pending'); }
    btn.disabled = true;
    btn.textContent = 'Reported';
  }

  /* =============== SETTINGS =============== */
  function saveProfile(){
    const el = document.getElementById('profile-saved');
    el.textContent = 'Saved';
    el.classList.add('show');
    setTimeout(()=> el.classList.remove('show'), 1800);
  }
