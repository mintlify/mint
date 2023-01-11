// TODO: Add Types
import fse from "fs-extra";
import { promises as _promises } from "fs";
import { getConfigPath } from "./utils/mintConfigFile.js";
import { CLIENT_PATH, CMD_EXEC_PATH } from "./constants.js";
import { join } from "path";
import { generateNav } from "./generate.js";
import categorizeFiles from "./categorizeFiles.js";

const { readFile } = _promises;

// TODO: Put in prebuild package
export const updateFile = async (
  contentDirectoryPath: string,
  targetDirectoryPath: string,
  filename: string
) => {
  const sourcePath = join(contentDirectoryPath, filename);
  const targetPath = join(targetDirectoryPath, filename);
  await fse.remove(targetPath);
  await fse.copy(sourcePath, targetPath);
};

export const updateConfigFile = async (contentDirectoryPath: string) => {
  const configTargetPath = join(CLIENT_PATH, "src/_props/mint.json");
  await fse.remove(configTargetPath);
  let configObj = null;
  const configPath = await getConfigPath(contentDirectoryPath);

  if (configPath) {
    await fse.remove(configTargetPath);
    await fse.copy(configPath, configTargetPath);
    const configContents = await readFile(configPath);
    configObj = JSON.parse(configContents.toString());
  } else {
    process.exit(1);
  }
  return configObj;
};

export const updateGeneratedNav = async () => {
  const generatedNav = await generateNav();
  const targetPath = join(CLIENT_PATH, "src", "_props", "generatedNav.json");
  await fse.outputFile(targetPath, JSON.stringify(generatedNav, null, 2), {
    flag: "w",
  });
};

export const updateOpenApiFiles = async () => {
  const { openApiFiles } = await categorizeFiles(CMD_EXEC_PATH);
  const targetPath = join(CLIENT_PATH, "src", "_props", "openApiFiles.json");
  await fse.outputFile(targetPath, JSON.stringify(openApiFiles, null, 2), {
    flag: "w",
  });
};
