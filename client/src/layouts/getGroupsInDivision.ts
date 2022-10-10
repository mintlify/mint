import { Group, Groups, GroupPage, isGroup } from '@/metadata';

export function getGroupsInDivision(nav: Groups, divisionUrls: string[]) {
  return nav.filter((group: Group) => isGroupInDivision(group, divisionUrls));
}

export function getGroupsNotInDivision(nav: Groups, divisionUrls: string[]) {
  return nav.filter((group: Group) => !isGroupInDivision(group, divisionUrls));
}

function isGroupInDivision(group: Group, divisionUrls: string[]) {
  return group.pages.some((page) => divisionUrls.some((url) => isGroupPageInDivision(page, url)));
}

function isGroupPageInDivision(page: GroupPage, divisionUrl: string): boolean {
  if (isGroup(page)) {
    return isGroupInDivision(page, [divisionUrl]);
  }

  if (page?.href == null) {
    return false;
  }

  return page.href.startsWith(`/${divisionUrl}/`);
}
