/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["knex"],
      images: {
  remotePatterns: [
    { protocol: "https", hostname: "res.cloudinary.com" },
    { protocol: "https", hostname: "picsum.photos" },
    { protocol: "https", hostname: "fastly.picsum.photos" },
  ],
},
experimental: {
  serverActions: {
    bodySizeLimit: "100mb", //  coloquei um limite meio alto, cpa mudo dps

    },
  },
};

export default nextConfig;
