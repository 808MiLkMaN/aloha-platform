# Aloha Nova Universe - Deployment Guide

## 🚀 Quick Start

### Development

```bash
# Windows PowerShell
.\build.ps1 dev

# macOS/Linux
./build.sh dev
```

### Production Build

```bash
# Windows PowerShell
.\build.ps1 build

# macOS/Linux
./build.sh build
```

## 📋 Prerequisites

- **Node.js 18+** - https://nodejs.org/
- **npm 9+** - Included with Node.js
- **Git** - For version control

## 🔑 Environment Configuration

### 1. Backend Configuration

Copy `.env` template:

```bash
cp backend/.env.example backend/.env
```

Fill in your API keys:

```env
# Backend Server
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com

# LLM APIs
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
GOOGLE_AI_KEY=AIzaSy_xxxxxxxxxxxxxxxx

# Stripe Billing
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-specific-password
```

### 2. Frontend Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### ⚠️ SECURITY: Never Commit .env Files

Add to `.gitignore`:

```
# Environment variables
.env
.env.local
.env.production
.env.*.local
```

Verify they're not tracked:

```bash
git status
```

## 🐳 Docker Deployment

### Build Docker Image

```bash
# Build backend
docker build -f Dockerfile.backend -t aloha-nova-backend:latest backend/

# Build frontend
docker build -f Dockerfile.frontend -t aloha-nova-frontend:latest .
```

### Run with Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
    volumes:
      - ./backend:/app

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000
    depends_on:
      - backend
```

Start services:

```bash
docker-compose up -d
```

## 🌐 Vercel Deployment

### Setup

1. Push code to GitHub
2. Connect repository to Vercel: https://vercel.com/import
3. Configure environment variables in Vercel dashboard

### Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Environment Variables

Set in Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_AI_KEY=AIzaSy_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🔄 API Key Rotation

### Recommended Schedule

- **API Keys**: Every 30-90 days
- **Webhook Secrets**: Every 30 days
- **Database Passwords**: Every 90 days

### Rotation Process

#### 1. Anthropic (Claude)

```bash
# 1. Visit: https://console.anthropic.com/account/keys
# 2. Create new API key
# 3. Test with new key in staging
# 4. Update ANTHROPIC_API_KEY in all environments
# 5. Delete old key after confirmation
```

#### 2. OpenAI (GPT-4)

```bash
# 1. Visit: https://platform.openai.com/api-keys
# 2. Create new API key
# 3. Test with new key in staging
# 4. Update OPENAI_API_KEY in all environments
# 5. Delete old key
```

#### 3. Google (Gemini)

```bash
# 1. Visit: https://aistudio.google.com/apikey
# 2. Create new API key
# 3. Test with new key in staging
# 4. Update GOOGLE_AI_KEY in all environments
# 5. Delete old key
```

#### 4. Stripe

```bash
# 1. Visit: https://dashboard.stripe.com/apikeys
# 2. Create new restricted API key
# 3. Test payments in staging
# 4. Update STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY
# 5. Rotate webhook secret:
#    - Settings → Webhooks → Create new signing secret
#    - Update STRIPE_WEBHOOK_SECRET
#    - Test webhook delivery
# 6. Delete old keys
```

### Automated Rotation with GitHub Actions

1. Set up scheduled workflow (`.github/workflows/rotate-keys.yml`)
2. Configure GitHub Secrets:
   - `ANTHROPIC_API_KEY`
   - `OPENAI_API_KEY`
   - `GOOGLE_AI_KEY`
   - `STRIPE_ADMIN_TOKEN`
3. Workflow runs on schedule and notifies team

## 📊 Monitoring & Health Checks

### Health Endpoint

```bash
# Check backend health
curl http://localhost:5000/health

# Response:
{
  "status": "healthy",
  "version": "2.2.1",
  "services": {
    "llm": {
      "anthropic": true,
      "openai": true,
      "google": true
    },
    "integrations": {
      "stripe": true,
      "email": true
    }
  }
}
```

### Performance Monitoring

1. **Vercel Analytics** - https://vercel.com/analytics
2. **Backend Logs** - Check `npm run dev` output
3. **Error Tracking** - Integration with Sentry (optional)

## 🔐 Security Best Practices

### Environment Variables

✅ **DO:**
- Store all secrets in `.env` (not git)
- Use environment-specific secrets
- Rotate keys regularly
- Use restricted API key permissions
- Enable API key expiration

❌ **DON'T:**
- Commit `.env` to git
- Use same key across environments
- Share keys in Slack/email
- Use overly permissive key permissions
- Keep expired keys active

### HTTPS & TLS

- Vercel provides free SSL/TLS
- Ensure production URL uses `https://`
- Verify certificates are valid

### CORS Configuration

Configured in `backend/server.js`:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

### Rate Limiting

Implement for production (add to backend):

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 📈 Scaling

### Horizontal Scaling

- **Frontend**: Vercel handles auto-scaling
- **Backend**: Deploy multiple instances with load balancer
- **Database**: Use MongoDB Atlas for managed scaling

### Performance Optimization

1. **Frontend**:
   - Enable Next.js Image Optimization
   - Code splitting (automatic with Next.js)
   - Server-side rendering for static pages

2. **Backend**:
   - Connection pooling for databases
   - Caching with Redis (optional)
   - API response caching

## 🚨 Troubleshooting

### Build Errors

```bash
# Clear cache
rm -rf node_modules .next
npm install
npm run build
```

### Environment Variable Issues

```bash
# Verify variables are loaded
node -e "require('dotenv').config(); console.log(process.env.ANTHROPIC_API_KEY)"
```

### CORS Errors

- Check `FRONTEND_URL` matches actual domain
- Verify `origin` setting in backend CORS config
- Enable credentials if needed

### API Key Errors

```bash
# Test API key
curl -X POST http://localhost:5000/api/llm/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello","model":"claude"}'
```

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/your-repo/issues
- Email: admin@alohanova.ai
- Documentation: https://docs.alohanova.ai

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [API Security](https://owasp.org/www-project-api-security/)
- [Environment Variables](https://12factor.net/config)

---

**Last Updated**: November 2024
**Version**: 2.2.1
