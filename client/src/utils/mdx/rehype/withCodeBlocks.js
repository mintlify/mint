import visit from 'unist-util-visit';

const withCodeBlocks = () => {
  return (tree) => {
    let preTree = { children: [] };

    visit(tree, 'element', (node, i, parent) => {
      if (node?.tagName !== 'pre') return node;
      if (node?.children && node?.children[0]?.tagName !== 'code') return node;
      const code = node.children[0];

      let filename = undefined;
      if (['RequestExample', 'ResponseExample'].includes(parent.name)) {
        const parentType = parent.name.slice(0, -7);
        filename = i === 0 ? parentType : `${parentType} ${i + 1}`;
        if (node.children[0]?.data?.meta) {
          node.children[0].data.meta = filename;
        }
      }

      if (code.data?.meta) {
        filename = code.data.meta;
      }

      const wrap = {
        type: 'mdxJsxFlowElement',
        name: 'CodeBlock',
        attributes: [{ type: 'mdxJsxAttribute', name: 'filename', value: filename ?? '' }],
        data: { _mdxExplicitJsx: true },
      };
      wrap.children = [node];
      parent.children[i] = wrap;
    });
    tree.children = [...preTree.children, ...tree.children];
  };
};

export default withCodeBlocks;
