import { promises as _promises } from 'fs';
import fse, { pathExists } from 'fs-extra';
import path from 'path';

const { readFile } = _promises;

const getConfigPath = async (contentDirPath) => {
  let configPath = null;
  if (await pathExists(path.join(contentDirPath, 'mint.config.json'))) {
    configPath = path.join(contentDirPath, 'mint.config.json');
  }

  if (await pathExists(path.join(contentDirPath, 'mint.json'))) {
    configPath = path.join(contentDirPath, 'mint.json');
  }
  return configPath;
};

export const getConfigObj = async () => {
  const configPath = await getConfigPath();
  let configObj = null;
  if (configPath) {
    const configContents = await readFile(configPath);
    configObj = JSON.parse(JSON.stringify(configContents));
  }
  return configObj;
};

export const updateConfigFile = async (contentDirPath) => {
  const configTargetPath = 'src/_props/mint.json';
  await fse.remove(configTargetPath);
  let configObj = null;
  const configPath = await getConfigPath(contentDirPath);

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
