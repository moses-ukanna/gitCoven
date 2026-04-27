// GitCoven — Render Engine & Challenge Submission

// ─── RENDER ───────────────────────────────────────────────────
function renderPhase() {
  const p = phases[current];
  document.getElementById('tb-phase').textContent = `PHASE ${String(current+1).padStart(2,'0')} OF ${phases.length}`;
  document.getElementById('tb-title').textContent = p.title;
  document.getElementById('phase-counter').textContent = `${current+1} / ${phases.length}`;
  document.getElementById('prev-btn').style.visibility = current === 0 ? 'hidden' : 'visible';
  document.getElementById('prev-btn2').style.visibility = current === 0 ? 'hidden' : 'visible';
  buildNav();
  updateNavButtons();

  const ca = document.getElementById('content-area');
  let html = `<div class="phase-eyebrow">Phase ${current+1} · ${p.title}</div>
    <h1 class="phase-heading">${p.title}</h1>
    <p class="phase-sub">${p.sub}</p>
    <div class="phase-divider"></div>`;

  // Sections
  p.sections.forEach(s => {
    html += `<div class="section"><div class="section-label">${s.label}</div>`;
    if (s.content) html += s.content;
    if (s.cards) {
      html += '<div class="cards">';
      s.cards.forEach(c => {
        html += `<div class="card"><div class="card-title">${c.title}</div><p>${c.body}</p></div>`;
      });
      html += '</div>';
    }
    if (s.codeblock) {
      const id = 'cb_' + Math.random().toString(36).slice(2,8);
      html += `<div class="codeblock-wrap">
        <div class="codeblock-label"><div class="dots"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div></div><span>${s.codeblock.lang||'bash'}</span></div>
        <button class="copy-btn" id="${id}" onclick="copyCode('${id}')">copy</button>
        <pre id="pre_${id}">${s.codeblock.code}</pre>
      </div>`;
    }
    html += '</div>';
  });

  // Challenges
  html += buildChallengeSection(current);
  html = personalizeLabs(html);
  ca.innerHTML = html;
}

function buildChallengeSection(phaseIdx) {
  const p = phases[phaseIdx];
  const cs = challengeState[phaseIdx];
  const allDone = cs.solved.every(Boolean);
  const solvedCount = cs.solved.filter(Boolean).length;

  let html = `<div class="challenge-section">
    <div class="challenge-header"><div class="challenge-icon">⚡</div><div class="challenge-title">Phase Challenge</div></div>
    <p class="challenge-subtitle">${userName ? userName + ", type" : "Type"} your answers carefully. Get them all right to unlock the next phase.</p>`;

  p.challenges.forEach((q, qi) => {
    const solved = cs.solved[qi];
    const attempts = cs.attempts[qi];
    const cardClass = solved ? 'solved' : '';
    html += `<div class="challenge-card ${cardClass}" id="ccard_${phaseIdx}_${qi}">
      <div class="challenge-q-header">
        <div class="cq-num">${qi+1}</div>
        <div class="cq-text">
          <div class="cq-question">${q.q}</div>
          ${q.scenario ? `<div class="cq-scenario">Scenario: ${q.scenario}</div>` : ''}
          ${attempts > 0 && !solved ? `<div class="attempts-badge ${attempts >= 3 ? 'warning' : ''}">✗ ${attempts} failed attempt${attempts>1?'s':''}</div>` : ''}
        </div>
      </div>
      <div class="challenge-input-row">
        <div class="challenge-input-wrap">
          <input class="challenge-input" id="cinput_${phaseIdx}_${qi}"
            type="text"
            placeholder="${solved ? '✓ Correct' : 'Type your answer here…'}"
            value="${solved ? q.accept[0] : ''}"
            ${solved ? 'disabled' : ''}
            onkeydown="if(event.key==='Enter')submitChallenge(${phaseIdx},${qi})"
            autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
        </div>
        ${solved ? `<button class="challenge-submit" disabled>✓</button>` :
          `<button class="challenge-submit" onclick="submitChallenge(${phaseIdx},${qi})">Submit →</button>`}
      </div>
      <div class="challenge-feedback" id="cfeedback_${phaseIdx}_${qi}">
        <span class="feedback-icon">${solved ? '✓' : '✗'}</span>
        <span>${solved ? q.feedback : ''}</span>
      </div>
    </div>`;
  });

  // Lock bar
  if (allDone) {
    html += `<div class="lock-bar unlocked" id="lockbar_${phaseIdx}">
      <div class="lock-bar-icon">🔓</div>
      <div class="lock-bar-text">
        <div class="lock-bar-title">Phase complete — next phase unlocked</div>
        <div class="lock-bar-sub">All ${p.challenges.length} challenges solved. Click 'Next phase' to continue.</div>
      </div>
    </div>`;
  } else {
    html += `<div class="lock-bar" id="lockbar_${phaseIdx}">
      <div class="lock-bar-icon">🔒</div>
      <div class="lock-bar-text">
        <div class="lock-bar-title">Next phase is locked</div>
        <div class="lock-bar-sub">Solve all ${p.challenges.length} challenges to unlock the next phase.</div>
        <div class="lock-progress-row">${p.challenges.map((_,i) => `<div class="lock-pip ${cs.solved[i]?'done-pip':''}" id="lpip_${phaseIdx}_${i}"></div>`).join('')}</div>
      </div>
    </div>`;
  }

  html += '</div>';
  return html;
}

