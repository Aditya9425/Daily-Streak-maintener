# Deploy to Vercel

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/daily-streak-tracker)

## Manual Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - Click "Deploy"

## Environment Variables

In Vercel dashboard, add these environment variables:

```
VITE_SUPABASE_URL=https://dkgsrtyobaslgenntuol.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZ3NydHlvYmFzbGdlbm50dW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NTk1MTcsImV4cCI6MjA4MzAzNTUxN30.wOn0t5nNHlaIpN2qbyiysLcL7wSg22suvk_yK636SsA
```

## Build Settings

Vercel will automatically detect:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Domain Setup

After deployment:
1. Your app will be available at `https://your-project.vercel.app`
2. Add custom domain in Vercel dashboard if needed
3. Update Supabase Site URL in Authentication settings