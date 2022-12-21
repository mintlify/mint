import axios from 'axios';
import fs from 'fs-extra';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { createPage, injectNav } from './injectNav.js';

const API_ENDPOINT = 'https://server.mintlify.com';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const injectMarkdownFilesAndNav = (markdownFiles, openApi, config) => {
  let pages = {};
  markdownFiles.forEach((markdownFile) => {
    const path = __dirname + `/../src/pages/${markdownFile.path}`;
    const page = createPage(markdownFile.path, markdownFile.content, openApi);
    if (page != null) {
      pages = {
        ...pages,
        ...page,
      };
    }

    fs.outputFileSync(path, Buffer.from(markdownFile.content), { flag: 'w' });
  });

  console.log(`📄  ${markdownFiles.length} pages injected`);

  injectNav(pages, config);
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
  fs.outputFileSync(path, JSON.stringify(config), { flag: 'w' });
  console.log('⚙️  Config file set properly as mint.json');
};

const injectOpenApi = async (openApi) => {
  const path = __dirname + `/../src/openapi.json`;
  if (openApi) {
    fs.outputFileSync(path, JSON.stringify(openApi), { flag: 'w' });
    console.log('🖥️  OpenAPI file detected and set as openapi.json');
    return;
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
  injectOpenApi(openApi);
  injectConfig(config);
  injectMarkdownFilesAndNav(markdownFiles, openApi, config);
  injectStaticFiles(staticFiles);
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
