# GitHub Setup & Deployment Guide

## Repository
- **GitHub**: https://github.com/808MiLkMaN/aloha-platform
- **Owner**: 808_KiLkMaN (Malcolm Lee)
- **Status**: ✅ Live and synced

## ✅ Completed Setup Steps

### 1. Repository Created ✅
- Repository initialized at GitHub
- All 49+ project files committed
- Git history preserved with clean directory structure

### 2. GitHub Actions CI/CD Configured ✅
- **Workflow File**: `.github/workflows/deploy.yml`
- **Features**:
  - Automatic builds on push to master/main
  - Node.js 20 LTS setup with dependency caching
  - TypeScript type checking
  - ESLint linting
  - Automatic Vercel deployment on master branch
  - Environment variable passing for LLM API keys

### 3. Repository Secrets Configured ✅
The following secrets are already configured in GitHub:
- `VERCEL_TOKEN` - For automated Vercel deployments
- `VERCEL_ORG_ID` - Vercel organization identifier
- `GOOGLE_AI_KEY` - Google Gemini API key (AIzaSyBZAoKFGLg-LTxn04NFsmrn2r5mDMxfdFQ)
- `NEXT_PUBLIC_API_URL` - Backend API URL (http://localhost:5000)

**Note**: ANTHROPIC_API_KEY and OPENAI_API_KEY secrets still need to be added.

---

## 🔄 CI/CD Workflow Details

### Automatic Deployment on Push
```bash
# When you push to master branch:
git push origin master

# GitHub Actions will automatically:
1. Install dependencies (npm ci)
2. Build the project (npm run build)
3. Run type checks (npx tsc --noEmit)
4. Run linting (npm run lint)
5. Deploy to Vercel (vercel --prod --token $VERCEL_TOKEN)
```

### Viewing Deployment Status
1. Go to: https://github.com/808MiLkMaN/aloha-platform
2. Click **Actions** tab
3. View build logs and deployment progress

---

## 📥 Cloning & Local Development

### Clone from GitHub
```bash
# HTTPS (recommended for most users)
git clone https://github.com/808MiLkMaN/aloha-platform.git
cd aloha-platform

# SSH (if you have SSH keys configured)
git clone git@github.com:808MiLkMaN/aloha-platform.git
cd aloha-platform
```

### Setup Local Development Environment
```bash
# Install dependencies
npm install

# Create backend .env file
cd backend
cp .env.example .env  # or copy from template
# Edit .env with your API keys:
#   NODE_ENV=development
#   PORT=5000
#   FRONTEND_URL=http://localhost:3001
#   GOOGLE_AI_KEY=your_key_here
#   ANTHROPIC_API_KEY=your_key_here
#   OPENAI_API_KEY=your_key_here

# Install backend dependencies
npm install

cd ..
```

### Run Development Servers
```bash
# Terminal 1: Frontend (Next.js)
npm run dev
# Access at: http://localhost:3001

# Terminal 2: Backend (Express)
cd backend && npm start
# Access at: http://localhost:5000
# Health check: http://localhost:5000/health
```

---

## 📋 Available Scripts

### Frontend
```bash
npm run dev        # Start dev server (port 3001)
npm run build      # Build for production
npm run start      # Start production server
npm test           # Run tests
npm run lint       # Run ESLint
npm run lint:fix   # Fix linting issues
```

### Backend
```bash
cd backend
npm start          # Start Express server (port 5000)
npm run dev        # Start with nodemon (auto-reload)
npm test           # Run tests (if configured)
```

---

## 🌐 Vercel Deployment

### Manual Deployment
```bash
# Ensure you're authenticated with Vercel
vercel whoami

# Deploy to production
vercel --prod
```

### Automatic Deployment
Push to master branch and GitHub Actions will automatically deploy:
```bash
git add .
git commit -m "Your commit message"
git push origin master
```

Monitor deployment at:
- GitHub Actions: https://github.com/808MiLkMaN/aloha-platform/actions
- Vercel Dashboard: https://vercel.com/dashboard

---

## 🔐 Setting Additional Secrets

If needed, add more secrets to the repository:

```bash
# From local machine (requires GitHub CLI)
gh secret set ANTHROPIC_API_KEY --body "your-key-here"
gh secret set OPENAI_API_KEY --body "your-key-here"

# Or via GitHub Web Interface:
# 1. Go to: https://github.com/808MiLkMaN/aloha-platform
# 2. Settings → Secrets and variables → Actions
# 3. Click "New repository secret"
# 4. Add name and value
# 5. Click "Add secret"
```

---

## 🐛 Troubleshooting

### Workflow Not Triggering
- **Check**: Push is to `master` or `main` branch
- **Check**: Workflow file exists at `.github/workflows/deploy.yml`
- **Check**: Verify no branch protection rules blocking workflow

### Deployment Failed
1. Check GitHub Actions logs: https://github.com/808MiLkMaN/aloha-platform/actions
2. Review error message in "Deploy to Vercel" step
3. Verify all secrets are correctly configured
4. Ensure VERCEL_TOKEN is still valid

### Local Build Issues
```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

## 📊 Project Statistics

- **Repository**: 808MiLkMaN/aloha-platform
- **Commits**: Started with 2 commits (git fix + workflow setup)
- **Language**: TypeScript, React, Next.js
- **Backend**: Node.js/Express
- **Deployment**: Vercel

---

## 🚀 Next Steps

1. **Clone the repository** locally or in cloud IDE
2. **Configure API keys** in `.env` file
3. **Run development servers** to test changes
4. **Push to master** to trigger automatic deployment
5. **Monitor GitHub Actions** for deployment status

---

## 📞 Support & Contacts

- **Repository Issues**: https://github.com/808MiLkMaN/aloha-platform/issues
- **Creator**: Malcolm Lee (808_KiNg_MiLkMaN)
- **Email**: malcolmlee3@gmail.com
- **Live Platform**: https://alohanovauniverse.ai

---

**Last Updated**: 2025-11-28 | **Status**: ✅ Fully Configured
