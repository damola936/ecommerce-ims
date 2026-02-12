import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    experimental: {
        serverActions: {
            bodySizeLimit: "3mb",
        }
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ypjexftlpalftacyzodv.supabase.co"
            }
        ]
    }
};

export default nextConfig;
