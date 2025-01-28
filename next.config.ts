import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  reactStrictMode: true,
    transpilePackages: [
        '@react-three/drei',
		'@react-three/fiber',
		'@react-three/postprocessing'
    ],
};

export default nextConfig;
