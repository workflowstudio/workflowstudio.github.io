# GitHub Pages Setup Guide

This guide will help you set up GitHub Pages for the WorkflowStudio documentation site.

## Prerequisites

- A GitHub repository named `workflowstudio.github.io` (already created)
- GitHub Actions enabled for the repository

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your repository: `https://github.com/workflowstudio/workflowstudio.github.io`
2. Click on **Settings** (in the repository navigation)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select:
   - **Source**: `GitHub Actions`
5. Click **Save**

### 2. Verify Workflow

The GitHub Actions workflow (`.github/workflows/deploy.yml`) is already configured to:
- Build the VitePress site
- Deploy to GitHub Pages automatically

### 3. Check Deployment Status

1. Go to the **Actions** tab in your repository
2. You should see the "Deploy VitePress site to Pages" workflow
3. Click on it to see the deployment status
4. Once it completes successfully, your site will be live at:
   **https://workflowstudio.github.io**

### 4. Custom Domain (Optional)

If you want to use a custom domain:

1. In **Settings** → **Pages**
2. Under **Custom domain**, enter your domain (e.g., `docs.workflowstudio.com`)
3. Follow GitHub's instructions to configure DNS

## Troubleshooting

### Workflow Not Running

- Make sure GitHub Actions is enabled in repository settings
- Check that the workflow file is in `.github/workflows/`
- Verify the branch name matches (should be `master`)

### Build Failures

- Check the Actions tab for error messages
- Ensure `package-lock.json` is committed
- Verify Node.js version compatibility

### Site Not Accessible

- Wait a few minutes after deployment completes
- Check the Pages settings to ensure it's using GitHub Actions
- Clear browser cache and try again

## Manual Deployment

If you need to deploy manually:

```bash
cd workflowstudio.github.io
npm install
npm run docs:build
# Then upload .vitepress/dist to GitHub Pages
```

## Support

For issues, check:
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [VitePress Deployment Guide](https://vitepress.dev/guide/deploy)

