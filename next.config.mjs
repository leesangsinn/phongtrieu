/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // archiver (xuất ZIP mã QR) có package.json "exports" mà webpack của Next 14 không bundle được -> chạy như module Node ngoài
    serverComponentsExternalPackages: ["archiver"],
  },
  async redirects() {
    return [
      { source: "/phan-phoi", destination: "/dai-ly", permanent: true },
      { source: "/verify/:codeId", destination: "/xac-thuc/:codeId", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
