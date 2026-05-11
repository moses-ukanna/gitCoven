// GitCoven — Final Exam System
// Timed exam covering all 28 phases — no easy questions
// 33 seconds per question, guaranteed coverage of every phase

// ─── EXAM QUESTION POOL ──────────────────────────────────────
// 84 questions (3 per phase) — all medium/hard
// 30 are selected per exam with guaranteed phase coverage
const EXAM_POOL = [
  // === Phase 1: What is Version Control? ===
  {q:"What type of VCS gives every developer a complete copy of the entire repo history locally?",phase:1,accept:["distributed","distributed vcs","distributed version control","distributed version control system"]},
  {q:"Name the hidden directory that stores Git's entire object database inside a repository.",phase:1,accept:[".git",".git/"]},
  {q:"In 2005, who created Git and why was it built?",phase:1,accept:["linus torvalds","linus torvalds after a dispute with bitkeeper","linus torvalds because bitkeeper revoked access","linus"]},

  // === Phase 2: Installation & Configuration ===
  {q:"Type the command to set your global Git email to 'dev@company.com'.",phase:2,accept:["git config --global user.email \"dev@company.com\"","git config --global user.email 'dev@company.com'","git config --global user.email dev@company.com"]},
  {q:"What config scope overrides --global and applies to only the current repository?",phase:2,accept:["--local","local"]},
  {q:"Type the command to see all Git config settings and which file each comes from.",phase:2,accept:["git config --list --show-origin"]},

  // === Phase 3: The Three Git Areas ===
  {q:"Type the command to unstage 'secrets.env' without losing your changes.",phase:3,accept:["git restore --staged secrets.env"]},
  {q:"What flag on git add lets you interactively stage specific chunks within a file?",phase:3,accept:["-p","--patch"]},
  {q:"Name the three Git areas in order (comma-separated).",phase:3,accept:["working directory, staging area, repository","working directory, staging area, repo","working directory, index, repository","working dir, staging area, repository"]},

  // === Phase 4: Basic Workflow ===
  {q:"Type the command to commit staged changes with message 'Refactor auth module'.",phase:4,accept:["git commit -m \"refactor auth module\"","git commit -m 'refactor auth module'"]},
  {q:"Type the command to see what changes are staged for the next commit (diff of staged files).",phase:4,accept:["git diff --staged","git diff --cached"]},
  {q:"What does 'git commit -am' do differently from 'git commit -m'?",phase:4,accept:["stages all tracked files and commits","stages tracked files and commits in one step","adds tracked files to staging and commits","it stages all modified tracked files before committing"]},

  // === Phase 5: Branching ===
  {q:"Type the command to create branch 'feature-search' and switch to it in one step.",phase:5,accept:["git switch -c feature-search","git checkout -b feature-search"]},
  {q:"Type the command to list all branches including remote-tracking branches.",phase:5,accept:["git branch -a","git branch --all"]},
  {q:"What happens when HEAD points directly to a commit hash instead of a branch name?",phase:5,accept:["detached head state","detached head","you are in detached head state","detached HEAD state","detached HEAD"]},

  // === Phase 6: Merging & Conflict Resolution ===
  {q:"You are on main. Type the command to merge 'feature-checkout' into main.",phase:6,accept:["git merge feature-checkout"]},
  {q:"After resolving a conflict in style.css, type the two commands to complete the merge (semicolon-separated).",phase:6,accept:["git add style.css; git commit","git add style.css;git commit","git add .; git commit"]},
  {q:"What merge flag forces a merge commit even when a fast-forward is possible?",phase:6,accept:["--no-ff","--no-ff flag"]},

  // === Phase 7: Remote Repositories ===
  {q:"Type the command to push main to origin for the first time with upstream tracking.",phase:7,accept:["git push -u origin main","git push --set-upstream origin main"]},
  {q:"What is the difference between git fetch and git pull? One sentence.",phase:7,accept:["fetch downloads without merging, pull downloads and merges","fetch only downloads, pull downloads and merges","fetch downloads but doesnt merge, pull does both","pull is fetch plus merge","git pull is git fetch plus git merge","fetch just downloads, pull downloads and merges","fetch downloads changes, pull downloads and merges them"]},
  {q:"Type the command to add a remote called 'origin' pointing to 'git@github.com:user/app.git'.",phase:7,accept:["git remote add origin git@github.com:user/app.git"]},

  // === Phase 8: Undoing Changes ===
  {q:"A bad commit was pushed to shared main. Type the safest undo command.",phase:8,accept:["git revert head","git revert HEAD"]},
  {q:"Type the command to undo the last commit but keep changes staged.",phase:8,accept:["git reset --soft head~1","git reset --soft HEAD~1"]},
  {q:"What is the first command you run when you think you've lost commits after a bad reset?",phase:8,accept:["git reflog"]},

  // === Phase 9: Stashing ===
  {q:"Type the command to stash work with label 'WIP: payment form'.",phase:9,accept:["git stash push -m \"WIP: payment form\"","git stash push -m 'WIP: payment form'"]},
  {q:"What is the difference between git stash pop and git stash apply?",phase:9,accept:["pop restores and removes the stash, apply restores and keeps it","pop removes the stash after applying, apply keeps it","pop deletes the stash, apply keeps it","pop restores and deletes, apply restores and keeps"]},
  {q:"Type the command to see the full diff of the most recent stash.",phase:9,accept:["git stash show -p","git stash show --patch"]},

  // === Phase 10: Rebasing ===
  {q:"You are on feature-x. Type the command to rebase onto main.",phase:10,accept:["git rebase main"]},
  {q:"Type the command to squash/edit the last 4 commits interactively.",phase:10,accept:["git rebase -i head~4","git rebase -i HEAD~4","git rebase --interactive HEAD~4"]},
  {q:"After resolving a rebase conflict and staging, what command continues the rebase?",phase:10,accept:["git rebase --continue"]},

  // === Phase 11: Advanced Commands ===
  {q:"Type the command to cherry-pick commit 'abc1234' onto your current branch.",phase:11,accept:["git cherry-pick abc1234"]},
  {q:"Type the three commands to start a bisect session, mark current as bad, and mark tag v1.0 as good (newline-separated).",phase:11,accept:["git bisect start\ngit bisect bad\ngit bisect good v1.0"]},
  {q:"Type the command to search all tracked files for the string 'console.log'.",phase:11,accept:["git grep \"console.log\"","git grep 'console.log'","git grep console.log"]},

  // === Phase 12: Tags & Releases ===
  {q:"Type the command to create an annotated tag 'v2.0.0' with message 'Stable release'.",phase:12,accept:["git tag -a v2.0.0 -m \"stable release\"","git tag -a v2.0.0 -m 'stable release'","git tag -a v2.0.0 -m \"Stable release\"","git tag -a v2.0.0 -m 'Stable release'"]},
  {q:"Type the command to push ALL tags to origin.",phase:12,accept:["git push origin --tags","git push --tags"]},
  {q:"What does Semantic Versioning's MAJOR.MINOR.PATCH mean? When does each increment?",phase:12,accept:["major for breaking changes, minor for new features, patch for bug fixes","major is breaking changes, minor is features, patch is fixes","breaking changes, new features, bug fixes"]},

  // === Phase 13: .gitignore ===
  {q:"Type the command to stop tracking 'config.env' without deleting it from disk.",phase:13,accept:["git rm --cached config.env"]},
  {q:"Write the .gitignore pattern to ignore all .log files anywhere in the project.",phase:13,accept:["*.log"]},
  {q:"In .gitignore, what prefix negates a pattern (un-ignores a file)?",phase:13,accept:["!","! prefix","the ! prefix","exclamation mark","!prefix"]},

  // === Phase 14: Git Workflows ===
  {q:"In GitHub Flow, what is the only long-lived branch?",phase:14,accept:["main","master"]},
  {q:"What Conventional Commits prefix is used for a new feature?",phase:14,accept:["feat","feat:"]},
  {q:"In Git Flow, what branch type do you create for an urgent production fix, and where do you branch it from?",phase:14,accept:["hotfix branch from main","hotfix from main","a hotfix branch from main","hotfix branched from main","create a hotfix branch from main"]},

  // === Phase 15: Collaboration & Code Review ===
  {q:"What remote name do you give to the ORIGINAL repo after forking?",phase:15,accept:["upstream"]},
  {q:"After fetching upstream, type the two commands to merge upstream/main into your local main (newline-separated).",phase:15,accept:["git switch main\ngit merge upstream/main","git checkout main\ngit merge upstream/main"]},
  {q:"What is the ideal size of a pull request in lines of code changed?",phase:15,accept:["200-400","200-400 lines","200 to 400","200-400 lines of code"]},

  // === Phase 16: Pro Tips ===
  {q:"Type the git config command to create a global alias 'undo' for 'reset --soft HEAD~1'.",phase:16,accept:["git config --global alias.undo \"reset --soft HEAD~1\"","git config --global alias.undo 'reset --soft HEAD~1'","git config --global alias.undo \"reset --soft head~1\"","git config --global alias.undo 'reset --soft head~1'"]},
  {q:"Type the command to preview which untracked files would be deleted (dry run).",phase:16,accept:["git clean -n","git clean --dry-run","git clean -n -d"]},
  {q:"What does git log -S 'functionName' do?",phase:16,accept:["finds commits where the string was added or removed","searches commit diffs for when the string was introduced or deleted","finds when a string was added or removed in history","pickaxe search for when string was added or removed"]},

  // === Phase 17: Git Internals ===
  {q:"Name the four Git object types (comma-separated).",phase:17,accept:["blob, tree, commit, tag","blob,tree,commit,tag","blob tree commit tag","commit, tree, blob, tag"]},
  {q:"Type the command to pretty-print the HEAD commit's internal data.",phase:17,accept:["git cat-file -p HEAD","git cat-file -p head"]},
  {q:"Type the command to resolve the branch name 'main' to its full SHA-1 hash.",phase:17,accept:["git rev-parse main"]},

  // === Phase 18: Git Hooks ===
  {q:"Where does Git store hook scripts on your local machine?",phase:18,accept:[".git/hooks",".git/hooks/"]},
  {q:"What exit code must a hook return to abort the guarded operation?",phase:18,accept:["1","non-zero","exit 1","any non-zero","non-zero exit code"]},
  {q:"Why can't you share hooks by committing .git/hooks, and what tool solves this?",phase:18,accept:["the .git directory is not tracked by git, husky solves this","git does not track the .git directory, husky",".git is not committed, use husky","husky, because .git is not tracked",".git/hooks is not tracked, husky solves this","because .git is not tracked, husky"]},

  // === Phase 19: CI/CD ===
  {q:"In GitHub Actions YAML, what key defines which events trigger the workflow?",phase:19,accept:["on","the on key"]},
  {q:"What directory stores GitHub Actions workflow files?",phase:19,accept:[".github/workflows",".github/workflows/"]},
  {q:"What file auto-assigns PR reviewers when specific files are changed?",phase:19,accept:["codeowners","CODEOWNERS",".github/CODEOWNERS"]},

  // === Phase 20: Git LFS ===
  {q:"Type the command to tell Git LFS to track all .mp4 files.",phase:20,accept:["git lfs track \"*.mp4\"","git lfs track '*.mp4'","git lfs track *.mp4"]},
  {q:"What file must you commit to share LFS tracking config with your team?",phase:20,accept:[".gitattributes"]},
  {q:"What environment variable skips LFS downloads during clone?",phase:20,accept:["GIT_LFS_SKIP_SMUDGE=1","git_lfs_skip_smudge=1","GIT_LFS_SKIP_SMUDGE"]},

  // === Phase 21: Monorepo ===
  {q:"What git clone flag creates a blobless partial clone (metadata only)?",phase:21,accept:["--filter=blob:none"]},
  {q:"Type the two commands to enable sparse checkout in cone mode and set it to 'apps/web' (newline-separated).",phase:21,accept:["git sparse-checkout init --cone\ngit sparse-checkout set apps/web"]},
  {q:"What is the key difference between git submodule and git subtree?",phase:21,accept:["submodule keeps repos separate with pointers, subtree merges content directly","submodule is a pointer to another repo, subtree merges it in","submodule uses references, subtree copies content","submodule points to external repos, subtree embeds them","submodule keeps repos independent, subtree merges them together"]},

  // === Phase 22: Git Security ===
  {q:"Type the git config command to auto-sign all commits globally.",phase:22,accept:["git config --global commit.gpgsign true"]},
  {q:"A secret API key was pushed publicly. What is the FIRST action?",phase:22,accept:["revoke the secret","revoke or rotate the secret","invalidate the secret","rotate the key","revoke the key"]},
  {q:"What git log flag shows GPG/SSH signature verification status?",phase:22,accept:["--show-signature"]},

  // === Phase 23: Advanced Log & Forensics ===
  {q:"What git log flag traces a file's history through renames?",phase:23,accept:["--follow"]},
  {q:"Type the git log flag and value to find commits where 'DROP TABLE' was added or removed.",phase:23,accept:["-S \"DROP TABLE\"","-S 'DROP TABLE'","git log -S \"DROP TABLE\"","git log -S 'DROP TABLE'"]},
  {q:"What config setting enables automatic reuse of recorded conflict resolutions?",phase:23,accept:["rerere.enabled true","rerere.enabled","git config --global rerere.enabled true","rerere.enabled=true"]},

  // === Phase 24: Repository Maintenance ===
  {q:"Type the command for aggressive garbage collection with immediate pruning.",phase:24,accept:["git gc --aggressive --prune=now","git gc --prune=now --aggressive"]},
  {q:"Type the command to verify Git database integrity.",phase:24,accept:["git fsck","git fsck --full"]},
  {q:"Type the command to bundle the entire repo into 'backup.bundle'.",phase:24,accept:["git bundle create backup.bundle --all"]},

  // === Phase 25: Enterprise Platforms ===
  {q:"Name the three merge strategies available on GitHub for PRs.",phase:25,accept:["merge commit, squash and merge, rebase and merge","merge, squash, rebase","merge squash rebase","squash and merge, merge commit, rebase and merge","merge commit squash and merge rebase and merge","create a merge commit, squash and merge, rebase and merge"]},
  {q:"What file auto-assigns PR reviewers based on file ownership?",phase:25,accept:["codeowners","CODEOWNERS",".github/CODEOWNERS"]},
  {q:"Type the git log format to output full hash, ISO date, email, and subject for an audit log.",phase:25,accept:["git log --format=\"%H %aI %ae %s\" --all","git log --format='%H %aI %ae %s' --all","git log --format=\"%H|%aI|%ae|%s\" --all","--format=\"%H %aI %ae %s\" --all"]},

  // === Phase 26: Connecting to GitHub ===
  {q:"Type the command to test your SSH connection to GitHub.",phase:26,accept:["ssh -T git@github.com","ssh -t git@github.com"]},
  {q:"Type the command to connect your local repo to a GitHub remote using SSH for user 'dev' and repo 'app'.",phase:26,accept:["git remote add origin git@github.com:dev/app.git","git remote add origin git@github.com:dev/app"]},
  {q:"Your push was rejected because the remote has newer commits. Type the fix.",phase:26,accept:["git pull --rebase","git pull --rebase origin main"]},

  // === Phase 27: GitLab & Multi-platform ===
  {q:"Type the command to test your SSH connection to GitLab.",phase:27,accept:["ssh -T git@gitlab.com","ssh -t git@gitlab.com"]},
  {q:"Type the command to switch remote 'origin' from HTTPS to SSH URL 'git@github.com:user/repo.git'.",phase:27,accept:["git remote set-url origin git@github.com:user/repo.git"]},
  {q:"Type the command to add a second push URL to 'origin' for mirroring to GitLab.",phase:27,accept:["git remote set-url --add --push origin git@gitlab.com:user/repo.git"]},

  // === Phase 28: GitHub CLI & Advanced Remote ===
  {q:"Type the safe force push command (not --force).",phase:28,accept:["git push --force-with-lease"]},
  {q:"Type the command to delete remote branch 'old-feature' on origin.",phase:28,accept:["git push origin --delete old-feature","git push origin :old-feature"]},
  {q:"Type the command to prune stale remote-tracking branches.",phase:28,accept:["git fetch --prune","git fetch -p","git remote prune origin"]},
];

