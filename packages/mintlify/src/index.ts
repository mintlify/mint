#! /usr/bin/env node

import axios from "axios";
import { writeFileSync } from "fs";
import inquirer from "inquirer";
import minimistLite from "minimist-lite";
import { MintConfig } from "./templates.js";
import { scrapePage } from "./scraping/scrapePage.js";
import { scrapeSection } from "./scraping/scrapeSection.js";
import { createPage, toFilename, getOrigin } from "./util.js";
import { scrapeDocusaurusPage } from "./scraping/site-scrapers/scrapeDocusaurusPage.js";
import { scrapeDocusaurusSection } from "./scraping/site-scrapers/scrapeDocusaurusSection.js";
import { scrapeGitBookPage } from "./scraping/site-scrapers/scrapeGitBookPage.js";
import { scrapeGitBookSection } from "./scraping/site-scrapers/scrapeGitBookSection.js";
import { scrapeReadMePage } from "./scraping/site-scrapers/scrapeReadMePage.js";
import { scrapeReadMeSection } from "./scraping/site-scrapers/scrapeReadMeSection.js";
import { detectFramework, Frameworks } from "./scraping/detectFramework.js";
import { startBrowser, getHtmlWithPuppeteer } from "./browser.js";
import stopIfInvalidLink from "./validation/stopIfInvalidLink.js";

const argv = minimistLite(process.argv.slice(2), {
  boolean: ["overwrite"],
  default: {
    overwrite: false,
  },
});

if (argv._.length === 0) {
  console.error(
    `No command specified. Here are is the list that you can use:\ninit: initialize a Mintlify documentation instance\nscrape-section: scrapes a Docusaurus, ReadMe, or GitBook website\nscrape-page: scrapes a Docusaurus, ReadMe, or GitBook page`
  );
  process.exit(1); //an error occurred
}

const command = argv._[0];

if (command === "init") {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the organization?",
      },
      {
        type: "input",
        name: "color",
        message: "What is the primary color of the brand?",
        default: "#3b83f4",
      },
      {
        type: "input",
        name: "ctaName",
        message: "What is the name of the call to action button?",
        default: "Get Started",
      },
      {
        type: "input",
        name: "ctaUrl",
        message: "What is the URL destination of the call to action button?",
        default: "/",
      },
      {
        type: "input",
        name: "title",
        message: "What is the title of the first page?",
        default: "Introduction",
      },
    ])
    .then((answers) => {
      const { name, color, ctaName, ctaUrl, title } = answers;
      writeFileSync(
        "mint.json",
        JSON.stringify(
          MintConfig(name, color, ctaName, ctaUrl, toFilename(title)),
          null,
          "\t"
        )
      );
      createPage(title);
      console.log("🌱 Created initial files for Mintlify docs");
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

if (command === "page") {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the title of the new page?",
      },
      {
        type: "input",
        name: "description",
        message: "What is the description?",
        default: "",
      },
    ])
    .then((answers) => {
      const { title, description } = answers;

      createPage(title, description);
      console.log("🌱 Created initial files for Mintlify docs");
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

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

function getHrefFromArgs() {
  const href = argv._[1];
  stopIfInvalidLink(href);
  return href;
}

async function scrapePageAutomatically() {
  const href = getHrefFromArgs();
  const res = await axios.default.get(href);
  const html = res.data;
  const framework = detectFramework(html);

  validateFramework(framework);

  console.log("Detected framework: " + framework);

  if (framework === Frameworks.DOCUSAURUS) {
    await scrapePageWrapper(scrapeDocusaurusPage);
  } else if (framework === Frameworks.GITBOOK) {
    await scrapePageWrapper(scrapeGitBookPage, true);
  } else if (framework === Frameworks.README) {
    await scrapePageWrapper(scrapeReadMePage);
  }
}

async function scrapePageWrapper(scrapeFunc, puppeteer = false) {
  const href = getHrefFromArgs();
  let html: string;
  if (puppeteer) {
    html = await getHtmlWithPuppeteer(href);
  } else {
    const res = await axios.default.get(href);
    html = res.data;
  }
  await scrapePage(scrapeFunc, href, html, argv.overwrite);
  process.exit(0);
}

if (command === "scrape-page") {
  await scrapePageAutomatically();
}

if (command === "scrape-docusaurus-page") {
  await scrapePageWrapper(scrapeDocusaurusPage);
}

if (command === "scrape-gitbook-page") {
  await scrapePageWrapper(scrapeGitBookPage, true);
}

if (command === "scrape-readme-page") {
  await scrapePageWrapper(scrapeReadMePage);
}

async function scrapeSectionAutomatically() {
  const href = getHrefFromArgs();
  const res = await axios.default.get(href);
  const html = res.data;
  const framework = detectFramework(html);

  validateFramework(framework);

  console.log("Detected framework: " + framework);

  if (framework === Frameworks.DOCUSAURUS) {
    await scrapeSectionAxiosWrapper(scrapeDocusaurusSection);
  } else if (framework === Frameworks.GITBOOK) {
    await scrapeSectionGitBookWrapper(scrapeGitBookSection);
  } else if (framework === Frameworks.README) {
    await scrapeSectionAxiosWrapper(scrapeReadMeSection);
  }
}

async function scrapeSectionAxiosWrapper(scrapeFunc: any) {
  const href = getHrefFromArgs();
  const res = await axios.default.get(href);
  const html = res.data;
  await scrapeSection(scrapeFunc, html, getOrigin(href), argv.overwrite);
  process.exit(0);
}

async function scrapeSectionGitBookWrapper(scrapeFunc: any) {
  const href = getHrefFromArgs();

  const browser = await startBrowser();
  const page = await browser.newPage();
  await page.goto(href, {
    waitUntil: "networkidle2",
  });

  let prevEncountered = [];
  let encounteredHref = ["fake"];

  // Loop until we've encountered every link
  while (!encounteredHref.every((href) => prevEncountered.includes(href))) {
    prevEncountered = encounteredHref;
    encounteredHref = await page.evaluate(
      (encounteredHref) => {
        const icons = Array.from(
          document.querySelectorAll('path[d="M9 18l6-6-6-6"]')
        );

        const linksFound = [];
        icons.forEach(async (icon: HTMLElement) => {
          const toClick = icon.parentElement.parentElement;
          const link = toClick.parentElement.parentElement;

          // Skip icons not in the side navigation
          if (!link.hasAttribute("href")) {
            return;
          }

          const href = link.getAttribute("href");

          // Should never occur but we keep it as a fail-safe
          if (href.startsWith("https://") || href.startsWith("http://")) {
            return;
          }

          // Click any links we haven't seen before
          if (!encounteredHref.includes(href)) {
            toClick.click();
          }

          linksFound.push(href);
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

if (command === "scrape-section") {
  await scrapeSectionAutomatically();
}

if (command === "scrape-docusaurus-section") {
  await scrapeSectionAxiosWrapper(scrapeDocusaurusSection);
}

if (command === "scrape-gitbook-section") {
  await scrapeSectionGitBookWrapper(scrapeGitBookSection);
}

if (command === "scrape-readme-section") {
  await scrapeSectionAxiosWrapper(scrapeReadMeSection);
}
