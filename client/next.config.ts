import type { NextConfig } from "next";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Keep the OAuth2 flow on the frontend origin (localhost:3000) and proxy it
      // to the Spring backend so the browser never navigates to :8080.
      { source: "/oauth2/:path*", destination: `${apiBaseUrl}/oauth2/:path*` },
      { source: "/login/oauth2/:path*", destination: `${apiBaseUrl}/login/oauth2/:path*` },
    ];
  },
};

export default nextConfig;
