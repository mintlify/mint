import { parse } from 'acorn';

const withStaticProps = (map) => {
  return function transformer(tree) {
    tree.children.push({
      type: 'mdxjsEsm',
      data: {
        estree: parse(
          `
          export const getStaticProps = async () => {
            return {
              props: ${map},
            }
          }`,
          {
            sourceType: 'module',
            ecmaVersion: 2020,
          }
        ),
      },
    });
  };
};

export default withStaticProps;
