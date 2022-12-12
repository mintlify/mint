export const META_TAGS_FOR_LAYOUT = [
  'api',
  'openapi',
  'sidebarTitle',
  'contentType',
  'href',
  'size',
  'auth',
];

export type PageMetaTags = {
  title?: string; // Can use slugToTitle(href) as a default when title is undefined
  sidebarTitle?: string;
  description?: string;
  api?: string;
  openapi?: string;
  contentType?: string;
  href?: string;
  auth?: string;
  size?: string;
  version?: string;
  mode?: string;
  authors?: any;
  lastUpdatedDate?: string;
  createdDate?: string;
  hideFooterPagination?: boolean;
  hideApiMarker?: boolean; // Undocumented
};

export type Groups = Group[];

export type Group = {
  group: string;
  version?: string;
  pages: GroupPage[];
};

export type GroupPage = PageMetaTags | Group;

export const isGroup = (group: GroupPage): group is Group => {
  // Used in if-statements to case GroupPage into either PageMetaTags or Group
  // The return type "group is Group" is the cast
  return group && group.hasOwnProperty('group') && group.hasOwnProperty('pages');
};

export const findPageInGroup = (
  group: Group,
  targetHref: string
): { group: string; page: PageMetaTags } | undefined => {
  const { pages } = group;
  let target = undefined;
  pages.forEach((page) => {
    const actualPage = page as PageMetaTags;
    const subGroup = page as Group;
    if (actualPage?.href === targetHref) {
      target = { group: group.group, page: actualPage };
    } else if (isGroup(subGroup)) {
      const resultInSubGroup = findPageInGroup(subGroup, targetHref);
      if (resultInSubGroup != null) {
        target = resultInSubGroup;
      }
    }
  });
  return target;
};

export const flattenGroupPages = (groupPages: GroupPage[]): PageMetaTags[] => {
  return groupPages.flatMap((groupPage) => {
    if (isGroup(groupPage)) {
      return flattenGroupPages(groupPage.pages);
    }
    return groupPage;
  });
};
