import cheerio from "cheerio";
import { scrapeGettingFileNameFromUrl } from "../scrapeGettingFileNameFromUrl.js";
import { getSitemapLinks } from "../getSitemapLinks.js";
import { scrapeGitBookPage } from "./scrapeGitBookPage.js";

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
  let allNavPathnames = [];
  const groupsConfig = navigationSections
    .map((i, section) => {
      const sectionTitle = $(section)
        .find('div > div[dir="auto"]')
        .first()
        .text();

      const linkPaths = $(section)
        .find("a[href]")
        .map((i, link) => {
          const linkHref = $(link).attr("href");

          // Skip external links until Mintlify supports them
          if (
            linkHref.startsWith("https://") ||
            linkHref.startsWith("http://")
          ) {
            return undefined;
          }

          return linkHref;
        })
        .toArray();

      allNavPathnames = allNavPathnames.concat(linkPaths);

      // Follows the same structure as mint.json
      return {
        group: sectionTitle,
        pages: linkPaths,
      };
    })
    .toArray();

  // Scrape every link not in the navigation. Nested docs
  // don't show up in navigation without clicking buttons,
  // so this lets us download the files for the user to add
  // manually to mint.json.
  const sitemapPaths = (await getSitemapLinks(new URL("sitemap.xml", origin)))
    .map((sitemapLinks: string) => {
      return new URL(sitemapLinks).pathname;
    })
    .filter((pathname: string) => !allNavPathnames.includes(pathname));

  const sitemapPathnamesForConfig = [];
  for (const pathname of sitemapPaths) {
    sitemapPathnamesForConfig.push(
      await scrapeGettingFileNameFromUrl(
        cliDir,
        origin,
        pathname,
        overwrite,
        scrapeGitBookPage,
        true
      )
    );
  }

  // Scrape each link in the navigation.
  const groupsConfigCleanPaths = await Promise.all(
    groupsConfig.map(async (groupConfig) => {
      const newPages = [];
      for (const pathname of groupConfig.pages) {
        newPages.push(
          await scrapeGettingFileNameFromUrl(
            cliDir,
            origin,
            pathname,
            overwrite,
            scrapeGitBookPage,
            true
          )
        );
      }
      groupConfig.pages = newPages;
      return groupConfig;
    })
  );

  if (sitemapPathnamesForConfig.length > 0) {
    return groupsConfigCleanPaths.concat([
      {
        group:
          "ATTENTION! WE CANNOT DETECT GROUPS FOR NESTED DOCS. PLEASE MOVE THEM INTO THEIR ORIGINAL GROUPS.",
        pages: sitemapPathnamesForConfig,
      },
    ]);
  }

  return groupsConfigCleanPaths;
}
