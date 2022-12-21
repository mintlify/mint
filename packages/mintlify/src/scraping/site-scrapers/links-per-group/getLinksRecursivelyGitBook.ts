// Used by GitBook section scraper
export default function getLinksRecursivelyGitBook(linkSections: any, $: any) {
  if (linkSections == null || linkSections.length === 0) {
    return [];
  }

  return linkSections
    .map((i, s) => {
      let subsection = $(s);

      // GitBook has an extra div when more than one layer deep
      if (subsection.children().length === 1) {
        subsection = subsection.children().first();
      }

      const link = subsection.children().first();
      const linkHref = link.attr("href");

      // Skip missing links. For example, GitBook uses
      // empty divs are used for styling a line beside the nav.
      // Skip external links until Mintlify supports them
      if (
        !linkHref ||
        linkHref === "#" ||
        linkHref.startsWith("https://") ||
        linkHref.startsWith("http://")
      ) {
        return undefined;
      }

      const childLinks = subsection.children().eq(1).children();

      if (childLinks.length > 0) {
        // Put the section link in the list of pages.
        // When we support the section itself being a link we should update this
        return {
          group: link.text(),
          pages: [linkHref, ...getLinksRecursivelyGitBook(childLinks, $)],
        };
      }

      return linkHref;
    })
    .toArray()
    .filter(Boolean);
}
