import { fromHtml } from 'hast-util-from-html';
import visit from 'unist-util-visit';

const withRawComponents = () => {
  return (tree) => {
    visit(tree, 'raw', (raw, i, parent) => {
      const rawAst = fromHtml(raw.value, { fragment: true });
      parent.children[i] = rawAst;
    });
  };
};

export default withRawComponents;
