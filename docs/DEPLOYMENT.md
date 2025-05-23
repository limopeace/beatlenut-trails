# Deployment Guide for BeatlenutTrails

This document outlines the process for deploying the BeatlenutTrails website to Vercel.

## Prerequisites

- A Vercel account
- Access to the BeatlenutTrails GitHub repository
- Node.js and npm installed on your local machine

## Configuration Files

The repository already includes the necessary configuration files for Vercel deployment:

1. `vercel.json` - Contains Vercel-specific configuration settings
2. `next.config.js` - Contains Next.js configuration

## Environment Variables

The following environment variables need to be set in your Vercel project:

- `NODE_ENV` - Set to "production" for production deployment
- `API_BASE_URL` - The base URL for API requests
- `NEXT_PUBLIC_API_URL` - Publicly accessible API URL for client-side requests
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `INSTAGRAM_ACCESS_TOKEN` - For Instagram feed integration
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - For maps integration

## Deployment Steps

### Option 1: Deploying via Vercel Dashboard

1. Log in to your Vercel account
2. Click "New Project"
3. Import the BeatlenutTrails GitHub repository
4. Configure the environment variables as listed above
5. Click "Deploy"

### Option 2: Deploying via Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel from the CLI:
   ```bash
   vercel login
   ```

3. Navigate to the project root and run:
   ```bash
   vercel
   ```

4. Follow the CLI prompts to configure your project
5. To deploy to production, run:
   ```bash
   vercel --prod
   ```

## Monorepo Deployment Configuration

BeatlenutTrails is structured as a monorepo with separate frontend and backend code. The `vercel.json` file is configured to handle this structure correctly:

- Frontend (Next.js) is deployed as the main site
- Backend (Express) is deployed as serverless functions

## Post-Deployment Verification

After deployment, verify the following:

1. The homepage loads correctly
2. Navigation links work properly
3. Images and media assets load
4. ESM portal login functionality works
5. Authentication flow completes successfully
6. Product and service listings display correctly
7. Forms submit data correctly
8. Responsive design functions across device sizes

## Troubleshooting

Common issues and solutions:

- **API Connection Errors**: Verify environment variables for API_BASE_URL are correctly set
- **Missing Environment Variables**: Check Vercel project settings to ensure all variables are defined
- **Build Failures**: Check the Vercel build logs for specific errors
- **Image Loading Issues**: Verify that image domains are correctly configured in next.config.js
- **Serverless Function Timeouts**: Consider optimizing heavy backend operations

## Continuous Deployment

The repository is configured for continuous deployment:

1. When changes are pushed to the main branch, Vercel automatically rebuilds and deploys
2. Preview deployments are created for pull requests
3. Environment variables are preserved between deployments

## Rollback Process

If issues are found after deployment:

1. Navigate to the Vercel dashboard
2. Select your project
3. Go to the "Deployments" tab
4. Find a previous working deployment
5. Click the three dots (⋯) and select "Promote to Production"

## Performance Monitoring

After deployment, use Vercel Analytics to monitor:

- Page load times
- API response times
- Core Web Vitals
- User session information

## Security Considerations

The deployment includes security headers configured in vercel.json:

- Content Security Policy
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Permissions-Policy

Review these settings periodically to maintain security best practices.