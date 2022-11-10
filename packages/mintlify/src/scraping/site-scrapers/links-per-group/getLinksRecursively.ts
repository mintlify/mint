// Used by Docusaurus, GitBook, and ReadMe section scrapers
export default function getLinksRecursively(linkSections: any, $: any) {
  if (linkSections == null || linkSections.length === 0) {
    return [];
  }

  return linkSections
    .map((i, s) => {
      const subsection = $(s);
      let link = subsection.children().first();

      if (!link.attr("href")) {
        // Docusaurus nests the <a> inside a <div>
        link = link.find("a[href]").first();
      }
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
          pages: [linkHref, ...getLinksRecursively(childLinks, $)],
        };
      }

      return linkHref;
    })
    .toArray()
    .filter(Boolean);
}
