# ⚡ Quick Start - Aloha Nova Universe

Get up and running in 5 minutes!

## 1. Prerequisites

```bash
# Check Node.js version (need 18+)
node --version
npm --version
```

If not installed: https://nodejs.org/

## 2. Start Development

### Windows (PowerShell)
```powershell
cd aloha-platform
.\build.ps1 dev
```

### macOS/Linux (Terminal)
```bash
cd aloha-platform
chmod +x build.sh
./build.sh dev
```

**Output**:
```
✅ Backend: http://localhost:5000
✅ Frontend: http://localhost:3000
```

## 3. Configure API Keys

Edit `backend/.env`:

```env
ANTHROPIC_API_KEY=sk-ant-your-key
OPENAI_API_KEY=sk-your-key
GOOGLE_AI_KEY=AIzaSy-your-key
STRIPE_SECRET_KEY=sk_test_your-key
```

Get keys from:
- **Claude**: https://console.anthropic.com
- **GPT-4**: https://platform.openai.com
- **Gemini**: https://aistudio.google.com
- **Stripe**: https://dashboard.stripe.com

## 4. Access Platform

Open browser: **http://localhost:3000**

You'll see:
- 🌺 Aloha Nova Universe home page
- 🤖 10+ LLM integration status
- 👥 Avatar system
- 💳 Billing plans
- 📊 Analytics dashboard

## 5. Test APIs

### Health Check
```bash
curl http://localhost:5000/health
```

### Chat with Claude
```bash
curl -X POST http://localhost:5000/api/llm/chat \
  -H "Content-Type: application/json" \
  -d '{"model":"claude","prompt":"Hello!"}'
```

### List Models
```bash
curl http://localhost:5000/api/llm/models
```

## 6. Run Tests

```bash
npm test
npm run lint
npm run build
```

## 7. Troubleshooting

### Port already in use?

**Windows**:
```powershell
netstat -ano | findstr :5000
# Kill process with: taskkill /PID <PID> /F
```

**macOS/Linux**:
```bash
lsof -i :5000
# Kill process with: kill -9 <PID>
```

### Dependencies not installing?

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Environment variables not loaded?

Check `backend/.env` exists with correct format:
```
KEY=value
# No spaces around =
```

## 8. Next Steps

### Development
- Customize avatar styles in `src/app/page.tsx`
- Add new API endpoints in `backend/server.js`
- Create components in `src/components/`

### Deployment
- Push to GitHub
- Connect to Vercel
- Set environment variables
- Deploy: `vercel --prod`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full details.

### Database (Optional)
- Sign up for MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Add connection string to `.env`
- Implement database models

## 9. Key Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production server
npm run start

# Run tests
npm test
npm run test:watch

# Lint code
npm run lint

# Check dependencies
./build.ps1 check    # Windows
./build.sh check     # macOS/Linux
```

## 10. Important Files

- `backend/server.js` - API endpoints
- `src/app/page.tsx` - Home page
- `package.json` - Dependencies
- `backend/.env.example` - Config template
- `DEPLOYMENT.md` - Production guide
- `BUILD_SUMMARY.md` - Complete build info

---

## 🆘 Need Help?

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Read [BUILD_SUMMARY.md](./BUILD_SUMMARY.md)
3. Review [README.md](./README.md)
4. Check API logs: `npm run dev` output
5. Email: admin@alohanova.ai

---

**You're all set! 🚀 Build amazing things!**
