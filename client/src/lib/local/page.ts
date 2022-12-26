import type { Config } from '@/types/config';
import { FaviconsProps } from '@/types/favicons';
import { Groups, PageMetaTags, findPageInGroup } from '@/types/metadata';
import { OpenApiFile } from '@/types/openApi';
import { prepareToSerialize } from '@/utils/staticProps/prepareToSerialize';

import {
  getPagePath,
  getFileContents,
  getPrebuiltData,
  confirmFaviconsWereGenerated,
} from './utils';

/**
 * @returns All props needed for getStaticProps | Only navWithMetadata if page is not found
 */
export const getPageProps = async (
  slug: string
): Promise<
  | {
      navWithMetadata: Groups;
    }
  | { notFound: boolean }
  | {
      content: string;
      pageData: {
        mintConfig: Config;
        navWithMetadata: Groups;
        openApiFiles: OpenApiFile[];
        pageMetadata: PageMetaTags;
      };
      favicons?: FaviconsProps;
    }
> => {
  let navWithMetadata: Groups = [];
  try {
    navWithMetadata = await getPrebuiltData('generatedNav');
  } catch {
    // Try catches are purposefully empty because it isn't the end
    // of the world if some of these prebuilt variables are not existent.
    // We just fall back to the empty value, but we will want to do
    // better error handling.
  }
  const pagePath = await getPagePath(slug);
  let content = '';
  if (pagePath) {
    content = await getFileContents(pagePath);
  } else {
    // redirect
    return { navWithMetadata };
  }
  let pageMetadata: PageMetaTags = {};
  navWithMetadata.forEach((group) => {
    const foundPage = findPageInGroup(group, pagePath);
    if (foundPage) {
      pageMetadata = foundPage.page;
      return false;
    }
    return true;
  });
  let mintConfig: Config = { name: '' };
  try {
    mintConfig = await getPrebuiltData('mint');
  } catch {
    return {
      notFound: true,
    };
  }
  const favicons: FaviconsProps | undefined =
    mintConfig?.favicon && (await confirmFaviconsWereGenerated()) ? defaultFavicons : undefined;
  let openApiFiles: OpenApiFile[] = [];
  try {
    openApiFiles = await getPrebuiltData('openApiFiles');
  } catch {}

  return {
    content,
    pageData: prepareToSerialize({ mintConfig, navWithMetadata, openApiFiles, pageMetadata }),
    favicons,
  };
};

const defaultFavicons: FaviconsProps = {
  icons: [
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/favicons/apple-touch-icon.png',
      type: 'image/png',
    },
    {
      rel: 'icon',
      sizes: '32x32',
      href: '/favicons/favicon-32x32.png',
      type: 'image/png',
    },
    {
      rel: 'icon',
      sizes: '16x16',
      href: '/favicons/favicon-16x16.png',
      type: 'image/png',
    },
    {
      rel: 'shortcut icon',
      href: '/favicons/favicon.ico',
      type: 'image/x-icon',
    },
  ],
  browserconfig: '/favicons/browserconfig.xml',
};
