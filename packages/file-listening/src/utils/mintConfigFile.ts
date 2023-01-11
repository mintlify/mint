import { promises as _promises } from "fs";
import { pathExists } from "fs-extra";
import pathUtil from "path";

const { readFile } = _promises;

// TODO: Put in prebuild package
export const getConfigPath = async (
  contentDirectoryPath: string
): Promise<string | null> => {
  if (await pathExists(pathUtil.join(contentDirectoryPath, "mint.json"))) {
    return pathUtil.join(contentDirectoryPath, "mint.json");
  }
  return null;
};

// TODO: Put in prebuild package
export const getConfigObj = async (
  contentDirectoryPath: string
): Promise<any> => {
  const configPath = await getConfigPath(contentDirectoryPath);
  let configObj = null;
  if (configPath) {
    const configContents = await readFile(configPath);
    configObj = await JSON.parse(configContents.toString());
  }
  return configObj;
};
