// TODO - add types
import fse from "fs-extra";
import { promises as _promises } from "fs";
import matter from "gray-matter";
import pathUtil from "path";

import categorizeFiles from "./utils/categorizeFiles.js";
import { getConfigObj } from "./utils/mintConfigFile.js";
import { getOpenApiTitleAndDescription } from "./utils/getOpenApiContext.js";
import { slugToTitle } from "./utils/slugToTitle.js";
import { CLIENT_PATH, CMD_EXEC_PATH } from "./constants.js";

const { readFile } = _promises;

const getMetadata = (fileContents: string) => {
  const { data } = matter(fileContents);
  return data;
};

export const createPage = (
  path: string,
  content: string,
  openApi: object | undefined
) => {
  const slug = path.replace(/\.mdx?$/, "").substring(1);
  let defaultTitle = slugToTitle(slug);
  const metadata = getMetadata(content);
  // Append data from OpenAPI if it exists
  const { title, description } = getOpenApiTitleAndDescription(
    openApi,
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
  const targetPath = pathUtil.join(CLIENT_PATH, "src", "metadata.json");
  const createNav = (nav) => {
    return {
      group: nav.group,
      version: nav.version,
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
    const newPages = [] as any[];
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
  const { markdownFiles, openApi } = await categorizeFiles();
  // create config object
  const configObj = await getConfigObj();
  let pages = {};
  for (const filename of markdownFiles) {
    const sourcePath = pathUtil.join(CMD_EXEC_PATH, filename);
    const fileContent = await readFile(sourcePath);
    const contentStr = fileContent.toString();
    const page = createPage(filename, contentStr, openApi);
    pages = {
      ...pages,
      ...page,
    };
  }
  createMetadataFileFromPages(pages, configObj);
};
