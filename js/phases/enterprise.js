// GitCoven — Enterprise — Phases 17-25
// This file contains phases 17-25

phases.push(
{
  title:"Git Internals",sub:"Blobs, trees, commits, refs — how Git actually works under the hood",
  sections:[
    {label:"Git is a content-addressable filesystem",cards:[
      {title:"Everything is an object",body:"At its core, Git stores everything as objects in the <code>.git/objects</code> directory. Every file, every directory snapshot, every commit — each becomes a compressed, SHA-1-hashed object. The same content always produces the same hash — Git never stores duplicates."},
      {title:"Four object types",body:"<strong style='font-weight:500'>blob</strong> — stores file content (no filename). <strong style='font-weight:500'>tree</strong> — stores a directory listing (filenames + blob/tree pointers). <strong style='font-weight:500'>commit</strong> — stores a tree pointer + parent pointer + author + message. <strong style='font-weight:500'>tag</strong> — stores a pointer to another object with metadata."}
    ]},
    {label:"The object model",content:`<div class="diagram"><div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--text1);line-height:2">
<div><span style="color:var(--accent-purple)">commit a1b2c3</span> → tree <span style="color:var(--accent-orange)">f4e5d6</span> → tree <span style="color:var(--accent-blue)">src/</span> → blob <span style="color:var(--accent)">index.js content</span></div>
<div style="margin-left:120px">→ blob <span style="color:var(--accent)">README.md content</span></div>
<div><span style="color:var(--text3)">parent ↑</span></div>
<div><span style="color:var(--accent-purple)">commit 9i8h7g</span> → tree <span style="color:var(--accent-orange)">prev snapshot...</span></div>
</div></div>`},
    {label:"Inspecting objects directly",codeblock:{lang:"bash",code:`<span class="cmt"># Inspect any object by its hash</span>
<span class="hl">git cat-file</span> -t HEAD          <span class="cmt"># type: commit</span>
<span class="hl">git cat-file</span> -p HEAD          <span class="cmt"># print the commit object</span>
<span class="hl">git cat-file</span> -p HEAD^{tree}   <span class="cmt"># print the root tree</span>
<span class="hl">git cat-file</span> -p a1b2c3d       <span class="cmt"># any hash</span>

<span class="cmt"># Write a blob directly (plumbing command)</span>
<span class="hl">echo</span> <span class="str">"hello"</span> | <span class="hl">git hash-object</span> --stdin
<span class="cmt"># → ce013625030ba8dba906f756967f9e9ca394464a</span>
<span class="hl">echo</span> <span class="str">"hello"</span> | <span class="hl">git hash-object</span> -w --stdin
<span class="cmt"># -w actually writes it to .git/objects</span>

<span class="cmt"># List all objects in the repo</span>
<span class="hl">git cat-file</span> --batch-all-objects --batch-check</span>

<span class="cmt"># See how an object is stored on disk</span>
ls .git/objects/ce/013625030ba8dba906f756967f9e9ca394464a</span>`}},
    {label:"Refs — human-readable pointers",codeblock:{lang:"bash",code:`<span class="cmt"># Refs are files in .git/refs/ containing a commit hash</span>
cat .git/refs/heads/main        <span class="cmt"># → a1b2c3d...</span>
cat .git/HEAD                   <span class="cmt"># → ref: refs/heads/main</span>
cat .git/refs/remotes/origin/main

<span class="cmt"># Symbolic refs (like HEAD) point to other refs</span>
<span class="hl">git symbolic-ref</span> HEAD           <span class="cmt"># → refs/heads/main</span>

<span class="cmt"># Packed refs — for repos with many refs</span>
cat .git/packed-refs</span>

<span class="cmt"># Resolve any ref to its commit hash</span>
<span class="hl">git rev-parse</span> HEAD
<span class="hl">git rev-parse</span> main
<span class="hl">git rev-parse</span> v1.0.0</span>`}},
    {label:"Packfiles — compression at scale",cards:[
      {title:"Loose objects vs packfiles",body:"Initially, each object is stored as a separate file (loose). When there are too many, Git runs <code>git gc</code> which packs them into a single <code>.pack</code> file with a <code>.idx</code> index. Packfiles use delta compression — storing only the differences between similar objects."},
      {title:"Why this matters",body:"Understanding packfiles explains why Git repos are small despite storing complete history, why <code>git clone</code> is fast, and how <code>git gc</code> optimises repo size. Run <code>git count-objects -vH</code> to see loose vs packed object counts."}
    ]}
  ],
  challenges:[
    {q:"What are the four types of Git objects?",scenario:"Your team lead asks you to explain what Git actually stores internally. Name all four types separated by commas.",hint:"The four building blocks: one stores file content, one stores directory listings, one stores snapshot metadata, one stores annotated pointers.",accept:["blob, tree, commit, tag","blob,tree,commit,tag","blob tree commit tag","commit, tree, blob, tag","tree, blob, commit, tag"],feedback:"The four Git object types: blob (file content), tree (directory listing), commit (snapshot metadata + parent pointer), tag (annotated pointer to another object). Everything in Git is built from these four primitives."},
    {q:"Type the command to print the full contents of the HEAD commit object.",scenario:"You want to inspect exactly what data Git stores inside a commit — the tree hash, parent, author, and message.",hint:"Use 'git cat-file' with the -p flag (pretty-print) followed by HEAD.",accept:["git cat-file -p head","git cat-file -p HEAD","git cat-file --pretty head","git cat-file --pretty HEAD"],feedback:"git cat-file -p pretty-prints any Git object. On a commit you'll see: tree HASH, parent HASH, author name/email/timestamp, committer name/email/timestamp, and the commit message. This is the raw data Git stores."},
    {q:"Type the command to resolve the symbolic name 'main' to its full 40-character SHA-1 commit hash.",scenario:"You need the exact hash of the current tip of main for a script.",hint:"There's a plumbing command that translates names to hashes: 'git rev-parse'.",accept:["git rev-parse main","git rev-parse main "],feedback:"git rev-parse translates any ref, tag, branch name, or relative expression (HEAD~3, main^2) into its full SHA-1 hash. Essential for scripting around Git."}
  ]
},
{
  title:"Git Hooks",sub:"Automating quality gates at every stage of the workflow",
  sections:[
    {label:"What are hooks?",cards:[
      {title:"Scripts that fire automatically",body:"Git hooks are executable scripts stored in <code>.git/hooks/</code> that run automatically at specific points in the Git lifecycle. They let you enforce code quality, run tests, validate messages, and trigger deployments — without anyone needing to remember to do it manually."},
      {title:"Client vs server hooks",body:"<strong style='font-weight:500'>Client-side</strong> — run on your machine: pre-commit, prepare-commit-msg, commit-msg, post-commit, pre-push, pre-rebase. <strong style='font-weight:500'>Server-side</strong> — run on the Git server: pre-receive, update, post-receive. Server hooks enforce policy for the whole team."},
      {title:"Real-world usage",body:"Pre-commit hooks typically run linters (ESLint, Prettier, Black) and type-checkers. Commit-msg hooks enforce Conventional Commits format. Pre-push hooks run test suites as a final gate. Post-receive hooks trigger deployments on the server. In enterprise teams, hooks are the first line of quality defence."}
    ]},
    {label:"Client-side hooks",codeblock:{lang:"bash",code:`<span class="cmt"># Hooks live in .git/hooks/ — make them executable</span>
ls .git/hooks/
<span class="cmt"># pre-commit.sample  commit-msg.sample  pre-push.sample ...</span>

<span class="cmt"># Create a pre-commit hook that runs linting</span>
cat > .git/hooks/pre-commit << <span class="str">'EOF'</span>
#!/bin/sh
npm run lint
if [ $? -ne 0 ]; then
  echo "Linting failed. Fix errors before committing."
  exit 1
fi
EOF
chmod +x .git/hooks/pre-commit

<span class="cmt"># commit-msg: enforce conventional commit format</span>
cat > .git/hooks/commit-msg << <span class="str">'EOF'</span>
#!/bin/sh
MSG=$(cat "$1")
PATTERN="^(feat|fix|docs|style|refactor|test|chore|perf|ci)(\(.+\))?: .{1,72}"
if ! echo "$MSG" | grep -qE "$PATTERN"; then
  echo "ERROR: Commit message must follow Conventional Commits format"
  exit 1
fi
EOF
chmod +x .git/hooks/commit-msg</span>`}},
    {label:"Husky — shareable hooks for teams",codeblock:{lang:"bash",code:`<span class="cmt"># .git/hooks/ is not committed — hooks can't be shared</span>
<span class="cmt"># Husky solves this by storing hooks in the repo itself</span>

npm install --save-dev husky
npx husky init            <span class="cmt"># creates .husky/ directory</span>

<span class="cmt"># Add a pre-commit hook</span>
echo "npm test" > .husky/pre-commit
chmod +x .husky/pre-commit

<span class="cmt"># Add a commit-msg hook</span>
echo "npx commitlint --edit $1" > .husky/commit-msg
chmod +x .husky/commit-msg

<span class="cmt"># package.json — run husky install after npm install</span>
<span class="str">"scripts": { "prepare": "husky install" }</span>

<span class="cmt"># lint-staged: only lint files being committed (fast)</span>
npm install --save-dev lint-staged
<span class="cmt"># .lintstagedrc.json:</span>
<span class="str">{ "*.{js,ts}": ["eslint --fix", "prettier --write"] }</span></span>`}},
    {label:"pre-push and pre-rebase hooks",codeblock:{lang:"bash",code:`<span class="cmt"># pre-push: run full test suite before pushing</span>
cat > .husky/pre-push << <span class="str">'EOF'</span>
#!/bin/sh
npm run test:ci
if [ $? -ne 0 ]; then
  echo "Tests failed. Push aborted."
  exit 1
fi
EOF

<span class="cmt"># pre-rebase: warn before rebasing shared branches</span>
cat > .git/hooks/pre-rebase << <span class="str">'EOF'</span>
#!/bin/sh
BRANCH=$(git branch --show-current)
if [ "$BRANCH" = "main" ] || [ "$BRANCH" = "develop" ]; then
  echo "WARNING: Rebasing $BRANCH is dangerous on shared branches"
  read -p "Continue? [y/N] " confirm
  [ "$confirm" = "y" ] || exit 1
fi
EOF</span>`}}
  ],
  challenges:[
    {q:"Where does Git look for hook scripts on your local machine?",scenario:"You want to manually create a pre-commit hook without using Husky. Which directory do you create the script in?",hint:"Hooks live inside Git's own database directory, in a subdirectory named after what they are.",accept:[".git/hooks",".git/hooks/",".git/hooks/ directory","the .git/hooks directory"],feedback:".git/hooks/ is where Git looks for hook scripts. Each hook is an executable file named after the hook event (pre-commit, commit-msg, etc.). Note: this directory is NOT committed to the repo — use Husky to share hooks with your team."},
    {q:"Why can't you share Git hooks by committing the .git/hooks/ directory, and what tool solves this?",scenario:"Your team wants everyone to have the same pre-commit linting hook. Why doesn't just committing .git/hooks work?",hint:"The .git directory isn't tracked by Git itself. A popular npm tool named after a dog breed solves this.",accept:["the .git directory is not tracked by git, husky solves this","git does not track the .git directory, husky","the .git folder is not committed, husky solves it","because .git is not tracked, husky","git doesn't track .git/hooks, husky"],feedback:"The entire .git/ directory is excluded from Git tracking — it's Git's own database, not part of the project content. Husky solves this by storing hooks in a .husky/ directory at the repo root, which IS committed and shared with everyone."},
    {q:"Type the exit code a hook script must return to ABORT the Git operation it's guarding.",scenario:"Your pre-commit hook detected a linting error. What must the script return to prevent the commit from happening?",hint:"Unix convention: 0 means success. Any other number means failure and stops the operation.",accept:["1","exit 1","exit code 1","non-zero","any non-zero"],feedback:"Any non-zero exit code from a hook script causes Git to abort the operation. Exit code 0 means success — proceed. Exit code 1 (or any non-zero) means failure — abort. This is standard Unix convention for script exit codes."}
  ]
},
{
  title:"CI/CD with Git",sub:"GitHub Actions, GitLab CI — automating everything on push",
  sections:[
    {label:"What is CI/CD?",cards:[
      {title:"Continuous Integration",body:"Every push triggers an automated pipeline that builds the code, runs tests, and reports back. Catches bugs before they reach main. Everyone's changes are integrated and tested continuously rather than in big batches."},
      {title:"Continuous Deployment",body:"After CI passes, the code is automatically deployed to staging or production. Git events (push to main, merge PR, new tag) become deployment triggers. No manual deploys."},
      {title:"Why this matters for Git",body:"CI/CD turns Git into the single source of truth for what's deployed. Every deployment is traceable to a specific commit. You can always answer: 'what code is running in production right now?' with a simple <code>git log</code>. Tags like <code>v1.2.3</code> mark exact release points, making rollbacks as simple as deploying an older tag."}
    ]},
    {label:"GitHub Actions — workflow anatomy",codeblock:{lang:"yaml",code:`<span class="cmt"># .github/workflows/ci.yml</span>
<span class="hl">name</span>: CI

<span class="hl">on</span>:
  <span class="hl2">push</span>:
    <span class="hl3">branches</span>: [main, develop]
  <span class="hl2">pull_request</span>:
    <span class="hl3">branches</span>: [main]

<span class="hl">jobs</span>:
  <span class="hl2">test</span>:
    <span class="hl3">runs-on</span>: ubuntu-latest
    <span class="hl3">steps</span>:
      - <span class="hl">uses</span>: actions/checkout@v4
      - <span class="hl">uses</span>: actions/setup-node@v4
        <span class="hl">with</span>: { node-version: <span class="str">'20'</span> }
      - <span class="hl">run</span>: npm ci
      - <span class="hl">run</span>: npm test
      - <span class="hl">run</span>: npm run build`}},
    {label:"Tag-triggered deployments",codeblock:{lang:"yaml",code:`<span class="cmt"># Deploy to production only when a version tag is pushed</span>
<span class="hl">on</span>:
  <span class="hl2">push</span>:
    <span class="hl3">tags</span>: ['v*.*.*']

<span class="hl">jobs</span>:
  <span class="hl2">deploy</span>:
    <span class="hl3">runs-on</span>: ubuntu-latest
    <span class="hl3">environment</span>: production
    <span class="hl3">steps</span>:
      - <span class="hl">uses</span>: actions/checkout@v4
      - <span class="hl">name</span>: Deploy to production
        <span class="hl">run</span>: ./scripts/deploy.sh
        <span class="hl">env</span>:
          <span class="hl3">DEPLOY_KEY</span>: <span class="str">\${{ secrets.DEPLOY_KEY }}</span></span>`}},
    {label:"GitLab CI equivalent",codeblock:{lang:"yaml",code:`<span class="cmt"># .gitlab-ci.yml</span>
<span class="hl">stages</span>: [test, build, deploy]

<span class="hl">test</span>:
  <span class="hl2">stage</span>: test
  <span class="hl2">image</span>: node:20
  <span class="hl2">script</span>:
    - npm ci
    - npm test
  <span class="hl2">only</span>: [merge_requests, main]

<span class="hl">deploy_prod</span>:
  <span class="hl2">stage</span>: deploy
  <span class="hl2">script</span>: ./deploy.sh
  <span class="hl2">only</span>:
    - <span class="hl3">refs</span>: [tags]
      <span class="hl3">variables</span>: ["\$CI_COMMIT_TAG =~ /^v\\d+\\.\\d+\\.\\d+$/"]</span>`}},
    {label:"Branch protection + required status checks",cards:[
      {title:"Enforce CI before merging",body:"On GitHub: Settings → Branches → Add rule → Require status checks to pass. This blocks ANY merge to main unless the CI pipeline passed. Combined with required reviews, nothing broken reaches production."},
      {title:"CODEOWNERS",body:"Create a <code>.github/CODEOWNERS</code> file to automatically request reviews from specific people when certain files change. <code>* @team/backend</code> (everything), <code>/frontend/ @alice</code> (specific dir), <code>*.sql @db-team</code> (file type)."}
    ]}
  ],
  challenges:[
    {q:"In a GitHub Actions workflow file, what key specifies WHEN the workflow runs (which Git events trigger it)?",scenario:"You're writing a CI workflow. What top-level YAML key defines the trigger events like 'push' and 'pull_request'?",hint:"It's a 2-letter YAML key. Think of the word for 'triggered by' or 'upon'.",accept:["on","\"on\"","'on'"],feedback:"The 'on' key defines workflow triggers. Common triggers: push (on commits), pull_request (on PR open/update), schedule (cron), workflow_dispatch (manual), release (on GitHub release creation). You can filter by branch or tag pattern."},
    {q:"Where in a GitHub repository do you store GitHub Actions workflow YAML files?",scenario:"You want to add a CI pipeline. What directory path do you create the .yml file in?",hint:"The workflows directory lives inside a hidden directory named after the platform.",accept:[".github/workflows",".github/workflows/","github/workflows",".github/workflows/ directory"],feedback:".github/workflows/ is the required directory. Every .yml or .yaml file in this directory becomes a separate workflow. GitHub automatically detects and runs them based on their 'on' triggers."},
    {q:"What file do you create to automatically assign code reviewers based on which files changed in a pull request?",scenario:"You want database team members automatically added as reviewers whenever any .sql file is modified in a PR.",hint:"The file name literally describes who owns the code. ALL CAPS, one word.",accept:["codeowners",".github/codeowners","CODEOWNERS",".github/CODEOWNERS"],feedback:"CODEOWNERS (stored in .github/, the repo root, or docs/) maps file patterns to GitHub users or teams. When a PR changes matching files, those owners are automatically requested as reviewers. Works with GitHub's branch protection 'required reviewers' setting."}
  ]
},
{
  title:"Git LFS — Large File Storage",sub:"Versioning binaries, assets, and datasets without bloating your repo",
  sections:[
    {label:"The problem with large files",cards:[
      {title:"Why Git hates binary files",body:"Git stores every version of every file in full. A 50MB PSD file edited 100 times = 5GB in your repo. Binary files don't delta-compress well. Every clone downloads the entire history. Your repo becomes unusable."},
      {title:"What Git LFS does",body:"Git LFS replaces large files in your repo with tiny text pointer files. The actual binary content is stored on a separate LFS server. When you checkout, Git LFS downloads only the version you need — not the entire history of every large file."}
    ]},
    {label:"Installing and using Git LFS",codeblock:{lang:"bash",code:`<span class="cmt"># Install Git LFS (once per machine)</span>
brew install git-lfs          <span class="cmt"># macOS</span>
sudo apt-get install git-lfs  <span class="cmt"># Ubuntu</span>
<span class="hl">git lfs</span> install              <span class="cmt"># enable in your git config</span>

<span class="cmt"># Track file patterns with LFS (per repo)</span>
<span class="hl">git lfs</span> track <span class="str">"*.psd"</span>
<span class="hl">git lfs</span> track <span class="str">"*.mp4"</span>
<span class="hl">git lfs</span> track <span class="str">"*.zip"</span>
<span class="hl">git lfs</span> track <span class="str">"data/**/*.parquet"</span>
<span class="cmt"># This creates/updates .gitattributes — commit it!</span>
<span class="hl">git add</span> .gitattributes
<span class="hl">git commit</span> -m <span class="str">"Track large files with LFS"</span>

<span class="cmt"># Normal git workflow from here — LFS is transparent</span>
<span class="hl">git add</span> design.psd
<span class="hl">git commit</span> -m <span class="str">"Add design mockup"</span>
<span class="hl">git push</span>   <span class="cmt"># LFS files uploaded automatically</span></span>`}},
    {label:"LFS management commands",codeblock:{lang:"bash",code:`<span class="hl">git lfs</span> ls-files            <span class="cmt"># list LFS-tracked files</span>
<span class="hl">git lfs</span> status              <span class="cmt"># show LFS file status</span>
<span class="hl">git lfs</span> track               <span class="cmt"># list current tracking patterns</span>
<span class="hl">git lfs</span> untrack <span class="str">"*.zip"</span>    <span class="cmt"># stop tracking a pattern</span>
<span class="hl">git lfs</span> migrate import --include="*.psd"  <span class="cmt"># migrate existing history</span>
<span class="hl">git lfs</span> pull                <span class="cmt"># force download LFS files</span>
<span class="hl">git lfs</span> prune               <span class="cmt"># clean old LFS objects locally</span>

<span class="cmt"># Clone without downloading LFS files (fast)</span>
<span class="hl">GIT_LFS_SKIP_SMUDGE</span>=1 git clone URL</span>`}},
    {label:"The .gitattributes file",cards:[
      {title:"What LFS creates",body:"When you run <code>git lfs track</code>, it writes to <code>.gitattributes</code>: <code>*.psd filter=lfs diff=lfs merge=lfs -text</code>. This file MUST be committed and pushed so everyone on the team uses LFS for those file types automatically."},
      {title:"Limits",body:"GitHub LFS: 2GB per file, 1GB free storage/bandwidth per month. GitLab: configurable. Self-hosted Git servers need an LFS server configured separately (e.g. MinIO, Gitea, Artifactory)."}
    ]}
  ],
  challenges:[
    {q:"Type the command to tell Git LFS to track all files with a .psd extension.",scenario:"Your design team is adding Photoshop files to the repo. You need to configure LFS before they push.",hint:"The command is 'git lfs track' followed by a glob pattern in quotes.",accept:["git lfs track \"*.psd\"","git lfs track '*.psd'","git lfs track *.psd"],feedback:"git lfs track adds a pattern to .gitattributes marking those files for LFS handling. Remember to commit .gitattributes so every team member's machine knows to use LFS for those files. Without this, team members without LFS configured will just see the pointer files."},
    {q:"After setting up LFS tracking, which file must you commit to share the LFS configuration with your team?",scenario:"You've run git lfs track on several patterns. What file do you need to add and commit?",hint:"LFS writes its tracking rules into a file that controls per-file Git attributes.",accept:[".gitattributes","gitattributes",".gitattributes file"],feedback:".gitattributes stores LFS filter rules and other file-specific Git attributes. It must be committed and pushed to the repo so every team member's Git installation knows which files to handle through LFS. Without it, others just get raw pointer files."},
    {q:"Type the environment variable trick to clone a repo WITHOUT downloading LFS binary files — useful for CI pipelines that don't need assets.",scenario:"Your CI build pipeline doesn't need design assets and you want the clone to be as fast as possible.",hint:"Set an environment variable to skip the LFS download step. The variable name includes 'SKIP_SMUDGE'.",accept:["git_lfs_skip_smudge=1 git clone","GIT_LFS_SKIP_SMUDGE=1 git clone","GIT_LFS_SKIP_SMUDGE=1"],feedback:"Setting GIT_LFS_SKIP_SMUDGE=1 before git clone tells the LFS smudge filter to skip downloading binary content — you get the pointer files instead. Essential for CI environments where assets aren't needed, dramatically reducing clone time and bandwidth."}
  ]
},
{
  title:"Monorepo Strategies",sub:"Sparse checkout, partial clone, and managing massive repositories",
  sections:[
    {label:"What is a monorepo?",cards:[
      {title:"One repo, many projects",body:"A monorepo stores multiple related projects (frontend, backend, shared libraries, mobile apps) in a single Git repository. Used by Google, Meta, Microsoft, Airbnb. Benefits: atomic cross-project commits, shared tooling, single source of truth."},
      {title:"The scale problem",body:"Monorepos can have millions of files and gigabytes of history. A normal <code>git clone</code> becomes impractical. You need strategies to check out only what you need and download only relevant history."}
    ]},
    {label:"Sparse checkout — check out only part of the tree",codeblock:{lang:"bash",code:`<span class="cmt"># Clone but don't check out files yet</span>
<span class="hl">git clone</span> --no-checkout --depth 1 URL repo
cd repo

<span class="cmt"># Enable sparse checkout</span>
<span class="hl">git sparse-checkout</span> init --cone

<span class="cmt"># Specify which directories you want</span>
<span class="hl">git sparse-checkout</span> set packages/frontend packages/shared

<span class="cmt"># Now checkout — only those directories are populated</span>
<span class="hl">git checkout</span> main

<span class="cmt"># Add more directories later</span>
<span class="hl">git sparse-checkout</span> add packages/api

<span class="cmt"># List what's currently checked out</span>
<span class="hl">git sparse-checkout</span> list

<span class="cmt"># Disable (restore full checkout)</span>
<span class="hl">git sparse-checkout</span> disable</span>`}},
    {label:"Partial clone — download only what you touch",codeblock:{lang:"bash",code:`<span class="cmt"># Clone without any file blobs (metadata only)</span>
<span class="hl">git clone</span> --filter=blob:none URL
<span class="cmt"># Blobs are fetched on-demand when you checkout files</span>

<span class="cmt"># Clone without trees OR blobs (only commits)</span>
<span class="hl">git clone</span> --filter=tree:0 URL

<span class="cmt"># Shallow clone — only recent history</span>
<span class="hl">git clone</span> --depth 50 URL       <span class="cmt"># last 50 commits</span>
<span class="hl">git clone</span> --shallow-since=<span class="str">"2024-01-01"</span> URL

<span class="cmt"># Deepen a shallow clone later</span>
<span class="hl">git fetch</span> --deepen=100
<span class="hl">git fetch</span> --unshallow          <span class="cmt"># get full history</span>

<span class="cmt"># Combine sparse + partial for maximum speed</span>
<span class="hl">git clone</span> --filter=blob:none --no-checkout URL
<span class="hl">git sparse-checkout</span> init --cone
<span class="hl">git sparse-checkout</span> set my-package</span>`}},
    {label:"Monorepo tooling",cards:[
      {title:"Nx",body:"Smart build system for JS/TS monorepos. Understands project dependencies and only rebuilds/retests affected projects. Integrates with Git to detect which projects changed in a PR."},
      {title:"Turborepo",body:"High-performance build system by Vercel. Uses Git-based caching — if files haven't changed since last build, it reuses the cached output. Pipeline-aware: <code>turbo run build --filter=...HEAD^1</code> builds only what changed."},
      {title:"git subtree vs git submodule",body:"<code>git subtree</code> merges another repo's content directly into a subdirectory — simpler to use, history is combined. <code>git submodule</code> keeps repos separate with pointer references — more complex but maintains independent histories."}
    ]}
  ],
  challenges:[
    {q:"Type the git clone flag that downloads only commit metadata without any file blobs, fetching file content on-demand instead.",scenario:"You're setting up a developer machine to work on a 50GB monorepo. You only need a few packages.",hint:"It's a --filter flag with a value that excludes blobs (file content).",accept:["--filter=blob:none","--filter blob:none"],feedback:"--filter=blob:none creates a 'blobless clone' — Git downloads all commits and tree objects (so you have full history and can navigate branches) but skips file blobs until you actually checkout files that need them. Dramatically speeds up cloning large repos."},
    {q:"Type the two commands needed to enable sparse checkout in cone mode and then set it to only include the 'apps/web' directory.",scenario:"After a blobless clone, you want to narrow your working directory to just the frontend app.",hint:"Two commands: 'git sparse-checkout init --cone' then 'git sparse-checkout set <directory>'.",accept:["git sparse-checkout init --cone\ngit sparse-checkout set apps/web","git sparse-checkout init --cone\ngit sparse-checkout set apps/web "],feedback:"git sparse-checkout init --cone enables cone mode (which is faster and simpler — you specify directories, not patterns). git sparse-checkout set then specifies exactly which top-level and nested directories to populate. Everything else stays absent from your working directory."},
    {q:"What is the difference between git submodule and git subtree?",scenario:"Your team is debating how to share a common library across multiple repos. What do you tell them?",hint:"One keeps repos separate with pointer references. The other physically copies content into your repo.",accept:["submodule keeps repos separate with pointers, subtree merges content directly","submodule references external repos as pointers, subtree copies their content into your repo","submodule uses pointer references to external repos, subtree merges history inline","submodules reference external repos independently, subtree embeds the content directly"],feedback:"git submodule stores a pointer to a specific commit in another repo — the two repos remain independent. git subtree physically copies another repo's content into a subdirectory, merging its history with yours. Subtree is simpler for contributors (no extra init commands) but muddies history. Submodule maintains clean separation but requires extra management steps."}
  ]
},
{
  title:"Git Security",sub:"GPG signing, secret scanning, SSH hardening, and supply chain integrity",
  sections:[
    {label:"Why sign commits?",cards:[
      {title:"The problem: anyone can fake authorship",body:"Git commit author info (name and email) is just config — anyone can set <code>user.email</code> to anyone else's address and commit 'as' them. A signed commit proves the commit was actually made by someone who possesses a specific cryptographic key."},
      {title:"GPG vs SSH signing",body:"Git supports both GPG keys and SSH keys for signing. SSH signing (added in Git 2.34) is simpler — you likely already have an SSH key. GPG signing is the older standard and supported everywhere. GitHub shows a 'Verified' badge on signed commits."}
    ]},
    {label:"Setting up commit signing",codeblock:{lang:"bash",code:`<span class="cmt">── SSH SIGNING (simpler, Git 2.34+) ─────────────</span>
<span class="hl">git config</span> --global gpg.format ssh
<span class="hl">git config</span> --global user.signingkey ~/.ssh/id_ed25519.pub
<span class="hl">git config</span> --global commit.gpgsign true   <span class="cmt"># sign all commits</span>
<span class="cmt"># Add your SSH key as a signing key on GitHub:</span>
<span class="cmt"># Settings → SSH Keys → New → Key type: Signing Key</span>

<span class="cmt">── GPG SIGNING (traditional) ────────────────────</span>
gpg --full-generate-key
gpg --list-secret-keys --keyid-format=long
<span class="cmt"># Copy the key ID (after 'ed25519/')</span>
<span class="hl">git config</span> --global user.signingkey YOUR_KEY_ID
<span class="hl">git config</span> --global commit.gpgsign true
<span class="cmt"># Export public key to GitHub:</span>
gpg --armor --export YOUR_KEY_ID   <span class="cmt"># paste into GitHub GPG keys</span>

<span class="cmt"># Sign a single commit manually</span>
<span class="hl">git commit</span> -S -m <span class="str">"Signed commit"</span>

<span class="cmt"># Verify a commit's signature</span>
<span class="hl">git verify-commit</span> HEAD
<span class="hl">git log</span> --show-signature</span>`}},
    {label:"Secret scanning — keeping credentials out",codeblock:{lang:"bash",code:`<span class="cmt"># NEVER commit secrets. But when it happens:</span>

<span class="cmt">── DETECT ────────────────────────────────────────</span>
<span class="cmt"># gitleaks: scan repo for secrets</span>
brew install gitleaks
gitleaks detect --source . --verbose

<span class="cmt"># trufflehog: deep scan including history</span>
trufflehog git file://. --since-commit HEAD~50

<span class="cmt">── PREVENT ───────────────────────────────────────</span>
<span class="cmt"># pre-commit hook with gitleaks</span>
cat > .husky/pre-commit << <span class="str">'EOF'</span>
gitleaks protect --staged --redact
EOF

<span class="cmt">── REMOVE (if already pushed) ────────────────────</span>
<span class="cmt"># BFG Repo Cleaner — much faster than filter-branch</span>
java -jar bfg.jar --delete-files .env
java -jar bfg.jar --replace-text passwords.txt
<span class="hl">git reflog</span> expire --expire=now --all
<span class="hl">git gc</span> --prune=now --aggressive
<span class="hl">git push</span> --force
<span class="cmt"># ⚠️  REVOKE the exposed secret immediately — always</span></span>`}},
    {label:"SSH and access security",codeblock:{lang:"bash",code:`<span class="cmt"># Use Ed25519 keys (stronger than RSA)</span>
ssh-keygen -t ed25519 -C <span class="str">"work@company.com"</span>

<span class="cmt"># Multiple SSH keys for different accounts</span>
cat >> ~/.ssh/config << <span class="str">'EOF'</span>
Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work

Host github-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal
EOF

<span class="cmt"># Use work account for this repo</span>
<span class="hl">git remote</span> set-url origin git@github-work:company/repo.git

<span class="cmt"># Rotate keys: add new key to GitHub, remove old one</span>
<span class="cmt"># Then update remote URLs to use new key</span></span>`}}
  ],
  challenges:[
    {q:"Type the git config command to make Git automatically sign ALL commits using GPG by default.",scenario:"Your company's security policy requires all commits to be signed. You want to enable this globally.",hint:"It's a git config setting: commit.gpgsign set to true.",accept:["git config --global commit.gpgsign true","git config --global commit.gpgsign true ","git config --global commit.gpgsign 1"],feedback:"commit.gpgsign true makes Git sign every commit automatically with your configured signing key. Without this, you'd need to add -S to every commit command. Set this globally so it applies to all your repos."},
    {q:"A secret API key was committed and pushed 3 commits ago. What is the FIRST thing you must do, before even cleaning the Git history?",scenario:"You just discovered AWS_SECRET_KEY was committed to a public repo. What's the immediate priority?",hint:"Before ANY Git cleanup: immediately invalidate the exposed credential so it can't be used.",accept:["revoke the secret","revoke or rotate the secret","invalidate the secret","rotate the key","revoke the key","revoke and rotate the exposed secret","revoke the exposed credential"],feedback:"ALWAYS revoke/rotate the exposed secret first — immediately. Git history cleaning takes time and even if you rewrite history, the secret was already exposed during the window it was public. Treat it as compromised the moment it was pushed. Clean the history after the secret is already invalidated."},
    {q:"Type the git log flag that shows the GPG/SSH signature verification status alongside each commit.",scenario:"You want to audit recent commits to confirm they all have verified signatures.",hint:"There's a --show-signature flag for git log that displays verification status.",accept:["--show-signature","--show-signature "],feedback:"git log --show-signature shows the signature status for each commit — 'Good signature from...' for valid signatures, or an error for invalid/missing ones. Use this for security audits to ensure all commits on a branch are properly signed."}
  ]
},
{
  title:"Advanced Log & Forensics",sub:"Mastering git log, diff, and blame for deep investigation",
  sections:[
    {label:"git log — the full power",codeblock:{lang:"bash",code:`<span class="cmt">── FILTERING ─────────────────────────────────────</span>
<span class="hl">git log</span> --author=<span class="str">"Alice"</span>
<span class="hl">git log</span> --grep=<span class="str">"JIRA-1234"</span>        <span class="cmt"># search commit messages</span>
<span class="hl">git log</span> --since=<span class="str">"2 weeks ago"</span>
<span class="hl">git log</span> --after=<span class="str">"2024-01-01"</span> --before=<span class="str">"2024-06-01"</span>
<span class="hl">git log</span> main..feature             <span class="cmt"># commits in feature not in main</span>
<span class="hl">git log</span> -S <span class="str">"password"</span>           <span class="cmt"># pickaxe: string added/removed</span>
<span class="hl">git log</span> -G <span class="str">"api_key.*="</span>         <span class="cmt"># pickaxe with regex</span>
<span class="hl">git log</span> -- path/to/file.js        <span class="cmt"># history of one file</span>
<span class="hl">git log</span> --follow -- old-name.js   <span class="cmt"># follow renames</span>
<span class="hl">git log</span> --diff-filter=D           <span class="cmt"># only commits that deleted files</span>
<span class="cmt"># diff-filter values: A=added D=deleted M=modified R=renamed</span>

<span class="cmt">── FORMATTING ────────────────────────────────────</span>
<span class="hl">git log</span> --pretty=format:<span class="str">"%h %an %ar %s"</span>
<span class="hl">git log</span> --pretty=format:<span class="str">"%C(yellow)%h%Creset %s"</span>
<span class="cmt"># Placeholders: %h=short hash %H=full hash %s=subject</span>
<span class="cmt"># %an=author %ae=email %ar=relative date %ad=absolute date</span>
<span class="cmt"># %d=ref names %b=body %n=newline</span>

<span class="cmt">── STATS ─────────────────────────────────────────</span>
<span class="hl">git log</span> --stat                    <span class="cmt"># files changed summary</span>
<span class="hl">git log</span> --numstat                 <span class="cmt"># lines added/removed</span>
<span class="hl">git log</span> --shortstat               <span class="cmt"># one line summary per commit</span>
<span class="hl">git shortlog</span> -sne                 <span class="cmt"># commits per author with email</span></span>`}},
    {label:"Advanced diff",codeblock:{lang:"bash",code:`<span class="cmt"># Better diff algorithm (set globally)</span>
<span class="hl">git config</span> --global diff.algorithm histogram

<span class="cmt"># Word-level diff instead of line-level</span>
<span class="hl">git diff</span> --word-diff
<span class="hl">git diff</span> --word-diff=color

<span class="cmt"># Ignore specific changes</span>
<span class="hl">git diff</span> -w                      <span class="cmt"># ignore whitespace</span>
<span class="hl">git diff</span> --ignore-blank-lines

<span class="cmt"># Compare specific file between branches/commits</span>
<span class="hl">git diff</span> main:src/app.js feature:src/app.js

<span class="cmt"># Show only names of changed files</span>
<span class="hl">git diff</span> --name-only main..feature
<span class="hl">git diff</span> --name-status main..feature</span>`}},
    {label:"git blame — advanced usage",codeblock:{lang:"bash",code:`<span class="hl">git blame</span> -w app.js              <span class="cmt"># ignore whitespace commits</span>
<span class="hl">git blame</span> -M app.js              <span class="cmt"># detect moved lines</span>
<span class="hl">git blame</span> -C app.js              <span class="cmt"># detect copied lines from other files</span>
<span class="hl">git blame</span> --since=<span class="str">"1 year ago"</span>  <span class="cmt"># blame as of a date</span>
<span class="hl">git blame</span> v1.0.0 -- app.js       <span class="cmt"># blame at a specific tag</span>

<span class="cmt"># .git-blame-ignore-revs — ignore bulk formatting commits</span>
<span class="cmt"># Create .git-blame-ignore-revs in repo root:</span>
<span class="cmt"># a1b2c3d4  # Reformat with prettier</span>
<span class="hl">git config</span> blame.ignoreRevsFile .git-blame-ignore-revs</span>`}},
    {label:"rerere — Reuse Recorded Resolutions",codeblock:{lang:"bash",code:`<span class="cmt"># rerere remembers how you resolved a conflict</span>
<span class="cmt"># and reapplies it automatically next time</span>
<span class="hl">git config</span> --global rerere.enabled true

<span class="cmt"># When you resolve a conflict, rerere records it</span>
<span class="cmt"># Next time the same conflict appears (e.g. after rebase):</span>
<span class="cmt"># Git automatically applies your previous resolution</span>

<span class="hl">git rerere</span> status                <span class="cmt"># show recorded resolutions</span>
<span class="hl">git rerere</span> diff                  <span class="cmt"># show what rerere will apply</span>
<span class="hl">git rerere</span> forget path/to/file   <span class="cmt"># forget a resolution</span>
<span class="cmt"># Stored in .git/rr-cache/</span></span>`}}
  ],
  challenges:[
    {q:"Type the git log flag that tracks a file's history even across renames.",scenario:"A file was renamed from 'utils.js' to 'helpers.js' 20 commits ago. You want to see its complete history including before the rename.",hint:"A single flag that tells git log to trace the file through rename operations.",accept:["--follow","--follow "],feedback:"git log --follow -- filename traces a file's history through renames. Without --follow, git log stops at the rename and you lose all older history. Always use --follow when investigating a file that may have been renamed."},
    {q:"Type the git log flag and pattern to find every commit where the string 'DROP TABLE' was either added or removed from any file.",scenario:"Security audit: you need to find every commit in history that touched any SQL DROP TABLE statement.",hint:"The -S flag (called the 'pickaxe') searches for when a string was added or removed in diffs.",accept:["git log -s \"drop table\"","-s \"DROP TABLE\"","-S \"DROP TABLE\"","-S 'DROP TABLE'","git log -s 'drop table'","git log -S \"DROP TABLE\"","git log -S 'DROP TABLE'","--pickaxe -s drop table"],feedback:"The -S flag (the 'pickaxe') searches for commits where the string was added or removed in the diff content. It's different from --grep which only searches commit messages. Use -G for regex patterns instead of literal strings."},
    {q:"What git config setting enables automatic reuse of previously recorded conflict resolutions?",scenario:"Your team frequently rebases long-running branches onto main and resolves the same conflicts repeatedly. What setting eliminates this repetition?",hint:"The feature is called 'rerere' — Reuse Recorded Resolution. It's a config setting.",accept:["rerere.enabled true","rerere.enabled = true","git config rerere.enabled true","git config --global rerere.enabled true"],feedback:"rerere (Reuse Recorded Resolution) records the before/after state of every conflict you resolve. Next time Git encounters the identical conflict, it applies your resolution automatically. Huge time saver on teams that do frequent rebases."}
  ]
},
{
  title:"Repository Maintenance",sub:"gc, fsck, prune, bundle — keeping your repo healthy and fast",
  sections:[
    {label:"git gc — garbage collection",codeblock:{lang:"bash",code:`<span class="cmt"># Git accumulates loose objects over time</span>
<span class="cmt"># gc packs them, removes unreachable objects, compresses</span>
<span class="hl">git gc</span>                         <span class="cmt"># gentle cleanup (auto-triggered sometimes)</span>
<span class="hl">git gc</span> --aggressive            <span class="cmt"># deeper optimisation (slower)</span>
<span class="hl">git gc</span> --prune=now             <span class="cmt"># prune unreachable objects immediately</span>
<span class="hl">git gc</span> --auto                  <span class="cmt"># only run if needed</span>

<span class="cmt"># See what's in your repo before/after gc</span>
<span class="hl">git count-objects</span> -vH
<span class="cmt"># count: 1523  size: 12.34 MiB</span>
<span class="cmt"># in-pack: 45231  packs: 2  size-pack: 234.5 MiB</span>

<span class="cmt"># Configure auto-gc thresholds</span>
<span class="hl">git config</span> gc.auto 256         <span class="cmt"># trigger after 256 loose objects</span>
<span class="hl">git config</span> gc.autoPackLimit 50 <span class="cmt"># trigger after 50 pack files</span></span>`}},
    {label:"git fsck — filesystem check",codeblock:{lang:"bash",code:`<span class="cmt"># Verify integrity of all objects in the database</span>
<span class="hl">git fsck</span>
<span class="cmt"># Checks for: dangling commits, broken links, corrupt objects</span>
<span class="cmt"># "dangling commit" = a commit no ref points to (orphaned)</span>
<span class="cmt"># "dangling blob" = a staged file that was never committed</span>

<span class="hl">git fsck</span> --lost-found          <span class="cmt"># write dangling objects to .git/lost-found/</span>
<span class="hl">git fsck</span> --unreachable         <span class="cmt"># list all unreachable objects</span>
<span class="hl">git fsck</span> --dangling            <span class="cmt"># only dangling objects</span>

<span class="cmt"># Recover a dangling commit:</span>
<span class="hl">git show</span> DANGLING_HASH         <span class="cmt"># inspect it</span>
<span class="hl">git branch</span> recovered DANGLING_HASH  <span class="cmt"># recover it</span></span>`}},
    {label:"git prune and reflog expire",codeblock:{lang:"bash",code:`<span class="cmt"># Prune unreachable objects older than 2 weeks (default)</span>
<span class="hl">git prune</span>

<span class="cmt"># Expire reflog entries (objects are prunable after this)</span>
<span class="hl">git reflog</span> expire --expire=30.days.ago --all
<span class="hl">git reflog</span> expire --expire=now --all  <span class="cmt"># expire everything now</span>

<span class="cmt"># Full cleanup sequence (after BFG history rewrite)</span>
<span class="hl">git reflog</span> expire --expire=now --all
<span class="hl">git gc</span> --prune=now --aggressive
<span class="hl">git push</span> --force --all</span>`}},
    {label:"git bundle — offline transfers",codeblock:{lang:"bash",code:`<span class="cmt"># Bundle your repo into a single portable file</span>
<span class="hl">git bundle</span> create repo.bundle HEAD main
<span class="hl">git bundle</span> create repo.bundle --all   <span class="cmt"># all refs</span>

<span class="cmt"># Clone FROM a bundle file (no network needed)</span>
<span class="hl">git clone</span> repo.bundle my-repo

<span class="cmt"># Create incremental bundles (only new commits)</span>
<span class="hl">git bundle</span> create update.bundle v1.0.0..HEAD

<span class="cmt"># Verify a bundle is valid</span>
<span class="hl">git bundle</span> verify repo.bundle

<span class="cmt"># Use case: transfer repos across air-gapped networks,</span>
<span class="cmt"># offline backup, email a repo to someone</span></span>`}}
  ],
  challenges:[
    {q:"Type the command to run an aggressive garbage collection AND prune all unreachable objects immediately.",scenario:"You just rewrote history with BFG to remove secrets. You need to actually shrink the repo size now.",hint:"Combine --aggressive for deep compression with --prune=now to remove unreachable objects immediately.",accept:["git gc --prune=now --aggressive","git gc --aggressive --prune=now"],feedback:"git gc --aggressive --prune=now does a deep optimisation pass (more CPU, better compression) and removes all unreachable objects immediately rather than waiting the default 2-week grace period. Essential after history rewrites to actually reclaim disk space."},
    {q:"Type the command to verify the integrity of all objects in your Git database and report any corruption.",scenario:"A developer reports their clone seems corrupted. What diagnostic command do you run?",hint:"The command stands for 'filesystem check' — abbreviated to four letters.",accept:["git fsck","git fsck ","git fsck --full"],feedback:"git fsck (filesystem check) walks every object in the Git database and verifies that all pointers are valid and no objects are corrupt. It also reports 'dangling' objects — commits, blobs, or trees that exist in the database but aren't reachable from any ref."},
    {q:"Type the command to create a portable bundle file called 'backup.bundle' containing the entire repository including all branches.",scenario:"You need to send a complete copy of a repo to a colleague who has no internet access.",hint:"Use 'git bundle create' with --all to include everything.",accept:["git bundle create backup.bundle --all","git bundle create backup.bundle --all "],feedback:"git bundle create packs the entire repo (or a subset) into a single binary file. --all includes every ref. The recipient can git clone backup.bundle or git fetch backup.bundle to use it. Perfect for air-gapped environments, offline backups, or email transfers."}
  ]
},
{
  title:"Enterprise Platforms",sub:"GitHub Enterprise, GitLab, branch protection, CODEOWNERS, audit logs",
  sections:[
    {label:"Branch protection rules",cards:[
      {title:"Protecting main from mistakes",body:"Branch protection rules prevent direct pushes, require PR reviews, enforce CI checks, and block force-pushes on critical branches. Set at the repo or organisation level. Every enterprise team should protect main and develop at minimum."},
      {title:"GitHub branch protection settings",body:`<ul>
        <li>Require pull request reviews before merging (min. 1–2)</li>
        <li>Dismiss stale reviews when new commits are pushed</li>
        <li>Require review from Code Owners</li>
        <li>Require status checks to pass (CI must be green)</li>
        <li>Require branches to be up to date before merging</li>
        <li>Require signed commits</li>
        <li>Restrict who can push to the branch</li>
        <li>Allow force pushes — DISABLE this</li>
      </ul>`}
    ]},
    {label:"CODEOWNERS",codeblock:{lang:"bash",code:`<span class="cmt"># .github/CODEOWNERS  (or repo root, or /docs/)</span>

<span class="cmt"># Global owner — owns everything not matched below</span>
* @org/platform-team

<span class="cmt"># Directory owners</span>
/frontend/          @alice @bob
/backend/           @org/backend-team
/infra/             @org/devops

<span class="cmt"># File type owners</span>
*.sql               @org/database-team
*.tf                @org/devops          <span class="cmt"># Terraform files</span>
Dockerfile          @org/devops
package.json        @org/security-team   <span class="cmt"># dependency changes</span>

<span class="cmt"># Specific files</span>
.github/workflows/  @org/devops
SECURITY.md         @org/security-team</span>`}},
    {label:"Audit logs and compliance",codeblock:{lang:"bash",code:`<span class="cmt"># GitHub audit log — org level (admin only)</span>
<span class="cmt"># Records: who pushed what, when PRs were merged,</span>
<span class="cmt"># permission changes, secret scanning alerts</span>
<span class="cmt"># GitHub → Org Settings → Audit Log</span>
<span class="cmt"># Exportable via API for SIEM integration</span>

<span class="cmt"># Git-level audit: who did what locally</span>
<span class="hl">git log</span> --format=<span class="str">"%h %aI %ae %s"</span> --all   <span class="cmt"># ISO timestamps</span>
<span class="hl">git log</span> --format=<span class="str">"%H %aI %ae %s"</span> > audit.log

<span class="cmt"># Required commit signing for compliance</span>
<span class="cmt"># GitHub: Settings → Branches → Require signed commits</span>
<span class="cmt"># GitLab: Settings → Repository → Push rules → Reject unsigned commits</span></span>`}},
    {label:"Enterprise-specific features",cards:[
      {title:"GitHub Enterprise / GitLab Self-Hosted",body:"On-premise hosting of Git infrastructure. Custom SSO/SAML integration, IP allowlisting, private npm/container registries, secret detection at org level, compliance reporting, SLA guarantees. Managed by your own infra team."},
      {title:"Merge strategies",body:"Configure per-repo merge behavior: <strong style='font-weight:500'>Merge commit</strong> (preserves full history), <strong style='font-weight:500'>Squash and merge</strong> (one commit per PR — cleanest for trunk-based), <strong style='font-weight:500'>Rebase and merge</strong> (linear history, no merge commit). Many enterprise teams enforce squash-only to keep main history clean."},
      {title:"Dependabot & automated PRs",body:"GitHub's Dependabot automatically creates PRs to update vulnerable dependencies. Configure in <code>.github/dependabot.yml</code>. Set review requirements so automated dependency PRs don't bypass your security gates."}
    ]}
  ],
  challenges:[
    {q:"What file do you create to automatically request reviews from specific people or teams when certain files change in a PR?",scenario:"Your org requires the database team to review every migration file. How do you enforce this automatically?",hint:"CODEOWNERS file — maps file patterns to GitHub users or teams.",accept:["codeowners","CODEOWNERS",".github/codeowners",".github/CODEOWNERS"],feedback:"CODEOWNERS maps file patterns to GitHub users (@username) or teams (@org/team-name). When a PR modifies matching files, those owners are automatically added as required reviewers. Works with branch protection's 'Require review from Code Owners' setting to enforce it."},
    {q:"Name the THREE recommended merge strategies available on GitHub for merging pull requests.",scenario:"Your engineering manager asks you to explain the options and recommend one for a team practicing trunk-based development.",hint:"Think: full merge commit, squash everything into one, or replay commits linearly.",accept:["merge commit, squash and merge, rebase and merge","merge commit squash and merge rebase and merge","squash and merge, merge commit, rebase and merge","merge, squash, rebase","squash merge rebase"],feedback:"GitHub offers: Merge commit (creates a merge commit, preserves all PR commits), Squash and merge (combines all PR commits into one on main — cleanest for trunk-based dev), Rebase and merge (replays PR commits linearly without a merge commit). Most enterprise teams enforce squash-only for a clean, readable main history."},
    {q:"Type the git log format string to output commits with their full hash, ISO 8601 timestamp, author email, and subject — suitable for an audit log export.",scenario:"Your security team needs a machine-readable audit trail of all commits across all branches.",hint:"Use --format with placeholders: %H (hash), %aI (ISO date), %ae (email), %s (subject). Add --all for every branch.",accept:["git log --format=\"%h %ai %ae %s\" --all","git log --format=\"%H %aI %ae %s\" --all","git log --format='%H %aI %ae %s' --all","git log --format='%h %aI %ae %s' --all","--format=\"%h %ai %ae %s\" --all","--format=\"%H %aI %ae %s\" --all"],feedback:"%H = full hash, %aI = ISO 8601 strict author date (better for parsing than %ai), %ae = author email, %s = subject line. The --all flag includes every branch and tag. Pipe this to a file or your SIEM system for compliance logging."}
  ]
}
);