// ─── EXAM CONFIG ──────────────────────────────────────────────
const EXAM_QUESTION_COUNT = 30;
const EXAM_SECONDS_PER_Q = 33;
const EXAM_TIME_SECONDS = EXAM_QUESTION_COUNT * EXAM_SECONDS_PER_Q; // 990s = 16m 30s
const GRADE_THRESHOLDS = [
  {min:95, grade:'Distinction', icon:'🏆', color:'#d4af37'},
  {min:85, grade:'Merit',       icon:'🥈', color:'#c0c0c0'},
  {min:70, grade:'Pass',        icon:'🎓', color:'#cd7f32'},
  {min:0,  grade:'Not Yet',     icon:'📚', color:'#8b949e'}
];

// ─── EXAM STATE ───────────────────────────────────────────────
let examActive = false;
let examQuestions = [];
let examAnswers = [];
let examCurrentQ = 0;
let examStartTime = null;
let examTimerInterval = null;
let examTimeRemaining = EXAM_TIME_SECONDS;
let examResults = null;

// ─── SHUFFLE ─────────────────────────────────────────────────
function shuffleArray(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

// ─── SELECT WITH GUARANTEED PHASE COVERAGE ───────────────────
function selectExamQuestions() {
  // Group questions by phase
  var byPhase = {};
  for (var i = 0; i < EXAM_POOL.length; i++) {
    var q = EXAM_POOL[i];
    if (!byPhase[q.phase]) byPhase[q.phase] = [];
    byPhase[q.phase].push(q);
  }

  // Pick 1 random question from each of the 28 phases
  var selected = [];
  var usedIndices = new Set();
  for (var p = 1; p <= 28; p++) {
    var phaseQs = byPhase[p];
    if (!phaseQs || !phaseQs.length) continue;
    var shuffled = shuffleArray(phaseQs);
    selected.push(shuffled[0]);
    usedIndices.add(EXAM_POOL.indexOf(shuffled[0]));
  }

  // Fill remaining slots (30 - 28 = 2) from unused questions
  var remaining = EXAM_POOL.filter(function(q, idx) { return !usedIndices.has(idx); });
  remaining = shuffleArray(remaining);
  var needed = EXAM_QUESTION_COUNT - selected.length;
  for (var i = 0; i < needed && i < remaining.length; i++) {
    selected.push(remaining[i]);
  }

  return shuffleArray(selected);
}

// ─── NORMALIZE ───────────────────────────────────────────────
function examNormalize(str) {
  return str.trim().toLowerCase().replace(/\s+/g,' ').replace(/[""]/g,'"').replace(/['']/g,"'");
}

// ─── START EXAM ──────────────────────────────────────────────
function startExam() {
  if (completed.size < phases.length) {
    alert('Complete all ' + phases.length + ' phases before taking the final exam.');
    return;
  }

  examQuestions = selectExamQuestions();
  examAnswers = new Array(examQuestions.length).fill('');
  examCurrentQ = 0;
  examStartTime = Date.now();
  examTimeRemaining = EXAM_TIME_SECONDS;
  examActive = true;
  examResults = null;

  renderExam();
  startExamTimer();
}

function startExamTimer() {
  clearInterval(examTimerInterval);
  examTimerInterval = setInterval(function() {
    examTimeRemaining--;
    updateTimerDisplay();
    if (examTimeRemaining <= 0) {
      clearInterval(examTimerInterval);
      finishExam();
    }
  }, 1000);
}

function updateTimerDisplay() {
  var el = document.getElementById('exam-timer');
  if (!el) return;
  var mins = Math.floor(examTimeRemaining / 60);
  var secs = examTimeRemaining % 60;
  el.textContent = String(mins).padStart(2,'0') + ':' + String(secs).padStart(2,'0');
  el.classList.remove('exam-timer-warn','exam-timer-critical');
  if (examTimeRemaining <= 120) el.classList.add('exam-timer-warn');
  if (examTimeRemaining <= 30) el.classList.add('exam-timer-critical');
}

// ─── RENDER EXAM ─────────────────────────────────────────────
function renderExam() {
  var ca = document.getElementById('content-area');
  var q = examQuestions[examCurrentQ];
  var answered = examAnswers.filter(function(a){return a.trim()!=='';}).length;

  var dots = '';
  for (var i = 0; i < examQuestions.length; i++) {
    var cls = 'exam-dot';
    if (i === examCurrentQ) cls += ' exam-dot-current';
    else if (examAnswers[i].trim()) cls += ' exam-dot-answered';
    dots += '<div class="' + cls + '" onclick="examGoTo(' + i + ')">' + (i+1) + '</div>';
  }

  ca.innerHTML =
    '<div class="exam-container">' +
      '<div class="exam-header">' +
        '<div class="exam-header-left">' +
          '<div class="exam-badge">📝 FINAL EXAM</div>' +
          '<div class="exam-progress-text">' + answered + ' of ' + examQuestions.length + ' answered</div>' +
        '</div>' +
        '<div class="exam-timer-wrap">' +
          '<div class="exam-timer-label">TIME REMAINING</div>' +
          '<div class="exam-timer" id="exam-timer">--:--</div>' +
        '</div>' +
      '</div>' +
      '<div class="exam-dots">' + dots + '</div>' +
      '<div class="exam-question-card">' +
        '<div class="exam-q-number">Question ' + (examCurrentQ+1) + ' of ' + examQuestions.length + '</div>' +
        '<div class="exam-q-phase">Phase ' + q.phase + '</div>' +
        '<div class="exam-q-text">' + q.q + '</div>' +
        '<div class="exam-input-row">' +
          '<input class="exam-input" id="exam-answer" type="text"' +
            ' value="' + examAnswers[examCurrentQ].replace(/"/g,'&quot;') + '"' +
            ' placeholder="Type your answer..."' +
            ' onkeydown="if(event.key===\'Enter\'){examSaveAndNext()}"' +
            ' autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />' +
        '</div>' +
      '</div>' +
      '<div class="exam-nav">' +
        (examCurrentQ > 0 ? '<button class="exam-nav-btn" onclick="examPrev()">← Previous</button>' : '<div></div>') +
        (examCurrentQ < examQuestions.length - 1 ?
          '<button class="exam-nav-btn exam-nav-next" onclick="examSaveAndNext()">Next →</button>' :
          '<button class="exam-nav-btn exam-nav-submit" onclick="examConfirmSubmit()">Submit Exam ✓</button>') +
      '</div>' +
    '</div>';

  updateTimerDisplay();
  setTimeout(function(){ var inp = document.getElementById('exam-answer'); if(inp) inp.focus(); }, 100);
}

// ─── NAVIGATION ──────────────────────────────────────────────
function examSaveCurrent() {
  var inp = document.getElementById('exam-answer');
  if (inp) examAnswers[examCurrentQ] = inp.value;
}

function examSaveAndNext() {
  examSaveCurrent();
  if (examCurrentQ < examQuestions.length - 1) {
    examCurrentQ++;
    renderExam();
  }
}

function examPrev() {
  examSaveCurrent();
  if (examCurrentQ > 0) {
    examCurrentQ--;
    renderExam();
  }
}

function examGoTo(idx) {
  examSaveCurrent();
  examCurrentQ = idx;
  renderExam();
}

function examConfirmSubmit() {
  examSaveCurrent();
  var unanswered = examAnswers.filter(function(a){return !a.trim();}).length;
  var msg = 'Submit your exam?';
  if (unanswered > 0) msg = unanswered + ' question' + (unanswered>1?'s':'') + ' unanswered. Submit anyway?';
  if (confirm(msg)) finishExam();
}

// ─── FINISH & GRADE ─────────────────────────────────────────
function finishExam() {
  clearInterval(examTimerInterval);
  examActive = false;

  var timeTaken = Math.round((Date.now() - examStartTime) / 1000);
  var correct = 0;
  var results = [];

  for (var i = 0; i < examQuestions.length; i++) {
    var q = examQuestions[i];
    var userAns = examNormalize(examAnswers[i]);
    var isCorrect = q.accept.some(function(a){ return examNormalize(a) === userAns; });
    if (isCorrect) correct++;
    results.push({q: q.q, phase: q.phase, userAnswer: examAnswers[i], correct: isCorrect, expected: q.accept[0]});
  }

  var pct = Math.round(correct / examQuestions.length * 100);
  var grade = GRADE_THRESHOLDS[GRADE_THRESHOLDS.length-1];
  for (var i = 0; i < GRADE_THRESHOLDS.length; i++) {
    if (pct >= GRADE_THRESHOLDS[i].min) { grade = GRADE_THRESHOLDS[i]; break; }
  }

  examResults = {correct:correct, total:examQuestions.length, pct:pct, grade:grade, timeTaken:timeTaken, results:results, date:new Date()};
  renderExamResults();
}

function renderExamResults() {
  var r = examResults;
  var mins = Math.floor(r.timeTaken / 60);
  var secs = r.timeTaken % 60;
  var passed = r.pct >= 70;

  var reviewHTML = '';
  for (var i = 0; i < r.results.length; i++) {
    var item = r.results[i];
    reviewHTML +=
      '<div class="exam-review-item ' + (item.correct ? 'exam-review-correct' : 'exam-review-wrong') + '">' +
        '<div class="exam-review-icon">' + (item.correct ? '✓' : '✗') + '</div>' +
        '<div class="exam-review-content">' +
          '<div class="exam-review-q">' + (i+1) + '. ' + item.q + ' <span style="color:var(--text3);font-size:11px">(Phase ' + item.phase + ')</span></div>' +
          (item.correct ?
            '<div class="exam-review-ans correct">Your answer: ' + item.userAnswer + '</div>' :
            '<div class="exam-review-ans wrong">Your answer: ' + (item.userAnswer || '<em>unanswered</em>') + '</div>' +
            '<div class="exam-review-ans expected">Correct: ' + item.expected + '</div>') +
        '</div>' +
      '</div>';
  }

  var ca = document.getElementById('content-area');
  ca.innerHTML =
    '<div class="exam-results">' +
      '<div class="exam-results-header">' +
        '<div class="exam-grade-icon" style="color:' + r.grade.color + '">' + r.grade.icon + '</div>' +
        '<div class="exam-grade-title" style="color:' + r.grade.color + '">' + r.grade.grade + '</div>' +
        '<div class="exam-grade-subtitle">' + (passed ? 'Congratulations, ' + (userName||'Apprentice') + '!' : 'Keep studying, ' + (userName||'Apprentice') + '. You need 70% to pass.') + '</div>' +
      '</div>' +
      '<div class="exam-stats-row">' +
        '<div class="exam-stat"><div class="exam-stat-num">' + r.correct + '/' + r.total + '</div><div class="exam-stat-label">Correct</div></div>' +
        '<div class="exam-stat"><div class="exam-stat-num">' + r.pct + '%</div><div class="exam-stat-label">Score</div></div>' +
        '<div class="exam-stat"><div class="exam-stat-num">' + mins + 'm ' + secs + 's</div><div class="exam-stat-label">Time</div></div>' +
      '</div>' +
      (passed ?
        '<div class="exam-cert-actions">' +
          '<button class="exam-cert-btn" onclick="generateExamCertificate()">📜 Download Certificate</button>' +
          '<button class="exam-retake-btn" onclick="startExam()">🔄 Retake Exam</button>' +
        '</div>' :
        '<div class="exam-cert-actions">' +
          '<div class="exam-fail-msg">You need 70% to pass. Review the phases you missed and try again.</div>' +
          '<button class="exam-retake-btn" onclick="startExam()">🔄 Retake Exam</button>' +
          '<button class="exam-retake-btn" onclick="goto(0)">📖 Review Phases</button>' +
        '</div>') +
      '<div class="exam-review-title">Detailed Results</div>' +
      '<div class="exam-review-list">' + reviewHTML + '</div>' +
    '</div>';
}

// ─── EXAM CERTIFICATE ────────────────────────────────────────
function generateExamCertificate() {
  if (!examResults || examResults.pct < 70) return;

  var r = examResults;
  var canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1100;
  var ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0d1117';
  ctx.fillRect(0, 0, 1600, 1100);

  ctx.strokeStyle = r.grade.color;
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, 1520, 1020);
  ctx.strokeStyle = '#21262d';
  ctx.lineWidth = 1;
  ctx.strokeRect(52, 52, 1496, 996);

  var corners = [[60,60],[1540,60],[60,1040],[1540,1040]];
  ctx.fillStyle = r.grade.color;
  for (var i = 0; i < corners.length; i++) {
    ctx.beginPath();
    ctx.arc(corners[i][0], corners[i][1], 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = r.grade.color;
  ctx.font = 'bold 14px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('FINAL EXAMINATION CERTIFICATE', 800, 120);

  ctx.font = '52px serif';
  ctx.fillText(r.grade.icon, 800, 195);

  ctx.fillStyle = '#e6edf3';
  ctx.font = 'bold 56px Georgia, serif';
  ctx.fillText('GitCoven', 800, 280);

  ctx.fillStyle = '#8b949e';
  ctx.font = '20px "Courier New", monospace';
  ctx.fillText('Final Exam — ' + r.grade.grade, 800, 320);

  ctx.strokeStyle = r.grade.color;
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(500, 360); ctx.lineTo(1100, 360); ctx.stroke();

  ctx.fillStyle = '#8b949e';
  ctx.font = '18px Georgia, serif';
  ctx.fillText('This certifies that', 800, 420);

  ctx.fillStyle = r.grade.color;
  ctx.font = 'bold 52px Georgia, serif';
  ctx.fillText(userName || 'Apprentice', 800, 490);

  var nameWidth = ctx.measureText(userName || 'Apprentice').width;
  ctx.strokeStyle = '#30363d'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(800 - nameWidth/2 - 20, 505); ctx.lineTo(800 + nameWidth/2 + 20, 505); ctx.stroke();

  ctx.fillStyle = '#c9d1d9';
  ctx.font = '22px Georgia, serif';
  ctx.fillText('has passed the GitCoven Final Examination with ' + r.grade.grade, 800, 570);
  ctx.fillText('demonstrating comprehensive Git proficiency across all 28 phases.', 800, 605);

  ctx.fillStyle = r.grade.color;
  ctx.font = 'bold 36px "Courier New", monospace';
  ctx.fillText(r.pct + '%', 450, 700);
  ctx.fillText(r.correct + '/' + r.total, 800, 700);
  var mins = Math.floor(r.timeTaken / 60);
  ctx.fillText(mins + 'm ' + (r.timeTaken % 60) + 's', 1150, 700);

  ctx.fillStyle = '#484f58';
  ctx.font = '14px "Courier New", monospace';
  ctx.fillText('SCORE', 450, 725);
  ctx.fillText('CORRECT', 800, 725);
  ctx.fillText('TIME', 1150, 725);

  ctx.fillStyle = r.grade.color;
  ctx.font = 'bold 20px "Courier New", monospace';
  ctx.fillText('Grade: ' + r.grade.grade.toUpperCase(), 800, 790);

  ctx.fillStyle = '#8b949e';
  ctx.font = '16px Georgia, serif';
  var today = r.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  ctx.fillText('Issued on ' + today, 800, 840);

  ctx.strokeStyle = '#21262d';
  ctx.beginPath(); ctx.moveTo(400, 880); ctx.lineTo(1200, 880); ctx.stroke();

  ctx.fillStyle = r.grade.color;
  ctx.font = 'italic 24px Georgia, serif';
  ctx.fillText('WiredHash', 550, 940);
  ctx.fillText('GitCoven', 1050, 940);

  ctx.fillStyle = '#484f58';
  ctx.font = '13px "Courier New", monospace';
  ctx.fillText('ORGANIZATION', 550, 965);
  ctx.fillText('PLATFORM', 1050, 965);

  ctx.fillStyle = '#30363d';
  ctx.font = '12px "Courier New", monospace';
  ctx.fillText('gitcoven.vercel.app · Exam ID: GCX-' + Date.now().toString(36).toUpperCase() + ' · ' + r.pct + '% ' + r.grade.grade, 800, 1020);

  var link = document.createElement('a');
  link.download = 'GitCoven-Exam-' + r.grade.grade + '-' + (userName || 'User').replace(/\s+/g, '-') + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function openExam() { startExam(); }