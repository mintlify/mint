import axios from 'axios';
import favicons from 'favicons';
import fs from 'fs-extra';
import { dirname } from 'path';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

import faviconConfig from './faviconConfig.js';
import { createPage, injectNav } from './injectNav.js';

const API_ENDPOINT = 'https://docs.mintlify.com';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const injectMarkdownFilesAndNav = (markdownFiles, openApiObj, configObj) => {
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

    fs.outputFileSync(path, Buffer.from(markdownFile.content), { flag: 'w' });
  });

  console.log(`📄  ${markdownFiles.length} pages injected`);

  injectNav(pages, configObj);
};

const injectStaticFiles = (staticFiles) => {
  staticFiles.forEach((staticFile) => {
    const path = __dirname + `/../public/${staticFile.path}`;
    fs.outputFileSync(path, Buffer.from(staticFile.content), { flag: 'w' });
  });

  console.log(`📄  ${staticFiles.length} static files injected`);
};

const injectConfig = (config) => {
  const path = __dirname + `/../src/mint.json`;
  const buffer = Buffer.from(config);
  fs.outputFileSync(path, buffer, { flag: 'w' });
  console.log('⚙️  Config file set properly as mint.json');
  return JSON.parse(buffer.toString());
};

const injectFavicons = async (config) => {
  const buffer = Buffer.from(config);
  const configJSON = JSON.parse(buffer.toString());

  if (configJSON?.favicon == null) return;

  const desiredPath = resolve(__dirname + `/../public/${configJSON.favicon}`);
  const favicon = fs.readFileSync(desiredPath);
  if (favicon == null) return;
  console.log('Generating favicons...');
  favicons(favicon, faviconConfig(config?.name), (err, response) => {
    if (err) {
      console.log(err.message); // Error description e.g. "An unknown error has occurred"
      return;
    }
    response.images.forEach((img) => {
      const path = __dirname + `/../public/favicons/${img.name}`;
      fs.outputFileSync(path, Buffer.from(img.contents), { flag: 'w' });
    });
    response.files.forEach((file) => {
      const path = __dirname + `/../public/favicons/${file.name}`;
      fs.outputFileSync(path, file.contents, { flag: 'w' });
    });
    console.log('Favicons generated');
  });
};

const injectOpenApi = async (openApi) => {
  const path = __dirname + `/../src/openapi.json`;
  if (openApi) {
    const buffer = Buffer.from(openApi);
    fs.outputFileSync(path, buffer, { flag: 'w' });
    console.log('🖥️  OpenAPI file detected and set as openapi.json');
    return JSON.parse(buffer.toString());
  }

  fs.outputFileSync(path, '{}', { flag: 'w' });
};

const getAllFilesAndConfig = async () => {
  const ref = process.env.GIT_REF;
  const {
    data: { markdownFiles, staticFiles, config, openApi },
  } = await axios.get(`${API_ENDPOINT}/api/v1/sites/files`, {
    headers: { Authorization: `Bearer ${process.env.INTERNAL_SITE_BEARER_TOKEN}` },
    params: {
      ref,
    },
  });
  const openApiObj = await injectOpenApi(openApi);
  const configObj = await injectConfig(config);
  injectMarkdownFilesAndNav(markdownFiles, openApiObj, configObj);
  injectStaticFiles(staticFiles);
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
