// TODO - add types
import fse from "fs-extra";
import { promises as _promises } from "fs";
import matter from "gray-matter";
import path from "path";

import categorizeFiles from "./categorizeFiles.js";
import { getConfigObj } from "./mintConfigFile.js";
import { getOpenApiTitleAndDescription } from "./getOpenApiContext.js";
import { slugToTitle } from "./slugToTitle.js";
import { CLIENT_PATH, CMD_EXEC_PATH } from "../constants.js";

const { readFile } = _promises;

// End matter is front matter, but at the end
const getIndexOfEndMatter = (fileContents: string) => {
  const frontMatters = fileContents.match(
    /---\n(title:.+\n|description:.+\n|sidebarTitle:.+\n|api:.+\n|openapi:.+\n)+---$/m
  );
  if (frontMatters) {
    return fileContents.indexOf(frontMatters[0]);
  }

  return -1;
};

export const potentiallyRemoveEndMatter = (fileContents: string) => {
  const endMatterIndex = getIndexOfEndMatter(fileContents);

  if (endMatterIndex === -1) {
    return fileContents;
  }

  return fileContents.substring(0, endMatterIndex);
};

const getMetadata = (fileContents: string) => {
  const { data } = matter(fileContents);

  if (Object.keys(data).length > 0) {
    return data;
  }

  const startIndex = getIndexOfEndMatter(fileContents);
  if (startIndex === -1) {
    return {};
  }

  const fileContentFromFrontMatter = fileContents.substring(startIndex);
  const { data: nonTopFrontMatter } = matter(fileContentFromFrontMatter);
  return nonTopFrontMatter;
};

export const createPage = (
  path: string,
  content: string,
  openApiObj: object | null
) => {
  const slug = path.replace(/\.mdx?$/, "").substring(1);
  let defaultTitle = slugToTitle(slug);
  const metadata = getMetadata(content);
  // Append data from OpenAPI if it exists
  const { title, description } = getOpenApiTitleAndDescription(
    openApiObj,
    metadata?.openapi
  );
  if (title) {
    defaultTitle = title;
  }
  return {
    [slug]: { title: defaultTitle, description, ...metadata, href: `/${slug}` },
  };
};

export const createMetadataFileFromPages = (pages: any, configObj: any) => {
  const targetPath = path.join(CLIENT_PATH, "src", "metadata.json");
  const createNav = (nav) => {
    return {
      group: nav.group,
      pages: nav.pages.map((page) => {
        if (typeof page === "string") {
          return pages[page];
        }

        return createNav(page);
      }),
    };
  };

  if (configObj?.navigation == null) {
    return;
  }

  let navFile = configObj.navigation.map((nav) => createNav(nav));
  const filterOutNullInPages = (pages) => {
    const newPages = [];
    pages.forEach((page) => {
      if (page == null) {
        return;
      }
      if (page?.pages) {
        const newGroup = filterOutNullInGroup(page);
        newPages.push(newGroup);
      } else {
        newPages.push(page);
      }
    });

    return newPages;
  };
  const filterOutNullInGroup = (group) => {
    const newPages = filterOutNullInPages(group.pages);
    const newGroup = {
      ...group,
      pages: newPages,
    };
    return newGroup;
  };
  const newNavFile = navFile.map((group) => {
    return filterOutNullInGroup(group);
  });
  fse.outputFileSync(targetPath, JSON.stringify(newNavFile, null, 2), {
    flag: "w",
  });
};

export const createMetadataFile = async () => {
  // create pages
  const { markdownFiles, openApiBuffer } = await categorizeFiles();
  let openApiObj = null;
  if (openApiBuffer) {
    openApiObj = JSON.parse(openApiBuffer.toString());
  }
  // create config object
  const configObj = await getConfigObj();
  let pages = {};
  const mdPromises = [];
  markdownFiles.forEach((filename) => {
    mdPromises.push(
      (async () => {
        const sourcePath = path.join(CMD_EXEC_PATH, filename);
        const fileContent = await readFile(sourcePath);
        const contentStr = fileContent.toString();
        const page = createPage(filename, contentStr, openApiObj);
        pages = {
          ...pages,
          ...page,
        };
      })()
    );
  });
  await Promise.all(mdPromises);
  createMetadataFileFromPages(pages, configObj);
};
