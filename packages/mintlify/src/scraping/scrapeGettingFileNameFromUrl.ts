import { NavigationEntry, isNavigation } from "../navigation.js";
import { scrapeFileGettingFileNameFromUrl } from "./scrapeFileGettingFileNameFromUrl.js";

export async function scrapeGettingFileNameFromUrl(
  navEntry: NavigationEntry,
  cliDir: string,
  origin: string,
  overwrite: boolean,
  scrapePageFunc: (
    html: string,
    origin: string,
    cliDir: string,
    imageBaseDir: string
  ) => Promise<{
    title?: string;
    description?: string;
    markdown?: string;
  }>,
  puppeteer = false,
  baseToRemove?: string
): Promise<NavigationEntry> {
  if (isNavigation(navEntry)) {
    const newPages = [];
    for (const nestedNavEntry of navEntry.pages) {
      newPages.push(
        await scrapeGettingFileNameFromUrl(
          nestedNavEntry,
          cliDir,
          origin,
          overwrite,
          scrapePageFunc,
          puppeteer,
          baseToRemove
        )
      );
    }
    navEntry.pages = newPages;
    return navEntry;
  }

  return await scrapeFileGettingFileNameFromUrl(
    navEntry,
    cliDir,
    origin,
    overwrite,
    scrapePageFunc,
    puppeteer,
    baseToRemove
  );
}
