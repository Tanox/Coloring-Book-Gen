/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Next.js injects a small inline bootstrap script in production.
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              // AI providers (client-side calls) + base64/blob images.
              "img-src 'self' data: blob: https://generativelanguage.googleapis.com https://api.openai.com https://api.deepseek.com https://api.anthropic.com https://dashscope.aliyuncs.com https://ark.cn-beijing.volcengine.com",
              "connect-src 'self' https://generativelanguage.googleapis.com https://api.openai.com https://api.deepseek.com https://api.anthropic.com https://dashscope.aliyuncs.com https://ark.cn-beijing.volcengine.com",
            ].join('; '),
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
