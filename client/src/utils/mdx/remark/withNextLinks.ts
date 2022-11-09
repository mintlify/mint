import isAbsoluteUrl from 'is-absolute-url';
import type { Root } from 'mdast';
import { map } from 'unist-util-map';

// This is a regular function with a single param for options,
// but we are unwrapping the parameter to get basePath directly.
const withNextLinks = ({ basePath }: { basePath: string }) => {
  return (tree: Root) => {
    return map(tree, (node: any) => {
      if (node.type === 'link') {
        // next/link is only used for internal links
        const { url, children } = node;
        if (isAbsoluteUrl(node.url)) {
          return {
            type: 'mdxJsxFlowElement',
            name: 'a',
            attributes: [
              {
                type: 'mdxJsxAttribute',
                name: 'href',
                value: url,
              },
              {
                type: 'mdxJsxAttribute',
                name: 'target',
                value: '_blank',
              },
              {
                type: 'mdxJsxAttribute',
                name: 'rel',
                value: 'noopener',
              },
            ],
            children: [
              {
                type: 'mdxJsxFlowElement',
                name: 'a',
                children,
              },
            ],
          };
        } else {
          return {
            type: 'mdxJsxFlowElement',
            name: 'Link',
            attributes: [
              {
                type: 'mdxJsxAttribute',
                name: 'href',
                value: basePath + url,
              },
              {
                type: 'mdxJsxAttribute',
                name: 'passHref',
                value: null,
              },
            ],
            children: [
              {
                type: 'mdxJsxFlowElement',
                name: 'a',
                children,
              },
            ],
          };
        }
      }
      return node;
    });
  };
};

export default withNextLinks;
