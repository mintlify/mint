import type { Root } from 'mdast';
import visit from 'unist-util-visit';

const withReplaceSnippets = (snippetTreeMap: Record<string, Root>) => {
  return (tree: Root) => {
    visit(tree, ['mdxJsxFlowElement', (node: any) => node.name === 'Snippet'], (node: any) => {
      if (!node?.attributes) return;
      const fileValue = node.attributes.find((attr: any) => attr.name === 'file')?.value?.value;
      if (!fileValue) return;
      const desiredSnippetTree = snippetTreeMap[fileValue];
      console.log({ node, desiredSnippetTree });
      node = desiredSnippetTree;
    });
  };
};

export default withReplaceSnippets;
