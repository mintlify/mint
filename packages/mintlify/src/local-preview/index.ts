import Chalk from "chalk";
import open from "open";
import { promises as _promises } from "fs";
import fse, { pathExists } from "fs-extra";
import { isInternetAvailable } from "is-internet-available";
import path from "path";
import shell from "shelljs";
import SwaggerParser from "@apidevtools/swagger-parser";
import { createPage, injectNav } from "./injectNav.js";
import { CMD_EXEC_PATH, CLIENT_PATH, INSTALL_PATH } from "../constants.js";
import { buildLogger } from "../util.js";

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

const copyFiles = async (logger: any) => {
  logger.start("Syncing doc files...");
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
          try {
            const fileContent = await readFile(file.path);
            fse.outputFileSync("openapi", fileContent.toString("utf-8"));
            const api = await SwaggerParser.validate("openapi");
            openApi = Buffer.from(JSON.stringify(api, null, 2), "utf-8");
            isOpenApi = true;
          } catch {
            // not valid openApi
          }
        } else if (
          (!file.name.endsWith("mint.config.json") ||
            !file.name.endsWith("mint.json")) &&
          !isOpenApi
        ) {
          // all other files
          staticFiles.push(file.name);
        }
      })()
    );
  });
  await Promise.all(promises);
  await fse.remove("openapi");

  const configTargetPath = path.join(CLIENT_PATH, "src", "mint.json");
  await fse.remove(configTargetPath);
  let configObj = null;
  let configPath = null;
  if (await pathExists(path.join(CMD_EXEC_PATH, "mint.config.json"))) {
    configPath = path.join(CMD_EXEC_PATH, "mint.config.json");
  }

  if (await pathExists(path.join(CMD_EXEC_PATH, "mint.json"))) {
    configPath = path.join(CMD_EXEC_PATH, "mint.json");
  }

  if (configPath) {
    await fse.remove(configTargetPath);
    await fse.copy(configPath, configTargetPath);
    const configContents = await readFile(configPath);
    configObj = JSON.parse(configContents.toString());
  } else {
    logger.fail("Must be ran in a directory where a mint.json file exists.");
    process.exit(1);
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
  const staticFilePromises = [];
  staticFiles.forEach(async (filename) => {
    staticFilePromises.push(
      (async () => {
        const sourcePath = path.join(CMD_EXEC_PATH, filename);
        const publicDir = path.join(CLIENT_PATH, "public");
        const targetPath = path.join(publicDir, filename);

        await fse.remove(targetPath);
        await fse.copy(sourcePath, targetPath);
      })()
    );
  });
  await Promise.all([...mdPromises, ...staticFilePromises]);
  injectNav(pages, configObj);
  logger.succeed("Files synced");
};

const gitExists = () => {
  let doesGitExist = true;
  try {
    shell.exec("git --version", { silent: true });
  } catch (e) {
    doesGitExist = false;
  }
  return doesGitExist;
};

const dev = async () => {
  shell.cd(INSTALL_PATH);
  const logger = buildLogger("Starting local Mintlify...");
  if (!(await pathExists(path.join(INSTALL_PATH, "mint")))) {
    shell.exec("mkdir mint");
  }
  shell.cd("mint");
  let runYarn = true;
  const gitInstalled = gitExists();
  let firstInstallation = false;
  if (!(await pathExists(path.join(INSTALL_PATH, "mint", ".git")))) {
    firstInstallation = true;
    if (gitInstalled) {
      logger.start("Initializing local Mintlify instance...");
      shell.exec("git init", { silent: true });
      shell.exec(
        "git remote add -f mint-origin https://github.com/mintlify/mint.git",
        { silent: true }
      );
    } else {
      logger.fail(
        "git must be installed (https://github.com/git-guides/install-git)"
      );
      process.exit(1);
    }
  }

  const internet = await isInternetAvailable();
  let pullOutput = null;
  if (internet && gitInstalled) {
    shell.exec("git config core.sparseCheckout true", { silent: true });
    shell.exec('echo "client/" >> .git/info/sparse-checkout', { silent: true });
    pullOutput = shell.exec("git pull mint-origin main", {
      silent: true,
    }).stdout;
    shell.exec("git config core.sparseCheckout false", { silent: true });
    shell.exec("rm .git/info/sparse-checkout", { silent: true });
  }
  if (pullOutput === "Already up to date.\n") {
    runYarn = false;
  }
  shell.cd(CLIENT_PATH);
  if (internet && runYarn) {
    if (firstInstallation) {
      logger.succeed("Local Mintlify instance initialized");
    }
    logger.start("Updating dependencies...");

    shell.exec("yarn", { silent: true });
    if (firstInstallation) {
      logger.succeed("Installation complete");
    } else {
      logger.succeed("Dependencies updated");
    }
  }

  // TODO check for mint.json before copying over files
  await copyFiles(logger);
  run();
};

const run = () => {
  shell.cd(CLIENT_PATH);
  console.log(
    `🌿 ${Chalk.green(
      "Navigate to your local preview at https://localhost:3000"
    )}`
  );
  shell.exec("npm run dev", { async: true });
  open("http://localhost:3000");
};

export default dev;
