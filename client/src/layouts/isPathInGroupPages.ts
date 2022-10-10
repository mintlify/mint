import { GroupPage, isGroup } from '@/metadata';

export default function isPathInGroupPages(pathname: string, groupPages: GroupPage[]): boolean {
  return groupPages.some((groupPage) => {
    if (isGroup(groupPage)) {
      return isPathInGroupPages(pathname, groupPage.pages);
    }
    return groupPage.href === pathname;
  });
}
