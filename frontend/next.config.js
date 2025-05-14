/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure images to work properly
  images: {
    domains: [
      'localhost', 
      'beatlenut-trails.com', 
      'picsum.photos', 
      'randomuser.me',
      'sample-videos.com',
      'example.com',
      'placehold.it',
      'placekitten.com',
      'place-hold.it',
      'placeimg.com',
      'ui-avatars.com',
      'source.unsplash.com'
    ],
  },
  // You might need to disable strict mode temporarily for image loading
  // reactStrictMode: false,

  // For Docker deployment
  output: 'standalone',
}

module.exports = nextConfig