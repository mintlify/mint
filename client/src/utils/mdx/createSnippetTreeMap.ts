import type { Root } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { mdxFromMarkdown } from 'mdast-util-mdx';
import { mdxjs } from 'micromark-extension-mdxjs';

const createSnippetTreeMap = (snippets: Record<string, string>) => {
  let treeMap: Record<string, Root> = {};
  for (const property in snippets) {
    try {
      const tree = fromMarkdown(snippets[property], {
        extensions: [mdxjs()],
        mdastExtensions: [mdxFromMarkdown()],
      });
      treeMap = {
        ...treeMap,
        [property]: tree,
      };
    } catch {}
  }
  return treeMap;
};

export default createSnippetTreeMap;
