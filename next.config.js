/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',  // Static HTML export
  images: {
    unoptimized: true, // Needed for static export
  },
  // Ensure trailing slashes are used
  trailingSlash: true,
};

module.exports = nextConfig;
