import { Page } from "puppeteer";

export default async function openNestedGitbookMenus(page: Page) {
  let prevEncountered: string[] = [];
  let encounteredHref = ["fake-href-to-make-loop-run-at-least-once"];

  // Loop until we've encountered every link
  while (!encounteredHref.every((href) => prevEncountered.includes(href))) {
    prevEncountered = encounteredHref;
    encounteredHref = await page.evaluate(
      (encounteredHref) => {
        const icons: HTMLElement[] = Array.from(
          document.querySelectorAll('path[d="M9 18l6-6-6-6"]')
        );

        const linksFound: string[] = [];
        icons.forEach(async (icon: HTMLElement) => {
          const toClick = icon?.parentElement?.parentElement;
          const link = toClick?.parentElement?.parentElement;

          // Skip icons not in the side navigation
          if (!link?.hasAttribute("href")) {
            return;
          }

          const href = link.getAttribute("href");

          // Should never occur but we keep it as a fail-safe
          if (href?.startsWith("https://") || href?.startsWith("http://")) {
            return;
          }

          // Click any links we haven't seen before
          if (href && !encounteredHref.includes(href)) {
            toClick?.click();
          }
          if (href) {
            linksFound.push(href);
          }
        });

        return linksFound;
      },
      encounteredHref // Need to pass array into the browser
    );
  }

  return await page.content();
}
