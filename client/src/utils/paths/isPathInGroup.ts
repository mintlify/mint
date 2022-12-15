import { Group, isGroup } from '@/types/metadata';

export function isPathInGroup(path: string, group: Group): boolean {
  if (!path || !Array.isArray(group.pages)) {
    return false;
  }

  return group.pages.some((pageOrSubgroup) => {
    if (isGroup(pageOrSubgroup)) {
      return isPathInGroup(path, pageOrSubgroup);
    }
    return path === pageOrSubgroup.href;
  });
}
