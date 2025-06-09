#!/bin/bash
# Enhanced timeout build script based on community findings

echo "🔧 Setting realistic timeout for Claude Code workflow..."
export CLAUDE_COMMAND_TIMEOUT=120000
export NODE_OPTIONS="--max_old_space_size=2048"

echo "🚀 Starting build with extended timeout..."
cd "$(dirname "$0")"
npm run build

echo "✅ Build completed with extended timeout!"