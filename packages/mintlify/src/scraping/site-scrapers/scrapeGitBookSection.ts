import cheerio from "cheerio";
import { NavigationEntry } from "../../navigation.js";
import { scrapeGettingFileNameFromUrl } from "../scrapeGettingFileNameFromUrl.js";
import { scrapeGitBookPage } from "./scrapeGitBookPage.js";
import combineNavWithEmptyGroupTitles from "../combineNavWithEmptyGroupTitles.js";
import getLinksRecursively from "./links-per-group/getLinksRecursively.js";
import alternateGroupTitle from "./alternateGroupTitle.js";

export async function scrapeGitBookSection(
  html: string,
  origin: string,
  cliDir: string,
  overwrite: boolean,
  version: string | undefined
) {
  const $ = cheerio.load(html);

  // Get all the navigation sections
  // Some variants of the GitBook UI show the logo and search base in the side navigation bar,
  // but the navigation sections are always the last value.
  const navigationSections = $(
    'div[data-testid="page.desktopTableOfContents"] > nav > div:first-child'
  )
    .children()
    .eq(-1)
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
        group: sectionTitle || alternateGroupTitle(firstLink, pages),
        pages: firstHref ? [firstHref, ...pages] : pages,
      };
    })
    .toArray()
    .filter(Boolean);

  // Merge groups with empty titles together
  const reducedGroupsConfig = combineNavWithEmptyGroupTitles(groupsConfig);

  // Scrape each link in the navigation.
  const groupsConfigCleanPaths = await Promise.all(
    reducedGroupsConfig.map(async (navEntry: NavigationEntry) => {
      return await scrapeGettingFileNameFromUrl(
        navEntry,
        cliDir,
        origin,
        overwrite,
        scrapeGitBookPage,
        true,
        version
      );
    })
  );

  return groupsConfigCleanPaths;
}
