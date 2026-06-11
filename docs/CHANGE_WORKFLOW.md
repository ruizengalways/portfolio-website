# Change Workflow

This document describes the workflow to use when you want to make a small change to site content, frontend behavior, backend behavior, or deployment configuration.

## What Triggers Automation

The repository has separate workflows for CI, preview deployment, and production deployment.

- Pull requests trigger CI for changed frontend or backend paths.
- Pull requests also trigger preview deployment for changed frontend or backend paths.
- Pushes to `main` trigger production deployment for changed frontend or backend paths.
- Path filters matter. Changes only under `docs/`, root markdown files, or other non-matching paths do not trigger preview or production deployment.

In practice:

1. Create a feature branch from `main`.
2. Make your change.
3. Push the branch.
4. Open a pull request.
5. Let the PR run CI and preview deployment.
6. Merge the PR to `main`.
7. Let the merge trigger production deployment.

## Recommended Flow For A Content Change

Use this flow when updating copy, profile text, project descriptions, metadata, public content files, or frontend assets.

### 1. Start From Main

```bash
cd /workspaces/portfolio-website
git fetch origin
git switch main
git pull --ff-only origin main
```

### 2. Create A Feature Branch

Choose a short branch name that describes the change.

```bash
git switch -c feat/update-homepage-copy
```

### 3. Make The Change In The Right Surface

Common places for content changes:

- Frontend UI copy: `frontend/src/components/**`, `frontend/src/pages/**`, `frontend/src/constants/**`
- Public crawler-facing content: `frontend/public/**`
- Backend response text or API behavior: `backend/src/**`
- Documentation only: `docs/**`, `README.MD`, `FRONTEND_README.md`, `BACKEND_README.md`

## Local Validation Before Push

Run only the checks for the surface you changed.

### Frontend Change

```bash
cd /workspaces/portfolio-website/frontend
npm install
npm run lint
npm run test:ci
npm run build
```

If your frontend change updates rendered markup that is covered by Vitest snapshots, regenerating snapshots locally is required before you push. GitHub Actions runs `npm run test:ci`, which checks snapshots but does not update them. If you forget to refresh an intentional snapshot change, CI will fail on GitHub.

Use this workflow for snapshot-backed UI changes:

```bash
cd /workspaces/portfolio-website/frontend
npm run test:ci -- src/components/Projects.test.tsx
```

If the failure is an intentional snapshot change, refresh it locally and rerun the same test:

```bash
cd /workspaces/portfolio-website/frontend
npm run test:ci -- -u src/components/Projects.test.tsx
npm run test:ci -- src/components/Projects.test.tsx
```

Commit the updated snapshot file together with the component change. Snapshot regeneration is not optional for intentional UI snapshot changes.

If you want to inspect the built site locally:

```bash
npm run preview
```

### Backend Change

```bash
cd /workspaces/portfolio-website/backend
npm install
npm run test
npm run typecheck
```

If you changed `wrangler.jsonc`, regenerate types before committing:

```bash
npm run cf-typegen
```

### Docs-Only Change

There is no repo-level docs CI workflow in this project. A docs-only change is usually just a markdown review plus optional local spot checks.

## Push And Open A Pull Request

Push the branch:

```bash
cd /workspaces/portfolio-website
git push -u origin feat/update-homepage-copy
```

Then open a pull request into `main`.

If GitHub CLI is authenticated on your machine, you can use:

```bash
gh pr create --base main --head feat/update-homepage-copy --fill
```

## What Happens After You Open The PR

### If You Changed Frontend Files

- CI runs frontend checks.
- Preview deploy builds the frontend with `npm run build:preview`.
- Cloudflare Pages deploys the preview build to the `preview` branch target.

### If You Changed Backend Files

- CI runs backend checks.
- Preview deploy runs `wrangler deploy --env preview`.
- Smoke tests run against the preview backend.

### If You Changed Both

- Both sides run independently.
- Each surface has its own CI and preview deployment.

### If You Changed Docs Only

- The PR may not trigger the frontend/backend CI or preview deploy workflows, because the workflow path filters only watch `frontend/**`, `backend/**`, and workflow files.
- That is expected behavior.

## What Happens After Merge

After the PR is merged into `main`:

- Frontend changes trigger production frontend deploy.
- Backend changes trigger production backend deploy.
- Docs-only changes do not trigger production deploy.

Production deployment is not driven by the PR itself. It is driven by the resulting push to `main`.

## Manual Fallback Commands

If you need to run deployment manually instead of waiting for GitHub Actions:

### Frontend

```bash
cd /workspaces/portfolio-website/frontend
npm run deploy:preview
npm run deploy:prod
```

### Backend

```bash
cd /workspaces/portfolio-website/backend
npm run deploy:preview
npm run deploy:prod
```

## Quick Decision Guide

- Changing site copy or portfolio content in frontend files: create branch, open PR, preview runs, merge to `main`, production runs.
- Changing backend behavior: create branch, open PR, backend preview runs, merge to `main`, backend production runs.
- Changing docs only: create branch and PR for review, but do not expect preview or production deployment.
- Changing workflow files under `.github/workflows/`: CI and relevant deployment workflows can trigger because workflow files are included in path filters.
