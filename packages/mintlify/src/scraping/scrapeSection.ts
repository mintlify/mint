import path from "path";
import { objToReadableString } from "../util.js";

export async function scrapeSection(
  scrapeFunc: ScrapeSectionFn,
  html: string,
  origin: string,
  overwrite: boolean,
  version: string | undefined
) {
  console.log(
    `Started scraping${overwrite ? ", overwrite mode is on" : ""}...`
  );
  const cwd = process.cwd();
  const imageBaseDir = path.join(cwd, "images");

  const groupsConfig = await scrapeFunc(
    html,
    origin,
    cwd,
    imageBaseDir,
    overwrite,
    version
  );
  console.log("Finished scraping.");
  console.log("Add the following to your navigation in mint.json:");
  console.log(objToReadableString(groupsConfig));
}
