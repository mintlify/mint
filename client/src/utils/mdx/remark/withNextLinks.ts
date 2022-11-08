import type { Root } from 'mdast';
import { map } from 'unist-util-map';

const isAbsoluteUrl = (str: string) => /^[a-z][a-z0-9+.-]*:/.test(str);

const withNextLinks = () => {
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
                value: url,
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
