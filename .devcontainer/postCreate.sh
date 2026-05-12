#!/usr/bin/env bash
set -e

command -v pnpm >/dev/null 2>&1 || npm install -g pnpm
command -v wrangler >/dev/null 2>&1 || npm install -g wrangler

echo "Installing Playwright system dependencies..."
npx playwright install-deps
npx playwright install chromium

if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend deps..."
  cd frontend && pnpm install
  cd ..
fi

if [ ! -d "backend/node_modules" ]; then
  echo "Installing backend deps..."
  cd backend && pnpm install
fi

echo "Dev container ready 🚀"