
# Frequency Therapy App

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment Options

### Option 1: GitHub Pages

1. Go to your repository settings
2. Navigate to Pages
3. Select the branch to deploy (main/master)
4. Set the directory to `/dist`
5. Save the settings

### Option 2: Shared Hosting

#### Manual Deployment
1. Build the project: `npm run build`
2. Upload the contents of the `dist` folder to your web server's public directory
3. Ensure the `.htaccess` file is correctly uploaded (found in the `public` folder)

#### Automated Deployment via GitHub
1. Fork or clone this repository to your GitHub account
2. Set up GitHub Actions by pushing to the main branch
3. Download the generated artifact from the Actions tab
4. Upload the contents to your shared hosting

### Option 3: Deploy Script
If your shared hosting supports PHP, you can use the included `deploy.php` script:

1. Upload the `deploy.php` file to your server
2. Set up the environment variables on your server:
   - `DEPLOY_SECRET`: A secret key to secure your deployments
   - `REPO_URL`: The URL to your GitHub repository
3. Trigger deployments by making a POST request to the script with the header:
   - `X-Deploy-Secret`: Your defined secret key

## Important Notes for Shared Hosting

- Ensure mod_rewrite is enabled on your server for SPA routing
- The `.htaccess` file is crucial for proper routing - make sure it's uploaded
- For audio functionality to work properly, HTTPS is required on most browsers
