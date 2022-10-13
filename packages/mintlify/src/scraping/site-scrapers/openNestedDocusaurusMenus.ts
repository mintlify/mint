import { Page } from "puppeteer";

export default async function openNestedDocusaurusMenus(page: Page) {
  let prevEncountered: string[] = [];
  let encounteredHref = ["fake-href-to-make-loop-run-at-least-once"];

  // Loop until we've encountered every link
  while (!encounteredHref.every((href) => prevEncountered.includes(href))) {
    prevEncountered = encounteredHref;
    encounteredHref = await page.evaluate(
      (encounteredHref) => {
        const icons: HTMLElement[] = Array.from(
          document.querySelectorAll(".clean-btn.menu__caret")
        );

        const linksFound: string[] = [];
        icons.forEach(async (icon: HTMLElement) => {
          const href =
            icon?.parentElement?.firstElementChild?.getAttribute("href");

          // Should never occur but we keep it as a fail-safe
          if (href?.startsWith("https://") || href?.startsWith("http://")) {
            return;
          }

          // Click any links we haven't seen before
          if (href && !encounteredHref.includes(href)) {
            icon?.click();
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
