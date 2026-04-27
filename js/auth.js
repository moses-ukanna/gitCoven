// GitCoven — Auth via Supabase
// Supports: Google, GitHub, Magic Link, Email+Password

// ─── SUPABASE CLIENT ──────────────────────────────────────────
const SUPABASE_URL = 'https://lenhjesrktbbogbhtwzk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_U65pkByCwwp8S0fWUla2RA_y_9RpPJS';
var sb; // Supabase client instance
try {
  sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch(e) {
  console.error('Supabase client failed to init:', e);
}

var userName = '';
var userUsername = '';
var userEmail = '';
var userId = '';

// ─── RANK SYSTEM ──────────────────────────────────────────────
var RANKS = [
  { min:0,  icon:'🌱', name:'Apprentice',     desc:'Just getting started' },
  { min:4,  icon:'⚡', name:'Initiate',        desc:'Learning the basics' },
  { min:8,  icon:'🔥', name:'Practitioner',   desc:'Building real skills' },
  { min:13, icon:'🧪', name:'Wizard',         desc:'Advanced territory' },
  { min:19, icon:'🧙', name:'Sorcerer',       desc:'Enterprise level' },
  { min:25, icon:'👑', name:'Enterprise Pro', desc:'Full coven graduate' }
];
function getRank(n) { var r = RANKS[0]; for (var i = 0; i < RANKS.length; i++) { if (n >= RANKS[i].min) r = RANKS[i]; } return r; }

// ─── SIDEBAR TOGGLE ───────────────────────────────────────────
function toggleSidebar() {
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  var btn = document.getElementById('mob-toggle');
  var isOpen = sidebar.classList.toggle('open');
  overlay.classList.toggle('open', isOpen);
  btn.classList.toggle('hidden', isOpen);
}

// ─── PROGRESS: SAVE ───────────────────────────────────────────
async function saveProgress() {
  if (!userId) return;
  var pd = {
    current_phase: current,
    completed_phases: Array.from(completed),
    challenge_data: challengeState.map(function(cs) { return { solved: cs.solved, attempts: cs.attempts }; })
  };
  // Save to localStorage always (instant, offline-safe)
  try { localStorage.setItem('gc_progress', JSON.stringify(pd)); } catch(e) {}
  // Save to Supabase
  if (!sb) return;
  try {
    await sb.from('user_progress').upsert({ user_id: userId, data: pd, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    var today = new Date().toISOString().split('T')[0];
    await sb.from('user_visits').upsert({ user_id: userId, visit_date: today }, { onConflict: 'user_id,visit_date' });
  } catch(e) { console.error('Save error:', e); }
}

// ─── PROGRESS: LOAD ───────────────────────────────────────────
async function loadProgress() {
  if (!userId || !sb) { applyLocalFallback(); return; }
  try {
    var result = await sb.from('user_progress').select('data').eq('user_id', userId).single();
    if (result.data && result.data.data) applyProgressData(result.data.data);
    else applyLocalFallback();
  } catch(e) { applyLocalFallback(); }
}
function applyProgressData(d) {
  current = d.current_phase || 0;
  var cp = d.completed_phases || [];
  for (var i = 0; i < cp.length; i++) completed.add(cp[i]);
  var cd = d.challenge_data || [];
  for (var i = 0; i < cd.length; i++) {
    if (challengeState[i]) {
      challengeState[i].solved = cd[i].solved || [];
      challengeState[i].attempts = cd[i].attempts || [];
    }
  }
}
function applyLocalFallback() {
  try {
    var local = JSON.parse(localStorage.getItem('gc_progress'));
    if (local) applyProgressData(local);
  } catch(e) {}
}

// ─── STREAK ───────────────────────────────────────────────────
async function getStreak() {
  if (!userId || !sb) return 0;
  try {
    var result = await sb.from('user_visits').select('visit_date').eq('user_id', userId).order('visit_date', { ascending: false });
    var data = result.data;
    if (!data || !data.length) return 0;
    var today = new Date().toISOString().split('T')[0];
    var streak = 0, check = today;
    for (var i = 0; i < data.length; i++) {
      if (data[i].visit_date === check) {
        streak++;
        var dt = new Date(check); dt.setDate(dt.getDate()-1);
        check = dt.toISOString().split('T')[0];
      } else if (data[i].visit_date < check) break;
    }
    return streak;
  } catch(e) { return 0; }
}

// ─── AUTH UI ──────────────────────────────────────────────────
var currentTab = 'login';

function switchTab(tab) {
  currentTab = tab;
  var forms = ['login','register','magic'];
  for (var i = 0; i < forms.length; i++) {
    var el = document.getElementById('form-' + forms[i]);
    if (el) el.style.display = forms[i] === tab ? 'block' : 'none';
  }
  var tabs = document.querySelectorAll('.auth-tab');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  var at = document.getElementById('tab-' + tab);
  if (at) at.classList.add('active');
  hideError();
}

function showError(msg) {
  var el = document.getElementById('auth-error');
  el.textContent = msg;
  el.style.color = '';
  el.style.background = '';
  el.style.borderColor = '';
  el.classList.add('show');
}
function hideError() {
  var el = document.getElementById('auth-error');
  if (el) el.classList.remove('show');
}
function showSuccess(msg) {
  var el = document.getElementById('auth-error');
  el.textContent = msg;
  el.style.color = '#7ee787';
  el.style.background = 'rgba(63,185,80,.08)';
  el.style.borderColor = 'rgba(63,185,80,.2)';
  el.classList.add('show');
}

// ─── OAUTH ────────────────────────────────────────────────────
async function signInWithOAuth(provider) {
  hideError();
  if (!sb) return showError('Auth service not loaded. Please refresh.');
  var result = await sb.auth.signInWithOAuth({
    provider: provider,
    options: { redirectTo: window.location.origin + window.location.pathname }
  });
  if (result.error) showError(result.error.message);
}

// ─── EMAIL + PASSWORD ─────────────────────────────────────────
async function doRegister() {
  hideError();
  if (!sb) return showError('Auth service not loaded. Please refresh.');
  var name = document.getElementById('reg-name').value.trim();
  var email = document.getElementById('reg-email').value.trim();
  var password = document.getElementById('reg-password').value.trim();
  if (!name) return showError('Please enter your name.');
  if (!email) return showError('Please enter your email.');
  if (password.length < 6) return showError('Password must be at least 6 characters.');

  var result = await sb.auth.signUp({
    email: email,
    password: password,
    options: { data: { display_name: name } }
  });
  if (result.error) return showError(result.error.message);
  if (result.data.user && !result.data.session) {
    showSuccess('Check your email for a confirmation link. Click it, then come back and sign in.');
  } else if (result.data.session) {
    await handleSession(result.data.session);
  }
}

async function doLogin() {
  hideError();
  if (!sb) return showError('Auth service not loaded. Please refresh.');
  var email = document.getElementById('login-email').value.trim();
  var password = document.getElementById('login-password').value.trim();
  if (!email || !password) return showError('Please fill in both fields.');

  var result = await sb.auth.signInWithPassword({ email: email, password: password });
  if (result.error) return showError(result.error.message);
  if (result.data.session) await handleSession(result.data.session);
}

// ─── MAGIC LINK ───────────────────────────────────────────────
async function doMagicLink() {
  hideError();
  if (!sb) return showError('Auth service not loaded. Please refresh.');
  var email = document.getElementById('magic-email').value.trim();
  if (!email) return showError('Please enter your email.');

  var result = await sb.auth.signInWithOtp({
    email: email,
    options: { shouldCreateUser: true, emailRedirectTo: window.location.origin + window.location.pathname }
  });
  if (result.error) return showError(result.error.message);
  showSuccess('Magic link sent! Check your email and click the link to sign in.');
}

// ─── SESSION HANDLER ──────────────────────────────────────────
async function handleSession(session) {
  if (!session || !session.user) return;
  var user = session.user;
  userId = user.id;
  userEmail = user.email || '';
  var meta = user.user_metadata || {};
  userName = meta.display_name || meta.full_name || meta.name || userEmail.split('@')[0];
  userUsername = meta.user_name || meta.preferred_username || userEmail.split('@')[0];

  if (sb) {
    await sb.from('user_progress').upsert(
      { user_id: userId, data: {}, updated_at: new Date().toISOString() },
      { onConflict: 'user_id', ignoreDuplicates: true }
    );
    var today = new Date().toISOString().split('T')[0];
    await sb.from('user_visits').upsert(
      { user_id: userId, visit_date: today },
      { onConflict: 'user_id,visit_date' }
    );
  }

  await loadProgress();
  document.getElementById('auth-overlay').style.display = 'none';
  updateUserDisplay();
  renderPhase();
}

// ─── LOGOUT / RESET ───────────────────────────────────────────
async function doLogout() {
  await saveProgress();
  if (sb) await sb.auth.signOut();
  userName = ''; userEmail = ''; userId = ''; userUsername = '';
  current = 0; completed.clear();
  challengeState.forEach(function(cs) { cs.solved.fill(false); cs.attempts.fill(0); });
  closeProfile();
  document.getElementById('auth-overlay').style.display = 'flex';
  switchTab('login');
}

async function doReset() {
  if (!confirm('Reset ALL your progress? This cannot be undone.')) return;
  current = 0; completed.clear();
  challengeState.forEach(function(cs) { cs.solved.fill(false); cs.attempts.fill(0); });
  await saveProgress();
  closeProfile();
  renderPhase();
}

// ─── PROFILE PANEL ────────────────────────────────────────────
async function openProfile() {
  var panel = document.getElementById('profile-panel');
  var pc = completed.size;
  var tc = 0;
  for (var i = 0; i < challengeState.length; i++) {
    for (var j = 0; j < challengeState[i].solved.length; j++) {
      if (challengeState[i].solved[j]) tc++;
    }
  }
  var rank = getRank(pc);
  var nextIdx = RANKS.indexOf(rank) + 1;
  var nextRank = nextIdx < RANKS.length ? RANKS[nextIdx] : null;
  var streak = await getStreak();
  var daysSince = 1;
  if (sb) {
    try {
      var result = await sb.from('user_visits').select('visit_date').eq('user_id', userId).order('visit_date', { ascending: true }).limit(1);
      if (result.data && result.data.length) daysSince = Math.max(1, Math.round((new Date() - new Date(result.data[0].visit_date)) / 86400000));
    } catch(e) {}
  }

  document.getElementById('prof-avatar').textContent = userName.charAt(0).toUpperCase();
  document.getElementById('prof-name').textContent = userName;
  document.getElementById('prof-rank-badge').textContent = userEmail + ' · ' + rank.icon + ' ' + rank.name;
  document.getElementById('prof-rank-icon').textContent = rank.icon;
  document.getElementById('prof-rank-name').textContent = rank.name;
  document.getElementById('prof-rank-desc').textContent = rank.desc;
  var pct = nextRank ? Math.round((pc - rank.min) / (nextRank.min - rank.min) * 100) : 100;
  document.getElementById('prof-rank-fill').style.width = pct + '%';
  document.getElementById('prof-rank-label').textContent = nextRank ? pc + ' / ' + nextRank.min + ' phases to ' + nextRank.name : pc + ' / ' + phases.length + ' — Maximum rank!';
  document.getElementById('prof-phases').textContent = pc;
  document.getElementById('prof-challenges').textContent = tc;
  document.getElementById('prof-streak').textContent = streak;
  document.getElementById('prof-since').textContent = daysSince;

  var list = document.getElementById('prof-phase-list');
  var html = '';
  for (var i = 0; i < phases.length; i++) {
    var done = completed.has(i) && challengeState[i].solved.every(Boolean);
    var num = String(i+1).padStart(2,'0');
    var check = done ? '<div class="phase-row-check">✓</div>' : '';
    html += '<div class="phase-row ' + (done?'done-row':'') + '"><div class="phase-dot"></div><div class="phase-row-name">' + num + '. ' + phases[i].title + '</div>' + check + '</div>';
  }
  list.innerHTML = html;
  panel.classList.add('open');
}

function closeProfile(e) {
  if (e && e.target !== document.getElementById('profile-panel')) return;
  document.getElementById('profile-panel').classList.remove('open');
}

// ─── UI HELPERS ───────────────────────────────────────────────
function updateUserDisplay() {
  var el = document.getElementById('topbar-user');
  if (el && userName) {
    el.innerHTML = '<span style="color:var(--text3)">👤</span><span class="topbar-user-name">' + userName + '</span>';
    el.onclick = openProfile;
  }
  var sub = document.querySelector('.logo-sub');
  if (sub && userName) sub.textContent = 'Hey, ' + userName + ' 👋';
}

function personalizeLabs(html) {
  if (!userName) return html;
  return html.replace(/\[NAME\]/g, userName).replace(/"Your Name"/g, '"' + userName + '"').replace(/'Your Name'/g, "'" + userName + "'");
}

// ─── KEYBOARD ─────────────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter') return;
  var overlay = document.getElementById('auth-overlay');
  if (!overlay || overlay.style.display === 'none') return;
  if (currentTab === 'login') doLogin();
  else if (currentTab === 'register') doRegister();
  else if (currentTab === 'magic') doMagicLink();
});

// ─── STARTUP ──────────────────────────────────────────────────
(async function init() {
  if (!sb) {
    document.getElementById('auth-overlay').style.display = 'flex';
    return;
  }
  sb.auth.onAuthStateChange(async function(event, session) {
    if (event === 'SIGNED_IN' && session) await handleSession(session);
  });
  var result = await sb.auth.getSession();
  if (result.data && result.data.session) {
    await handleSession(result.data.session);
  } else {
    document.getElementById('auth-overlay').style.display = 'flex';
    setTimeout(function() { var inp = document.getElementById('login-email'); if (inp) inp.focus(); }, 200);
  }
})();