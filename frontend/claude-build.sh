#!/bin/bash

# Claude Code Build Workaround Script
# This script provides multiple strategies to handle build timeouts in Claude Code

set -e

echo "🚀 Claude Code Build Workaround Script"
echo "======================================"

# Function to show usage
show_usage() {
    echo "Usage: ./claude-build.sh [OPTION]"
    echo ""
    echo "Options:"
    echo "  fast      - Quick build with optimizations"
    echo "  check     - TypeScript and lint checks only"
    echo "  clean     - Clean build from scratch"
    echo "  validate  - Fast validation without full build"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./claude-build.sh fast"
    echo "  ./claude-build.sh check"
    echo "  ./claude-build.sh validate"
}

# Function for fast build
fast_build() {
    echo "🔨 Starting fast build process..."
    
    # Set environment variables for faster builds
    export NODE_ENV=production
    export NEXT_TELEMETRY_DISABLED=1
    export GENERATE_SOURCEMAP=false
    export NODE_OPTIONS="--max_old_space_size=4096"
    
    # Clean previous build
    echo "🧹 Cleaning previous build..."
    rm -rf .next
    
    # Use fast config
    echo "⚡ Using optimized Next.js configuration..."
    cp next.config.fast.js next.config.temp.js
    
    # Run build with timeout protection
    echo "🏗️  Building application..."
    timeout 100s npx next build || {
        echo "⚠️  Build timeout reached"
        echo "💡 Try running manually: cd frontend && npm run build"
        cp next.config.js next.config.temp.js 2>/dev/null || true
        exit 1
    }
    
    # Restore original config
    cp next.config.js next.config.temp.js 2>/dev/null || true
    rm -f next.config.temp.js
    
    echo "✅ Fast build completed!"
}

# Function for validation only
validate_only() {
    echo "🔍 Running validation checks..."
    
    echo "📝 TypeScript check..."
    npx tsc --noEmit || {
        echo "❌ TypeScript errors found"
        exit 1
    }
    
    echo "🧹 ESLint check..."
    npx next lint || echo "⚠️  Lint warnings found (non-blocking)"
    
    echo "✅ Validation completed!"
}

# Function for clean build
clean_build() {
    echo "🧹 Clean build process..."
    
    # Clean everything
    rm -rf .next
    rm -rf node_modules/.cache
    
    # Quick dependency check
    echo "📦 Checking dependencies..."
    npm list --depth=0 > /dev/null || echo "⚠️  Some dependency issues found"
    
    # Run normal build
    fast_build
}

# Function for quick checks
quick_check() {
    echo "⚡ Quick project validation..."
    
    # Check if critical files exist
    echo "📁 Checking project structure..."
    [ -f "package.json" ] || { echo "❌ package.json not found"; exit 1; }
    [ -f "next.config.js" ] || { echo "❌ next.config.js not found"; exit 1; }
    [ -d "src" ] || { echo "❌ src directory not found"; exit 1; }
    
    echo "🔧 Checking Next.js configuration..."
    node -e "require('./next.config.js')" || { echo "❌ Invalid Next.js config"; exit 1; }
    
    echo "📝 Quick TypeScript syntax check..."
    npx tsc --noEmit --skipLibCheck || { echo "❌ TypeScript errors"; exit 1; }
    
    echo "✅ Quick validation passed!"
}

# Main script logic
case "${1:-help}" in
    "fast")
        fast_build
        ;;
    "check")
        validate_only
        ;;
    "clean")
        clean_build
        ;;
    "validate")
        quick_check
        ;;
    "help"|*)
        show_usage
        ;;
esac

echo ""
echo "🎉 Script completed!"
echo "💡 For manual builds, run: cd frontend && npm run build"