import { withSentryConfig } from '@sentry/nextjs';
import withLinkRoles from './rehype/withLinkRoles.js';
import { createLoader } from 'simple-functional-loader';
import frontMatter from 'front-matter';
import withSmartypants from 'remark-smartypants';
import withTableOfContents from './remark/withTableOfContents.js';
import withCodeBlocks from './rehype/withCodeBlocks.js';
import withNextLinks from './remark/withNextLinks.js';
import withFrames from './remark/withFrames.js';
import withImportsInjected from './remark/withImportsInjected.js';
import BundleAnalyzer from '@next/bundle-analyzer';
import remarkGfm from 'remark-gfm';
import withStaticProps from './rehype/withStaticProps.js';
import withApiComponents from './rehype/withApiComponents.js';
import mintConfig from './src/config.json' assert { type: 'json' };
import withSyntaxHighlighting from './rehype/withSyntaxHighlighting.js';

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
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
    images: {
      disableStaticImages: true,
    },
    basePath: mintConfig?.basePath,
    webpack(config, options) {
      config.module.rules.push({
        test: /\.(png|jpe?g|gif|webp|avif|mp4)$/i,
        issuer: /\.(jsx?|tsx?|mdx)$/,
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

      config.module.rules.push({
        test: { and: [/\.mdx$/, /snippets/] },
        use: [
          options.defaultLoaders.babel,
          {
            loader: '@mdx-js/loader',
            options: {
              providerImportSource: '@mdx-js/react',
              remarkPlugins: [
                remarkGfm,
                withImportsInjected,
                withFrames,
                withNextLinks,
                withSmartypants,
              ],
              rehypePlugins: [
                [
                  withSyntaxHighlighting,
                  {
                    ignoreMissing: true,
                  },
                ],
                withCodeBlocks,
                withLinkRoles,
              ],
            },
          },
        ],
      });

      config.module.rules.push({
        test: { and: [/\.mdx$/], not: [/snippets/] },
        use: [
          options.defaultLoaders.babel,
          {
            loader: '@mdx-js/loader',
            options: {
              providerImportSource: '@mdx-js/react',
              remarkPlugins: [
                remarkGfm,
                withImportsInjected,
                withFrames,
                withTableOfContents,
                withNextLinks,
                withSmartypants,
              ],
              rehypePlugins: [
                [
                  withSyntaxHighlighting,
                  {
                    ignoreMissing: true,
                  },
                ],
                withCodeBlocks,
                withLinkRoles,
                withApiComponents,
                [
                  withStaticProps,
                  `{
                    isMdx: true
                  }`,
                ],
              ],
            },
          },
          createLoader(function (source) {
            const { body } = frontMatter(source);

            let extra = [];

            if (!/^\s*export\s+default\s+/m.test(source.replace(/```(.*?)```/gs, ''))) {
              extra.push(
                `import { ContentsLayout as _Default } from '@/layouts/ContentsLayout'`,
                `export default (props) => <_Default {...props} tableOfContents={tableOfContents} apiComponents={apiComponents}>{props.children}</_Default>`
              );
            }

            return [
              ...extra,
              body.replace(/<!--excerpt-->.*<!--\/excerpt-->/s, '')
            ]
              .filter(Boolean)
              .join('\n\n');
          }),
        ],
      });
      return config;
    },
  }),
  sentryWebpackPluginOptions
);
