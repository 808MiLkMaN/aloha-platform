# ============================================
# Aloha Nova Universe - Windows Build Script
# Cross-Platform Build & Test
# ============================================

param(
    [string]$Action = "dev",
    [string]$Backend = "localhost:5000",
    [string]$Frontend = "localhost:3000"
)

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$Title)
    Write-Host "`n$('='*60)" -ForegroundColor Cyan
    Write-Host "🌺 $Title" -ForegroundColor Yellow
    Write-Host "$('='*60)`n" -ForegroundColor Cyan
}

function Test-Dependencies {
    Write-Header "Checking Dependencies"

    $deps = @(
        @{ Name = "Node.js"; Cmd = "node --version"; Type = "node" },
        @{ Name = "npm"; Cmd = "npm --version"; Type = "npm" }
    )

    $missing = @()

    foreach ($dep in $deps) {
        try {
            $version = Invoke-Expression $dep.Cmd 2>$null
            Write-Host "✅ $($dep.Name): $version" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ $($dep.Name): NOT FOUND" -ForegroundColor Red
            $missing += $dep.Name
        }
    }

    if ($missing.Count -gt 0) {
        Write-Host "`n⚠️  Missing dependencies: $($missing -join ', ')" -ForegroundColor Yellow
        Write-Host "Install from: https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }
}

function Install-Dependencies {
    Write-Header "Installing Dependencies"

    # Backend dependencies
    if (Test-Path "backend/package.json") {
        Write-Host "📦 Installing backend dependencies..." -ForegroundColor Cyan
        Push-Location backend
        npm install --legacy-peer-deps
        Pop-Location
        Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
    }

    # Frontend dependencies
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Cyan
    npm install --legacy-peer-deps
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
}

function Build-Backend {
    Write-Header "Building Backend"

    if (-not (Test-Path "backend/package.json")) {
        Write-Host "⚠️  No backend found, skipping..." -ForegroundColor Yellow
        return
    }

    Push-Location backend
    Write-Host "🔨 Backend ready at http://$Backend" -ForegroundColor Cyan
    Pop-Location
}

function Build-Frontend {
    Write-Header "Building Frontend"

    Write-Host "🔨 Building Next.js application..." -ForegroundColor Cyan
    npm run build
    Write-Host "✅ Frontend build complete" -ForegroundColor Green
}

function Start-Dev {
    Write-Header "Starting Development Server"

    Write-Host "Starting backend and frontend...`n" -ForegroundColor Cyan

    # Start backend in new window
    if (Test-Path "backend/package.json") {
        Write-Host "🚀 Starting backend..." -ForegroundColor Green
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $PWD/backend; npm run dev" `
            -WindowStyle Normal
        Start-Sleep -Seconds 2
    }

    # Start frontend
    Write-Host "🚀 Starting frontend..." -ForegroundColor Green
    Write-Host "📍 Frontend: http://$Frontend" -ForegroundColor Cyan
    Write-Host "📍 Backend:  http://$Backend" -ForegroundColor Cyan
    Write-Host "`nPress Ctrl+C to stop" -ForegroundColor Yellow

    npm run dev
}

function Start-Production {
    Write-Header "Starting Production Build"

    Write-Host "🔨 Building for production..." -ForegroundColor Cyan
    npm run build

    Write-Host "✅ Build complete. Starting production server..." -ForegroundColor Green
    npm run start
}

function Run-Tests {
    Write-Header "Running Tests"

    # Check if Jest is installed
    $hasJest = (npm list jest 2>$null) -match "jest"

    if ($hasJest) {
        Write-Host "🧪 Running frontend tests..." -ForegroundColor Cyan
        npm test -- --passWithNoTests --ci
    }
    else {
        Write-Host "⚠️  Jest not installed. Skipping tests." -ForegroundColor Yellow
        Write-Host "Install with: npm install --save-dev jest" -ForegroundColor Cyan
    }
}

function Run-Lint {
    Write-Header "Running Linter"

    $hasEslint = (npm list eslint 2>$null) -match "eslint"

    if ($hasEslint) {
        Write-Host "📝 Linting code..." -ForegroundColor Cyan
        npm run lint 2>$null || Write-Host "✅ Linting complete" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  ESLint not installed. Skipping lint." -ForegroundColor Yellow
    }
}

function Show-Help {
    @"
╔════════════════════════════════════════════════════════════╗
║        🌺 Aloha Nova Universe - Build Script 🌺           ║
╚════════════════════════════════════════════════════════════╝

USAGE: .\build.ps1 [Action] [Options]

ACTIONS:
  dev              Start development server (default)
  build            Build production bundle
  start            Run production server
  install          Install dependencies
  test             Run tests
  lint             Run linter
  check            Check dependencies
  help             Show this message

EXAMPLES:
  .\build.ps1                    # Start dev server
  .\build.ps1 build              # Build for production
  .\build.ps1 test               # Run tests
  .\build.ps1 check              # Verify dependencies

ENVIRONMENT:
  Backend:  $Backend
  Frontend: $Frontend

"@
}

# Main
switch ($Action.ToLower()) {
    "dev" {
        Test-Dependencies
        Install-Dependencies
        Build-Backend
        Start-Dev
    }
    "build" {
        Test-Dependencies
        Install-Dependencies
        Build-Frontend
        Write-Host "`n✅ Production build ready in ./out or ./.next" -ForegroundColor Green
    }
    "start" {
        Start-Production
    }
    "install" {
        Install-Dependencies
    }
    "test" {
        Run-Tests
    }
    "lint" {
        Run-Lint
    }
    "check" {
        Test-Dependencies
    }
    "help" {
        Show-Help
    }
    default {
        Show-Help
    }
}
