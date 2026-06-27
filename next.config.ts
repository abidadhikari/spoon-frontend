import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // async rewrites() {
  //   return [
  //     {
  //       source: "/my/:path*",
  //       destination: `${process.env.BACKEND_URL}/v1/:path*`,
  //     },
  //   ];
  // },
};

export default nextConfig;
