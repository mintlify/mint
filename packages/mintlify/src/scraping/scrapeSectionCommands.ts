import axios from "axios";
import { detectFramework, Frameworks } from "./detectFramework.js";
import { getHrefFromArgs, getOrigin } from "../util.js";
import { scrapeSection } from "./scrapeSection.js";
import { scrapeDocusaurusSection } from "./site-scrapers/scrapeDocusaurusSection.js";
import { scrapeGitBookSection } from "./site-scrapers/scrapeGitBookSection.js";
import { scrapeReadMeSection } from "./site-scrapers/scrapeReadMeSection.js";
import { startBrowser } from "../browser.js";

function validateFramework(framework: Frameworks | undefined) {
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

export async function scrapeSectionAxiosWrapper(argv: any, scrapeFunc: any) {
  const href = getHrefFromArgs(argv);
  const res = await axios.default.get(href);
  const html = res.data;
  await scrapeSection(scrapeFunc, html, getOrigin(href), argv.overwrite);
  process.exit(0);
}

export async function scrapeGitbookSectionCommand(argv: any) {
  await scrapeSectionGitBookWrapper(argv, scrapeGitBookSection);
}

async function scrapeSectionGitBookWrapper(argv: any, scrapeFunc: any) {
  const href = getHrefFromArgs(argv);

  const browser = await startBrowser();
  const page = await browser.newPage();
  await page.goto(href, {
    waitUntil: "networkidle2",
  });

  let prevEncountered: string[] = [];
  let encounteredHref = ["fake"];

  // Loop until we've encountered every link
  while (!encounteredHref.every((href) => prevEncountered.includes(href))) {
    prevEncountered = encounteredHref;
    encounteredHref = await page.evaluate(
      (encounteredHref) => {
        const icons: HTMLElement[] = Array.from(
          document.querySelectorAll('path[d="M9 18l6-6-6-6"]')
        );

        const linksFound: string[] = [];
        icons.forEach(async (icon: HTMLElement) => {
          const toClick = icon?.parentElement?.parentElement;
          const link = toClick?.parentElement?.parentElement;

          // Skip icons not in the side navigation
          if (!link?.hasAttribute("href")) {
            return;
          }

          const href = link.getAttribute("href");

          // Should never occur but we keep it as a fail-safe
          if (href?.startsWith("https://") || href?.startsWith("http://")) {
            return;
          }

          // Click any links we haven't seen before
          if (href && !encounteredHref.includes(href)) {
            toClick?.click();
          }
          if (href) {
            linksFound.push(href);
          }
        });

        return linksFound;
      },
      encounteredHref // Need to pass array into the browser
    );
  }

  const html = await page.content();
  browser.close();
  await scrapeSection(scrapeFunc, html, getOrigin(href), argv.overwrite);
  process.exit(0);
}

export async function scrapeSectionAutomatically(argv: any) {
  const href = getHrefFromArgs(argv);
  const res = await axios.default.get(href);
  const html = res.data;
  const framework = detectFramework(html);

  validateFramework(framework);

  console.log("Detected framework: " + framework);

  if (framework === Frameworks.DOCUSAURUS) {
    await scrapeSectionAxiosWrapper(argv, scrapeDocusaurusSection);
  } else if (framework === Frameworks.GITBOOK) {
    await scrapeGitbookSectionCommand(argv);
  } else if (framework === Frameworks.README) {
    await scrapeSectionAxiosWrapper(argv, scrapeReadMeSection);
  }
}
