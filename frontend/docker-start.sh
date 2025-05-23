#!/bin/bash

# Build the Docker image
docker build -t beatlenut-trails-frontend .

# Run the container, exposing port 3000
docker run -p 3000:3000 beatlenut-trails-frontend