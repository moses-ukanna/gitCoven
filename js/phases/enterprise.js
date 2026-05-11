// GitCoven — Enterprise — Phases 17-25
// This file contains phases 17-25

phases.push(
{
  title:"Git Internals",sub:"Blobs, trees, commits, refs — how Git actually works under the hood",
  sections:[
    {label:"Why learn internals?",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Understanding Git's internal data model transforms you from someone who memorises commands into someone who <strong>truly understands</strong> what Git is doing. When something goes wrong, you can diagnose it. When a tool builds on Git, you understand how. This knowledge separates senior developers from juniors.</p>`},
    {label:"Git is a content-addressable filesystem",cards:[
      {title:"Everything is an object",body:"At its core, Git stores everything as objects in the <code>.git/objects</code> directory. Every file, every directory snapshot, every commit — each becomes a compressed, SHA-1-hashed object. The same content always produces the same hash — Git never stores duplicates."},
      {title:"Four object types",body:"<strong>blob</strong> — stores file content (no filename, just raw data). <strong>tree</strong> — stores a directory listing (maps filenames to blob/tree hashes). <strong>commit</strong> — stores a tree pointer + parent commit pointer + author + timestamp + message. <strong>tag</strong> — stores a pointer to another object with tagger name, date, and message (annotated tags only)."}
    ]},
    {label:"The object model visualised",content:`<div class="diagram"><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text1);line-height:2">
<div><span style="color:var(--accent-purple)">commit a1b2c3</span> → tree <span style="color:var(--accent-orange)">f4e5d6</span> → blob <span style="color:var(--accent)">README.md content</span></div>
<div style="margin-left:172px">→ tree <span style="color:var(--accent-blue)">src/</span> → blob <span style="color:var(--accent)">index.js content</span></div>
<div><span style="color:var(--text3)">parent ↑</span></div>
<div><span style="color:var(--accent-purple)">commit 9i8h7g</span> → tree <span style="color:var(--accent-orange)">previous snapshot...</span></div>
</div></div>
<p style="color:var(--text2);font-size:13px;margin-top:8px">A commit points to a tree (root directory snapshot). The tree points to blobs (files) and other trees (subdirectories). The commit also points to its parent commit, forming the chain of history.</p>`},
    {label:"Inspecting objects directly",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git cat-file</code> is a 'plumbing' command that lets you inspect any Git object by its hash. The <code>-t</code> flag shows the type, and <code>-p</code> pretty-prints the content:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Check what type an object is</span>
<span class="hl">git cat-file</span> -t HEAD          <span class="cmt"># output: commit</span>

<span class="cmt"># Pretty-print the full contents of the HEAD commit</span>
<span class="hl">git cat-file</span> -p HEAD
<span class="cmt"># tree f4e5d6...</span>
<span class="cmt"># parent 9i8h7g...</span>
<span class="cmt"># author Alice &lt;alice@example.com&gt; 1710000000 +0000</span>
<span class="cmt"># committer Alice &lt;alice@example.com&gt; 1710000000 +0000</span>
<span class="cmt">#</span>
<span class="cmt"># Add user authentication</span>

<span class="cmt"># Inspect the root tree of that commit</span>
<span class="hl">git cat-file</span> -p HEAD^{tree}

<span class="cmt"># Write a blob directly (low-level — creates a hash from content)</span>
echo <span class="str">"hello"</span> | <span class="hl">git hash-object</span> --stdin
<span class="cmt"># → ce013625030ba8dba906f756967f9e9ca394464a</span>`}},
    {label:"Refs — human-readable pointers",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Nobody memorises 40-character hashes. Refs are human-readable names that point to commit hashes. Branches, tags, and HEAD are all refs stored as small files inside <code>.git/refs/</code>:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># A branch is just a file containing a commit hash</span>
cat .git/refs/heads/main       <span class="cmt"># → a1b2c3d4e5f6...</span>

<span class="cmt"># HEAD is a symbolic ref pointing to the current branch</span>
cat .git/HEAD                  <span class="cmt"># → ref: refs/heads/main</span>

<span class="cmt"># Resolve any name to its commit hash</span>
<span class="hl">git rev-parse</span> HEAD
<span class="hl">git rev-parse</span> main
<span class="hl">git rev-parse</span> v1.0.0
<span class="cmt"># All output the full 40-character SHA-1 hash</span>`}},
    {label:"Packfiles — compression at scale",cards:[
      {title:"Loose objects vs packfiles",body:"Initially, each object is stored as a separate compressed file (loose). When there are too many, <code>git gc</code> packs them into a single <code>.pack</code> file with a <code>.idx</code> index. Packfiles use delta compression — storing only the differences between similar objects."},
      {title:"Why this matters",body:"Understanding packfiles explains why Git repos are small despite storing complete history, why <code>git clone</code> is fast, and how <code>git gc</code> optimises repo size. Run <code>git count-objects -vH</code> to see loose vs packed object counts."}
    ]}
  ],
  challenges:[
    {q:"What are the four types of Git objects? List them separated by commas.",scenario:"Your team lead asks you to explain what Git actually stores internally. Name all four types.",hint:"The four building blocks: one stores file content, one stores directory listings, one stores snapshot metadata, one stores annotated pointers.",answer:"Answer: blob, tree, commit, tag. Blob stores file content, tree stores directory listings, commit stores snapshot metadata with parent pointers, and tag stores annotated pointers to other objects. Everything in Git is built from these four.",accept:["blob, tree, commit, tag","blob,tree,commit,tag","blob tree commit tag","commit, tree, blob, tag","tree, blob, commit, tag"],feedback:"The four Git object types: blob (file content), tree (directory listing — maps filenames to blob/tree hashes), commit (snapshot metadata + parent pointer + author + message), tag (annotated pointer to another object). Everything in Git is built from these four primitives."},
    {q:"Type the command to print the full contents of the HEAD commit object.",scenario:"You want to inspect exactly what data Git stores inside a commit — the tree hash, parent, author, and message.",hint:"Use 'git cat-file' with the -p flag (pretty-print) followed by HEAD.",answer:"Answer: git cat-file -p HEAD — The -p flag pretty-prints any Git object. For a commit you'll see: tree hash, parent hash, author/committer info, and the commit message.",accept:["git cat-file -p head","git cat-file -p HEAD","git cat-file --pretty head","git cat-file --pretty HEAD"],feedback:"git cat-file -p pretty-prints any Git object. On a commit you see: tree HASH, parent HASH, author name/email/timestamp, committer name/email/timestamp, and the commit message. This is the raw data Git stores."},
    {q:"Type the command to resolve the symbolic name 'main' to its full 40-character SHA-1 commit hash.",scenario:"You need the exact hash of the current tip of main for a script.",hint:"There's a plumbing command that translates names to hashes: 'git rev-parse'.",answer:"Answer: git rev-parse main — This plumbing command translates any ref, tag, branch name, or relative expression (HEAD~3) into its full SHA-1 hash. Essential for scripting.",accept:["git rev-parse main","git rev-parse main "],feedback:"git rev-parse translates any ref, tag, branch name, or relative expression (HEAD~3, main^2) into its full SHA-1 hash. Essential for scripting and automation around Git."}
  ]
},
{
  title:"Git Hooks",sub:"Automating quality gates at every stage of the workflow",
  sections:[
    {label:"What are hooks?",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Git hooks are executable scripts that run <strong>automatically</strong> at specific points in the Git lifecycle — before a commit, before a push, after a merge, etc. They let you enforce code quality, run tests, validate commit messages, and trigger deployments without anyone needing to remember to do it manually.</p>`,cards:[
      {title:"Client vs server hooks",body:"<strong>Client-side</strong> — run on your machine: <code>pre-commit</code>, <code>prepare-commit-msg</code>, <code>commit-msg</code>, <code>post-commit</code>, <code>pre-push</code>, <code>pre-rebase</code>. <strong>Server-side</strong> — run on the Git server: <code>pre-receive</code>, <code>update</code>, <code>post-receive</code>. Server hooks enforce policy for the whole team and can't be bypassed."},
      {title:"Real-world usage",body:"<code>pre-commit</code>: run linters (ESLint, Prettier, Black) and type-checkers. <code>commit-msg</code>: enforce Conventional Commits format. <code>pre-push</code>: run full test suite as a final gate. <code>post-receive</code>: trigger deployments on the server. In enterprise teams, hooks are the first line of quality defence."}
    ]},
    {label:"Where hooks live and how they work",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Hooks are executable scripts stored in <code>.git/hooks/</code>. Git ships sample hooks with every repo — rename them (remove <code>.sample</code>) and make them executable to activate:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># See the sample hooks Git provides</span>
ls .git/hooks/
<span class="cmt"># pre-commit.sample  commit-msg.sample  pre-push.sample ...</span>

<span class="cmt"># Create a pre-commit hook that runs linting</span>
cat > .git/hooks/pre-commit << <span class="str">'EOF'</span>
#!/bin/sh
npm run lint
if [ $? -ne 0 ]; then
  echo "Linting failed. Fix errors before committing."
  exit 1    <span class="cmt"># ← non-zero exit BLOCKS the commit</span>
fi
EOF
chmod +x .git/hooks/pre-commit
<span class="cmt"># Now every commit runs linting first</span>
<span class="cmt"># exit 0 = allow the operation</span>
<span class="cmt"># exit 1 (or any non-zero) = ABORT the operation</span>`}},
    {label:"Husky — shareable hooks for teams",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">The <code>.git/hooks/</code> directory is NOT tracked by Git (it's inside .git which is Git's own database). This means you can't share hooks with your team by committing them. <strong>Husky</strong> solves this by storing hooks in a <code>.husky/</code> directory at the repo root, which IS committed:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Install Husky</span>
npm install --save-dev husky
npx husky init

<span class="cmt"># Add a pre-commit hook</span>
echo "npm test" > .husky/pre-commit
chmod +x .husky/pre-commit

<span class="cmt"># Add a commit-msg hook (with commitlint)</span>
echo "npx commitlint --edit $1" > .husky/commit-msg
chmod +x .husky/commit-msg

<span class="cmt"># lint-staged: only lint files being committed (much faster)</span>
npm install --save-dev lint-staged
<span class="cmt"># .lintstagedrc.json:</span>
<span class="str">{ "*.{js,ts}": ["eslint --fix", "prettier --write"] }</span>`}},
    {label:"In the workplace",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>Interview tip:</strong> If asked about code quality automation, mention Git hooks + Husky + lint-staged. This combination runs linters only on staged files (fast), enforces commit message standards (commitlint), and runs tests before push (pre-push hook). It's the standard setup at most modern companies. Knowing how to set this up shows you understand quality engineering, not just feature development.</div></div>`}
  ],
  challenges:[
    {q:"Where does Git look for hook scripts on your local machine?",scenario:"You want to manually create a pre-commit hook without using Husky. Which directory do you create the script in?",hint:"Hooks live inside Git's own database directory, in a subdirectory named after what they are.",answer:"Answer: .git/hooks/ — Each hook is an executable file named after the event (pre-commit, commit-msg, pre-push). This directory is NOT committed to the repo, which is why tools like Husky exist.",accept:[".git/hooks",".git/hooks/",".git/hooks/ directory","the .git/hooks directory",".git/hooks directory","the hooks directory inside .git"],feedback:".git/hooks/ is where Git looks for hook scripts. Each hook is an executable file named after the hook event (pre-commit, commit-msg, etc.). This directory is NOT committed to the repo — use Husky to share hooks with your team."},
    {q:"Why can't you share Git hooks by committing the .git/hooks/ directory, and what tool solves this?",scenario:"Your team wants everyone to have the same pre-commit linting hook. Why doesn't just committing .git/hooks work?",hint:"The .git directory isn't tracked by Git itself. A popular npm tool named after a dog breed solves this.",answer:"Answer: The .git directory is not tracked by Git, so hooks can't be shared via commits. Husky solves this by storing hooks in a committed .husky/ directory and configuring Git to use them.",accept:["the .git directory is not tracked by git, husky solves this","git does not track the .git directory, husky","the .git folder is not committed, husky solves it","because .git is not tracked, husky","git doesn't track .git/hooks, husky",".git is not committed, use husky",".git/hooks is not tracked, husky solves this","the .git directory is ignored by git, husky","because .git is not part of the repo, husky fixes this","git does not track .git/hooks, husky is the solution","husky, because .git is not tracked","husky solves it because .git is not committed"],feedback:"The entire .git/ directory is excluded from Git tracking — it's Git's own database. Husky solves this by storing hooks in a .husky/ directory at the repo root, which IS committed and shared with everyone."},
    {q:"What exit code must a hook script return to ABORT the Git operation it's guarding?",scenario:"Your pre-commit hook detected a linting error. What must the script return to prevent the commit from happening?",hint:"Unix convention: 0 means success. Any other number means failure and stops the operation.",answer:"Answer: Any non-zero exit code (e.g. exit 1). In Unix convention, 0 = success (allow the operation), non-zero = failure (block it). A pre-commit hook returning exit 1 prevents the commit from being created.",accept:["1","exit 1","exit code 1","non-zero","any non-zero","non-zero exit code","a non-zero exit code"],feedback:"Any non-zero exit code from a hook script causes Git to abort the operation. Exit 0 means success (proceed). Exit 1 (or any non-zero) means failure (abort). This is standard Unix convention for all script exit codes."}
  ]
},
{
  title:"CI/CD with Git",sub:"GitHub Actions, GitLab CI — automating everything on push",
  sections:[
    {label:"What is CI/CD?",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">CI/CD automates the entire path from code commit to production deployment. Every push triggers automated testing, building, and (optionally) deploying — no human intervention needed. This is how modern teams ship software reliably:</p>`,cards:[
      {title:"Continuous Integration (CI)",body:"Every push triggers an automated pipeline that builds the code, runs tests, and reports pass/fail. Catches bugs before they reach main. The key principle: integrate early and often — don't let branches diverge for weeks."},
      {title:"Continuous Deployment (CD)",body:"After CI passes, code is automatically deployed to staging or production. Git events (push to main, merge PR, new tag) become deployment triggers. No manual 'click to deploy'. You push, tests pass, users see the change."},
      {title:"Why this matters for Git",body:"CI/CD turns Git into the single source of truth for what's deployed. Every deployment traces to a specific commit. Tags like <code>v1.2.3</code> mark exact release points. Rollbacks are as simple as deploying an older tag. <strong>Every company you'll work at uses CI/CD.</strong>"}
    ]},
    {label:"GitHub Actions — workflow anatomy",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">GitHub Actions uses YAML files in <code>.github/workflows/</code> to define automated pipelines. The <code>on</code> key defines which Git events trigger the workflow:</p>`,codeblock:{lang:"yaml",code:`<span class="cmt"># .github/workflows/ci.yml</span>
<span class="hl">name</span>: CI Pipeline

<span class="hl">on</span>:                            <span class="cmt"># WHEN does this run?</span>
  <span class="hl2">push</span>:
    <span class="hl3">branches</span>: [main, develop]   <span class="cmt"># on push to these branches</span>
  <span class="hl2">pull_request</span>:
    <span class="hl3">branches</span>: [main]            <span class="cmt"># on PR targeting main</span>

<span class="hl">jobs</span>:
  <span class="hl2">test</span>:
    <span class="hl3">runs-on</span>: ubuntu-latest      <span class="cmt"># runner environment</span>
    <span class="hl3">steps</span>:
      - <span class="hl">uses</span>: actions/checkout@v4  <span class="cmt"># checkout your code</span>
      - <span class="hl">uses</span>: actions/setup-node@v4
        <span class="hl">with</span>: { node-version: <span class="str">'20'</span> }
      - <span class="hl">run</span>: npm ci               <span class="cmt"># install dependencies</span>
      - <span class="hl">run</span>: npm test             <span class="cmt"># run tests</span>
      - <span class="hl">run</span>: npm run build        <span class="cmt"># build the project</span>`}},
    {label:"Tag-triggered deployments",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">A common pattern: pushing a version tag (like <code>v1.2.0</code>) triggers a production deployment automatically:</p>`,codeblock:{lang:"yaml",code:`<span class="cmt"># .github/workflows/deploy.yml</span>
<span class="hl">on</span>:
  <span class="hl2">push</span>:
    <span class="hl3">tags</span>: ['v*.*.*']            <span class="cmt"># only version tags</span>

<span class="hl">jobs</span>:
  <span class="hl2">deploy</span>:
    <span class="hl3">runs-on</span>: ubuntu-latest
    <span class="hl3">environment</span>: production
    <span class="hl3">steps</span>:
      - <span class="hl">uses</span>: actions/checkout@v4
      - <span class="hl">run</span>: ./scripts/deploy.sh
        <span class="hl">env</span>:
          <span class="hl3">DEPLOY_KEY</span>: <span class="str">\${{ secrets.DEPLOY_KEY }}</span>`}},
    {label:"CODEOWNERS — automated review assignment",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">The <code>CODEOWNERS</code> file automatically assigns reviewers based on which files are changed in a PR. Place it in <code>.github/</code>, the repo root, or <code>/docs/</code>:</p>`,codeblock:{lang:"text",code:`<span class="cmt"># .github/CODEOWNERS</span>
*               @org/platform-team    <span class="cmt"># default owners for everything</span>
/frontend/      @alice @bob           <span class="cmt"># frontend directory</span>
/backend/       @org/backend-team     <span class="cmt"># backend directory</span>
*.sql           @org/database-team    <span class="cmt"># all SQL files</span>
Dockerfile      @org/devops           <span class="cmt"># container config</span>
package.json    @org/security-team    <span class="cmt"># dependency changes</span>`}}
  ],
  challenges:[
    {q:"In a GitHub Actions workflow file, what key specifies WHEN the workflow runs (which Git events trigger it)?",scenario:"You're writing a CI workflow. What top-level YAML key defines the trigger events like 'push' and 'pull_request'?",hint:"It's a 2-letter YAML key. Think of the word for 'triggered by' or 'upon'.",answer:"Answer: on — Example: on: [push, pull_request]. The 'on' key defines which GitHub events trigger the workflow. Common triggers: push, pull_request, schedule, workflow_dispatch (manual).",accept:["on","\"on\"","'on'","the on key"],feedback:"The 'on' key defines workflow triggers. Common values: push, pull_request, schedule (cron), workflow_dispatch (manual trigger), release. You can filter by branch, tag pattern, or file path."},
    {q:"Where in a GitHub repository do you store GitHub Actions workflow YAML files?",scenario:"You want to add a CI pipeline. What directory path do you create the .yml file in?",hint:"The workflows directory lives inside a hidden directory named after the platform.",answer:"Answer: .github/workflows/ — All workflow YAML files must live in this specific directory. GitHub automatically detects and runs them based on their 'on:' trigger configuration.",accept:[".github/workflows",".github/workflows/","github/workflows",".github/workflows/ directory"],feedback:".github/workflows/ is the required directory. Every .yml or .yaml file in this directory becomes a separate workflow. GitHub automatically detects and runs them based on their 'on' triggers."},
    {q:"What file do you create to automatically assign code reviewers based on which files changed in a pull request?",scenario:"You want database team members automatically added as reviewers whenever any .sql file is modified in a PR.",hint:"The file name literally describes who owns the code. ALL CAPS, one word.",answer:"Answer: CODEOWNERS file. Place it in the repo root or .github/ directory. Each line maps a file pattern to GitHub usernames or teams. Example: *.js @frontend-team. PRs touching those files auto-request reviews.",accept:["codeowners",".github/codeowners","CODEOWNERS",".github/CODEOWNERS","the CODEOWNERS file","a CODEOWNERS file"],feedback:"CODEOWNERS maps file patterns to GitHub users or teams. When a PR changes matching files, those owners are automatically requested as reviewers. Combined with branch protection's 'Require review from Code Owners' setting, it enforces that the right people review the right code."}
  ]
},
{
  title:"Git LFS — Large File Storage",sub:"Versioning binaries, assets, and datasets without bloating your repo",
  sections:[
    {label:"The problem with large files",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Git stores every version of every file in its history. This works great for text files (code, config, docs) but is catastrophic for binary files:</p>`,cards:[
      {title:"Why Git hates binary files",body:"A 50MB Photoshop file edited 100 times = 5GB in your repo. Binary files don't delta-compress well (unlike text). Every <code>git clone</code> downloads the entire history. Your repo becomes unusably slow and massive."},
      {title:"What Git LFS does",body:"Git LFS replaces large files in your repo with tiny text pointer files (~1KB). The actual binary content is stored on a separate LFS server. When you checkout, LFS downloads only the version you need — not the entire history of every large file. Your repo stays small and fast."}
    ]},
    {label:"Setting up Git LFS",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Install LFS once per machine, then configure which file types to track per repository:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Install Git LFS (once per machine)</span>
brew install git-lfs          <span class="cmt"># macOS</span>
sudo apt-get install git-lfs  <span class="cmt"># Ubuntu</span>
<span class="hl">git lfs</span> install              <span class="cmt"># enable in your git config</span>

<span class="cmt"># Tell LFS which file types to manage (per repo)</span>
<span class="hl">git lfs</span> track <span class="str">"*.psd"</span>       <span class="cmt"># Photoshop files</span>
<span class="hl">git lfs</span> track <span class="str">"*.mp4"</span>       <span class="cmt"># video files</span>
<span class="hl">git lfs</span> track <span class="str">"*.zip"</span>       <span class="cmt"># archives</span>

<span class="cmt"># ⚠️ CRITICAL: commit .gitattributes — this shares the config</span>
<span class="hl">git add</span> .gitattributes
<span class="hl">git commit</span> -m <span class="str">"Track large files with LFS"</span>

<span class="cmt"># Normal workflow from here — LFS is transparent</span>
<span class="hl">git add</span> design.psd
<span class="hl">git commit</span> -m <span class="str">"Add design mockup"</span>
<span class="hl">git push</span>   <span class="cmt"># LFS uploads automatically</span>`}},
    {label:"LFS management and CI optimisation",codeblock:{lang:"bash",code:`<span class="cmt"># List all LFS-tracked files</span>
<span class="hl">git lfs</span> ls-files

<span class="cmt"># Check current tracking patterns</span>
<span class="hl">git lfs</span> track

<span class="cmt"># Clone WITHOUT downloading LFS files (fast CI clones)</span>
<span class="hl">GIT_LFS_SKIP_SMUDGE</span>=1 git clone URL
<span class="cmt"># Gets pointer files only — binary content skipped</span>
<span class="cmt"># Essential for CI pipelines that don't need assets</span>`}},
    {label:"The .gitattributes file",cards:[
      {title:"What LFS creates",body:"<code>git lfs track</code> writes rules to <code>.gitattributes</code>: <code>*.psd filter=lfs diff=lfs merge=lfs -text</code>. <strong>This file MUST be committed and pushed</strong> so everyone on the team uses LFS for those file types. Without it, teammates get raw pointer files instead of actual content."},
      {title:"Platform limits",body:"GitHub LFS: 2GB per file, 1GB free storage/bandwidth per month. GitLab: configurable per-project. Self-hosted: requires an LFS server (MinIO, Gitea, Artifactory)."}
    ]}
  ],
  challenges:[
    {q:"Type the command to tell Git LFS to track all files with a .psd extension.",scenario:"Your design team is adding Photoshop files to the repo. You need to configure LFS before they push.",hint:"The command is 'git lfs track' followed by a glob pattern in quotes.",answer:"Answer: git lfs track \"*.psd\" — This writes a rule to .gitattributes telling Git LFS to manage all .psd files. The quotes prevent shell glob expansion. You must commit .gitattributes to share the config.",accept:["git lfs track \"*.psd\"","git lfs track '*.psd'","git lfs track *.psd"],feedback:"git lfs track adds a pattern to .gitattributes. Remember to commit .gitattributes so every team member's Git installation knows to use LFS for those files."},
    {q:"After setting up LFS tracking, which file must you commit to share the LFS configuration with your team?",scenario:"You've run git lfs track on several patterns. What file do you need to add and commit?",hint:"LFS writes its tracking rules into a file that controls per-file Git attributes.",answer:"Answer: .gitattributes — Git LFS writes its tracking rules here. Without committing this file, teammates cloning the repo won't know which files are LFS-managed and will get pointer files instead of actual content.",accept:[".gitattributes","gitattributes",".gitattributes file","the .gitattributes file"],feedback:".gitattributes stores LFS filter rules. It must be committed and pushed so every team member's Git knows which files to handle through LFS. Without it, others just get pointer files."},
    {q:"Type the environment variable to clone a repo WITHOUT downloading LFS binary files — useful for CI pipelines that don't need assets.",scenario:"Your CI build pipeline doesn't need design assets and you want the clone to be as fast as possible.",hint:"Set an environment variable to skip the LFS download step. The variable name includes 'SKIP_SMUDGE'.",answer:"Answer: GIT_LFS_SKIP_SMUDGE=1 git clone <url> — This tells LFS to skip downloading binary content during clone. You get pointer files only. Essential for CI pipelines.",accept:["git_lfs_skip_smudge=1 git clone","GIT_LFS_SKIP_SMUDGE=1 git clone","GIT_LFS_SKIP_SMUDGE=1","git_lfs_skip_smudge=1","GIT_LFS_SKIP_SMUDGE=1 git clone url","set GIT_LFS_SKIP_SMUDGE=1 before git clone","GIT_LFS_SKIP_SMUDGE = 1"],feedback:"GIT_LFS_SKIP_SMUDGE=1 tells LFS to skip downloading binary content — you get pointer files instead. Dramatically reduces clone time and bandwidth for CI environments that only need code."}
  ]
},
{
  title:"Monorepo Strategies",sub:"Sparse checkout, partial clone, and managing massive repositories",
  sections:[
    {label:"What is a monorepo?",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">A monorepo stores multiple related projects (frontend, backend, shared libraries, mobile apps) in a single Git repository. Used by Google, Meta, Microsoft, Airbnb, and many large engineering teams:</p>`,cards:[
      {title:"Benefits",body:"Atomic cross-project commits (change API + client in one commit). Shared tooling and config. Single source of truth. Easier dependency management between packages. Unified CI/CD pipeline."},
      {title:"The scale challenge",body:"Monorepos can have millions of files and gigabytes of history. A normal <code>git clone</code> becomes impractical. You need strategies to check out only what you need and download only relevant history."}
    ]},
    {label:"Sparse checkout — work with only part of the repo",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Sparse checkout lets you populate your working directory with only specific directories from a monorepo. Files outside your selection don't exist on disk:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Enable sparse checkout in cone mode (directory-based, fast)</span>
<span class="hl">git sparse-checkout</span> init --cone

<span class="cmt"># Specify which directories you want</span>
<span class="hl">git sparse-checkout</span> set packages/frontend packages/shared

<span class="cmt"># Add more directories later</span>
<span class="hl">git sparse-checkout</span> add packages/api

<span class="cmt"># List what's currently checked out</span>
<span class="hl">git sparse-checkout</span> list

<span class="cmt"># Disable (restore full checkout)</span>
<span class="hl">git sparse-checkout</span> disable`}},
    {label:"Partial clone — download only what you touch",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Partial clone downloads metadata (commits, trees) but skips file content until you actually need it:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Blobless clone — metadata only, blobs fetched on-demand</span>
<span class="hl">git clone</span> --filter=blob:none URL

<span class="cmt"># Shallow clone — only recent history</span>
<span class="hl">git clone</span> --depth 50 URL

<span class="cmt"># Combine sparse + partial for maximum speed</span>
<span class="hl">git clone</span> --filter=blob:none --no-checkout URL
<span class="hl">git sparse-checkout</span> init --cone
<span class="hl">git sparse-checkout</span> set my-package`}},
    {label:"Submodule vs subtree",cards:[
      {title:"git submodule",body:"Keeps repos separate — stores a pointer (commit hash) to a specific commit in an external repo. The two repos remain independent. Requires <code>git submodule init</code> and <code>git submodule update</code> after cloning. More complex but maintains clean separation."},
      {title:"git subtree",body:"Physically copies the external repo's content and history into a subdirectory of your repo. Simpler for contributors (no extra init commands). But it bloats your repo with the external repo's history. Better for small, stable dependencies."}
    ]}
  ],
  challenges:[
    {q:"Type the git clone flag that downloads only commit metadata without any file blobs, fetching file content on-demand instead.",scenario:"You're setting up a developer machine to work on a 50GB monorepo. You only need a few packages.",hint:"It's a --filter flag with a value that excludes blobs (file content).",answer:"Answer: --filter=blob:none — This enables a 'blobless' partial clone. Git downloads commits and trees but fetches file content on-demand when you checkout. Dramatically speeds up cloning large repos.",accept:["--filter=blob:none","--filter blob:none"],feedback:"--filter=blob:none creates a 'blobless clone' — Git downloads commits and tree objects but skips file blobs until you actually checkout files that need them. Dramatically speeds up cloning large repos."},
    {q:"Type the two commands needed to enable sparse checkout in cone mode and then set it to only include the 'apps/web' directory.",scenario:"After a blobless clone, you want to narrow your working directory to just the frontend app.",hint:"Two commands: 'git sparse-checkout init --cone' then 'git sparse-checkout set <directory>'.",answer:"Answer: git sparse-checkout init --cone then git sparse-checkout set apps/web — Sparse checkout lets you work with only a subset of a monorepo. Cone mode is faster and only allows directory-based patterns.",accept:["git sparse-checkout init --cone\ngit sparse-checkout set apps/web","git sparse-checkout init --cone\ngit sparse-checkout set apps/web "],feedback:"git sparse-checkout init --cone enables directory-based sparse checkout. git sparse-checkout set specifies which directories to populate. Everything else stays absent from your working directory."},
    {q:"What is the difference between git submodule and git subtree?",scenario:"Your team is debating how to share a common library across multiple repos.",hint:"One keeps repos separate with pointer references. The other physically copies content into your repo.",answer:"Answer: Submodule keeps repos separate — it stores a pointer (commit hash) to an external repo. Subtree physically copies the external repo's content and history into your repo. Submodule is lighter but more complex; subtree is simpler but bloats your repo.",accept:["submodule keeps repos separate with pointers, subtree merges content directly","submodule references external repos as pointers, subtree copies their content into your repo","submodule uses pointer references to external repos, subtree merges history inline","submodules reference external repos independently, subtree embeds the content directly","submodule links to external repos, subtree copies content into yours","submodule is a pointer to another repo, subtree merges it in","submodule keeps repos independent, subtree merges them together","submodule uses references, subtree copies content","submodule points to external repos, subtree embeds them","submodules are pointers to other repos, subtrees merge content in"],feedback:"Submodule stores a pointer to a specific commit in another repo — repos stay independent. Subtree copies content directly into a subdirectory, merging history. Subtree is simpler for contributors. Submodule maintains clean separation."}
  ]
},
{
  title:"Git Security",sub:"GPG signing, secret scanning, SSH hardening",
  sections:[
    {label:"Why sign commits?",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Git commit author info (name and email) is just configuration — anyone can set <code>user.email</code> to anyone else's address and commit 'as' them. A <strong>signed commit</strong> proves the commit was actually made by someone who possesses a specific cryptographic key. GitHub shows a green 'Verified' badge on signed commits.</p>`,cards:[
      {title:"GPG vs SSH signing",body:"Git supports both GPG keys and SSH keys for signing. <strong>SSH signing</strong> (Git 2.34+) is simpler — you likely already have an SSH key. <strong>GPG signing</strong> is the older standard, supported everywhere. Both produce a 'Verified' badge on GitHub."}
    ]},
    {label:"Setting up commit signing",codeblock:{lang:"bash",code:`<span class="cmt"># SSH SIGNING (simpler, Git 2.34+)</span>
<span class="hl">git config</span> --global gpg.format ssh
<span class="hl">git config</span> --global user.signingkey ~/.ssh/id_ed25519.pub
<span class="hl">git config</span> --global commit.gpgsign true

<span class="cmt"># GPG SIGNING (traditional)</span>
gpg --full-generate-key
gpg --list-secret-keys --keyid-format=long
<span class="hl">git config</span> --global user.signingkey YOUR_KEY_ID
<span class="hl">git config</span> --global commit.gpgsign true

<span class="cmt"># Verify commit signatures</span>
<span class="hl">git verify-commit</span> HEAD
<span class="hl">git log</span> --show-signature
<span class="cmt"># Shows 'Good signature from...' or 'No signature'</span>`}},
    {label:"Secret scanning — keeping credentials out",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Accidentally committing secrets (API keys, passwords, tokens) is one of the most dangerous and common mistakes. Here's the detect → prevent → remove workflow:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># DETECT — scan for secrets in your repo</span>
brew install gitleaks
gitleaks detect --source . --verbose

<span class="cmt"># PREVENT — pre-commit hook blocks secrets before commit</span>
<span class="cmt"># Add to .husky/pre-commit:</span>
gitleaks protect --staged --redact

<span class="cmt"># REMOVE — if already pushed (use BFG Repo Cleaner)</span>
java -jar bfg.jar --delete-files .env
<span class="hl">git reflog</span> expire --expire=now --all
<span class="hl">git gc</span> --prune=now --aggressive
<span class="hl">git push</span> --force

<span class="cmt"># ⚠️ FIRST: REVOKE the exposed secret immediately</span>
<span class="cmt"># Git cleanup alone does NOT protect you — the secret</span>
<span class="cmt"># was already exposed during the window it was public</span>`}},
    {label:"SSH key best practices",codeblock:{lang:"bash",code:`<span class="cmt"># Use Ed25519 keys (stronger than RSA, shorter)</span>
ssh-keygen -t ed25519 -C <span class="str">"work@company.com"</span>

<span class="cmt"># Multiple SSH keys for different accounts</span>
<span class="cmt"># ~/.ssh/config:</span>
<span class="cmt"># Host github-work</span>
<span class="cmt">#   HostName github.com</span>
<span class="cmt">#   User git</span>
<span class="cmt">#   IdentityFile ~/.ssh/id_ed25519_work</span>`}}
  ],
  challenges:[
    {q:"Type the git config command to make Git automatically sign ALL commits using GPG by default.",scenario:"Your company's security policy requires all commits to be signed. You want to enable this globally.",hint:"It's a git config setting: commit.gpgsign set to true.",answer:"Answer: git config --global commit.gpgsign true — This makes Git automatically sign every commit with your configured signing key. You also need to set user.signingkey to your key ID.",accept:["git config --global commit.gpgsign true","git config --global commit.gpgsign true ","git config --global commit.gpgsign 1"],feedback:"commit.gpgsign true makes Git sign every commit automatically. Without this, you'd need to add -S to every commit command. Set this globally so it applies to all repos."},
    {q:"A secret API key was committed and pushed 3 commits ago. What is the FIRST thing you must do, before even cleaning the Git history?",scenario:"You just discovered AWS_SECRET_KEY was committed to a public repo. What's the immediate priority?",hint:"Before ANY Git cleanup: immediately invalidate the exposed credential so it can't be used.",answer:"Answer: Revoke/rotate the secret immediately. Before any Git cleanup, the exposed credential must be invalidated because it's already in the remote's history and may have been pulled by others.",accept:["revoke the secret","revoke or rotate the secret","invalidate the secret","rotate the key","revoke the key","revoke and rotate the exposed secret","revoke the exposed credential"],feedback:"ALWAYS revoke/rotate the exposed secret first. Git history cleaning takes time and even after rewriting history, the secret was already exposed. Treat it as compromised the moment it was pushed."},
    {q:"Type the git log flag that shows the GPG/SSH signature verification status alongside each commit.",scenario:"You want to audit recent commits to confirm they all have verified signatures.",hint:"There's a --show-signature flag for git log that displays verification status.",answer:"Answer: --show-signature — Use with git log: git log --show-signature. Each commit shows 'Good signature from...' or 'No signature'. Essential for security audits.",accept:["--show-signature","--show-signature "],feedback:"git log --show-signature shows signature status for each commit. Use this for security audits to ensure all commits are properly signed by verified team members."}
  ]
},
{
  title:"Advanced Log & Forensics",sub:"Mastering git log, diff, and blame for deep investigation",
  sections:[
    {label:"git log — the full power",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git log</code> has dozens of filtering and formatting options. Mastering them makes you a code archaeologist — able to trace any change, find any bug's origin, and audit any file's history:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Filter by author, message, date, or file</span>
<span class="hl">git log</span> --author=<span class="str">"Alice"</span>
<span class="hl">git log</span> --grep=<span class="str">"JIRA-1234"</span>        <span class="cmt"># search commit messages</span>
<span class="hl">git log</span> --since=<span class="str">"2 weeks ago"</span>
<span class="hl">git log</span> -- path/to/file.js        <span class="cmt"># history of one file</span>
<span class="hl">git log</span> --follow -- old-name.js   <span class="cmt"># follow renames</span>

<span class="cmt"># Pickaxe — find when a string was added/removed</span>
<span class="hl">git log</span> -S <span class="str">"password"</span>             <span class="cmt"># literal string</span>
<span class="hl">git log</span> -G <span class="str">"api_key.*="</span>           <span class="cmt"># regex pattern</span>

<span class="cmt"># Custom formatting</span>
<span class="hl">git log</span> --pretty=format:<span class="str">"%h %an %ar %s"</span>
<span class="cmt"># %h=short hash %H=full hash %s=subject %an=author</span>
<span class="cmt"># %ae=email %ar=relative date %aI=ISO date %d=refs</span>

<span class="cmt"># Stats</span>
<span class="hl">git log</span> --stat                    <span class="cmt"># files changed summary</span>
<span class="hl">git shortlog</span> -sne                 <span class="cmt"># commits per author</span>`}},
    {label:"Advanced diff and blame",codeblock:{lang:"bash",code:`<span class="cmt"># Word-level diff (more readable for prose/config changes)</span>
<span class="hl">git diff</span> --word-diff

<span class="cmt"># Ignore whitespace changes</span>
<span class="hl">git diff</span> -w

<span class="cmt"># Show only names of changed files between branches</span>
<span class="hl">git diff</span> --name-only main..feature

<span class="cmt"># Blame — ignore bulk formatting commits</span>
<span class="hl">git blame</span> -w app.js              <span class="cmt"># ignore whitespace commits</span>
<span class="hl">git blame</span> -M app.js              <span class="cmt"># detect moved lines</span>
<span class="hl">git blame</span> -C app.js              <span class="cmt"># detect lines copied from other files</span>

<span class="cmt"># Skip formatting commits in blame</span>
<span class="cmt"># Create .git-blame-ignore-revs with commit hashes to skip</span>
<span class="hl">git config</span> blame.ignoreRevsFile .git-blame-ignore-revs`}},
    {label:"rerere — Reuse Recorded Resolutions",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>rerere</code> (Reuse Recorded Resolution) remembers how you resolved a conflict and automatically applies the same resolution next time. Huge time-saver on teams that do frequent rebases:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Enable rerere globally</span>
<span class="hl">git config</span> --global rerere.enabled true

<span class="cmt"># When you resolve a conflict, rerere records it</span>
<span class="cmt"># Next time the same conflict appears:</span>
<span class="cmt"># Git applies your previous resolution automatically</span>

<span class="hl">git rerere</span> status                <span class="cmt"># show recorded resolutions</span>
<span class="hl">git rerere</span> diff                  <span class="cmt"># show what rerere will apply</span>
<span class="hl">git rerere</span> forget path/to/file   <span class="cmt"># forget a resolution</span>`}}
  ],
  challenges:[
    {q:"Type the git log flag that tracks a file's history even across renames.",scenario:"A file was renamed from 'utils.js' to 'helpers.js' 20 commits ago. You want to see its complete history including before the rename.",hint:"A single flag that tells git log to trace the file through rename operations.",answer:"Answer: --follow — Use with git log: git log --follow filename. Without this flag, git log stops at the rename event. With it, Git traces the file through renames to show full history.",accept:["--follow","--follow "],feedback:"git log --follow -- filename traces a file's history through renames. Without --follow, log stops at the rename and you lose older history. Always use --follow when investigating a file that may have been renamed."},
    {q:"Type the git log flag and pattern to find every commit where the string 'DROP TABLE' was either added or removed from any file.",scenario:"Security audit: you need to find every commit in history that touched any SQL DROP TABLE statement.",hint:"The -S flag (called the 'pickaxe') searches for when a string was added or removed in diffs.",answer:"Answer: git log -S \"DROP TABLE\" — The -S flag (the 'pickaxe') searches for commits where the string was added or removed. It's not a grep — it finds commits that changed the count of that string.",accept:["git log -s \"drop table\"","-s \"DROP TABLE\"","-S \"DROP TABLE\"","-S 'DROP TABLE'","git log -s 'drop table'","git log -S \"DROP TABLE\"","git log -S 'DROP TABLE'","--pickaxe -s drop table"],feedback:"The -S flag (pickaxe) finds commits where a string was added or removed in the diff. Different from --grep which searches commit messages. Use -G for regex patterns."},
    {q:"What git config setting enables automatic reuse of previously recorded conflict resolutions?",scenario:"Your team frequently rebases long-running branches and resolves the same conflicts repeatedly.",hint:"The feature is called 'rerere' — Reuse Recorded Resolution. It's a config setting.",answer:"Answer: rerere.enabled true — Set with: git config --global rerere.enabled true. 'rerere' stands for 'Reuse Recorded Resolution'. Git remembers your conflict resolutions and reapplies them automatically.",accept:["rerere.enabled true","rerere.enabled = true","git config rerere.enabled true","git config --global rerere.enabled true","rerere.enabled","rerere","git rerere","rerere enabled true","rerere.enabled=true"],feedback:"rerere records the before/after state of every conflict you resolve. Next time Git encounters the identical conflict, it applies your resolution automatically. Huge time-saver on teams with frequent rebases."}
  ]
},
{
  title:"Repository Maintenance",sub:"gc, fsck, prune, bundle — keeping your repo healthy and fast",
  sections:[
    {label:"Why maintenance matters",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Over time, Git repos accumulate loose objects, stale refs, and unreachable commits. Maintenance commands keep your repo fast, small, and healthy. You'll also need these after history rewrites (BFG, filter-repo) to actually reclaim disk space.</p>`},
    {label:"git gc — garbage collection",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git gc</code> is Git's cleanup command — it packs loose objects, removes unreachable ones, and compresses the repo:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Standard cleanup (Git runs this automatically sometimes)</span>
<span class="hl">git gc</span>

<span class="cmt"># Aggressive — deeper compression, slower but smaller repo</span>
<span class="hl">git gc</span> --aggressive

<span class="cmt"># Prune unreachable objects immediately (no grace period)</span>
<span class="hl">git gc</span> --prune=now

<span class="cmt"># Combine for maximum cleanup (after history rewrites)</span>
<span class="hl">git gc</span> --aggressive --prune=now

<span class="cmt"># See repo size before/after</span>
<span class="hl">git count-objects</span> -vH`}},
    {label:"git fsck — filesystem integrity check",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git fsck</code> (filesystem check) walks every object in the database and verifies integrity. It reports corruption, dangling objects, and broken links:</p>`,codeblock:{lang:"bash",code:`<span class="hl">git fsck</span>
<span class="cmt"># Reports: dangling commits, broken links, corrupt objects</span>
<span class="cmt"># "dangling commit" = a commit no ref points to (orphaned)</span>

<span class="hl">git fsck</span> --lost-found          <span class="cmt"># write dangling objects to .git/lost-found/</span>
<span class="hl">git fsck</span> --unreachable         <span class="cmt"># list all unreachable objects</span>

<span class="cmt"># Recover a dangling commit:</span>
<span class="hl">git show</span> DANGLING_HASH
<span class="hl">git branch</span> recovered DANGLING_HASH`}},
    {label:"git bundle — offline transfers",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px"><code>git bundle</code> packages an entire repo (or selected refs) into a single portable file. The recipient can clone or fetch from it without any network connection:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Bundle the entire repo into one file</span>
<span class="hl">git bundle</span> create backup.bundle --all

<span class="cmt"># Clone FROM a bundle (no network needed)</span>
<span class="hl">git clone</span> backup.bundle my-repo

<span class="cmt"># Incremental bundle (only new commits since a tag)</span>
<span class="hl">git bundle</span> create update.bundle v1.0.0..HEAD

<span class="cmt"># Verify a bundle is valid</span>
<span class="hl">git bundle</span> verify backup.bundle`}}
  ],
  challenges:[
    {q:"Type the command to run an aggressive garbage collection AND prune all unreachable objects immediately.",scenario:"You just rewrote history with BFG to remove secrets. You need to actually shrink the repo size now.",hint:"Combine --aggressive for deep compression with --prune=now to remove unreachable objects immediately.",answer:"Answer: git gc --aggressive --prune=now — --aggressive does deeper compression (slower but smaller repo), --prune=now removes unreachable objects immediately instead of waiting the default 2-week grace period.",accept:["git gc --prune=now --aggressive","git gc --aggressive --prune=now"],feedback:"git gc --aggressive --prune=now does deep compression and removes all unreachable objects immediately. Essential after history rewrites to actually reclaim disk space."},
    {q:"Type the command to verify the integrity of all objects in your Git database and report any corruption.",scenario:"A developer reports their clone seems corrupted. What diagnostic command do you run?",hint:"The command stands for 'filesystem check' — abbreviated to four letters.",answer:"Answer: git fsck — Short for 'filesystem check'. Walks every object in the database and reports corruption, dangling objects, or missing references.",accept:["git fsck","git fsck ","git fsck --full"],feedback:"git fsck walks every object in the Git database and verifies all pointers are valid and no objects are corrupt. Also reports 'dangling' objects — commits or blobs that exist but aren't reachable from any ref."},
    {q:"Type the command to create a portable bundle file called 'backup.bundle' containing the entire repository including all branches.",scenario:"You need to send a complete copy of a repo to a colleague who has no internet access.",hint:"Use 'git bundle create' with --all to include everything.",answer:"Answer: git bundle create backup.bundle --all — Bundles the entire repo into a single file that can be cloned from. Perfect for air-gapped environments and offline transfers.",accept:["git bundle create backup.bundle --all","git bundle create backup.bundle --all "],feedback:"git bundle create packs the entire repo into a single file. --all includes every ref. The recipient can git clone backup.bundle to use it. Perfect for air-gapped environments."}
  ]
},
{
  title:"Enterprise Platforms",sub:"GitHub Enterprise, GitLab, branch protection, audit logs",
  sections:[
    {label:"Branch protection rules",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Branch protection prevents accidental (or malicious) changes to critical branches. Every enterprise team uses these:</p>`,cards:[
      {title:"Key settings",body:"<strong>Require pull request:</strong> No direct pushes to main.<br><strong>Require reviews:</strong> 1-2 team members must approve.<br><strong>Require CI to pass:</strong> Tests must be green before merge.<br><strong>Require up-to-date branch:</strong> Must be rebased on latest main.<br><strong>Require signed commits:</strong> Only verified commits accepted.<br><strong>Block force push:</strong> Prevent history rewriting on protected branches."}
    ]},
    {label:"CODEOWNERS — detailed setup",codeblock:{lang:"text",code:`<span class="cmt"># .github/CODEOWNERS</span>
* @org/platform-team            <span class="cmt"># default owners</span>
/frontend/          @alice @bob
/backend/           @org/backend-team
*.sql               @org/database-team
Dockerfile          @org/devops
.github/workflows/  @org/devops
package.json        @org/security-team`}},
    {label:"Merge strategies",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">GitHub/GitLab offer three merge strategies for pull requests. Teams typically enforce one strategy for consistency:</p>`,cards:[
      {title:"Merge commit",body:"Creates a merge commit with two parents. Preserves full branch history — every individual commit from the PR is visible on main. Shows exactly when features were integrated. Can make history complex."},
      {title:"Squash and merge",body:"Combines all PR commits into a single commit on main. Produces the cleanest main history — one commit per feature/fix. Many enterprise teams enforce squash-only. Ideal for trunk-based development."},
      {title:"Rebase and merge",body:"Replays PR commits linearly on top of main without a merge commit. Each commit appears individually but with new hashes. History is linear but preserves the granularity of the original commits."}
    ]},
    {label:"Audit logs and compliance",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">For regulated industries (finance, healthcare, government), every change must be traceable. Git provides this natively:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Machine-readable audit log from git log</span>
<span class="hl">git log</span> --format=<span class="str">"%H|%aI|%ae|%s"</span> --all
<span class="cmt"># %H=full hash  %aI=ISO date  %ae=email  %s=subject</span>
<span class="cmt"># Pipe to a file: git log --format="..." --all > audit.csv</span>

<span class="cmt"># GitHub Audit Log (org level, admin only)</span>
<span class="cmt"># Records: pushes, PR merges, permission changes, secret alerts</span>
<span class="cmt"># Exportable via API for SIEM integration</span>`}},
    {label:"In the workplace",content:`<div class="info"><div class="callout-icon">💡</div><div><strong>You've completed all 25 enterprise phases.</strong> You now understand Git at a level that goes well beyond daily development — internals, security, CI/CD, monorepo strategies, and platform administration. This knowledge prepares you for senior developer, DevOps, and engineering lead roles. The remaining 3 phases cover platform-specific setup (GitHub, GitLab, Bitbucket) to round out your practical skills.</div></div>`}
  ],
  challenges:[
    {q:"What file do you create to automatically request reviews from specific people or teams when certain files change in a PR?",scenario:"Your org requires the database team to review every migration file. How do you enforce this automatically?",hint:"The file name literally describes who owns the code. ALL CAPS, one word.",answer:"Answer: CODEOWNERS file. Place it in the repo root or .github/ directory. Each line maps a file pattern to reviewers — e.g. /src/api/ @backend-team. GitHub auto-assigns reviewers when PRs touch matching paths.",accept:["codeowners","CODEOWNERS",".github/codeowners",".github/CODEOWNERS","the CODEOWNERS file","a CODEOWNERS file"],feedback:"CODEOWNERS maps file patterns to GitHub users or teams. When a PR modifies matching files, those owners are automatically requested as reviewers. Combine with branch protection to make it mandatory."},
    {q:"Name the THREE recommended merge strategies available on GitHub for merging pull requests.",scenario:"Your engineering manager asks you to explain the options and recommend one for trunk-based development.",hint:"Think: full merge commit, squash everything into one, or replay commits linearly.",answer:"Answer: Merge commit, squash and merge, rebase and merge. Merge commit preserves full branch history. Squash condenses all branch commits into one. Rebase replays commits linearly. Each has trade-offs.",accept:["merge commit, squash and merge, rebase and merge","merge commit squash and merge rebase and merge","squash and merge, merge commit, rebase and merge","merge, squash, rebase","squash merge rebase","create a merge commit, squash and merge, rebase and merge","merge squash rebase","merge commit, squash, rebase","squash and merge, rebase and merge, merge commit","rebase and merge, squash and merge, merge commit","merge, squash and merge, rebase and merge","regular merge, squash merge, rebase merge"],feedback:"Merge commit preserves all PR commits. Squash combines into one clean commit on main. Rebase replays linearly. Most enterprise teams enforce squash-only for a clean main history."},
    {q:"Type the git log format string to output commits with their full hash, ISO 8601 timestamp, author email, and subject — suitable for an audit log export.",scenario:"Your security team needs a machine-readable audit trail of all commits across all branches.",hint:"Use --format with placeholders: %H (hash), %aI (ISO date), %ae (email), %s (subject). Add --all for every branch.",answer:"Answer: git log --format='%H|%aI|%ae|%s' --all — Placeholders: %H = full hash, %aI = ISO date, %ae = author email, %s = subject. The --all flag includes every branch. Pipe to scripts for reporting.",accept:["git log --format=\"%h %ai %ae %s\" --all","git log --format=\"%H %aI %ae %s\" --all","git log --format='%H %aI %ae %s' --all","git log --format='%h %aI %ae %s' --all","--format=\"%h %ai %ae %s\" --all","--format=\"%H %aI %ae %s\" --all"],feedback:"%H = full hash, %aI = ISO 8601 date, %ae = author email, %s = subject. --all includes every branch and tag. Pipe output to a file or SIEM system for compliance logging."}
  ]
}
);