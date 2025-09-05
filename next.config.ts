import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurazione base per il deploy
  output: 'standalone',
  
  // DISABILITA PREFETCH per evitare CORS con Auth0
  experimental: {
    optimizePackageImports: []
  },
  
  // Disabilita prefetch su tutti i Link components
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
