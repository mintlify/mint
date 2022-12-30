import type { Root } from 'mdast';
import visit from 'unist-util-visit';

const withReplaceSnippets = (snippetTreeMap: Record<string, Root>) => {
  return (tree: Root) => {
    visit(tree, ['mdxJsxFlowElement', (node: any) => node.name === 'Snippet'], (node: any) => {
      if (!node?.attributes) return;
      const fileValue = node.attributes.find((attr: any) => attr.name === 'file')?.value;
      if (!fileValue) return;
      const desiredSnippetTree = snippetTreeMap[fileValue];
      node.name = undefined;
      node.type = desiredSnippetTree.type;
      node.children = desiredSnippetTree.children;
    });
  };
};

export default withReplaceSnippets;
