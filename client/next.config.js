import BundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';

const withBundleAnalyzer = BundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const sentryWebpackPluginOptions = {
  // Suppresses all logs
  silent: true,

  // Disable sentry builds when we don't have a sentry auth token.
  // Sites have to be manually added to our Sentry tracking so by default
  // new customers' sites will not have an auth token set.
  dryRun: process.env.VERCEL_ENV !== 'production' || !process.env.SENTRY_AUTH_TOKEN,
};

export default withSentryConfig(
  withBundleAnalyzer({
    swcMinify: true,
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx', 'md'],
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'mintlify.s3-us-west-1.amazonaws.com',
          port: '',
          pathname: '**',
        },
      ],
      disableStaticImages: true,
    },
    staticPageGenerationTimeout: 1000,
    experimental: {
      largePageDataBytes: 128 * 10000, // 1280KB instead of the default 128Kb
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
  }),
  sentryWebpackPluginOptions
);
