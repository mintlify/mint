import SwaggerParser from '@apidevtools/swagger-parser';
import favicons from 'favicons';
import { promises as _promises } from 'fs';
import pkg, { remove } from 'fs-extra';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import faviconConfig from '../prebuild/faviconConfig.js';
import { createPage, injectNav } from '../prebuild/injectNav.js';

const { outputFileSync, readFileSync } = pkg;
const { readdir, readFile } = _promises;

const path = process.argv[2] ?? '../docs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFileList = async (dirName, og = dirName) => {
  let files = [];
  const items = await readdir(resolve(dirName), { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await getFileList(`${dirName}/${item.name}`, og))];
    } else {
      files.push(`${dirName}/${item.name}`);
    }
  }

  return files;
};

const getFiles = async () => {
  const fileList = await getFileList(path);
  const markdownFiles = [];
  const staticFiles = [];
  let config = undefined;
  let openApi = undefined;
  const promises = [];
  fileList.forEach((filename) => {
    promises.push(
      (async () => {
        const content = await readFile(resolve(filename));
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
            outputFileSync('openapi', Buffer.from(content, 'base64').toString('utf-8'));
            const api = await SwaggerParser.validate('openapi');
            openApi = Buffer.from(JSON.stringify(api, null, 2), 'utf-8');
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
  return { markdownFiles, staticFiles, config, openApi };
};

const injectMarkdownFilesAndNav = (markdownFiles, configObj, openApiObj) => {
  let pages = {};
  markdownFiles.forEach((markdownFile) => {
    const path = __dirname + `/../src/pages/${markdownFile.path}`;
    const page = createPage(markdownFile.path, markdownFile.content, openApiObj);
    if (page != null) {
      pages = {
        ...pages,
        ...page,
      };
    }
    outputFileSync(path, Buffer.from(markdownFile.content), { flag: 'w' });
  });

  console.log(`📄  ${markdownFiles.length} pages injected`);

  injectNav(pages, configObj);
};

const injectStaticFiles = (staticFiles) => {
  staticFiles.forEach((staticFile) => {
    const path = __dirname + `/../public/${staticFile.path}`;
    outputFileSync(path, Buffer.from(staticFile.content), { flag: 'w' });
  });

  console.log(`📄  ${staticFiles.length} static files injected`);
};

const injectConfig = (config) => {
  const path = __dirname + `/../src/mint.json`;
  outputFileSync(path, Buffer.from(config), { flag: 'w' });
  console.log('⚙️  Config file set properly');
};

const injectOpenApi = (openApi) => {
  const path = __dirname + `/../src/openapi.json`;
  if (openApi) {
    outputFileSync(path, Buffer.from(openApi), { flag: 'w' });
    console.log('🖥️  OpenAPI file detected and set as openapi.json');
    return;
  }
  outputFileSync(path, '{}', { flag: 'w' });
};

const injectFavicons = async (config) => {
  const buffer = Buffer.from(config);
  const configJSON = JSON.parse(buffer.toString());

  if (configJSON?.favicon == null) return;

  const desiredPath = resolve(__dirname + `/../public/${configJSON.favicon}`);
  const favicon = readFileSync(desiredPath);
  if (favicon == null) return;
  console.log('Generating favicons...');
  favicons(favicon, faviconConfig(config?.name), (err, response) => {
    if (err) {
      console.log(err.message); // Error description e.g. "An unknown error has occurred"
      return;
    }
    response.images.forEach((img) => {
      const path = __dirname + `/../public/favicons/${img.name}`;
      outputFileSync(path, Buffer.from(img.contents), { flag: 'w' });
    });
    response.files.forEach((file) => {
      const path = __dirname + `/../public/favicons/${file.name}`;
      outputFileSync(path, file.contents, { flag: 'w' });
    });
    console.log('Favicons generated');
  });
};

const deleteExistingOpenApi = async () => {
  const path = __dirname + '/../openapi';
  await remove(path);
};

const getAllFilesAndConfig = async () => {
  await deleteExistingOpenApi();
  const { markdownFiles, staticFiles, config, openApi } = await getFiles();
  const openApiObj = openApi == null ? null : JSON.parse(openApi.toString());
  const configObj = JSON.parse(config.toString());
  injectMarkdownFilesAndNav(markdownFiles, configObj, openApiObj);
  injectStaticFiles(staticFiles);
  injectOpenApi(openApi);
  injectConfig(config);
  injectFavicons(config);
};

(async function () {
  try {
    console.log('🔍  Fetching files');
    await getAllFilesAndConfig();
  } catch (error) {
    console.log(error);
    console.error('⚠️   Error while prebuilding documents');
  }
})();
