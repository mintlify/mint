// TODO - add types
import { promises as _promises } from "fs";
import { outputFile } from "fs-extra";
import path from "path";
import createPage from "./utils/createPage.js";
import { OpenApiFile } from "./utils/types.js";
import categorizeFiles from "./categorizeFiles.js";
import { CMD_EXEC_PATH } from "./constants.js";
import { getConfigObj } from "./utils/mintConfigFile.js";
const { readFile } = _promises;

// TODO: Put in prebuild package
const generateNavFromPages = (pages, mintConfigNav) => {
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

  if (mintConfigNav == null) {
    return;
  }

  let navFile = mintConfigNav.map((nav) => createNav(nav));
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
  return newNavFile;
};

// TODO: Put in prebuild package
const createPagesAcc = async (
  contentDirectoryPath: string,
  contentFilenames: string[],
  openApiFiles: OpenApiFile[],
  clientPath?: string,
  writeFiles = false
) => {
  let pagesAcc = {};
  const contentPromises = [];
  contentFilenames.forEach((filename) => {
    contentPromises.push(
      (async () => {
        const sourcePath = path.join(contentDirectoryPath, filename);

        const contentStr = (await readFile(sourcePath)).toString();
        const { slug, pageMetadata, fileContent } = await createPage(
          filename,
          contentStr,
          contentDirectoryPath,
          openApiFiles
        );
        if (clientPath && writeFiles) {
          const targetPath = path.join(clientPath, "src", "_props", filename);
          await outputFile(targetPath, fileContent, {
            flag: "w",
          });
        }
        pagesAcc = {
          ...pagesAcc,
          [slug]: pageMetadata,
        };
      })()
    );
  });
  await Promise.all(contentPromises);
  return pagesAcc;
};

export const generateNav = async () => {
  const { contentFilenames, openApiFiles } = await categorizeFiles(
    CMD_EXEC_PATH
  );
  const [pageAcc, configObj] = await Promise.all([
    createPagesAcc(CMD_EXEC_PATH, contentFilenames, openApiFiles),
    getConfigObj(CMD_EXEC_PATH),
  ]);
  return generateNavFromPages(pageAcc, configObj?.navigation);
};
