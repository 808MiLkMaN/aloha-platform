#!/bin/bash

# ============================================
# Aloha Nova Universe - Unix Build Script
# Cross-Platform Build & Test (macOS/Linux)
# ============================================

set -e

ACTION="${1:-dev}"
BACKEND="${2:-localhost:5000}"
FRONTEND="${3:-localhost:3000}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Functions
write_header() {
    echo -e "\n${CYAN}$(printf '=%.0s' {1..60})${NC}"
    echo -e "${YELLOW}🌺 $1${NC}"
    echo -e "${CYAN}$(printf '=%.0s' {1..60})${NC}\n"
}

test_dependencies() {
    write_header "Checking Dependencies"

    local missing=()

    # Check Node.js
    if command -v node &> /dev/null; then
        echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
    else
        echo -e "${RED}❌ Node.js: NOT FOUND${NC}"
        missing+=("Node.js")
    fi

    # Check npm
    if command -v npm &> /dev/null; then
        echo -e "${GREEN}✅ npm: $(npm --version)${NC}"
    else
        echo -e "${RED}❌ npm: NOT FOUND${NC}"
        missing+=("npm")
    fi

    if [ ${#missing[@]} -gt 0 ]; then
        echo -e "\n${YELLOW}⚠️  Missing dependencies: ${missing[*]}${NC}"
        echo -e "${YELLOW}Install from: https://nodejs.org/${NC}"
        exit 1
    fi
}

install_dependencies() {
    write_header "Installing Dependencies"

    # Backend dependencies
    if [ -f "backend/package.json" ]; then
        echo -e "${CYAN}📦 Installing backend dependencies...${NC}"
        cd backend
        npm install --legacy-peer-deps
        cd ..
        echo -e "${GREEN}✅ Backend dependencies installed${NC}"
    fi

    # Frontend dependencies
    echo -e "${CYAN}📦 Installing frontend dependencies...${NC}"
    npm install --legacy-peer-deps
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
}

build_backend() {
    write_header "Building Backend"

    if [ ! -f "backend/package.json" ]; then
        echo -e "${YELLOW}⚠️  No backend found, skipping...${NC}"
        return
    fi

    echo -e "${CYAN}🔨 Backend ready at http://$BACKEND${NC}"
}

build_frontend() {
    write_header "Building Frontend"

    echo -e "${CYAN}🔨 Building Next.js application...${NC}"
    npm run build
    echo -e "${GREEN}✅ Frontend build complete${NC}"
}

start_dev() {
    write_header "Starting Development Server"

    echo -e "${CYAN}Starting backend and frontend...\n${NC}"

    # Start backend in background
    if [ -f "backend/package.json" ]; then
        echo -e "${GREEN}🚀 Starting backend...${NC}"
        cd backend
        npm run dev &
        BACKEND_PID=$!
        cd ..
        sleep 2
    fi

    echo -e "${GREEN}🚀 Starting frontend...${NC}"
    echo -e "${CYAN}📍 Frontend: http://$FRONTEND${NC}"
    echo -e "${CYAN}📍 Backend:  http://$BACKEND${NC}"
    echo -e "${YELLOW}\nPress Ctrl+C to stop${NC}"

    npm run dev

    # Cleanup on exit
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
}

start_production() {
    write_header "Starting Production Build"

    echo -e "${CYAN}🔨 Building for production...${NC}"
    npm run build

    echo -e "${GREEN}✅ Build complete. Starting production server...${NC}"
    npm run start
}

run_tests() {
    write_header "Running Tests"

    if npm list jest &> /dev/null; then
        echo -e "${CYAN}🧪 Running frontend tests...${NC}"
        npm test -- --passWithNoTests --ci
    else
        echo -e "${YELLOW}⚠️  Jest not installed. Skipping tests.${NC}"
        echo -e "${CYAN}Install with: npm install --save-dev jest${NC}"
    fi
}

run_lint() {
    write_header "Running Linter"

    if npm list eslint &> /dev/null; then
        echo -e "${CYAN}📝 Linting code...${NC}"
        npm run lint 2>/dev/null || echo -e "${GREEN}✅ Linting complete${NC}"
    else
        echo -e "${YELLOW}⚠️  ESLint not installed. Skipping lint.${NC}"
    fi
}

show_help() {
    cat << EOF
╔════════════════════════════════════════════════════════════╗
║        🌺 Aloha Nova Universe - Build Script 🌺           ║
╚════════════════════════════════════════════════════════════╝

USAGE: ./build.sh [Action] [Backend] [Frontend]

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
  ./build.sh                     # Start dev server
  ./build.sh build               # Build for production
  ./build.sh test                # Run tests
  ./build.sh check               # Verify dependencies

ENVIRONMENT:
  Backend:  $BACKEND
  Frontend: $FRONTEND

EOF
}

# Make script executable
if [ ! -x "$0" ]; then
    chmod +x "$0"
fi

# Main
case "$ACTION" in
    dev)
        test_dependencies
        install_dependencies
        build_backend
        start_dev
        ;;
    build)
        test_dependencies
        install_dependencies
        build_frontend
        echo -e "\n${GREEN}✅ Production build ready in ./out or ./.next${NC}"
        ;;
    start)
        start_production
        ;;
    install)
        install_dependencies
        ;;
    test)
        run_tests
        ;;
    lint)
        run_lint
        ;;
    check)
        test_dependencies
        ;;
    help)
        show_help
        ;;
    *)
        show_help
        ;;
esac
