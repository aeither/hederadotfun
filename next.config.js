/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      http2: false,
      dns: false,
      tty: false,
      'perf_hooks': false,
      'node:crypto': false,
      'node:fs': false,
      'node:net': false,
      'node:http2': false,
      'node:dns': false,
      'node:tty': false,
      'node:perf_hooks': false,
    };
    return config;
  },
}

module.exports = nextConfig;
