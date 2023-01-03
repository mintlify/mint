import { PageMetaTags } from '@/types/metadata';

import { slugToTitle } from './titleText/slugToTitle';

// Everything here gets injected as metatags when available.
const SEO_META_TAGS = [
  'og:site_name',
  'og:title',
  'og:description',
  'og:url',
  'og:image',
  'og:locale',
  'article:publisher',
  'twitter:title',
  'twitter:description',
  'twitter:url',
  'twitter:image',
  'twitter:site',
  'og:image:width',
  'og:image:height',
];

export function getAllMetaTags(pageMeta: PageMetaTags, configMetadata: { [key: string]: any }) {
  const allMeta = {
    charset: 'utf-8',
    'og:type': 'website',
    'og:title': defaultTitle(pageMeta, configMetadata.name),
    'twitter:title': defaultTitle(pageMeta, configMetadata.name),
    'og:description': pageMeta.description,
  } as { [key: string]: any };
  SEO_META_TAGS.forEach((tagName) => {
    const metaValue = pageMeta[tagName] ?? configMetadata[tagName];
    if (metaValue) {
      allMeta[tagName] = metaValue;
    }
  });
  return allMeta;
}

function defaultTitle(pageMeta: PageMetaTags, siteName: string) {
  const title = pageMeta.sidebarTitle || pageMeta.title || slugToTitle(pageMeta.href || '');
  if (title && siteName) {
    return title + ' - ' + siteName;
  } else if (siteName) {
    return siteName;
  }
  return title;
}
