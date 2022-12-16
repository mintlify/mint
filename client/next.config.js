import BundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
  swcMinify: true,
  optimizeFonts: false, // Required so Next Font works on Vercel
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx', 'md'],
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
    disableStaticImages: true,
  },
  staticPageGenerationTimeout: 1000,
  experimental: {
    largePageDataBytes: 128 * 10000, // 1280KB instead of the default 128Kb
  },
  basePath: process.env.BASE_PATH,
  async redirects() {
    return process.env.BASE_PATH
      ? [
          {
            source: '/',
            destination: process.env.BASE_PATH,
            basePath: false, // you can't write '/' as the source if you auto-prefix the base path to it
            permanent: true,
          },
        ]
      : [];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp|avif|mp4)$/i,
      issuer: /\.(jsx?|tsx?|mdx?)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next',
            name: 'static/media/[name].[hash].[ext]',
          },
        },
      ],
    });

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: { svgoConfig: { plugins: { removeViewBox: false } } },
        },
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next',
            name: 'static/media/[name].[hash].[ext]',
          },
        },
      ],
    });
    return config;
  },
});
