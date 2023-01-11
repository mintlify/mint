// TODO - put in prebuild package
import path from "path";

import { getFileExtension, openApiCheck, getFileList } from "./utils.js";

const categorizeFiles = async (contentDirectoryPath: string) => {
  const allFilesInCmdExecutionPath = await getFileList(contentDirectoryPath);
  const contentFilenames = [];
  const staticFilenames = [];
  const promises = [];
  const openApiFiles = [];
  const snippets = [];
  allFilesInCmdExecutionPath.forEach((filename) => {
    promises.push(
      (async () => {
        const extension = getFileExtension(filename);
        let isOpenApi = false;
        if (extension && (extension === "mdx" || extension === "md")) {
          if (filename.startsWith("/_snippets")) {
            snippets.push(filename);
          } else {
            contentFilenames.push(filename);
          }
        } else if (
          extension &&
          (extension === "json" || extension === "yaml" || extension === "yml")
        ) {
          const openApiInfo = await openApiCheck(
            path.join(contentDirectoryPath, filename)
          );
          isOpenApi = openApiInfo.isOpenApi;
          if (isOpenApi) {
            const fileName = path.parse(filename).base;
            openApiFiles.push({
              filename: fileName.substring(0, fileName.lastIndexOf(".")),
              spec: openApiInfo.spec,
            });
          }
        } else if (
          (!filename.endsWith("mint.config.json") ||
            !filename.endsWith("mint.json")) &&
          !isOpenApi
        ) {
          // all other files
          staticFilenames.push(filename);
        }
      })()
    );
  });
  await Promise.all(promises);

  return { contentFilenames, staticFilenames, openApiFiles, snippets };
};

export default categorizeFiles;
