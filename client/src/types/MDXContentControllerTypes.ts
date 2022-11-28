export type Meta = {
  title?: string;
  description?: string;
  sidebarTitle?: string;
  auth?: string;
  api?: string;
  openapi?: string;
  contentType?: string;
  version?: string;
  mode?: 'wide' | 'blog';
  // To be depreciated
  size?: 'wide';
};

export type MDXContentControllerProps = {
  children: any;
  meta: Meta;
  tableOfContents: any;
  section: string;
  apiComponents: any;
};
