import { compareVersions } from 'compare-versions';

import { config } from '@/config';

const getAllPagesFromNavigation = (navigation: any): string[] => {
  if (typeof navigation === 'string') {
    return [navigation];
  }

  if (Array.isArray(navigation)) {
    const pages = navigation.map((nav) => getAllPagesFromNavigation(nav));
    return pages.flat();
  }

  if (navigation.pages) {
    return [...getAllPagesFromNavigation(navigation.pages)];
  }

  return [];
};

export const getVersionsSorted = () => {
  const pages = getAllPagesFromNavigation(config.navigation);

  const versionsMap: Record<string, boolean> = {};
  pages.forEach((page) => {
    const version = page.match(/^v[\d.]+\//);
    if (version) {
      versionsMap[version[0].slice(0, -1)] = true;
    }
  });

  const versions = Object.keys(versionsMap);
  return versions.sort(compareVersions).reverse();
};
