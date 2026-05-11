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
    challenge_data: challengeState.map(function(cs) { return { solved: cs.solved, attempts: cs.attempts, hintsUsed: cs.hintsUsed, answersUsed: cs.answersUsed }; })
  };
  // Save to localStorage tagged with user_id
  try {
    localStorage.setItem('gc_progress', JSON.stringify(pd));
    localStorage.setItem('gc_progress_uid', userId);
  } catch(e) {}
  // Save to Supabase
  if (!sb) return;
  try {
    await sb.from('user_progress').upsert({ user_id: userId, data: pd, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    var today = new Date().toISOString().split('T')[0];
    await sb.from('user_visits').upsert({ user_id: userId, visit_date: today }, { onConflict: 'user_id,visit_date' });
    await updateLeaderboard();
  } catch(e) { console.error('Save error:', e); }
}

// ─── PROGRESS: LOAD ───────────────────────────────────────────
async function loadProgress() {
  // Only load localStorage if it belongs to the current user
  try {
    var storedUid = localStorage.getItem('gc_progress_uid');
    if (storedUid && storedUid === userId) {
      var local = JSON.parse(localStorage.getItem('gc_progress'));
      if (local) applyProgressData(local);
    }
  } catch(e) {}

  // Then sync with server (server data wins if available)
  if (!userId || !sb) return;
  try {
    var result = await sb.from('user_progress').select('data').eq('user_id', userId).single();
    if (result.data && result.data.data) {
      applyProgressData(result.data.data);
    } else {
      // New account with no server data — ensure clean slate
      resetLocalState();
    }
  } catch(e) {
    // No record found = new account, reset to clean state
    resetLocalState();
  }
}

function resetLocalState() {
  current = 0;
  completed.clear();
  challengeState.forEach(function(cs) {
    cs.solved.fill(false);
    cs.attempts.fill(0);
    cs.hintsUsed.fill(false);
    cs.answersUsed.fill(false);
  });
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
      challengeState[i].hintsUsed = cd[i].hintsUsed || new Array(challengeState[i].solved.length).fill(false);
      challengeState[i].answersUsed = cd[i].answersUsed || new Array(challengeState[i].solved.length).fill(false);
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
  hideError();

  // If switching TO forgot: hide everything, show only forgot form
  if (tab === 'forgot') {
    ['form-login','form-register','form-magic'].forEach(function(id) {
      var el = document.getElementById(id); if (el) el.style.display = 'none';
    });
    var forgot = document.getElementById('form-forgot');
    if (forgot) forgot.style.display = 'block';
    document.querySelectorAll('.auth-tab').forEach(function(t) { t.style.display = 'none'; });
    var oauth = document.getElementById('oauth-section');
    var divider = document.getElementById('oauth-divider');
    if (oauth) oauth.style.display = 'none';
    if (divider) divider.style.display = 'none';
    return;
  }

  // Normal tab switch — restore everything to original state
  var forgot = document.getElementById('form-forgot');
  if (forgot) forgot.style.display = 'none';

  // Restore tabs visibility
  document.querySelectorAll('.auth-tab').forEach(function(t) {
    t.style.display = '';
    t.classList.remove('active');
  });
  var at = document.getElementById('tab-' + tab);
  if (at) at.classList.add('active');

  // Restore OAuth section
  var oauth = document.getElementById('oauth-section');
  var divider = document.getElementById('oauth-divider');
  if (oauth) oauth.style.display = 'flex';
  if (divider) divider.style.display = 'flex';

  // Show/hide forms
  var forms = ['login','register','magic'];
  for (var i = 0; i < forms.length; i++) {
    var el = document.getElementById('form-' + forms[i]);
    if (el) el.style.display = forms[i] === tab ? 'block' : 'none';
  }
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


// ─── FORGOT PASSWORD ──────────────────────────────────────────
async function doForgotPassword() {
  hideError();
  if (!sb) return showError('Auth service not loaded. Please refresh.');
  var email = document.getElementById('forgot-email').value.trim();
  if (!email) return showError('Please enter your email address.');
  var result = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + window.location.pathname
  });
  if (result.error) return showError(result.error.message);
  showSuccess('Password reset email sent! Check your inbox and click the link.');
}

