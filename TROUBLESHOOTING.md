# Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. Internal Server Error (500)

**Symptoms:**
- "Internal Server Error" message
- Build fails with module errors
- Development server crashes

**Solutions:**

#### A. Fix ESLint Errors
```bash
npm run lint
```
Fix any linting errors before running the server.

#### B. Fix TypeScript Errors
```bash
npm run type-check
```
Resolve any TypeScript compilation errors.

#### C. Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

#### D. Reinstall Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### 2. Build Errors

**Common Build Issues:**

#### A. Invalid Next.js Config
- Remove deprecated options like `swcMinify`
- Check for unsupported experimental features

#### B. Missing Dependencies
- Install missing packages: `npm install <package-name>`
- Check for peer dependency warnings

#### C. TypeScript Errors
- Fix type errors in your code
- Update TypeScript configuration if needed

### 3. Development Server Issues

**Symptoms:**
- Server won't start
- Port already in use
- Module not found errors

**Solutions:**

#### A. Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```

#### B. Different Port
```bash
npm run dev -- -p 3001
```

#### C. Clear Cache and Restart
```bash
rm -rf .next
npm run dev
```

### 4. API Endpoint Issues

**Symptoms:**
- API returns 500 error
- CORS errors
- Network errors

**Solutions:**

#### A. Check API Route
- Verify `/pages/api/jobs.ts` exists
- Check for syntax errors
- Ensure proper export

#### B. Test API Directly
```bash
curl "http://localhost:3000/api/jobs?role=developer&location=bangalore"
```

#### C. Check Environment Variables
- Verify `.env.local` file exists
- Check for required environment variables

### 5. Browser Compatibility Issues

**Symptoms:**
- Styles not loading
- JavaScript errors
- Layout broken

**Solutions:**

#### A. Clear Browser Cache
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear browser cache and cookies

#### B. Check Console Errors
- Open browser developer tools
- Check Console tab for errors
- Check Network tab for failed requests

#### C. Test in Different Browser
- Try Chrome, Firefox, Safari, Edge
- Check if issue is browser-specific

### 6. Performance Issues

**Symptoms:**
- Slow loading
- High memory usage
- Poor Lighthouse scores

**Solutions:**

#### A. Optimize Images
- Use Next.js Image component
- Compress images
- Use appropriate formats (WebP, AVIF)

#### B. Bundle Analysis
```bash
npm run build
# Check bundle size in terminal output
```

#### C. Enable Compression
- Verify `compress: true` in `next.config.js`
- Check server compression settings

## 🔧 Quick Fix Commands

### Reset Everything
```bash
# Stop server
Ctrl+C

# Clear all caches
rm -rf .next node_modules package-lock.json

# Reinstall and restart
npm install
npm run dev
```

### Check All Issues
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build

# Start development
npm run dev
```

### Debug Mode
```bash
# Start with debug logging
DEBUG=* npm run dev

# Check specific Next.js debug info
DEBUG=next:* npm run dev
```

## 📞 Getting Help

If you're still experiencing issues:

1. **Check the logs** - Look at terminal output for error messages
2. **Browser console** - Check for JavaScript errors
3. **Network tab** - Look for failed requests
4. **Search issues** - Check if it's a known problem
5. **Create issue** - Provide error details and steps to reproduce

## 🎯 Common Error Messages

| Error | Solution |
|-------|----------|
| `Module not found` | Run `npm install` |
| `Port already in use` | Kill process or use different port |
| `TypeScript errors` | Fix type issues or run `npm run type-check` |
| `ESLint errors` | Fix linting issues or run `npm run lint` |
| `Build failed` | Check for syntax errors and missing dependencies |
| `API 500 error` | Check API route and environment variables |

---

**Remember:** Most issues can be resolved by clearing the cache and reinstalling dependencies!
