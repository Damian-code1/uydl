/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Esto evita que falle al recolectar datos de páginas estáticas
  output: 'standalone', 
};

export default nextConfig;