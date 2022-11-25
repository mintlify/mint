import Prism from 'prismjs';
import 'prismjs/components/prism-json';

export const jsonSyntaxHighlight = (json: Object) => {
  return Prism.highlight(JSON.stringify(json, null, 2), Prism.languages.json, 'json');
};
