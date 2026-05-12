# Git cleanup for Desktop pull errors

If GitHub Desktop shows thousands of changed files from `.expo` or `node_modules`, run:

```bash
git rm -r --cached --ignore-unmatch .expo node_modules
git restore --staged .
git status
```

If pull is blocked by local `package.json` edits:

```bash
git stash push -m "local-wip"
git pull
git stash pop
```

This repo ignores `.expo` and `node_modules` via `.gitignore`.
