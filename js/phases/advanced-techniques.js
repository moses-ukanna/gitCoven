// GitCoven — Advanced Techniques — Phases 10-14
// This file contains phases 10-14

phases.push(
{
  title:"Rebasing",sub:"Rewriting history for a cleaner timeline",
  sections:[
    {label:"Rebase vs merge",cards:[
      {title:"Merge — preserves history",body:"Creates a merge commit. Shows exactly when branches diverged and integrated. History is accurate but can look complex."},
      {title:"Rebase — linearises history",body:"Replays your commits on top of another branch. History appears linear and clean. Commit hashes change (history is rewritten)."}
    ]},
    {label:"Rebase diagram",content:`<div class="diagram"><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text1);line-height:2.2">
<div style="color:var(--text3)">Before (feature branched at B):</div>
<div>main:    A ─── B ─── C ─── D</div>
<div>feature:         └── E ─── F ← HEAD</div>
<div style="margin-top:8px;color:var(--text3)">After: git switch feature && git rebase main</div>
<div>main:    A ─── B ─── C ─── D</div>
<div>feature:                   └── <span style="color:var(--accent)">E' ─── F'</span> ← HEAD</div>
<div style="margin-top:4px;font-size:11px;color:var(--text3)">E' and F' are new commits with same changes but new hashes</div>
</div></div>`},
    {label:"Basic rebase",codeblock:{lang:"bash",code:`<span class="hl">git switch</span> feature-login
<span class="hl">git rebase</span> main           <span class="cmt"># reapply commits on top of main</span>
<span class="cmt"># If conflict: resolve → git add → git rebase --continue</span>
<span class="hl">git rebase</span> --abort        <span class="cmt"># bail out entirely</span>

<span class="cmt"># Then merge back (will be fast-forward)</span>
<span class="hl">git switch</span> main
<span class="hl">git merge</span> feature-login</span>`}},
    {label:"Interactive rebase",codeblock:{lang:"bash",code:`<span class="hl">git rebase</span> -i HEAD~4      <span class="cmt"># edit last 4 commits</span>
<span class="cmt"># Commands in the editor:</span>
<span class="hl">pick</span>   = keep as-is
<span class="hl2">reword</span> = keep, change message
<span class="hl3">edit</span>   = pause to amend
<span class="hl">squash</span> = combine with previous (merge messages)
<span class="hl">fixup</span>  = combine with previous (discard message)
<span class="err">drop</span>   = delete this commit`}},
    {label:"Golden rule",content:`<div class="danger"><div class="callout-icon">⚠️</div><div>Never rebase commits that have been pushed to a shared remote. Rebasing rewrites hashes — if teammates have pulled those commits, their history diverges and causes chaos. Only rebase local, un-pushed feature branches.</div></div>`},
    {label:"When to rebase vs merge",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>Use rebase</strong> to keep your feature branch up-to-date with main before opening a PR — gives a clean, linear history that's easy to review. <strong>Use merge</strong> to bring a feature branch into main (especially with <code>--no-ff</code>) to preserve a clear record of when features landed. Many teams rebase locally, merge publicly. The combination gives you the best of both worlds: clean feature branches and accurate merge history on main.</div></div>`}
  ],
  challenges:[
    {q:"You are on 'feature-x'. Type the command to rebase it onto 'main'.",scenario:"Your feature branch is 10 commits behind main. You want to replay your work on top of main's latest state.",hint:"You're already on feature-x. The command is simply 'git rebase' followed by the target branch name.",answer:"Answer: git rebase main — Since you\'re already on feature-x, this replays your feature commits on top of main\'s latest commit, giving you a linear history. Never rebase commits that have been pushed to shared branches.",accept:["git rebase main","git rebase main "],feedback:"git rebase main replays all commits on your current branch on top of main's latest commit. Your commits get new hashes. Any conflicts must be resolved one commit at a time using git rebase --continue."},
    {q:"Type the command to open an interactive rebase session to edit the last 5 commits.",scenario:"You have 5 WIP commits you want to squash into a single clean commit before opening a PR.",hint:"Use the -i flag (for interactive) with HEAD~5 to specify the range.",answer:"Answer: git rebase -i HEAD~5 — The -i flag opens an interactive editor showing the last 5 commits. You can reorder, squash, edit, or drop commits. Each line starts with a command: pick, squash, edit, drop, etc.",accept:["git rebase -i head~5","git rebase -i HEAD~5","git rebase --interactive HEAD~5","git rebase --interactive head~5"],feedback:"git rebase -i HEAD~5 opens your editor showing the last 5 commits with 'pick' in front of each. Change 'pick' to 'squash' or 'fixup' on the ones you want to combine into the first."},
    {q:"During a rebase, a conflict occurs. After resolving the conflict in the file and staging it, what command continues the rebase?",scenario:"You resolved the conflict in app.js and ran git add app.js. What comes next?",hint:"After resolving and staging, you tell rebase to proceed with a '--continue' flag.",answer:"Answer: git rebase --continue — After resolving a conflict and staging the fix with git add, this tells Git to proceed with replaying the remaining commits. Use git rebase --abort to cancel entirely.",accept:["git rebase --continue","git rebase --continue "],feedback:"git rebase --continue tells Git to proceed to the next commit in the rebase sequence. If another conflict occurs, resolve it and continue again. If you want to abandon everything, run git rebase --abort."}
  ]
},
{
  title:"Advanced Git Commands",sub:"cherry-pick, bisect, blame, reflog",
  sections:[
    {label:"git cherry-pick",codeblock:{lang:"bash",code:`<span class="cmt"># Apply a specific commit to the current branch</span>
<span class="hl">git cherry-pick</span> a1b2c3d
<span class="hl">git cherry-pick</span> a1b2c3d..f4g5h6i  <span class="cmt"># range</span>
<span class="hl">git cherry-pick</span> --no-commit a1b2c3d  <span class="cmt"># apply without committing</span>
<span class="hl">git cherry-pick</span> --abort`}},
    {label:"git bisect — find the bug",codeblock:{lang:"bash",code:`<span class="hl">git bisect start</span>
<span class="hl">git bisect bad</span>               <span class="cmt"># current = has the bug</span>
<span class="hl">git bisect good</span> v1.0.0       <span class="cmt"># this tag = was fine</span>
<span class="cmt"># Git checks out midpoint. Test, then:</span>
<span class="hl">git bisect good</span>              <span class="cmt"># or: git bisect bad</span>
<span class="cmt"># Repeat until: "first bad commit is..."</span>
<span class="hl">git bisect reset</span>             <span class="cmt"># return to HEAD</span>
<span class="cmt"># Automate with a test script:</span>
<span class="hl">git bisect run</span> npm test`}},
    {label:"git blame & git grep",codeblock:{lang:"bash",code:`<span class="hl">git blame</span> app.js             <span class="cmt"># who changed each line</span>
<span class="hl">git blame</span> -L 10,25 app.js   <span class="cmt"># specific line range</span>
<span class="hl">git grep</span> <span class="str">"TODO"</span>             <span class="cmt"># search all tracked files</span>
<span class="hl">git log</span> -S <span class="str">"functionName"</span>  <span class="cmt"># find when string was added/removed</span>
<span class="hl">git shortlog</span> -sn            <span class="cmt"># commit count per author</span>`}}
  ],
  challenges:[
    {q:"A critical bug fix was made on 'feature-urgent' with hash 'f9e8d7c'. You need it on 'main' NOW without merging the whole branch. Type the exact command.",scenario:"The feature branch isn't ready, but one specific commit on it fixes a production crash.",hint:"There's a command that copies a single commit by its hash. Think 'pick one cherry off the tree'.",answer:"Answer: git cherry-pick f9e8d7c — This copies that single commit onto your current branch without merging the entire feature branch. The new commit gets a different hash but contains the same changes.",accept:["git cherry-pick f9e8d7c","git cherry-pick f9e8d7c "],feedback:"git cherry-pick applies a specific commit's changes to your current branch as a new commit. The new commit has a different hash but the same code changes. Perfect for hotfixes or backporting."},
    {q:"Type the first three commands of a bisect session, in order separated by newlines. Mark the current commit as bad and tag 'v2.0' as the last known good commit.",scenario:"A bug exists now that didn't exist at v2.0. You need to find which commit introduced it.",hint:"Start the session, mark the current commit as bad, then mark the known-good point. Three separate commands.",answer:"Answer: git bisect start, git bisect bad, git bisect good v2.0 — Bisect uses binary search across your commit history to find the exact commit that introduced a bug. You mark endpoints and Git narrows it down.",accept:["git bisect start\ngit bisect bad\ngit bisect good v2.0","git bisect start\ngit bisect bad \ngit bisect good v2.0"],feedback:"The three-command bisect start sequence: (1) git bisect start to begin, (2) git bisect bad to mark current as broken, (3) git bisect good TAG to mark the last known-good point. Git then binary searches between them."},
    {q:"Type the command to search all tracked files in the current repository for the string 'API_KEY'.",scenario:"You suspect a secret was accidentally committed somewhere in the codebase.",hint:"Git has its own search tool built in — 'git grep' followed by the search string.",answer:"Answer: git grep \"console.log\" — Much faster than regular grep because it only searches Git-tracked files. Add -i for case-insensitive, --count for file-level counts, -n for line numbers.",accept:["git grep \"api_key\"","git grep 'api_key'","git grep api_key","git grep \"API_KEY\"","git grep 'API_KEY'","git grep API_KEY"],feedback:"git grep searches the contents of all tracked files — much faster than a regular grep because it only searches files Git knows about. Use it to find TODOs, secrets, function names, or any string across the whole codebase."}
  ]
},
{
  title:"Tags & Releases",sub:"Marking versions and creating release points",
  sections:[
    {label:"What are tags?",cards:[
      {title:"Tags mark release points",body:"A tag is like a branch that never moves. A permanent label on a specific commit. Used for release versions: <code>v1.0.0</code>, <code>v2.1.3</code>."},
      {title:"Semantic Versioning",body:"<code>MAJOR.MINOR.PATCH</code> — major for breaking changes, minor for new features, patch for bug fixes. Example: <code>v2.1.3</code>."}
    ]},
    {label:"Tag commands",codeblock:{lang:"bash",code:`<span class="cmt">── CREATING ──────────────────────────────────────</span>
<span class="hl">git tag</span> v1.0.0                       <span class="cmt"># lightweight</span>
<span class="hl">git tag</span> -a v1.0.0 -m <span class="str">"Release 1.0"</span>  <span class="cmt"># annotated (preferred)</span>
<span class="hl">git tag</span> -a v0.9.0 -m <span class="str">"Beta"</span> a1b2c3d  <span class="cmt"># tag past commit</span>
<span class="cmt">── LISTING / INSPECTING ──────────────────────────</span>
<span class="hl">git tag</span>                              <span class="cmt"># list all</span>
<span class="hl">git show</span> v1.0.0                      <span class="cmt"># inspect tag</span>
<span class="hl">git describe</span>                         <span class="cmt"># nearest tag + offset</span>
<span class="cmt">── PUSHING / DELETING ────────────────────────────</span>
<span class="hl">git push</span> origin v1.0.0              <span class="cmt"># push one tag</span>
<span class="hl">git push</span> origin --tags              <span class="cmt"># push all tags</span>
<span class="hl">git tag</span> -d v1.0.0                   <span class="cmt"># delete local</span>
<span class="hl">git push</span> origin --delete v1.0.0    <span class="cmt"># delete remote</span>`}}
  ],
  challenges:[
    {q:"Type the command to create an annotated tag called 'v3.0.0' with the message 'Major rewrite'.",scenario:"You just finished a major version of your software and want to permanently mark this commit.",hint:"Use 'git tag' with -a for annotated and -m for the message, just like commits.",answer:"Answer: git tag -a v3.0.0 -m \"Release 3.0.0\" — The -a flag creates an annotated tag (stores author, date, message). The -m flag adds the message inline, just like git commit -m.",accept:["git tag -a v3.0.0 -m \"major rewrite\"","git tag -a v3.0.0 -m 'major rewrite'","git tag --annotate v3.0.0 -m \"major rewrite\"","git tag --annotate v3.0.0 -m 'major rewrite'"],feedback:"Annotated tags (-a) are stored as full Git objects with tagger name, date, and message. They can also be signed with GPG. Lightweight tags (without -a -m) are just pointers with no extra metadata — not suitable for public releases."},
    {q:"Type the command to push ALL local tags to the 'origin' remote.",scenario:"You've created 3 tags locally and want them all to appear on GitHub.",hint:"Regular git push ignores tags. You need a special flag: --tags.",answer:"Answer: git push origin --tags — Regular git push ignores tags entirely. The --tags flag pushes all local tags to the remote. Use git push origin v3.0.0 to push just one specific tag.",accept:["git push origin --tags","git push --tags","git push origin --tags "],feedback:"By default, git push does NOT push tags. You must explicitly push them with --tags (all annotated+lightweight) or --follow-tags (annotated only). Individually push a tag with git push origin v1.0.0."},
    {q:"What is the difference between a lightweight tag and an annotated tag? Answer in one sentence.",scenario:"Your team asks why you should always use annotated tags for releases.",hint:"One is just a pointer (name → hash). The other stores extra data like author, date, and message.",answer:"Answer: A lightweight tag is just a pointer to a commit (like a branch that doesn\'t move). An annotated tag is a full Git object that stores the tagger\'s name, email, date, and a message. Use annotated tags for releases.",accept:["lightweight is just a pointer to a commit, annotated stores extra metadata like author date and message","lightweight is just a commit hash, annotated has author date and message","lightweight has no metadata, annotated stores tagger name date and message","annotated tags store extra data like tagger date and message, lightweight tags are just pointers","lightweight tags are just pointers, annotated tags store metadata","lightweight is a simple pointer, annotated stores author date and message","lightweight has no extra data, annotated has author date message","annotated has metadata like author and date, lightweight does not","lightweight is just a name pointing to a commit, annotated is a full object with metadata","lightweight stores no metadata, annotated stores tagger date and message"],keywords:["lightweight","pointer|hash|just|no metadata|simple","annotated","metadata|author|date|message|tagger|extra|stores"],feedback:"Correct. Annotated tags are full Git objects with tagger name, email, date, and message. They can be signed. Lightweight tags are just a name pointing to a commit hash with no extra information."}
  ]
},
{
  title:".gitignore & Configuration",sub:"Telling Git what to ignore, and customising your setup",
  sections:[
    {label:"What .gitignore does",cards:[
      {title:"Files to never commit",body:"Compiled binaries, <code>node_modules/</code>, secrets (<code>.env</code>), editor files (<code>.idea/</code>), OS files (<code>.DS_Store</code>). The .gitignore file tells Git to pretend they don't exist."},
      {title:"Critical: already tracked files",body:"gitignore only prevents <em>untracked</em> files from being added. If a file is already committed, .gitignore does nothing. Run <code>git rm --cached filename</code> to stop tracking it."}
    ]},
    {label:"gitignore patterns",codeblock:{lang:"text",code:`*.log              <span class="cmt"># all .log files anywhere</span>
node_modules/      <span class="cmt"># entire directory</span>
.env               <span class="cmt"># exact filename</span>
dist/              <span class="cmt"># build output</span>
**/.DS_Store       <span class="cmt"># in any subdirectory</span>
*.pyc              <span class="cmt"># Python compiled</span>
*.class            <span class="cmt"># Java compiled</span>
coverage/          <span class="cmt"># test coverage</span>
!important.log     <span class="cmt"># un-ignore a specific file</span>`}},
    {label:"Stop tracking a committed file",codeblock:{lang:"bash",code:`<span class="cmt"># Remove from tracking WITHOUT deleting from disk</span>
<span class="hl">git rm</span> --cached .env
<span class="hl">git commit</span> -m <span class="str">"Remove .env from tracking"</span>
<span class="cmt"># Now add .env to .gitignore</span>
<span class="cmt"># Check if a file is ignored:</span>
<span class="hl">git check-ignore</span> -v filename`}}
  ],
  challenges:[
    {q:"You accidentally committed 'secrets.env'. Type the command to stop Git from tracking it WITHOUT deleting the file from your disk.",scenario:"The file must stay on your machine for your app to work, but it must never appear in the repo again.",hint:"Use 'git rm' but with a flag that only removes from the index/tracking, not from disk.",answer:"Answer: git rm --cached secrets.env — The --cached flag removes the file from Git\'s index (tracking) but leaves it on disk. Then add it to .gitignore so Git ignores it going forward.",accept:["git rm --cached secrets.env","git rm --cached secrets.env "],feedback:"git rm --cached removes the file from Git's index (tracking) but leaves it on disk. After this, add secrets.env to your .gitignore and commit. Note: the file still exists in your old commits — for true removal use git filter-branch or BFG Repo Cleaner."},
    {q:"What single pattern would you add to .gitignore to ignore ALL files with a .log extension anywhere in the project?",scenario:"Your app generates log files in various subdirectories. You want all of them ignored.",hint:"Use a wildcard pattern: *.extension — the asterisk matches any filename.",answer:"Answer: *.log — The asterisk is a wildcard matching any filename. Add this line to your .gitignore file. Patterns in .gitignore apply to the directory it\'s in and all subdirectories.",accept:["*.log"],feedback:"*.log matches any file ending in .log in any directory. The ** prefix is not needed here — a pattern without a slash matches anywhere in the tree. Use **/*.log if you specifically want to match in subdirectories only."},
    {q:"You want to ignore all .txt files but keep one specific file called 'IMPORTANT.txt'. Write the two .gitignore lines needed, separated by a newline.",scenario:"You need a rule to block .txt files but an exception for one specific file.",hint:"First line ignores all .txt. Second line uses ! prefix to negate the ignore for one specific file.",answer:"Answer: First line: *.txt (ignore all .txt). Second line: !IMPORTANT.txt (negate the ignore for this one file). The ! prefix means \'except this\'. Write them on separate lines in .gitignore.",accept:["*.txt\n!important.txt","*.txt\n!IMPORTANT.txt","*.txt\n! important.txt","*.txt\n!./important.txt"],keywords:["*.txt","!"],feedback:"The ! prefix negates a pattern. Git processes .gitignore top-to-bottom: *.txt ignores all .txt files, then !IMPORTANT.txt un-ignores that one specific file. The negation must come AFTER the ignore rule."}
  ]
},
{
  title:"Git Workflows",sub:"GitFlow, GitHub Flow, and Trunk-Based Development",
  sections:[
    {label:"Why workflows matter",cards:[
      {title:"Social contracts",body:"Git is flexible — it lets you do almost anything. But a team without an agreed workflow creates chaos. Workflows are rules everyone follows so the shared history stays clean and deployable."}
    ]},
    {label:"1. Git Flow",cards:[
      {title:"5 branch types",body:"<code>main</code> — production only. <code>develop</code> — integration. <code>feature/*</code> — new features from develop. <code>release/*</code> — release prep. <code>hotfix/*</code> — urgent fixes from main, merged to both main and develop."},
      {title:"Best for",body:"Versioned software with scheduled releases. Libraries, mobile apps, enterprise software where multiple versions are in production."}
    ]},
    {label:"2. GitHub Flow",cards:[
      {title:"6-step cycle",body:"Branch from main → Commit → Push → Open PR → Review → Merge to main → Deploy. That's it. Only two types: main and feature branches."},
      {title:"Best for",body:"Continuous deployment. Web apps, SaaS, APIs. Most startups. Teams that deploy multiple times per day."}
    ]},
    {label:"3. Trunk-Based Development",cards:[
      {title:"Everyone integrates daily",body:"All developers commit to main (the trunk) at least once a day. Feature flags hide incomplete work. No long-lived branches. Requires strong automated testing."},
      {title:"Best for",body:"Large orgs with robust CI/CD (Google, Meta, Netflix). Not beginner-friendly. Requires high test coverage."}
    ]},
    {label:"Conventional Commits",codeblock:{lang:"text",code:`<span class="hl">feat</span>: add dark mode toggle
<span class="hl">fix</span>(auth): resolve JWT expiry bug
<span class="hl">docs</span>: update API reference
<span class="hl">refactor</span>: extract payment service
<span class="hl">test</span>: add coverage for login flow
<span class="hl">chore</span>: update dependencies
<span class="hl">feat!</span>: redesign auth API   <span class="cmt"># ! = breaking change</span>`}}
  ],
  challenges:[
    {q:"In GitHub Flow, what is the ONLY long-lived branch that always reflects production-ready code?",scenario:"Your team wants to adopt GitHub Flow. What is the one sacred branch you never commit to directly?",hint:"In GitHub Flow, there's just one permanent branch that's always deployable. What's the default branch name?",answer:"Answer: main. In GitHub Flow, main is the only permanent branch and must always be deployable. All work happens on short-lived feature branches that merge back into main via pull requests.",accept:["main","master","the main branch"],feedback:"In GitHub Flow, main is the only permanent branch and it must always be deployable. All work happens in short-lived feature branches that are merged to main via Pull Request. After merge, deploy immediately."},
    {q:"What Conventional Commits type prefix do you use for a commit that adds a completely new feature?",scenario:"You just built a new search feature. What prefix goes at the start of your commit message?",hint:"The prefix for new functionality is a 4-letter word that abbreviates 'feature'.",answer:"Answer: feat — Conventional Commits uses prefixes like feat: (new feature), fix: (bug fix), docs:, refactor:, test:, chore:. Example: feat: add user authentication. This enables automatic changelogs.",accept:["feat","feat:","feature"],feedback:"feat: is for new features. fix: for bug fixes, docs: for documentation, refactor: for code restructuring with no behaviour change, chore: for maintenance tasks. feat! or adding BREAKING CHANGE in the body signals a breaking API change."},
    {q:"In Git Flow, if you need to make an urgent fix to the production code, what type of branch do you create and where do you branch it FROM?",scenario:"The production site is down. You need to fix it immediately without going through the develop branch.",hint:"The branch type for emergency fixes has a specific name and it's always branched from the production branch.",answer:"Answer: A hotfix branch from main. In Git Flow, hotfix branches are created directly from main (production), the fix is applied, then merged back into both main and develop. This bypasses the normal feature → develop → release flow.",accept:["hotfix branch from main","a hotfix branch from main","hotfix from main","create a hotfix branch from main","hotfix branched from main","hotfix from the main branch","hotfix, branched from main","a hotfix from main","you create a hotfix branch from main","hotfix branch, from main"],keywords:["hotfix","main|master|production"],feedback:"In Git Flow, hotfix/* branches are always branched FROM main (the production branch), never from develop. After the fix, the hotfix branch is merged into BOTH main (to fix production) and develop (to keep it in sync)."}
  ]
}
);