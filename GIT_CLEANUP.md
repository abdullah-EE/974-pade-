# GitHub Desktop churn fix (Windows)

If Desktop shows thousands of changed files from `.expo` / `node_modules` and errors like `Filename too long`, run:

```bash
bash scripts/fix-git-desktop-churn.sh
```

## If pull is blocked by local `package.json`

```bash
git stash push -m "local-wip"
git pull
git stash pop
```

## Nuclear reset (only if you want to discard local changes)

```bash
git reset --hard HEAD
git clean -fd
```

`.gitignore` and `.gitattributes` are already configured in this repo to prevent recurrence.
