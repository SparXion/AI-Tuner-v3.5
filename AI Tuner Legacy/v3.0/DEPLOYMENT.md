# Deployment Guide - AI Tuner v2.0 & v3.0

## Current Status

- **v2.0**: Live on `index.html` (stable version)
- **v3.0**: Available on `index-v6.html` (beta version)
- **Branch**: `v6.0-upgrade` (pushed to GitHub)
- **Existing Netlify Site**: v2.0 is already live

## Deployment Options

### Option 1: Update Existing Netlify Site (Recommended)

Since you already have v2.0 live on Netlify:

#### To Deploy Both Versions Together:

1. **Go to your Netlify Dashboard**
2. **Find your existing AI Tuner site**
3. **Update Site Settings**:
   - Go to **Site settings** → **Build & deploy**
   - **Branch to deploy**: Change to `v6.0-upgrade` (or merge to `main` first)
   - **Publish directory**: `.` (root directory)
   - **Build command**: (leave empty - no build step)
4. **Trigger Deploy**:
   - Click "Trigger deploy" → "Deploy site"
   - Or push to the branch you're tracking (Netlify will auto-deploy)

#### Result:
- Your existing Netlify site will now serve both versions
- `index.html` → v2.0 (default)
- `index-v6.html` → v3.0 (beta)
- Users can switch via the toggle buttons in the header

### Option 2: Keep v2.0 on Main, Deploy v3.0 from Branch

If you want to keep v2.0 unchanged on main:

1. **Keep existing Netlify site** pointing to `main` branch (v2.0)
2. **Create new Netlify site** for v3.0:
   - Add new site → Import from GitHub
   - Connect to `SparXion/AI-Tuner`
   - **Branch**: `v6.0-upgrade`
   - This gives you a separate preview URL for v3.0

### Option 3: Merge to Main and Deploy

1. **Merge v6.0-upgrade → main**:
   ```bash
   git checkout main
   git merge v6.0-upgrade
   git push origin main
   ```
2. **Netlify will auto-deploy** from `main` (if configured)
3. Both versions available on your main site

### GitHub Pages (Alternative)

If you're using GitHub Pages, the changes are already available:

1. **For v2.0**: Visit `https://sparxion.github.io/AI-Tuner/`
2. **For v3.0**: Visit `https://sparxion.github.io/AI-Tuner/index-v6.html`

The version toggle buttons allow users to switch between versions.

#### Branch Deployments:

**Option A: Deploy v6.0-upgrade branch directly**
- Netlify will automatically deploy the `v6.0-upgrade` branch
- You can create a preview URL for testing
- Users can access v3.0 via the toggle button

**Option B: Merge to main first**
1. Merge `v6.0-upgrade` → `main` on GitHub
2. Netlify will auto-deploy from `main`
3. Both versions will be live on main branch

#### Custom Domain Setup (Optional):

If you have a custom domain:
- Add domain in Netlify dashboard
- Configure DNS settings as instructed
- Both `index.html` and `index-v6.html` will be accessible

### Option 3: Deploy Both Versions Separately

You can create separate Netlify sites:

1. **Main site** (v2.0): Deploy from `main` branch
2. **Beta site** (v3.0): Deploy from `v6.0-upgrade` branch
   - Use a subdomain like `v3.aitunerapp.com`
   - Or use Netlify's preview URL system

## Recommended Approach

**For testing/feedback**: Keep both versions on same site with toggle buttons (current setup)

**Benefits**:
- ✅ Easy for users to try v3.0
- ✅ Easy rollback if needed
- ✅ Can track usage of both versions
- ✅ No separate deployment needed

## Next Steps

1. ✅ **Code pushed to GitHub** - Done
2. ⏳ **Deploy to Netlify**:
   - If new: Follow "Initial Setup" above
   - If existing: Netlify should auto-deploy from the branch
3. ⏳ **Test live site**: Verify both versions work
4. ⏳ **Monitor feedback**: Track which version users prefer

## Files Included in Deployment

- `index.html` - v2.0 (main version)
- `index-v6.html` - v3.0 (beta version)
- `style.css` - v2.0 styles
- `style-v6.css` - v3.0 styles
- `js/` - v3.0 JavaScript modules
- `radar.js` - Radar chart (both versions)
- All other assets

## Important Notes

- Both versions use the same `style.css` as base (v3.0 adds `style-v6.css`)
- Version toggle buttons allow easy switching
- No build step required - pure static HTML/CSS/JS
- Dark mode and other preferences are stored in localStorage

