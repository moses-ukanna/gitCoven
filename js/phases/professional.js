// GitCoven — Professional — Phases 15-16
// This file contains phases 15-16

phases.push(
{
  title:"Collaboration & Code Review",sub:"Forking, pull requests, and open source contribution",
  sections:[
    {label:"Two ways to collaborate",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">There are two models for collaborating on Git projects. Which one you use depends on whether you have direct write access to the repository:</p>`,cards:[
      {title:"Clone — direct collaboration",body:"<code>git clone</code> creates a local copy of a repo. You need <strong>write access</strong> to push back to the same remote. This is how teams work on private company repos — you're added as a collaborator with push permissions. You clone, create branches, push them, and open pull requests within the same repo."},
      {title:"Fork — open source contribution",body:"<code>Fork</code> (a GitHub/GitLab feature) copies the entire repo under <strong>your own account</strong>. You have full write access to your copy but no access to the original. To contribute, you push changes to your fork and then open a <strong>Pull Request</strong> from your fork to the original repo. The maintainers review and decide whether to accept your changes. This is the standard model for open source."}
    ]},
    {label:"The complete fork workflow",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">This is the step-by-step process for contributing to any open source project. Understand this workflow and you can contribute to any project on GitHub:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Step 1: Fork the repo on GitHub (click "Fork" button)</span>
<span class="cmt"># This creates github.com/YOUR-USERNAME/repo</span>

<span class="cmt"># Step 2: Clone YOUR fork to your local machine</span>
<span class="hl">git clone</span> git@github.com:YOUR-USERNAME/repo.git
cd repo

<span class="cmt"># Step 3: Add the ORIGINAL repo as a remote called 'upstream'</span>
<span class="hl">git remote add</span> upstream git@github.com:ORIGINAL-OWNER/repo.git

<span class="cmt"># Verify both remotes</span>
<span class="hl">git remote</span> -v
<span class="cmt"># origin   → YOUR fork (push your work here)</span>
<span class="cmt"># upstream → ORIGINAL repo (pull their updates from here)</span>

<span class="cmt"># Step 4: Keep your fork in sync with the original</span>
<span class="hl">git fetch</span> upstream
<span class="hl">git switch</span> main
<span class="hl">git merge</span> upstream/main
<span class="hl">git push</span> origin main

<span class="cmt"># Step 5: Create a feature branch for your contribution</span>
<span class="hl">git switch</span> -c fix/typo-in-readme

<span class="cmt"># Step 6: Make your changes, commit them</span>
<span class="hl">git add</span> .
<span class="hl">git commit</span> -m <span class="str">"Fix typo in installation instructions"</span>

<span class="cmt"># Step 7: Push your branch to YOUR fork</span>
<span class="hl">git push</span> -u origin fix/typo-in-readme

<span class="cmt"># Step 8: Open a Pull Request on GitHub</span>
<span class="cmt"># Go to your fork → "Compare & pull request" button</span>
<span class="cmt"># Base: original/main ← Head: your-fork/fix/typo-in-readme</span>`},cards:[
      {title:"Why 'upstream'?",body:"By universal convention, the original repo is always named <code>upstream</code> and your fork is <code>origin</code>. This naming is expected by every open source project. Using any other name will confuse collaborators and break common scripts."},
      {title:"Sync before every PR",body:"Always <code>git fetch upstream</code> and merge <code>upstream/main</code> into your branch before opening a PR. If your fork is behind, you'll have unnecessary merge conflicts. Many projects will reject PRs that have merge conflicts."}
    ]},
    {label:"Pull Requests (PRs)",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">A Pull Request is a formal request to merge your branch into another branch (usually main). It's the central tool for code review in modern development. On GitLab, they're called Merge Requests (MRs) — same concept.</p>`,cards:[
      {title:"What makes a great PR",body:"<strong>Title:</strong> Clear, concise description of what the PR does.<br><strong>Description:</strong> What changes were made and why. Link to the issue it fixes (<code>Closes #42</code>). How to test it. Screenshots for UI changes. Any trade-offs or decisions made.<br><strong>Checklist:</strong> Tests added? Docs updated? No breaking changes? Linted?"},
      {title:"Keep PRs small and focused",body:"Ideal PR size: <strong>200-400 lines</strong> of code change. Large PRs (1000+ lines) get rubber-stamped because reviewers lose focus. Break big features into multiple smaller PRs that can each be reviewed and merged independently. A series of 3 small PRs is always better than 1 giant PR."},
      {title:"PR lifecycle",body:"1. You open the PR with a description<br>2. Automated checks run (CI, linting, tests)<br>3. Reviewers are assigned (manually or via CODEOWNERS)<br>4. Reviewers leave comments, request changes, or approve<br>5. You address feedback with new commits<br>6. Once approved and CI passes, the PR is merged<br>7. The feature branch is deleted"}
    ]},
    {label:"Code review etiquette",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Code review is a critical skill — both giving and receiving reviews. Teams that do it well ship fewer bugs, share knowledge faster, and have healthier codebases:</p>`,cards:[
      {title:"As a reviewer",body:"<strong>Respond within 24 hours</strong> — blocking a PR blocks a teammate's work.<br>Critique the <strong>code, not the person</strong>: 'This function could be simpler' not 'You wrote this wrong'.<br>Prefix nitpicks with <code>nit:</code> so the author knows it's optional.<br>Ask <strong>questions</strong> rather than commands: 'Have you considered X?' not 'Do X'.<br>Approve when it's <strong>good enough</strong>, not perfect. Don't bikeshed."},
      {title:"As an author",body:"<strong>Respond to every comment</strong> — even if just 'Done' or 'Good catch, fixed'.<br>Don't take feedback personally — reviewers want the code to be good, not to attack you.<br>Explain your reasoning if you disagree — provide context the reviewer might be missing.<br>Push fixes as <strong>new commits</strong> during review so reviewers can see what changed since their last review."},
      {title:"The review mindset",body:"Code review is not a gatekeeping exercise — it's a <strong>learning opportunity</strong> for both sides. The reviewer learns what problems the author solved and how. The author catches bugs early and learns patterns. Teams that skip code review consistently ship more bugs. <strong>In your career, you'll spend as much time reviewing code as writing it.</strong>"}
    ]},
    {label:"Branch protection rules",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Professional repos use branch protection rules to enforce quality standards. These are configured in GitHub/GitLab settings:</p>`,cards:[
      {title:"Common protection rules",body:"<strong>Require pull request:</strong> No direct pushes to main — all changes must go through a PR.<br><strong>Require reviews:</strong> At least 1-2 team members must approve before merge.<br><strong>Require CI to pass:</strong> Automated tests must pass before merge is allowed.<br><strong>Require branch to be up-to-date:</strong> Your branch must be rebased/merged with the latest main.<br><strong>Dismiss stale reviews:</strong> New commits invalidate previous approvals (must be re-reviewed)."},
      {title:"Why these exist",body:"Branch protection prevents accidental deployments of broken code. Even a team lead shouldn't push directly to main. In your first week at a new job, one of the first things you'll encounter is branch protection on the main branch — knowing what it is and why it exists shows professionalism."}
    ]},
    {label:"In the workplace",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>Career advice:</strong> Contributing to open source is one of the most effective ways to stand out when applying for jobs. It shows you can read unfamiliar code, write clear PRs, follow contribution guidelines, and collaborate with strangers — all skills employers value highly. Start small: fix a typo, update documentation, or resolve a 'good first issue'. Your GitHub profile IS your portfolio.</div></div>`}
  ],
  challenges:[
    {q:"After forking a repo, you cloned your fork locally. What remote name should you give to the ORIGINAL repository?",scenario:"You want to be able to pull future changes from the original project into your fork.",hint:"By convention, the original repo you forked from gets a name meaning 'above' or 'source'. It's a single word.",answer:"Answer: upstream. By universal convention, the original repo is 'upstream' and your fork is 'origin'. This lets you: git fetch upstream to get the original's latest changes, then merge them into your local main.",accept:["upstream","the upstream remote","upstream remote"],feedback:"By universal convention, the original repo you forked from is added as a remote called 'upstream'. Your fork is 'origin'. This lets you: git fetch upstream to get the original's changes, then merge upstream/main into your local main to stay in sync."},
    {q:"Type the command to fetch all branches and commits from the 'upstream' remote.",scenario:"The original project has had 20 new commits since you forked. You need to download them without merging.",hint:"The command is 'git fetch' followed by the remote name.",answer:"Answer: git fetch upstream — This downloads all new commits and branches from upstream into your local upstream/* tracking branches (e.g. upstream/main). It does NOT merge anything — you do that separately.",accept:["git fetch upstream","git fetch upstream "],feedback:"git fetch upstream downloads all new commits and branches from the upstream remote into your local upstream/* tracking branches (e.g. upstream/main). It does NOT merge them — you merge manually afterwards with git merge upstream/main."},
    {q:"After fetching from upstream, type the two commands (separated by newline) to merge upstream's main into your local main branch.",scenario:"You've fetched. Now you need to actually update your local main with upstream's changes.",hint:"First switch to main, then merge the upstream's tracking branch. Two commands on separate lines.",answer:"Answer: git switch main then git merge upstream/main — First switch to your local main, then merge the remote-tracking branch. After this, git push origin main to update your GitHub fork too.",accept:["git switch main\ngit merge upstream/main","git checkout main\ngit merge upstream/main","git switch main\ngit merge upstream/main "],feedback:"First switch to your local main, then merge the remote-tracking branch upstream/main into it. This brings your fork's main up to date with the original. Then git push origin main to update your GitHub fork."}
  ]
},
{
  title:"Pro Tips & Cheat Sheet",sub:"Power commands, aliases, and the complete reference",
  sections:[
    {label:"Power commands you should know",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">These commands go beyond the basics and make you noticeably more productive. Each one solves a specific problem that comes up regularly in professional work:</p>`,cards:[
      {title:"git clean — remove untracked files",body:"Deletes files that are not tracked by Git (build output, generated files, temp files). Use <code>git clean -n</code> first to preview what would be deleted (dry run), then <code>git clean -fd</code> to actually delete files and directories. <strong>Irreversible</strong> — the files are gone."},
      {title:"git log -S — the pickaxe search",body:"<code>git log -S \"functionName\"</code> finds every commit where the string 'functionName' was added or removed. Unlike grep (which searches current content), pickaxe searches through history. Use it to find when a function was introduced or deleted."},
      {title:"git diff main...feature — branch comparison",body:"Shows the changes that exist on the feature branch but not on main — i.e. what the feature branch introduced since it diverged. The three dots are important: <code>main..feature</code> (two dots) is different. Three dots shows changes since the branch point."},
      {title:"git worktree — multiple branches simultaneously",body:"<code>git worktree add ../hotfix-dir hotfix-branch</code> checks out a branch in a separate directory without disturbing your current working directory. You can have two branches open at once — one for your feature, one for a hotfix. No stashing or switching needed."}
    ]},
    {label:"git clean",codeblock:{lang:"bash",code:`<span class="cmt"># Preview what would be deleted (ALWAYS do this first)</span>
<span class="hl">git clean</span> -n
<span class="cmt"># Would remove build/output.js</span>
<span class="cmt"># Would remove temp-debug.log</span>

<span class="cmt"># Actually delete untracked files and directories</span>
<span class="hl">git clean</span> -fd
<span class="cmt"># -f = force (required), -d = directories too</span>

<span class="cmt"># Delete EVERYTHING untracked including gitignored files</span>
<span class="hl">git clean</span> -fdx
<span class="cmt"># ⚠️ This removes node_modules, .env, etc. Use with extreme caution</span>`}},
    {label:"git reflog — the recovery tool",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Covered in Phase 8, but so important it deserves a second look. <code>git reflog</code> records <strong>every movement of HEAD</strong> — commits, resets, branch switches, rebases. Even commits deleted by <code>git reset --hard</code> appear here. It's your emergency recovery tool when you think you've lost work:</p>`,codeblock:{lang:"bash",code:`<span class="hl">git reflog</span>
<span class="cmt"># a1b2c3d HEAD@{0}: reset: moving to HEAD~3</span>
<span class="cmt"># e4f5g6h HEAD@{1}: commit: Payment feature    ← your 'lost' work!</span>
<span class="cmt"># f7g8h9i HEAD@{2}: commit: Add validation</span>

<span class="cmt"># Recover by resetting to the lost commit</span>
<span class="hl">git reset</span> --hard e4f5g6h
<span class="cmt"># Or create a rescue branch from it (safer)</span>
<span class="hl">git switch</span> -c recovered e4f5g6h`}},
    {label:"git grep — fast codebase search",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git grep</code> searches every tracked file in your repository. Much faster than regular grep because it skips untracked files (node_modules, build output, etc.):</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Search for a string across all tracked files</span>
<span class="hl">git grep</span> <span class="str">"console.log"</span>

<span class="cmt"># Case-insensitive search</span>
<span class="hl">git grep</span> -i <span class="str">"todo"</span>

<span class="cmt"># Show line numbers</span>
<span class="hl">git grep</span> -n <span class="str">"API_KEY"</span>

<span class="cmt"># Count matches per file</span>
<span class="hl">git grep</span> --count <span class="str">"console.log"</span>`}},
    {label:"Creating Git aliases",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Aliases create shortcuts for commands you type repeatedly. They're stored in <code>~/.gitconfig</code> under the <code>[alias]</code> section. Create them with <code>git config</code> or edit the file directly:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Create aliases via command line</span>
<span class="hl">git config</span> --global alias.st status
<span class="hl">git config</span> --global alias.undo <span class="str">"reset --soft HEAD~1"</span>
<span class="hl">git config</span> --global alias.unstage <span class="str">"restore --staged"</span>

<span class="cmt"># Now you can use:</span>
<span class="hl">git st</span>              <span class="cmt"># instead of git status</span>
<span class="hl">git undo</span>            <span class="cmt"># instead of git reset --soft HEAD~1</span>
<span class="hl">git unstage</span> file    <span class="cmt"># instead of git restore --staged file</span>

<span class="cmt"># View all your aliases</span>
<span class="hl">git config</span> --get-regexp alias

<span class="cmt"># Or edit ~/.gitconfig directly:</span>
<span class="cmt"># [alias]</span>
<span class="cmt">#   st = status</span>
<span class="cmt">#   lg = log --oneline --graph --all --decorate</span>
<span class="cmt">#   undo = reset --soft HEAD~1</span>`},cards:[
      {title:"Recommended aliases",body:"<code>st</code> = status<br><code>lg</code> = log --oneline --graph --all --decorate<br><code>undo</code> = reset --soft HEAD~1<br><code>unstage</code> = restore --staged<br><code>last</code> = log -1 HEAD --stat<br><code>root</code> = rev-parse --show-toplevel"}
    ]},
    {label:"Complete cheat sheet",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Every essential Git command from the entire curriculum in one reference. Bookmark this phase:</p>
<div class="cheat-grid">
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
<div class="cheat-item"><div class="cheat-cmd">git restore --staged</div><div class="cheat-desc">Unstage a file</div></div>
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
</div>`},
    {label:"In the workplace",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>You've now covered everything needed for 95% of daily Git work.</strong> The commands in this cheat sheet are what professional developers use every day. The remaining phases cover enterprise-level topics — Git internals, CI/CD, security, monorepos — that go beyond daily Git usage and into architecture and DevOps. You're already job-ready for most developer roles. The enterprise phases will prepare you for senior and lead positions.</div></div>`}
  ],
  challenges:[
    {q:"Type the command that shows a full history of every position HEAD has ever been — including commits that appear to have been deleted.",scenario:"You've been working all day and accidentally reset --hard to the wrong commit. What command reveals your escape route?",hint:"It's Git's safety net — a log of all HEAD movements. Shorthand for 'reference log'.",answer:"Answer: git reflog — The 'reference log' records every HEAD movement: commits, branch switches, resets, merges, rebases. Entries expire after ~90 days. Always run this first when you think you've lost work.",accept:["git reflog","git reflog ","git reflog show"],feedback:"git reflog is the ultimate safety net. Every commit, branch switch, reset, merge, and rebase is logged. Entries expire after ~90 days. Always run this first when you think you've lost work — the commit is almost certainly still there."},
    {q:"Type the command to search all tracked files in the repo for the text 'console.log'.",scenario:"Before a production release, you want to find any debug statements left in the codebase.",hint:"Git has a built-in search: 'git grep' followed by your search term.",answer:"Answer: git grep \"console.log\" — Git's built-in search is faster than regular grep because it only searches tracked files. Add -i for case-insensitive, -n for line numbers, --count for file summaries.",accept:["git grep \"console.log\"","git grep 'console.log'","git grep console.log"],feedback:"git grep searches every tracked file — much faster than regular grep because it skips untracked files like node_modules. Case-sensitive by default. Add -i for case-insensitive, -n for line numbers, --count for per-file counts."},
    {q:"You want an alias so that 'git undo' runs 'git reset --soft HEAD~1'. Type the git config command to create this alias globally.",scenario:"You want to stop typing the full reset command every time you want to undo a commit.",hint:"Use 'git config --global alias.<name>' followed by the command in quotes.",answer:"Answer: git config --global alias.undo \"reset --soft HEAD~1\" — This creates a shortcut so typing git undo runs git reset --soft HEAD~1. View all aliases with git config --get-regexp alias.",accept:["git config --global alias.undo \"reset --soft head~1\"","git config --global alias.undo 'reset --soft head~1'","git config --global alias.undo \"reset --soft HEAD~1\"","git config --global alias.undo 'reset --soft HEAD~1'"],feedback:"Git aliases create shortcuts for frequently-used commands. After this, git undo runs git reset --soft HEAD~1. View all aliases with git config --get-regexp alias or open ~/.gitconfig directly."}
  ]
}
);