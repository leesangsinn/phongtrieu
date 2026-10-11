/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Tab "Phân phối" đã đổi thành "Đại lý"
    return [{ source: "/phan-phoi", destination: "/dai-ly", permanent: true }];
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
