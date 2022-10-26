import type { Root } from 'mdast';
import visit from 'unist-util-visit';

const isAbsoluteUrl = (str: string) => /^[a-z][a-z0-9+.-]*:/.test(str);

const withNextLinks = () => {
  return (tree: Root) => {
    visit(tree, 'link', (node: any) => {
      const attributes = isAbsoluteUrl(node.url)
        ? {
            type: 'mdxJsxAttribute',
            name: 'target',
            value: '_blank',
          }
        : {};
      const { url, children } = node;
      node = {
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
            ...attributes,
            type: 'mdxJsxFlowElement',
            name: 'a',
            children,
          },
        ],
      };
    });
  };
};

export default withNextLinks;
