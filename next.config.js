/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['t.me', 'img.youtube.com', 'i.ytimg.com', 'instagram.com', 'www.instagram.com'],
  },
  // Supabase requires this for real-time features
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  }
}

module.exports = nextConfig