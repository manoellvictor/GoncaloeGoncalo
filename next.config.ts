import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    // Imagens de artigos e equipe ficam no Supabase Storage; o host vem da env
    // para não fixar o ref do projeto no código.
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    formats: ["image/avif", "image/webp"],
  },
  redirects() {
    return [
      // Área retirada do site; links antigos caem na lista de áreas.
      {
        source: "/areas-de-atuacao/direito-previdenciario",
        destination: "/areas-de-atuacao",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
