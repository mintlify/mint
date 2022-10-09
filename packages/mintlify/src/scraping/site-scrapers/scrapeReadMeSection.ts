import cheerio from "cheerio";
import { scrapeReadMePage } from "./scrapeReadMePage.js";
import { scrapeGettingFileNameFromUrl } from "../scrapeGettingFileNameFromUrl.js";
import getLinksRecursively from "./getLinksRecursively.js";
import { NavigationEntry } from "../../navigation.js";

export async function scrapeReadMeSection(
  html: string,
  origin: string,
  cliDir: string,
  overwrite: boolean
) {
  const $ = cheerio.load(html);

  // Get all the navigation sections, but only from the first
  // sidebar found. There are multiple in the HTML for mobile
  // responsiveness but they all have the same links.
  const navigationSections = $(".rm-Sidebar")
    .first()
    .find(".rm-Sidebar-section");

  const groupsConfig = navigationSections
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

  return await Promise.all(
    groupsConfig.map(async (navEntry: NavigationEntry) => {
      return await scrapeGettingFileNameFromUrl(
        // ReadMe requires a directory on all sections wheras we use root.
        // /docs is their default directory so we remove it
        navEntry,
        cliDir,
        origin,
        overwrite,
        scrapeReadMePage,
        false,
        "/docs"
      );
    })
  );
}
