import type { Root } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { mdxFromMarkdown } from 'mdast-util-mdx';
import { gfm } from 'micromark-extension-gfm';
import { mdxjs } from 'micromark-extension-mdxjs';

import { Snippet } from '@/types/snippet';

const createSnippetTreeMap = (snippets: Snippet[]) => {
  const orderedSnippets = orderSnippetsByNumberOfSnippetsInContent(snippets);
  let treeMap: Record<string, Root> = {};
  orderedSnippets.forEach((snippet) => {
    try {
      const tree = fromMarkdown(snippet.content, {
        extensions: [gfm(), mdxjs()],
        mdastExtensions: [gfmFromMarkdown(), mdxFromMarkdown()],
      });
      treeMap = {
        ...treeMap,
        [snippet.snippetFileLocation]: tree,
      };
    } catch {}
  });
  return treeMap;
};

const orderSnippetsByNumberOfSnippetsInContent = (snippets: Snippet[]) => {
  snippets.sort(function (first, second) {
    const firstNumSnippets = (first.content.match(/<Snippet/g) || []).length;
    const secondNumSnippets = (second.content.match(/<Snippet/g) || []).length;
    return firstNumSnippets - secondNumSnippets;
  });
  return snippets;
};

export default createSnippetTreeMap;
