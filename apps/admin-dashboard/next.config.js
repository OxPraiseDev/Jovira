/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    API_URL: process.env.API_URL || 'http://localhost:3000',
  },
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;