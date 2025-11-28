#!/bin/bash

# Aloha Platform - Local LLM Setup Script
# Installs and configures Ollama for local LLM inference

set -e

echo ""
echo "🌺 Aloha Platform - Local LLM Setup"
echo "=================================="
echo ""

# Detect OS
OS="$(uname -s)"
echo "📦 Detected OS: $OS"

case "$OS" in
  Darwin)
    echo "🍎 macOS detected"
    if ! command -v ollama &> /dev/null; then
      echo "Installing Ollama via Homebrew..."
      brew install ollama
    else
      echo "✅ Ollama already installed"
    fi
    ;;
  Linux)
    echo "🐧 Linux detected"
    if ! command -v ollama &> /dev/null; then
      echo "Installing Ollama..."
      curl https://ollama.ai/install.sh | sh
    else
      echo "✅ Ollama already installed"
    fi
    ;;
  MINGW*|MSYS*|CYGWIN*)
    echo "🪟 Windows detected"
    echo "Please download Ollama from https://ollama.ai"
    exit 1
    ;;
  *)
    echo "❌ Unsupported OS: $OS"
    exit 1
    ;;
esac

echo ""
echo "📥 Pulling models..."

# Pull recommended models
ollama pull mistral
echo "✅ Mistral 7B installed"

# Optional: Pull additional models
read -p "Install neural-chat model? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  ollama pull neural-chat
  echo "✅ Neural Chat installed"
fi

read -p "Install llama2 model? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  ollama pull llama2
  echo "✅ Llama2 installed"
fi

echo ""
echo "🚀 Starting Ollama service..."

# Start Ollama
if [[ "$OS" == "Darwin" ]]; then
  open -a Ollama
  sleep 3
elif [[ "$OS" == "Linux" ]]; then
  ollama serve &
  sleep 3
fi

# Verify installation
echo ""
echo "✅ Checking Ollama status..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
  echo "✅ Ollama is running at http://localhost:11434"
  curl http://localhost:11434/api/tags | jq '.models[] | .name'
else
  echo "⚠️  Ollama not responding. Make sure it's running:"
  echo "  macOS: open -a Ollama"
  echo "  Linux: ollama serve"
fi

echo ""
echo "📝 Configure .env file:"
cat > .env.local << EOF
LLM_PROVIDER=local
LOCAL_LLM_API_URL=http://localhost:11434
LOCAL_LLM_MODEL=mistral
EOF

echo "✅ Created .env.local"
echo ""
echo "🎉 Local LLM setup complete!"
echo ""
echo "Next steps:"
echo "1. Start Ollama: ollama serve"
echo "2. Run dev server: npm run dev"
echo "3. API endpoint: POST /api/llm/generate"
echo ""
