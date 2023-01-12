import Chalk from "chalk";
import open from "open";
import { promises as _promises } from "fs";
import fse, { pathExists } from "fs-extra";
import inquirer from "inquirer";
import { isInternetAvailable } from "is-internet-available";
import path from "path";
import shell from "shelljs";
import { CLIENT_PATH, HOME_DIR, DOT_MINTLIFY } from "../constants.js";
import listener from "./utils/listener.js";
import { buildLogger, ensureYarn } from "../util.js";

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
    const output = shellExec("git show").stdout;
    if (output.startsWith("commit 78d764335877932a0dc305d615411dedd18bd18a")) {
      await fse.remove("client");
    }
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
  // await copyFiles(logger);
  // TODO: yarn preconfigure <insert-path>
  // TODO: get path
  run();
};

const run = () => {
  shell.cd(CLIENT_PATH);
  console.log(
    `🌿 ${Chalk.green(
      "Navigate to your local preview at http://localhost:3000"
    )}`
  );
  shell.exec("npm run dev", { async: true });
  open("http://localhost:3000");
  listener();
};

export default dev;
