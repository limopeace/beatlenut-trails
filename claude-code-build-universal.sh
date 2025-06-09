#!/bin/bash

# Universal Claude Code Build Solution
# Works from any directory for any Node.js/Next.js project
# Usage: ./claude-code-build-universal.sh [project-path] [build-type]

set -e

# Default values
PROJECT_PATH="${1:-$(pwd)}"
BUILD_TYPE="${2:-fast}"

echo "🚀 Universal Claude Code Build Solution"
echo "======================================"
echo "📁 Project Path: $PROJECT_PATH"
echo "🔧 Build Type: $BUILD_TYPE"
echo ""

# Function to detect project type
detect_project_type() {
    if [ -f "$PROJECT_PATH/package.json" ]; then
        if grep -q "next" "$PROJECT_PATH/package.json"; then
            echo "nextjs"
        elif grep -q "react-scripts" "$PROJECT_PATH/package.json"; then
            echo "react"
        elif grep -q "vue" "$PROJECT_PATH/package.json"; then
            echo "vue"
        else
            echo "node"
        fi
    else
        echo "unknown"
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: ./claude-code-build-universal.sh [PROJECT_PATH] [BUILD_TYPE]"
    echo ""
    echo "PROJECT_PATH: Path to project directory (default: current directory)"
    echo "BUILD_TYPE:  fast|quick|check|validate (default: fast)"
    echo ""
    echo "Examples:"
    echo "  ./claude-code-build-universal.sh                    # Build current directory"
    echo "  ./claude-code-build-universal.sh /path/to/project   # Build specific project"
    echo "  ./claude-code-build-universal.sh . quick            # Quick validation only"
    echo "  ./claude-code-build-universal.sh /path/to/proj check # TypeScript check only"
}

# Set realistic timeout for Claude Code
set_claude_environment() {
    export CLAUDE_COMMAND_TIMEOUT=90000  # 90 seconds - realistic for Claude Code
    export NODE_OPTIONS="--max_old_space_size=2048"
    export NODE_ENV=production
    export NEXT_TELEMETRY_DISABLED=1
    export GENERATE_SOURCEMAP=false
    echo "✅ Claude Code environment configured (90s timeout)"
}

# Function for fast build
fast_build() {
    local project_type=$(detect_project_type)
    echo "🔨 Fast build for $project_type project..."
    
    cd "$PROJECT_PATH"
    
    # Clean previous build
    echo "🧹 Cleaning previous build..."
    [ -d ".next" ] && rm -rf .next
    [ -d "build" ] && rm -rf build
    [ -d "dist" ] && rm -rf dist
    
    # Run appropriate build command with timeout
    case $project_type in
        "nextjs")
            echo "⚡ Building Next.js project..."
            timeout 90s npm run build || {
                echo "⚠️  Build timeout (90s) - try manual build"
                exit 1
            }
            ;;
        "react")
            echo "⚡ Building React project..."
            timeout 90s npm run build || {
                echo "⚠️  Build timeout (90s) - try manual build"
                exit 1
            }
            ;;
        "vue")
            echo "⚡ Building Vue project..."
            timeout 90s npm run build || {
                echo "⚠️  Build timeout (90s) - try manual build"
                exit 1
            }
            ;;
        *)
            echo "⚡ Building Node.js project..."
            timeout 90s npm run build || {
                echo "⚠️  Build timeout (90s) - try manual build"
                exit 1
            }
            ;;
    esac
    
    echo "✅ Fast build completed!"
}

# Function for quick validation
quick_validation() {
    echo "🔍 Quick project validation..."
    
    cd "$PROJECT_PATH"
    
    # Check if package.json exists
    [ -f "package.json" ] || { echo "❌ package.json not found"; exit 1; }
    
    echo "📝 Checking dependencies..."
    npm list --depth=0 >/dev/null 2>&1 || echo "⚠️  Some dependency issues found"
    
    # TypeScript check if tsconfig exists
    if [ -f "tsconfig.json" ]; then
        echo "📝 TypeScript syntax check..."
        timeout 30s npx tsc --noEmit --skipLibCheck || {
            echo "❌ TypeScript errors found"
            exit 1
        }
    fi
    
    # ESLint check if config exists
    if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || [ -f "eslint.config.js" ]; then
        echo "🧹 ESLint check..."
        timeout 30s npm run lint 2>/dev/null || echo "⚠️  Lint warnings found"
    fi
    
    echo "✅ Quick validation completed!"
}

# Function for TypeScript check only
typescript_check() {
    echo "📝 TypeScript validation..."
    
    cd "$PROJECT_PATH"
    
    if [ -f "tsconfig.json" ]; then
        timeout 45s npx tsc --noEmit || {
            echo "❌ TypeScript errors found"
            exit 1
        }
        echo "✅ TypeScript check passed!"
    else
        echo "⚠️  No TypeScript configuration found"
    fi
}

# Function for comprehensive check
comprehensive_check() {
    echo "🔍 Comprehensive project check..."
    
    cd "$PROJECT_PATH"
    
    # Project structure check
    echo "📁 Project structure validation..."
    [ -f "package.json" ] || { echo "❌ package.json missing"; exit 1; }
    
    # Dependencies check
    echo "📦 Dependencies check..."
    npm list --depth=0 >/dev/null 2>&1 || echo "⚠️  Dependency issues detected"
    
    # TypeScript check
    if [ -f "tsconfig.json" ]; then
        echo "📝 TypeScript check..."
        timeout 30s npx tsc --noEmit || echo "❌ TypeScript errors found"
    fi
    
    # Lint check
    if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ]; then
        echo "🧹 Lint check..."
        timeout 30s npm run lint 2>/dev/null || echo "⚠️  Lint issues found"
    fi
    
    # Security audit (quick)
    echo "🔒 Security audit..."
    timeout 20s npm audit --audit-level moderate 2>/dev/null || echo "⚠️  Security issues found"
    
    echo "✅ Comprehensive check completed!"
}

# Check for help flag
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    show_usage
    exit 0
fi

# Validate project path
if [ ! -d "$PROJECT_PATH" ]; then
    echo "❌ Error: Directory '$PROJECT_PATH' does not exist"
    exit 1
fi

# Set up environment
set_claude_environment

# Main execution based on build type
case "$BUILD_TYPE" in
    "fast")
        fast_build
        ;;
    "quick")
        quick_validation
        ;;
    "check")
        typescript_check
        ;;
    "validate")
        comprehensive_check
        ;;
    *)
        echo "❌ Unknown build type: $BUILD_TYPE"
        echo "Valid types: fast, quick, check, validate"
        show_usage
        exit 1
        ;;
esac

echo ""
echo "🎉 Universal build script completed!"
echo "💡 For manual builds: cd $PROJECT_PATH && npm run build"