/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["knex"],
  experimental: {
    serverActions: {
      // permite uploads maiores que o padrão de 1MB
      bodySizeLimit: "100mb", // coloquei um limite meio alto, mas só pra teste mesmo, cpa mudo dps
    

      images: {
  remotePatterns: [
    { protocol: "https", hostname: "res.cloudinary.com" },
    { protocol: "https", hostname: "picsum.photos" },
    { protocol: "https", hostname: "fastly.picsum.photos" },
  ],
},

    },
  },
};

export default nextConfig;
