// GitCoven — Platforms & Remotes — Phases 26-28
// This file contains phases 26-28

phases.push(
{
  title:"Connecting to GitHub",sub:"SSH keys, HTTPS, PATs, GitHub CLI — the complete first-time setup",
  sections:[
    {label:"Two ways to authenticate",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">GitHub requires authentication to push code. Your account password no longer works (removed August 2021). You have two options:</p>`,cards:[
      {title:"SSH — set it once, forget it forever (recommended)",body:"Uses a cryptographic key pair stored on your machine. No passwords ever. Once configured, <code>git push</code> just works silently. Most professional developers use SSH for daily work."},
      {title:"HTTPS — simpler but requires a token",body:"Uses a Personal Access Token (PAT) instead of your password. Easier initial setup but you may be prompted for the token periodically. Best for corporate environments that block SSH or for quick one-off pushes."}
    ]},
    {label:"Step 1 — Create a repo on GitHub",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">You need a repository on GitHub before you can push. Two ways to create one:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Option A: Browser (github.com)</span>
<span class="cmt"># 1. Click + → New repository</span>
<span class="cmt"># 2. Name it (e.g. my-project)</span>
<span class="cmt"># 3. Choose Public or Private</span>
<span class="cmt"># 4. Leave README/gitignore/licence UNCHECKED</span>
<span class="cmt">#    (you already have files locally)</span>
<span class="cmt"># 5. Click Create → GitHub shows you the push commands</span>

<span class="cmt"># Option B: GitHub CLI (one command)</span>
gh repo create my-project --public --source=. --remote=origin --push`}},
    {label:"Step 2A — SSH setup (recommended)",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">SSH uses a key pair — a private key on your machine and a public key uploaded to GitHub. The private key proves your identity without sending a password over the network.</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Check if you already have an SSH key</span>
ls ~/.ssh/id_ed25519.pub
<span class="cmt"># If the file exists, skip to "Add to GitHub" below</span>

<span class="cmt"># Generate a new Ed25519 key (stronger and shorter than RSA)</span>
ssh-keygen -t ed25519 -C <span class="str">"you@example.com"</span>
<span class="cmt"># Press Enter for default location (~/.ssh/id_ed25519)</span>
<span class="cmt"># Enter a passphrase (optional but recommended for security)</span>

<span class="cmt"># Start the SSH agent and add your key</span>
eval <span class="str">"$(ssh-agent -s)"</span>
ssh-add ~/.ssh/id_ed25519

<span class="cmt"># Copy your PUBLIC key to clipboard</span>
<span class="cmt"># macOS:</span>
pbcopy < ~/.ssh/id_ed25519.pub
<span class="cmt"># Linux:</span>
cat ~/.ssh/id_ed25519.pub   <span class="cmt"># then copy the output</span>
<span class="cmt"># Windows (Git Bash):</span>
clip < ~/.ssh/id_ed25519.pub`}},
    {label:"Add SSH key to GitHub and test",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Now paste your public key into GitHub's settings:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># 1. GitHub → Settings (top right avatar)</span>
<span class="cmt"># 2. "SSH and GPG keys" in the left sidebar</span>
<span class="cmt"># 3. "New SSH key"</span>
<span class="cmt"># 4. Title: name it (e.g. "MacBook Pro")</span>
<span class="cmt"># 5. Key type: Authentication Key</span>
<span class="cmt"># 6. Paste your public key → "Add SSH key"</span>

<span class="cmt"># TEST THE CONNECTION</span>
ssh -T git@github.com
<span class="cmt"># ✓ "Hi USERNAME! You've successfully authenticated."</span>
<span class="cmt"># ✗ "Permission denied" = key not added correctly</span>

<span class="cmt"># Connect your local repo and push</span>
<span class="hl">git remote add</span> origin git@github.com:USERNAME/REPO.git
<span class="hl">git branch</span> -M main
<span class="hl">git push</span> -u origin main`}},
    {label:"Step 2B — HTTPS with Personal Access Token",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">If SSH isn't available, use a PAT (Personal Access Token) as your password:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Create a PAT on GitHub:</span>
<span class="cmt"># Settings → Developer settings → Personal access tokens</span>
<span class="cmt"># → Tokens (classic) → Generate new token</span>
<span class="cmt"># Scope: tick 'repo' and 'workflow' → Generate → COPY IT NOW</span>

<span class="cmt"># Push using HTTPS</span>
<span class="hl">git remote add</span> origin https://github.com/USERNAME/REPO.git
<span class="hl">git push</span> -u origin main
<span class="cmt"># Username: your GitHub username</span>
<span class="cmt"># Password: paste your PAT (NOT your account password)</span>

<span class="cmt"># Cache credentials so you don't type every time</span>
<span class="hl">git config</span> --global credential.helper osxkeychain  <span class="cmt"># macOS</span>
<span class="hl">git config</span> --global credential.helper store       <span class="cmt"># Linux (plaintext)</span>
<span class="hl">git config</span> --global credential.helper manager     <span class="cmt"># Windows</span>`}},
    {label:"Your first push — complete sequence",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Here's the full end-to-end flow from a brand new project to GitHub:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># 1. Initialise, stage, and commit</span>
<span class="hl">git init</span>
<span class="hl">git add</span> .
<span class="hl">git commit</span> -m <span class="str">"Initial commit"</span>

<span class="cmt"># 2. Rename branch to 'main' (modern standard)</span>
<span class="hl">git branch</span> -M main

<span class="cmt"># 3. Connect to GitHub (SSH version)</span>
<span class="hl">git remote add</span> origin git@github.com:USERNAME/REPO.git

<span class="cmt"># 4. Push and set upstream tracking</span>
<span class="hl">git push</span> -u origin main
<span class="cmt"># After this, future pushes are just: git push</span>

<span class="cmt"># 5. Verify</span>
<span class="hl">git remote</span> -v`}},
    {label:"When your push is rejected",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">If someone else pushed to the remote while you were working, your push will be rejected with <code>failed to push some refs</code>. This is normal — the remote has commits you don't have locally. Fix it by pulling with rebase first:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Error: failed to push some refs</span>
<span class="cmt"># "Updates were rejected because the remote contains work</span>
<span class="cmt"># that you do not have locally."</span>

<span class="cmt"># Fix: pull the remote changes, replay yours on top</span>
<span class="hl">git pull</span> --rebase origin main

<span class="cmt"># Resolve any conflicts if they occur, then:</span>
<span class="hl">git push</span>

<span class="cmt"># ⚠️ NEVER use --force to 'fix' this on a shared branch</span>
<span class="cmt"># That would overwrite your teammate's work</span>`},cards:[
      {title:"Why this happens",body:"Git requires your local branch to contain all of the remote's commits before it will accept a push. If someone else pushed first, you're 'behind'. <code>git pull --rebase</code> downloads their commits and replays your local commits on top, creating a clean linear history. Then your push succeeds."}
    ]}
  ],
  challenges:[
    {q:"You generated an SSH key. Type the command to test that it is correctly connected to your GitHub account.",scenario:"You just added your public key on GitHub. Before trying to push, you want to verify the connection works.",hint:"Use 'ssh -T' (test connection, no shell) followed by git@github.com.",answer:"Answer: ssh -T git@github.com — The -T flag disables terminal allocation (test only, no shell). A successful connection returns 'Hi username! You've successfully authenticated'. If it fails, your SSH key isn't configured correctly.",accept:["ssh -t git@github.com","ssh -T git@github.com","ssh -T git@github.com ","ssh -t git@github.com ","ssh -T github.com"],feedback:"ssh -T git@github.com tests the SSH connection without opening a shell. Success: 'Hi USERNAME! You have successfully authenticated.' Permission denied: your key wasn't added correctly — check that it's in ssh-agent and on your GitHub account."},
    {q:"Type the command to connect your local repo to a GitHub remote called 'origin' using the SSH URL for username 'wiredhash' and repo 'gitcoven'.",scenario:"You created an empty repo on GitHub and now need to link your local project to it.",hint:"Pattern: git remote add origin git@github.com:username/repo.git",answer:"Answer: git remote add origin git@github.com:wiredhash/gitcoven.git — This creates an alias 'origin' pointing to the SSH URL. After this, git push origin main sends your commits to GitHub.",accept:["git remote add origin git@github.com:wiredhash/gitcoven.git","git remote add origin git@github.com:wiredhash/gitcoven"],feedback:"git remote add origin sets up the connection between your local repo and GitHub. The SSH URL format is always git@github.com:USERNAME/REPO.git. After this, push with git push -u origin main."},
    {q:"Type the single command to push your local 'main' branch to 'origin' for the first time AND set it as the default upstream so future pushes just need 'git push'.",scenario:"This is your very first push to GitHub. You want to set it up so you never need to specify the remote and branch again.",hint:"You need 'git push' with the -u flag (set upstream) followed by 'origin main'.",answer:"Answer: git push -u origin main — The -u flag (--set-upstream) creates a tracking link so future git push and git pull commands know where to go without specifying the remote and branch.",accept:["git push -u origin main","git push --set-upstream origin main"],feedback:"The -u flag creates a tracking link between your local main and origin/main. After this first push, git push and git pull work without arguments because Git knows where to send and receive."},
    {q:"Your push was rejected with 'error: failed to push some refs'. What command do you run to fix it safely?",scenario:"A teammate pushed to main while you were working. Your push got rejected because your local branch is behind the remote.",hint:"The remote has commits you don't have yet. Pull with --rebase first, then push again.",answer:"Answer: git pull --rebase origin main, then git push. The remote has commits you don't have locally. Pull with --rebase to replay your local commits on top of the remote's, then push cleanly.",accept:["git pull --rebase then git push","git pull --rebase","pull --rebase then push","git pull --rebase origin main","run git pull --rebase then git push","git pull --rebase then push","git pull --rebase and then git push","pull rebase then push","git pull --rebase first","first git pull --rebase then git push"],feedback:"A rejected push means the remote has commits you don't have. git pull --rebase downloads their commits and replays yours on top. Then git push succeeds. Never force push on shared branches to 'fix' this — that overwrites teammates' work."}
  ]
},
{
  title:"Pushing to GitLab & Bitbucket",sub:"Platform setup, differences, and multi-remote workflows",
  sections:[
    {label:"GitLab setup",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Your same SSH key works on GitLab — just add the public key to your GitLab account. The workflow is almost identical to GitHub:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Add your SSH key to GitLab:</span>
<span class="cmt"># GitLab → Avatar → Preferences → SSH Keys → Paste public key</span>

<span class="cmt"># Test the connection</span>
ssh -T git@gitlab.com
<span class="cmt"># ✓ "Welcome to GitLab, @username!"</span>

<span class="cmt"># Push to GitLab</span>
<span class="hl">git remote add</span> origin git@gitlab.com:USERNAME/REPO.git
<span class="hl">git push</span> -u origin main

<span class="cmt"># GitLab HTTPS with Personal Access Token</span>
<span class="cmt"># User Settings → Access Tokens → Scope: read/write_repository</span>
<span class="hl">git remote add</span> origin https://oauth2:YOUR_TOKEN@gitlab.com/USERNAME/REPO.git`}},
    {label:"Bitbucket setup",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Bitbucket (owned by Atlassian) uses App Passwords instead of PATs. SSH setup is the same pattern:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Add SSH key: Bitbucket → Personal settings → SSH keys → Add key</span>

<span class="cmt"># Test connection</span>
ssh -T git@bitbucket.org
<span class="cmt"># ✓ "authenticated as USERNAME"</span>

<span class="cmt"># Push to Bitbucket</span>
<span class="hl">git remote add</span> origin git@bitbucket.org:USERNAME/REPO.git
<span class="hl">git push</span> -u origin main`}},
    {label:"Pushing to multiple remotes simultaneously",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">You can mirror your repo across multiple platforms so a single <code>git push</code> sends to both GitHub and GitLab:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Method 1: Separate remotes (push individually)</span>
<span class="hl">git remote add</span> github git@github.com:USERNAME/REPO.git
<span class="hl">git remote add</span> gitlab git@gitlab.com:USERNAME/REPO.git
<span class="hl">git push</span> github main
<span class="hl">git push</span> gitlab main

<span class="cmt"># Method 2: Multi-URL push (one command pushes to both)</span>
<span class="hl">git remote add</span> origin git@github.com:USERNAME/REPO.git
<span class="hl">git remote set-url</span> --add --push origin git@github.com:USERNAME/REPO.git
<span class="hl">git remote set-url</span> --add --push origin git@gitlab.com:USERNAME/REPO.git
<span class="cmt"># Now: git push → sends to BOTH GitHub and GitLab</span>

<span class="cmt"># Verify multi-URL setup</span>
<span class="hl">git remote</span> -v`}},
    {label:"Switching from HTTPS to SSH",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">If you cloned with HTTPS and want to switch to SSH (to stop being prompted for credentials):</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Check current URL</span>
<span class="hl">git remote</span> -v
<span class="cmt"># origin  https://github.com/USERNAME/REPO.git (fetch)</span>

<span class="cmt"># Switch to SSH</span>
<span class="hl">git remote set-url</span> origin git@github.com:USERNAME/REPO.git

<span class="cmt"># Verify the change</span>
<span class="hl">git remote</span> -v
<span class="cmt"># origin  git@github.com:USERNAME/REPO.git (fetch)</span>`}},
    {label:"Common push errors and fixes",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">These are the most frequent push errors you'll encounter. Knowing the fix for each saves hours of frustration:</p>`,cards:[
      {title:"src refspec main does not match any",body:"Your local branch isn't called 'main'. Check with <code>git branch</code> — it might be 'master'. Either rename it (<code>git branch -M main</code>) or push the correct name (<code>git push -u origin master</code>)."},
      {title:"Repository not found",body:"Wrong remote URL or no access. Verify with <code>git remote -v</code>. Make sure the repo exists on GitHub and you have push access."},
      {title:"Permission denied (publickey)",body:"SSH key not found or not added. Run <code>ssh -T git@github.com</code> to diagnose. Check that your key is in ssh-agent (<code>ssh-add -l</code>) and added to your GitHub account."},
      {title:"Support for password authentication was removed",body:"GitHub stopped accepting passwords in August 2021. Switch to <strong>SSH keys</strong> (recommended) or create a <strong>Personal Access Token</strong> (Developer Settings → Tokens). These are the only two modern authentication methods."}
    ]}
  ],
  challenges:[
    {q:"Type the command to test that your SSH key is correctly connected to your GitLab account.",scenario:"You just added your SSH public key to GitLab. Verify it works before pushing.",hint:"Same as GitHub but point to git@gitlab.com instead.",answer:"Answer: ssh -T git@gitlab.com — Same principle as GitHub. A successful response confirms your SSH key is registered with your GitLab account. If it fails, check your SSH key settings.",accept:["ssh -t git@gitlab.com","ssh -T git@gitlab.com","ssh -T git@gitlab.com ","ssh -t git@gitlab.com ","ssh -T gitlab.com"],feedback:"ssh -T git@gitlab.com tests the SSH connection to GitLab. Success: 'Welcome to GitLab, @username!' — note it says 'Welcome' not 'Hi' like GitHub. The same SSH key pair works for GitHub, GitLab, and Bitbucket — just add your public key to each."},
    {q:"Type the command to change an existing remote called 'origin' from its current HTTPS URL to the SSH URL for username 'wiredhash', repo 'gitcoven'.",scenario:"You set up your repo with HTTPS and now want to switch to SSH so you stop being prompted for credentials.",hint:"Use 'git remote set-url' to change the URL without removing the remote.",answer:"Answer: git remote set-url origin git@github.com:wiredhash/gitcoven.git — Changes the URL without removing the remote. All tracking relationships stay intact.",accept:["git remote set-url origin git@github.com:wiredhash/gitcoven.git","git remote set-url origin git@github.com:wiredhash/gitcoven"],feedback:"git remote set-url replaces the URL for a remote without re-adding it. All tracking branch relationships stay intact. After switching, git push and git pull use SSH silently."},
    {q:"Type the command to configure 'origin' to push to a SECOND URL so that one git push goes to both GitHub and GitLab.",scenario:"You want your repo mirrored on both platforms. You already have origin pointing to GitHub. Add GitLab as a second push destination.",hint:"Use 'git remote set-url --add --push origin' followed by the second URL.",answer:"Answer: git remote set-url --add --push origin git@gitlab.com:wiredhash/gitcoven.git — The --add --push flags add a secondary push URL. Now git push sends to both simultaneously.",accept:["git remote set-url --add --push origin git@gitlab.com:wiredhash/gitcoven.git","git remote set-url --add --push origin git@gitlab.com:wiredhash/gitcoven"],feedback:"--add --push adds an extra push URL without replacing the existing one. A single git push now sends to all configured push URLs simultaneously. Verify with git remote -v."},
    {q:"Your push fails with 'Support for password authentication was removed'. What are the two modern authentication methods you can use instead?",scenario:"A new developer on your team gets this error on their first push. What do you tell them?",hint:"The two modern methods: SSH keys (keypair-based) and Personal Access Tokens (generated in settings).",answer:"Answer: SSH keys and Personal Access Tokens (PATs). GitHub removed password auth in August 2021. SSH uses a key pair for silent authentication. PATs are generated in Settings → Developer settings.",accept:["ssh and personal access token","ssh key and personal access token","personal access token and ssh","pat and ssh","ssh or pat","ssh keys and pats","ssh keys and personal access tokens"],feedback:"GitHub removed password authentication in August 2021. The two alternatives: SSH keys (generate a key pair, add public key to GitHub — recommended for daily use) or Personal Access Tokens (generate in Developer Settings, use as password — good for scripts and CI)."}
  ]
},
{
  title:"GitHub CLI & Advanced Remote Workflows",sub:"gh CLI, force pushing safely, deploy keys, and remote troubleshooting",
  sections:[
    {label:"GitHub CLI (gh) — manage GitHub from your terminal",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">The <code>gh</code> CLI lets you create repos, open PRs, manage issues, and trigger workflows without leaving your terminal. It replaces many browser-based GitHub tasks:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Install and authenticate</span>
brew install gh                    <span class="cmt"># macOS</span>
sudo apt install gh                <span class="cmt"># Ubuntu</span>
winget install GitHub.cli          <span class="cmt"># Windows</span>
gh auth login                      <span class="cmt"># authenticate with GitHub</span>

<span class="cmt"># Create a repo from current directory and push</span>
gh repo create my-app --public --source=. --push

<span class="cmt"># Clone a repo (handles SSH/HTTPS automatically)</span>
gh repo clone USERNAME/REPO

<span class="cmt"># PR workflow from terminal</span>
gh pr create --title <span class="str">"Fix login bug"</span> --body <span class="str">"Details..."</span>
gh pr list                         <span class="cmt"># list open PRs</span>
gh pr checkout 42                  <span class="cmt"># checkout PR #42 locally</span>
gh pr merge 42 --squash            <span class="cmt"># merge a PR</span>

<span class="cmt"># Other useful commands</span>
gh issue create                    <span class="cmt"># create an issue</span>
gh workflow run ci.yml             <span class="cmt"># trigger a GitHub Action</span>
gh release create v1.0.0 --generate-notes`}},
    {label:"Force pushing safely",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Sometimes you need to force push — after rebasing a feature branch, after amending a commit you already pushed. But <code>--force</code> blindly overwrites the remote and can destroy teammates' work. Always use the safe version:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># ⚠️ DANGEROUS — overwrites remote blindly, can destroy work</span>
<span class="hl">git push</span> --force

<span class="cmt"># ✅ SAFE — checks that no one else pushed since you last fetched</span>
<span class="hl">git push</span> --force-with-lease
<span class="cmt"># If someone else pushed, it ABORTS instead of overwriting</span>

<span class="cmt"># When is force pushing legitimate?</span>
<span class="cmt"># ✓ After rebasing YOUR OWN feature branch</span>
<span class="cmt"># ✓ After amending a commit on YOUR OWN branch</span>
<span class="cmt"># ✗ NEVER on main, develop, or any shared branch</span>

<span class="cmt"># Create an alias so you never accidentally use --force</span>
<span class="hl">git config</span> --global alias.pushf <span class="str">"push --force-with-lease"</span>`}},
    {label:"Remote branch management",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Over time, remote branches pile up as features are merged. Keep your branch list clean with these commands:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Delete a remote branch</span>
<span class="hl">git push</span> origin --delete feature-old
<span class="cmt"># Only deletes on the remote — your local branch still exists</span>

<span class="cmt"># Remove stale remote-tracking branches (ones deleted on remote)</span>
<span class="hl">git fetch</span> --prune
<span class="cmt"># Removes local refs like origin/feature-old that no longer exist</span>

<span class="cmt"># Auto-prune on every fetch (set once, applies forever)</span>
<span class="hl">git config</span> --global fetch.prune true

<span class="cmt"># List all remote branches</span>
<span class="hl">git branch</span> -r

<span class="cmt"># See detailed info about a remote</span>
<span class="hl">git remote show</span> origin`}},
    {label:"Deploy keys — CI/CD access",content:`<p style="color:var(--text2);font-size:14px;margin-bottom:14px">Deploy keys are SSH keys tied to a single repo (not your account). CI servers get access to one repo without your full account permissions:</p>`,codeblock:{lang:"bash",code:`<span class="cmt"># Generate a dedicated key for the deployment server</span>
ssh-keygen -t ed25519 -C <span class="str">"deploy-key-prod"</span> -f ~/.ssh/deploy_key

<span class="cmt"># Add the PUBLIC key to the repo on GitHub:</span>
<span class="cmt"># Repo → Settings → Deploy keys → Add deploy key</span>
<span class="cmt"># Tick "Allow write access" only if CI needs to push</span>

<span class="cmt"># Configure SSH to use deploy key for this repo</span>
<span class="cmt"># Add to ~/.ssh/config:</span>
<span class="cmt"># Host github-deploy</span>
<span class="cmt">#   HostName github.com</span>
<span class="cmt">#   User git</span>
<span class="cmt">#   IdentityFile ~/.ssh/deploy_key</span>

<span class="cmt"># Set the remote to use the deploy host alias</span>
<span class="hl">git remote set-url</span> origin git@github-deploy:USERNAME/REPO.git`}},
    {label:"Congratulations!",content:`<div class="info"><div class="callout-icon">🎓</div><div><strong>You've completed all 28 phases of GitCoven.</strong> You now have comprehensive Git knowledge spanning fundamentals through enterprise-level workflows. You understand the three areas, branching, merging, rebasing, recovery, tags, workflows, CI/CD, security, monorepos, and platform-specific setup. This puts you ahead of most developers — not just in what you can do with Git, but in understanding <em>why</em> each tool exists and <em>when</em> to use it. Go build things, contribute to open source, and land that job. You've earned it.</div></div>`}
  ],
  challenges:[
    {q:"Type the safe force push command you should ALWAYS use instead of git push --force.",scenario:"You rebased your feature branch and need to force push it to GitHub. What is the safe version?",hint:"There's a safer version of --force that checks for remote changes first: --force-with-lease.",answer:"Answer: git push --force-with-lease — Unlike --force (which blindly overwrites), this checks that the remote hasn't been updated since your last fetch. If someone else pushed, it rejects yours to prevent data loss.",accept:["git push --force-with-lease","git push --force-with-lease origin","git pushf","git push --force-with-lease origin main"],feedback:"--force-with-lease checks that the remote hasn't changed since your last fetch. If a teammate pushed in the meantime, the command fails to protect their work. Plain --force blindly overwrites. Always use --force-with-lease."},
    {q:"Type the command to delete a remote branch called 'feature-old' on origin.",scenario:"A feature branch was merged and you want to clean it up from the remote.",hint:"Use 'git push origin --delete' followed by the branch name.",answer:"Answer: git push origin --delete feature-old — Removes the branch from the remote server. Your local branch is not affected. The older syntax is git push origin :feature-old.",accept:["git push origin --delete feature-old","git push origin :feature-old","git push --delete origin feature-old"],feedback:"git push origin --delete sends a delete instruction to the remote. The older syntax git push origin :feature-old also works. This only deletes the remote branch — delete your local copy separately with git branch -d feature-old."},
    {q:"Type the command to remove stale remote-tracking branches that no longer exist on the remote server.",scenario:"Your local git branch -r shows 20 remote branches, but most were deleted on GitHub months ago.",hint:"Use 'git fetch' with the --prune flag to clean up deleted remote branches.",answer:"Answer: git fetch --prune (or git fetch -p) — Removes local remote-tracking branches (like origin/old-branch) that no longer exist on the remote. Keeps your branch list clean.",accept:["git fetch --prune","git fetch -p","git remote prune origin","git fetch --prune origin"],feedback:"git fetch --prune downloads new changes AND removes local refs for remote branches that were deleted on the server. Set it permanently with: git config --global fetch.prune true"},
    {q:"Type the GitHub CLI command to create a new PUBLIC repository called 'my-app' on GitHub from your current directory and push it immediately.",scenario:"You want to publish a local project to GitHub in a single command without touching the browser.",hint:"Use 'gh repo create' with --public, --source=. and --push flags.",answer:"Answer: gh repo create my-app --public --source=. --push — Creates the repo on GitHub, sets it as origin, and pushes your code in one command.",accept:["gh repo create my-app --public --source=. --push","gh repo create my-app --public --source . --push","gh repo create my-app --public --source=. --push ","gh repo create my-app --public --push --source=.","gh repo create my-app --public --push --source ."],feedback:"This single command creates the GitHub repo, adds it as origin, and pushes. --source=. uses the current directory. --push sends the initial commit. It's the fastest way to go from local code to published repo."}
  ]
}
);