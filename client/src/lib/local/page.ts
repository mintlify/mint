import type { Config } from '@/types/config';
import { Groups, PageMetaTags, findPageInGroup } from '@/types/metadata';
import { prepareToSerialize } from '@/utils/staticProps/prepareToSerialize';

import {
  getPagePath,
  getFileContents,
  getPrebuiltData,
  confirmFaviconsWereGenerated,
} from './utils';

// Try catches are purposefully empty because it isn't the end
// of the world if some of these prebuilt variables are not existent.
// We just fall back to the empty value, but we will want to do
// better error handling.
export const getPageProps = async (slug: string) => {
  let navWithMetadata: Groups = [];
  try {
    navWithMetadata = await getPrebuiltData('generatedNav');
  } catch {}
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
  const favicons =
    mintConfig?.favicon && (await confirmFaviconsWereGenerated())
      ? {
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
        }
      : undefined;
  let openApiFiles = [];
  try {
    openApiFiles = await getPrebuiltData('openApiFiles');
  } catch {}

  return {
    content,
    pageData: prepareToSerialize({ mintConfig, navWithMetadata, openApiFiles, pageMetadata }),
    favicons,
  };
};
