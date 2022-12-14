import { useContext } from 'react';

import { ConfigContext } from '@/context/ConfigContext';
import { PageMetaTags, GroupPage, isGroup, flattenGroupPages } from '@/types/metadata';

import { useCurrentPath } from './useCurrentPath';

const getFirstNonGroupPage = (groupPage?: GroupPage): PageMetaTags | null => {
  if (groupPage == null) {
    return null;
  }

  if (isGroup(groupPage)) {
    return getFirstNonGroupPage(groupPage.pages[0]);
  }

  return groupPage;
};

export function usePrevNext() {
  let currentPath = useCurrentPath();
  let { navWithMetadata } = useContext(ConfigContext);
  if (!navWithMetadata || !Array.isArray(navWithMetadata)) {
    return { prev: undefined, next: undefined };
  }

  let pages: PageMetaTags[] = navWithMetadata.reduce(
    (acc: PageMetaTags[], currentGroup: { pages: PageMetaTags[] }) => {
      return acc.concat(...flattenGroupPages(currentGroup.pages));
    },
    []
  );

  let pageIndex = pages.findIndex((page) => page?.href === currentPath);
  return {
    prev: pageIndex > -1 ? getFirstNonGroupPage(pages[pageIndex - 1]) : undefined,
    next: pageIndex > -1 ? getFirstNonGroupPage(pages[pageIndex + 1]) : undefined,
  };
}
