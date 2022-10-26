import visit from 'unist-util-visit';

const withListRoles = () => {
  return (tree) => {
    visit(tree, 'element', (element) => {
      if (['ol', 'ul'].includes(element.tagName)) {
        element.properties.role = 'list';
      }
    });
  };
};

export default withListRoles;
