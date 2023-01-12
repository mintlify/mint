import { scrapeFileGettingFileNameFromUrl } from "./scrapeFileGettingFileNameFromUrl.js";

export async function scrapeGettingFileNameFromUrl(
  navEntry: MintNavigationEntry,
  cliDir: string,
  origin: string,
  overwrite: boolean,
  scrapePageFunc: (
    html: string,
    origin: string,
    cliDir: string,
    imageBaseDir: string,
    overwrite: boolean,
    version: string | undefined
  ) => Promise<{
    title?: string;
    description?: string;
    markdown?: string;
  }>,
  puppeteer = false,
  version: string | undefined,
  baseToRemove?: string
): Promise<MintNavigationEntry> {
  if (typeof navEntry !== "string") {
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
          version,
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
    version,
    baseToRemove
  );
}
