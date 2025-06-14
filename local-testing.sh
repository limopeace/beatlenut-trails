#!/bin/bash

# Beatlenuts-GR Local Testing Script
# This script helps set up and test the project locally

set -e

echo "🚀 Starting Beatlenuts-GR Local Testing Setup"
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

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -f "CLAUDE.md" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_info "Project root directory confirmed"

# Step 1: Environment Setup
echo -e "\n${BLUE}Step 1: Environment Setup${NC}"
echo "========================="

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_status "Created .env file from .env.example"
        print_warning "Please update .env file with your configuration values"
    else
        print_error ".env.example file not found"
        exit 1
    fi
else
    print_status ".env file already exists"
fi

# Step 2: Install Dependencies
echo -e "\n${BLUE}Step 2: Installing Dependencies${NC}"
echo "================================"

# Backend dependencies
print_info "Installing backend dependencies..."
if npm install; then
    print_status "Backend dependencies installed successfully"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Frontend dependencies
print_info "Installing frontend dependencies..."
cd frontend
if npm install; then
    print_status "Frontend dependencies installed successfully"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi
cd ..

# Step 3: Start Backend Server
echo -e "\n${BLUE}Step 3: Starting Backend Server${NC}"
echo "================================"

print_info "Starting backend server on port 4000..."
print_warning "Backend server will run in the background"

# Start backend server in background
npm run dev > backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Check if backend started successfully
if ps -p $BACKEND_PID > /dev/null; then
    print_status "Backend server started successfully (PID: $BACKEND_PID)"
    print_info "Backend logs: tail -f backend.log"
else
    print_error "Failed to start backend server"
    print_info "Check backend.log for errors"
    exit 1
fi

# Step 4: Start Frontend Server
echo -e "\n${BLUE}Step 4: Starting Frontend Server${NC}"
echo "================================="

print_info "Starting frontend server on port 3000..."
cd frontend

# Start frontend server in background
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 5

# Check if frontend started successfully
if ps -p $FRONTEND_PID > /dev/null; then
    print_status "Frontend server started successfully (PID: $FRONTEND_PID)"
    print_info "Frontend logs: tail -f frontend.log"
else
    print_error "Failed to start frontend server"
    print_info "Check frontend.log for errors"
    # Clean up backend process
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

cd ..

# Step 5: Testing Instructions
echo -e "\n${GREEN}🎉 Setup Complete!${NC}"
echo "=================="
echo
echo "Your application is now running:"
echo "• Frontend: http://localhost:3000"
echo "• Backend API: http://localhost:4000"
echo "• Backend Health Check: http://localhost:4000/health"
echo
echo "Process IDs:"
echo "• Backend PID: $BACKEND_PID"
echo "• Frontend PID: $FRONTEND_PID"
echo
echo "To stop the servers:"
echo "• kill $BACKEND_PID $FRONTEND_PID"
echo "• Or use: ./stop-servers.sh"
echo
echo "Log files:"
echo "• Backend: backend.log"
echo "• Frontend: frontend.log"
echo
echo "Useful testing commands:"
echo "• Test backend health: curl http://localhost:4000/health"
echo "• Test API endpoints: curl http://localhost:4000/api/examples"
echo "• View logs: tail -f backend.log frontend.log"
echo
print_info "Happy testing! 🚀"

# Save PIDs for cleanup script
echo "$BACKEND_PID" > .backend.pid
echo "$FRONTEND_PID" > .frontend.pid