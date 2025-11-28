# 🌺 Aloha Platform - Auto-Install Complete Setup

## ✨ ONE-COMMAND AUTO-INSTALL

```bash
# Windows PowerShell (Run as Administrator)
powershell -ExecutionPolicy Bypass -File .\scripts\auto-install.ps1

# macOS / Linux
bash ./scripts/auto-install.sh
```

---

## 📦 What Gets Installed

### System Components
- ✅ Node.js 25+ (if needed)
- ✅ Ollama (Local LLM runtime)
- ✅ Git (if needed)
- ✅ PM2 (Process manager)

### AI Models
- ✅ Mistral 7B (primary model)
- ✅ Neural-Chat 7B (alternative)
- ✅ Llama2 7B (optional)

### Configuration
- ✅ .env file setup
- ✅ Token initialization
- ✅ Admin credentials (malcolm@gmail.com)
- ✅ LLM API configuration

### Services Started
- ✅ Next.js dev server (port 3000)
- ✅ Ollama service (port 11434)
- ✅ Admin dashboard ready

---

## ⏱️ Installation Time

- **First Run:** 15-30 minutes (includes model downloads)
- **Subsequent Runs:** 2-5 minutes
- **Model Download Time:** 7-15 minutes (depends on internet speed)

---

## 🚀 Quick Start

### 1. Run Auto-Install

**Windows:**
```powershell
cd C:\Users\Ekolu\aloha-platform
powershell -ExecutionPolicy Bypass -File .\scripts\auto-install.ps1
```

**macOS/Linux:**
```bash
cd ~/aloha-platform
bash ./scripts/auto-install.sh
```

### 2. Access Application

Open browser: **http://localhost:3000**

### 3. Test LLM API

```bash
curl -X POST http://localhost:3000/api/llm/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello!"}'
```

---

## 📋 Installation Checklist

After running auto-install, verify:

- [ ] Terminal shows "✅ Installation Complete"
- [ ] Ollama running on http://localhost:11434
- [ ] Next.js running on http://localhost:3000
- [ ] Models downloaded and available
- [ ] Admin tokens generated
- [ ] .env file configured
- [ ] No error messages

---

## 🆘 Troubleshooting

### Ollama Won't Start

```bash
# Try manual start
ollama serve

# In another terminal, test
curl http://localhost:11434/api/tags
```

### Models Won't Download

```bash
# Check internet connection
ping google.com

# Manual download
ollama pull mistral
ollama pull neural-chat
```

### Port Already in Use

```bash
# Find and kill process on port 3000
# Windows: Use Task Manager (End Task for node.exe)
# macOS/Linux: lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or change port
PORT=3001 npm run dev
```

---

## 🔐 Admin Credentials

After installation:

**Email:** `malcolmlee3@gmail.com`
**Access Level:** `LIFETIME_ENTERPRISE` (Unlimited)
**Token File:** `.admin-tokens.json`

Use these credentials to access admin dashboard.

---

## 📊 System Requirements

- **OS:** Windows 10+, macOS 10.14+, Ubuntu 18.04+
- **RAM:** 8GB minimum (16GB recommended for models)
- **Disk:** 50GB free (for models)
- **CPU:** 4 cores minimum
- **Internet:** Stable connection for model downloads

---

## 🎯 What's Included

### Frontend
- ✅ Next.js 16 development server
- ✅ React 19 components
- ✅ Tailwind CSS styling
- ✅ Beautiful dashboard UI

### Backend
- ✅ Token management API
- ✅ LLM generation API
- ✅ Multi-provider support
- ✅ Authentication routes

### Local LLM
- ✅ Ollama integration
- ✅ Mistral model (7B)
- ✅ Streaming support
- ✅ Model management

### Tools
- ✅ PM2 process manager
- ✅ Admin token generator
- ✅ Setup automation
- ✅ Environment configurator

---

## 📝 Post-Installation Steps

### 1. Verify Installation

```bash
# Check dev server
curl http://localhost:3000

# Check LLM service
curl http://localhost:11434/api/tags

# Check admin tokens
cat .admin-tokens.json
```

### 2. Test API Endpoints

```bash
# Generate text with Mistral
curl -X POST http://localhost:3000/api/llm/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "What is machine learning?",
    "provider": "local",
    "model": "mistral"
  }'

# Get admin tokens
curl -X POST http://localhost:3000/api/auth/tokens/generate \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com"}'
```

### 3. Monitor Services

```bash
# View all services
pm2 list

# View logs
pm2 logs

# Monitor real-time
pm2 monit
```

### 4. Update Environment (Optional)

Edit `.env` to customize:

```env
LLM_PROVIDER=local
LOCAL_LLM_API_URL=http://localhost:11434
LOCAL_LLM_MODEL=mistral
NODE_ENV=development
PORT=3000
```

---

## 🚀 Deployment Options After Setup

### Option 1: Keep Running Locally
```bash
npm run dev
# Runs indefinitely for development
```

### Option 2: Deploy to VM
```bash
# Follow: VM-HOSTING-SETUP.md
bash /path/to/deployment-script.sh
```

### Option 3: Docker Deployment
```bash
docker-compose up -d
# All services in containers
```

---

## 📚 Additional Resources

- **Documentation:** `/docs`
- **LLM Guide:** `lib/llm-service.ts`
- **Token Manager:** `lib/token-manager.ts`
- **API Routes:** `src/app/api/`
- **Quick Start:** `DEPLOYMENT-QUICK-START.md`
- **VM Setup:** `VM-HOSTING-SETUP.md`

---

## 🎉 You're Ready!

After installation:
1. ✅ Frontend running on http://localhost:3000
2. ✅ LLM API ready at /api/llm/generate
3. ✅ Admin tokens in .admin-tokens.json
4. ✅ Local LLM models downloaded
5. ✅ Ready for development or deployment

---

**🌺 Installation Complete! Happy coding! 🚀**
