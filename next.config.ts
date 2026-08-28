import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // The dev image-optimizer worker (sharp/jest-worker) crashes on some large
    // uploads and, once it hits the retry limit, breaks ALL image requests until
    // restart. Serve originals directly to avoid the crash entirely.
    unoptimized: true,
    remotePatterns: [
      // Supabase Storage public bucket (adjust project ref when set)
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  // Allow dev resources (HMR, fonts, RSC) when reached through a tunnel/proxy.
  allowedDevOrigins: ["*.trycloudflare.com"],
  // Dev memory. A dev server left running all day kept growing until its
  // jest-worker children crashed ("Jest worker encountered 2 child process
  // exceptions"), after which every route 500s until restart. Dispose compiled
  // pages sooner so the footprint stops climbing with each page visited.
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 3,
  },
  experimental: {
    // Allow Server Actions when reached through a tunnel/proxy (e.g. trycloudflare),
    // where the request Origin differs from the localhost Host.
    serverActions: {
      allowedOrigins: ["localhost:3001", "*.trycloudflare.com"],
    },
    // Don't preload every page's modules at startup — pay per page instead of
    // holding the whole app in memory from the first second.
    preloadEntriesOnStart: false,
  },
};

export default withNextIntl(nextConfig);
