import { promises as _promises } from 'fs';
import path from 'path';

import { getFileExtension, openApiCheck } from './utils.js';

const { readdir } = _promises;

const getFileList = async (dirName, og = dirName) => {
  let files = [];
  const items = await readdir(dirName, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await getFileList(`${dirName}/${item.name}`, og))];
    } else {
      const path = `${dirName}/${item.name}`;
      const name = path.replace(og, '');
      files.push(name);
    }
  }

  return files;
};

const categorizeFiles = async (contentDirPath) => {
  const allFilesInCmdExecutionPath = await getFileList(contentDirPath);
  const markdownFiles = [];
  const staticFiles = [];
  const promises = [];
  const openApiFiles = [];
  allFilesInCmdExecutionPath.forEach((filename) => {
    promises.push(
      (async () => {
        const extension = getFileExtension(filename);
        let isOpenApi = false;
        if (extension && (extension === 'mdx' || extension === 'md' || extension === 'tsx')) {
          markdownFiles.push(filename);
        } else if (
          extension &&
          (extension === 'json' || extension === 'yaml' || extension === 'yml')
        ) {
          const openApiInfo = await openApiCheck(path.join(contentDirPath, filename));
          isOpenApi = openApiInfo.isOpenApi;
          if (isOpenApi) {
            const fileName = path.parse(filename).base;
            openApiFiles.push({
              filename: fileName.substring(0, fileName.lastIndexOf('.')),
              spec: openApiInfo.spec,
            });
          }
        } else if (
          (!filename.endsWith('mint.config.json') || !filename.endsWith('mint.json')) &&
          !isOpenApi
        ) {
          // all other files
          staticFiles.push(filename);
        }
      })()
    );
  });
  await Promise.all(promises);

  return { markdownFiles, staticFiles, openApiFiles };
};

export default categorizeFiles;
