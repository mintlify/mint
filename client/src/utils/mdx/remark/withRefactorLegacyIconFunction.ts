import type { Root } from 'mdast';
import visit from 'unist-util-visit';

// TODO - remove this once we deprecate legacy format i.e. icon("house")
const withRefactorLegacyIconFunction = () => {
  return (tree: Root) => {
    visit(
      tree,
      ['mdxJsxFlowElement', (node: any) => node.name === 'Card' || node.name === 'Accordion'],
      (node: any) => {
        if (!node?.attributes) return;
        const iconValue = node.attributes.find((attr: any) => attr.name === 'icon')?.value?.value;
        if (!iconValue) return;
        const insideParenthesesRegex = /(regular|solid|light|thin|duotone|brands)\(([^)]+)\)/;
        const insideQuotesMatches = insideParenthesesRegex.exec(iconValue);
        const iconType = iconValue.substring(0, iconValue.indexOf('('));
        if (!insideQuotesMatches || typeof iconType === 'undefined') return;
        const iconStr = insideQuotesMatches[2].slice(1, -1);
        const iconAttrIndex = node.attributes.findIndex((attr: any) => attr.name === 'icon');
        node.attributes[iconAttrIndex].value = iconStr;
        node.attributes.push({
          name: 'iconType',
          type: 'mdxJsxAttribute',
          value: iconType,
        });
      }
    );
    return tree;
  };
};

export default withRefactorLegacyIconFunction;
