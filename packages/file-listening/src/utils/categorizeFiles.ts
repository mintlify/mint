import { promises as _promises } from "fs";
import pathUtil from "path";

import { CMD_EXEC_PATH } from "../constants.js";
import openApiCheck from "./openApiCheck.js";

const { readdir } = _promises;

const getFileList = async (dirName: string, og = dirName) => {
  let files = [] as { path: string; isSymbolicLink: boolean; name: string }[];
  const items = await readdir(dirName, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await getFileList(`${dirName}/${item.name}`, og))];
    } else {
      const path = `${dirName}/${item.name}`;
      const name = path.replace(og, "");
      files.push({ path, isSymbolicLink: item.isSymbolicLink(), name });
    }
  }

  return files;
};

const categorizeFiles = async (): Promise<{
  markdownFiles: string[];
  staticFiles: string[];
  openApi: object | undefined;
}> => {
  const allFilesInCmdExecutionPath = await getFileList(CMD_EXEC_PATH);
  const markdownFiles = [] as any[];
  const staticFiles = [] as any[];
  const openApiFiles = [] as any[];

  for (const file of allFilesInCmdExecutionPath) {
    const extension = pathUtil.parse(file.name).ext.slice(1);
    let isOpenApi = false;
    if (
      extension &&
      (extension === "mdx" || extension === "md" || extension === "tsx")
    ) {
      markdownFiles.push(file.name);
    } else if (
      extension &&
      (extension === "json" || extension === "yaml" || extension === "yml")
    ) {
      const openApiInfo = await openApiCheck(
        pathUtil.join(CMD_EXEC_PATH, file.name)
      );
      isOpenApi = openApiInfo.isOpenApi;
      if (isOpenApi) {
        const fileName = pathUtil.parse(file.name).base;
        openApiFiles.push({
          name: fileName.substring(0, fileName.lastIndexOf(".")),
          openapi: openApiInfo.openapi,
        });
      }
    } else if (!file.name.endsWith("mint.json") && !isOpenApi) {
      // all other files
      staticFiles.push(file.name);
    }
  }

  const openApi = {
    files: openApiFiles,
  };

  return { markdownFiles, staticFiles, openApi };
};

export default categorizeFiles;
