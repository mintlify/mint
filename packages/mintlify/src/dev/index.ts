import fs from "fs";
import { promises as _promises } from "fs";
import fse from "fs-extra";
import path from "path";
import shell from "shelljs";
import SwaggerParser from "@apidevtools/swagger-parser";
import { createPage, injectNav } from "./injectNav.js";
import { CMD_EXEC_PATH, CLIENT_PATH } from "../constants.js";

const { readdir, readFile } = _promises;

const getFileList = async (dirName: string, og = dirName) => {
  let files = [];
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

const copyFiles = async () => {
  shell.cd(CMD_EXEC_PATH);
  const markdownFiles = [];
  const staticFiles = [];
  const allFilesInDocsFolder = await getFileList(CMD_EXEC_PATH);
  const promises = [];
  let openApi = undefined;
  allFilesInDocsFolder.forEach((file) => {
    promises.push(
      (async () => {
        const extension =
          file.name.substring(
            file.name.lastIndexOf(".") + 1,
            file.name.length
          ) || file.name;
        if (
          extension &&
          (extension === "mdx" || extension === "md" || extension === "tsx")
        ) {
          markdownFiles.push(file.name);
        } else if (
          extension &&
          (extension === "json" || extension === "yaml" || extension === "yml")
        ) {
          try {
            const fileContent = await readFile(file.path);
            fse.outputFileSync("openapi", fileContent.toString("utf-8"));
            const api = await SwaggerParser.validate("openapi");
            openApi = Buffer.from(JSON.stringify(api, null, 2), "utf-8");
          } catch {
            // not valid openApi
          }
        }
        if (
          !file.name.endsWith("mint.config.json") ||
          !file.name.endsWith("mint.json")
        ) {
          // all other files
          staticFiles.push(file.name);
        }
      })()
    );
  });
  await Promise.all(promises);

  const configTargetPath = path.join(CLIENT_PATH, "src", "mint.json");
  fse.removeSync(configTargetPath);
  let configObj = null;
  let configPath = null;
  if (fs.existsSync(path.join(CMD_EXEC_PATH, "mint.config.json"))) {
    configPath = path.join(CMD_EXEC_PATH, "mint.config.json");
  }

  if (fs.existsSync(path.join(CMD_EXEC_PATH, "mint.json"))) {
    configPath = path.join(CMD_EXEC_PATH, "mint.json");
  }

  if (configPath) {
    await fse.remove(configTargetPath);
    await fse.copy(configPath, configTargetPath);
    const configContents = await readFile(configPath);
    configObj = JSON.parse(configContents.toString());
  }

  const openApiTargetPath = path.join(CLIENT_PATH, "src", "openapi.json");
  let openApiObj = null;
  if (openApi) {
    await fse.outputFile(openApiTargetPath, Buffer.from(openApi), {
      flag: "w",
    });
    openApiObj = JSON.parse(openApi.toString());
  } else {
    fse.outputFileSync(openApiTargetPath, "{}", { flag: "w" });
  }
  let pages = {};
  const mdPromises = [];
  markdownFiles.forEach(async (filename) => {
    mdPromises.push(
      (async () => {
        const sourcePath = path.join(CMD_EXEC_PATH, filename);
        const pagesDir = path.join(CLIENT_PATH, "src", "pages");
        const targetPath = path.join(pagesDir, filename);

        await fse.remove(targetPath);
        await fse.copy(sourcePath, targetPath);

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
  injectNav(pages, configObj);

  staticFiles.forEach(async (filename) => {
    const sourcePath = path.join(CMD_EXEC_PATH, filename);
    const publicDir = path.join(CLIENT_PATH, "public");
    const targetPath = path.join(publicDir, filename);

    await fse.remove(targetPath);
    await fse.copy(sourcePath, targetPath);
  });
};

const dev = async () => {
  // check for mint.json before copying over files
  await copyFiles();
};

export default dev;
