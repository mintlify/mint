import { useContext } from 'react';

import { SidebarContext } from '@/layouts/NavSidebar';
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
  let { nav } = useContext(SidebarContext);
  let pages: PageMetaTags[] = nav.reduce(
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
