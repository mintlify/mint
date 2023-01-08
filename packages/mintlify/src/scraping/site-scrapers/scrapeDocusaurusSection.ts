import cheerio from "cheerio";
import { scrapeGettingFileNameFromUrl } from "../scrapeGettingFileNameFromUrl.js";
import combineNavWithEmptyGroupTitles from "../combineNavWithEmptyGroupTitles.js";
import { scrapeDocusaurusPage } from "./scrapeDocusaurusPage.js";
import { getDocusaurusLinksPerGroup } from "./links-per-group/getDocusaurusLinksPerGroup.js";

export async function scrapeDocusaurusSection(
  html: string,
  origin: string,
  cliDir: string,
  imageBaseDir: string,
  overwrite: boolean,
  version: string
) {
  const $ = cheerio.load(html);

  // Get all the navigation sections
  const navigationSections = $(".theme-doc-sidebar-menu").first().children();

  // Get all links per group
  const groupsConfig: MintNavigation[] = getDocusaurusLinksPerGroup(
    navigationSections,
    $,
    version
  );

  // Merge groups with empty titles together
  const reducedGroupsConfig = combineNavWithEmptyGroupTitles(groupsConfig);

  // Scrape each link in the navigation.
  const groupsConfigCleanPaths = await Promise.all(
    reducedGroupsConfig.map(async (groupConfig) => {
      groupConfig.pages = (
        await Promise.all(
          groupConfig.pages.map(async (navEntry: MintNavigationEntry) =>
            // Docusaurus requires a directory on all sections wheras we use root.
            // /docs is their default directory so we remove it
            scrapeGettingFileNameFromUrl(
              navEntry,
              cliDir,
              origin,
              overwrite,
              scrapeDocusaurusPage,
              false,
              version,
              "/docs"
            )
          )
        )
      )
        // Remove skipped index pages (they return undefined from the above function)
        .filter(Boolean);
      return groupConfig;
    })
  );

  return groupsConfigCleanPaths;
}
