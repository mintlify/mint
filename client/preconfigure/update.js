import { promises as _promises } from 'fs';
import fse, { pathExists, outputFile } from 'fs-extra';
import path from 'path';

import createPage from './createPage.js';
import { generateFavicons, generateNavFromPages } from './generate.js';

const { readFile } = _promises;

const getConfigPath = async (contentDirectoryPath) => {
  let configPath = null;
  if (await pathExists(path.join(contentDirectoryPath, 'mint.config.json'))) {
    configPath = path.join(contentDirectoryPath, 'mint.config.json');
  }

  if (await pathExists(path.join(contentDirectoryPath, 'mint.json'))) {
    configPath = path.join(contentDirectoryPath, 'mint.json');
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

export const updateConfigFile = async (contentDirectoryPath) => {
  const configTargetPath = 'src/_props/mint.json';
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

export const updateOpenApiFiles = async (openApiFiles) => {
  const openApiTargetPath = 'src/_props/openApiFiles.json';
  await fse.remove(openApiTargetPath);
  await fse.outputFile(openApiTargetPath, JSON.stringify(openApiFiles), {
    flag: 'w',
  });
};

export const updateStaticFiles = (contentDirectoryPath, staticFilenames) => {
  const staticFilePromises = [];
  staticFilenames.forEach((filename) => {
    staticFilePromises.push(
      (async () => {
        const sourcePath = path.join(contentDirectoryPath, filename);
        const targetPath = path.join('public', filename);
        await fse.remove(targetPath);
        await fse.copy(sourcePath, targetPath);
      })()
    );
  });
  return staticFilePromises;
};

export const updateFavicons = async (mintConfig, contentDirectoryPath) => {
  const generatedFavicons = await generateFavicons(mintConfig, contentDirectoryPath);
  const promises = [];
  generatedFavicons.images.forEach((img) => {
    promises.push(
      (async () => {
        const targetPath = path.join('public', 'favicons', img.name);
        await outputFile(targetPath, Buffer.from(img.contents), {
          flag: 'w',
        });
      })()
    );
  });
  generatedFavicons.files.forEach((file) => {
    promises.push(
      (async () => {
        const targetPath = path.join('public', 'favicons', file.name);
        await outputFile(targetPath, file.contents, { flag: 'w' });
      })()
    );
  });
  await Promise.all(promises);
};

export const updateGeneratedNav = async (pages, mintConfigNav) => {
  const generatedNav = await generateNavFromPages(pages, mintConfigNav);
  const targetPath = path.join('src', '_props', 'generatedNav.json');
  await outputFile(targetPath, JSON.stringify(generatedNav, null, 2), {
    flag: 'w',
  });
};

export const update = async (
  contentDirectoryPath,
  staticFilenames,
  openApiFiles,
  contentFilenames
) => {
  let pagesAcc = {};
  const contentPromises = [];
  contentFilenames.forEach((filename) => {
    contentPromises.push(
      (async () => {
        const sourcePath = path.join(contentDirectoryPath, filename);
        const targetPath = path.join('src', '_props', filename);

        const contentStr = (await readFile(sourcePath)).toString();
        const { slug, pageMetadata, fileContent } = await createPage(
          filename,
          contentStr,
          contentDirectoryPath,
          openApiFiles
        );
        await outputFile(targetPath, fileContent, {
          flag: 'w',
        });
        pagesAcc = {
          ...pagesAcc,
          [slug]: pageMetadata,
        };
      })()
    );
  });
  const initialFileUploadResponses = await Promise.all([
    updateConfigFile(contentDirectoryPath),
    ...contentPromises,
    ...updateStaticFiles(contentDirectoryPath, staticFilenames),
    updateOpenApiFiles(openApiFiles),
  ]);
  const mintConfig = initialFileUploadResponses[0];
  await Promise.all([
    updateGeneratedNav(pagesAcc, mintConfig.navigation),
    updateFavicons(mintConfig, contentDirectoryPath),
  ]);
  return mintConfig;
};
