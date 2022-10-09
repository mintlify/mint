import { toHtml } from 'hast-util-to-html';
import { filter } from 'unist-util-filter';
import visit from 'unist-util-visit';

import { addExport } from '../remark/utils.js';

const langFilename = (className) => {
  switch (className) {
    case 'language-shell':
      return 'Bash';
    case 'language-json':
      return 'JSON';
    case 'language-js':
      return 'JavaScript';
    default:
      const language = className.substring(9);
      return language.charAt(0).toUpperCase() + language.slice(1);
  }
};
const withApiComponents = () => {
  return (tree) => {
    let apiComponents = [];
    visit(tree, 'mdxJsxFlowElement', (node, _, parent) => {
      if (['ResponseExample', 'RequestExample'].includes(node.name)) {
        // remove all jsx components to convert to html (removes <ResponseExample> and <Editor>)
        const children = node.children.map((child, i) => {
          const preComponent = child.children[0];
          const html = toHtml(preComponent);
          let filename =
            preComponent?.properties?.className?.length > 1
              ? langFilename(preComponent?.properties?.className[0])
              : '';
          if (child?.attributes && child.attributes.length > 0) {
            filename = child.attributes[0]?.value;
          }
          return {
            filename,
            html,
          };
        });
        apiComponents.push({
          type: node.name,
          children,
        });
      }

      if (parent.type === 'root' && (node.name === 'Param' || node.name === 'ParamField')) {
        apiComponents.push({
          type: 'ParamField',
          children: node.children,
          attributes: node.attributes,
        });
      }
    });
    addExport(tree, 'apiComponents', apiComponents);
    return filter(tree, (node) => !['ResponseExample', 'RequestExample'].includes(node.name));
  };
};

export default withApiComponents;
