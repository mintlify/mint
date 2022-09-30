import path from "path";
import { createPage, getOrigin } from "../util.js";

export async function scrapePage(
  scrapeFunc: (
    html: string,
    origin: string,
    imageBaseDir: string
  ) => Promise<any>,
  href: string,
  html: string,
  overwrite: boolean
) {
  const origin = getOrigin(href);
  const imageBaseDir = path.join(process.cwd(), "images");
  const { title, description, markdown } = await scrapeFunc(
    html,
    origin,
    imageBaseDir
  );
  createPage(title, description, markdown, overwrite, process.cwd());
}
