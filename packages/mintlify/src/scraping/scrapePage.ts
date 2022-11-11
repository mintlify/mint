import path from "path";
import { createPage, getOrigin } from "../util.js";

export async function scrapePage(
  scrapeFunc: (
    html: string,
    origin: string,
    cliDir: string,
    imageBaseDir: string,
    version: string | undefined
  ) => Promise<any>,
  href: string,
  html: string,
  overwrite: boolean,
  version: string | undefined
) {
  const origin = getOrigin(href);
  const imageBaseDir = path.join(process.cwd(), "images");
  const { title, description, markdown } = await scrapeFunc(
    html,
    origin,
    process.cwd(),
    imageBaseDir,
    version
  );
  createPage(title, description, markdown, overwrite, process.cwd());
}
