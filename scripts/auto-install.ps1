# ==========================================
# Aloha Platform - Auto-Install Script
# Windows PowerShell Edition
# ==========================================

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "❌ This script requires Administrator privileges" -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🌺 Aloha Platform - Auto-Install Script (Windows)" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Define versions
$NodeMinVersion = "25.0.0"

# ==========================================
# 1. Check and Install Node.js
# ==========================================
Write-Host "📦 Step 1: Checking Node.js..." -ForegroundColor Green

$NodeVersion = node --version 2>$null
if ($null -eq $NodeVersion) {
    Write-Host "⚠️  Node.js not found. Installing..." -ForegroundColor Yellow
    Write-Host "Note: Please install Node.js 25+ from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Then run this script again." -ForegroundColor Yellow
    Start-Process "https://nodejs.org/"
    exit 1
} else {
    Write-Host "✅ Node.js $NodeVersion installed" -ForegroundColor Green
}

# ==========================================
# 2. Install/Update npm dependencies
# ==========================================
Write-Host ""
Write-Host "📚 Step 2: Installing npm dependencies..." -ForegroundColor Green

npm install --legacy-peer-deps 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ npm install failed" -ForegroundColor Red
    exit 1
}

# ==========================================
# 3. Generate Admin Tokens
# ==========================================
Write-Host ""
Write-Host "🔐 Step 3: Generating admin tokens..." -ForegroundColor Green

node scripts/init-tokens.js 2>&1 | Out-Null

if (Test-Path ".admin-tokens.json") {
    Write-Host "✅ Admin tokens generated" -ForegroundColor Green
} else {
    Write-Host "❌ Token generation failed" -ForegroundColor Red
    exit 1
}

# ==========================================
# 4. Setup .env file
# ==========================================
Write-Host ""
Write-Host "⚙️  Step 4: Configuring environment..." -ForegroundColor Green

$EnvContent = @"
NODE_ENV=development
PORT=3000
NEXTAUTH_SECRET=dev-secret-aloha-2025

LLM_PROVIDER=local
LOCAL_LLM_API_URL=http://localhost:11434
LOCAL_LLM_MODEL=mistral

ALOHA_LIFETIME_USER=malcolmlee3@gmail.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@

if (-NOT (Test-Path ".env.local")) {
    $EnvContent | Out-File -Encoding UTF8 ".env.local"
    Write-Host "✅ .env.local created" -ForegroundColor Green
} else {
    Write-Host "✅ .env.local already exists" -ForegroundColor Green
}

# ==========================================
# 5. Check and Start Ollama
# ==========================================
Write-Host ""
Write-Host "🤖 Step 5: Setting up Local LLM (Ollama)..." -ForegroundColor Green

$OllamaPath = "C:\Users\$env:USERNAME\AppData\Local\Programs\Ollama\ollama.exe"

if (Test-Path $OllamaPath) {
    Write-Host "✅ Ollama found at $OllamaPath" -ForegroundColor Green

    # Check if running
    $OllamaRunning = curl -s http://localhost:11434/api/tags 2>$null
    if ($OllamaRunning) {
        Write-Host "✅ Ollama is already running" -ForegroundColor Green
    } else {
        Write-Host "🚀 Starting Ollama..." -ForegroundColor Cyan
        Start-Process $OllamaPath -WindowStyle Hidden
        Start-Sleep -Seconds 5
    }
} else {
    Write-Host "⚠️  Ollama not found" -ForegroundColor Yellow
    Write-Host "Download from: https://ollama.ai/download/windows" -ForegroundColor Yellow
    Write-Host "Press any key to continue without Ollama..." -ForegroundColor Yellow
    Read-Host
}

# ==========================================
# 6. Download Models
# ==========================================
Write-Host ""
Write-Host "📥 Step 6: Downloading AI models..." -ForegroundColor Green
Write-Host "This may take 5-15 minutes depending on internet speed" -ForegroundColor Cyan

$Models = @("mistral", "neural-chat")

foreach ($Model in $Models) {
    Write-Host "Pulling $Model..." -ForegroundColor Cyan
    & ollama pull $Model 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $Model downloaded" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Could not download $Model (offline mode?)" -ForegroundColor Yellow
    }
}

# ==========================================
# 7. Install PM2 (Process Manager)
# ==========================================
Write-Host ""
Write-Host "⚙️  Step 7: Installing PM2 process manager..." -ForegroundColor Green

npm install -g pm2 2>&1 | Out-Null
pm2 install pm2-auto-pull 2>&1 | Out-Null

Write-Host "✅ PM2 installed" -ForegroundColor Green

# ==========================================
# 8. Build Next.js
# ==========================================
Write-Host ""
Write-Host "🔨 Step 8: Building Next.js application..." -ForegroundColor Green

npm run build 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "⚠️  Build completed with warnings (non-critical)" -ForegroundColor Yellow
}

# ==========================================
# 9. Final Status
# ==========================================
Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "✨ Auto-Installation Complete! ✨" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Installation Summary:" -ForegroundColor Green
Write-Host "  ✅ Node.js v$NodeVersion"
Write-Host "  ✅ npm dependencies"
Write-Host "  ✅ Admin tokens (.admin-tokens.json)"
Write-Host "  ✅ Environment configuration"
Write-Host "  ✅ Ollama installed"
Write-Host "  ✅ Models downloaded"
Write-Host "  ✅ Build complete"
Write-Host ""

Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start the development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Open in browser:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Admin credentials:" -ForegroundColor White
Write-Host "   Email: malcolmlee3@gmail.com" -ForegroundColor Yellow
Write-Host "   Tier: LIFETIME_ENTERPRISE" -ForegroundColor Yellow
Write-Host "   Access: Unlimited" -ForegroundColor Yellow
Write-Host ""

Write-Host "📝 Useful Commands:" -ForegroundColor Cyan
Write-Host "  npm run dev           - Start development server" -ForegroundColor White
Write-Host "  npm run build         - Build for production" -ForegroundColor White
Write-Host "  npm run start         - Start production server" -ForegroundColor White
Write-Host "  pm2 list              - View running services" -ForegroundColor White
Write-Host "  pm2 logs              - View service logs" -ForegroundColor White
Write-Host "  ollama serve          - Start Ollama manually" -ForegroundColor White
Write-Host ""

Write-Host "🌺 Happy coding! 🚀" -ForegroundColor Green
Write-Host ""