// ─── CHALLENGE SUBMISSION ────────────────────────────────────
function submitChallenge(phaseIdx, qIdx) {
  const cs = challengeState[phaseIdx];
  if (cs.solved[qIdx]) return;
  const input = document.getElementById(`cinput_${phaseIdx}_${qIdx}`);
  if (!input) return;
  const userVal = input.value;
  if (!userVal.trim()) return;

  cs.attempts[qIdx]++;
  const correct = checkAnswer(phaseIdx, qIdx, userVal);
  const card = document.getElementById(`ccard_${phaseIdx}_${qIdx}`);
  const feedback = document.getElementById(`cfeedback_${phaseIdx}_${qIdx}`);

  if (correct) {
    cs.solved[qIdx] = true;
    card.classList.remove('failed');
    card.classList.add('solved');
    input.disabled = true;
    input.value = phases[phaseIdx].challenges[qIdx].accept[0];
    feedback.innerHTML = `<span class="feedback-icon">✓</span><span>${phases[phaseIdx].challenges[qIdx].feedback}</span>`;
    feedback.style.display = 'flex';

    // Update pip
    const pip = document.getElementById(`lpip_${phaseIdx}_${qIdx}`);
    if (pip) pip.classList.add('done-pip');

    // Check if all done
    if (cs.solved.every(Boolean)) {
      // Replace lock bar
      const lockbar = document.getElementById(`lockbar_${phaseIdx}`);
      if (lockbar) {
        lockbar.className = 'lock-bar unlocked';
        lockbar.innerHTML = `<div class="lock-bar-icon">🔓</div><div class="lock-bar-text"><div class="lock-bar-title">Phase complete — next phase unlocked!</div><div class="lock-bar-sub">All ${phases[phaseIdx].challenges.length} challenges solved. Click 'Next phase' to continue.</div></div>`;
        lockbar.scrollIntoView({behavior:'smooth',block:'nearest'});
      }
      saveProgress();
      updateNavButtons();
      buildNav();
    }
  } else {
    card.classList.remove('failed');
    void card.offsetWidth; // force reflow for re-trigger animation
    card.classList.add('failed');
    feedback.innerHTML = `<span class="feedback-icon">✗</span><span>That's not right. Think carefully and try again.</span>`;
    feedback.style.display = 'flex';
    input.focus();
    input.select();
    // Update attempts badge
    const attemptsEl = card.querySelector('.attempts-badge');
    if (attemptsEl) {
      attemptsEl.textContent = `✗ ${cs.attempts[qIdx]} failed attempt${cs.attempts[qIdx]>1?'s':''}`;
      if (cs.attempts[qIdx] >= 3) attemptsEl.classList.add('warning');
    } else {
      const qText = card.querySelector('.cq-text');
      const badge = document.createElement('div');
      badge.className = `attempts-badge ${cs.attempts[qIdx] >= 3 ? 'warning' : ''}`;
      badge.textContent = `✗ ${cs.attempts[qIdx]} failed attempt${cs.attempts[qIdx]>1?'s':''}`;
      qText.appendChild(badge);
    }
  }
}

// ─── COPY CODE ────────────────────────────────────────────────
function copyCode(id) {
  const pre = document.getElementById('pre_' + id);
  if (!pre) return;
  navigator.clipboard.writeText(pre.innerText).then(() => {
    const btn = document.getElementById(id);
    btn.textContent = 'copied!'; btn.classList.add('copied');
    setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('copied'); }, 2000);
  });
}

// ─── COMPLETE SCREEN ─────────────────────────────────────────
function showComplete() {
  completed.add(current);
  buildNav();
  document.getElementById('prog-fill').style.width = '100%';
  document.getElementById('prog-text').textContent = `${phases.length} / ${phases.length}`;
  const totalChallenges = phases.reduce((a,p) => a + p.challenges.length, 0);
  const totalLab = phases.reduce((a,p) => a + (p.lab ? p.lab.steps ? p.lab.steps.length : 0 : 0), 0);
  document.getElementById('content-area').innerHTML = `
    <div class="complete-screen">
      <div class="complete-icon">🎓</div>
      <div class="complete-title" id="complete-title">You did it, ${userName || 'Apprentice'}!</div>
      <p class="complete-sub">All 28 phases of GitCoven complete. Every challenge crushed. You walked in as a newbie and leave as an enterprise pro. Well done, ${userName || 'Apprentice'}.</p>
      <div class="stats-row">
        <div class="stat-box"><div class="stat-num">25</div><div class="stat-label">Phases completed</div></div>
        <div class="stat-box"><div class="stat-num">${totalChallenges}</div><div class="stat-label">Challenges crushed</div></div>
        <div class="stat-box"><div class="stat-num">0</div><div class="stat-label">Hints used</div></div>
      </div>
      <button class="btn btn-accent" style="margin-top:28px;padding:10px 28px;font-size:14px" onclick="goto(0)">Review from the beginning</button>
    </div>`;
  ['next-btn','next-btn2'].forEach(id => {
    const b = document.getElementById(id);
    if (b) { b.classList.remove('btn-locked'); b.classList.add('btn-accent'); b.textContent = '← Back'; b.onclick = () => navigate(-1); }
  });
}

// ─── SIDEBAR TOGGLE ───────────────────────────────────────────