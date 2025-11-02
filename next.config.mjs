/** @type {import('next').NextConfig} */
const nextConfig = {
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
                hostname: "img-s-msn-com.akamaized.net",
                port: "",
                pathname: "/**", // This allows any path under the hostname
            },
            {
                protocol: "https",
                hostname: "media.istockphoto.com",
            },
            {
                protocol: "https",
                hostname: "cdn.citymapia.com",
            },
            {
                protocol: "https",
                hostname: "media.istockphoto.com",
            },
        ],
    },
};

export default nextConfig;
