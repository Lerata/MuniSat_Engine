
# Deployment Guide - GitHub & Netlify

This guide will help you upload the project to GitHub and deploy it using Netlify.

## Part 1: Upload to GitHub

### Step 1: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., "environmental-monitoring-app")
5. Set it to Public or Private as needed
6. Do NOT initialize with README (we have our own files)
7. Click "Create repository"

### Step 2: Upload Files to GitHub

**Option A: Using Git (Recommended)**
1. Install Git on your computer if not already installed
2. Open terminal/command prompt in the `GeoSphereView` folder
3. Run these commands (replace with your repository URL):

```bash
git init
git add .
git commit -m "Initial commit - Environmental Monitoring App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```

**Option B: Using GitHub Web Interface**
1. On your GitHub repository page, click "uploading an existing file"
2. Drag and drop all files from the `GeoSphereView` folder
3. Write a commit message like "Initial upload"
4. Click "Commit changes"

## Part 2: Deploy to Netlify

### Step 3: Connect GitHub to Netlify
1. Go to [Netlify.com](https://netlify.com) and sign up/sign in
2. Click "New site from Git"
3. Choose "GitHub" as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select your repository from the list

### Step 4: Configure Build Settings
1. **Branch to deploy**: main
2. **Build command**: `python setup_local_complete.py`
3. **Publish directory**: `.` (current directory)
4. Click "Deploy site"

### Step 5: Environment Variables (Important!)
1. In your Netlify dashboard, go to Site settings > Environment variables
2. Add these variables:

```
SECRET_KEY = your-secret-production-key-here
FLASK_ENV = production
FLASK_DEBUG = False
DATABASE_URL = sqlite:///instance/munisat.db
```

### Step 6: Custom Domain (Optional)
1. In Site settings > Domain management
2. Add your custom domain if you have one
3. Netlify will provide HTTPS automatically

## Part 3: Post-Deployment

### Verify Deployment
1. Your site will be available at a URL like: `https://magical-unicorn-123456.netlify.app`
2. Test the login with: demo@munisat.com / demo123
3. Upload a test image to verify functionality

### Updating Your Site
1. Make changes to your local files
2. Push to GitHub:
```bash
git add .
git commit -m "Description of changes"
git push
```
3. Netlify will automatically rebuild and redeploy

## Important Notes for Netlify

1. **Database**: Netlify uses a SQLite database that resets on each deployment. For production, consider using a persistent database service.

2. **File Uploads**: Uploaded files are temporary on Netlify. Consider using cloud storage (AWS S3, Cloudinary) for permanent file storage.

3. **Build Time**: Initial build may take 5-10 minutes to install dependencies.

4. **Functions**: For more advanced features, you might need Netlify Functions.

## Troubleshooting

### Build Fails
- Check the build logs in Netlify dashboard
- Ensure all files are uploaded to GitHub
- Verify Python version compatibility

### Site Doesn't Load
- Check environment variables are set correctly
- Review deploy logs for errors
- Ensure database initialization completed

### Performance Issues
- Consider upgrading to Netlify Pro for better performance
- Optimize image sizes in uploads
- Use CDN for static assets

## Alternative: Deploy on Replit

If you prefer to keep everything on Replit:
1. Your app is already running on Replit
2. Click the "Deploy" button in Replit
3. Choose "Autoscale" deployment
4. Follow the deployment wizard
5. Your app will be live with automatic HTTPS

The Replit deployment is often easier and more reliable for Flask applications.
