export type Meta = {
  title?: string;
  description?: string;
  sidebarTitle?: string;
  auth?: string;
  api?: string;
  openapi?: string;
  contentType?: string;
  size?: 'wide';
  version?: string;
};

export type MDXContentControllerProps = {
  children: any;
  meta: Meta;
  tableOfContents: any;
  section: string;
  apiComponents: any;
};
