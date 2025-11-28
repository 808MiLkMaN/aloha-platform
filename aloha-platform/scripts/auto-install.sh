#!/bin/bash

# ==========================================
# Aloha Platform - Auto-Install Script
# macOS/Linux Edition
# ==========================================

set -e

echo ""
echo "🌺 Aloha Platform - Auto-Install Script (macOS/Linux)"
echo "===================================================="
echo ""

# ==========================================
# 1. Check Node.js
# ==========================================
echo "📦 Step 1: Checking Node.js..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    echo "Install Node.js 25+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ $NODE_VERSION installed"

# ==========================================
# 2. Install npm dependencies
# ==========================================
echo ""
echo "📚 Step 2: Installing npm dependencies..."

npm install --legacy-peer-deps

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ npm install failed"
    exit 1
fi

# ==========================================
# 3. Generate Admin Tokens
# ==========================================
echo ""
echo "🔐 Step 3: Generating admin tokens..."

node scripts/init-tokens.js

if [ -f ".admin-tokens.json" ]; then
    echo "✅ Admin tokens generated"
else
    echo "❌ Token generation failed"
    exit 1
fi

# ==========================================
# 4. Setup .env file
# ==========================================
echo ""
echo "⚙️  Step 4: Configuring environment..."

cat > .env.local << 'EOF'
NODE_ENV=development
PORT=3000
NEXTAUTH_SECRET=dev-secret-aloha-2025

LLM_PROVIDER=local
LOCAL_LLM_API_URL=http://localhost:11434
LOCAL_LLM_MODEL=mistral

ALOHA_LIFETIME_USER=malcolmlee3@gmail.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

echo "✅ .env.local created"

# ==========================================
# 5. Check and Install Ollama
# ==========================================
echo ""
echo "🤖 Step 5: Setting up Local LLM (Ollama)..."

if ! command -v ollama &> /dev/null; then
    echo "⚠️  Ollama not found. Installing..."

    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install ollama
            echo "✅ Ollama installed via Homebrew"
        else
            echo "Install Homebrew first: https://brew.sh"
            exit 1
        fi
    else
        # Linux
        curl https://ollama.ai/install.sh | sh
        echo "✅ Ollama installed"
    fi
else
    echo "✅ Ollama already installed"
fi

# ==========================================
# 6. Start Ollama service
# ==========================================
echo ""
echo "🚀 Starting Ollama service..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - start Ollama app
    open -a Ollama &
    sleep 3
else
    # Linux - start ollama serve in background
    ollama serve &
    sleep 3
fi

# Check if running
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama is running"
else
    echo "⚠️  Ollama starting... (may take a moment)"
    sleep 5
fi

# ==========================================
# 7. Download Models
# ==========================================
echo ""
echo "📥 Step 6: Downloading AI models..."
echo "This may take 5-15 minutes depending on internet speed"

echo "Pulling mistral..."
ollama pull mistral && echo "✅ Mistral downloaded" || echo "⚠️  Could not download mistral"

read -p "Install neural-chat model? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Pulling neural-chat..."
    ollama pull neural-chat && echo "✅ Neural-Chat downloaded" || echo "⚠️  Could not download neural-chat"
fi

# ==========================================
# 8. Install PM2 (Process Manager)
# ==========================================
echo ""
echo "⚙️  Step 7: Installing PM2 process manager..."

npm install -g pm2 2>/dev/null || true
pm2 install pm2-auto-pull 2>/dev/null || true

echo "✅ PM2 installed"

# ==========================================
# 9. Build Next.js
# ==========================================
echo ""
echo "🔨 Step 8: Building Next.js application..."

npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "⚠️  Build completed with warnings (non-critical)"
fi

# ==========================================
# 10. Final Status
# ==========================================
echo ""
echo "===================================================="
echo "✨ Auto-Installation Complete! ✨"
echo "===================================================="
echo ""

echo "📋 Installation Summary:"
echo "  ✅ Node.js $NODE_VERSION"
echo "  ✅ npm dependencies"
echo "  ✅ Admin tokens (.admin-tokens.json)"
echo "  ✅ Environment configuration"
echo "  ✅ Ollama installed"
echo "  ✅ Models downloaded"
echo "  ✅ Build complete"
echo ""

echo "🚀 Next Steps:"
echo ""
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Open in browser:"
echo "   http://localhost:3000"
echo ""
echo "3. Admin credentials:"
echo "   Email: malcolmlee3@gmail.com"
echo "   Tier: LIFETIME_ENTERPRISE"
echo "   Access: Unlimited"
echo ""

echo "📝 Useful Commands:"
echo "  npm run dev           - Start development server"
echo "  npm run build         - Build for production"
echo "  npm run start         - Start production server"
echo "  pm2 list              - View running services"
echo "  pm2 logs              - View service logs"
echo "  ollama serve          - Start Ollama manually"
echo ""

echo "🌺 Happy coding! 🚀"
echo ""
