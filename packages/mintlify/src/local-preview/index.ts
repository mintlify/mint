import Chalk from "chalk";
import open from "open";
import { promises as _promises } from "fs";
import fse, { pathExists } from "fs-extra";
import inquirer from "inquirer";
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
import { buildLogger, ensureYarn } from "../util.js";
import clearCommand from "./helper-commands/clearCommand.js";

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
    await clearCommand();
  }
};

const { readFile } = _promises;

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

const shellExec = (cmd: string) => {
  return shell.exec(cmd, { silent: true });
};

const nodeModulesExists = async () => {
  return pathExists(path.join(DOT_MINTLIFY, "mint", "client", "node_modules"));
};

const promptForYarn = async () => {
  const yarnInstalled = shell.which("yarn");
  if (!yarnInstalled) {
    await inquirer
      .prompt([
        {
          type: "confirm",
          name: "confirm",
          message: "yarn must be globally installed. Install yarn?",
          default: true,
        },
      ])
      .then(({ confirm }) => {
        if (confirm) {
          shell.exec("npm install --global yarn");
        } else {
          console.log("Installation cancelled.");
        }
      });
  }
};

const dev = async () => {
  shell.cd(HOME_DIR);
  await cleanOldFiles();
  await promptForYarn();
  const logger = buildLogger("Starting a local Mintlify instance...");
  await fse.ensureDir(path.join(DOT_MINTLIFY, "mint"));
  shell.cd(path.join(HOME_DIR, ".mintlify", "mint"));
  let runYarn = true;
  const gitInstalled = shell.which("git");
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
  if (internet && (runYarn || !(await nodeModulesExists()))) {
    if (firstInstallation) {
      logger.succeed("Local Mintlify instance initialized");
    }
    logger.start("Updating dependencies...");
    ensureYarn(logger);
    shellExec("yarn");
    if (firstInstallation) {
      logger.succeed("Installation complete");
    } else {
      logger.succeed("Dependencies updated");
    }
  }

  if (!(await nodeModulesExists())) {
    logger.fail(`Dependencies weren\'t installed, run
    
    mintlify install
    
    `);
    process.exit(1);
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
