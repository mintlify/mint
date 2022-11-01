import { Config, Navigation } from '@/config';

export function pathToBreadcrumbs(pathname: string, config: Config) {
  if (!Array.isArray(config.navigation)) {
    return [];
  }

  for (const navEntry of config.navigation) {
    const recursiveOutput = recursivePathToBreadcrumbs(pathname, navEntry);
    if (recursiveOutput) {
      return recursiveOutput;
    }
  }

  return [];
}

function recursivePathToBreadcrumbs(pathname: string, navEntry: Navigation): string[] | undefined {
  if (!Array.isArray(navEntry.pages)) {
    return undefined;
  }

  for (const page of navEntry.pages) {
    if (page && typeof page !== 'string') {
      const recursiveOutput: string[] | undefined = recursivePathToBreadcrumbs(pathname, page);

      // Return if we found a match recursively
      if (recursiveOutput) {
        return [navEntry.group].concat(recursiveOutput);
      }
    } else if (page === pathname) {
      return [navEntry.group];
    }
  }

  // No match
  return undefined;
}
