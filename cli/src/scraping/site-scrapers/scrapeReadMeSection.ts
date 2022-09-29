import axios from "axios";
import cheerio from "cheerio";
import { scrapeReadMePage } from "./scrapeReadMePage.js";
import { getOrigin } from "../../util.js";
import { scrapeGettingFileNameFromUrl } from "../scrapeGettingFileNameFromUrl.js";

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
    .map((i, section) => {
      const sectionTitle = $(section).find("h3").first().text();

      // Get all links, then use filter to remove duplicates.
      // There are duplicates because of nested navigation, eg:
      // subgroupTitle -> /first-page
      // -- First Page -> /first-page   ** DUPLICATE **
      // -- Second Page -> /second-page
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
        .toArray()
        .filter(
          (value: string, index: number, self) => self.indexOf(value) === index
        );

      // Follows the same structure as mint.json
      return {
        group: sectionTitle,
        pages: linkPaths,
      };
    })
    .toArray();

  return await Promise.all(
    groupsConfig.map(async (groupConfig) => {
      groupConfig.pages = await Promise.all(
        groupConfig.pages.map(async (pathname: string) =>
          // ReadMe requires a directory on all sections wheras we use root.
          // /docs is their default directory so we remove it
          scrapeGettingFileNameFromUrl(
            cliDir,
            origin,
            pathname,
            overwrite,
            scrapeReadMePage,
            false,
            "/docs"
          )
        )
      );
      return groupConfig;
    })
  );
}
