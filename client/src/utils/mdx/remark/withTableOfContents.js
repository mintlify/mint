import slugify from '@sindresorhus/slugify';

import { addExport, createMdxJsxAttribute } from './utils.js';

const withTableOfContents = () => {
  return (tree) => {
    const contents = [];
    let hasTopLayer = false;
    for (let nodeIndex = 0; nodeIndex < tree.children.length; nodeIndex++) {
      let node = tree.children[nodeIndex];

      if (node.type === 'heading' && [1, 2, 3, 4].includes(node.depth)) {
        let level = node.depth;
        let title = node.children
          .filter(
            (node, i, a) =>
              (node.type === 'text' &&
                (a[i - 1]?.type !== 'mdxJsxFlowElement' ||
                  !a[i - 1]?.value.startsWith('<small'))) ||
              node.type === 'inlineCode'
          )
          .map((node) => node.value)
          .join('');
        let slug = slugify(title);

        // if a header with the exact same title shows up - make the slug unique
        let allOtherSlugs = contents.flatMap((entry) => [
          entry.slug,
          ...entry.children?.map(({ slug }) => slug),
        ]);
        let slugIndex = 1;
        while (allOtherSlugs.indexOf(slug) > -1) {
          slug = `${slugify(title)}-${slugIndex}`;
          slugIndex++;
        }

        let mdxJsxAttributes = [
          createMdxJsxAttribute('level', level),
          createMdxJsxAttribute('id', slug),
        ];

        if (tree.children[nodeIndex + 1]) {
          let { children, position, value, ...element } = tree.children[nodeIndex + 1];
          if (typeof element?.depth !== 'undefined') {
            mdxJsxAttributes.push(createMdxJsxAttribute('nextElementDepth', element.depth));
          }
        }

        node.attributes = mdxJsxAttributes;
        node.type = 'mdxJsxFlowElement';
        node.name = 'Heading';
        const depth = node.depth;
        if (level <= 2) {
          hasTopLayer = true;
          contents.push({ title, slug, depth, children: [] });
        } else {
          // Account if there is no first layer
          let arrToPushInto = contents;
          if (hasTopLayer) {
            arrToPushInto = contents[contents.length - 1].children;
          }
          arrToPushInto.push({ title, slug, depth, children: [] });
        }
      }
    }
    addExport(tree, 'tableOfContents', contents);
  };
};

export default withTableOfContents;
