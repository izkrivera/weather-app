/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: 'cdn.worldweatheronline.com',
      },
    ],
  },
}

module.exports = nextConfig
