# Deploying Williams to Render

This guide will help you deploy your Williams Wildfire Safety Assistant to Render for free.

## Prerequisites

1. GitHub account with your code pushed to a repository
2. [Render account](https://render.com) (free tier available)
3. Google Gemini API key
4. NASA FIRMS MAP_KEY

## Step-by-Step Deployment

### 1. Push Your Code to GitHub

Make sure all your latest changes are committed and pushed:

```bash
cd project
git add -A
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository (authorize Render if first time)
4. Select your `Spring-2025-BroncoHacks_-LoopBreaker` repository

### 3. Configure the Web Service

Fill in the following settings:

**Basic Settings:**
- **Name**: `williams-wildfire-assistant` (or your choice)
- **Region**: Choose closest to your location (e.g., Oregon for US West)
- **Branch**: `main`
- **Root Directory**: `project`
- **Runtime**: `Python 3`

**Build Settings:**
- **Build Command**:
  ```bash
  chmod +x build.sh && ./build.sh
  ```
- **Start Command**:
  ```bash
  gunicorn website.wsgi:application
  ```

**Instance Type:**
- Select **"Free"** (sufficient for demo/portfolio use)

### 4. Add Environment Variables

Click **"Advanced"** and add these environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `PYTHON_VERSION` | `3.11.0` | Python version |
| `GEMINI_API_KEY` | Your Gemini API key | From Google AI Studio |
| `MAP_KEY` | Your NASA FIRMS key | From NASA FIRMS |
| `DJANGO_SECRET_KEY` | Auto-generated | Click "Generate" button |
| `DEBUG` | `False` | Production mode |

### 5. Deploy!

1. Click **"Create Web Service"**
2. Render will start building your app (takes 5-10 minutes first time)
3. Watch the deployment logs for any errors
4. Once deployed, you'll get a URL like: `https://williams-wildfire-assistant.onrender.com`

## Post-Deployment

### Test Your Deployment

1. Visit your Render URL
2. Allow browser geolocation when prompted
3. Test the chat: Ask "What should I do if there's a wildfire nearby?"
4. Check if the map loads with current fire data

### Common Issues

#### Build Fails
- Check logs in Render dashboard
- Verify `build.sh` has executable permissions
- Ensure all dependencies are in `requirements.txt`

#### Map Not Loading
- Check browser console for errors
- Verify `MAP_KEY` environment variable is set
- NASA FIRMS API may have rate limits (1-hour cache helps)

#### AI Not Responding
- Verify `GEMINI_API_KEY` is correctly set
- Check Gemini API quota/limits in Google AI Studio

#### Static Files Not Serving
- Verify whitenoise is installed
- Check `STATICFILES_DIRS` in settings.py
- Ensure React build exists in `frontend/dist/`

### Free Tier Limitations

Render's free tier:
- ✅ Perfect for portfolio/demo projects
- ✅ Custom domain support
- ⚠️ Spins down after 15 minutes of inactivity (cold start takes ~30 seconds)
- ⚠️ 750 hours/month free (enough for one app running 24/7)

### Updating Your Deployment

Render auto-deploys when you push to GitHub:

```bash
# Make changes locally
git add -A
git commit -m "Update feature"
git push origin main

# Render automatically rebuilds and deploys
```

## Alternative: Manual Deployment (No render.yaml)

If you don't want to use `render.yaml`, you can configure everything manually:

1. In Render dashboard, click "New +" → "Web Service"
2. Connect repository manually
3. Set all the build/start commands and environment variables through the UI

## Production Checklist

Before going live:
- [ ] Set `DEBUG=False` in Render environment variables
- [ ] Verify both API keys are set correctly
- [ ] Test all features (chat, map, geolocation)
- [ ] Check error handling (try asking off-topic questions)
- [ ] Monitor Render logs for any errors
- [ ] Update README.md with live demo URL

## Monitoring

- **Logs**: View in Render dashboard under "Logs" tab
- **Metrics**: View usage/performance under "Metrics" tab
- **Downtime**: Free tier may experience cold starts (30s delay after inactivity)

## Cost Optimization

- Free tier is sufficient for portfolio projects
- If you need 24/7 uptime without cold starts, consider:
  - Render's $7/month starter tier
  - Alternative platforms: Railway, Fly.io (also have free tiers)

## Support

If you encounter issues:
1. Check Render's [documentation](https://render.com/docs)
2. Review deployment logs in Render dashboard
3. Check Django error logs
4. Verify all environment variables are set

---

**Your app will be live at**: `https://your-app-name.onrender.com`

Good luck with your deployment! 🚀
