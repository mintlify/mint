import cheerio from "cheerio";
import { scrapeReadMePage } from "./scrapeReadMePage.js";
import { scrapeGettingFileNameFromUrl } from "../scrapeGettingFileNameFromUrl.js";
import getLinksRecursively from "./links-per-group/getLinksRecursively.js";
import downloadLogoImage from "../downloadLogoImage.js";

export async function scrapeReadMeSection(
  html: string,
  origin: string,
  cliDir: string,
  imageBaseDir: string,
  overwrite: boolean,
  version: string | undefined
): Promise<MintNavigationEntry[]> {
  const $ = cheerio.load(html);

  // Download the logo
  const logoSrc = $(".rm-Logo-img").first().attr("src");
  downloadLogoImage(logoSrc, imageBaseDir, origin, overwrite);

  // Get all the navigation sections, but only from the first
  // sidebar found. There are multiple in the HTML for mobile
  // responsiveness but they all have the same links.
  const navigationSections = $(".rm-Sidebar")
    .first()
    .find(".rm-Sidebar-section");

  const groupsConfig: MintNavigation[] = navigationSections
    .map((i, s) => {
      const section = $(s);
      const sectionTitle = section.find("h3").first().text();

      // Get all links, then use filter to remove duplicates.
      // There are duplicates because of nested navigation, eg:
      // subgroupTitle -> /first-page
      // -- First Page -> /first-page   ** DUPLICATE **
      // -- Second Page -> /second-page
      const linkSections = section.find(".rm-Sidebar-list").first().children();
      const pages = getLinksRecursively(linkSections, $).filter(
        (value: string, index: number, self) => self.indexOf(value) === index
      );

      // Follows the same structure as mint.json
      return {
        group: sectionTitle,
        pages: pages,
      };
    })
    .toArray();

  // Scrape each link in the navigation.
  const groupsConfigCleanPaths = await Promise.all(
    groupsConfig.map(async (navEntry: MintNavigationEntry) => {
      return await scrapeGettingFileNameFromUrl(
        // ReadMe requires a directory on all sections whereas we use root.
        // /docs is their default directory so we remove it
        navEntry,
        cliDir,
        origin,
        overwrite,
        scrapeReadMePage,
        false,
        version,
        "/docs"
      );
    })
  );

  return groupsConfigCleanPaths;
}
