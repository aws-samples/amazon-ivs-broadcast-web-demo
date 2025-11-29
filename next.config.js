/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['@aws-sdk/client-ivs', '@aws-sdk/client-dynamodb', '@aws-sdk/lib-dynamodb'],
};

module.exports = nextConfig;
