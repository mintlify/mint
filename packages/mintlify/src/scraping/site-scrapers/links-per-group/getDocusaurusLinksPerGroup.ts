import alternateGroupTitle from "../alternateGroupTitle.js";
import getLinksRecursively from "./getLinksRecursively.js";

export function getDocusaurusLinksPerGroup(
  navigationSections: any,
  $: any,
  version: string | undefined
) {
  if (version === "3" || version === "2") {
    return getDocusaurusLinksPerGroupLoop(navigationSections, $);
  }
  return [];
}

function getDocusaurusLinksPerGroupLoop(navigationSections: any, $: any) {
  return navigationSections
    .map((i, s) => {
      const section = $(s);

      // Links without a group
      if (section.hasClass("theme-doc-sidebar-item-link")) {
        const linkHref = section.find("a[href]").first().attr("href");
        return {
          group: "",
          pages: [linkHref],
        };
      }

      const firstLink = section
        .find(".menu__list-item-collapsible")
        .first()
        .find("a[href]");

      const sectionTitle = firstLink.text();
      const firstHref = firstLink.attr("href");
      const linkSections = section.children().eq(1).children();

      const pages = getLinksRecursively(linkSections, $);

      return {
        group: sectionTitle || alternateGroupTitle(firstLink, pages),
        pages: firstHref ? [firstHref, ...pages] : pages,
      };
    })
    .toArray();
}
