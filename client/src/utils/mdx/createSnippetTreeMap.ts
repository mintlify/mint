import type { Root } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { mdxFromMarkdown } from 'mdast-util-mdx';
import { gfm } from 'micromark-extension-gfm';
import { mdxjs } from 'micromark-extension-mdxjs';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';

import { Snippet } from '@/types/snippet';

import remarkMdxInjectSnippets from './remark/remarkMdxInjectSnippets';

type SnippetWithNumSnippets = Snippet & {
  numSnippetsInContent: number;
};

const createSnippetTreeMap = async (snippets: Snippet[]) => {
  if (snippets.length === 0) {
    return {};
  }
  const orderedSnippets = orderSnippetsByNumberOfSnippetsInContent(snippets);
  let treeMap: Record<string, Root> = {};

  // If the lowest number of references is greater than 0, then there will be cyclical references that will never resolve.
  // In these cases we do not try to replace snippets in snippets
  // TODO: Better error handling for cyclical references
  if (orderedSnippets[0].numSnippetsInContent === 0) {
    orderedSnippets.forEach((snippet) => {
      treeMap = addSnippetTreeToMap(snippet, treeMap);
    });
    return treeMap;
  }
  let prevNumSnippets = 0;
  let failedParseArr: SnippetWithNumSnippets[] = [];
  orderedSnippets.forEach(async (snippet, i) => {
    if (snippet.numSnippetsInContent === 0) {
      // No need to remove references if none exist
      treeMap = addSnippetTreeToMap(snippet, treeMap);
    }
    if (snippet.numSnippetsInContent > prevNumSnippets && failedParseArr.length > 0) {
      // If we've moved on to the next level try resolving failedParses
      let prevArrLength = failedParseArr.length + 1;
      // We try to resolve the failed snippets which likely failed because it was referencing
      // another snippet that has not been resolved yet.
      // We loop while snippets continue to be resolved.
      while (prevArrLength > failedParseArr.length && prevArrLength !== 0) {
        const newlyParsedSnippets: SnippetWithNumSnippets[] = [];
        for (let i = 0; i < failedParseArr.length; i++) {
          try {
            treeMap = await addParsedSnippetTreeToMap(failedParseArr[i], treeMap);
            newlyParsedSnippets.push(failedParseArr[i]);
          } catch {}
        }
        prevArrLength = failedParseArr.length;
        failedParseArr = failedParseArr.filter((elem) => !newlyParsedSnippets.includes(elem));
      }
    }
    try {
      treeMap = await addParsedSnippetTreeToMap(snippet, treeMap);
    } catch {
      // TODO - find exact error message for when inner snippet doesn't exist
      failedParseArr.push(snippet);
    }
    prevNumSnippets = snippet.numSnippetsInContent;
  });
  return treeMap;
};

const addSnippetTreeToMap = (snippet: Snippet, map: Record<string, Root>): Record<string, Root> => {
  try {
    const tree = fromMarkdown(snippet.content, {
      extensions: [gfm(), mdxjs()],
      mdastExtensions: [gfmFromMarkdown(), mdxFromMarkdown()],
    });
    map = {
      ...map,
      [snippet.snippetFileLocation]: tree,
    };
  } catch {
    // TODO: Better error handling
  }
  return map;
};

const addParsedSnippetTreeToMap = async (
  snippet: SnippetWithNumSnippets,
  treeMap: Record<string, Root>
): Promise<Record<string, Root>> => {
  const parsedContent = await preparseSnippet(snippet, treeMap);
  return addSnippetTreeToMap(
    {
      ...snippet,
      content: parsedContent,
    },
    treeMap
  );
};

/*
 * We order the snippets by increasing number of references to other snippets in an attempt to avoid
 * trying to parse a snippet that references another snippet that has not been resolved yet.
 */
const orderSnippetsByNumberOfSnippetsInContent = (
  snippets: Snippet[]
): SnippetWithNumSnippets[] => {
  const snippetsWithNumSnippets: SnippetWithNumSnippets[] = snippets.map((snippet) => {
    return {
      ...snippet,
      // Note: It's possible the regex might not be enough
      numSnippetsInContent: (snippet.content.match(/<Snippet/g) || []).length,
    };
  });
  snippetsWithNumSnippets.sort(function (first, second) {
    return first.numSnippetsInContent - second.numSnippetsInContent;
  });
  return snippetsWithNumSnippets;
};

const preparseSnippet = async (
  snippet: SnippetWithNumSnippets,
  snippetTreeMap: Record<string, Root>
) => {
  const file = await remark()
    .use(remarkMdx)
    .use(remarkGfm)
    .use([remarkMdxInjectSnippets, snippetTreeMap])
    .process(snippet.content);
  return String(file);
};

export default createSnippetTreeMap;
