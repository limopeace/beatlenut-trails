#!/bin/bash

# Beatlenuts-GR Server Stop Script
# This script stops the local development servers

set -e

echo "🛑 Stopping Beatlenuts-GR Development Servers"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Function to stop process by PID
stop_process() {
    local pid=$1
    local name=$2
    
    if [ -n "$pid" ] && ps -p $pid > /dev/null 2>&1; then
        kill $pid 2>/dev/null
        sleep 2
        if ps -p $pid > /dev/null 2>&1; then
            kill -9 $pid 2>/dev/null
            sleep 1
        fi
        if ! ps -p $pid > /dev/null 2>&1; then
            print_status "$name server stopped (PID: $pid)"
        else
            print_error "Failed to stop $name server (PID: $pid)"
        fi
    else
        print_warning "$name server not running or PID not found"
    fi
}

# Stop servers using saved PIDs
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    stop_process "$BACKEND_PID" "Backend"
    rm -f .backend.pid
fi

if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    stop_process "$FRONTEND_PID" "Frontend"
    rm -f .frontend.pid
fi

# Alternative method: Kill by port
print_info "Checking for any remaining processes on ports 3000 and 4000..."

# Kill processes on port 3000 (frontend)
FRONTEND_PROCS=$(lsof -ti:3000 2>/dev/null || true)
if [ -n "$FRONTEND_PROCS" ]; then
    echo "$FRONTEND_PROCS" | xargs kill -9 2>/dev/null || true
    print_status "Killed remaining processes on port 3000"
fi

# Kill processes on port 4000 (backend)
BACKEND_PROCS=$(lsof -ti:4000 2>/dev/null || true)
if [ -n "$BACKEND_PROCS" ]; then
    echo "$BACKEND_PROCS" | xargs kill -9 2>/dev/null || true
    print_status "Killed remaining processes on port 4000"
fi

# Clean up any Node.js processes with our project name
print_info "Cleaning up any remaining Node.js processes..."
pkill -f "node.*beatlenuts" 2>/dev/null || true
pkill -f "next.*dev" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true

print_status "Server cleanup complete!"
echo
print_info "Log files preserved:"
echo "• backend.log"
echo "• frontend.log"
echo
print_info "To restart servers, run: ./local-testing.sh"