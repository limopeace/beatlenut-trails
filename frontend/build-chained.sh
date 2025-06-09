#!/bin/bash
# Chained command approach - breaks down build into steps

echo "🔗 Using chained command approach for Claude Code..."

# Step 1: Navigate to directory
echo "📁 Step 1: Navigating to project directory..."
cd "$(dirname "$0")"
echo "✅ Current directory: $(pwd)"

# Step 2: Clean previous build
echo "🧹 Step 2: Cleaning previous build..."
rm -rf .next
echo "✅ Cleaned .next directory"

# Step 3: Check dependencies
echo "📦 Step 3: Checking dependencies..."
npm list --depth=0 >/dev/null 2>&1
echo "✅ Dependencies checked"

# Step 4: Set environment variables
echo "🔧 Step 4: Setting build environment..."
export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
export GENERATE_SOURCEMAP=false
echo "✅ Environment configured"

# Step 5: Run build
echo "🏗️  Step 5: Running build..."
npm run build
echo "✅ Build process completed!"

echo "🎉 Chained build process finished!"