// GitCoven — State, Navigation & Nav Building

// ─── STATE ───────────────────────────────────────────────────
let current = 0;
const completed = new Set();
// challengeState[phaseIdx] = { solved: [false, false, ...], attempts: [0, 0, ...] }
const challengeState = phases.map(p => ({
  solved: new Array(p.challenges.length).fill(false),
  attempts: new Array(p.challenges.length).fill(0),
  hintsUsed: new Array(p.challenges.length).fill(false)
}));

function isPhaseUnlocked(idx) {
  if (idx === 0) return true;
  return completed.has(idx - 1);
}

function isPhaseChallengesComplete(idx) {
  return challengeState[idx].solved.every(Boolean);
}

// ─── ANSWER CHECKING ─────────────────────────────────────────
function normalize(str) {
  return str.trim().toLowerCase().replace(/\s+/g,' ').replace(/[""]/g,'"').replace(/['']/g,"'");
}

function checkAnswer(phaseIdx, qIdx, userInput) {
  const q = phases[phaseIdx].challenges[qIdx];
  const norm = normalize(userInput);
  return q.accept.some(a => normalize(a) === norm);
}

// ─── NAV ─────────────────────────────────────────────────────
function updateNavButtons() {
  const canNext = isPhaseChallengesComplete(current);
  const isLast = current === phases.length - 1;
  ['next-btn','next-btn2'].forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    if (canNext) {
      btn.classList.remove('btn-locked');
      btn.classList.add('btn-accent');
      btn.textContent = isLast ? '🎓 Finish' : 'Next phase →';
    } else {
      btn.classList.add('btn-locked');
      btn.classList.remove('btn-accent');
      btn.textContent = isLast ? 'Complete challenges' : 'Next phase →';
    }
  });
  const lockIcon = document.getElementById('lock-icon');
  if (lockIcon) lockIcon.textContent = canNext ? '🔓' : '🔒';
}

function navigate(dir) {
  if (dir > 0) {
    if (!isPhaseChallengesComplete(current)) return;
    if (current === phases.length - 1) { showComplete(); return; }
    completed.add(current);
    current++;
  } else {
    if (current > 0) current--;
  }
  saveProgress();
  renderPhase();
  window.scrollTo(0, 0);
}

function goto(idx) {
  if (!isPhaseUnlocked(idx) && idx !== current) return;
  current = idx;
  saveProgress();
  renderPhase();
  window.scrollTo(0, 0);
}

// ─── SIDEBAR ─────────────────────────────────────────────────
const groups = [
  {label:'Fundamentals',range:[0,3]},
  {label:'Core Workflow',range:[4,6]},
  {label:'Recovery & Undo',range:[7,8]},
  {label:'Advanced Techniques',range:[9,13]},
  {label:'Professional',range:[14,15]},
  {label:'Enterprise',range:[16,24]},
  {label:'Platforms & Remotes',range:[25,27]}
];

function buildNav() {
  const navEl = document.getElementById('sidebar-nav');
  navEl.innerHTML = '';
  phases.forEach((p, i) => {
    const grp = groups.find(g => i === g.range[0]);
    if (grp) {
      const lbl = document.createElement('div');
      lbl.className = 'nav-section-label';
      lbl.textContent = grp.label;
      navEl.appendChild(lbl);
    }
    const locked = !isPhaseUnlocked(i);
    const done = completed.has(i) && isPhaseChallengesComplete(i);
    const item = document.createElement('div');
    item.className = `nav-item ${i === current ? 'active' : ''} ${done && i !== current ? 'done' : ''} ${locked ? 'locked-item' : ''}`;
    const numContent = done && i !== current ? '✓' : locked ? '🔒' : String(i+1).padStart(2,'0');
    item.innerHTML = `<div class="nav-num">${numContent}</div><div class="nav-text">${p.title}</div>`;
    item.onclick = () => {
      goto(i);
      if (window.innerWidth <= 768) toggleSidebar();
    };
    navEl.appendChild(item);
  });
  const done = phases.filter((_,i) => completed.has(i) && isPhaseChallengesComplete(i)).length;
  document.getElementById('prog-fill').style.width = (done/phases.length*100)+'%';
  document.getElementById('prog-text').textContent = `${done} / ${phases.length}`;
}

// ─── RENDER ───────────────────────────────────────────────────