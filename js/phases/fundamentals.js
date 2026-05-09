// GitCoven — Fundamentals — Phases 1-4
// This file contains phases 1-4

phases.push(
{
  title:"What is Version Control?",sub:"The problem Git solves, and why it won",
  sections:[
    {label:"The problem without version control",cards:[
      {title:"Folder hell",body:"Without version control, developers end up with <code>project_v1</code>, <code>project_v2_final</code>, <code>project_FINAL_REAL</code>. No way to see what changed, who changed it, or why."},
      {title:"Team chaos",body:"When multiple people work on the same file, the last person to save wins — everyone else's work is gone. There is no record of who deleted what."},
      {title:"No safety net",body:"Deleted a critical function by accident? Without version control, it's gone forever. There's no undo that spans across save sessions. Production goes down and nobody can recover the old version quickly."}
    ]},
    {label:"Version Control Systems (VCS)",cards:[
      {title:"Local VCS (1970s–80s)",body:"Stored patches on disk. Only local. One person at a time. Examples: RCS. Think of it as a diary that only one person can write in."},
      {title:"Centralized VCS (1990s–2000s)",body:"One central server. Single point of failure — if server goes down, nobody works. Examples: CVS, SVN, Perforce. Like a shared Google Doc where Google going down locks everyone out."},
      {title:"Distributed VCS (2005–present)",body:"Every developer has a full copy of the entire repo history. No single point of failure. Work offline. Examples: Git, Mercurial. Everyone has the complete backup on their own machine."}
    ]},
    {label:"Why Git won",cards:[
      {title:"Born from necessity",body:"In 2005, Linus Torvalds built Git in two weeks after a dispute with BitKeeper. Requirements: fast, fully distributed, strong support for non-linear development, able to handle the Linux kernel (thousands of contributors)."},
      {title:"Git's dominance today",body:"Over 90% of all software projects use Git. Every major platform — GitHub, GitLab, Bitbucket — is built on it. Knowing Git is non-negotiable for a developer."},
      {title:"Speed and efficiency",body:"Git is blazingly fast because nearly all operations are local — no network needed. Branching and merging happen in milliseconds. The content-addressable storage using SHA-1 hashes means Git never stores duplicate data."}
    ]},
    {label:"Core concepts",cards:[
      {title:"Repository (repo)",body:"A directory whose history Git tracks. Contains your files plus a hidden <code>.git</code> folder storing the entire history."},
      {title:"Commit",body:"A permanent snapshot of your files at a specific point in time. Like a save point in a game — you can always return to it."},
      {title:"Branch",body:"An independent line of development. Work on features in isolation without affecting the main codebase."},
      {title:"Remote",body:"A copy of your repository hosted elsewhere (GitHub, GitLab). Used for collaboration and backup."}
    ]},
    {label:"Real-world impact",content:`<div class="info"><div class="callout-icon">💡</div><div>In 2012, Knight Capital Group lost $440 million in 45 minutes due to a deployment error — old code was deployed to production servers. Proper version control with tagging and rollback procedures could have prevented this. Version control isn't optional — it's as fundamental as compiling your code.</div></div>`}
  ],
  challenges:[
    {q:"In a distributed VCS like Git, what does every developer have on their local machine?",scenario:"You are comparing centralized VCS (like SVN) to distributed VCS (like Git). What is the key advantage?",hint:"Think about what 'distributed' means — every developer doesn't just have the latest files, they have the complete ______.",answer:"Answer: A full copy of the entire repository history. In a distributed VCS, every clone contains every commit ever made — not just the latest files. This is what allows offline work and eliminates single points of failure.",accept:["a full copy of the entire repository history","full copy of the repo","complete copy of the repository","the entire repository including all history","a complete copy of all history","full history of the repo","the full repo including history","a full copy of the repo","the complete repository","entire repo history","full copy of the entire repo","a complete copy of the repository","the whole repository and its history","every version of every file","the full repository"],keywords:["full|complete|entire","copy|clone|replica","history|repository|repo"],feedback:"In a distributed VCS, every developer has a complete copy of the entire repository including all its history. If Git is not installed, you get an error instead."},
    {q:"What is the name of the hidden directory Git creates inside every repository to store its database?",scenario:"You ran git init in a folder. A new directory was silently created. Name it exactly (include the dot).",hint:"It starts with a period (making it hidden on Unix/macOS) and shares its name with the tool itself.",answer:"Answer: .git — This hidden folder is Git\'s entire database. It stores all commits, branches, config, and object data. If you delete it, you lose all history.",accept:[".git",".git/"],feedback:"The .git directory is Git's entire database — commits, branches, config, hooks, objects. Never manually delete or edit files inside it."},
    {q:"What type of VCS gives every developer a complete copy of the entire repository history on their local machine?",scenario:"You're explaining Git's architecture to a junior developer. Name the category of VCS that Git belongs to.",hint:"Three generations of VCS: local, centralized, and ________. Git belongs to the newest.",answer:"Answer: Distributed. The three generations are local → centralized → distributed. Git and Mercurial are distributed — every developer has the full repo, not just a checkout from a central server.",accept:["distributed","distributed vcs","distributed version control","distributed version control system"],keywords:["distribut"],feedback:"Distributed VCS means every developer has the full history. This allows offline work, no single point of failure, and faster operations since most commands don't need a network."}
  ]
},
{
  title:"Installation & Configuration",sub:"Getting Git ready, setting your identity",
  sections:[
    {label:"Install Git",codeblock:{lang:"bash",code:`<span class="cmt"># macOS</span>
<span class="hl">brew</span> install git

<span class="cmt"># Ubuntu / Debian</span>
sudo apt-get install git

<span class="cmt"># Windows — download from git-scm.com/download/win</span>
<span class="cmt"># Or use: winget install --id Git.Git -e --source winget</span>

<span class="cmt"># Verify</span>
<span class="hl">git</span> --version`}},
    {label:"First-time configuration",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:12px">Git stamps your name and email on every commit. Without this, Git refuses to commit. This isn't about authentication — it's about attribution. Every commit carries the author's name and email permanently.</p>`,codeblock:{lang:"bash",code:`<span class="hl">git config</span> --global user.name <span class="str">"Your Name"</span>
<span class="hl">git config</span> --global user.email <span class="str">"you@example.com"</span>
<span class="hl">git config</span> --global core.editor <span class="str">"code --wait"</span>
<span class="hl">git config</span> --global init.defaultBranch main
<span class="hl">git config</span> --list    <span class="cmt"># view all settings</span>`}},
    {label:"Configuration scopes",cards:[
      {title:"--system",body:"Every user on this computer. Stored in <code>/etc/gitconfig</code>. Requires admin rights. Rarely modified — typically used by IT departments for org-wide defaults."},
      {title:"--global",body:"All repos for the current user. Stored in <code>~/.gitconfig</code>. This is what you use most. Set once, applies everywhere."},
      {title:"--local (default)",body:"Only the current repo. Stored in <code>.git/config</code>. Overrides global and system. Useful for different emails on work vs personal repos."}
    ]},
    {label:"Useful aliases",codeblock:{lang:"bash",code:`<span class="hl">git config</span> --global alias.st status
<span class="hl">git config</span> --global alias.lg <span class="str">"log --oneline --graph --all --decorate"</span>
<span class="hl">git config</span> --global alias.undo <span class="str">"reset --soft HEAD~1"</span>`}},
    {label:"Common pitfall",content:`<div class="danger"><div class="callout-icon">⚠️</div><div>Your Git email should match the email on your GitHub/GitLab account. If they don't match, your commits won't link to your profile — they'll show up as a generic user and your contribution graph stays empty. Verify with <code>git config user.email</code>.</div></div>`}
  ],
  challenges:[
    {q:"Type the exact command to set your global Git username to 'Ada Lovelace'.",scenario:"You just installed Git on a new machine. This is the first configuration command you must run.",hint:"The command starts with 'git config' and needs the scope flag for all repos on your account.",answer:"Answer: git config --global user.name \"Ada Lovelace\" — The --global flag writes to ~/.gitconfig so it applies to all repos on your machine. Without quotes, multi-word names break.",accept:["git config --global user.name \"ada lovelace\"","git config --global user.name 'ada lovelace'","git config --global user.name ada lovelace"],feedback:"git config --global user.name sets the author name attached to every future commit on this machine. Use quotes around names with spaces."},
    {q:"Type the command to view all your current Git configuration settings.",scenario:"You want to confirm your name and email are correctly saved before making your first commit.",hint:"It's a git config command with a flag that shows everything — think 'list' all settings.",answer:"Answer: git config --list — This shows every setting from all three scopes (system, global, local) merged together. You can also use the shorthand git config -l.",accept:["git config --list","git config --list ","git config -l"],feedback:"git config --list shows all config values from system, global, and local scopes combined. You can also open ~/.gitconfig directly with any text editor."},
    {q:"Which scope flag do you use to make a config setting apply to ALL repositories for your user account?",scenario:"You want your email to apply everywhere, not just in the current folder.",hint:"Three scopes: --system (everyone), ______ (your user), --local (this repo only).",answer:"Answer: --global — The three scopes are --system (all users), --global (your user account, all repos), and --local (current repo only). Global is stored in ~/.gitconfig.",accept:["--global","-global","global","the --global flag","the global flag"],feedback:"--global saves the setting to ~/.gitconfig which applies to all repositories owned by your user account. It's the right scope for identity settings like name and email."}
  ]
},
{
  title:"The Three Git Areas",sub:"Working directory, staging area, and repository",
  sections:[
    {label:"The core mental model",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:16px">This is the single most important concept in Git. Everything else depends on understanding these three areas.</p>
<div class="diagram"><div class="diagram-flex">
<div class="d-node orange"><div class="d-label">Where you work</div><div class="d-name">Working Directory</div><div class="d-cmd">files on disk</div></div>
<div class="d-arrow-v"><div class="d-arrow">→</div><div style="font-size:10px;color:var(--accent-blue);font-family:'JetBrains Mono',monospace">git add</div></div>
<div class="d-node accent"><div class="d-label">Prepared changes</div><div class="d-name">Staging Area</div><div class="d-cmd">the index</div></div>
<div class="d-arrow-v"><div class="d-arrow">→</div><div style="font-size:10px;color:var(--accent-blue);font-family:'JetBrains Mono',monospace">git commit</div></div>
<div class="d-node blue"><div class="d-label">Permanent history</div><div class="d-name">Repository</div><div class="d-cmd">.git/objects</div></div>
</div></div>`},
    {label:"Area explanations",cards:[
      {title:"1. Working Directory",body:"The actual files on your hard drive. This is where you edit code. Git sees these changes but has not saved them. Like your kitchen counter — where you prepare."},
      {title:"2. Staging Area (Index)",body:"An intermediate area where you prepare your next commit. You choose exactly which changes go in. Internally, it's a binary file called <code>.git/index</code>."},
      {title:"3. Repository (.git directory)",body:"The permanent database of all your commits. Stored inside the hidden <code>.git</code> folder. Like the recipe book — every dish recorded forever."}
    ]},
    {label:"Why the staging area exists",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:12px">Many newcomers find the staging area pointless — 'why not just commit directly?' The staging area lets you craft <strong style="color:var(--text0)">precise commits</strong>. You might have edited 5 files, but only 3 belong together logically. Stage those 3, commit them, then stage and commit the other 2 separately. Clean history = easier debugging later.</p>`},
    {label:"File states",cards:[
      {title:"Untracked",body:"A new file Git has never seen. Won't be included in commits until you <code>git add</code> it."},
      {title:"Modified (Unstaged)",body:"A tracked file that's been changed in the working directory but not yet staged."},
      {title:"Staged",body:"A file (or specific changes within it) added to the staging area with <code>git add</code>. Will be included in the next commit."},
      {title:"Committed (Unmodified)",body:"File in working dir matches the latest committed version. Nothing to do."}
    ]},
    {label:"Granular staging",codeblock:{lang:"bash",code:`<span class="cmt"># Stage only PART of a file's changes</span>
<span class="hl">git add</span> -p filename.js
<span class="cmt"># y = stage this chunk</span>
<span class="cmt"># n = skip this chunk</span>
<span class="cmt"># s = split into smaller chunks</span>`}}
  ],
  challenges:[
    {q:"You staged a file by mistake. Type the exact command to move it back OUT of the staging area without losing your changes.",scenario:"You ran git add secrets.env accidentally. You need to unstage it before committing.",hint:"You want to 'restore' the file from the staged state. There's a flag that targets the staging area specifically.",answer:"Answer: git restore --staged secrets.env — The --staged flag targets the index/staging area specifically, moving the file back to \'modified but unstaged\' without losing your changes.",accept:["git restore --staged secrets.env","git restore --staged","git reset head secrets.env","git reset head -- secrets.env"],feedback:"git restore --staged removes the file from the index (staging area) but leaves your changes intact in the working directory. The older syntax is git reset HEAD filename."},
    {q:"Name all three Git areas in order, separated by commas.",scenario:"Describe the path a change travels from your keyboard to a permanent commit.",hint:"Start from where you edit code → where you prepare changes → where they're stored permanently.",answer:"Answer: Working directory, staging area, repository. Changes flow: you edit files (working directory) → git add (staging area) → git commit (repository). The staging area is also called the \'index\'.",accept:["working directory, staging area, repository","working directory, staging area, repo","working directory,staging area,repository","working dir, staging area, repository","working directory, index, repository","working directory, the index, repository","working directory staging area repository","working tree, staging area, repository","working directory, stage, repository","working dir, index, repo","workspace, staging area, repository","working directory, staging, repository"],keywords:["working","staging|index","repository|repo"],feedback:"Changes move: Working Directory (you edit) → Staging Area / Index (git add) → Repository (git commit). Understanding this flow makes every other Git concept make sense."},
    {q:"What flag do you add to git add to interactively choose which specific chunks of a file to stage?",scenario:"You changed 5 things in app.js but only want to stage 2 of them in this commit.",hint:"The flag stands for 'patch' — a single letter. It lets you review each hunk individually.",answer:"Answer: -p (or --patch). This flag opens an interactive mode showing each change \'hunk\' and lets you choose y/n/s/q for each one. It\'s how you craft precise, atomic commits.",accept:["-p","--patch","-p flag","--patch flag"],feedback:"git add -p (or --patch) opens an interactive mode that shows each change 'hunk' and lets you choose y (yes), n (no), s (split), or q (quit). Extremely useful for crafting clean, atomic commits."}
  ]
},
{
  title:"Basic Workflow: init, add, commit",sub:"Creating repos and making your first commits",
  sections:[
    {label:"Starting a repository",codeblock:{lang:"bash",code:`<span class="cmt"># Turn an existing folder into a Git repo</span>
<span class="hl">git init</span>
<span class="cmt"># Creates .git/ — Git now tracks this folder</span>

<span class="cmt"># Create AND init a new folder in one step</span>
<span class="hl">git init</span> my-project`}},
    {label:"git status",codeblock:{lang:"bash",code:`<span class="hl">git status</span>           <span class="cmt"># full output</span>
<span class="hl">git status</span> -s        <span class="cmt"># short format</span>
<span class="cmt"># ?? = untracked</span>
<span class="cmt"># A  = staged new file</span>
<span class="cmt">#  M = modified unstaged</span>
<span class="cmt"># M  = modified staged</span>`}},
    {label:"git add",codeblock:{lang:"bash",code:`<span class="hl">git add</span> README.md          <span class="cmt"># one file</span>
<span class="hl">git add</span> src/               <span class="cmt"># entire directory</span>
<span class="hl">git add</span> .                  <span class="cmt"># all changes</span>
<span class="hl">git add</span> -p                 <span class="cmt"># interactive chunks</span>
<span class="hl">git add</span> -A                 <span class="cmt"># everything incl. deletions</span>`}},
    {label:"git commit",codeblock:{lang:"bash",code:`<span class="hl">git commit</span> -m <span class="str">"Add user auth"</span>  <span class="cmt"># inline message</span>
<span class="hl">git commit</span>                    <span class="cmt"># opens editor</span>
<span class="hl">git commit</span> -am <span class="str">"Fix typo"</span>    <span class="cmt"># stage tracked + commit</span>`}},
    {label:"Writing great commit messages",cards:[
      {title:"The rules",body:"Use imperative mood: 'Fix bug' not 'Fixed bug'. Keep subject under 50 chars. No period at end. Explain <em>what</em> and <em>why</em> in the body, not <em>how</em>."},
      {title:"Good vs bad",body:"❌ <code>fixed stuff</code> &nbsp; ❌ <code>WIP</code> &nbsp; ❌ <code>asdf</code><br>✅ <code>Add password reset via email</code><br>✅ <code>Fix null pointer in user login</code>"},
      {title:"Why this matters",body:"Six months from now, <code>git log</code> is your only record of why changes were made. A good message saves you hours of archaeology. Every professional codebase enforces commit message standards."}
    ]},
    {label:"git log & git diff",codeblock:{lang:"bash",code:`<span class="hl">git log</span>                    <span class="cmt"># full history</span>
<span class="hl">git log</span> --oneline          <span class="cmt"># compact</span>
<span class="hl">git log</span> --oneline --graph --all
<span class="hl">git show</span> HEAD              <span class="cmt"># inspect latest commit</span>
<span class="hl">git diff</span>                   <span class="cmt"># unstaged changes</span>
<span class="hl">git diff</span> --staged          <span class="cmt"># staged changes</span>`}},
    {label:"Pro tip: the -am shortcut",content:`<div class="info"><div class="callout-icon">💡</div><div><code>git commit -am "message"</code> combines staging and committing in one step — but only for files Git already tracks. New (untracked) files still need a separate <code>git add</code> first. Popular for quick fixes but doesn't replace deliberate staging.</div></div>`}
  ],
  challenges:[
    {q:"Type the command to initialise a new Git repository in the current directory.",scenario:"You have a project folder with code in it. You want Git to start tracking it.",hint:"Two words. The second word is short for 'initialise'.",answer:"Answer: git init — Creates a .git/ directory in the current folder. From this point Git tracks all changes. Your existing files are not modified.",accept:["git init","git init ."],feedback:"git init creates the .git directory inside the current folder. From this point on, Git tracks all changes in this directory. It does not affect your existing files."},
    {q:"Type the command to stage ALL changes in the current directory for the next commit.",scenario:"You've edited 4 files and want to include all of them in one commit.",hint:"'git add' followed by a symbol that means 'everything here' — just one character.",answer:"Answer: git add . — The dot means \'everything in the current directory and below\'. You can also use git add -A which includes deletions across the entire working tree.",accept:["git add .","git add -a","git add -a ","git add --all","git add -a","git add -A"],feedback:"git add . stages all new and modified files in the current directory and subdirectories. git add -A also includes deletions across the whole working tree."},
    {q:"Type the command to commit your staged changes with the message 'Add homepage'.",scenario:"You have staged files ready. Write the exact commit command.",hint:"Use the -m flag followed by your message in quotes.",answer:"Answer: git commit -m \"Add homepage\" — The -m flag lets you write the commit message inline. Without it, Git opens your configured text editor for a longer message.",accept:["git commit -m \"add homepage\"","git commit -m 'add homepage'","git commit -m add homepage"],feedback:"git commit -m allows you to provide the commit message inline. Without -m, Git opens your configured editor so you can write a longer multi-line message."},
    {q:"Type the command to see a compact one-line-per-commit view of the entire history.",scenario:"You want a quick overview of all the commits in this repo without the full metadata.",hint:"It's 'git log' with a flag that condenses output to one line per commit.",answer:"Answer: git log --oneline — Shows each commit condensed to one line: short hash + message. Combine with --graph --all for a visual branch diagram.",accept:["git log --oneline","git log --oneline "],feedback:"git log --oneline shows each commit as: HASH Message. Combine with --graph --all for a visual branch diagram."}
  ]
}
);