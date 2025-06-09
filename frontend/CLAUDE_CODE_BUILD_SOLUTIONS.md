#!/bin/bash
# Enhanced timeout build script based on community findings

echo "🔧 Setting extended timeout for Claude Code..."
export CLAUDE_COMMAND_TIMEOUT=300000
export NODE_OPTIONS="--max_old_space_size=4096"

echo "🚀 Starting build with extended timeout..."
cd "$(dirname "$0")"
npm run build

echo "✅ Build completed with extended timeout!"