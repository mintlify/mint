import axios from "axios";
import { scrapePage } from "./scrapePage.js";
import { scrapeDocusaurusPage } from "./site-scrapers/scrapeDocusaurusPage.js";
import { scrapeGitBookPage } from "./site-scrapers/scrapeGitBookPage.js";
import { scrapeReadMePage } from "./site-scrapers/scrapeReadMePage.js";
import { detectFramework, Frameworks } from "./detectFramework.js";
import { getHrefFromArgs } from "../util.js";
import { getHtmlWithPuppeteer } from "../browser.js";

function validateFramework(framework) {
  if (!framework) {
    console.log(
      "Could not detect the framework automatically. Please use one of:"
    );
    console.log("scrape-page-docusaurus");
    console.log("scrape-page-gitbook");
    console.log("scrape-page-readme");
    return process.exit(1);
  }
}

export async function scrapePageWrapper(
  argv: any,
  scrapeFunc: any,
  options?: { version?: string; puppeteer?: boolean }
) {
  const href = getHrefFromArgs(argv);
  let html: string;
  if (options.puppeteer) {
    html = await getHtmlWithPuppeteer(href);
  } else {
    const res = await axios.default.get(href);
    html = res.data;
  }
  await scrapePage(scrapeFunc, href, html, argv.overwrite, options.version);
  process.exit(0);
}

export async function scrapePageAutomatically(argv: any) {
  const href = getHrefFromArgs(argv);
  const res = await axios.default.get(href);
  const html = res.data;
  const { framework, version } = detectFramework(html);

  validateFramework(framework);

  console.log("Detected framework: " + framework);

  if (framework === Frameworks.DOCUSAURUS) {
    await scrapePageWrapper(argv, scrapeDocusaurusPage, { version });
  } else if (framework === Frameworks.GITBOOK) {
    await scrapePageWrapper(argv, scrapeGitBookPage, { puppeteer: true });
  } else if (framework === Frameworks.README) {
    await scrapePageWrapper(argv, scrapeReadMePage);
  }
}
