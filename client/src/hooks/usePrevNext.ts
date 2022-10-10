import { useRouter } from 'next/router';
import { useContext } from 'react';

import { SidebarContext } from '@/layouts/SidebarLayout';
import { PageContext, GroupPage, isGroup, flattenGroupPages } from '@/metadata';

const getFirstNonGroupPage = (groupPage?: GroupPage): PageContext | null => {
  if (groupPage == null) {
    return null;
  }

  if (isGroup(groupPage)) {
    return getFirstNonGroupPage(groupPage.pages[0]);
  }

  return groupPage;
};

export function usePrevNext() {
  let router = useRouter();
  let { nav } = useContext(SidebarContext);
  let pages: PageContext[] = nav.reduce(
    (acc: PageContext[], currentGroup: { pages: PageContext[] }) => {
      return acc.concat(...flattenGroupPages(currentGroup.pages));
    },
    []
  );

  let pageIndex = pages.findIndex((page) => page?.href === router.pathname);
  return {
    prev: pageIndex > -1 ? getFirstNonGroupPage(pages[pageIndex - 1]) : undefined,
    next: pageIndex > -1 ? getFirstNonGroupPage(pages[pageIndex + 1]) : undefined,
  };
}
