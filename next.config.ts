import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Next 16 ativou essas features por padrão; desativamos para compatibilidade
  // com Supabase Auth (que usa Date.now()) e Server Components dinâmicos.
  cacheComponents: false,
  partialPrefetching: false,
} as NextConfig

export default nextConfig