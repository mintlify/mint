import { Config } from '@/types/config';
import { Group, isGroup, GroupPage } from '@/types/metadata';

import { optionallyRemoveLeadingSlash } from './leadingSlashHelpers';
import { getVersionOfPage } from './nav';

/**
 * Assumes page hrefs in navWithPageContext have a leading / but config page paths do not.
 * Outputted dictionary will NOT have a leading / in the dictionary keys.
 */
export function pathToVersionDict(navWithPageContext: Group[], config: Config) {
  // Used to filter search results to pages in the current version
  if (!Array.isArray(navWithPageContext)) {
    return {};
  }

  let versionDict = {};

  for (const group of navWithPageContext) {
    if (Array.isArray(group.pages) && group.pages.length > 0) {
      versionDict = {
        ...versionDict,
        ...recursivePathToVersionDict(group.pages, config),
      };
    }
  }

  return versionDict;
}

function recursivePathToVersionDict(navWithPageContext: GroupPage[], config: Config) {
  let versionDict = {};
  navWithPageContext.forEach((page) => {
    if (isGroup(page)) {
      if (Array.isArray(page.pages) && page.pages.length === 0) {
        versionDict = {
          ...versionDict,
          ...recursivePathToVersionDict(page.pages, config),
        };
      }
    } else if (page.href) {
      versionDict = {
        ...versionDict,
        [optionallyRemoveLeadingSlash(page.href)]:
          page.version ??
          getVersionOfPage(config.navigation ?? [], config.anchors ?? [], page.href),
      };
    }
  });
  return versionDict;
}
