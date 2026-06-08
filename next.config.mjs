/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["knex"],
  experimental: {
    serverActions: {
      // permite uploads maiores que o padrão de 1MB
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
