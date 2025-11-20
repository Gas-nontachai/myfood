const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  transpilePackages: ['@myfood/shared-ui', '@myfood/shared-utils', '@myfood/shared-types'],
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_ADMIN_APP_URL
  }
};

export default nextConfig;
