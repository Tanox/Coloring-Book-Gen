import { readFileSync } from 'node:fs';

// 构建期注入：版本号取自 package.json 单一来源，build 编号为 10 位本地时间戳 yymmddhhmm
const { version } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
);

const pad = (value) => String(value).padStart(2, '0');
const now = new Date();
const buildId = [
  pad(now.getFullYear() % 100),
  pad(now.getMonth() + 1),
  pad(now.getDate()),
  pad(now.getHours()),
  pad(now.getMinutes()),
].join('');

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_BUILD_ID: buildId,
  },
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
