/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // CV uploads go through server actions; the bucket allows 5 MB, plus form overhead.
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
};

export default nextConfig;
