// GitCoven — Recovery & Undo — Phases 8-9
// This file contains phases 8-9

phases.push(
{
  title:"Undoing Changes",sub:"restore, revert, reset, reflog — getting out of trouble",
  sections:[
    {label:"Why this matters",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Every developer makes mistakes — committing the wrong files, pushing broken code, accidentally deleting work. What separates professionals from beginners is <strong>knowing how to undo anything confidently</strong>. Git has multiple undo tools, each designed for a different situation. Choosing the wrong one can make things worse. This phase teaches you exactly which tool to reach for and when.</p>`},
    {label:"The undo toolkit — overview",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Git provides five undo tools, listed from safest to most dangerous. Each operates at a different level:</p>
<div class="diagram"><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text2);line-height:2.4">
<div><span style="color:var(--accent-orange)">git restore file</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ discard uncommitted changes in working dir (irreversible!)</div>
<div><span style="color:var(--accent-orange)">git restore --staged</span>&nbsp;&nbsp;→ unstage a file without losing changes</div>
<div><span style="color:var(--accent-blue)">git commit --amend</span>&nbsp;&nbsp;&nbsp;→ fix the LAST commit message or contents</div>
<div><span style="color:var(--accent)">git revert HEAD</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ undo a commit by creating a NEW reverse commit (safe for shared)</div>
<div><span style="color:var(--accent-red)">git reset</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ move branch pointer backward (rewrites history!)</div>
</div></div>`},
    {label:"git restore — undoing uncommitted changes",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git restore</code> works on files that have <strong>not been committed yet</strong>. It has two modes depending on where the file is — the working directory or the staging area:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># DISCARD changes in working directory</span>
<span class="cmt"># Reverts file to its last committed state</span>
<span class="cmt"># ⚠️ WARNING: This is IRREVERSIBLE — your changes are gone forever!</span>
<span class="hl">git restore</span> app.js

<span class="cmt"># Discard ALL uncommitted changes in the entire repo</span>
<span class="hl">git restore</span> .

<span class="cmt"># UNSTAGE a file (remove from staging area, keep changes in working dir)</span>
<span class="cmt"># Your work is preserved — it just won't be in the next commit</span>
<span class="hl">git restore</span> --staged app.js

<span class="cmt"># Unstage everything</span>
<span class="hl">git restore</span> --staged .`},cards:[
      {title:"When to use git restore",body:"Use <code>git restore file</code> when you've made changes you want to completely throw away — e.g. you were experimenting and want to go back to the clean committed version. Use <code>git restore --staged file</code> when you accidentally staged a file and want to unstage it without losing your edits."},
      {title:"The danger zone",body:"<code>git restore file</code> (without --staged) permanently deletes your uncommitted changes. There is no undo — they were never committed, so Git has no record of them. Always double-check with <code>git diff</code> before running this. If you're unsure, <strong>stash your changes instead</strong> (covered in the next phase)."}
    ]},
    {label:"git commit --amend — fixing the last commit",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>--amend</code> lets you modify the most recent commit — either its message, its contents, or both. It replaces the old commit with a new one (new hash), so <strong>only use this if you haven't pushed yet</strong>.</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Fix just the commit message</span>
<span class="hl">git commit</span> --amend -m <span class="str">"Corrected commit message"</span>

<span class="cmt"># Add a forgotten file to the last commit</span>
<span class="hl">git add</span> forgotten-file.js
<span class="hl">git commit</span> --amend --no-edit
<span class="cmt"># --no-edit keeps the original message unchanged</span>

<span class="cmt"># Change both the message AND add staged files</span>
<span class="hl">git add</span> another-file.js
<span class="hl">git commit</span> --amend -m <span class="str">"Updated message with extra file"</span>`},cards:[
      {title:"How --amend works internally",body:"Git doesn't actually modify the old commit (commits are immutable). Instead, it creates a brand new commit with a new hash that replaces the old one. The old commit still exists in the reflog for ~90 days but is no longer on any branch."},
      {title:"Critical rule",body:"<strong>Never amend a commit that has already been pushed to a shared branch.</strong> Your teammates have already based their work on the old commit. Amending creates a new hash, which causes their history to diverge from yours. Only amend local, unpushed commits."}
    ]},
    {label:"git revert — safe undo for shared branches",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git revert</code> undoes a commit by creating a <strong>new commit</strong> that reverses the changes. The original commit stays in history — nothing is rewritten. This makes it <strong>safe for shared branches</strong> where teammates have already pulled the code.</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Undo the most recent commit</span>
<span class="hl">git revert</span> HEAD
<span class="cmt"># Git creates a new commit: "Revert 'Add broken feature'"</span>
<span class="cmt"># The original commit remains in history — nothing is deleted</span>

<span class="cmt"># Undo a specific older commit by its hash</span>
<span class="hl">git revert</span> a1b2c3d

<span class="cmt"># Revert without auto-committing (stage the changes instead)</span>
<span class="hl">git revert</span> HEAD --no-commit
<span class="cmt"># Useful when you want to revert multiple commits into one</span>`},cards:[
      {title:"When to use revert",body:"<strong>Always use <code>git revert</code> on shared/pushed commits.</strong> It's the safe undo — teammates won't have conflicting histories. Use it when a feature is broken in production, when a bad commit was pushed, or when you need to undo something others have already pulled."},
      {title:"Revert vs reset",body:"<code>revert</code> = safe, adds a new commit, preserves history. Use on shared branches.<br><code>reset</code> = destructive, rewrites history, removes commits. Use only on local, unpushed work.<br>This is the most important distinction in Git's undo system."}
    ]},
    {label:"git reset — rewriting local history",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git reset</code> moves the branch pointer backward, effectively removing commits from the branch. It has three modes that differ in how they treat your changes. <strong>HEAD~1</strong> means 'one commit before HEAD', <strong>HEAD~3</strong> means 'three commits back', etc.</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># --soft: undo the commit, but KEEP changes staged</span>
<span class="cmt"># Use when: you committed too early and want to add more files</span>
<span class="hl">git reset</span> --soft HEAD~1

<span class="cmt"># --mixed (default): undo the commit AND unstage changes</span>
<span class="cmt"># Changes stay in your working directory as modified files</span>
<span class="cmt"># Use when: you want to redo both staging and committing</span>
<span class="hl">git reset</span> HEAD~1

<span class="cmt"># --hard: undo the commit AND DELETE all changes ⚠️</span>
<span class="cmt"># Changes are GONE from working dir, staging, and history</span>
<span class="cmt"># Use when: you want to completely wipe the last commit(s)</span>
<span class="hl">git reset</span> --hard HEAD~1`},cards:[
      {title:"Understanding HEAD~N",body:"<code>HEAD~1</code> = one commit before the current one. <code>HEAD~3</code> = three commits back. You can also use a specific commit hash: <code>git reset --soft a1b2c3d</code>. The tilde notation is relative to your current position."},
      {title:"The three modes compared",body:"<strong>--soft:</strong> Changes stay staged → ready to recommit<br><strong>--mixed:</strong> Changes go to working dir → need to re-add and recommit<br><strong>--hard:</strong> Changes are deleted → use only when you truly want to throw work away"},
      {title:"Critical safety rule",body:"<strong>Never use <code>git reset</code> on commits that have been pushed to a shared remote.</strong> It rewrites history — anyone who has pulled those commits will have a broken history. For shared commits, always use <code>git revert</code> instead."}
    ]},
    {label:"git reflog — the ultimate safety net",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git reflog</code> (reference log) records <strong>every single movement of HEAD</strong> — every commit, branch switch, reset, merge, rebase, and amend. Even commits that seem deleted by <code>git reset --hard</code> are recorded here for approximately 90 days. This is your emergency recovery tool.</p>`,codeblock:{lang:"bash",code:`<span class="hl">git reflog</span>
<span class="cmt"># Output shows every HEAD movement with a reference number:</span>
<span class="cmt"># a1b2c3d HEAD@{0}: reset: moving to HEAD~1</span>
<span class="cmt"># e4f5g6h HEAD@{1}: commit: Add payment feature  ← your "lost" commit!</span>
<span class="cmt"># f7g8h9i HEAD@{2}: commit: Update README</span>

<span class="cmt"># Recover by resetting to the lost commit</span>
<span class="hl">git reset</span> --hard HEAD@{1}

<span class="cmt"># Or create a new branch from the lost commit (safer)</span>
<span class="hl">git switch</span> -c recovered HEAD@{1}`},cards:[
      {title:"When to use reflog",body:"Run <code>git reflog</code> immediately whenever you think you've lost work — after a bad reset, a failed rebase, an accidental branch delete, or any situation where commits seem to have disappeared. The reflog almost always has what you need."},
      {title:"Reflog expiry",body:"Reflog entries expire after ~90 days by default (30 days for unreachable commits). This means you have a generous window to recover from mistakes, but don't wait months. In practice, you'll use reflog within minutes of making a mistake."}
    ]},
    {label:"Decision guide: which undo tool?",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>Choosing the right undo tool:</strong><br><br>📝 <strong>Typo in last commit message?</strong> → <code>git commit --amend -m "Fixed message"</code><br>📎 <strong>Forgot to stage a file in last commit?</strong> → <code>git add file</code> then <code>git commit --amend --no-edit</code><br>🔙 <strong>Committed too early, want to add more?</strong> → <code>git reset --soft HEAD~1</code><br>↩️ <strong>Bad commit on a shared branch?</strong> → <code>git revert HEAD</code> (always!)<br>🗑️ <strong>Want to completely discard local commits?</strong> → <code>git reset --hard HEAD~N</code><br>😱 <strong>Lost commits after a bad reset?</strong> → <code>git reflog</code> then reset to the lost hash<br>📂 <strong>Want to discard uncommitted file changes?</strong> → <code>git restore file</code><br>📤 <strong>Accidentally staged a file?</strong> → <code>git restore --staged file</code></div></div>`},
    {label:"In the workplace",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>Interview tip:</strong> 'What's the difference between git revert and git reset?' is one of the most common Git interview questions. The key answer: <code>revert</code> creates a new commit that undoes changes — history is preserved, safe for shared branches. <code>reset</code> moves the branch pointer backward — history is rewritten, only safe for local unpushed work. Knowing when to use each shows you understand Git deeply and can be trusted with production code.</div></div>`}
  ],
  challenges:[
    {q:"A bad commit was pushed to the shared main branch. What is the safest command to undo it without rewriting history?",scenario:"5 teammates have already pulled this commit. You cannot use reset because it rewrites history. What do you use?",hint:"You need a command that creates a NEW commit undoing the changes — it doesn't erase history. Think 'reverse'.",answer:"Answer: git revert HEAD — This creates a NEW commit that undoes the changes of the target commit. History is preserved — safe for shared branches. Never use git reset --hard on commits others have already pulled.",accept:["git revert head","git revert HEAD","git revert HEAD~0"],feedback:"git revert creates a NEW commit that reverses the changes of the target commit. The original bad commit stays in history — nothing is rewritten. This is the only safe undo for shared branches where teammates have already pulled."},
    {q:"Type the command to undo the last commit but keep all its changes ready in the staging area.",scenario:"You committed too soon and want to add one more file to the same commit.",hint:"It's 'git reset' with a softness flag and HEAD~1. The flag name describes how gently it treats your files.",answer:"Answer: git reset --soft HEAD~1 — The --soft flag moves the branch pointer back one commit but keeps all changes staged. You can then add more files and recommit everything together.",accept:["git reset --soft head~1","git reset --soft HEAD~1","git reset --soft head~1 "],feedback:"git reset --soft HEAD~1 moves the branch pointer back one commit but leaves all changes staged. You can then stage additional files and commit everything together. Only use this on local, unpushed commits."},
    {q:"You ran git reset --hard and seem to have lost 3 commits. What command do you run FIRST to find those lost commits?",scenario:"Panic. Your work seems gone. What is your immediate next command?",hint:"There's a command that records EVERY movement of HEAD — even things that seem deleted. Think 'reference log'.",answer:"Answer: git reflog — This shows every movement of HEAD, including commits that appear deleted. Find the hash you need in the output and run git reset --hard HEAD@{N} or git switch -c recovered HEAD@{N}.",accept:["git reflog","git reflog ","git reflog show"],feedback:"git reflog records every single movement of HEAD — including commits erased by reset --hard. Find the hash of your lost commit in the output, then recover with git reset --hard HEAD@{N} or create a rescue branch with git switch -c recovered HEAD@{N}."}
  ]
},
{
  title:"Stashing",sub:"Shelving work-in-progress without committing",
  sections:[
    {label:"What problem does stashing solve?",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">You're halfway through building a feature when your manager says 'drop everything — there's a critical bug in production.' You can't commit half-finished code (it might break the build), and you can't switch branches with uncommitted changes (Git might refuse or overwrite your work). <strong>git stash</strong> solves this: it saves your work-in-progress to a temporary storage area and gives you a clean working directory so you can safely switch branches.</p>`,cards:[
      {title:"How stashing works",body:"<code>git stash</code> takes all your uncommitted changes (both staged and unstaged) and stores them in a special stack. Your working directory reverts to the last commit — clean and ready. When you're done with the interruption, you restore your stash and continue exactly where you left off."},
      {title:"The stash is a stack (LIFO)",body:"Stashes are stored in a <strong>last in, first out</strong> stack. The most recent stash is <code>stash@{0}</code>, the one before it is <code>stash@{1}</code>, and so on. You can have as many stashes as you want, but keeping more than a few gets messy — name them to stay organised."}
    ]},
    {label:"Saving work to the stash",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">There are several ways to stash your work. The most important rule: <strong>always name your stashes</strong> with <code>-m</code>. An unnamed stash like <code>stash@{3}</code> is meaningless a few hours later.</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Basic stash — saves all tracked file changes</span>
<span class="hl">git stash</span>
<span class="cmt"># Working directory is now clean (matches last commit)</span>

<span class="cmt"># Stash with a descriptive name (RECOMMENDED)</span>
<span class="hl">git stash push</span> -m <span class="str">"WIP: login form validation"</span>
<span class="cmt"># Much easier to identify later</span>

<span class="cmt"># Include untracked files (new files Git hasn't seen before)</span>
<span class="hl">git stash</span> -u
<span class="cmt"># Without -u, new untracked files are LEFT BEHIND</span>

<span class="cmt"># Include EVERYTHING — even files in .gitignore</span>
<span class="hl">git stash</span> --all`}},
    {label:"Viewing your stashes",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Before restoring a stash, you need to know what's in it. These commands let you inspect the stash stack:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># List all stashes</span>
<span class="hl">git stash list</span>
<span class="cmt"># stash@{0}: On feature-login: WIP: login form validation</span>
<span class="cmt"># stash@{1}: On main: WIP: API refactor</span>

<span class="cmt"># See a summary of which files changed in the latest stash</span>
<span class="hl">git stash show</span>
<span class="cmt"># src/login.js  | 24 +++++++---</span>
<span class="cmt"># src/auth.js   |  8 ++--</span>

<span class="cmt"># See the FULL DIFF of what's inside a stash</span>
<span class="hl">git stash show</span> -p
<span class="cmt"># Shows the complete diff — every line added and removed</span>
<span class="cmt"># The -p flag means 'patch' (same as git diff output)</span>

<span class="cmt"># Inspect a specific stash (not the latest)</span>
<span class="hl">git stash show</span> -p stash@{2}`}},
    {label:"Restoring stashed work",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">There are two ways to restore a stash. The difference is whether the stash is kept or removed from the stack afterwards:</p>`,cards:[
      {title:"git stash pop — restore and remove",body:"Applies the most recent stash to your working directory <strong>and removes it from the stash list</strong>. This is the most common command — use it when you're done with the interruption and returning to your original work. If applying the stash causes a merge conflict, the stash is NOT removed (so you don't lose it)."},
      {title:"git stash apply — restore and keep",body:"Applies the stash to your working directory but <strong>keeps it in the stash list</strong>. Useful when you want to apply the same changes to multiple branches, or when you want to keep the stash as a backup until you've committed the work."}
    ],codeblock:{lang:"bash",code:`<span class="cmt"># Restore latest stash and remove it from the list</span>
<span class="hl">git stash pop</span>

<span class="cmt"># Restore latest stash but keep it in the list</span>
<span class="hl">git stash apply</span>

<span class="cmt"># Restore a specific stash by its index</span>
<span class="hl">git stash apply</span> stash@{2}`}},
    {label:"Cleaning up stashes",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Old stashes pile up if you don't clean them. Delete stashes you no longer need:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Delete the most recent stash</span>
<span class="hl">git stash drop</span>

<span class="cmt"># Delete a specific stash</span>
<span class="hl">git stash drop</span> stash@{2}

<span class="cmt"># Delete ALL stashes (careful — no undo!)</span>
<span class="hl">git stash clear</span>`}},
    {label:"The complete stash workflow",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>Real-world stash workflow:</strong><br><br>1. You're working on a feature: editing login.js, auth.js<br>2. Urgent bug reported on production!<br>3. <code>git stash push -m "WIP: login form validation"</code> — save your work<br>4. <code>git switch main</code> — go to main branch<br>5. <code>git switch -c hotfix/crash-fix</code> — create hotfix branch<br>6. Fix the bug, commit, push, merge to main<br>7. <code>git switch feature-login</code> — go back to your feature<br>8. <code>git stash pop</code> — restore your WIP exactly where you left off<br>9. Continue working as if nothing happened<br><br>This workflow happens multiple times per week in professional development. The stash is your best friend when context-switching.</div></div>`},
    {label:"Stash vs commit: when to use which",cards:[
      {title:"Use stash when...",body:"You need to temporarily set aside work to deal with something else — a bug, a code review, a quick branch switch. The work is not complete enough for a meaningful commit. You plan to come back to it within hours or a day."},
      {title:"Use commit when...",body:"The work represents a logical milestone, even if unfinished. Commits are searchable, shareable, and permanent. If you're stepping away for more than a day, commit with a <code>WIP:</code> prefix instead of stashing — stashes are local-only and easy to forget."},
      {title:"In the workplace",body:"<strong>Professional tip:</strong> Don't accumulate stashes. Check <code>git stash list</code> regularly. If a stash is more than a week old, either pop and commit it or drop it. Stale stashes are a sign of work that fell through the cracks — which is exactly the kind of thing that causes bugs in production."}
    ]}
  ],
  challenges:[
    {q:"Type the command to save your current work-in-progress to the stash with the label 'login form half done'.",scenario:"You need to urgently switch branches but aren't ready to commit your current changes.",hint:"Use 'git stash push' with the -m flag for a message, just like git commit -m.",answer:"Answer: git stash push -m \"login form half done\" — The -m flag lets you name the stash so you can identify it later. Without a name, stash@{3} is meaningless after a few hours.",accept:["git stash push -m \"login form half done\"","git stash push -m 'login form half done'","git stash save \"login form half done\"","git stash save 'login form half done'"],feedback:"git stash push -m 'message' creates a named stash. Named stashes are much easier to identify later when you have multiple stashes. Always name your stashes. git stash save is the older deprecated syntax."},
    {q:"Type the command to restore your most recent stash AND remove it from the stash list.",scenario:"You're back on your feature branch and want to continue where you left off.",hint:"There are two restore commands: one keeps the stash, one removes it. You want the one that 'pops' it off the stack.",answer:"Answer: git stash pop — This applies the top stash and removes it from the stack. If you want to keep it in the list (e.g. to apply to multiple branches), use git stash apply instead.",accept:["git stash pop","git stash pop "],feedback:"git stash pop applies the most recent stash to your working directory and removes it from the stack. If there's a conflict while applying, the stash is NOT removed — you won't lose it. Use git stash apply if you want to keep the stash after restoring."},
    {q:"Type the command to see a full diff of what is inside your most recent stash.",scenario:"You have 3 stashes and can't remember what's in the latest one. You want to see the actual code changes, not just file names.",hint:"It's 'git stash show' with a flag that shows the full patch, not just a summary.",answer:"Answer: git stash show -p — The -p flag (patch) shows the full diff with every line added and removed. Without -p, you only get a summary of which files changed. Add stash@{N} to inspect a specific stash.",accept:["git stash show -p","git stash show --patch","git stash show -p stash@{0}"],feedback:"git stash show -p shows the complete diff of the stash — every line added and removed. Without -p, it only shows a summary of which files changed. Use stash@{N} to inspect a specific stash instead of the latest one."}
  ]
}
);