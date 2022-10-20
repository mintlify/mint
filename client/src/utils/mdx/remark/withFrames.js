import { addImport, tomdxJsxFlowElement } from './utils.js';

const withFrames = () => {
  return (tree) => {
    let preTree = { children: [] };
    let componentName;

    tree.children = tree.children.map((node, index) => {
      // Start of horizontal block: -- block
      if (
        node.type === 'paragraph' &&
        node.children.length === 1 &&
        node.children[0].value === '-- block'
      ) {
        node.type = 'jsx';
        node.value = `<div className='grid md:grid-cols-2 md:gap-8'><div>`;
      }

      // Start a new column: -- column
      if (
        node.type === 'paragraph' &&
        node.children.length === 1 &&
        node.children[0].value === '-- column'
      ) {
        node.type = 'jsx';
        node.value = `</div><div>`;
      }

      // End of horizontal block: -- /block
      if (
        node.type === 'paragraph' &&
        node.children.length === 1 &&
        node.children[0].value === '-- /block'
      ) {
        node.type = 'jsx';
        node.value = `</div></div>`;
      }

      if (node.type === 'mdxJsxFlowElement' && (node.name === 'Example' || node.name === 'Frame')) {
        if (!componentName) {
          componentName = addImport(preTree, '@mintlify/components', 'Frame');
        }
        node.name = componentName;
      }
      if (node.type === 'jsx') {
        node = tomdxJsxFlowElement(node.value);
      }
      return node;
    });

    tree.children = [...preTree.children, ...tree.children];
  };
};

export default withFrames;
