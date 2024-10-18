/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.fallback = {
          tiktoken: false,
          "tiktoken-node": false,
        };
    
        return config;
      },
};

export default nextConfig;
