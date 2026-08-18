/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "form-action 'self' https://www.paypal.com https://www.sandbox.paypal.com https://www.paypal.com/cgi-bin/webscr",
      "frame-ancestors 'none'",
      "img-src 'self' blob: data: https://*.paypal.com https://*.paypalobjects.com",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.paypal.com https://*.paypalobjects.com https://www.paypal.com/sdk/js",
      "style-src 'self' 'unsafe-inline' https://*.paypal.com https://*.paypalobjects.com",
      "font-src 'self' data: https://*.paypal.com https://*.paypalobjects.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.paypal.com https://*.paypalobjects.com https://api.sandbox.paypal.com https://www.paypal.com https://*.paypal.com/v2",
      "frame-src 'self' https://*.paypal.com https://*.paypalobjects.com https://www.sandbox.paypal.com https://www.paypal.com",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "media-src 'self' blob:",
    ].join('; '),
  },
]

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.paypalobjects.com',
      },
      {
        protocol: 'https',
        hostname: 'www.paypal.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig