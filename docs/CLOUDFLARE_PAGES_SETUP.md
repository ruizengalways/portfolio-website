# Cloudflare Pages Setup Guide

This guide explains how to set up Cloudflare Pages for your portfolio frontend deployment.

## Prerequisites

- Cloudflare account (you already have one)
- GitHub repository connected to your project

## Step 1: Create a Cloudflare Pages Project

1. Log in to your Cloudflare dashboard: https://dash.cloudflare.com/
2. Click on "Pages" in the left sidebar
3. Click "Create a project"
4. Choose "Connect to Git" (GitHub)
5. Authorize Cloudflare to access your GitHub account
6. Select your repository: `ruizengalways/portfolio-website` (or your repo name)
7. Configure the project:
   - **Project name**: `portfolio-frontend` (this matches the workflow)
   - **Production branch**: `main`
   - **Build settings**:
     - Build command: `npm run build`
     - Build output directory: `dist`
     - Root directory: `frontend`
8. Click "Save and Deploy"

## Step 2: Get Your Pages URL

After deployment, you'll get a URL like:
- `https://portfolio-frontend.pages.dev` (free subdomain)
- Or your custom domain if you have one

## Step 3: Update Backend Environment

Once you have the Pages URL, update your backend's `FRONTEND_URL` environment variable:

1. In Cloudflare Workers dashboard, go to your worker
2. Go to Settings > Variables
3. Add environment variable:
   - Key: `FRONTEND_URL`
   - Value: `https://your-pages-url.pages.dev`

This will restrict CORS to only allow requests from your frontend.

## Step 4: Redeploy Backend

After updating the environment variable, redeploy the backend:

```bash
cd backend
npm run deploy
```

## Custom Domain (Optional)

If you want a custom domain:

1. Go to Pages project settings
2. Click "Custom domains"
3. Add your domain
4. Update DNS records as instructed
5. Update the `FRONTEND_URL` in backend with your custom domain

## Troubleshooting

- **Build fails**: Check that `frontend/package.json` has the correct build script
- **Wrong directory**: Ensure root directory is set to `frontend`
- **CORS issues**: Make sure `FRONTEND_URL` is set correctly in backend
- **Environment variables**: Use the Workers dashboard to set them, not wrangler.toml for production

## Free vs Paid

- **Free**: `.pages.dev` subdomain, 500 builds/month
- **Paid**: Custom domain, unlimited builds, analytics

For a portfolio, the free tier is usually sufficient.