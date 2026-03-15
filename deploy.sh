#!/bin/bash
# ─────────────────────────────────────────
#  Jet2Pay — Quick Deploy Script
#  Usage: ./deploy.sh "your commit message"
#  If no message is provided, uses a timestamp.
# ─────────────────────────────────────────

MSG="${1:-"deploy: $(date '+%Y-%m-%d %H:%M')"}"

echo "🚀 Deploying to main..."
echo "📝 Commit message: $MSG"
echo ""

git add .
git commit -m "$MSG"
git push origin main

echo ""
echo "✅ Done! Changes pushed to main."
