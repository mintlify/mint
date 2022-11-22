import { fromHtml } from 'hast-util-from-html';
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

      // Only add the CopyToClipboard if no filename is set
      // The CodeBlock component already adds a clipboard icon when filename is set.
      if (!filename || parent.name === 'CodeGroup') {
        const copyToClipboard = fromHtml(
          `<span class="copy-to-clipboard w-5 z-10 flex absolute right-5"><svg class="top-5 h-5 fill-slate-500 hover:fill-slate-300 cursor-pointer" viewBox="0 0 20 20"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg><div class="tooltip hidden absolute bottom-full left-1/2 mb-3.5 pb-1 -translate-x-1/2"><div class="relative bg-primary-dark text-white text-xs leading-6 font-medium px-1.5 rounded-lg" data-reach-alert="true"><span>Copied</span><svg aria-hidden="true" width="16" height="6" viewBox="0 0 16 6" class="text-primary-dark absolute top-full left-1/2 -mt-px -ml-2"><path fillRule="evenodd" clipRule="evenodd" d="M15 0H1V1.00366V1.00366V1.00371H1.01672C2.72058 1.0147 4.24225 2.74704 5.42685 4.72928C6.42941 6.40691 9.57154 6.4069 10.5741 4.72926C11.7587 2.74703 13.2803 1.0147 14.9841 1.00371H15V0Z" fill="currentColor"></path></svg></div></div></span>`,
          { fragment: true }
        );

        const prepend = (value, array) => {
          var newArray = array.slice();
          newArray.unshift(value);
          return newArray;
        };
        node.children = prepend(copyToClipboard, node.children);
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
