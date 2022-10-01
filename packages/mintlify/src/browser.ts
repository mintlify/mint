import { launch } from "puppeteer";

export async function startBrowser() {
  try {
    return await launch({
      headless: true,
      ignoreHTTPSErrors: true,
    });
  } catch (err) {
    console.log("Could not create a browser instance: ", err);
    process.exit(1);
  }
}

export async function getHtmlWithPuppeteer(href: string) {
  const browser = await startBrowser();
  const page = await browser.newPage();
  await page.goto(href, {
    waitUntil: "networkidle2",
  });
  const html = await page.content();
  browser.close();
  return html;
}
