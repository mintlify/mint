import axios from "axios";
import { detectFramework, Frameworks } from "./detectFramework.js";
import { getHrefFromArgs, getOrigin } from "../util.js";
import { scrapeSection } from "./scrapeSection.js";
import { scrapeDocusaurusSection } from "./site-scrapers/scrapeDocusaurusSection.js";
import openNestedDocusaurusMenus from "./site-scrapers/openNestedDocusaurusMenus.js";
import { scrapeGitBookSection } from "./site-scrapers/scrapeGitBookSection.js";
import openNestedGitbookMenus from "./site-scrapers/openNestedGitbookMenus.js";
import { scrapeReadMeSection } from "./site-scrapers/scrapeReadMeSection.js";
import { startBrowser } from "../browser.js";

export async function scrapeSectionAxiosWrapper(
  argv: any,
  scrapeFunc: ScrapeSectionFn
) {
  const href = getHrefFromArgs(argv);
  const res = await axios.get(href);
  const html = res.data;
  await scrapeSection(
    scrapeFunc,
    html,
    getOrigin(href),
    !!argv.overwrite,
    undefined
  );
  process.exit(0);
}

export async function scrapeDocusaurusSectionCommand(
  argv: any,
  version: string // "1" | "2" | "3"
) {
  await scrapeSectionOpeningAllNested(
    argv,
    openNestedDocusaurusMenus,
    scrapeDocusaurusSection,
    version
  );
}

export async function scrapeGitbookSectionCommand(argv: any) {
  await scrapeSectionOpeningAllNested(
    argv,
    openNestedGitbookMenus,
    scrapeGitBookSection
  );
}

async function scrapeSectionOpeningAllNested(
  argv: any,
  openLinks: any,
  scrapeFunc: ScrapeSectionFn,
  version?: string
) {
  const href = getHrefFromArgs(argv);

  const browser = await startBrowser();
  const page = await browser.newPage();
  await page.goto(href, {
    waitUntil: "networkidle2",
  });

  const html = await openLinks(page);
  browser.close();
  await scrapeSection(
    scrapeFunc,
    html,
    getOrigin(href),
    !!argv.overwrite,
    version
  );
  process.exit(0);
}

export async function scrapeSectionAutomatically(argv: any) {
  const href = getHrefFromArgs(argv);
  const res = await axios.get(href);
  const html = res.data;
  const { framework, version } = detectFramework(html);

  validateFramework(framework);

  console.log("Detected framework: " + framework);

  if (framework === Frameworks.DOCUSAURUS) {
    await scrapeDocusaurusSectionCommand(argv, version);
  } else if (framework === Frameworks.GITBOOK) {
    await scrapeGitbookSectionCommand(argv);
  } else if (framework === Frameworks.README) {
    await scrapeSectionAxiosWrapper(argv, scrapeReadMeSection);
  }
}

function validateFramework(framework: Frameworks | undefined) {
  if (!framework) {
    console.log(
      "Could not detect the framework automatically. We only support Docusaurus (V2 and V3), GitBook, and ReadMe."
    );
    process.exit();
  }
}
