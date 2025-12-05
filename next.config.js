/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ['@aws-sdk/client-ivs', '@aws-sdk/client-dynamodb', '@aws-sdk/lib-dynamodb'],
};

module.exports = nextConfig;
