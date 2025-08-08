# Vercel Deployment Guide

This guide will help you deploy your AI-powered job search application to Vercel with xAI integration.

## 🚀 Quick Deploy

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add xAI integration for dynamic popular jobs and locations"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

## 🔧 Environment Variables Setup

After deploying, you need to configure environment variables in Vercel:

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add the following variables:**

### Required for xAI Integration
```
XAI_API_KEY=your_xai_api_key_here
```

### Optional for Adzuna Job Listings
```
ADZUNA_APP_ID=your_adzuna_app_id_here
ADZUNA_APP_KEY=your_adzuna_app_key_here
```

## 🔑 Getting xAI API Key

1. **Visit [x.ai](https://x.ai)**
2. **Sign up or log in to your account**
3. **Navigate to API settings**
4. **Generate a new API key**
5. **Copy the key and add it to Vercel environment variables**

## 🌍 Environment Variable Scope

Make sure to set the environment variables for:
- ✅ **Production** (for live site)
- ✅ **Preview** (for pull request previews)
- ✅ **Development** (if you want to test locally)

## 🔄 Redeploy After Changes

After adding environment variables:
1. **Go to Deployments tab in Vercel**
2. **Click "Redeploy" on your latest deployment**
3. **Or push a new commit to trigger automatic deployment**

## 🧪 Testing the Integration

1. **Visit your deployed site**
2. **Check the browser console for any errors**
3. **Verify that popular jobs and locations are loading**
4. **If using fallback data, check that your xAI API key is correctly set**

## 🐛 Troubleshooting

### If popular jobs/locations are not loading:
1. **Check Vercel environment variables are set correctly**
2. **Verify xAI API key is valid**
3. **Check Vercel function logs for errors**
4. **Ensure the API endpoint `/api/popular-data` is accessible**

### If you see fallback data:
- This means xAI is not configured or there's an API error
- Check your xAI API key and network connectivity
- The app will gracefully fall back to curated static data

## 📊 Monitoring

- **Vercel Analytics**: Monitor your app's performance
- **Function Logs**: Check API endpoint performance
- **xAI Usage**: Monitor your xAI API usage in their dashboard

## 🔒 Security Notes

- **Never commit API keys to your repository**
- **Use environment variables for all sensitive data**
- **Regularly rotate your API keys**
- **Monitor API usage to avoid unexpected costs**

---

Your AI-powered job search app is now ready to provide dynamic, up-to-date job suggestions powered by xAI! 🎉
