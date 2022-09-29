import { getEsmNode } from '../remark/utils.js';

const withLayouts = () => {
  return (tree) => {
    const importNode = getEsmNode(
      `import { ContentsLayout as _Default } from '@/layouts/ContentsLayout'`
    );
    tree.children.unshift(importNode);
    tree.children.push({
      type: 'mdxjsEsm',
      value: `export default (props) => <_Default {...props} tableOfContents={tableOfContents} apiComponents={apiComponents}>{props.children}</_Default>`,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExportDefaultDeclaration',
              declaration: {
                type: 'ArrowFunctionExpression',
                async: false,
                expression: true,
                generator: false,
                id: null,
                body: {
                  type: 'JSXElement',
                  children: [
                    {
                      type: 'JSXExpressionContainer',
                      expression: {
                        type: 'MemberExpression',
                        computed: false,
                        optional: false,
                        object: {
                          name: 'props',
                          type: 'Identifier',
                        },
                        property: {
                          name: 'children',
                          type: 'Identifier',
                        },
                      },
                    },
                  ],
                  closingElement: {
                    type: 'JSXClosingElement',
                    name: {
                      type: 'JSXIdentifier',
                      name: '_Default',
                    },
                  },
                  openingElement: {
                    type: 'JSXOpeningElement',
                    selfClosing: false,
                    name: {
                      type: 'JSXIdentifier',
                      name: '_Default',
                    },
                    attributes: [
                      {
                        type: 'JSXSpreadAttribute',
                        argument: {
                          type: 'Identifier',
                          name: 'props',
                        },
                      },
                      {
                        type: 'JSXAttribute',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'tableOfContents',
                        },
                        value: {
                          type: 'JSXExpressionContainer',
                          expression: {
                            type: 'Identifier',
                            name: 'tableOfContents',
                          },
                        },
                      },
                      {
                        type: 'JSXAttribute',
                        name: {
                          type: 'JSXIdentifier',
                          name: 'apiComponents',
                        },
                        value: {
                          type: 'JSXExpressionContainer',
                          expression: {
                            type: 'Identifier',
                            name: 'apiComponents',
                          },
                        },
                      },
                    ],
                  },
                },
                params: [
                  {
                    type: 'Identifier',
                    name: 'props',
                  },
                ],
              },
            },
          ],
        },
      },
    });
  };
};

export default withLayouts;
