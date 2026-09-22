import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
  },
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
    /*! SIMPLIFIED START */
    remotePatterns: [],
    /*! SIMPLIFIED END */
  },
  turbopack: {
    resolveAlias: {
      fs: { browser: './lib/browser-polyfill.js' },
      path: { browser: './lib/browser-polyfill.js' },
      os: { browser: './lib/browser-polyfill.js' },
      net: { browser: './lib/browser-polyfill.js' },
      tls: { browser: './lib/browser-polyfill.js' },
      zlib: { browser: './lib/browser-polyfill.js' },
      child_process: { browser: './lib/browser-polyfill.js' },
      stream: { browser: 'stream-browserify' },
      buffer: { browser: 'buffer' },
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        net: false,
        tls: false,
        zlib: false,
        child_process: false,
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
      };
    }
    return config;
  },
  async headers() {
    const commonSecurityHeaders = [
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-XSS-Protection', value: '0' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
    ];

    /*! SIMPLIFIED START */
    const defaultCsp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' blob: https://challenges.cloudflare.com https://www.gstatic.com https://cdn.babylonjs.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://challenges.cloudflare.com",
      "img-src 'self' data: https: blob: https://i.imgur.com https://*.vercel.app https://bloxdhub.com",
      "font-src 'self' data: https://fonts.gstatic.com https://fonts.googleapis.com",
      "connect-src 'self' blob: https://openrouter.ai https://challenges.cloudflare.com https://bloxdhub.com https://www.gstatic.com https://cdn.babylonjs.com",
      "worker-src 'self' blob: data:",
      "child-src 'self' blob:",
      "frame-src 'self' https://bloxd.io https://*.bloxd.io https://challenges.cloudflare.com https://web.blockbench.net",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');
    /*! SIMPLIFIED END */
    /*! SIMPLIFIED START */
    const monacoCsp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob: https://challenges.cloudflare.com https://www.gstatic.com https://cdn.babylonjs.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://challenges.cloudflare.com",
      "img-src 'self' data: https: blob: https://i.imgur.com https://*.vercel.app https://bloxdhub.com",
      "font-src 'self' data: https://fonts.gstatic.com https://fonts.googleapis.com",
      "connect-src 'self' blob: https://openrouter.ai https://challenges.cloudflare.com https://bloxdhub.com https://www.gstatic.com https://cdn.babylonjs.com",
      "worker-src 'self' blob: data:",
      "child-src 'self' blob:",
      "frame-src 'self' https://bloxd.io https://*.bloxd.io https://challenges.cloudflare.com https://web.blockbench.net",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');
    /*! SIMPLIFIED END */
    return [
      {
        source: '/studio/creator/:path*',
        headers: [
          ...commonSecurityHeaders,
          { key: 'Content-Security-Policy', value: monacoCsp },
        ],
      },
      {
        source: '/studio/world-tools/:path*',
        headers: [
          ...commonSecurityHeaders,
          { key: 'Content-Security-Policy', value: monacoCsp },
        ],
      },
      {
        source: '/:path*',
        headers: [
          ...commonSecurityHeaders,
          { key: 'Content-Security-Policy', value: defaultCsp },
        ],
      },
      {
        source: '/:path*(.svg|.png|.jpg|.jpeg|.gif|.ico|.css|.js|.woff|.woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'CDN-Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'bloxdforge.com',
          },
        ],
        destination: 'https://www.bloxdforge.com/:path*',
        permanent: true,
      },
      { source: '/app', destination: '/studio', permanent: true },
      { source: '/mobile', destination: '/studio', permanent: true },
      { source: '/app/assets/:path*', destination: '/studio/workshop', permanent: true },
      { source: '/market/:path*', destination: '/studio/workshop', permanent: true },
      { source: '/tpack/:path*', destination: '/studio/workshop', permanent: true },
      { source: '/:path*{/}?.html', destination: '/studio', permanent: true },
    ];
  },
  async rewrites() {
    return [
      { source: '/vb', destination: '/vb/index.html' },
      { source: '/vb/', destination: '/vb/index.html' },
    ];
  },
};

export default nextConfig;
