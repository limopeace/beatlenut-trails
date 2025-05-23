#!/bin/bash

# Script to copy assets from the backend to the frontend

# Create necessary directories
mkdir -p public/images/svg
mkdir -p public/videos
mkdir -p public/fonts/Clash-Display

# Copy SVG files from backend
cp -v ../src/images/mountain-*.svg public/images/svg/

echo "Assets copied successfully!"
echo ""
echo "IMPORTANT: Remember to:"
echo "1. Download and add Clash Display font files to public/fonts/Clash-Display/"
echo "2. Add a video file at public/videos/northeast-india-travel.mp4"

# Make the script executable
chmod +x copy-assets.sh