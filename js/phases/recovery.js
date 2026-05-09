// GitCoven — Recovery & Undo — Phases 8-9
// This file contains phases 8-9

phases.push(
{
  title:"Undoing Changes",sub:"restore, revert, reset, reflog — getting out of trouble",
  sections:[
    {label:"The undo toolkit",content:`<div class="diagram"><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text2);line-height:2.1">
<div><span style="color:var(--accent-orange)">git restore file</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ discard working dir changes (irreversible)</div>
<div><span style="color:var(--accent-orange)">git restore --staged</span>&nbsp;&nbsp;→ unstage without losing changes</div>
<div><span style="color:var(--accent-blue)">git commit --amend</span>&nbsp;&nbsp;&nbsp;→ fix the LAST commit (before push only)</div>
<div><span style="color:var(--accent)">git revert HEAD</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ safe undo (adds new commit)</div>
<div><span style="color:var(--accent-red)">git reset --soft</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ undo commit, keep staged</div>
<div><span style="color:var(--accent-red)">git reset --mixed</span>&nbsp;&nbsp;&nbsp;&nbsp;→ undo commit, unstage</div>
<div><span style="color:var(--accent-red)">git reset --hard</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→ undo commit, DELETE ⚠️</div>
</div></div>`},
    {label:"restore, amend, revert",codeblock:{lang:"bash",code:`<span class="hl">git restore</span> app.js             <span class="cmt"># discard working dir changes</span>
<span class="hl">git restore</span> --staged app.js    <span class="cmt"># unstage a file</span>
<span class="hl">git commit</span> --amend -m <span class="str">"Fix"</span>   <span class="cmt"># fix last commit msg</span>
<span class="hl">git revert</span> HEAD                <span class="cmt"># safe undo via new commit</span>
<span class="hl">git revert</span> a1b2c3d             <span class="cmt"># revert any commit by hash</span>`}},
    {label:"git reset",codeblock:{lang:"bash",code:`<span class="hl">git reset</span> --soft HEAD~1    <span class="cmt"># keep staged</span>
<span class="hl">git reset</span> HEAD~1           <span class="cmt"># keep in working dir (default)</span>
<span class="hl">git reset</span> --hard HEAD~1   <span class="cmt"># ⚠️ DELETE everything</span>`}},
    {label:"git reflog — the safety net",codeblock:{lang:"bash",code:`<span class="hl">git reflog</span>
<span class="cmt"># HEAD@{0}: reset: moving to HEAD~1</span>
<span class="cmt"># HEAD@{1}: commit: Feature you 'lost'  ← recover this!</span>
<span class="hl">git reset</span> --hard HEAD@{1}   <span class="cmt"># restore to lost commit</span>
<span class="hl">git switch</span> -c recovered HEAD@{1}  <span class="cmt"># or branch from it</span>`}},
    {label:"Which undo tool when?",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>Already pushed to shared branch?</strong> → <code>git revert</code> (safe, creates new commit). <strong>Only local, haven't pushed?</strong> → <code>git reset --soft</code> to redo the commit, or <code>--mixed</code> to restage. <strong>Panic mode — lost commits?</strong> → <code>git reflog</code> first, always. <strong>Never</strong> use <code>git reset --hard</code> on shared branches — it rewrites history others depend on.</div></div>`}
  ],
  challenges:[
    {q:"A bad commit was pushed to the shared main branch. What is the safest command to undo it without rewriting history?",scenario:"5 teammates have already pulled this commit. You cannot use reset. What do you use?",hint:"You need a command that creates a NEW commit undoing the changes — it doesn't erase history. Think 'reverse'.",answer:"Answer: git revert HEAD — This creates a NEW commit that undoes the changes of the target commit. History is preserved — safe for shared branches. Never use git reset --hard on commits others have already pulled.",accept:["git revert head","git revert HEAD","git revert HEAD~0"],feedback:"git revert creates a NEW commit that undoes the changes of the target commit. History is preserved — safe for shared branches. Never use git reset --hard on commits others have already pulled."},
    {q:"Type the command to undo the last commit but keep all its changes ready in the staging area.",scenario:"You committed too soon and want to add one more file to the same commit.",hint:"It's 'git reset' with a softness flag and HEAD~1. The flag name describes how gently it treats your files.",answer:"Answer: git reset --soft HEAD~1 — The --soft flag moves the branch pointer back one commit but keeps all changes staged. You can then add more files and recommit everything together.",accept:["git reset --soft head~1","git reset --soft HEAD~1","git reset --soft head~1 "],feedback:"git reset --soft HEAD~1 moves the branch pointer back by one commit but leaves all the changes staged. You can then stage additional files and commit everything together."},
    {q:"You ran git reset --hard and seem to have lost 3 commits. What command do you run FIRST to find those lost commits?",scenario:"Panic. Your work seems gone. What is your immediate next command?",hint:"There's a command that records EVERY movement of HEAD — even things that seem deleted. Think 'reference log'.",answer:"Answer: git reflog — This shows every movement of HEAD, including commits that appear deleted. Find the hash you need in the output and run git reset --hard HEAD@{N} or git switch -c recovered HEAD@{N}.",accept:["git reflog","git reflog ","git reflog show"],feedback:"git reflog records every single movement of HEAD — including commits that appear deleted. You'll see HEAD@{N} entries for each past state. Find the hash you need and git reset --hard to it or branch from it."}
  ]
},
{
  title:"Stashing",sub:"Shelving work-in-progress without committing",
  sections:[
    {label:"What is stashing?",cards:[
      {title:"The problem it solves",body:"You're halfway through a feature when a critical bug is reported. You can't commit half-done work. <code>git stash</code> saves your WIP to a temporary stack and restores a clean working directory."},
      {title:"The stash stack",body:"LIFO (last in, first out). Most recent is <code>stash@{0}</code>, next is <code>stash@{1}</code>, etc. You can have multiple stashes."}
    ]},
    {label:"Stash commands",codeblock:{lang:"bash",code:`<span class="hl">git stash</span>                          <span class="cmt"># save WIP (tracked files)</span>
<span class="hl">git stash</span> -u                       <span class="cmt"># include untracked files</span>
<span class="hl">git stash push</span> -m <span class="str">"half-done form"</span>  <span class="cmt"># named stash</span>
<span class="hl">git stash list</span>                     <span class="cmt"># see all stashes</span>
<span class="hl">git stash show</span> -p                  <span class="cmt"># full diff of latest stash</span>
<span class="hl">git stash pop</span>                      <span class="cmt"># restore + DELETE stash</span>
<span class="hl">git stash apply</span>                    <span class="cmt"># restore + KEEP stash</span>
<span class="hl">git stash apply</span> stash@{2}          <span class="cmt"># restore specific stash</span>
<span class="hl">git stash drop</span>                     <span class="cmt"># delete latest</span>
<span class="hl">git stash clear</span>                    <span class="cmt"># delete ALL stashes</span>`}},
    {label:"pop vs apply",cards:[
      {title:"git stash pop",body:"Restores the stash AND removes it from the list. Use when you're done with it."},
      {title:"git stash apply",body:"Restores the stash but KEEPS it in the list. Useful for applying the same stash to multiple branches."},
      {title:"Common workflow",body:"You're mid-feature when a hotfix comes in: <code>git stash push -m 'WIP login form'</code> → switch to main → fix the bug → commit → switch back → <code>git stash pop</code>. Your work is exactly where you left it. Always name your stashes — <code>stash@{3}</code> tells you nothing six hours later."}
    ]}
  ],
  challenges:[
    {q:"Type the command to save your current work-in-progress to the stash with the label 'login form half done'.",scenario:"You need to urgently switch branches but aren't ready to commit your current changes.",hint:"Use 'git stash push' with the -m flag for a message, just like git commit -m.",answer:"Answer: git stash push -m \"login form half done\" — The -m flag lets you name the stash so you can identify it later. Without a name, stash@{3} is meaningless after a few hours.",accept:["git stash push -m \"login form half done\"","git stash push -m 'login form half done'","git stash save \"login form half done\"","git stash save 'login form half done'"],feedback:"git stash push -m 'message' creates a named stash. Named stashes are much easier to identify later when you have multiple stashes. git stash save is the older deprecated syntax."},
    {q:"Type the command to restore your most recent stash AND remove it from the stash list.",scenario:"You're back on your feature branch and want to continue where you left off.",hint:"There are two restore commands: one keeps the stash, one removes it. You want the one that 'pops' it off the stack.",answer:"Answer: git stash pop — This applies the top stash and removes it from the stack. If you want to keep it in the list (e.g. to apply to multiple branches), use git stash apply instead.",accept:["git stash pop","git stash pop "],feedback:"git stash pop is the most commonly used stash command. It applies the top stash and removes it from the stack. If you want to keep it in the list (to apply to other branches), use git stash apply instead."},
    {q:"Type the command to see a full diff of what is inside your most recent stash.",scenario:"You have 3 stashes and can't remember what's in the latest one. You want to see the actual changes.",hint:"It's 'git stash show' with a flag that shows the full patch, not just a summary.",answer:"Answer: git stash show -p — The -p flag (patch) shows the full diff. Without it, you only get a summary of which files changed. Add stash@{N} to inspect a specific stash.",accept:["git stash show -p","git stash show --patch","git stash show -p stash@{0}"],feedback:"git stash show -p (patch) shows the full diff of the stash. Without -p, it shows a summary of which files changed. Add stash@{N} to inspect a specific stash."}
  ]
}
);