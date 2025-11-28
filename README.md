# 🌺 Aloha Nova Universe - Ultimate AI Platform

Complete production-ready platform with **10+ LLM models**, **3D avatars**, **domain management**, **automated deployment**, and **Stripe billing**.

**👨‍💻 Created by**: 808_KiNg_MiLkMaN (Malcolm Lee) | Email: [malcolmlee3@gmail.com](mailto:malcolmlee3@gmail.com) | GitHub: [@808MiLkMaN](https://github.com/808MiLkMaN)

**🌐 Live Platform**: [alohanovauniverse.ai](https://alohanovauniverse.ai)

## ✨ Features

### 🤖 AI & LLMs
- **Claude 3.5 Sonnet** (Anthropic) - Advanced reasoning
- **GPT-4o Mini** (OpenAI) - Fast & efficient
- **Gemini 2.0 Flash** (Google) - Multimodal AI
- Easy integration for additional models

### 👥 3D Avatars
- Photorealistic human avatars
- Cosmic characters (King, Queen, Nexus Bot)
- Full customization
- Real-time lip sync

### 🌐 Deployment
- Vercel integration
- Custom domain management
- Automated SSL/TLS

### 💳 Billing
- 4 subscription tiers
- Stripe integration
- Usage analytics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- npm 9+

### Installation

```bash
# Windows PowerShell
.\build.ps1 dev

# macOS/Linux
./build.sh dev
```

Access at: http://localhost:3000

## 📁 Project Structure

```
aloha-nova/
├── backend/                 # Express API server
├── src/app/                 # Next.js frontend
├── .github/workflows/       # CI/CD pipelines
├── build.ps1               # Windows build script
├── build.sh                # macOS/Linux build script
└── DEPLOYMENT.md           # Deployment guide
```

## 🛠️ Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production
npm run start

# Run tests
npm test

# Lint code
npm run lint
```

## 📊 API Health Check

```bash
curl http://localhost:5000/health
```

## 🔐 Configuration

Create `backend/.env`:

```env
NODE_ENV=development
PORT=5000
ANTHROPIC_API_KEY=sk-ant-xxx
OPENAI_API_KEY=sk-xxx
GOOGLE_AI_KEY=AIzaSy-xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete setup.

## 🚀 Deployment

### Quick Deploy to Vercel
```bash
# Vercel (CLI)
vercel --prod

# GitHub Actions (Automatic)
# Push to master branch - GitHub Actions will automatically build and deploy
git push origin master
```

### Docker
```bash
docker-compose up -d
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🔄 GitHub Actions & CI/CD

This repository includes automated CI/CD workflow that:
- ✅ Runs on every push to `master` or `main` branch
- ✅ Installs dependencies and builds the project
- ✅ Runs TypeScript type checking and ESLint
- ✅ Automatically deploys to Vercel on master branch
- ✅ Includes environment variables for LLM API keys

### Configured Secrets (GitHub Repository Settings)
- `VERCEL_TOKEN` - Vercel API token for deployments
- `VERCEL_ORG_ID` - Vercel organization ID
- `GOOGLE_AI_KEY` - Google Gemini API key
- `NEXT_PUBLIC_API_URL` - Backend API base URL

### Workflow File
See [.github/workflows/deploy.yml](./.github/workflows/deploy.yml) for complete workflow configuration.

### Viewing Workflow Runs
1. Go to GitHub repository: https://github.com/808MiLkMaN/aloha-platform
2. Click "Actions" tab
3. View build logs and deployment status

## 📞 Support

- **Issues**: GitHub Issues
- **Email**: admin@alohanova.ai
- **Docs**: See DEPLOYMENT.md

## 📄 License

MIT License

---

**Version**: 2.2.1 | **Built with** ❤️ **for Aloha Nova**
