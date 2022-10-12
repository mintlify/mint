#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import initCommand from "./init-command/index.js";
import generatePageTemplate from "./pageTemplate.js";
import {
  scrapePageAutomatically,
  scrapePageWrapper,
} from "./scraping/scrapePageCommands.js";
import { scrapeDocusaurusPage } from "./scraping/site-scrapers/scrapeDocusaurusPage.js";
import { scrapeGitBookPage } from "./scraping/site-scrapers/scrapeGitBookPage.js";
import { scrapeReadMePage } from "./scraping/site-scrapers/scrapeReadMePage.js";
import {
  scrapeSectionAutomatically,
  scrapeSectionAxiosWrapper,
  scrapeGitbookSectionCommand,
} from "./scraping/scrapeSectionCommands.js";
import { scrapeDocusaurusSection } from "./scraping/site-scrapers/scrapeDocusaurusSection.js";
import { scrapeReadMeSection } from "./scraping/site-scrapers/scrapeReadMeSection.js";
import dev from "./local-preview/index.js";
import installDepsCommand from "./local-preview/helper-commands/installDepsCommand.js";

// TODO - add descriptions to the command options https://github.com/yargs/yargs/blob/HEAD/docs/api.md#commandmodule
yargs(hideBin(process.argv))
  .command(
    "dev",
    "Runs Mintlify locally (Must run in directory with mint.json)",
    () => {},
    async () => {
      await dev();
    }
  )
  .command(
    "install",
    "Install dependencies for local Mintlify",
    () => {},
    installDepsCommand
  )
  .command("init", "Generate a mintlify template", () => {}, initCommand)
  .command("page", "Generate a new page", () => {}, generatePageTemplate)
  .command(
    "scrape-page [url]",
    "Scrapes a page",
    () => {},
    async (argv) => {
      await scrapePageAutomatically(argv);
    }
  )
  .command(
    "scrape-docusaurus-page [url]",
    "Scrapes a Docusaurus page",
    () => {},
    async (argv) => {
      await scrapePageWrapper(argv, scrapeDocusaurusPage);
    }
  )
  .command(
    "scrape-gitbook-page [url]",
    "Scrapes a GitBook page",
    () => {},
    async (argv) => {
      await scrapePageWrapper(argv, scrapeGitBookPage);
    }
  )
  .command(
    "scrape-readme-page [url]",
    "Scrapes a ReadMe page",
    () => {},
    async (argv) => {
      await scrapePageWrapper(argv, scrapeReadMePage);
    }
  )
  .command(
    "scrape-section [url]",
    "Scrapes the docs in the section",
    () => {},
    async (argv) => {
      await scrapeSectionAutomatically(argv);
    }
  )
  .command(
    "scrape-docusaurus-section [url]",
    "Scrapes the Docusaurus section",
    () => {},
    async (argv) => {
      await scrapeSectionAxiosWrapper(argv, scrapeDocusaurusSection);
    }
  )
  .command(
    "scrape-gitbook-section [url]",
    "Scrapes the Gitbook section",
    () => {},
    async (argv) => {
      await scrapeGitbookSectionCommand(argv);
    }
  )
  .command(
    "scrape-readme-section [url]",
    "Scrapes the ReadMe section",
    () => {},
    async (argv) => {
      await scrapeSectionAxiosWrapper(argv, scrapeReadMeSection);
    }
  )

  .parse();
