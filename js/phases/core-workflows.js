// GitCoven — Core Workflow — Phases 5-7
// This file contains phases 5-7

phases.push(
{
  title:"Branching",sub:"Parallel development and the HEAD pointer",
  sections:[
    {label:"What is a branch, really?",cards:[
      {title:"A branch is just a pointer",body:"Internally, a branch is a file containing a 40-character commit hash. When you commit, the branch pointer moves forward automatically. Creating branches is instant and nearly free."},
      {title:"HEAD — you are here",body:"<code>HEAD</code> is a pointer to the branch you're currently on. When you switch branches, HEAD moves. In 'detached HEAD' state, HEAD points directly to a commit instead of a branch."}
    ]},
    {label:"Branch diagram",content:`<div class="diagram"><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text1);line-height:2.2">
<div><span style="color:var(--accent-blue)">A</span> ─── <span style="color:var(--accent-blue)">B</span> ─── <span style="color:var(--accent-blue)">C</span>  ← <span style="color:var(--accent-orange)">main</span></div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── <span style="color:var(--accent-purple)">D</span> ─── <span style="color:var(--accent-purple)">E</span>  ← <span style="color:var(--accent-purple)">feature-login</span>  ← <span style="color:var(--accent)">HEAD</span></div>
</div></div>`},
    {label:"Branch commands",codeblock:{lang:"bash",code:`<span class="hl">git branch</span>               <span class="cmt"># list branches</span>
<span class="hl">git branch</span> -a            <span class="cmt"># list including remotes</span>
<span class="hl">git branch</span> feature-x     <span class="cmt"># create (don't switch)</span>
<span class="hl">git switch</span> feature-x     <span class="cmt"># switch to branch</span>
<span class="hl">git switch</span> -c feature-x  <span class="cmt"># create AND switch</span>
<span class="hl">git branch</span> -d feature-x  <span class="cmt"># delete (if merged)</span>
<span class="hl">git branch</span> -D feature-x  <span class="cmt"># force delete</span>
<span class="hl">git branch</span> -v            <span class="cmt"># show commit each branch points to</span>`}},
    {label:"Best practices",cards:[
      {title:"Never commit directly to main",body:"main must always be stable and deployable. All work happens on feature branches. Many teams enforce this with branch protection rules that block direct pushes."},
      {title:"Branch naming",body:"<code>feature/user-auth</code> &nbsp; <code>fix/login-bug</code> &nbsp; <code>hotfix/crash</code> &nbsp; <code>chore/deps</code>"},
      {title:"Keep branches short-lived",body:"A branch that lives for weeks accumulates merge conflicts. Aim to merge feature branches within 1-3 days. If a feature is large, break it into smaller incremental branches that can each be merged independently."}
    ]},
    {label:"Detached HEAD state",content:`<div class="danger"><div class="callout-icon">⚠️</div><div>If you checkout a specific commit hash (not a branch name), HEAD points directly to that commit — this is <strong>detached HEAD</strong>. Commits you make here aren't on any branch and will be garbage-collected unless you create a branch from them with <code>git switch -c branch-name</code>. You'll see a warning when entering this state.</div></div>`}
  ],
  challenges:[
    {q:"Type the single command to create a new branch called 'feature-nav' AND switch to it immediately.",scenario:"You're starting work on a new navigation feature. You want to do it all in one command.",hint:"The modern command uses 'git switch' with a flag to create. Or the older 'git checkout' has a similar flag.",answer:"Answer: git switch -c feature-nav (or the older git checkout -b feature-nav). The -c flag means \'create\'. This creates the branch from your current position and moves HEAD to it in one step.",accept:["git switch -c feature-nav","git checkout -b feature-nav"],feedback:"git switch -c is the modern way. The older git checkout -b still works. Both create the branch from your current position and switch HEAD to it immediately."},
    {q:"You are on 'feature-nav'. Type the command to switch back to 'main'.",scenario:"You're done working on the feature branch and need to return to the main branch.",hint:"You need to move HEAD to point at main. The modern command for switching branches is 'git switch'.",answer:"Answer: git switch main (or git checkout main). This moves HEAD to point at the main branch and updates your working directory to match main\'s latest commit.",accept:["git switch main","git checkout main"],feedback:"git switch main moves HEAD to point to the main branch. Your working directory updates to match the state of main's latest commit."},
    {q:"What is the name of the special Git pointer that always tells you which branch (or commit) you are currently on?",scenario:"Your team lead asks: 'What pointer tracks your current location in the Git graph?'",hint:"It's a four-letter word written in ALL CAPS. It always shows your current position in the Git graph.",answer:"Answer: HEAD. It\'s a pointer to your current position in the Git graph. Normally HEAD points to a branch name, which in turn points to a commit. In \'detached HEAD\' state, it points directly to a commit hash.",accept:["head","HEAD","the HEAD pointer","the head pointer","HEAD pointer"],feedback:"HEAD is a pointer to your current position. Normally it points to a branch name (which points to a commit). In detached HEAD state, it points directly to a commit hash."},
    {q:"Type the command to list ALL branches including remote-tracking branches.",scenario:"You want to see both your local branches and all branches on the remote server.",hint:"It's 'git branch' with a flag. The flag is the first letter of 'all'.",answer:"Answer: git branch -a (or git branch --all). Without -a you only see local branches. With it, you also see remote-tracking branches like remotes/origin/main.",accept:["git branch -a","git branch --all"],feedback:"git branch -a shows local branches and remote-tracking branches (shown as remotes/origin/main etc.). Use git branch for local only."}
  ]
},
{
  title:"Merging & Conflict Resolution",sub:"Bringing branches back together",
  sections:[
    {label:"Types of merge",cards:[
      {title:"Fast-forward merge",body:"When the target branch hasn't moved since the feature branch was created, Git just moves the pointer forward. No new commit. History stays linear."},
      {title:"Three-way merge",body:"When both branches have diverged, Git finds the common ancestor, combines changes, and creates a new merge commit with two parent pointers."}
    ]},
    {label:"Merge diagram",content:`<div class="diagram"><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text1);line-height:2.2">
<div style="color:var(--accent-orange)">Fast-Forward:</div>
<div>main: A ─── B</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── C ─── D ← feature</div>
<div style="color:var(--text3)">After: main pointer moves to D. No merge commit.</div>
<div style="margin-top:10px;color:var(--accent-orange)">3-Way Merge:</div>
<div>main: A ─── B ─── C</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── D ─── E ← feature</div>
<div>After: A ─── B ─── C ─── <span style="color:var(--accent-teal)">M</span> ← main</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── D ─── E ─┘</div>
</div></div>`},
    {label:"Merge commands",codeblock:{lang:"bash",code:`<span class="hl">git switch</span> main
<span class="hl">git merge</span> feature-login      <span class="cmt"># merge into current branch</span>
<span class="hl">git merge</span> --no-ff feature-x  <span class="cmt"># force merge commit</span>
<span class="hl">git merge</span> --squash feature-x <span class="cmt"># squash into one commit</span>
<span class="hl">git merge</span> --abort            <span class="cmt"># bail out</span>`}},
    {label:"Resolving conflicts",codeblock:{lang:"text",code:`<span class="cmt"># Git inserts markers into conflicted files:</span>
<span class="hl">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</span>
<span class="str">Your current branch's version</span>
<span class="hl">=======</span>
<span class="hl2">The incoming branch's version</span>
<span class="hl">&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature-login</span>

<span class="cmt"># Edit the file, remove ALL markers, keep what you want</span>
<span class="cmt"># Then:</span>
<span class="hl">git add</span> conflicted-file.js
<span class="hl">git commit</span>   <span class="cmt"># Git pre-fills the merge message</span>`}},
    {label:"Conflict resolution tips",cards:[
      {title:"Use a visual merge tool",body:"VS Code highlights conflicts with colour-coded blocks and one-click Accept buttons. You can also configure <code>git mergetool</code> to use tools like VS Code, Meld, or KDiff3 for a side-by-side view."},
      {title:"Common mistakes",body:"Leaving conflict markers (<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>) in the file is a classic blunder — your code won't compile. Always search the file for these markers after resolving. Some teams add a pre-commit hook that blocks commits containing conflict markers."}
    ]}
  ],
  challenges:[
    {q:"You are on 'main'. Type the command to merge a branch called 'feature-payment' into main.",scenario:"The feature is complete and approved. You need to bring it into main.",hint:"You're already on main. The command is 'git merge' followed by the branch name you want to bring in.",answer:"Answer: git merge feature-payment — You always merge INTO your current branch. Since you\'re already on main, this brings feature-payment\'s changes into main. The source branch isn\'t deleted automatically.",accept:["git merge feature-payment"],feedback:"You always merge INTO your current branch. So switch to the target branch first, then run git merge <source-branch>. The source branch is not deleted automatically — you must delete it separately."},
    {q:"A merge has gone badly wrong mid-way through. Type the command to cancel it and return to the state before you started the merge.",scenario:"You started merging but the conflicts are too complex and you want to start fresh.",hint:"Git merge has a flag that aborts the in-progress operation. Think 'git merge --______'.",answer:"Answer: git merge --abort — This cancels the in-progress merge and restores everything to the state before you ran git merge. Only works while a merge is in progress (i.e. there are unresolved conflicts).",accept:["git merge --abort"],feedback:"git merge --abort cancels the in-progress merge and restores your working directory to the state it was in before you ran git merge. It only works while a merge is in progress."},
    {q:"After manually resolving a conflict in 'app.js', what are the two commands you run to complete the merge? Separate them with a semicolon.",scenario:"You've edited the conflict markers out of app.js. What do you do next to finish the merge?",hint:"First stage the resolved file with 'git add', then finalise with 'git commit'. Separate with a semicolon.",answer:"Answer: git add app.js; git commit — First stage the resolved file to mark the conflict as resolved, then commit to finalise the merge. Git pre-fills the commit message with merge information.",accept:["git add app.js; git commit","git add app.js;git commit","git add app.js ; git commit","git add .; git commit"],feedback:"First git add to mark the conflict as resolved (staging the fixed file), then git commit to finalise the merge. Git pre-fills the commit message with merge information."}
  ]
},
{
  title:"Remote Repositories",sub:"GitHub, push, pull, clone, fetch",
  sections:[
    {label:"Local vs remote",content:`<div class="diagram"><div class="diagram-flex">
<div class="d-node orange"><div class="d-label">Your machine</div><div class="d-name">Local repo</div></div>
<div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:0 12px"><div style="font-size:10px;color:var(--accent-blue);font-family:'JetBrains Mono',monospace">git push</div><div style="color:var(--text3);font-size:20px">⇄</div><div style="font-size:10px;color:var(--accent-purple);font-family:'JetBrains Mono',monospace">git pull</div></div>
<div class="d-node accent"><div class="d-label">GitHub / GitLab</div><div class="d-name">Remote repo</div><div class="d-cmd">origin</div></div>
</div></div>`,cards:[
      {title:"origin",body:"The default remote name. Just an alias for the remote URL. Created automatically when you clone."},
      {title:"Remote-tracking branches",body:"After fetch, Git creates local read-only refs like <code>origin/main</code> showing where remote branches are."}
    ]},
    {label:"Remote commands",codeblock:{lang:"bash",code:`<span class="hl">git remote add</span> origin URL        <span class="cmt"># connect a remote</span>
<span class="hl">git remote</span> -v                     <span class="cmt"># list remotes</span>
<span class="hl">git clone</span> URL                     <span class="cmt"># download + setup</span>
<span class="hl">git push</span> -u origin main           <span class="cmt"># first push + set upstream</span>
<span class="hl">git push</span>                          <span class="cmt"># subsequent pushes</span>
<span class="hl">git fetch</span>                         <span class="cmt"># download, don't merge</span>
<span class="hl">git pull</span>                          <span class="cmt"># fetch + merge</span>
<span class="hl">git pull</span> --rebase                 <span class="cmt"># fetch + rebase (cleaner)</span>`}},
    {label:"fetch vs pull",cards:[
      {title:"git fetch — look before you leap",body:"Downloads remote changes but does NOT change your working directory or current branch. Safe. Inspect first, integrate when ready."},
      {title:"git pull — fetch + merge",body:"Downloads and immediately merges. Convenient but can create unexpected merge commits. Use <code>git pull --rebase</code> for linear history."},
      {title:"Pro tip: always fetch first",body:"In professional workflows, most developers prefer <code>git fetch</code> followed by inspecting changes with <code>git log origin/main..main</code> before merging. This avoids surprises. Blindly pulling can introduce merge conflicts at the worst possible time."}
    ]},
    {label:"SSH vs HTTPS",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>HTTPS remotes</strong> prompt for a username/password (or PAT) on every push. <strong>SSH remotes</strong> use a key pair — once configured, authentication is silent and automatic. Most professionals use SSH for daily work. GitHub removed password auth in 2021, so HTTPS now requires a Personal Access Token.</div></div>`}
  ],
  challenges:[
    {q:"Type the command to add a remote named 'origin' pointing to 'https://github.com/user/repo.git'.",scenario:"You have a local repo and just created an empty repo on GitHub. Connect them.",hint:"The command pattern is: git remote add <name> <url>. Fill in the name and URL from the question.",answer:"Answer: git remote add origin https://github.com/user/repo.git — This creates an alias called \'origin\' for the full URL. After this, you can push/pull using just the name \'origin\'.",accept:["git remote add origin https://github.com/user/repo.git"],feedback:"git remote add creates an alias (origin) for the remote URL. After this, you can push/pull without typing the full URL every time."},
    {q:"Type the full command to push your 'main' branch to origin for the very first time AND set it as the default upstream.",scenario:"First push ever. You want future 'git push' commands to know where to go without specifying explicitly.",hint:"You need 'git push' with a flag that sets the upstream tracking. The flag is -u.",answer:"Answer: git push -u origin main — The -u flag (short for --set-upstream) creates a tracking link between local main and origin/main. After this first push, plain git push works without arguments.",accept:["git push -u origin main","git push --set-upstream origin main","git push --set-upstream-to origin main"],feedback:"The -u flag (short for --set-upstream) creates a tracking relationship between your local main and origin/main. After this, just git push or git pull works without arguments."},
    {q:"What is the difference between git fetch and git pull? Answer in one sentence.",scenario:"A teammate asks you to explain the difference clearly.",hint:"One downloads only. The other downloads AND does something extra. What extra step does pull add?",answer:"Answer: Fetch downloads without merging, pull downloads and merges. git fetch updates your remote-tracking branches (origin/main etc.) but leaves your local branches untouched. git pull = git fetch + git merge.",accept:["fetch downloads without merging, pull downloads and merges","fetch downloads changes without merging them, pull fetches and merges","fetch gets changes without merging, pull fetches and merges automatically","fetch downloads remote changes but does not merge, pull fetches and then merges","git fetch downloads without merging git pull fetches and merges","fetch only downloads, pull downloads and merges","fetch downloads but doesnt merge, pull does both","fetch is download only, pull is download plus merge","fetch just downloads, pull downloads and merges","pull is fetch plus merge","git pull is git fetch plus git merge","fetch downloads changes, pull downloads and merges them","fetch downloads without integrating, pull downloads and integrates"],keywords:["fetch","download|get","without|not|doesn","merg","pull"],feedback:"Correct. git fetch is the safe operation — it updates your remote-tracking branches (origin/main) but leaves your local branches untouched. git pull = git fetch + git merge (or rebase with --rebase)."}
  ]
}
);