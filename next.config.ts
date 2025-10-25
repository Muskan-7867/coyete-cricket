import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   cacheComponents: true,
    images: {
      domains: ["images.unsplash.com", "res.cloudinary.com", "images.augustman.com"]
    },

  }


export default nextConfig;
