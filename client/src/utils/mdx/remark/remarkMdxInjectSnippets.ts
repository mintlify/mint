import type { Root } from 'mdast';
import { MdxJsxFlowElement, MdxJsxAttribute } from 'mdast-util-mdx-jsx';
import { removePosition } from 'unist-util-remove-position';
import visit, { SKIP } from 'unist-util-visit';

/**
 * @typedef {import('remark-mdx')}
 */

const remarkMdxInjectSnippets = (snippetTreeMap: Record<string, Root>) => {
  return (tree: Root, file: any) => {
    visit(tree, (node, index, parent) => {
      if (parent && index !== null && node.type === 'mdxJsxFlowElement') {
        const mdxJsxFlowElement = node as MdxJsxFlowElement;
        if (mdxJsxFlowElement.name === 'Snippet') {
          const fileAttr = mdxJsxFlowElement.attributes.find((attr) => {
            if (attr.type === 'mdxJsxAttribute') {
              const mdxJsxAttribute = attr as MdxJsxAttribute;
              return mdxJsxAttribute.name === 'file';
            }
            return false;
          });
          const name = fileAttr?.value;
          if (typeof name === 'string') {
            if (Object.hasOwn(snippetTreeMap, name)) {
              const fragment = removePosition(structuredClone(snippetTreeMap[name]));
              parent.children.splice(index, 1, ...fragment.children);
              return [SKIP, index];
            } else {
              file.message(
                'Cannot expand missing snippet `' + name + '`',
                node,
                'remark-mdx-inject-snippets'
              );
            }
          }
        }
      }
    });
  };
};

export default remarkMdxInjectSnippets;
