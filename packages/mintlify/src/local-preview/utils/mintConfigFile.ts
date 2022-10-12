import { promises as _promises } from "fs";
import fse, { pathExists } from "fs-extra";
import path from "path";

import { CLIENT_PATH, CMD_EXEC_PATH } from "../../constants.js";

const { readFile } = _promises;

const getConfigPath = async (): Promise<string | null> => {
  let configPath = null;
  if (await pathExists(path.join(CMD_EXEC_PATH, "mint.config.json"))) {
    configPath = path.join(CMD_EXEC_PATH, "mint.config.json");
  }

  if (await pathExists(path.join(CMD_EXEC_PATH, "mint.json"))) {
    configPath = path.join(CMD_EXEC_PATH, "mint.json");
  }
  return configPath;
};

export const getConfigObj = async (): Promise<object | null> => {
  const configPath = await getConfigPath();
  let configObj = null;
  if (configPath) {
    const configContents = await readFile(configPath);
    configObj = JSON.parse(configContents.toString());
  }
  return configObj;
};

export const updateConfigFile = async (logger: any) => {
  const configTargetPath = path.join(CLIENT_PATH, "src", "mint.json");
  await fse.remove(configTargetPath);
  let configObj = null;
  const configPath = await getConfigPath();

  if (configPath) {
    await fse.remove(configTargetPath);
    await fse.copy(configPath, configTargetPath);
    logger.succeed("mint config file synced");
    const configContents = await readFile(configPath);
    configObj = JSON.parse(configContents.toString());
  } else {
    logger.fail("Must be ran in a directory where a mint.json file exists.");
    process.exit(1);
  }
  return configObj;
};
