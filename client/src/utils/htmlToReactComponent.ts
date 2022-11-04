import parse from 'html-react-parser';

export const htmlToReactComponent = (html: string) => {
  // Convert newlines to breaks to be properly parsed
  // return parse(html.replaceAll('\n', '<br />'));
  return parse(html);
};
