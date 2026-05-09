// GitCoven — Core Workflow — Phases 5-7
// This file contains phases 5-7

phases.push(
{
  title:"Branching",sub:"Parallel development and the HEAD pointer",
  sections:[
    {label:"What is a branch?",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Branching is what makes Git powerful. A branch lets you diverge from the main codebase and work on something — a feature, a bug fix, an experiment — without affecting anyone else's work. When you're done, you merge the branch back. Every professional development team uses branches daily.</p>`,cards:[
      {title:"Internally, a branch is just a pointer",body:"A branch is nothing more than a small file containing a 40-character commit hash. When you make a new commit, the branch pointer automatically moves forward to point to it. Creating a branch is instant — Git doesn't copy files. It just creates a new pointer. This is why Git branching is so fast compared to older version control systems."},
      {title:"HEAD — your current position",body:"<code>HEAD</code> is a special pointer that tells Git which branch (or commit) you are currently on. When you switch branches, HEAD moves to point to the new branch. Think of HEAD as a 'you are here' pin on a map. Every command you run — commit, merge, rebase — operates relative to where HEAD is pointing."}
    ]},
    {label:"Visualising branches",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">In this diagram, <code>main</code> and <code>feature-login</code> are two branches that diverged after commit B. HEAD is on <code>feature-login</code>, meaning that's where you're currently working:</p>
<div class="diagram"><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text1);line-height:2.2">
<div><span style="color:var(--accent-blue)">A</span> ─── <span style="color:var(--accent-blue)">B</span> ─── <span style="color:var(--accent-blue)">C</span>  ← <span style="color:var(--accent-orange)">main</span></div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── <span style="color:var(--accent-purple)">D</span> ─── <span style="color:var(--accent-purple)">E</span>  ← <span style="color:var(--accent-purple)">feature-login</span>  ← <span style="color:var(--accent)">HEAD</span></div>
</div></div>
<p style="color:var(--text2);font-size:13px;margin-top:10px">Commits A and B are shared by both branches. Commit C only exists on main. Commits D and E only exist on feature-login. The branches are completely independent — changes on one don't affect the other until you merge.</p>`},
    {label:"Creating and switching branches",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">There are two modern commands for working with branches: <code>git branch</code> (create/list/delete) and <code>git switch</code> (move between branches). The older <code>git checkout</code> also works but <code>git switch</code> is clearer and recommended.</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># List all local branches (* marks the current one)</span>
<span class="hl">git branch</span>
<span class="cmt"># Output:   feature-login</span>
<span class="cmt">#         * main            ← you are here</span>

<span class="cmt"># List ALL branches including remote-tracking branches</span>
<span class="hl">git branch</span> -a
<span class="cmt"># Also shows: remotes/origin/main, remotes/origin/dev, etc.</span>

<span class="cmt"># Create a new branch (but stay on your current branch)</span>
<span class="hl">git branch</span> feature-nav

<span class="cmt"># Switch to an existing branch (moves HEAD)</span>
<span class="hl">git switch</span> feature-nav

<span class="cmt"># Create AND switch in one command (most common usage)</span>
<span class="hl">git switch</span> -c feature-nav
<span class="cmt"># The -c flag means "create". Older equivalent: git checkout -b</span>

<span class="cmt"># See which commit each branch points to</span>
<span class="hl">git branch</span> -v`}},
    {label:"Deleting branches",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">After a branch is merged, you should delete it to keep your branch list clean. Git gives you two delete options — a safe one and a forceful one:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Safe delete — only works if the branch has been merged</span>
<span class="hl">git branch</span> -d feature-nav
<span class="cmt"># Git refuses if unmerged work would be lost</span>

<span class="cmt"># Force delete — deletes even if unmerged (careful!)</span>
<span class="hl">git branch</span> -D feature-nav
<span class="cmt"># Use only when you're sure you don't need the work</span>`}},
    {label:"Branch naming conventions",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Professional teams use a consistent naming convention so anyone can tell what a branch is for at a glance. The most common pattern is <code>type/description</code>:</p>`,cards:[
      {title:"Standard prefixes",body:"<code>feature/user-auth</code> — new functionality<br><code>fix/login-crash</code> — bug fix<br><code>hotfix/security-patch</code> — urgent production fix<br><code>chore/update-deps</code> — maintenance tasks<br><code>docs/api-guide</code> — documentation changes<br><code>refactor/auth-module</code> — code restructuring"},
      {title:"Rules to follow",body:"Use lowercase, use hyphens not spaces, keep it short but descriptive. Never use your name as a branch name. In many teams, branch names include the ticket number: <code>feature/JIRA-1234-user-auth</code>. This links the branch to the task tracker automatically."}
    ]},
    {label:"Best practices",cards:[
      {title:"Never commit directly to main",body:"In professional teams, <code>main</code> must always be stable and deployable. All work happens on feature branches. Teams enforce this with <strong>branch protection rules</strong> on GitHub/GitLab that physically block direct pushes to main. Work goes through pull requests and code review instead."},
      {title:"Keep branches short-lived",body:"A branch that lives for weeks accumulates merge conflicts because main keeps moving. Aim to merge feature branches within 1-3 days. If a feature is large, break it into smaller incremental branches that can each be merged independently. Long-lived branches are the number one cause of painful merges."}
    ]},
    {label:"Detached HEAD state",content:`<div class="danger"><div class="callout-icon">⚠️</div><div><strong>Detached HEAD</strong> happens when you checkout a specific commit hash instead of a branch name — HEAD points directly to a commit rather than a branch. Any commits you make in this state aren't on any branch and will be garbage-collected (deleted) unless you save them by creating a branch: <code>git switch -c rescue-branch</code>. Git always warns you when you enter this state. It's useful for inspecting old code but dangerous if you start committing.</div></div>`},
    {label:"In the workplace",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>Interview tip:</strong> 'Explain your branching workflow' is a common interview question. The answer: create a feature branch from main, do your work in small focused commits, push to remote, open a pull request for code review, address feedback, then merge. You should be able to create branches, switch between them, and delete them without thinking — it's muscle memory for professional developers.</div></div>`}
  ],
  challenges:[
    {q:"Type the single command to create a new branch called 'feature-nav' AND switch to it immediately.",scenario:"You're starting work on a new navigation feature. You want to do it all in one command.",hint:"The modern command uses 'git switch' with a flag to create. Or the older 'git checkout' has a similar flag.",answer:"Answer: git switch -c feature-nav (or the older git checkout -b feature-nav). The -c flag means 'create'. This creates the branch from your current position and moves HEAD to it in one step.",accept:["git switch -c feature-nav","git checkout -b feature-nav"],feedback:"git switch -c is the modern way. The older git checkout -b still works. Both create the branch from your current HEAD position and switch to it immediately. The -c flag means 'create'."},
    {q:"You are on 'feature-nav'. Type the command to switch back to 'main'.",scenario:"You're done working on the feature branch and need to return to the main branch.",hint:"You need to move HEAD to point at main. The modern command for switching branches is 'git switch'.",answer:"Answer: git switch main (or git checkout main). This moves HEAD to point at the main branch and updates your working directory to match main's latest commit.",accept:["git switch main","git checkout main"],feedback:"git switch main moves HEAD to point to the main branch. Your working directory automatically updates to match the state of main's latest commit. Any uncommitted changes must be committed or stashed first."},
    {q:"What is the name of the special Git pointer that always tells you which branch (or commit) you are currently on?",scenario:"Your team lead asks: 'What pointer tracks your current location in the Git graph?'",hint:"It's a four-letter word written in ALL CAPS. It always shows your current position in the Git graph.",answer:"Answer: HEAD. It's a pointer to your current position in the Git graph. Normally HEAD points to a branch name, which in turn points to a commit. In 'detached HEAD' state, it points directly to a commit hash.",accept:["head","HEAD","the HEAD pointer","the head pointer","HEAD pointer"],feedback:"HEAD is a pointer to your current position. Normally it points to a branch name (which points to a commit). In detached HEAD state, it points directly to a commit hash. Every Git command operates relative to HEAD."},
    {q:"Type the command to list ALL branches including remote-tracking branches.",scenario:"You want to see both your local branches and all branches on the remote server.",hint:"It's 'git branch' with a flag. The flag is the first letter of 'all'.",answer:"Answer: git branch -a (or git branch --all). Without -a you only see local branches. With it, you also see remote-tracking branches like remotes/origin/main.",accept:["git branch -a","git branch --all"],feedback:"git branch -a shows both local branches and remote-tracking branches (displayed as remotes/origin/main, remotes/origin/dev, etc.). Without -a, you only see local branches. Use -v to also see the latest commit on each."}
  ]
},
{
  title:"Merging & Conflict Resolution",sub:"Bringing branches back together",
  sections:[
    {label:"What is merging?",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Merging is how you bring changes from one branch into another. When your feature branch is done, you merge it into <code>main</code>. Git is remarkably good at merging automatically — it only needs your help when two branches have changed the <strong>same lines</strong> in the <strong>same file</strong>.</p>`},
    {label:"Types of merge",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Git chooses the merge strategy automatically based on the branch history:</p>`,cards:[
      {title:"Fast-forward merge",body:"Happens when the target branch (main) hasn't had any new commits since you branched off. Git simply moves main's pointer forward to your latest commit. No merge commit is created. The history stays perfectly linear. This is the simplest and cleanest type of merge."},
      {title:"Three-way merge (recursive)",body:"Happens when both branches have diverged — both have commits the other doesn't. Git finds the <strong>common ancestor</strong> (the commit where the branches split), compares both branches against it, combines the changes, and creates a new <strong>merge commit</strong> with two parent pointers. This merge commit is a permanent record that a branch was integrated."},
      {title:"Squash merge",body:"Combines all the feature branch's commits into a single commit on main. Useful for keeping main's history clean. Run with <code>git merge --squash feature-x</code> followed by <code>git commit</code>. The original branch history is discarded — only the final result is kept."}
    ]},
    {label:"Merge diagram",content:`<div class="diagram"><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text1);line-height:2.2">
<div style="color:var(--accent-orange)">Fast-Forward (main didn't move):</div>
<div>main: A ─── B</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── C ─── D ← feature</div>
<div style="color:var(--text3)">After merge: main pointer moves to D. No merge commit needed.</div>
<div style="margin-top:14px;color:var(--accent-orange)">Three-Way Merge (both branches diverged):</div>
<div>main: A ─── B ─── C</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── D ─── E ← feature</div>
<div>After: A ─── B ─── C ─── <span style="color:var(--accent-teal)">M</span> ← main (merge commit)</div>
<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── D ─── E ─┘</div>
</div></div>`},
    {label:"Merge commands",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">To merge, you first switch to the <strong>target branch</strong> (the branch you want to bring changes INTO), then run <code>git merge</code> with the source branch name. You always merge INTO your current branch:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Step 1: Switch to the branch you want to merge INTO</span>
<span class="hl">git switch</span> main

<span class="cmt"># Step 2: Merge the feature branch into main</span>
<span class="hl">git merge</span> feature-login

<span class="cmt"># Force a merge commit even if fast-forward is possible</span>
<span class="cmt"># This preserves the record that a branch existed</span>
<span class="hl">git merge</span> --no-ff feature-login

<span class="cmt"># Squash all feature commits into one</span>
<span class="hl">git merge</span> --squash feature-login
<span class="hl">git commit</span> -m <span class="str">"Add login feature"</span>

<span class="cmt"># Cancel a merge that has conflicts you can't resolve yet</span>
<span class="hl">git merge</span> --abort
<span class="cmt"># Restores everything to the state before you ran git merge</span>`}},
    {label:"Understanding merge conflicts",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">A merge conflict occurs when two branches have modified the <strong>same lines</strong> in the <strong>same file</strong>. Git cannot automatically decide which version to keep, so it asks you to resolve it manually. Conflicts are normal in team environments — they are not errors. Learning to resolve them confidently is an essential professional skill.</p>
<p style="color:var(--text2);font-size:14px;margin-bottom:14px">When a conflict occurs, Git inserts special markers into the file to show you both versions:</p>`,codeblock:{lang:"text",code:`<span class="hl">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</span>
<span class="str">// This is YOUR version (the branch you're merging INTO)</span>
<span class="str">function login(email, password) {</span>
<span class="hl">=======</span>
<span class="hl2">// This is THEIR version (the branch being merged in)</span>
<span class="hl2">function login(username, password) {</span>
<span class="hl">&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature-login</span>`}},
    {label:"Resolving conflicts step by step",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Follow these steps every time you encounter a merge conflict:</p>`,cards:[
      {title:"Step 1: Identify conflicted files",body:"Run <code>git status</code> — files with conflicts are listed under 'Unmerged paths' and marked as 'both modified'. Open each one in your editor."},
      {title:"Step 2: Edit the file",body:"Find the conflict markers (<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>). Decide which version to keep — yours, theirs, or a combination of both. <strong>Delete ALL conflict markers</strong> when done. The file should look exactly how you want the final result to be."},
      {title:"Step 3: Stage the resolved file",body:"Run <code>git add filename</code> to tell Git you've resolved this conflict. This marks the file as resolved in the staging area."},
      {title:"Step 4: Complete the merge",body:"Run <code>git commit</code> — Git will pre-fill a merge commit message. You can edit it or accept the default. The merge is now complete."}
    ],codeblock:{lang:"bash",code:`<span class="cmt"># After editing the conflicted file and removing all markers:</span>
<span class="hl">git add</span> app.js              <span class="cmt"># mark as resolved</span>
<span class="hl">git commit</span>                  <span class="cmt"># complete the merge</span>
<span class="cmt"># Git pre-fills: "Merge branch 'feature-login' into main"</span>`}},
    {label:"Conflict resolution tips",cards:[
      {title:"Use your editor's built-in tools",body:"VS Code highlights conflicts with colour-coded blocks and shows 'Accept Current', 'Accept Incoming', 'Accept Both' buttons above each conflict. This is much easier than manually editing markers. You can also run <code>git mergetool</code> to use dedicated tools like Meld or KDiff3 for side-by-side comparison."},
      {title:"Common mistakes to avoid",body:"<strong>1)</strong> Leaving conflict markers in the file — your code won't compile. Always search for <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> after resolving. <strong>2)</strong> Accidentally deleting the wrong version. <strong>3)</strong> Forgetting to <code>git add</code> after resolving — the merge won't complete. If it all goes wrong, <code>git merge --abort</code> resets everything."}
    ]},
    {label:"In the workplace",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>Interview tip:</strong> 'How do you handle merge conflicts?' is a classic interview question. The answer: I identify the conflicted files with <code>git status</code>, open each file in my editor, understand both versions of the code, decide which changes to keep (or combine them), remove all conflict markers, test the result, then <code>git add</code> and <code>git commit</code>. If the conflict is too complex, I use <code>git merge --abort</code> and discuss with my team before trying again. Staying calm and methodical is key — conflicts are routine, not emergencies.</div></div>`}
  ],
  challenges:[
    {q:"You are on 'main'. Type the command to merge a branch called 'feature-payment' into main.",scenario:"The feature is complete and approved. You need to bring it into main.",hint:"You're already on main. The command is 'git merge' followed by the branch name you want to bring in.",answer:"Answer: git merge feature-payment — You always merge INTO your current branch. Since you're already on main, this brings feature-payment's changes into main. The source branch isn't deleted automatically.",accept:["git merge feature-payment"],feedback:"You always merge INTO your current branch. Since you're on main, git merge feature-payment brings the feature branch's changes into main. The feature branch itself is not deleted — you must delete it separately with git branch -d."},
    {q:"A merge has gone badly wrong mid-way through. Type the command to cancel it and return to the state before you started the merge.",scenario:"You started merging but the conflicts are too complex and you want to start fresh.",hint:"Git merge has a flag that aborts the in-progress operation. Think 'git merge --______'.",answer:"Answer: git merge --abort — This cancels the in-progress merge and restores everything to the state before you ran git merge. Only works while a merge is in progress (i.e. there are unresolved conflicts).",accept:["git merge --abort"],feedback:"git merge --abort cancels the in-progress merge and restores your working directory to the state before you ran git merge. It only works while a merge is in progress. Once you've committed, you'd need git revert instead."},
    {q:"After manually resolving a conflict in 'app.js', what are the two commands you run to complete the merge? Separate them with a semicolon.",scenario:"You've edited the conflict markers out of app.js. What do you do next to finish the merge?",hint:"First stage the resolved file with 'git add', then finalise with 'git commit'. Separate with a semicolon.",answer:"Answer: git add app.js; git commit — First stage the resolved file to mark the conflict as resolved, then commit to finalise the merge. Git pre-fills the commit message with merge information.",accept:["git add app.js; git commit","git add app.js;git commit","git add app.js ; git commit","git add .; git commit"],feedback:"First git add marks the conflict as resolved by staging the fixed file. Then git commit finalises the merge — Git pre-fills the commit message with merge information. Both steps are required."}
  ]
},
{
  title:"Remote Repositories",sub:"GitHub, push, pull, clone, fetch",
  sections:[
    {label:"What are remotes?",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">So far, everything has been local — on your machine only. Remote repositories are copies of your project hosted on a server (GitHub, GitLab, Bitbucket). Remotes enable <strong>collaboration</strong> (multiple people working on the same project), <strong>backup</strong> (your code is safe even if your laptop dies), and <strong>deployment</strong> (servers pull code from remotes to deploy it).</p>
<div class="diagram"><div class="diagram-flex">
<div class="d-node orange"><div class="d-label">Your machine</div><div class="d-name">Local repo</div></div>
<div style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:0 12px"><div style="font-size:10px;color:var(--accent-blue);font-family:'JetBrains Mono',monospace">git push →</div><div style="color:var(--text3);font-size:20px">⇄</div><div style="font-size:10px;color:var(--accent-purple);font-family:'JetBrains Mono',monospace">← git pull</div></div>
<div class="d-node accent"><div class="d-label">GitHub / GitLab</div><div class="d-name">Remote repo</div><div class="d-cmd">origin</div></div>
</div></div>`},
    {label:"Key remote concepts",cards:[
      {title:"origin — the default remote name",body:"When you clone a repository or add a remote, the name <code>origin</code> is used by convention. It's just an alias for the remote URL — you could name it anything, but <code>origin</code> is the universal standard. Think of it like a contact name in your phone: 'origin' = 'https://github.com/user/repo.git'."},
      {title:"Remote-tracking branches",body:"After fetching, Git creates local read-only references like <code>origin/main</code> that show where the remote's branches were at the time of the last fetch. These update when you <code>git fetch</code> or <code>git pull</code>. They let you see how far ahead or behind your local branch is compared to the remote."},
      {title:"Upstream tracking",body:"When you run <code>git push -u origin main</code>, the <code>-u</code> flag sets up a <strong>tracking relationship</strong> between your local <code>main</code> and <code>origin/main</code>. After this, Git knows where to push and pull without you specifying the remote and branch every time. Future commands become just <code>git push</code> and <code>git pull</code>."}
    ]},
    {label:"Cloning a repository",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git clone</code> is typically the first command you run when joining a project. It downloads the entire repository — all files, all branches, all history — to your local machine and sets up <code>origin</code> automatically:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Clone a repo (creates a folder with the repo name)</span>
<span class="hl">git clone</span> https://github.com/user/repo.git
<span class="cmt"># Creates: ./repo/ with all files, history, and remote configured</span>

<span class="cmt"># Clone into a specific folder name</span>
<span class="hl">git clone</span> https://github.com/user/repo.git my-project

<span class="cmt"># After cloning, 'origin' is already configured:</span>
<span class="hl">git remote</span> -v
<span class="cmt"># origin  https://github.com/user/repo.git (fetch)</span>
<span class="cmt"># origin  https://github.com/user/repo.git (push)</span>`}},
    {label:"Connecting a local repo to a remote",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">If you started a project locally with <code>git init</code> (instead of cloning), you need to manually connect it to a remote. This is how you link your local repo to a GitHub/GitLab repository:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Add a remote called 'origin' pointing to your GitHub repo</span>
<span class="hl">git remote add</span> origin https://github.com/user/repo.git

<span class="cmt"># Verify the remote was added</span>
<span class="hl">git remote</span> -v

<span class="cmt"># List all remote names</span>
<span class="hl">git remote</span>

<span class="cmt"># Change a remote's URL (e.g. switching from HTTPS to SSH)</span>
<span class="hl">git remote set-url</span> origin git@github.com:user/repo.git

<span class="cmt"># Remove a remote</span>
<span class="hl">git remote remove</span> origin`}},
    {label:"Pushing and pulling",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git push</code> sends your local commits to the remote. <code>git pull</code> downloads remote commits and integrates them into your local branch. These two commands are how your team stays synchronised:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># First push ever — sets up tracking so future pushes are simple</span>
<span class="hl">git push</span> -u origin main
<span class="cmt"># The -u flag (--set-upstream) links local main → origin/main</span>

<span class="cmt"># After -u is set, all future pushes are just:</span>
<span class="hl">git push</span>

<span class="cmt"># Pull remote changes and merge them into your current branch</span>
<span class="hl">git pull</span>

<span class="cmt"># Pull with rebase instead of merge (cleaner linear history)</span>
<span class="hl">git pull</span> --rebase
<span class="cmt"># This replays your local commits on top of the remote changes</span>
<span class="cmt"># instead of creating a merge commit</span>`}},
    {label:"Fetch vs pull — the critical difference",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">This distinction comes up in interviews constantly. Understanding it is non-negotiable:</p>`,cards:[
      {title:"git fetch — safe download",body:"Downloads new commits and branches from the remote but does <strong>NOT</strong> change your working directory or current branch. Your code stays exactly as it is. The remote-tracking branches (like <code>origin/main</code>) update to reflect the remote's state. Use <code>git log origin/main..main</code> to see what's different before integrating. <strong>This is the safe option</strong> — you can inspect changes before deciding what to do."},
      {title:"git pull — download and integrate",body:"Runs <code>git fetch</code> followed by <code>git merge</code> automatically. It downloads remote changes and immediately merges them into your current branch. This is convenient but can create unexpected merge conflicts or unwanted merge commits. Use <code>git pull --rebase</code> instead of plain <code>git pull</code> for a cleaner history — it replays your local commits on top of the remote changes."},
      {title:"Professional recommendation",body:"Most experienced developers prefer <code>git fetch</code> first, inspect what changed, then merge or rebase manually. Blindly pulling can introduce conflicts at the worst possible moment. Many teams configure <code>git pull --rebase</code> as the default with: <code>git config --global pull.rebase true</code>"}
    ]},
    {label:"SSH vs HTTPS authentication",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>HTTPS remotes</strong> require authentication on every push — either a username/password or a Personal Access Token (PAT). GitHub removed password authentication in August 2021, so HTTPS now requires a PAT.<br><br><strong>SSH remotes</strong> use a cryptographic key pair. Once your SSH key is configured, authentication is completely silent and automatic. Most professional developers use SSH because it's more secure and eliminates the need to type credentials. You'll set this up in the Platforms section later.</div></div>`},
    {label:"The daily remote workflow",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>The daily workflow in a team:</strong><br><br>1. <code>git pull --rebase</code> — start the day by getting the latest from remote<br>2. <code>git switch -c feature/my-task</code> — create a feature branch<br>3. Work, commit, work, commit<br>4. <code>git push -u origin feature/my-task</code> — push your branch<br>5. Open a Pull Request on GitHub/GitLab<br>6. Team reviews → merge → delete branch<br>7. <code>git switch main</code> → <code>git pull</code> — get the merged result<br><br>This cycle repeats for every task. The better you know these commands, the faster and more confidently you move.</div></div>`}
  ],
  challenges:[
    {q:"Type the command to add a remote named 'origin' pointing to 'https://github.com/user/repo.git'.",scenario:"You have a local repo and just created an empty repo on GitHub. Connect them.",hint:"The command pattern is: git remote add <name> <url>. Fill in the name and URL from the question.",answer:"Answer: git remote add origin https://github.com/user/repo.git — This creates an alias called 'origin' for the full URL. After this, you can push/pull using just the name 'origin'.",accept:["git remote add origin https://github.com/user/repo.git"],feedback:"git remote add creates an alias (origin) for the remote URL. After this, you can push/pull without typing the full URL every time. Verify with git remote -v to confirm it's correct."},
    {q:"Type the full command to push your 'main' branch to origin for the very first time AND set it as the default upstream.",scenario:"First push ever. You want future 'git push' commands to know where to go without specifying explicitly.",hint:"You need 'git push' with a flag that sets the upstream tracking. The flag is -u.",answer:"Answer: git push -u origin main — The -u flag (short for --set-upstream) creates a tracking link between local main and origin/main. After this first push, plain git push works without arguments.",accept:["git push -u origin main","git push --set-upstream origin main","git push --set-upstream-to origin main"],feedback:"The -u flag (short for --set-upstream) creates a tracking relationship between your local main and origin/main. After this, just git push or git pull works without specifying the remote and branch."},
    {q:"What is the difference between git fetch and git pull? Answer in one sentence.",scenario:"A teammate asks you to explain the difference clearly.",hint:"One downloads only. The other downloads AND does something extra. What extra step does pull add?",answer:"Answer: Fetch downloads without merging, pull downloads and merges. git fetch updates your remote-tracking branches (origin/main etc.) but leaves your local branches untouched. git pull = git fetch + git merge.",accept:["fetch downloads without merging, pull downloads and merges","fetch downloads changes without merging them, pull fetches and merges","fetch gets changes without merging, pull fetches and merges automatically","fetch downloads remote changes but does not merge, pull fetches and then merges","git fetch downloads without merging git pull fetches and merges","fetch only downloads, pull downloads and merges","fetch downloads but doesnt merge, pull does both","fetch is download only, pull is download plus merge","fetch just downloads, pull downloads and merges","pull is fetch plus merge","git pull is git fetch plus git merge","fetch downloads changes, pull downloads and merges them","fetch downloads without integrating, pull downloads and integrates"],feedback:"git fetch is the safe operation — it updates your remote-tracking branches (origin/main) but leaves your local branches untouched. git pull = git fetch + git merge (or rebase if you use --rebase). Most professionals fetch first, inspect, then merge."}
  ]
}
);