/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["knex"],
  experimental: {
    serverActions: {
      // permite uploads maiores que o padrão de 1MB
      bodySizeLimit: "100mb", // coloquei um limite meio alto, mas só pra teste mesmo, cpa mudo dps
    },
  },
};

export default nextConfig;
