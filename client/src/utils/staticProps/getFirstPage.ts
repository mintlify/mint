import { GroupPage, Groups, PageMetaTags, isPage, isGroup } from '@/types/metadata';

export const getFirstPage = (navWithMetadata: Groups): PageMetaTags => {
  let firstPage: PageMetaTags = {};
  navWithMetadata.every((navEntry) => {
    const page = findFirstNavigationEntry(navEntry);
    if (page) {
      firstPage = page;
      return false;
    }
    return true;
  });
  return firstPage;
};

const findFirstNavigationEntry = (entry: GroupPage): PageMetaTags | undefined => {
  if (isPage(entry)) {
    return entry;
  }

  if (!Array.isArray(entry.pages) || entry.pages.length === 0) {
    return undefined;
  }

  // Recursively search for the first page
  for (const subEntry of entry.pages) {
    if (isGroup(subEntry)) {
      const first = findFirstNavigationEntry(subEntry);
      if (first) {
        return first;
      }
    } else if (isPage(subEntry)) {
      return subEntry;
    }
  }

  return undefined;
};
