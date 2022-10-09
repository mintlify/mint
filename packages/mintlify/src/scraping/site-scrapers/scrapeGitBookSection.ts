import cheerio from "cheerio";
import { scrapeGettingFileNameFromUrl } from "../scrapeGettingFileNameFromUrl.js";
import { scrapeGitBookPage } from "./scrapeGitBookPage.js";
import getLinksRecursively from "./getLinksRecursively.js";
import { NavigationEntry } from "../../navigation.js";

export async function scrapeGitBookSection(
  html: string,
  origin: string,
  cliDir: string,
  overwrite: boolean
) {
  const $ = cheerio.load(html);

  // Get all the navigation sections
  const navigationSections = $(
    'div[data-testid="page.desktopTableOfContents"] > div > div:first-child'
  )
    .children()
    .first()
    .children()
    .first()
    .children();

  // Get all links per group
  const groupsConfig = navigationSections
    .map((i, s) => {
      const section = $(s);
      const sectionTitle = $(section)
        .find('div > div[dir="auto"]')
        .first()
        .text();

      // Only present if the nested navigation is not in a group
      const firstLink = section.children().eq(0);
      const firstHref = firstLink.attr("href");

      const linkSections = section.children().eq(1).children();
      const pages = getLinksRecursively(linkSections, $);

      return {
        group: sectionTitle || firstLink?.text(),
        pages: firstHref ? [firstHref, ...pages] : pages,
      };
    })
    .toArray()
    .filter(Boolean);

  // Scrape each link in the navigation.
  const groupsConfigCleanPaths = await Promise.all(
    groupsConfig.map(async (navEntry: NavigationEntry) => {
      return await scrapeGettingFileNameFromUrl(
        navEntry,
        cliDir,
        origin,
        overwrite,
        scrapeGitBookPage,
        true
      );
    })
  );

  return groupsConfigCleanPaths;
}
