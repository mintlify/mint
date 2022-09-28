import navJSON from './nav.json';

export const documentationNav: Groups = navJSON;
export const nonMetaTags = ['api', 'openapi', 'sidebarTitle'];

export type PageContext = {
  title?: string;
  sidebarTitle?: string;
  description?: string;
  api?: string;
  openapi?: string;
  href?: string;
};

export type Groups = Group[];

export type Group = {
  group: string;
  pages: GroupPage[];
};

export type GroupPage = PageContext | Group;

export const isGroup = (group: GroupPage): group is Group => {
  // Used in if-statements to case GroupPage into either PageContext or Group
  // The return type "group is Group" is the cast
  return group && group.hasOwnProperty('group') && group.hasOwnProperty('pages');
};

export const findPageInGroup = (
  group: Group,
  targetHref: string
): { group: string; page: PageContext } | undefined => {
  const { pages } = group;
  let target = undefined;
  pages.forEach((page) => {
    const actualPage = page as PageContext;
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

export const flattenGroupPages = (groupPages: GroupPage[]): PageContext[] => {
  return groupPages.flatMap((groupPage) => {
    if (isGroup(groupPage)) {
      return flattenGroupPages(groupPage.pages);
    }
    return groupPage;
  });
};
