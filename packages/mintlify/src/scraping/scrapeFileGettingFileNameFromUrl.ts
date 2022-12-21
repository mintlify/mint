import path from "path";
import axios from "axios";
import { getHtmlWithPuppeteer } from "../browser.js";
import { createPage } from "../util.js";

export async function scrapeFileGettingFileNameFromUrl(
  pathname: string,
  cliDir: string,
  origin: string,
  overwrite: boolean,
  scrapePageFunc: (
    html: string,
    origin: string,
    cliDir: string,
    imageBaseDir: string,
    version: string | undefined
  ) => Promise<{
    title?: string;
    description?: string;
    markdown?: string;
  }>,
  puppeteer = false,
  version: string | undefined,
  baseToRemove?: string
) {
  // Skip scraping external links
  if (pathname.startsWith("https://") || pathname.startsWith("http://")) {
    return pathname;
  }

  // Removes file name from the end
  const splitSubpath = pathname.split("/");
  let folders = splitSubpath.slice(0, splitSubpath.length - 1).join("/");

  // Remove base dir if passed in
  if (baseToRemove && folders.startsWith(baseToRemove)) {
    folders = folders.replace(baseToRemove, "");
  }

  // TO DO: Improve this by putting each page's images in a separate
  // folder named after the title of the page.
  const imageBaseDir = path.join(cliDir, "images", folders);

  // Scrape each page separately
  const href = new URL(pathname, origin).href;
  let html: string;
  if (puppeteer) {
    html = await getHtmlWithPuppeteer(href);
  } else {
    const res = await axios.get(href);
    html = res.data;
  }

  const { title, description, markdown } = await scrapePageFunc(
    html,
    origin,
    cliDir,
    imageBaseDir,
    version
  );

  // Check if page didn't have content
  if (!title && !markdown) {
    return undefined;
  }

  const newFileLocation = folders ? path.join(cliDir, folders) : cliDir;

  // Default to introduction.mdx if we encountered index.html
  const fileName = splitSubpath[splitSubpath.length - 1] || "introduction";

  // Will create subfolders as needed
  createPage(
    title,
    description,
    markdown,
    overwrite,
    newFileLocation,
    fileName
  );

  // Removes first slash if we are in a folder, Mintlify doesn't need it
  return folders ? path.join(folders, fileName).substring(1) : fileName;
}
