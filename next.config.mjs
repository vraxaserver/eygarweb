/** @type {import('next').NextConfig} */
const nextConfig = {
    cacheComponents: true,
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "127.0.0.1",
                port: "8001",
                pathname: "/media/**",
            },
            {
                protocol: "https",
                hostname: "images.pexels.com",
                port: "",
                pathname: "/**", // This allows any path under the hostname
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                port: "",
                pathname: "/**", // This allows any path under the hostname
            },
            {
                protocol: "https",
                hostname: "example.com",
                port: "",
                pathname: "/**", // This allows any path under the hostname
            },
        ],
    },
};

export default nextConfig;
