/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "easy-lms.t3.storage.dev",
        port: "",
        pathname: "/**",
        protocol: "https",
      },
      //google
      {
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
