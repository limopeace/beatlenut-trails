/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configure images to work properly
  images: {
    domains: ['localhost', 'beatlenut-trails.com'],
  },
  // You might need to disable strict mode temporarily for image loading
  // reactStrictMode: false,
}

module.exports = nextConfig