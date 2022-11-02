import type { Root } from 'mdast';
import { remove } from 'unist-util-remove';

// TODO - remove this once we migrate to mdx-bundler
const withRemoveImports = () => {
  return (tree: Root) => {
    remove(
      tree,
      (node: any) => node.type === 'mdxjsEsm' && node?.value && node?.value.startsWith('import')
    );
    return tree;
  };
};

export default withRemoveImports;
