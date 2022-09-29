import axios from "axios";
import cheerio from "cheerio";
import { scrapeGettingFileNameFromUrl } from "../scrapeGettingFileNameFromUrl.js";
import { scrapeDocusaurusPage } from "./scrapeDocusaurusPage.js";
import { getOrigin } from "../../util.js";

export async function scrapeDocusaurusSection(
  html: string,
  origin: string,
  cliDir: string,
  overwrite: boolean
) {
  const $ = cheerio.load(html);

  // Get all the navigation sections
  const navigationSections = $(".theme-doc-sidebar-menu").first().children();

  // Get all links per group
  const groupsConfig = navigationSections
    .map((i, section) => {
      const sectionComponent = $(section);

      // Links without a group
      if (sectionComponent.hasClass("theme-doc-sidebar-item-link")) {
        const linkHref = sectionComponent.find("a[href]").first().attr("href");
        return {
          group: "",
          pages: [linkHref],
        };
      }

      const sectionTitle = sectionComponent
        .find(".menu__list-item-collapsible")
        .first()
        .text();

      // The category title can be a page too so we find from the
      // section component instead of the more specific menu__list child
      const linkPaths = sectionComponent
        .find("a[href]")
        .map((i, link) => {
          return $(link).attr("href");
        })
        .filter((i, link) => link !== "#")
        .toArray();

      // Follows the same structure as mint.json
      return {
        group: sectionTitle,
        pages: linkPaths,
      };
    })
    .toArray();

  // Scrape each link in the navigation.
  const groupsConfigCleanPaths = await Promise.all(
    groupsConfig.map(async (groupConfig) => {
      groupConfig.pages = (
        await Promise.all(
          groupConfig.pages.map(async (pathname: string) =>
            // Docusaurus requires a directory on all sections wheras we use root.
            // /docs is their default directory so we remove it
            scrapeGettingFileNameFromUrl(
              cliDir,
              origin,
              pathname,
              overwrite,
              scrapeDocusaurusPage,
              false,
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
