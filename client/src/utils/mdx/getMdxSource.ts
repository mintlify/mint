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
import withTableOfContents from './remark/withTableOfContents.js';

const getMdxSource = async (pageContents: string, data: Record<string, unknown>) => {
  return serialize(pageContents, {
    scope: data,
    mdxOptions: {
      remarkPlugins: [
        remarkGfm,
        withFrames,
        withTableOfContents,
        withSmartypants,
        withNextLinks,
        withRemoveImports,
      ],
      rehypePlugins: [
        [
          withSyntaxHighlighting,
          {
            ignoreMissing: true,
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
