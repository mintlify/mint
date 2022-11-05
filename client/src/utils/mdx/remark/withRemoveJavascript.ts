import type { Root } from 'mdast';
import { remove } from 'unist-util-remove';

const withRemoveJavascript = () => {
  return (tree: Root) => {
    remove(tree, 'mdxTextExpression');
    return tree;
  };
};

export default withRemoveJavascript;
