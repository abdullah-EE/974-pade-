#!/usr/bin/env bash
set -euo pipefail

echo "[1/5] Unstage everything"
git restore --staged . || true

echo "[2/5] Drop accidental tracked cache entries"
git rm -r --cached --ignore-unmatch node_modules .expo .expo-shared || true

echo "[3/5] Remove local generated dirs"
rm -rf node_modules .expo .expo-shared || true

echo "[4/5] Normalize line endings against .gitattributes"
git add --renormalize .

echo "[5/5] Final status"
git status --short

echo "Done. Now run: npm install"
