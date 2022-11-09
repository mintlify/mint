import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import withSmartypants from 'remark-smartypants';

import withApiComponents from './rehype/withApiComponents.js';
import withCodeBlocks from './rehype/withCodeBlocks.js';
import withLayouts from './rehype/withLayouts.js';
import withListRoles from './rehype/withListRoles.js';
import withRawComponents from './rehype/withRawComponents.js';
import withSyntaxHighlighting from './rehype/withSyntaxHighlighting.js';
import withFrames from './remark/withFrames.js';
import withNextLinks from './remark/withNextLinks';
import withRemoveImports from './remark/withRemoveImports';
import withRemoveJavascript from './remark/withRemoveJavascript';
import withRemoveUnknownJsx from './remark/withRemoveUnknownJsx';
import withTableOfContents from './remark/withTableOfContents.js';

const getMdxSource = async (
  pageContents: string,
  basePath: string,
  data: Record<string, unknown>
) => {
  // Guarantee basePath has a slash at the start
  if (!basePath.startsWith('/')) {
    basePath = '/' + basePath;
  }

  return serialize(pageContents, {
    scope: data,
    mdxOptions: {
      remarkPlugins: [
        remarkGfm,
        withRemoveJavascript,
        withRemoveUnknownJsx,
        withFrames,
        withTableOfContents,
        withSmartypants,
        [withNextLinks, { basePath }],
        withRemoveImports,
      ],
      rehypePlugins: [
        [
          withSyntaxHighlighting,
          {
            ignoreMissing: true, // Ignore errors when on language is found
          },
        ],
        withCodeBlocks,
        withListRoles,
        withApiComponents,
        withRawComponents,
        withLayouts,
      ],
      format: 'mdx',
      useDynamicImport: true,
    },
    parseFrontmatter: true,
  });
};

export default getMdxSource;
