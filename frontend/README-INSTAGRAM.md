# Instagram Integration for Beatlenut Trails

This guide explains how to set up the Instagram feed integration for the Beatlenut Trails website.

## Implementation Overview

The Beatlenut Trails website now includes an Instagram feed integration using InstafeedJS, which displays photos from the @beatlenut_trails Instagram account on the homepage.

## Features

- Display Instagram photos in a responsive grid layout
- Link directly to original posts on Instagram
- Show photo captions and likes count
- Hover effects with animations
- Automatic refresh when new content is posted
- Mobile-friendly design

## Setup Instructions

### 1. Install the Dependency

The InstafeedJS library is already installed. If you need to reinstall it:

```bash
cd frontend
npm install instafeed.js@^2.0.0 --save
```

### 2. Getting an Instagram Access Token

1. Follow the detailed instructions in `INSTAGRAM_INTEGRATION.md` to:
   - Create a Facebook App
   - Configure Instagram Basic Display API
   - Add your Instagram account as a test user
   - Generate an access token

### 3. Configure the Component

In `src/app/page.tsx`, replace the placeholder token:

```tsx
<InstagramFeed accessToken="YOUR_INSTAGRAM_ACCESS_TOKEN" />
```

With your actual Instagram access token:

```tsx
<InstagramFeed accessToken="IGQWRPdGFMLTJjaGpkZAGdSNnB5cDBrOHVYRElhMVVrbEhSQVlmQ0RLd01aYnhVR1hYZAEl3NVJWNEJmWnM3cDVZAU19fRTFzemlxcGF..." />
```

## Component Configuration Options

The `InstagramFeed` component accepts several props:

- `accessToken` (required): Your Instagram access token
- `limit` (optional): Number of photos to display (default: 8)
- `className` (optional): Additional CSS classes for custom styling

Example with all options:

```tsx
<InstagramFeed 
  accessToken="YOUR_TOKEN" 
  limit={12} 
  className="my-custom-class" 
/>
```

## Styling

The Instagram feed styling is included in `src/styles/globals.css`. You can customize the appearance by:

1. Modifying the CSS in `globals.css`
2. Updating the template in `InstagramFeed.tsx`

## Troubleshooting

- If images don't load, check your Instagram access token and console errors
- If the layout doesn't look right, ensure the CSS is loading properly
- For CORS issues, you may need to implement a proxy server

## Production Considerations

1. **Token Security**: Never commit your Instagram access token to the repository. Consider using environment variables for production.

2. **Token Refreshing**: Instagram access tokens expire after 60 days. Implement a token refresh solution for production.

3. **Caching**: To avoid hitting API rate limits, consider implementing server-side caching.

## Resources

- [InstafeedJS Documentation](https://github.com/stevenschobert/instafeed.js)
- [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api)
- Detailed setup instructions in `INSTAGRAM_INTEGRATION.md`