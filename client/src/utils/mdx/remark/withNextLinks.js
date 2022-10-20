import { tomdxJsxFlowElement } from './utils.js';

const isAbsoluteUrl = (str) => /^[a-z][a-z0-9+.-]*:/.test(str);

const withNextLinks = () => {
  return (tree) => {
    function walk(root) {
      if (!root.children) return;
      let i = 0;
      while (i < root.children.length) {
        let node = root.children[i];
        if (node.type === 'link' && isAbsoluteUrl(node.url)) {
          const link = `<Link href="${node.url}" passHref><a target="_blank">${node.children[0].value}</a></Link>`;
          root.children[i] = {
            ...root.children[i],
            ...tomdxJsxFlowElement(link),
            type: 'mdxJsxFlowElement',
          };
        } else if (node.type === 'link') {
          // Is relative url path
          const link = `<Link href="${node.url}" passHref><a>${node.children[0].value}</a></Link>`;
          root.children[i] = {
            ...root.children[i],
            ...tomdxJsxFlowElement(link),
            type: 'mdxJsxFlowElement',
          };
        }
        walk(root.children[i]);
        i += 1;
      }
    }
    walk(tree);
  };
};

export default withNextLinks;