// ─── PASSWORD RESET FORM (shown after clicking reset link) ───
function showPasswordResetForm() {
  var overlay = document.getElementById('auth-overlay');
  overlay.style.display = 'flex';
  document.querySelectorAll('.auth-tab').forEach(function(t) { t.style.display = 'none'; });
  ['form-login','form-register','form-magic','form-forgot'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  var oauthSection = document.getElementById('oauth-section');
  var oauthDivider = document.getElementById('oauth-divider');
  if (oauthSection) oauthSection.style.display = 'none';
  if (oauthDivider) oauthDivider.style.display = 'none';
  // Show reset form
  var resetForm = document.getElementById('form-reset-password');
  if (resetForm) {
    resetForm.style.display = 'block';
  } else {
    // Create the reset form dynamically
    var form = document.createElement('div');
    form.id = 'form-reset-password';
    form.innerHTML = '<div style="text-align:center;margin-bottom:16px;">' +
      '<div style="font-size:28px;margin-bottom:8px;">🔑</div>' +
      '<div style="font-family:Syne,sans-serif;font-weight:700;font-size:18px;color:var(--text0);margin-bottom:4px;">Set New Password</div>' +
      '<div style="font-size:12px;color:var(--text3);font-family:JetBrains Mono,monospace;">Enter your new password below.</div>' +
    '</div>' +
    '<div class="auth-field">' +
      '<label class="auth-label">New Password (min 6 characters)</label>' +
      '<input class="auth-input" id="reset-password" type="password" placeholder="••••••••" autocomplete="new-password" />' +
    '</div>' +
    '<div class="auth-field">' +
      '<label class="auth-label">Confirm Password</label>' +
      '<input class="auth-input" id="reset-password-confirm" type="password" placeholder="••••••••" autocomplete="new-password" />' +
    '</div>' +
    '<button class="auth-btn" onclick="doUpdatePassword()">Update Password →</button>';
    // Insert before auth-footer
    var footer = authBody.querySelector('.auth-footer');
    if (footer) authBody.insertBefore(form, footer);
    else authBody.appendChild(form);
  }
  hideError();
}

async function doUpdatePassword() {
  hideError();
  if (!sb) return showError('Auth service not loaded. Please refresh.');
  var pw = document.getElementById('reset-password').value.trim();
  var confirm = document.getElementById('reset-password-confirm').value.trim();
  if (pw.length < 6) return showError('Password must be at least 6 characters.');
  if (pw !== confirm) return showError('Passwords do not match.');

  var result = await sb.auth.updateUser({ password: pw });
  if (result.error) return showError(result.error.message);

  // Success — restore normal UI and sign in
  showSuccess('Password updated! Signing you in…');
  var resetForm = document.getElementById('form-reset-password');
  if (resetForm) resetForm.style.display = 'none';
  document.querySelectorAll('.auth-tab').forEach(function(t) { t.style.display = ''; });
  // Wait briefly, then handle the session
  setTimeout(async function() {
    var sess = await sb.auth.getSession();
    if (sess.data && sess.data.session) {
      await handleSession(sess.data.session);
    } else {
      switchTab('login');
    }
  }, 1500);
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


// ─── LEADERBOARD ──────────────────────────────────────────────
async function updateLeaderboard() {
  if (!userId || !sb) return;
  var pc = completed.size;
  var tc = 0;
  for (var i = 0; i < challengeState.length; i++) {
    for (var j = 0; j < challengeState[i].solved.length; j++) {
      if (challengeState[i].solved[j]) tc++;
    }
  }
  var rank = getRank(pc);
  var streak = await getStreak();
  await sb.from('leaderboard').upsert({
    user_id: userId,
    display_name: userName,
    phases_completed: pc,
    challenges_solved: tc,
    streak: streak,
    rank_name: rank.name,
    rank_icon: rank.icon,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });
}

async function loadLeaderboard() {
  if (!sb) return [];
  try {
    var result = await sb.from('leaderboard')
      .select('*')
      .order('phases_completed', { ascending: false })
      .order('challenges_solved', { ascending: false })
      .limit(100);
    var data = result.data || [];
    // Deduplicate by user_id AND display_name
    var seenId = {};
    var seenName = {};
    var unique = [];
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      var nameLower = (row.display_name || '').toLowerCase().trim();
      if (!seenId[row.user_id] && !seenName[nameLower]) {
        seenId[row.user_id] = true;
        seenName[nameLower] = true;
        unique.push(row);
      }
    }
    return unique.slice(0, 50);
  } catch(e) { return []; }
}


// ─── LEADERBOARD UI ───────────────────────────────────────────
async function openLeaderboard() {
  var panel = document.getElementById('leaderboard-panel');
  var list  = document.getElementById('leaderboard-list');
  panel.classList.add('open');
  list.innerHTML = '<div style="text-align:center;color:var(--text3);padding:20px;font-size:13px;">Loading...</div>';

  var data = await loadLeaderboard();

  if (!data.length) {
    list.innerHTML = '<div style="text-align:center;color:var(--text3);padding:20px;font-size:13px;">No entries yet. Be the first!</div>';
    return;
  }

  var medals = ['🥇','🥈','🥉'];
  var html = '';
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var pos  = i + 1;
    var med  = medals[i] || '<span style="font-family:JetBrains Mono,monospace;color:var(--text3);font-size:12px;">' + String(pos).padStart(2,'0') + '</span>';
    var isMe = row.user_id === userId;
    html += '<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:8px;background:' +
      (isMe ? 'rgba(63,185,80,.08)' : 'var(--bg2)') +
      ';border:1px solid ' + (isMe ? 'var(--accent)' : 'var(--border)') + ';">' +
      '<div style="font-size:18px;flex-shrink:0;">' + med + '</div>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:13px;font-weight:500;color:var(--text0);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' +
          row.rank_icon + ' ' + row.display_name + (isMe ? ' <span style="color:var(--accent);font-size:10px;font-family:JetBrains Mono,monospace">(you)</span>' : '') +
        '</div>' +
        '<div style="font-size:11px;color:var(--text3);font-family:JetBrains Mono,monospace;margin-top:2px;">' +
          row.rank_name + ' · ' + row.phases_completed + ' phases · ' + row.challenges_solved + ' challenges' +
        '</div>' +
      '</div>' +
      '<div style="text-align:right;flex-shrink:0;">' +
        '<div style="font-size:14px;font-weight:700;color:var(--accent);font-family:JetBrains Mono,monospace;">' + row.phases_completed + '</div>' +
        '<div style="font-size:10px;color:var(--text3);">phases</div>' +
      '</div>' +
    '</div>';
  }
  list.innerHTML = html;
}

