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

export function isPathInGroupPages(pathname: string, groupPages: GroupPage[]): boolean {
  return groupPages.some((groupPage) => {
    if (isGroup(groupPage)) {
      return isPathInGroupPages(pathname, groupPage.pages);
    }
    return groupPage.href === pathname;
  });
}

export function getGroupsInVersion(nav: Groups, version: string): Groups {
  // Sites without versions default to an empty string
  if (!version) {
    return nav;
  }

  return nav.map((entry) => getInVersion(entry, version)).filter(Boolean) as Groups;
}

// Recursive helper to see if a single group should be displayed.
function getInVersion(entry: GroupPage, version: string): GroupPage | undefined {
  if (entry.version && entry.version !== version) {
    return undefined;
  }

  // Either there is no version or the version matched,
  // check everything below the group recursively.
  if (isGroup(entry) && entry.pages.length > 0) {
    return {
      ...entry,
      pages: entry.pages
        .map((subEntry) => getInVersion(subEntry, version))
        .filter(Boolean) as GroupPage[],
    };
  }

  return entry;
}
