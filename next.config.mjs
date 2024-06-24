/** @type {import('next').NextConfig} */
const nextConfig = {
    logging: { // 로깅 설정
        fetches: {
            fullUrl: true,
        }
    },
    experimental: { // 보안 설정
        taint: true,
    },
    images: {
        remotePatterns: [
            {
                hostname: "avatars.githubusercontent.com"
            },
            {
                hostname: "imagedelivery.net",
            }
        ]
    }
};

export default nextConfig;
