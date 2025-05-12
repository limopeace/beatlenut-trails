/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'beatlenut-trails.com'],
    unoptimized: true,
  },
  swcMinify: true,
}

module.exports = nextConfig