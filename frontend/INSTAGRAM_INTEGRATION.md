# Instagram Feed Integration Guide

This document explains how to integrate your Instagram feed with Beatlenut Trails website using InstafeedJS.

## Overview

We've implemented an Instagram feed on the website using [InstafeedJS](https://instafeedjs.com/) (v2.0.0), which allows you to display your Instagram photos directly on your website. This integration requires an Instagram access token for authentication.

## Setting Up Instagram Access Token

Follow these steps to obtain an Instagram access token:

### 1. Create a Facebook App

1. Go to [Facebook for Developers](https://developers.facebook.com/) and log in with your Facebook account
2. Click on "My Apps" in the top-right corner
3. Click "Create App"
4. Select "Consumer" as the app type
5. Fill in your app details and create the app

### 2. Configure Instagram Basic Display

1. In your app dashboard, add the "Instagram Basic Display" product
2. Under "Instagram Basic Display" → "Basic Display", configure your app:
   - Add your website URL in the "Valid OAuth Redirect URIs" field
   - Add your website's Privacy Policy URL and Terms of Service URL
   - Save changes

### 3. Add an Instagram Test User

1. Go to "Roles" → "Test Users"
2. Click "Add Instagram Testers" 
3. Enter your Instagram account username and submit
4. Log in to your Instagram account and go to your profile settings
5. Navigate to "Apps and Websites" → "Tester Invites"
6. Accept the invitation from your Facebook app

### 4. Generate Access Token

1. Go back to the "Instagram Basic Display" → "Basic Display" section
2. Under "User Token Generator", you should see your Instagram account
3. Click "Generate Token"
4. Authorize your app when prompted
5. Copy the generated access token

### 5. Configure Token in the Website

Replace the placeholder token in the code with your actual token:

```tsx
// In src/app/page.tsx
<InstagramFeed accessToken="YOUR_INSTAGRAM_ACCESS_TOKEN" />
```

## Important Notes

1. **Token Expiration**: The access token is valid for 60 days. You'll need to refresh it before it expires.

2. **Long-lived Token**: You can exchange your short-lived token for a long-lived token (valid for 60 days) using the [Token Exchange API](https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens).

3. **Token Refresh**: For production, consider implementing a server-side token refresh mechanism to automatically refresh the token before it expires.

4. **Usage Limits**: Be aware of Instagram API rate limits. The Basic Display API has limitations on the number of requests you can make.

5. **Content Display**: The Instagram Basic Display API only allows you to display content from the Instagram account that generated the token. You cannot display content from other Instagram accounts unless they generate tokens for your app.

## Customization

You can customize the Instagram feed appearance by modifying the `InstagramFeed.tsx` component:

- **Number of Photos**: Adjust the `limit` prop to show more or fewer photos
- **Layout**: Modify the grid layout in the component's CSS
- **Appearance**: Update the template string in the Instafeed configuration to change how each post appears

### Custom CSS

For additional styling, you can add these CSS rules to your global CSS file:

```css
/* Instagram feed styling */
.instagram-feed-section {
  padding: 4rem 1rem;
  background: linear-gradient(to bottom, #fff, #f7f7f7);
}

.instagram-container {
  max-width: 1200px;
  margin: 0 auto;
}

.instagram-item {
  position: relative;
  display: block;
  overflow: hidden;
  aspect-ratio: 1/1;
  border-radius: 0.5rem;
}

.instagram-overlay {
  transition: opacity 0.3s ease;
}

@media (max-width: 640px) {
  .instagram-container .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
}
```

## Troubleshooting

If your Instagram feed is not loading:

1. **Check Token**: Verify that your access token is valid and not expired
2. **Check Console**: Look for errors in the browser console
3. **CORS Issues**: If you're experiencing CORS issues, you might need a proxy server
4. **API Changes**: Instagram occasionally updates their API, check the [InstafeedJS GitHub](https://github.com/stevenschobert/instafeed.js) for updates

## Resources

- [InstafeedJS Documentation](https://github.com/stevenschobert/instafeed.js#readme)
- [Instagram Basic Display API Documentation](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Facebook for Developers](https://developers.facebook.com/)