function closeLeaderboard(e) {
  if (e && e.target !== document.getElementById('leaderboard-panel')) return;
  document.getElementById('leaderboard-panel').classList.remove('open');
}

// ─── LOGOUT / RESET ───────────────────────────────────────────
async function doLogout() {
  await saveProgress();
  if (sb) await sb.auth.signOut();
  userName = ''; userEmail = ''; userId = ''; userUsername = '';
  current = 0; completed.clear();
  challengeState.forEach(function(cs) { cs.solved.fill(false); cs.attempts.fill(0); cs.hintsUsed.fill(false); cs.answersUsed.fill(false); });
  try { localStorage.removeItem('gc_progress'); localStorage.removeItem('gc_progress_uid'); } catch(e) {}
  closeProfile();
  document.getElementById('auth-overlay').style.display = 'flex';
  switchTab('login');
}

async function doReset() {
  if (!confirm('Reset ALL your progress? This cannot be undone.')) return;
  current = 0; completed.clear();
  challengeState.forEach(function(cs) { cs.solved.fill(false); cs.attempts.fill(0); cs.hintsUsed.fill(false); cs.answersUsed.fill(false); });
  await saveProgress();
  closeProfile();
  renderPhase();
}

// ─── PROFILE PANEL ────────────────────────────────────────────
async function openProfile() {
  var panel = document.getElementById('profile-panel');
  var pc = completed.size;
  var tc = 0;
  var th = 0;
  for (var i = 0; i < challengeState.length; i++) {
    for (var j = 0; j < challengeState[i].solved.length; j++) {
      if (challengeState[i].solved[j]) tc++;
    }
    for (var j = 0; j < challengeState[i].hintsUsed.length; j++) {
      if (challengeState[i].hintsUsed[j]) th++;
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


// ─── PWA INSTALL ──────────────────────────────────────────────
var _pwaPrompt = null;

window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  _pwaPrompt = e;
  var banner = document.getElementById('pwa-banner');
  if (banner && localStorage.getItem('gc_pwa_dismissed') !== '1') {
    setTimeout(function() { banner.classList.add('show'); }, 3000);
  }
});

function installPWA() {
  if (!_pwaPrompt) return;
  _pwaPrompt.prompt();
  _pwaPrompt.userChoice.then(function(result) {
    if (result.outcome === 'accepted') {
      dismissPWA();
    }
    _pwaPrompt = null;
  });
}

function dismissPWA() {
  var banner = document.getElementById('pwa-banner');
  if (banner) banner.classList.remove('show');
  localStorage.setItem('gc_pwa_dismissed', '1');
}

window.addEventListener('appinstalled', function() {
  dismissPWA();
});

// ─── KEYBOARD ─────────────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter') return;
  var overlay = document.getElementById('auth-overlay');
  if (!overlay || overlay.style.display === 'none') return;
  if (currentTab === 'login') doLogin();
  else if (currentTab === 'register') doRegister();
  else if (currentTab === 'magic') doMagicLink();
  else if (currentTab === 'forgot') doForgotPassword();
});

// ─── STARTUP ──────────────────────────────────────────────────
(async function init() {
  if (!sb) {
    document.getElementById('auth-overlay').style.display = 'flex';
    return;
  }
  sb.auth.onAuthStateChange(async function(event, session) {
    if (event === 'PASSWORD_RECOVERY') {
      showPasswordResetForm();
      return;
    }
    if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') && session) {
      await handleSession(session);
    }
    if (event === 'SIGNED_OUT') {
      userId = null;
      userName = '';
      document.getElementById('auth-overlay').style.display = 'flex';
    }
  });
  var result = await sb.auth.getSession();
  if (result.data && result.data.session) {
    await handleSession(result.data.session);
  } else {
    document.getElementById('auth-overlay').style.display = 'flex';
    setTimeout(function() { var inp = document.getElementById('login-email'); if (inp) inp.focus(); }, 200);
  }
})();