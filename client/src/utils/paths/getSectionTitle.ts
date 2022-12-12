import { isNavigation, Navigation } from '@/types/config';

import { isEqualIgnoringLeadingSlash } from './leadingSlashHelpers';

export function getSectionTitle(currentPath: string, groups: Navigation[]) {
  if (!Array.isArray(groups) || groups.length === 0) {
    return '';
  }

  for (const groupOrPage of groups) {
    if (isNavigation(groupOrPage)) {
      const title = findSectionTitleRecursively(groupOrPage, currentPath);
      // Only return if the title is a non-empty string
      if (title) {
        return title;
      }
    }
  }

  // No matches were found
  return '';
}

function findSectionTitleRecursively(navEntry: Navigation, currentPath: string): string {
  for (const groupOrPage of navEntry.pages) {
    if (isNavigation(groupOrPage)) {
      const title = findSectionTitleRecursively(groupOrPage, currentPath);
      if (title) {
        return title;
      }
    } else if (isEqualIgnoringLeadingSlash(groupOrPage, currentPath)) {
      return navEntry.group;
    }
  }
  return '';
}
