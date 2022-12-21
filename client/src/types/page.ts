import type { Config } from '@/types/config';
import { FaviconsProps } from '@/types/favicons';
import { Groups, PageMetaTags } from '@/types/metadata';
import { OpenApiFile } from '@/types/openApi';

export interface PageProps {
  mdxSource: string;
  pageData: PageDataProps;
  favicons: FaviconsProps;
  subdomain: string;
}

export interface PageDataProps {
  navWithMetadata: Groups;
  pageMetadata: PageMetaTags;
  title: string;
  mintConfig: Config;
  openApiFiles?: OpenApiFile[];
}
