// GitCoven — Advanced Techniques — Phases 10-14
// This file contains phases 10-14

phases.push(
{
  title:"Rebasing",sub:"Rewriting history for a cleaner timeline",
  sections:[
    {label:"What is rebasing?",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Rebasing is an alternative to merging that replays your commits on top of another branch, creating a clean, linear history. Instead of a merge commit that says 'these two histories were combined', rebasing makes it look like you wrote your code on top of the latest main from the start. Many professional teams require rebasing before merging pull requests.</p>`},
    {label:"Rebase vs merge",cards:[
      {title:"Merge — preserves true history",body:"Creates a merge commit with two parents. Shows exactly when branches diverged and were integrated. History is accurate but can look messy with many merge commits. Your commit hashes stay the same."},
      {title:"Rebase — clean linear history",body:"Replays your commits one by one on top of the target branch. History appears perfectly linear and easy to read. <strong>Commit hashes change</strong> because the parent commit is different. History is rewritten — the original branch point disappears."}
    ]},
    {label:"Visualising rebase",content:`<div class="diagram"><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text1);line-height:2.2">
<div style="color:var(--text3)">Before rebase (feature branched from B, main has moved on):</div>
<div>main:    A ─── B ─── C ─── D</div>
<div>feature:         └── E ─── F ← HEAD</div>
<div style="margin-top:10px;color:var(--text3)">After: git switch feature && git rebase main</div>
<div>main:    A ─── B ─── C ─── D</div>
<div>feature:                     └── <span style="color:var(--accent)">E' ─── F'</span> ← HEAD</div>
<div style="margin-top:4px;font-size:11px;color:var(--text3)">E' and F' have the same code changes but new hashes (new parents)</div>
<div style="font-size:11px;color:var(--text3)">Now merging feature into main will be a clean fast-forward</div>
</div></div>`},
    {label:"Basic rebase workflow",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">The most common use: keeping your feature branch up to date with main before opening a pull request. This gives reviewers a clean, linear diff to read:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Step 1: Switch to your feature branch</span>
<span class="hl">git switch</span> feature-login

<span class="cmt"># Step 2: Rebase onto main (replay your commits on top of main)</span>
<span class="hl">git rebase</span> main

<span class="cmt"># If a conflict occurs during replay:</span>
<span class="cmt"># 1. Resolve the conflict in the file</span>
<span class="cmt"># 2. Stage the resolution</span>
<span class="hl">git add</span> conflicted-file.js
<span class="cmt"># 3. Continue replaying remaining commits</span>
<span class="hl">git rebase</span> --continue

<span class="cmt"># If it's too messy, abort and go back to before the rebase</span>
<span class="hl">git rebase</span> --abort

<span class="cmt"># Step 3: After rebase, merge into main (will be fast-forward)</span>
<span class="hl">git switch</span> main
<span class="hl">git merge</span> feature-login`}},
    {label:"Interactive rebase — editing history",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Interactive rebase (<code>-i</code>) opens your editor with a list of recent commits and lets you reorder, squash, edit, or delete them. This is how you clean up messy WIP commits before sharing your work:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Open interactive rebase for the last 4 commits</span>
<span class="hl">git rebase</span> -i HEAD~4
<span class="cmt"># Your editor opens with something like:</span>
<span class="cmt"># pick a1b2c3d Add login form</span>
<span class="cmt"># pick d4e5f6a Fix typo in login</span>
<span class="cmt"># pick g7h8i9j Add validation</span>
<span class="cmt"># pick k0l1m2n Fix another typo</span>`},cards:[
      {title:"Interactive rebase commands",body:"<code>pick</code> = keep the commit as-is (default)<br><code>reword</code> = keep the commit but change its message<br><code>edit</code> = pause at this commit so you can amend it<br><code>squash</code> = combine with the previous commit, merge both messages<br><code>fixup</code> = combine with the previous commit, discard this message<br><code>drop</code> = delete this commit entirely"},
      {title:"Common use: squash WIP commits",body:"Change <code>pick</code> to <code>squash</code> (or <code>s</code>) on commits you want to combine. The first commit stays as <code>pick</code>, and all <code>squash</code> commits below it get merged into it. This turns 5 messy WIP commits into 1 clean commit before you open a PR."}
    ]},
    {label:"The golden rule of rebasing",content:`<div class="danger"><div class="callout-icon">⚠️</div><div><strong>Never rebase commits that have been pushed to a shared remote.</strong> Rebasing rewrites commit hashes. If teammates have already pulled those commits, their history will diverge from yours, causing major problems. Only rebase <strong>local, unpushed</strong> feature branches. If you've already pushed, use <code>git merge</code> instead.</div></div>`},
    {label:"When to use each",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>Professional pattern — rebase locally, merge publicly:</strong><br><br>• <strong>Rebase</strong> your feature branch onto main regularly to keep it current (before pushing or before a PR)<br>• <strong>Merge</strong> (with <code>--no-ff</code>) when integrating a feature branch into main to preserve a record of when the feature landed<br><br>This gives you clean feature branches AND accurate merge history on main. Most professional teams use this combination. <strong>Interview tip:</strong> 'When do you rebase vs merge?' is a common question — this answer shows deep understanding.</div></div>`}
  ],
  challenges:[
    {q:"You are on 'feature-x'. Type the command to rebase it onto 'main'.",scenario:"Your feature branch is 10 commits behind main. You want to replay your work on top of main's latest state.",hint:"You're already on feature-x. The command is simply 'git rebase' followed by the target branch name.",answer:"Answer: git rebase main — Since you're already on feature-x, this replays your feature commits on top of main's latest commit, giving you a linear history. Never rebase commits that have been pushed to shared branches.",accept:["git rebase main","git rebase main "],feedback:"git rebase main replays all commits on your current branch on top of main's latest commit. Your commits get new hashes. Any conflicts must be resolved one commit at a time, then continue with git rebase --continue."},
    {q:"Type the command to open an interactive rebase session to edit the last 5 commits.",scenario:"You have 5 WIP commits you want to squash into a single clean commit before opening a PR.",hint:"Use the -i flag (for interactive) with HEAD~5 to specify the range.",answer:"Answer: git rebase -i HEAD~5 — The -i flag opens an interactive editor showing the last 5 commits. You can reorder, squash, edit, or drop commits. Each line starts with a command: pick, squash, edit, drop, etc.",accept:["git rebase -i head~5","git rebase -i HEAD~5","git rebase --interactive HEAD~5","git rebase --interactive head~5"],feedback:"git rebase -i HEAD~5 opens your editor with the last 5 commits. Change 'pick' to 'squash', 'fixup', 'reword', 'edit', or 'drop' to reshape your history. This is the standard way to clean up commits before a PR."},
    {q:"During a rebase, a conflict occurs. After resolving the conflict in the file and staging it, what command continues the rebase?",scenario:"You resolved the conflict in app.js and ran git add app.js. What comes next?",hint:"After resolving and staging, you tell rebase to proceed with a '--continue' flag.",answer:"Answer: git rebase --continue — After resolving a conflict and staging the fix with git add, this tells Git to proceed with replaying the remaining commits. Use git rebase --abort to cancel entirely.",accept:["git rebase --continue","git rebase --continue "],feedback:"git rebase --continue tells Git to proceed to the next commit in the rebase sequence. If another conflict occurs, resolve and continue again. Use git rebase --abort to cancel everything and return to the pre-rebase state."}
  ]
},
{
  title:"Advanced Git Commands",sub:"cherry-pick, bisect, blame, grep",
  sections:[
    {label:"git cherry-pick — copy a single commit",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Cherry-pick copies a specific commit from one branch to another without merging the entire branch. This is essential for hotfixes: a bug fix exists on a feature branch, but the feature isn't ready to merge — cherry-pick just the fix.</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Copy a specific commit (by hash) to your current branch</span>
<span class="hl">git cherry-pick</span> f9e8d7c
<span class="cmt"># Creates a NEW commit on your branch with the same changes</span>
<span class="cmt"># but a different hash (different parent)</span>

<span class="cmt"># Cherry-pick multiple commits</span>
<span class="hl">git cherry-pick</span> a1b2c3d e4f5g6h

<span class="cmt"># Cherry-pick a range of commits</span>
<span class="hl">git cherry-pick</span> a1b2c3d..f4g5h6i

<span class="cmt"># Apply changes without committing (stage only)</span>
<span class="hl">git cherry-pick</span> --no-commit a1b2c3d

<span class="cmt"># If there's a conflict, resolve then:</span>
<span class="hl">git cherry-pick</span> --continue
<span class="cmt"># Or cancel:</span>
<span class="hl">git cherry-pick</span> --abort`},cards:[
      {title:"When to use cherry-pick",body:"Hotfixes that need to go to production immediately. Backporting a fix to an older release branch. Pulling a single useful commit from a branch that isn't ready to merge. <strong>Don't overuse it</strong> — if you're cherry-picking many commits, you should probably just merge the branch."}
    ]},
    {label:"git bisect — binary search for bugs",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git bisect</code> uses binary search to find the exact commit that introduced a bug. You tell Git 'this commit is bad' and 'that old commit was good', and Git systematically narrows down the culprit by checking out midpoints for you to test. With 1000 commits, it finds the bug in ~10 steps.</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Step 1: Start the bisect session</span>
<span class="hl">git bisect start</span>

<span class="cmt"># Step 2: Mark the current commit as broken (has the bug)</span>
<span class="hl">git bisect bad</span>

<span class="cmt"># Step 3: Mark a known-good commit or tag (bug didn't exist here)</span>
<span class="hl">git bisect good</span> v2.0

<span class="cmt"># Git checks out a commit halfway between good and bad.</span>
<span class="cmt"># Test your app. Then tell Git the result:</span>
<span class="hl">git bisect good</span>   <span class="cmt"># if this midpoint works fine</span>
<span class="hl">git bisect bad</span>    <span class="cmt"># if this midpoint has the bug</span>

<span class="cmt"># Repeat until Git says: "first bad commit is abc1234"</span>

<span class="cmt"># Step 4: End the session and return to your branch</span>
<span class="hl">git bisect reset</span>

<span class="cmt"># PRO: Automate with a test script (no manual testing needed)</span>
<span class="hl">git bisect run</span> npm test
<span class="cmt"># Git runs your test suite at each midpoint automatically</span>`},cards:[
      {title:"When to use bisect",body:"A bug appeared but you don't know which commit caused it. The codebase has hundreds or thousands of commits since the last known-good state. Manual searching would take hours — bisect finds it in minutes. <strong>This is an interview-impressive skill</strong> that many developers don't know about."}
    ]},
    {label:"git blame — who changed each line",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git blame</code> shows who last modified each line of a file, when they did it, and in which commit. Despite the accusatory name, it's used for understanding code history — finding out who to ask about a piece of code, or tracing when a line was introduced.</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># See who last modified each line of a file</span>
<span class="hl">git blame</span> app.js
<span class="cmt"># Output per line: HASH (Author  Date) line content</span>
<span class="cmt"># a1b2c3d (Alice 2024-03-15)  function login() {</span>

<span class="cmt"># Blame a specific range of lines (e.g. lines 10-25)</span>
<span class="hl">git blame</span> -L 10,25 app.js

<span class="cmt"># Show the email instead of the name</span>
<span class="hl">git blame</span> -e app.js`}},
    {label:"git grep — search across all tracked files",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git grep</code> searches the contents of every tracked file in your repository. It's much faster than regular <code>grep</code> because it only searches files Git knows about (skipping node_modules, build output, etc.).</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Search all tracked files for a string</span>
<span class="hl">git grep</span> <span class="str">"API_KEY"</span>
<span class="cmt"># Shows: filename:line_number:matching_line</span>

<span class="cmt"># Case-insensitive search</span>
<span class="hl">git grep</span> -i <span class="str">"api_key"</span>

<span class="cmt"># Show line numbers</span>
<span class="hl">git grep</span> -n <span class="str">"TODO"</span>

<span class="cmt"># Count matches per file (no content shown)</span>
<span class="hl">git grep</span> --count <span class="str">"console.log"</span>

<span class="cmt"># Search in a specific commit or branch</span>
<span class="hl">git grep</span> <span class="str">"bug"</span> HEAD~10`},cards:[
      {title:"git grep vs git log -S",body:"<code>git grep</code> searches the current content of files — 'where does this string exist right now?' <code>git log -S</code> (the 'pickaxe') searches commit history — 'which commit added or removed this string?' Use grep for current state, log -S for historical investigation."}
    ]},
    {label:"git shortlog — commit statistics",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Useful for seeing who contributed how much to a project:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Count commits per author, sorted by count</span>
<span class="hl">git shortlog</span> -sn
<span class="cmt">#  142  Alice</span>
<span class="cmt">#   98  Bob</span>
<span class="cmt">#   45  Charlie</span>`}},
    {label:"In the workplace",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>These commands set you apart.</strong> Most junior developers only know add, commit, push, pull. Knowing cherry-pick (for hotfixes), bisect (for debugging), blame (for code archaeology), and grep (for codebase search) makes you visibly more productive. In an interview, mentioning git bisect shows you understand how to debug systematically at scale.</div></div>`}
  ],
  challenges:[
    {q:"A critical bug fix was made on 'feature-urgent' with hash 'f9e8d7c'. You need it on 'main' NOW without merging the whole branch. Type the exact command.",scenario:"The feature branch isn't ready to merge, but one specific commit on it fixes a production crash.",hint:"There's a command that copies a single commit by its hash. Think 'pick one cherry off the tree'.",answer:"Answer: git cherry-pick f9e8d7c — This copies that single commit onto your current branch without merging the entire feature branch. The new commit gets a different hash but contains the same changes.",accept:["git cherry-pick f9e8d7c","git cherry-pick f9e8d7c "],feedback:"git cherry-pick applies a specific commit's changes to your current branch as a new commit. The new commit has a different hash but the same code changes. Essential for production hotfixes and backporting."},
    {q:"Type the first three commands of a bisect session, in order separated by newlines. Mark the current commit as bad and tag 'v2.0' as the last known good commit.",scenario:"A bug exists now that didn't exist at v2.0. You need to find which commit introduced it.",hint:"Start the session, mark the current commit as bad, then mark the known-good point. Three separate commands.",answer:"Answer: git bisect start, git bisect bad, git bisect good v2.0 — Bisect uses binary search across your commit history to find the exact commit that introduced a bug. You mark endpoints and Git narrows it down.",accept:["git bisect start\ngit bisect bad\ngit bisect good v2.0","git bisect start\ngit bisect bad \ngit bisect good v2.0"],feedback:"The three-command bisect start sequence: (1) git bisect start to begin, (2) git bisect bad to mark current as broken, (3) git bisect good v2.0 to mark the last known-good point. Git then binary searches between them."},
    {q:"Type the command to search all tracked files in the current repository for the string 'API_KEY'.",scenario:"You suspect a secret was accidentally committed somewhere in the codebase.",hint:"Git has its own search tool built in — 'git grep' followed by the search string.",answer:"Answer: git grep \"API_KEY\" — Searches every tracked file for the string. Much faster than regular grep because it skips untracked files like node_modules. Add -i for case-insensitive, -n for line numbers.",accept:["git grep \"api_key\"","git grep 'api_key'","git grep api_key","git grep \"API_KEY\"","git grep 'API_KEY'","git grep API_KEY"],feedback:"git grep searches the contents of all tracked files — much faster than regular grep because it skips untracked files. Essential for finding secrets, TODOs, function names, or any string across the whole codebase."}
  ]
},
{
  title:"Tags & Releases",sub:"Marking versions and creating release points",
  sections:[
    {label:"What are tags?",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">A tag is a permanent label attached to a specific commit. Unlike branches (which move forward with each new commit), tags are fixed — they always point to the same commit. Tags are used to mark <strong>release versions</strong> (<code>v1.0.0</code>, <code>v2.1.3</code>), deployment points, and other milestones.</p>`,cards:[
      {title:"Two types of tags",body:"<strong>Lightweight tags:</strong> Just a name pointing to a commit hash. No metadata. Like a Post-it note on a commit. <strong>Annotated tags:</strong> Full Git objects with the tagger's name, email, date, and a message. Can be GPG-signed for verification. <strong>Always use annotated tags for releases.</strong>"},
      {title:"Semantic Versioning (SemVer)",body:"The standard for version numbers: <code>MAJOR.MINOR.PATCH</code>. <strong>MAJOR</strong> = breaking changes (users must update their code). <strong>MINOR</strong> = new features (backwards-compatible). <strong>PATCH</strong> = bug fixes only. Example: <code>v2.1.3</code> means major version 2, minor version 1, patch 3."}
    ]},
    {label:"Creating tags",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">You create tags on the current commit (HEAD) by default, or on any past commit by specifying its hash:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Create a lightweight tag (just a pointer, no metadata)</span>
<span class="hl">git tag</span> v1.0.0

<span class="cmt"># Create an annotated tag (recommended for releases)</span>
<span class="hl">git tag</span> -a v1.0.0 -m <span class="str">"Release 1.0.0 — initial stable release"</span>
<span class="cmt"># -a = annotated (stores author, date, message)</span>
<span class="cmt"># -m = tag message (like commit -m)</span>

<span class="cmt"># Tag a past commit (not the current HEAD)</span>
<span class="hl">git tag</span> -a v0.9.0 -m <span class="str">"Beta release"</span> a1b2c3d`}},
    {label:"Listing and inspecting tags",codeblock:{lang:"bash",code:`<span class="cmt"># List all tags</span>
<span class="hl">git tag</span>

<span class="cmt"># List tags matching a pattern</span>
<span class="hl">git tag</span> -l <span class="str">"v2.*"</span>

<span class="cmt"># Show full details of an annotated tag</span>
<span class="hl">git show</span> v1.0.0
<span class="cmt"># Shows: tagger, date, message, and the commit diff</span>

<span class="cmt"># Show the nearest tag and how many commits you are past it</span>
<span class="hl">git describe</span>
<span class="cmt"># Output: v1.0.0-14-ga1b2c3d (14 commits past v1.0.0)</span>`}},
    {label:"Pushing and deleting tags",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><strong>Important:</strong> <code>git push</code> does NOT push tags automatically. You must push them explicitly. This catches many people off guard:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Push a single tag to the remote</span>
<span class="hl">git push</span> origin v1.0.0

<span class="cmt"># Push ALL tags at once</span>
<span class="hl">git push</span> origin --tags

<span class="cmt"># Delete a tag locally</span>
<span class="hl">git tag</span> -d v1.0.0

<span class="cmt"># Delete a tag from the remote</span>
<span class="hl">git push</span> origin --delete v1.0.0`}},
    {label:"In the workplace",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>Tags power your deployment pipeline.</strong> In many companies, deployments are triggered by tags — pushing <code>v2.1.0</code> automatically starts the build and deploy process via CI/CD. GitHub Releases are built on top of Git tags, letting you attach changelogs and binary downloads to each version. Understanding tags is essential for any developer who ships software.</div></div>`}
  ],
  challenges:[
    {q:"Type the command to create an annotated tag called 'v3.0.0' with the message 'Major rewrite'.",scenario:"You just finished a major version of your software and want to permanently mark this commit.",hint:"Use 'git tag' with -a for annotated and -m for the message, just like commits.",answer:"Answer: git tag -a v3.0.0 -m \"Major rewrite\" — The -a flag creates an annotated tag (stores author, date, message). The -m flag adds the message inline, just like git commit -m.",accept:["git tag -a v3.0.0 -m \"major rewrite\"","git tag -a v3.0.0 -m 'major rewrite'","git tag --annotate v3.0.0 -m \"major rewrite\"","git tag --annotate v3.0.0 -m 'major rewrite'"],feedback:"Annotated tags (-a) store the tagger's name, email, date, and message — making them suitable for public releases. Lightweight tags (without -a) are just pointers with no metadata. Always use annotated tags for version releases."},
    {q:"Type the command to push ALL local tags to the 'origin' remote.",scenario:"You've created 3 tags locally and want them all to appear on GitHub.",hint:"Regular git push ignores tags. You need a special flag: --tags.",answer:"Answer: git push origin --tags — Regular git push ignores tags entirely. The --tags flag pushes all local tags to the remote. Use git push origin v3.0.0 to push just one specific tag.",accept:["git push origin --tags","git push --tags","git push origin --tags "],feedback:"By default, git push does NOT push tags. You must explicitly push them with --tags (all tags) or push individually with git push origin v1.0.0. This is a common gotcha for developers new to releases."},
    {q:"What is the difference between a lightweight tag and an annotated tag? Answer in one sentence.",scenario:"Your team asks why you should always use annotated tags for releases.",hint:"One is just a pointer (name → hash). The other stores extra data like author, date, and message.",answer:"Answer: A lightweight tag is just a pointer to a commit (like a branch that doesn't move). An annotated tag is a full Git object that stores the tagger's name, email, date, and a message. Use annotated tags for releases.",accept:["lightweight is just a pointer to a commit, annotated stores extra metadata like author date and message","lightweight is just a commit hash, annotated has author date and message","lightweight has no metadata, annotated stores tagger name date and message","annotated tags store extra data like tagger date and message, lightweight tags are just pointers","lightweight tags are just pointers, annotated tags store metadata","lightweight is a simple pointer, annotated stores author date and message","lightweight has no extra data, annotated has author date message","annotated has metadata like author and date, lightweight does not","lightweight is just a name pointing to a commit, annotated is a full object with metadata","lightweight stores no metadata, annotated stores tagger date and message"],feedback:"Annotated tags are full Git objects with tagger name, email, date, and message. They can be GPG-signed for verification. Lightweight tags are just a name pointing to a commit hash — no extra information. Always use annotated for releases."}
  ]
},
{
  title:".gitignore & Configuration",sub:"Telling Git what to ignore, and customising your setup",
  sections:[
    {label:"Why .gitignore matters",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Not every file in your project directory belongs in Git. Compiled binaries, dependency folders, secret keys, editor settings, and OS-generated files should never be committed. The <code>.gitignore</code> file tells Git which files and directories to pretend don't exist.</p>`,cards:[
      {title:"Files you should always ignore",body:"<code>node_modules/</code> — dependencies (installed via npm install)<br><code>.env</code> — secrets, API keys, database passwords<br><code>dist/</code> or <code>build/</code> — compiled output<br><code>.DS_Store</code> — macOS metadata<br><code>Thumbs.db</code> — Windows thumbnail cache<br><code>*.log</code> — log files<br><code>.idea/</code> / <code>.vscode/</code> — editor settings<br><code>*.pyc</code> / <code>__pycache__/</code> — Python compiled files"},
      {title:"Critical: .gitignore only affects untracked files",body:".gitignore <strong>only prevents new files</strong> from being tracked. If a file is already committed, adding it to .gitignore does nothing — Git continues tracking it. To stop tracking an already-committed file, you must first run <code>git rm --cached filename</code>, then add it to .gitignore, then commit."}
    ]},
    {label:".gitignore pattern syntax",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Each line in <code>.gitignore</code> is a pattern. Git processes lines top-to-bottom. Later rules override earlier ones. Here are the patterns you need to know:</p>`,codeblock:{lang:"text",code:`<span class="cmt"># Lines starting with # are comments</span>

<span class="cmt"># Ignore a specific file</span>
.env
secrets.json

<span class="cmt"># Ignore an entire directory (trailing slash)</span>
node_modules/
dist/
coverage/

<span class="cmt"># Wildcard — ignore ALL files with this extension</span>
*.log
*.pyc
*.class

<span class="cmt"># Double star — match in any subdirectory</span>
**/.DS_Store

<span class="cmt"># Negate a pattern — UN-IGNORE a specific file</span>
<span class="cmt"># (must come AFTER the ignore rule)</span>
*.log
!important.log
<span class="cmt"># Result: all .log files ignored EXCEPT important.log</span>

<span class="cmt"># Ignore files in a specific directory only</span>
/build/
<span class="cmt"># Leading slash means "only in the repo root"</span>`},cards:[
      {title:"Pattern rules summary",body:"<code>*</code> matches any number of characters (except /)<br><code>**</code> matches any number of directories<br><code>?</code> matches exactly one character<br><code>/</code> at the start = root directory only<br><code>/</code> at the end = directory only<br><code>!</code> at the start = negate (un-ignore this file)"}
    ]},
    {label:"Stop tracking an already-committed file",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">If you accidentally committed a file that should be ignored (e.g. <code>.env</code>), adding it to .gitignore won't help — Git already tracks it. You need to remove it from Git's index first:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Remove from Git tracking WITHOUT deleting from your disk</span>
<span class="hl">git rm</span> --cached .env
<span class="cmt"># --cached means "remove from the index only, keep the file"</span>

<span class="cmt"># Then add it to .gitignore</span>
echo ".env" >> .gitignore

<span class="cmt"># Commit both changes</span>
<span class="hl">git commit</span> -m <span class="str">"Remove .env from tracking, add to gitignore"</span>

<span class="cmt"># Check whether a file is currently being ignored</span>
<span class="hl">git check-ignore</span> -v filename`}},
    {label:"Global gitignore",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">You can create a global .gitignore that applies to all repos on your machine — useful for OS and editor files that should never be committed anywhere:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Create a global gitignore file</span>
<span class="hl">git config</span> --global core.excludesFile ~/.gitignore_global

<span class="cmt"># Add OS/editor patterns to it</span>
<span class="cmt"># ~/.gitignore_global:</span>
<span class="cmt"># .DS_Store</span>
<span class="cmt"># Thumbs.db</span>
<span class="cmt"># .idea/</span>
<span class="cmt"># *.swp</span>`}},
    {label:"In the workplace",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>First thing in any new project:</strong> set up <code>.gitignore</code> before your first commit. Visit <a href="https://gitignore.io" style="color:var(--accent-blue)">gitignore.io</a> or GitHub's gitignore templates to generate one for your tech stack. Committing <code>node_modules/</code> or <code>.env</code> to a public repo is one of the most common and embarrassing mistakes new developers make. A leaked API key can cost a company thousands of dollars in minutes.</div></div>`}
  ],
  challenges:[
    {q:"You accidentally committed 'secrets.env'. Type the command to stop Git from tracking it WITHOUT deleting the file from your disk.",scenario:"The file must stay on your machine for your app to work, but it must never appear in the repo again.",hint:"Use 'git rm' but with a flag that only removes from the index/tracking, not from disk.",answer:"Answer: git rm --cached secrets.env — The --cached flag removes the file from Git's index (tracking) but leaves it on disk. Then add it to .gitignore so Git ignores it going forward.",accept:["git rm --cached secrets.env","git rm --cached secrets.env "],feedback:"git rm --cached removes the file from Git's index (tracking) but leaves it on disk. After this, add secrets.env to your .gitignore and commit. Note: the file still exists in old commits — for true removal from history, use BFG Repo Cleaner."},
    {q:"What single pattern would you add to .gitignore to ignore ALL files with a .log extension anywhere in the project?",scenario:"Your app generates log files in various subdirectories. You want all of them ignored.",hint:"Use a wildcard pattern: *.extension — the asterisk matches any filename.",answer:"Answer: *.log — The asterisk is a wildcard matching any filename. Add this line to your .gitignore file. Patterns without a slash match anywhere in the project tree.",accept:["*.log"],feedback:"*.log matches any file ending in .log in any directory. A pattern without a slash matches across the entire project tree. This is the most common way to ignore files by extension."},
    {q:"You want to ignore all .txt files but keep one specific file called 'IMPORTANT.txt'. Write the two .gitignore lines needed, separated by a newline.",scenario:"You need a rule to block .txt files but an exception for one specific file.",hint:"First line ignores all .txt. Second line uses ! prefix to negate the ignore for one specific file.",answer:"Answer: First line: *.txt (ignore all .txt). Second line: !IMPORTANT.txt (negate the ignore for this one file). The ! prefix means 'except this'. Write them on separate lines in .gitignore.",accept:["*.txt\n!important.txt","*.txt\n!IMPORTANT.txt","*.txt\n! important.txt","*.txt\n!./important.txt"],feedback:"The ! prefix negates a pattern. Git processes .gitignore top-to-bottom: *.txt ignores all .txt files, then !IMPORTANT.txt un-ignores that one specific file. The negation must come AFTER the ignore rule to work."}
  ]
},
{
  title:"Git Workflows",sub:"GitFlow, GitHub Flow, and Trunk-Based Development",
  sections:[
    {label:"Why your team needs a workflow",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Git is extremely flexible — it lets you do almost anything with branches, merges, and history. But without agreed rules, a team creates chaos: conflicting branch strategies, messy history, broken deployments. A <strong>workflow</strong> is a social contract that everyone follows so the shared codebase stays clean and deployable. Every company uses one of these three approaches.</p>`},
    {label:"1. Git Flow",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">The most structured workflow, designed for software with scheduled release cycles (mobile apps, desktop software, libraries):</p>`,cards:[
      {title:"The five branch types",body:"<code>main</code> — production code only. Every commit is a release.<br><code>develop</code> — integration branch. Features merge here first.<br><code>feature/*</code> — branched from develop, merged back to develop.<br><code>release/*</code> — branched from develop for release prep (bug fixes, version bumps). Merged to both main and develop.<br><code>hotfix/*</code> — branched from main for urgent production fixes. Merged to both main and develop."},
      {title:"Best for",body:"Versioned software with scheduled releases. Libraries, mobile apps, enterprise software. Teams that maintain multiple versions in production simultaneously. <strong>Not recommended</strong> for web apps with continuous deployment — too much overhead."}
    ]},
    {label:"2. GitHub Flow",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">The simplest workflow, used by most web development teams and startups. Only two branch types exist:</p>`,cards:[
      {title:"The six-step cycle",body:"1. <code>git switch -c feature/my-task</code> — branch from main<br>2. Commit your work in small, focused commits<br>3. <code>git push -u origin feature/my-task</code> — push to remote<br>4. Open a Pull Request on GitHub<br>5. Team reviews, discusses, requests changes<br>6. Merge to main → deploy immediately<br><br><strong>Main is always deployable.</strong> Everything goes through pull requests. No develop branch, no release branches."},
      {title:"Best for",body:"Continuous deployment. Web apps, SaaS, APIs. Most startups and modern development teams. Teams that deploy multiple times per day. <strong>This is the workflow you should learn first</strong> — it's the most widely used."}
    ]},
    {label:"3. Trunk-Based Development",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">The most advanced workflow, used by large engineering organisations with mature CI/CD pipelines:</p>`,cards:[
      {title:"Everyone integrates daily",body:"All developers commit to <code>main</code> (the 'trunk') at least once per day. Feature branches exist but live for hours, not days. Incomplete features are hidden behind <strong>feature flags</strong> (code switches that turn features on/off without deploying new code)."},
      {title:"Best for",body:"Large organisations with robust CI/CD and high test coverage (Google, Meta, Netflix). Requires automated testing, feature flags, and a culture of continuous integration. Not beginner-friendly — a broken commit to trunk affects everyone immediately."}
    ]},
    {label:"Conventional Commits",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">A commit message standard used by many professional teams. Each commit starts with a type prefix that categorises the change. This enables automated changelogs, semantic versioning, and consistent history:</p>`,codeblock:{lang:"text",code:`<span class="hl">feat</span>: add dark mode toggle           <span class="cmt"># new feature</span>
<span class="hl">fix</span>(auth): resolve JWT expiry bug      <span class="cmt"># bug fix (with scope)</span>
<span class="hl">docs</span>: update API reference             <span class="cmt"># documentation only</span>
<span class="hl">refactor</span>: extract payment service      <span class="cmt"># code restructuring, no behaviour change</span>
<span class="hl">test</span>: add coverage for login flow      <span class="cmt"># adding or fixing tests</span>
<span class="hl">chore</span>: update dependencies             <span class="cmt"># maintenance, tooling</span>
<span class="hl">style</span>: fix indentation in utils.js     <span class="cmt"># formatting, no logic change</span>
<span class="hl">perf</span>: optimise image loading            <span class="cmt"># performance improvement</span>
<span class="hl">ci</span>: add GitHub Actions pipeline        <span class="cmt"># CI/CD configuration</span>
<span class="hl">feat!</span>: redesign auth API                <span class="cmt"># ! = BREAKING CHANGE</span>`},cards:[
      {title:"Why use Conventional Commits",body:"Tools like <code>standard-version</code> and <code>semantic-release</code> can automatically generate changelogs and version bumps from your commit history. A <code>feat</code> commit bumps the minor version, a <code>fix</code> bumps the patch version, and a <code>!</code> or <code>BREAKING CHANGE</code> bumps the major version — all automatically."}
    ]},
    {label:"In the workplace",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>Interview tip:</strong> 'What Git workflow does your team use?' is a common interview question — both for you to ask AND to answer. Most web teams use GitHub Flow. Enterprise teams may use Git Flow. Knowing the trade-offs of each shows maturity: GitHub Flow is simpler but requires main to always be deployable; Git Flow supports parallel release tracks but has more overhead. Being able to discuss this intelligently sets you apart from developers who just know the commands.</div></div>`}
  ],
  challenges:[
    {q:"In GitHub Flow, what is the ONLY long-lived branch that always reflects production-ready code?",scenario:"Your team wants to adopt GitHub Flow. What is the one sacred branch you never commit to directly?",hint:"In GitHub Flow, there's just one permanent branch that's always deployable. What's the default branch name?",answer:"Answer: main. In GitHub Flow, main is the only permanent branch and must always be deployable. All work happens on short-lived feature branches that merge back into main via pull requests.",accept:["main","master","the main branch"],feedback:"In GitHub Flow, main is the only permanent branch and must always be deployable. All work happens on short-lived feature branches merged via Pull Requests. After merge, deploy immediately. No develop branch, no release branches."},
    {q:"What Conventional Commits type prefix do you use for a commit that adds a completely new feature?",scenario:"You just built a new search feature. What prefix goes at the start of your commit message?",hint:"The prefix for new functionality is a 4-letter word that abbreviates 'feature'.",answer:"Answer: feat — Conventional Commits uses prefixes like feat: (new feature), fix: (bug fix), docs:, refactor:, test:, chore:. Example: feat: add user authentication. This enables automatic changelogs.",accept:["feat","feat:","feature"],feedback:"feat: is for new features. fix: for bug fixes, docs: for documentation, refactor: for restructuring, chore: for maintenance. Adding ! (feat!) signals a breaking change. These prefixes enable automated versioning and changelog generation."},
    {q:"In Git Flow, if you need to make an urgent fix to the production code, what type of branch do you create and where do you branch it FROM?",scenario:"The production site is down. You need to fix it immediately without going through the develop branch.",hint:"The branch type for emergency fixes has a specific name and it's always branched from the production branch.",answer:"Answer: A hotfix branch from main. In Git Flow, hotfix branches are created directly from main (production), the fix is applied, then merged back into both main and develop. This bypasses the normal feature → develop → release flow.",accept:["hotfix branch from main","a hotfix branch from main","hotfix from main","create a hotfix branch from main","hotfix branched from main","hotfix from the main branch","hotfix, branched from main","a hotfix from main","you create a hotfix branch from main","hotfix branch, from main"],feedback:"In Git Flow, hotfix/* branches are always created FROM main (production), never from develop. After the fix, the hotfix is merged into BOTH main (to fix production immediately) and develop (to keep it in sync). This is the only branch type that bypasses the develop → release pipeline."}
  ]
}
);