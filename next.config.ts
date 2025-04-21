import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "image.buoncf.jp",
        port: "",
        pathname: "/**"
      },
    ],
  },
  env: {
    HOMEPAGE_URL_: "https://expo2025-seven.vercel.app/",
    HOMEPAGE_URL: "http://localhost:3000/",
    ftp_url: "https://image.buoncf.jp/expo/",
  }
};

export default nextConfig;
