import type { NextConfig } from "next";

// Hosts (besides the server's own) allowed to invoke server actions.
// Next.js rejects form submissions whose `Origin` header doesn't match the
// host the server sees ("Invalid Server Actions request" — CSRF protection).
// Proxied setups (cloud previews, tunnels) rewrite the Host header and trip
// this check, so their browser-facing hosts must be listed here. Restart the
// dev server (or rebuild for production) after changing ALLOWED_ORIGINS.
const allowedOrigins =
  process.env.ALLOWED_ORIGINS?.split(",").map((s) => s.trim()) ?? [];

// GitHub Codespaces: the preview URL (<codespace>-<port>.app.github.dev)
// proxies to localhost and rewrites Host. Codespaces sets this env var
// inside every codespace, so allow its preview hosts automatically.
if (process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN) {
  allowedOrigins.push(
    `*.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`
  );
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins,
    },
  },
};

export default nextConfig;
