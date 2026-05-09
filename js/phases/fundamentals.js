// GitCoven — Fundamentals — Phases 1-4
// This file contains phases 1-4

phases.push(
{
  title:"What is Version Control?",sub:"The problem Git solves, and why it won",
  sections:[
    {label:"The problem without version control",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Before version control existed, developers managed code changes manually. This created three devastating problems that every software team eventually hit:</p>`,cards:[
      {title:"Folder hell",body:"Without version control, developers end up with <code>project_v1</code>, <code>project_v2_final</code>, <code>project_FINAL_REAL</code>. There's no way to see what changed between versions, who changed it, or why. A single misnamed folder can mean hours of detective work."},
      {title:"Team chaos",body:"When multiple developers work on the same file, the last person to save wins — everyone else's work is silently overwritten. There is no record of who deleted what. In a team of 10 developers, this becomes impossible to manage."},
      {title:"No safety net",body:"Delete a critical function by accident? Without version control, it's gone forever. There's no undo that spans across save sessions. Production goes down at 2 AM and nobody can recover the old version quickly. Companies have lost millions because of this."}
    ]},
    {label:"Version Control Systems (VCS)",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Version control systems evolved through three generations, each solving the problems of the last:</p>`,cards:[
      {title:"Local VCS (1970s–80s)",body:"Stored file patches (diffs) on the local disk. Only one person could use it at a time. Example: RCS (Revision Control System). Think of it as a personal diary — useful for one person, useless for a team."},
      {title:"Centralized VCS (1990s–2000s)",body:"One central server held the master copy. Developers checked out individual files to work on them. If the server went down, nobody could work. If the server's hard drive failed, the entire project history was lost. Examples: CVS, SVN (Subversion), Perforce."},
      {title:"Distributed VCS (2005–present)",body:"Every developer has a <strong>full copy of the entire repository</strong> and its complete history on their local machine. There is no single point of failure. You can work offline, commit locally, and sync later. Examples: <strong>Git</strong>, Mercurial. This is the standard today."}
    ]},
    {label:"Why Git won",cards:[
      {title:"Born from necessity",body:"In 2005, Linus Torvalds (creator of Linux) built Git in two weeks after a dispute with BitKeeper, the proprietary tool the Linux kernel team had been using. His requirements: blazingly fast, fully distributed, strong support for non-linear development (thousands of parallel branches), and able to handle the Linux kernel's enormous codebase with thousands of contributors."},
      {title:"Git's dominance today",body:"Over 90% of all software projects worldwide use Git. Every major platform — GitHub (owned by Microsoft), GitLab, Bitbucket (owned by Atlassian) — is built on top of Git. <strong>Every developer job listing expects Git proficiency.</strong> It's as fundamental as knowing a programming language."},
      {title:"Speed and efficiency",body:"Git is fast because nearly all operations are local — no network round-trip needed. Branching and merging happen in milliseconds. Internally, Git uses content-addressable storage with SHA-1 hashes, meaning it never stores duplicate data and can verify data integrity automatically."}
    ]},
    {label:"Core concepts preview",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">You'll learn each of these in depth throughout the course. For now, understand what they mean at a high level:</p>`,cards:[
      {title:"Repository (repo)",body:"A project directory whose history Git tracks. It contains your working files plus a hidden <code>.git</code> folder that stores the entire history database. Every project you work on will be a Git repository."},
      {title:"Commit",body:"A permanent snapshot of your files at a specific point in time. Each commit has a unique ID (a SHA-1 hash like <code>a1b2c3d</code>), an author, a timestamp, and a message describing what changed. Think of it as a save point in a game — you can always return to any previous commit."},
      {title:"Branch",body:"An independent line of development. Branches let you work on features, bug fixes, or experiments in isolation without affecting the main codebase. Every Git project starts with a default branch called <code>main</code> (previously <code>master</code>)."},
      {title:"Remote",body:"A copy of your repository hosted elsewhere — typically on GitHub, GitLab, or Bitbucket. Remotes enable collaboration: you push your work to the remote so others can pull it, and vice versa."}
    ]},
    {label:"Real-world impact",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>Interview insight:</strong> You may be asked 'Why use Git?' or 'What is version control?' in interviews. The key points: Git provides a complete history of every change, enables team collaboration without overwriting each other's work, allows branching for parallel development, and provides a safety net to recover from any mistake. In 2012, Knight Capital Group lost $440 million in 45 minutes because old code was deployed to production — proper version control with tagging and rollback procedures could have prevented it entirely.</div></div>`}
  ],
  challenges:[
    {q:"In a distributed VCS like Git, what does every developer have on their local machine?",scenario:"You are comparing centralized VCS (like SVN) to distributed VCS (like Git). What is the key advantage?",hint:"Think about what 'distributed' means — every developer doesn't just have the latest files, they have the complete ______.",answer:"Answer: A full copy of the entire repository history. In a distributed VCS, every clone contains every commit ever made — not just the latest files. This is what allows offline work and eliminates single points of failure.",accept:["a full copy of the entire repository history","full copy of the repo","complete copy of the repository","the entire repository including all history","a complete copy of all history","full history of the repo","the full repo including history","a full copy of the repo","the complete repository","entire repo history","full copy of the entire repo","a complete copy of the repository","the whole repository and its history","every version of every file","the full repository"],feedback:"In a distributed VCS, every developer has a complete copy of the entire repository including all its history. This means you can work offline, there's no single point of failure, and operations are fast because they don't need the network."},
    {q:"What is the name of the hidden directory Git creates inside every repository to store its database?",scenario:"You ran git init in a folder. A new directory was silently created. Name it exactly (include the dot).",hint:"It starts with a period (making it hidden on Unix/macOS) and shares its name with the tool itself.",answer:"Answer: .git — This hidden folder is Git's entire database. It stores all commits, branches, config, and object data. If you delete it, you lose all history.",accept:[".git",".git/"],feedback:"The .git directory is Git's entire database — commits, branches, config, hooks, objects. Never manually delete or edit files inside it unless you know exactly what you're doing."},
    {q:"What type of VCS gives every developer a complete copy of the entire repository history on their local machine?",scenario:"You're explaining Git's architecture to a junior developer. Name the category of VCS that Git belongs to.",hint:"Three generations of VCS: local, centralized, and ________. Git belongs to the newest.",answer:"Answer: Distributed. The three generations are local → centralized → distributed. Git and Mercurial are distributed — every developer has the full repo, not just a checkout from a central server.",accept:["distributed","distributed vcs","distributed version control","distributed version control system"],feedback:"Distributed VCS means every developer has the full history locally. This allows offline work, no single point of failure, and faster operations since most commands don't need a network."}
  ]
},
{
  title:"Installation & Configuration",sub:"Getting Git ready, setting your identity",
  sections:[
    {label:"Installing Git",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Git must be installed before you can use it. The installation method depends on your operating system. After installing, always verify with <code>git --version</code> to confirm it's working.</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># macOS — using Homebrew (recommended)</span>
<span class="hl">brew</span> install git

<span class="cmt"># Ubuntu / Debian Linux</span>
sudo apt-get update
sudo apt-get install git

<span class="cmt"># Windows — two options:</span>
<span class="cmt"># Option 1: Download installer from git-scm.com/download/win</span>
<span class="cmt"># Option 2: Use Windows Package Manager</span>
winget install --id Git.Git -e --source winget

<span class="cmt"># Verify installation (works on all platforms)</span>
<span class="hl">git</span> --version
<span class="cmt"># Expected output: git version 2.44.0 (or similar)</span>`}},
    {label:"First-time configuration — your identity",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Before you can make your first commit, Git requires your name and email. These are stamped on <strong>every single commit you make</strong> and become a permanent part of the project's history. This is not about authentication (logging in) — it's about attribution (who made this change).</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Set your name (appears on every commit)</span>
<span class="hl">git config</span> --global user.name <span class="str">"Your Name"</span>

<span class="cmt"># Set your email (must match your GitHub/GitLab email)</span>
<span class="hl">git config</span> --global user.email <span class="str">"you@example.com"</span>

<span class="cmt"># Set your preferred text editor for commit messages</span>
<span class="hl">git config</span> --global core.editor <span class="str">"code --wait"</span>

<span class="cmt"># Set the default branch name to 'main' (modern standard)</span>
<span class="hl">git config</span> --global init.defaultBranch main

<span class="cmt"># View all your current settings</span>
<span class="hl">git config</span> --list`}},
    {label:"Understanding configuration scopes",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Git has three configuration scopes. Each level overrides the one above it. In practice, you set your identity at the <code>--global</code> level and only use <code>--local</code> when you need a different email for a specific repo (e.g. work vs personal).</p>`,cards:[
      {title:"--system scope",body:"Applies to <strong>every user</strong> on this computer. Stored in <code>/etc/gitconfig</code>. Requires admin/root rights. Rarely used — typically set by IT departments to enforce organisation-wide defaults. Lowest priority."},
      {title:"--global scope (most common)",body:"Applies to <strong>all repositories</strong> for the current user. Stored in <code>~/.gitconfig</code> (your home directory). This is where you set your name, email, editor, and aliases. Set once, applies everywhere. <strong>This is the scope you'll use 99% of the time.</strong>"},
      {title:"--local scope (default)",body:"Applies to <strong>only the current repository</strong>. Stored in <code>.git/config</code> inside the repo. Overrides global and system settings. Useful when you work at a company and need a different email for work repos vs personal side projects."}
    ]},
    {label:"Verifying your setup",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">After configuring Git, verify everything is correct:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Check a specific setting</span>
<span class="hl">git config</span> user.name
<span class="cmt"># Output: Your Name</span>

<span class="hl">git config</span> user.email
<span class="cmt"># Output: you@example.com</span>

<span class="cmt"># See ALL settings and which file they come from</span>
<span class="hl">git config</span> --list --show-origin`}},
    {label:"Common pitfall",content:`<div class="danger"><div class="callout-icon">⚠️</div><div><strong>Your Git email must match your GitHub/GitLab email.</strong> If they don't match, your commits won't link to your profile — they'll show up as a grey anonymous user, your green contribution graph stays empty, and your work history looks incomplete. Before your first commit, always verify: <code>git config user.email</code>. This is one of the most common mistakes new developers make.</div></div>`},
    {label:"Useful aliases",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Git aliases let you create shortcuts for commands you type frequently. These are stored in your <code>~/.gitconfig</code> file:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Create an alias: 'git st' now runs 'git status'</span>
<span class="hl">git config</span> --global alias.st status

<span class="cmt"># Create a visual log alias</span>
<span class="hl">git config</span> --global alias.lg <span class="str">"log --oneline --graph --all --decorate"</span>

<span class="cmt"># Create an 'undo last commit' alias</span>
<span class="hl">git config</span> --global alias.undo <span class="str">"reset --soft HEAD~1"</span>`}}
  ],
  challenges:[
    {q:"Type the exact command to set your global Git username to 'Ada Lovelace'.",scenario:"You just installed Git on a new machine. This is the first configuration command you must run.",hint:"The command starts with 'git config' and needs the scope flag for all repos on your account.",answer:"Answer: git config --global user.name \"Ada Lovelace\" — The --global flag writes to ~/.gitconfig so it applies to all repos on your machine. Without quotes, multi-word names break.",accept:["git config --global user.name \"ada lovelace\"","git config --global user.name 'ada lovelace'","git config --global user.name ada lovelace"],feedback:"git config --global user.name sets the author name that appears on every future commit on this machine. Use quotes around names with spaces. This is stored in ~/.gitconfig."},
    {q:"Type the command to view all your current Git configuration settings.",scenario:"You want to confirm your name and email are correctly saved before making your first commit.",hint:"It's a git config command with a flag that shows everything — think 'list' all settings.",answer:"Answer: git config --list — This shows every setting from all three scopes (system, global, local) merged together. You can also use the shorthand git config -l.",accept:["git config --list","git config --list ","git config -l"],feedback:"git config --list shows all config values from system, global, and local scopes combined. Add --show-origin to see which file each setting comes from. You can also open ~/.gitconfig directly with any text editor."},
    {q:"Which scope flag do you use to make a config setting apply to ALL repositories for your user account?",scenario:"You want your email to apply everywhere, not just in the current folder.",hint:"Three scopes: --system (everyone), ______ (your user), --local (this repo only).",answer:"Answer: --global — The three scopes are --system (all users), --global (your user account, all repos), and --local (current repo only). Global is stored in ~/.gitconfig.",accept:["--global","-global","global"],feedback:"--global saves the setting to ~/.gitconfig which applies to all repositories owned by your user account. It's the right scope for identity settings like name and email. The --local flag overrides --global for individual repos when needed."}
  ]
},
{
  title:"The Three Git Areas",sub:"Working directory, staging area, and repository",
  sections:[
    {label:"The core mental model",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:16px">This is the <strong style="color:var(--text0)">single most important concept in Git</strong>. Every Git command moves data between these three areas. If you understand this flow, every other command will make intuitive sense. If you skip this, nothing else will click.</p>
<div class="diagram"><div class="diagram-flex">
<div class="d-node orange"><div class="d-label">Where you edit</div><div class="d-name">Working Directory</div><div class="d-cmd">files on disk</div></div>
<div class="d-arrow-v"><div class="d-arrow">→</div><div style="font-size:10px;color:var(--accent-blue);font-family:'JetBrains Mono',monospace">git add</div></div>
<div class="d-node accent"><div class="d-label">What you've prepared</div><div class="d-name">Staging Area</div><div class="d-cmd">the index</div></div>
<div class="d-arrow-v"><div class="d-arrow">→</div><div style="font-size:10px;color:var(--accent-blue);font-family:'JetBrains Mono',monospace">git commit</div></div>
<div class="d-node blue"><div class="d-label">Permanent history</div><div class="d-name">Repository</div><div class="d-cmd">.git/objects</div></div>
</div></div>`},
    {label:"Understanding each area",cards:[
      {title:"1. Working Directory",body:"The actual files on your hard drive — the ones you open in VS Code, edit, save, and run. When you modify a file, the change exists only here. Git can <em>see</em> the change (via <code>git status</code>) but has <em>not saved</em> it. If your computer crashes right now, unsaved work is lost. Think of it as your kitchen counter — where ingredients are spread out."},
      {title:"2. Staging Area (also called the Index)",body:"An intermediate holding area where you prepare exactly which changes will go into your next commit. When you run <code>git add filename</code>, you copy a snapshot of that file into the staging area. You can stage some files and leave others — this is what makes Git commits so precise. Internally, the staging area is a binary file at <code>.git/index</code>. Think of it as a plate — you choose which items go on it before serving."},
      {title:"3. Repository (.git database)",body:"The permanent, append-only database of all your commits. When you run <code>git commit</code>, everything in the staging area becomes a new commit object stored in <code>.git/objects</code>. This is your project's full history. Commits are immutable — once created, they never change. Think of it as the recipe book — every dish is permanently recorded."}
    ]},
    {label:"Why the staging area exists",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:12px">Many beginners wonder: <em>'Why not just commit directly from the working directory?'</em> The staging area gives you the power to craft <strong style="color:var(--text0)">precise, logical commits</strong>. Imagine you edited 5 files: 3 files fix a bug, and 2 files start a new feature. Without staging, you'd have to commit all 5 together in one messy commit. With staging, you <code>git add</code> just the 3 bug-fix files, commit them with the message 'Fix login crash', then <code>git add</code> the other 2 and commit with 'Start user profile feature'. Clean, separate, meaningful history.</p>
<p style="color:var(--text2);font-size:14px"><strong style="color:var(--text0)">In professional teams, commit quality matters.</strong> Reviewers read your commits. Clean commits get approved faster. Messy commits get rejected with 'please split this up'.</p>`},
    {label:"The four file states",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Every file in a Git repository is in one of four states. Understanding these states is essential for reading <code>git status</code> output:</p>`,cards:[
      {title:"Untracked",body:"A brand new file that Git has never seen before. It won't be included in any commit until you explicitly <code>git add</code> it for the first time. <code>git status</code> shows these under 'Untracked files' in red."},
      {title:"Modified (Unstaged)",body:"A file Git already tracks that has been changed in the working directory since the last commit, but has not been staged with <code>git add</code>. <code>git status</code> shows these under 'Changes not staged for commit' in red."},
      {title:"Staged",body:"A file (or specific changes within a file) that has been added to the staging area with <code>git add</code>. These changes will be included in the next <code>git commit</code>. <code>git status</code> shows these under 'Changes to be committed' in green."},
      {title:"Committed (Unmodified)",body:"The file in your working directory is identical to the version in the latest commit. There is nothing to stage or commit. <code>git status</code> does not show these files at all — no news is good news."}
    ]},
    {label:"Moving files between areas",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">These are the commands that move files between the three areas. You must know all of them:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># STAGE a file (working dir → staging area)</span>
<span class="hl">git add</span> filename.js

<span class="cmt"># UNSTAGE a file (staging area → back to working dir)</span>
<span class="cmt"># Your changes are kept — they're just no longer queued for commit</span>
<span class="hl">git restore</span> --staged filename.js

<span class="cmt"># DISCARD changes in working dir (revert to last commit)</span>
<span class="cmt"># ⚠️ WARNING: This is IRREVERSIBLE — your changes are gone forever</span>
<span class="hl">git restore</span> filename.js

<span class="cmt"># COMMIT staged changes (staging area → repository)</span>
<span class="hl">git commit</span> -m <span class="str">"Your message"</span>

<span class="cmt"># CHECK which files are in which state</span>
<span class="hl">git status</span>`}},
    {label:"Interactive staging with git add -p",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git add -p</code> (short for <code>--patch</code>) is a power tool that lets you stage <strong>individual chunks</strong> within a file rather than the entire file. Git shows you each change one at a time and asks what to do:</p>`,codeblock:{lang:"bash",code:`<span class="hl">git add</span> -p filename.js`},cards:[
      {title:"Interactive options",body:"<code>y</code> = yes, stage this chunk &nbsp; <code>n</code> = no, skip this chunk &nbsp; <code>s</code> = split into smaller chunks &nbsp; <code>q</code> = quit (stop staging) &nbsp; <code>?</code> = show help for all options"},
      {title:"When to use this",body:"Use <code>git add -p</code> when you've made multiple unrelated changes in a single file and want to commit them separately. For example, you fixed a bug on line 10 and also refactored a function on line 200 — stage the bug fix first, commit it, then stage and commit the refactor separately. <strong>This is how senior developers work.</strong>"}
    ]},
    {label:"In the workplace",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>Interview tip:</strong> 'Explain the Git staging area' is a common interview question. The key insight: the staging area lets you create <em>atomic commits</em> — commits that contain exactly one logical change. This makes code review easier, debugging with <code>git bisect</code> more effective, and reverting specific changes possible without affecting unrelated work. Employers value developers who write clean, focused commits.</div></div>`}
  ],
  challenges:[
    {q:"You staged a file by mistake. Type the exact command to unstage 'secrets.env' without losing your changes.",scenario:"You ran git add secrets.env accidentally. You need to remove it from the staging area before committing.",hint:"You want to 'restore' the file from the staged state. There's a flag that targets the staging area specifically.",answer:"Answer: git restore --staged secrets.env — The --staged flag targets the index/staging area specifically, moving the file back to 'modified but unstaged' without losing your changes.",accept:["git restore --staged secrets.env","git restore --staged","git reset head secrets.env","git reset head -- secrets.env"],feedback:"git restore --staged removes the file from the staging area but keeps your changes in the working directory. The older syntax (git reset HEAD filename) still works but git restore --staged is the modern, recommended approach."},
    {q:"Name all three Git areas in order, separated by commas.",scenario:"Describe the path a change travels from your keyboard to a permanent commit.",hint:"Start from where you edit code → where you prepare changes → where they're stored permanently.",answer:"Answer: Working directory, staging area, repository. Changes flow: you edit files (working directory) → git add (staging area) → git commit (repository). The staging area is also called the 'index'.",accept:["working directory, staging area, repository","working directory, staging area, repo","working directory,staging area,repository","working dir, staging area, repository","working directory, index, repository","working directory, the index, repository","working directory staging area repository","working tree, staging area, repository","working directory, stage, repository","working dir, index, repo","workspace, staging area, repository","working directory, staging, repository"],feedback:"Changes move: Working Directory (you edit) → Staging Area / Index (git add) → Repository (git commit). Understanding this flow is the foundation for every Git operation you'll ever do."},
    {q:"What flag do you add to git add to interactively choose which specific chunks of a file to stage?",scenario:"You changed 5 things in app.js but only want to stage 2 of them in this commit.",hint:"The flag stands for 'patch' — a single letter. It lets you review each hunk individually.",answer:"Answer: -p (or --patch). This flag opens an interactive mode showing each change 'hunk' and lets you choose y/n/s/q for each one. It's how you craft precise, atomic commits.",accept:["-p","--patch","-p flag","--patch flag"],feedback:"git add -p (or --patch) opens an interactive mode showing each change 'hunk' and asks: y (stage), n (skip), s (split), q (quit). This is how experienced developers keep their commits clean and focused."}
  ]
},
{
  title:"Basic Workflow: init, add, commit",sub:"Creating repos and making your first commits",
  sections:[
    {label:"Starting a new repository",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git init</code> turns any directory into a Git repository by creating the hidden <code>.git</code> folder inside it. Your existing files are not modified — Git simply starts watching the directory for changes.</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Turn an existing project folder into a Git repo</span>
<span class="hl">git init</span>
<span class="cmt"># Output: Initialized empty Git repository in /path/.git/</span>

<span class="cmt"># OR create a new folder and initialise it in one step</span>
<span class="hl">git init</span> my-project
<span class="cmt"># Creates the 'my-project' directory with .git inside it</span>
<span class="cmt"># Then: cd my-project</span>`}},
    {label:"Checking the state of your files",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git status</code> is the command you'll run most often. It tells you which files have changed, which are staged for commit, and which are untracked. Run it before every add and commit to know exactly where you stand.</p>`,codeblock:{lang:"bash",code:`<span class="hl">git status</span>
<span class="cmt"># Shows the full state of your repository:</span>
<span class="cmt"># - Which branch you're on</span>
<span class="cmt"># - Files staged for commit (green)</span>
<span class="cmt"># - Files modified but not staged (red)</span>
<span class="cmt"># - Untracked files (red)</span>

<span class="hl">git status</span> -s
<span class="cmt"># Short format — compact two-column output:</span>
<span class="cmt">#  ?? README.md      → untracked (Git has never seen this file)</span>
<span class="cmt">#  A  index.html     → staged new file (added to staging area)</span>
<span class="cmt">#   M app.js         → modified but NOT staged (space before M)</span>
<span class="cmt">#  M  style.css      → modified AND staged (M in first column)</span>
<span class="cmt">#  MM config.js      → staged, then modified again after staging</span>`}},
    {label:"Staging files with git add",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git add</code> copies a snapshot of files from your working directory into the staging area. Nothing is committed yet — you're just preparing. You can be selective (one file, one directory) or broad (everything).</p>`,codeblock:{lang:"bash",code:`<span class="hl">git add</span> README.md          <span class="cmt"># stage one specific file</span>
<span class="hl">git add</span> src/               <span class="cmt"># stage an entire directory</span>
<span class="hl">git add</span> .                  <span class="cmt"># stage all new + modified files in current dir</span>
<span class="hl">git add</span> -A                 <span class="cmt"># stage everything including deletions</span>
<span class="hl">git add</span> -p                 <span class="cmt"># interactively stage specific chunks</span>
<span class="hl">git add</span> *.js               <span class="cmt"># stage all JavaScript files</span>`},cards:[
      {title:"git add . vs git add -A",body:"<code>git add .</code> stages new and modified files in the current directory and subdirectories. <code>git add -A</code> does the same but also stages file deletions across the entire repository. In most cases they behave identically, but <code>-A</code> is more thorough."},
      {title:"Stage often, commit thoughtfully",body:"There's no cost to running <code>git add</code> multiple times. Stage files as you finish working on them, then commit when you have a complete logical change. If you accidentally stage something, use <code>git restore --staged filename</code> to unstage it."}
    ]},
    {label:"Committing your changes",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git commit</code> takes everything in the staging area and saves it as a permanent snapshot in the repository. Each commit is identified by a unique SHA-1 hash and records: what changed, who changed it, when, and why (your commit message).</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Commit with an inline message (most common)</span>
<span class="hl">git commit</span> -m <span class="str">"Add user authentication"</span>

<span class="cmt"># Commit and open your text editor for a longer message</span>
<span class="hl">git commit</span>
<span class="cmt"># Your editor opens — write a subject line, blank line, then body</span>
<span class="cmt"># Save and close the editor to complete the commit</span>

<span class="cmt"># Shortcut: stage all TRACKED files and commit in one step</span>
<span class="hl">git commit</span> -am <span class="str">"Fix login typo"</span>
<span class="cmt"># ⚠️ This only works for files Git already tracks</span>
<span class="cmt"># New (untracked) files still need a separate git add first</span>`}},
    {label:"Writing professional commit messages",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Your commit messages are read by your entire team. In a professional environment, bad commit messages will get your pull request rejected. Here are the rules every company expects:</p>`,cards:[
      {title:"The format",body:"<strong>Subject line:</strong> Max 50 characters. Use imperative mood ('Add feature' not 'Added feature'). No period at the end. <strong>Body (optional):</strong> Separated by a blank line. Explain <em>what</em> and <em>why</em>, not <em>how</em>. Wrap at 72 characters."},
      {title:"Bad commit messages",body:"❌ <code>fixed stuff</code> — What stuff? Where? Why?<br>❌ <code>WIP</code> — Never commit work-in-progress to shared branches<br>❌ <code>asdf</code> — Your teammates will hate you<br>❌ <code>Updated files</code> — Every commit updates files, this says nothing"},
      {title:"Good commit messages",body:"✅ <code>Add password reset via email</code><br>✅ <code>Fix null pointer in user login handler</code><br>✅ <code>Refactor database connection to use connection pooling</code><br>✅ <code>Remove deprecated API v1 endpoints</code>"},
      {title:"Why this matters for your career",body:"Six months from now, <code>git log</code> is your only record of why changes were made. Clean messages make debugging possible. Messy messages waste everyone's time. <strong>In interviews, employers check your GitHub commit history</strong> — it shows whether you communicate clearly and work professionally."}
    ]},
    {label:"Viewing history and differences",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">After committing, you need to review what happened. <code>git log</code> shows commit history, <code>git diff</code> shows what changed, and <code>git show</code> inspects a specific commit:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Full commit history (newest first)</span>
<span class="hl">git log</span>
<span class="cmt"># Shows: hash, author, date, message for each commit</span>

<span class="cmt"># Compact one-line-per-commit view</span>
<span class="hl">git log</span> --oneline
<span class="cmt"># Output: a1b2c3d Add user auth</span>
<span class="cmt">#         e4f5g6h Initial commit</span>

<span class="cmt"># Visual branch graph (very useful later)</span>
<span class="hl">git log</span> --oneline --graph --all

<span class="cmt"># Inspect a specific commit in detail</span>
<span class="hl">git show</span> HEAD
<span class="cmt"># Shows the full diff of the most recent commit</span>

<span class="cmt"># See unstaged changes (what you changed but haven't added)</span>
<span class="hl">git diff</span>

<span class="cmt"># See staged changes (what will go into the next commit)</span>
<span class="hl">git diff</span> --staged`}},
    {label:"The complete basic workflow",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>The daily workflow you'll repeat thousands of times:</strong><br><br>1. Edit files in your working directory<br>2. <code>git status</code> — see what changed<br>3. <code>git add .</code> — stage your changes (or <code>git add -p</code> for precision)<br>4. <code>git diff --staged</code> — review what you're about to commit<br>5. <code>git commit -m "Clear message"</code> — save the snapshot<br>6. <code>git log --oneline</code> — confirm it worked<br><br>This cycle becomes second nature. Every professional developer does this dozens of times per day.</div></div>`}
  ],
  challenges:[
    {q:"Type the command to initialise a new Git repository in the current directory.",scenario:"You have a project folder with code in it. You want Git to start tracking it.",hint:"Two words. The second word is short for 'initialise'.",answer:"Answer: git init — Creates a .git/ directory in the current folder. From this point Git tracks all changes. Your existing files are not modified.",accept:["git init","git init ."],feedback:"git init creates the .git directory inside the current folder. From this point on, Git tracks all changes. Your existing files are not modified — Git just starts watching for changes."},
    {q:"Type the command to stage ALL changes in the current directory for the next commit.",scenario:"You've edited 4 files and want to include all of them in one commit.",hint:"'git add' followed by a symbol that means 'everything here' — just one character.",answer:"Answer: git add . — The dot means 'everything in the current directory and below'. You can also use git add -A which includes deletions across the entire working tree.",accept:["git add .","git add -a","git add -a ","git add --all","git add -a","git add -A"],feedback:"git add . stages all new and modified files in the current directory and subdirectories. git add -A also stages deletions across the whole working tree. Both are commonly used."},
    {q:"Type the command to commit your staged changes with the message 'Add homepage'.",scenario:"You have staged files ready. Write the exact commit command.",hint:"Use the -m flag followed by your message in quotes.",answer:"Answer: git commit -m \"Add homepage\" — The -m flag lets you write the commit message inline. Without it, Git opens your configured text editor for a longer message.",accept:["git commit -m \"add homepage\"","git commit -m 'add homepage'","git commit -m add homepage"],feedback:"git commit -m allows you to provide the commit message inline. Without -m, Git opens your configured editor so you can write a longer multi-line message. Use imperative mood: 'Add' not 'Added'."},
    {q:"Type the command to see a compact one-line-per-commit view of the entire history.",scenario:"You want a quick overview of all the commits in this repo without the full metadata.",hint:"It's 'git log' with a flag that condenses output to one line per commit.",answer:"Answer: git log --oneline — Shows each commit condensed to one line: short hash + message. Combine with --graph --all for a visual branch diagram.",accept:["git log --oneline","git log --oneline "],feedback:"git log --oneline shows each commit as a single line: short hash + message. This is the most common way to quickly browse history. Add --graph --all to see branch structure visually."}
  ]
}
);