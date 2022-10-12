import Chalk from "chalk";
import open from "open";
import { promises as _promises } from "fs";
import fse, { pathExists } from "fs-extra";
import { isInternetAvailable } from "is-internet-available";
import path from "path";
import shell from "shelljs";
import categorizeFiles from "./utils/categorizeFiles.js";
import {
  CMD_EXEC_PATH,
  CLIENT_PATH,
  HOME_DIR,
  DOT_MINTLIFY,
  LAST_INVOCATION_PATH_FILE_LOCATION,
} from "../constants.js";
import { injectFavicons } from "./utils/injectFavicons.js";
import listener from "./utils/listener.js";
import { createPage, createMetadataFileFromPages } from "./utils/metadata.js";
import { updateConfigFile } from "./utils/mintConfigFile.js";
import { buildLogger } from "../util.js";

const { readFile } = _promises;

const saveInvocationPath = async () => {
  await fse.outputFile(LAST_INVOCATION_PATH_FILE_LOCATION, CMD_EXEC_PATH);
};

const cleanOldFiles = async () => {
  const lastInvocationPathExists = await pathExists(
    LAST_INVOCATION_PATH_FILE_LOCATION
  );
  if (!lastInvocationPathExists) return;
  const lastInvocationPath = (
    await readFile(LAST_INVOCATION_PATH_FILE_LOCATION)
  ).toString();
  if (lastInvocationPath !== CMD_EXEC_PATH) {
    // clean if invoked in new location
    shellExec("git clean -d -x -e node_modules -e last-invocation-path -f");
  }
};

const copyFiles = async (logger: any) => {
  logger.start("Syncing doc files...");
  shell.cd(CMD_EXEC_PATH);
  const { markdownFiles, staticFiles, openApiBuffer } = await categorizeFiles();

  const configObj = await updateConfigFile(logger);

  const openApiTargetPath = path.join(CLIENT_PATH, "src", "openapi.json");
  let openApiObj = null;
  if (openApiBuffer) {
    logger.succeed("OpenApi file synced");
    await fse.outputFile(openApiTargetPath, Buffer.from(openApiBuffer), {
      flag: "w",
    });
    openApiObj = JSON.parse(openApiBuffer.toString());
  } else {
    await fse.outputFile(openApiTargetPath, "{}", { flag: "w" });
  }
  let pages = {};
  const mdPromises = [];
  markdownFiles.forEach((filename) => {
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
  staticFiles.forEach((filename) => {
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
  await Promise.all([
    ...mdPromises,
    ...staticFilePromises,
    await injectFavicons(configObj, logger),
  ]);
  createMetadataFileFromPages(pages, configObj);
  logger.succeed("All files synced");
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

const shellExec = (cmd: string) => {
  return shell.exec(cmd, { silent: true });
};

const dev = async () => {
  shell.cd(HOME_DIR);
  const logger = buildLogger("Starting a local Mintlify instance...");
  await fse.ensureDir(path.join(DOT_MINTLIFY, "mint"));
  shell.cd(path.join(HOME_DIR, ".mintlify", "mint"));
  let runYarn = true;
  const gitInstalled = gitExists();
  let firstInstallation = false;
  const gitRepoInitialized = await pathExists(
    path.join(DOT_MINTLIFY, "mint", ".git")
  );
  if (!gitRepoInitialized) {
    firstInstallation = true;
    if (gitInstalled) {
      logger.start("Initializing local Mintlify instance...");
      shellExec("git init");
      shellExec(
        "git remote add -f mint-origin https://github.com/mintlify/mint.git"
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
    shellExec("git config core.sparseCheckout true");
    shellExec('echo "client/" >> .git/info/sparse-checkout');
    pullOutput = shellExec("git pull mint-origin main").stdout;
    shellExec("git config core.sparseCheckout false");
    shellExec("rm .git/info/sparse-checkout");
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

    shellExec("yarn");
    if (firstInstallation) {
      logger.succeed("Installation complete");
    } else {
      logger.succeed("Dependencies updated");
    }
  }
  if (!firstInstallation) {
    await cleanOldFiles();
  }
  await saveInvocationPath();
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
  listener();
};

export default dev;
