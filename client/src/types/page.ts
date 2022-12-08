import { Groups, PageMetaTags } from './metadata';

export interface PageProps {
  stringifiedMdxSource: string;
  stringifiedData: string;
  stringifiedFavicons: string;
  subdomain?: string;
}

export interface ParsedDataProps {
  nav: Groups;
  meta: PageMetaTags;
  section: string | undefined;
  metaTagsForSeo: PageMetaTags;
  stringifiedConfig: string;
  stringifiedOpenApi?: string;
}
