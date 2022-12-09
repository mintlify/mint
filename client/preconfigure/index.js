import SwaggerParser from '@apidevtools/swagger-parser';
import { promises as _promises } from 'fs';
import { pathExists } from 'fs-extra';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const { readdir, readFile } = _promises;

const path = process.argv[2] ?? 'content';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFileList = async (dirName, og = dirName) => {
  let files = [];
  const items = await readdir(resolve(dirName), { withFileTypes: true });

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

const getFiles = async () => {
  const fileList = await getFileList(path);
  const markdownFiles = [];
  const staticFiles = [];
  let config = undefined;
  let openApiFiles = [];
  const promises = [];
  console.log({ __dirname });
  fileList.forEach((filename) => {
    promises.push(
      (async () => {
        const content = await readFile(resolve(join(path, filename)));
        if (filename.endsWith('mint.config.json') || filename.endsWith('mint.json')) {
          config = content;
          return;
        }
        const absolutePath = filename.substring(path.length + 1);
        const extension =
          filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
        if (extension && (extension === 'mdx' || extension === 'md' || extension === 'tsx')) {
          markdownFiles.push({
            path: absolutePath,
            content: Buffer.from(content, 'base64'),
          });
          return;
        }

        if (extension === 'json' || extension === 'yaml' || extension === 'yml') {
          try {
            const api = await SwaggerParser.validate(join(path, filename));
            openApiFiles.push(Buffer.from(JSON.stringify(api, null, 2), 'utf-8'));
          } catch {
            // not valid openApi
          }
        }
        // every other file
        staticFiles.push({
          path: absolutePath,
          content: Buffer.from(content, 'base64'),
        });
      })()
    );
  });
  await Promise.all(promises);
  return { markdownFiles, staticFiles, config, openApiFiles };
};

const getMintJson = async () => {
  const mintJsonExists = await pathExists(join(path, 'mint.json'));
  return mintJsonExists;
  // Create nav.json
};

const getOpenApi = () => {};

const preconfigure = async () => {
  const { config } = await getFiles();
  console.log(config);
  await getMintJson();
  getOpenApi();
};

(async function () {
  try {
    console.log('🔍  Fetching config settings');
    await preconfigure();
  } catch (error) {
    console.log(error);
    console.error('⚠️   Error while fetching config settings');
  }
})();
