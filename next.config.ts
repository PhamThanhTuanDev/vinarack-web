import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com', // <--- Đã thêm dòng này để fix lỗi
      },
      // Sau này nếu bạn up ảnh lên hosting thật (ví dụ: vinarack.vn), 
      // hãy nhớ thêm domain đó vào đây nhé.
    ],
  },
};

export default nextConfig;