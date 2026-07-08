import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Next.js rejects form submissions whose `Origin` header doesn't match
      // the host the server sees ("Invalid Server Actions request" — CSRF
      // protection). That happens when the app is opened through a proxy,
      // tunnel, or cloud preview URL that rewrites the Host header. Put the
      // browser-facing host(s) in ALLOWED_ORIGINS (comma-separated) to allow
      // them; leave it unset for plain localhost use. Restart the dev server
      // (or rebuild for production) after changing it.
      allowedOrigins:
        process.env.ALLOWED_ORIGINS?.split(",").map((s) => s.trim()) ?? [],
    },
  },
};

export default nextConfig;
