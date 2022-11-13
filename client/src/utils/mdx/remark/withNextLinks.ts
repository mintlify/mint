import isAbsoluteUrl from 'is-absolute-url';
import type { Root } from 'mdast';

import { addDefaultImport } from './utils';

const withNextLinks = () => {
  return (tree: Root) => {
    const component = addDefaultImport(tree, 'next/link', 'Link');

    function walk(root: any) {
      if (!root.children) return;
      let i = 0;
      while (i < root.children.length) {
        let node = root.children[i];
        if (node.type === 'link') {
          if (!isAbsoluteUrl(node.url)) {
            root.children = [
              ...root.children.slice(0, i),
              { type: 'jsx', value: `<${component} href="${node.url}" passHref><a>` },
              ...node.children,
              { type: 'jsx', value: `</a></${component}>` },
              ...root.children.slice(i + 1),
            ];
            i += node.children.length + 2;
          } else {
            root.children = [
              ...root.children.slice(0, i),
              { type: 'jsx', value: `<a href="${node.url}" target="_blank" rel="noreferrer">` },
              ...node.children,
              { type: 'jsx', value: `</a>` },
              ...root.children.slice(i + 1),
            ];
          }
        } else {
          i += 1;
        }
        walk(node);
      }
    }
    walk(tree);
  };
};

export default withNextLinks;
