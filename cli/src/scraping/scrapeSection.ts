import { objToReadableString } from "../util.js";

export async function scrapeSection(
  scrapeFunc: any,
  html: string,
  origin: string,
  overwrite: boolean
) {
  console.log(
    `Started scraping${overwrite ? ", overwrite mode is on" : ""}...`
  );
  const groupsConfig = await scrapeFunc(html, origin, process.cwd(), overwrite);
  console.log("Finished scraping.");
  console.log("Add the following to your navigation in mint.json:");
  console.log(objToReadableString(groupsConfig));
}
