
# Deployment Instructions

This document provides instructions for deploying this React application to different environments.

## Table of Contents
- [GitHub Pages](#github-pages)
- [Shared Hosting](#shared-hosting)
- [Manual Deployment](#manual-deployment)
- [Environment Configuration](#environment-configuration)

## GitHub Pages

For GitHub Pages deployment:

1. In your GitHub repository, go to Settings > Pages
2. Set the source to GitHub Actions
3. A workflow will automatically build and deploy your site

## Shared Hosting

For shared hosting deployment:

### Option 1: Using GitHub Actions + FTP
1. In your GitHub repository, go to Settings > Secrets
2. Add the following secrets:
   - `FTP_SERVER`: Your FTP server address
   - `FTP_USERNAME`: Your FTP username
   - `FTP_PASSWORD`: Your FTP password
   - `FTP_REMOTE_PATH`: Path on the server (use `/` for root)
3. Push to main branch to trigger deployment

### Option 2: Using deploy.php
1. Upload `deploy.php` to your hosting
2. Edit the file with your GitHub repository details
3. Visit the deploy.php URL in your browser
4. Follow the instructions to deploy

## Manual Deployment

For manual deployment:

1. Build the application locally:
   ```
   npm run build
   ```
2. Upload the contents of the `dist` directory to your web server
3. Ensure your server is configured to serve the application correctly (see `.htaccess` file)

## Environment Configuration

This app supports the following environment variables:

- `VITE_BASE_PATH`: Set this if your app is not hosted at the root of the domain (e.g., `/app/`)

Create a `.env` file in the project root to configure these variables:

```
VITE_BASE_PATH=/app/
```

For GitHub deployment, add these as repository secrets.
