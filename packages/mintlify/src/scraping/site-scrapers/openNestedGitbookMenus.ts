import { Page } from "puppeteer";

export default async function openNestedGitbookMenus(page: Page) {
  let clickedAny = true;

  // Loop until we've encountered every closed menu
  while (clickedAny) {
    clickedAny = await page.evaluate(() => {
      // Right pointing arrow. Only closed menus have this icon
      const icons: HTMLElement[] = Array.from(
        document.querySelectorAll('path[d="M9 18l6-6-6-6"]')
      );

      icons.forEach(async (icon: HTMLElement) => {
        const toClick = icon?.parentElement?.parentElement;
        toClick.click();
      });

      return icons.length > 0;
    });
  }

  return await page.content();
}
