#!/bin/bash
set -e

echo "🚀 Setting up TradeHub UAE..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required. Install Node.js >= 20"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required. Install: npm install -g pnpm"; exit 1; }

echo "✅ Node.js $(node -v)"
echo "✅ pnpm $(pnpm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Setup environment
if [ ! -f .env ]; then
  echo "📝 Creating .env from template..."
  cp .env.example .env
  echo "⚠️ Edit .env with your configuration"
fi

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
pnpm db:generate

# Setup Husky
echo "🐶 Setting up Husky..."
pnpm exec husky init

echo "✨ Setup complete! Run 'pnpm dev' to start development."
