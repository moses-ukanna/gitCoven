// GitCoven — Platforms & Remotes — Phases 26-28
// This file contains phases 26-28

phases.push(
{
  title:"Connecting to GitHub",sub:"SSH keys, HTTPS, PATs, GitHub CLI — the complete first-time setup",
  sections:[
    {label:"Two ways to authenticate with GitHub",cards:[
      {title:"HTTPS — simple but requires a token",body:"Uses your GitHub username + a Personal Access Token (PAT) as the password. Easier to set up. You'll be prompted for credentials on first push. Can be cached so you don't type it every time. Best for beginners or corporate environments that block SSH."},
      {title:"SSH — set it once, forget it forever",body:"Uses a cryptographic key pair stored on your machine. No passwords ever. Once configured, <code>git push</code> just works silently. Best for daily development. This is what most professional developers use."}
    ]},
    {label:"Step 1 — Create a repo on GitHub",codeblock:{lang:"bash",code:`<span class="cmt"># Option A: Do it on github.com (browser)</span>
<span class="cmt"># 1. Go to github.com → click + → New repository</span>
<span class="cmt"># 2. Name it (e.g. my-project)</span>
<span class="cmt"># 3. Choose Public or Private</span>
<span class="cmt"># 4. Leave README/gitignore/licence UNCHECKED</span>
<span class="cmt">#    (you already have files locally)</span>
<span class="cmt"># 5. Click Create repository</span>
<span class="cmt"># 6. GitHub shows you the push commands — copy them</span>

<span class="cmt"># Option B: GitHub CLI (faster once installed)</span>
gh repo create my-project --public --source=. --remote=origin --push</span>`}},
    {label:"Step 2A — SSH setup (recommended)",codeblock:{lang:"bash",code:`<span class="cmt">── GENERATE YOUR SSH KEY ─────────────────────────</span>
<span class="cmt"># Check if you already have one</span>
ls ~/.ssh/id_ed25519.pub
<span class="cmt"># If file exists, you already have a key — skip to "Add to GitHub"</span>

<span class="cmt"># Generate a new Ed25519 key (stronger than RSA)</span>
ssh-keygen -t ed25519 -C <span class="str">"you@example.com"</span>
<span class="cmt"># Press Enter to accept default location (~/.ssh/id_ed25519)</span>
<span class="cmt"># Enter a passphrase (optional but recommended)</span>

<span class="cmt">── ADD KEY TO SSH AGENT ──────────────────────────</span>
<span class="cmt"># macOS / Linux</span>
eval <span class="str">"$(ssh-agent -s)"</span>
ssh-add ~/.ssh/id_ed25519

<span class="cmt"># macOS — also add to Keychain so it persists reboots</span>
ssh-add --apple-use-keychain ~/.ssh/id_ed25519

<span class="cmt">── COPY YOUR PUBLIC KEY ──────────────────────────</span>
<span class="cmt"># macOS</span>
pbcopy < ~/.ssh/id_ed25519.pub

<span class="cmt"># Linux</span>
cat ~/.ssh/id_ed25519.pub   <span class="cmt"># then copy the output manually</span>
xclip -sel clip < ~/.ssh/id_ed25519.pub  <span class="cmt"># or use xclip</span>

<span class="cmt"># Windows (Git Bash)</span>
clip < ~/.ssh/id_ed25519.pub</span>`}},
    {label:"Step 2A continued — Add SSH key to GitHub",codeblock:{lang:"bash",code:`<span class="cmt"># On GitHub:</span>
<span class="cmt"># 1. Go to github.com → Settings (top right avatar)</span>
<span class="cmt"># 2. Click "SSH and GPG keys" in the left sidebar</span>
<span class="cmt"># 3. Click "New SSH key"</span>
<span class="cmt"># 4. Title: give it a name (e.g. "MacBook Pro 2024")</span>
<span class="cmt"># 5. Key type: Authentication Key</span>
<span class="cmt"># 6. Paste your public key into the Key field</span>
<span class="cmt"># 7. Click "Add SSH key"</span>

<span class="cmt">── TEST THE CONNECTION ───────────────────────────</span>
ssh -T git@github.com
<span class="cmt"># Expected: "Hi USERNAME! You've successfully authenticated."</span>
<span class="cmt"># If you see "Permission denied" — key not added correctly</span>

<span class="cmt">── NOW PUSH USING SSH URL ────────────────────────</span>
<span class="hl">git remote add</span> origin git@github.com:USERNAME/REPO.git
<span class="hl">git branch</span> -M main
<span class="hl">git push</span> -u origin main</span>`}},
    {label:"Step 2B — HTTPS with Personal Access Token (PAT)",codeblock:{lang:"bash",code:`<span class="cmt">── CREATE A PAT ON GITHUB ────────────────────────</span>
<span class="cmt"># GitHub no longer accepts your account password for git push</span>
<span class="cmt"># You must use a Personal Access Token instead</span>
<span class="cmt">#</span>
<span class="cmt"># GitHub → Settings → Developer settings (bottom left)</span>
<span class="cmt"># → Personal access tokens → Tokens (classic)</span>
<span class="cmt"># → Generate new token (classic)</span>
<span class="cmt"># → Give it a name, set expiry, tick: repo, workflow</span>
<span class="cmt"># → Generate token → COPY IT NOW (shown only once)</span>

<span class="cmt">── USE THE TOKEN ─────────────────────────────────</span>
<span class="hl">git remote add</span> origin https://github.com/USERNAME/REPO.git
<span class="hl">git push</span> -u origin main
<span class="cmt"># Username: your GitHub username</span>
<span class="cmt"># Password: paste your PAT (not your account password)</span>

<span class="cmt">── CACHE CREDENTIALS (so you don't type every time) ─</span>
<span class="cmt"># macOS — uses Keychain automatically</span>
<span class="hl">git config</span> --global credential.helper osxkeychain

<span class="cmt"># Linux</span>
<span class="hl">git config</span> --global credential.helper store   <span class="cmt"># saves to disk (plaintext)</span>
<span class="hl">git config</span> --global credential.helper <span class="str">"cache --timeout=3600"</span>  <span class="cmt"># memory only</span>

<span class="cmt"># Windows</span>
<span class="hl">git config</span> --global credential.helper manager  <span class="cmt"># Git Credential Manager</span></span>`}},
    {label:"Step 3 — Your first push (end to end)",codeblock:{lang:"bash",code:`<span class="cmt"># Full sequence from a brand new project folder:</span>

<span class="cmt"># 1. Initialise the repo</span>
<span class="hl">git init</span>
<span class="hl">git add</span> .
<span class="hl">git commit</span> -m <span class="str">"Initial commit"</span>

<span class="cmt"># 2. Rename branch to main (modern standard)</span>
<span class="hl">git branch</span> -M main

<span class="cmt"># 3. Connect to GitHub remote (SSH version)</span>
<span class="hl">git remote add</span> origin git@github.com:USERNAME/REPO.git

<span class="cmt"># 4. Push and set upstream tracking</span>
<span class="hl">git push</span> -u origin main
<span class="cmt"># After this, future pushes are just: git push</span>

<span class="cmt"># 5. Verify remote is set correctly</span>
<span class="hl">git remote</span> -v
<span class="cmt"># origin  git@github.com:USERNAME/REPO.git (fetch)</span>
<span class="cmt"># origin  git@github.com:USERNAME/REPO.git (push)</span></span>`}}
  ],
  challenges:[
    {q:"You generated an SSH key. Type the command to test that it is correctly connected to your GitHub account.",scenario:"You just added your public key on GitHub. Before trying to push, you want to verify the connection works.",hint:"Use 'ssh -T' (test connection, no shell) followed by git@github.com.",answer:"Answer: ssh -T git@github.com — The -T flag disables terminal allocation (test only, no shell). A successful connection returns \'Hi username! You\'ve successfully authenticated\'. If it fails, your SSH key isn\'t configured correctly.",accept:["ssh -t git@github.com","ssh -T git@github.com","ssh -T git@github.com ","ssh -t git@github.com ","ssh -T github.com"],feedback:"ssh -T git@github.com tests the SSH connection to GitHub without opening a shell. A successful response is: 'Hi USERNAME! You have successfully authenticated, but GitHub does not provide shell access.' If you get Permission denied, your key was not added correctly."},
    {q:"Type the command to connect your local repo to a GitHub remote called 'origin' using the SSH URL for username 'wiredhash' and repo 'gitcoven'.",scenario:"You created an empty repo on GitHub and now need to link your local project to it.",hint:"Pattern: git remote add origin git@github.com:username/repo.git",answer:"Answer: git remote add origin git@github.com:wiredhash/gitcoven.git — This creates an alias \'origin\' pointing to the SSH URL. After this, git push origin main sends your commits to GitHub.",accept:["git remote add origin git@github.com:wiredhash/gitcoven.git","git remote add origin git@github.com:wiredhash/gitcoven"],feedback:"git remote add origin sets up the connection between your local repo and GitHub. The SSH URL format is always git@github.com:USERNAME/REPO.git. After this you can push with git push -u origin main."},
    {q:"Type the single command to push your local 'main' branch to 'origin' for the first time AND set it as the default upstream so future pushes just need 'git push'.",scenario:"This is your very first push to GitHub. You want to set it up so you never need to specify the remote and branch again.",hint:"You need 'git push' with the -u flag (set upstream) followed by 'origin main'.",answer:"Answer: git push -u origin main — The -u flag (--set-upstream) creates a tracking link so future git push and git pull commands know where to go without specifying the remote and branch.",accept:["git push -u origin main","git push --set-upstream origin main"],feedback:"The -u flag (short for --set-upstream) creates a tracking link between your local main and origin/main. After this, git push and git pull work without any arguments because Git knows where to send and receive changes."},
    {q:"Your push was rejected with 'error: failed to push some refs'. What does this mean and what command do you run to fix it safely?",scenario:"A teammate pushed to main while you were working. Your push got rejected because your local branch is behind the remote.",hint:"The remote has commits you don't have yet. Pull with --rebase first, then push again.",answer:"Answer: git pull --rebase origin main, then git push. The remote has commits you don\'t have locally. Pull with --rebase to replay your local commits on top of the remote\'s, then push cleanly.",accept:["git pull --rebase then git push","git pull --rebase","pull --rebase then push","git pull --rebase origin main","run git pull --rebase then git push","git pull --rebase then push","git pull --rebase and then git push","pull rebase then push","git pull --rebase first","first git pull --rebase then git push"],keywords:["pull","rebase|--rebase"],feedback:"A rejected push means the remote has commits your local branch doesn't have yet. git pull --rebase fetches the remote commits and replays your local commits on top, giving a clean linear history. Then git push succeeds. Never force push on shared branches to 'fix' a rejection."}
  ]
},
{
  title:"Pushing to GitLab & Bitbucket",sub:"Platform setup, differences, and multi-remote workflows",
  sections:[
    {label:"GitLab setup",codeblock:{lang:"bash",code:`<span class="cmt">── SSH KEY FOR GITLAB ────────────────────────────</span>
<span class="cmt"># Same SSH key works — just add it to GitLab too</span>
<span class="cmt"># GitLab → avatar → Preferences → SSH Keys</span>
<span class="cmt"># Paste your public key → Add key</span>

<span class="cmt"># Test connection</span>
ssh -T git@gitlab.com
<span class="cmt"># Expected: "Welcome to GitLab, @username!"</span>

<span class="cmt">── PUSH TO GITLAB ────────────────────────────────</span>
<span class="cmt"># Create a new project on gitlab.com first</span>
<span class="hl">git remote add</span> origin git@gitlab.com:USERNAME/REPO.git
<span class="hl">git push</span> -u origin main

<span class="cmt"># GitLab HTTPS with PAT</span>
<span class="cmt"># GitLab → User Settings → Access Tokens</span>
<span class="cmt"># Scope: read_repository + write_repository</span>
<span class="hl">git remote add</span> origin https://oauth2:YOUR_TOKEN@gitlab.com/USERNAME/REPO.git</span>`}},
    {label:"Bitbucket setup",codeblock:{lang:"bash",code:`<span class="cmt">── SSH KEY FOR BITBUCKET ─────────────────────────</span>
<span class="cmt"># Bitbucket → Personal settings → SSH keys → Add key</span>

<span class="cmt"># Test connection</span>
ssh -T git@bitbucket.org
<span class="cmt"># Expected: "authenticated as USERNAME"</span>

<span class="cmt">── PUSH TO BITBUCKET ─────────────────────────────</span>
<span class="cmt"># Create repo on bitbucket.org first</span>
<span class="hl">git remote add</span> origin git@bitbucket.org:USERNAME/REPO.git
<span class="hl">git push</span> -u origin main

<span class="cmt"># Bitbucket App Passwords (alternative to SSH)</span>
<span class="cmt"># Account Settings → App passwords → Create</span>
<span class="cmt"># Permissions: Repositories read + write</span>
<span class="hl">git remote add</span> origin https://USERNAME:APP_PASSWORD@bitbucket.org/USERNAME/REPO.git</span>`}},
    {label:"Pushing to multiple remotes simultaneously",codeblock:{lang:"bash",code:`<span class="cmt"># Mirror your repo to GitHub AND GitLab at the same time</span>

<span class="cmt"># Add a second remote</span>
<span class="hl">git remote add</span> github  git@github.com:USERNAME/REPO.git
<span class="hl">git remote add</span> gitlab  git@gitlab.com:USERNAME/REPO.git

<span class="cmt"># Push to each individually</span>
<span class="hl">git push</span> github main
<span class="hl">git push</span> gitlab main

<span class="cmt"># OR — configure one remote to push to multiple URLs at once</span>
<span class="hl">git remote add</span> origin git@github.com:USERNAME/REPO.git
<span class="hl">git remote set-url</span> --add --push origin git@github.com:USERNAME/REPO.git
<span class="hl">git remote set-url</span> --add --push origin git@gitlab.com:USERNAME/REPO.git

<span class="cmt"># Now git push sends to BOTH GitHub and GitLab</span>
<span class="hl">git push</span>   <span class="cmt"># → pushes to both simultaneously</span>

<span class="cmt"># Verify the setup</span>
<span class="hl">git remote</span> -v</span>`}},
    {label:"Switching from HTTPS to SSH on an existing repo",codeblock:{lang:"bash",code:`<span class="cmt"># Check current remote URL</span>
<span class="hl">git remote</span> -v
<span class="cmt"># origin  https://github.com/USERNAME/REPO.git (fetch)</span>

<span class="cmt"># Switch to SSH</span>
<span class="hl">git remote set-url</span> origin git@github.com:USERNAME/REPO.git

<span class="cmt"># Verify</span>
<span class="hl">git remote</span> -v
<span class="cmt"># origin  git@github.com:USERNAME/REPO.git (fetch)</span></span>`}},
    {label:"Common push errors and fixes",cards:[
      {title:"error: src refspec main does not match any",body:"Your local branch is not called 'main'. Check with <code>git branch</code> — it might be called 'master'. Either rename it: <code>git branch -M main</code>, or push the correct branch: <code>git push -u origin master</code>."},
      {title:"remote: Repository not found",body:"The remote URL is wrong, or you don't have access. Double-check the URL with <code>git remote -v</code>. Make sure you created the repo on GitHub first and that you have access to it."},
      {title:"error: failed to push some refs (non-fast-forward)",body:"The remote has commits you don't have locally. Run <code>git pull --rebase</code> then <code>git push</code>. Never force-push on shared branches."},
      {title:"Permission denied (publickey)",body:"SSH key not found or not added to GitHub. Run <code>ssh -T git@github.com</code> to diagnose. Make sure your key is added to ssh-agent with <code>ssh-add ~/.ssh/id_ed25519</code> and added to your GitHub account."},
      {title:"Support for password authentication was removed",body:"GitHub stopped accepting passwords in 2021. You must use a Personal Access Token or SSH. Switch to SSH (recommended) or create a PAT under Developer Settings."}
    ]}
  ],
  challenges:[
    {q:"Type the command to test that your SSH key is correctly connected to your GitLab account.",scenario:"You just added your SSH public key to GitLab. Verify it works before pushing.",hint:"Same as GitHub but point to git@gitlab.com instead.",answer:"Answer: ssh -T git@gitlab.com — Same principle as GitHub. A successful response confirms your SSH key is registered with your GitLab account. If it fails, check your ~/.ssh/config and GitLab SSH key settings.",accept:["ssh -t git@gitlab.com","ssh -T git@gitlab.com","ssh -T git@gitlab.com ","ssh -t git@gitlab.com ","ssh -T gitlab.com"],feedback:"ssh -T git@gitlab.com tests the SSH tunnel to GitLab. A successful response is 'Welcome to GitLab, @username!' — note it says Welcome, not Hi like GitHub. Same key pair works for GitHub, GitLab, and Bitbucket — you just need to add the same public key to each platform."},
    {q:"Type the command to change an existing remote called 'origin' from its current HTTPS URL to the SSH URL for username 'wiredhash', repo 'gitcoven'.",scenario:"You set up your repo with HTTPS and now want to switch to SSH so you stop being prompted for credentials.",hint:"Use 'git remote set-url' to change the URL without removing the remote.",answer:"Answer: git remote set-url origin git@github.com:wiredhash/gitcoven.git — This changes the URL without removing the remote. Use git remote -v to verify the change.",accept:["git remote set-url origin git@github.com:wiredhash/gitcoven.git","git remote set-url origin git@github.com:wiredhash/gitcoven"],feedback:"git remote set-url replaces the existing URL for a remote without removing and re-adding it. All your tracking branch relationships stay intact. After this, git push and git pull use SSH silently with no credential prompts."},
    {q:"Type the command to configure 'origin' to push to a SECOND URL so that one git push goes to both GitHub and GitLab.",scenario:"You want your repo mirrored on both platforms. You already have origin pointing to GitHub. Add GitLab as a second push destination.",hint:"Use 'git remote set-url --add --push origin' followed by the second URL.",answer:"Answer: git remote set-url --add --push origin git@gitlab.com:wiredhash/gitcoven.git — The --add --push flags add a secondary push URL. Now git push origin sends to both GitHub and GitLab simultaneously.",accept:["git remote set-url --add --push origin git@gitlab.com:wiredhash/gitcoven.git","git remote set-url --add --push origin git@gitlab.com:wiredhash/gitcoven"],feedback:"git remote set-url --add --push adds an extra push URL to the remote without replacing the existing one. After this, a single git push sends commits to all configured push URLs simultaneously. Use git remote -v to verify both push destinations are listed."},
    {q:"Your push fails with 'Support for password authentication was removed'. What are the two modern authentication methods you can use instead?",scenario:"A new developer on your team gets this error on their first push. What do you tell them?",hint:"The two modern methods: SSH keys (keypair-based) and Personal Access Tokens (generated in settings).",answer:"Answer: SSH keys and Personal Access Tokens (PATs). GitHub removed password authentication in August 2021. SSH uses a key pair for silent auth. PATs are generated in GitHub Settings → Developer settings and used like passwords for HTTPS.",accept:["ssh and personal access token","ssh key and personal access token","personal access token and ssh","pat and ssh","ssh or pat","ssh keys and pats"],keywords:["ssh","personal access token|pat|token"],feedback:"GitHub removed password authentication in August 2021. The two alternatives are: SSH keys (generate a key pair, add public key to GitHub — recommended for daily use) or Personal Access Tokens (generate in Developer Settings, use as password when prompted — good for scripts and CI)."}
  ]
},
{
  title:"GitHub CLI & Advanced Remote Workflows",sub:"gh CLI, force pushing safely, deploy keys, and remote troubleshooting",
  sections:[
    {label:"GitHub CLI — gh",codeblock:{lang:"bash",code:`<span class="cmt"># Install</span>
brew install gh                    <span class="cmt"># macOS</span>
sudo apt install gh                <span class="cmt"># Ubuntu</span>
winget install GitHub.cli          <span class="cmt"># Windows</span>

<span class="cmt"># Authenticate</span>
gh auth login
<span class="cmt"># Choose: GitHub.com → SSH → paste your key → Login with browser</span>

<span class="cmt">── REPO COMMANDS ─────────────────────────────────</span>
gh repo create gitcoven --public   <span class="cmt"># create on GitHub + add remote</span>
gh repo create --private --source=. --push  <span class="cmt"># create from current dir</span>
gh repo clone USERNAME/REPO        <span class="cmt"># clone (handles SSH auto)</span>
gh repo view --web                 <span class="cmt"># open repo in browser</span>
gh repo list                       <span class="cmt"># list your repos</span>

<span class="cmt">── PR COMMANDS ───────────────────────────────────</span>
gh pr create --title <span class="str">"Fix bug"</span> --body <span class="str">"Details..."</span>
gh pr list                         <span class="cmt"># list open PRs</span>
gh pr checkout 42                  <span class="cmt"># checkout PR #42 locally</span>
gh pr merge 42 --squash            <span class="cmt"># merge a PR</span>
gh pr review 42 --approve          <span class="cmt"># approve a PR</span>

<span class="cmt">── OTHER USEFUL COMMANDS ─────────────────────────</span>
gh issue create                    <span class="cmt"># create a GitHub issue</span>
gh workflow run ci.yml             <span class="cmt"># trigger a GitHub Action</span>
gh release create v1.0.0 --generate-notes  <span class="cmt"># create a release</span>
gh gist create file.txt            <span class="cmt"># create a Gist</span></span>`}},
    {label:"Force pushing safely",codeblock:{lang:"bash",code:`<span class="cmt">── NEVER DO THIS ON SHARED BRANCHES ──────────────</span>
<span class="hl">git push</span> --force                   <span class="cmt"># ⚠️ DANGEROUS — overwrites remote blindly</span>

<span class="cmt">── ALWAYS USE THIS INSTEAD ───────────────────────</span>
<span class="hl">git push</span> --force-with-lease        <span class="cmt"># SAFE force push</span>
<span class="cmt"># --force-with-lease checks that no one else pushed</span>
<span class="cmt"># since you last fetched. If they did, it ABORTS.</span>
<span class="cmt"># This protects teammates from having their work wiped.</span>

<span class="cmt"># When is force pushing legitimate?</span>
<span class="cmt"># ✓ After interactive rebase on YOUR OWN feature branch</span>
<span class="cmt"># ✓ After amending a commit on YOUR OWN branch</span>
<span class="cmt"># ✓ Fixing a mistaken commit before anyone pulled it</span>
<span class="cmt"># ✗ NEVER on main, develop, or any shared branch</span>

<span class="cmt"># Set an alias so you never accidentally use --force</span>
<span class="hl">git config</span> --global alias.pushf <span class="str">"push --force-with-lease"</span></span>`}},
    {label:"Deploy keys — read-only SSH for CI servers",codeblock:{lang:"bash",code:`<span class="cmt"># A deploy key is an SSH key tied to ONE repo (not your account)</span>
<span class="cmt"># CI servers get read-only access without your full account key</span>

<span class="cmt"># 1. Generate a dedicated key for the deployment server</span>
ssh-keygen -t ed25519 -C <span class="str">"deploy-key-prod"</span> -f ~/.ssh/deploy_key

<span class="cmt"># 2. Add the PUBLIC key to GitHub:</span>
<span class="cmt">#    Repo → Settings → Deploy keys → Add deploy key</span>
<span class="cmt">#    Paste contents of ~/.ssh/deploy_key.pub</span>
<span class="cmt">#    Tick "Allow write access" only if CI needs to push</span>

<span class="cmt"># 3. Configure SSH to use deploy key for this repo</span>
cat >> ~/.ssh/config << <span class="str">'EOF'</span>
Host github-deploy
  HostName github.com
  User git
  IdentityFile ~/.ssh/deploy_key
EOF

<span class="cmt"># 4. Use the deploy host alias for this repo</span>
<span class="hl">git remote set-url</span> origin git@github-deploy:USERNAME/REPO.git</span>`}},
    {label:"Useful remote diagnostic commands",codeblock:{lang:"bash",code:`<span class="cmt"># See all remotes and their URLs</span>
<span class="hl">git remote</span> -v

<span class="cmt"># See detailed info about a remote</span>
<span class="hl">git remote show</span> origin
<span class="cmt"># Shows: fetch/push URLs, tracked branches, local branches</span>
<span class="cmt"># configured for pull, and whether you are up to date</span>

<span class="cmt"># List all remote branches</span>
<span class="hl">git branch</span> -r

<span class="cmt"># Delete a remote branch</span>
<span class="hl">git push</span> origin --delete old-feature

<span class="cmt"># Prune stale remote-tracking branches</span>
<span class="hl">git fetch</span> --prune
<span class="cmt"># Removes local refs to remote branches that no longer exist</span>
<span class="hl">git config</span> --global fetch.prune true  <span class="cmt"># do this automatically every fetch</span>

<span class="cmt"># Rename a remote</span>
<span class="hl">git remote rename</span> origin github

<span class="cmt"># Remove a remote entirely</span>
<span class="hl">git remote remove</span> gitlab</span>`}}
  ],
  challenges:[
    {q:"Type the safe force push command you should ALWAYS use instead of git push --force.",scenario:"You rebased your feature branch and need to force push it to GitHub. What is the safe version of force push?",hint:"There's a safer version of --force that checks for remote changes first: --force-with-lease.",answer:"Answer: git push --force-with-lease — Unlike --force (which blindly overwrites), this checks that the remote hasn\'t been updated since your last fetch. If someone else pushed, it rejects yours to prevent data loss.",accept:["git push --force-with-lease","git push --force-with-lease origin","git pushf","git push --force-with-lease origin main"],feedback:"--force-with-lease is the professional's force push. It checks that the remote branch hasn't been updated since you last fetched — if a teammate pushed in the meantime, the command fails and warns you, protecting their work. Plain --force blindly overwrites whatever is on the remote."},
    {q:"Type the command to delete a remote branch called 'feature-old' on origin.",scenario:"A feature branch was merged and you want to clean it up from the remote.",hint:"Use 'git push origin --delete' followed by the branch name.",answer:"Answer: git push origin --delete feature-old — This removes the branch from the remote server. Your local branch (if any) is not affected. The older syntax is git push origin :feature-old.",accept:["git push origin --delete feature-old","git push origin :feature-old","git push --delete origin feature-old"],feedback:"git push origin --delete branch-name sends a delete instruction to the remote. The older syntax git push origin :branch-name (colon prefix) also works. Note: this only deletes the remote branch — your local branch still exists until you run git branch -d feature-old."},
    {q:"Type the command to remove stale remote-tracking branches that no longer exist on the remote server.",scenario:"Your local git branch -r shows 20 remote branches, but most were deleted on GitHub months ago. Clean them up.",hint:"Use 'git fetch' with the --prune flag to clean up deleted remote branches.",answer:"Answer: git fetch --prune (or git fetch -p) — This removes local remote-tracking branches (like origin/old-branch) that no longer exist on the remote. Keeps your branch list clean.",accept:["git fetch --prune","git fetch -p","git remote prune origin","git fetch --prune origin"],feedback:"git fetch --prune downloads new remote changes AND removes any local remote-tracking refs (like origin/old-branch) for branches that have been deleted on the server. Set it automatically with: git config --global fetch.prune true"},
    {q:"Type the GitHub CLI command to create a new PUBLIC repository called 'my-app' on GitHub from your current directory and push it immediately.",scenario:"You want to publish a local project to GitHub in a single command without touching the browser.",hint:"Use 'gh repo create' with --public, --source=. and --push flags.",answer:"Answer: gh repo create my-app --public --source=. --push — This creates the repo on GitHub, sets it as origin for your current directory, and pushes your code. The --source=. flag tells it to use the current folder.",accept:["gh repo create my-app --public --source=. --push","gh repo create my-app --public --source . --push","gh repo create my-app --public --source=. --push ","gh repo create my-app --public --push --source=.","gh repo create my-app --public --push --source ."],feedback:"This single gh CLI command creates the GitHub repo, adds it as origin, and pushes your local commits — all in one step. It's the fastest way to publish a new project. gh repo create without --source creates an empty repo on GitHub only."}
  ]
}
);