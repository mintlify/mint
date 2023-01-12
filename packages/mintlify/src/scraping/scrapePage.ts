import path from "path";
import { createPage, getOrigin } from "../util.js";

export async function scrapePage(
  scrapeFunc: ScrapePageFn,
  href: string,
  html: string,
  overwrite: boolean,
  version: string | undefined
) {
  const origin = getOrigin(href);
  const cwd = process.cwd();
  const imageBaseDir = path.join(cwd, "images");

  const { title, description, markdown } = await scrapeFunc(
    html,
    origin,
    cwd,
    imageBaseDir,
    overwrite,
    version
  );
  createPage(title, description, markdown, overwrite, process.cwd());
}
