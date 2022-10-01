# Mintlify CLI

The Mintlify CLI is used to automate migrations.

## Installation

`npm i -g mintlify`

If you installed a local version, you may need to uninstall it with

`npm uninstall -g mintlify` before installing the published version.

## Local development & testing

To test changes locally run:

`npm run local`

## Commands

### Migrations

We support automated migrations from ReadMe, GitBook, and Docusaurus.

`mintlify scrape-page <url>` - Scrapes the page at the URL provided and creates a corresponding MDX file

`mintlify scrape-section <url>` - Scrapes the section at the URL provided and creates the MDX files within that section

#### Options

`--overwrite` - By default if an existing file with the same path name is detected, the file will not be overwritten by the scraper. Use this option to force an overwrite.
