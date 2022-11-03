import type { Root } from 'mdast';
import { map } from 'unist-util-map';

import { allowedComponents } from '@/components/index';

const withRemoveUnknownJsx = () => {
  return (tree: Root) => {
    const newTree = map(tree, (node: any) => {
      if (node.type === 'mdxJsxFlowElement' && !allowedComponents.includes(node.name)) {
        const comment = ` Component ${node.name} does not exist. `;
        return {
          type: 'mdxFlowExpression',
          value: `/* ${comment} */`,
          data: {
            estree: {
              type: 'Program',
              body: [],
              comments: [
                {
                  type: 'Block',
                  value: comment,
                },
              ],
              sourceType: 'module',
            },
          },
        };
      }
      return node;
    });
    return newTree;
  };
};

export default withRemoveUnknownJsx;
