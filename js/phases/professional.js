// GitCoven — Professional — Phases 15-16
// This file contains phases 15-16

phases.push(
{
  title:"Collaboration & Code Review",sub:"Forking, pull requests, and open source",
  sections:[
    {label:"Fork vs clone",cards:[
      {title:"Clone",body:"Creates a local copy. You need write access to push back. Used when you're a direct team collaborator."},
      {title:"Fork",body:"Copies a repo under YOUR GitHub account. Full write access to your copy. Open a PR to contribute back. Used in open source — no write access to original needed."}
    ]},
    {label:"Fork workflow",codeblock:{lang:"bash",code:`<span class="cmt"># Clone YOUR fork</span>
<span class="hl">git clone</span> git@github.com:YOU/repo.git
cd repo

<span class="cmt"># Add the original as 'upstream'</span>
<span class="hl">git remote add</span> upstream git@github.com:ORIGINAL/repo.git

<span class="cmt"># Keep fork synced</span>
<span class="hl">git fetch</span> upstream
<span class="hl">git switch</span> main
<span class="hl">git merge</span> upstream/main
<span class="hl">git push</span> origin main

<span class="cmt"># Work on feature, push to YOUR fork</span>
<span class="hl">git switch</span> -c fix/my-fix
<span class="cmt"># ... commit ... push origin fix/my-fix ...</span>
<span class="cmt"># Then open PR: your fork → original repo</span>`}},
    {label:"Anatomy of a great PR",cards:[
      {title:"PR description must include",body:"What it does, why it's needed (link to issue), how to test it, screenshots for UI changes, checklist: tests added, docs updated, no breaking changes."},
      {title:"Keep PRs small",body:"Ideal: 200-400 lines of code change. Large PRs get shallow reviews. Break big features into stacked smaller PRs."}
    ]},
    {label:"Code review etiquette",cards:[
      {title:"As a reviewer",body:"Review within 24h. Critique code not person. Prefix style opinions with <code>nit:</code>. Ask questions rather than commands. Approve when the code is good enough, not perfect."},
      {title:"As an author",body:"Respond to every comment. Don't take it personally. Explain reasoning if you disagree. Make changes in new commits during review so reviewers can see what changed."},
      {title:"The review mindset",body:"Code review is not a gatekeeping exercise — it's a learning opportunity for both sides. The reviewer learns what problems the author solved and how. The author learns patterns and catches bugs early. Teams that skip code review consistently ship more bugs."}
    ]}
  ],
  challenges:[
    {q:"After forking a repo, you cloned your fork locally. What remote name should you give to the ORIGINAL repository?",scenario:"You want to be able to pull future changes from the original project into your fork.",hint:"By convention, the original repo you forked from gets a name meaning 'above' or 'source'. It's a single word.",accept:["upstream"],feedback:"By universal convention, the original repo you forked from is added as a remote called 'upstream'. Your fork is 'origin'. This naming lets you: git fetch upstream to get original's changes, then merge them into your local main."},
    {q:"Type the command to fetch all branches and commits from the 'upstream' remote.",scenario:"The original project has had 20 new commits since you forked. You need to download them.",hint:"The command is 'git fetch' followed by the remote name.",accept:["git fetch upstream","git fetch upstream "],feedback:"git fetch upstream downloads all new commits and branches from the upstream remote into your local upstream/* tracking branches (e.g. upstream/main). It does NOT merge them into your local branches — you do that separately."},
    {q:"After fetching from upstream, type the two commands (separated by newline) to merge upstream's main into your local main branch.",scenario:"You've fetched. Now you need to actually update your local main with upstream's changes.",hint:"First switch to main, then merge the upstream's tracking branch. Two commands on separate lines.",accept:["git switch main\ngit merge upstream/main","git checkout main\ngit merge upstream/main","git switch main\ngit merge upstream/main "],feedback:"First switch to your local main, then merge the remote-tracking branch upstream/main into it. This brings your fork's main up to date with the original. Then git push origin main to update your GitHub fork."}
  ]
},
{
  title:"Pro Tips & Cheat Sheet",sub:"Power commands, aliases, and the complete reference",
  sections:[
    {label:"Power user commands",codeblock:{lang:"bash",code:`<span class="hl">git clean</span> -fd              <span class="cmt"># delete untracked files/dirs</span>
<span class="hl">git clean</span> -n               <span class="cmt"># dry run first</span>
<span class="hl">git log</span> -S <span class="str">"functionName"</span>  <span class="cmt"># pickaxe: find when string was added</span>
<span class="hl">git diff</span> main...feature    <span class="cmt"># changes since branching</span>
<span class="hl">git worktree add</span> ../hw hotfix  <span class="cmt"># two branches checked out simultaneously</span>
<span class="hl">git format-patch</span> -1 HEAD   <span class="cmt"># export commit as .patch file</span>
<span class="hl">git count-objects</span> -vH      <span class="cmt"># repository size</span>
<span class="hl">git gc</span>                     <span class="cmt"># garbage collect / optimise</span>`}},
    {label:"Essential aliases",codeblock:{lang:"bash",code:`[alias]
  st = status
  lg = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)&lt;%an&gt;%Creset' --abbrev-commit
  undo = reset --soft HEAD~1
  unstage = restore --staged
  root = rev-parse --show-toplevel`}},
    {label:"Complete cheat sheet",content:`<div class="cheat-grid">
<div class="cheat-item"><div class="cheat-cmd">git init</div><div class="cheat-desc">Create repo</div></div>
<div class="cheat-item"><div class="cheat-cmd">git clone URL</div><div class="cheat-desc">Clone remote repo</div></div>
<div class="cheat-item"><div class="cheat-cmd">git status</div><div class="cheat-desc">Working tree status</div></div>
<div class="cheat-item"><div class="cheat-cmd">git add .</div><div class="cheat-desc">Stage all changes</div></div>
<div class="cheat-item"><div class="cheat-cmd">git add -p</div><div class="cheat-desc">Interactive staging</div></div>
<div class="cheat-item"><div class="cheat-cmd">git commit -m</div><div class="cheat-desc">Commit with message</div></div>
<div class="cheat-item"><div class="cheat-cmd">git commit --amend</div><div class="cheat-desc">Modify last commit</div></div>
<div class="cheat-item"><div class="cheat-cmd">git log --oneline</div><div class="cheat-desc">Compact history</div></div>
<div class="cheat-item"><div class="cheat-cmd">git diff --staged</div><div class="cheat-desc">Staged changes diff</div></div>
<div class="cheat-item"><div class="cheat-cmd">git switch -c name</div><div class="cheat-desc">Create & switch branch</div></div>
<div class="cheat-item"><div class="cheat-cmd">git merge branch</div><div class="cheat-desc">Merge branch in</div></div>
<div class="cheat-item"><div class="cheat-cmd">git rebase main</div><div class="cheat-desc">Rebase onto main</div></div>
<div class="cheat-item"><div class="cheat-cmd">git rebase -i HEAD~N</div><div class="cheat-desc">Interactive rebase</div></div>
<div class="cheat-item"><div class="cheat-cmd">git push -u origin</div><div class="cheat-desc">Push & set upstream</div></div>
<div class="cheat-item"><div class="cheat-cmd">git pull --rebase</div><div class="cheat-desc">Pull with rebase</div></div>
<div class="cheat-item"><div class="cheat-cmd">git stash pop</div><div class="cheat-desc">Restore latest stash</div></div>
<div class="cheat-item"><div class="cheat-cmd">git restore file</div><div class="cheat-desc">Discard changes</div></div>
<div class="cheat-item"><div class="cheat-cmd">git revert HEAD</div><div class="cheat-desc">Safe public undo</div></div>
<div class="cheat-item"><div class="cheat-cmd">git reset --soft</div><div class="cheat-desc">Undo commit, keep staged</div></div>
<div class="cheat-item"><div class="cheat-cmd">git reflog</div><div class="cheat-desc">Full HEAD history</div></div>
<div class="cheat-item"><div class="cheat-cmd">git cherry-pick</div><div class="cheat-desc">Copy one commit</div></div>
<div class="cheat-item"><div class="cheat-cmd">git bisect start</div><div class="cheat-desc">Begin bug hunt</div></div>
<div class="cheat-item"><div class="cheat-cmd">git blame file</div><div class="cheat-desc">Who wrote each line</div></div>
<div class="cheat-item"><div class="cheat-cmd">git tag -a v1.0.0</div><div class="cheat-desc">Annotated tag</div></div>
<div class="cheat-item"><div class="cheat-cmd">git push --tags</div><div class="cheat-desc">Push all tags</div></div>
<div class="cheat-item"><div class="cheat-cmd">git rm --cached</div><div class="cheat-desc">Untrack a file</div></div>
<div class="cheat-item"><div class="cheat-cmd">git fetch upstream</div><div class="cheat-desc">Sync fork source</div></div>
<div class="cheat-item"><div class="cheat-cmd">git grep "term"</div><div class="cheat-desc">Search tracked files</div></div>
<div class="cheat-item"><div class="cheat-cmd">git clean -fd</div><div class="cheat-desc">Delete untracked</div></div>
<div class="cheat-item"><div class="cheat-cmd">git gc</div><div class="cheat-desc">Optimise repo</div></div>
</div>`}
  ],
  challenges:[
    {q:"Type the command that shows a full history of every position HEAD has ever been — including commits that appear to have been deleted.",scenario:"You've been working all day and accidentally reset --hard to the wrong commit. What command reveals your escape route?",hint:"It's Git's safety net — a log of all HEAD movements. Shorthand for 'reference log'.",accept:["git reflog","git reflog ","git reflog show"],feedback:"git reflog is the ultimate safety net. Every commit, branch switch, reset, merge, and rebase is logged here. Entries expire after ~90 days. Always run this first when you think you've lost work."},
    {q:"Type the command to search all tracked files in the repo for the text 'console.log'.",scenario:"Before a production release, you want to find any debug statements left in the codebase.",hint:"Git has a built-in search: 'git grep' followed by your search term.",accept:["git grep \"console.log\"","git grep 'console.log'","git grep console.log"],feedback:"git grep is much faster than regular grep because it only searches Git-tracked files. It's case-sensitive by default. Add -i for case-insensitive. Use --count to show just the file counts."},
    {q:"You want an alias so that 'git undo' runs 'git reset --soft HEAD~1'. Type the git config command to create this alias globally.",scenario:"You want to stop typing the full reset command every time you want to undo a commit.",hint:"Use 'git config --global alias.<name>' followed by the command in quotes.",accept:["git config --global alias.undo \"reset --soft head~1\"","git config --global alias.undo 'reset --soft head~1'","git config --global alias.undo \"reset --soft HEAD~1\"","git config --global alias.undo 'reset --soft HEAD~1'"],feedback:"Git aliases let you create custom shortcuts. After this, git undo becomes an alias for git reset --soft HEAD~1. You can view all your aliases with git config --get-regexp alias or just open ~/.gitconfig."}
  ]
}
);