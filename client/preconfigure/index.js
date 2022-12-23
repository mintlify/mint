import categorizeFiles from './categorizeFiles.js';
import { updateConfigFile } from './mintConfig.js';

const contentDirPath = process.argv[2] ?? 'content';

const preconfigure = async () => {
  const { markdownFiles, staticFiles, openApiFiles } = await categorizeFiles(contentDirPath);
  const config = await updateConfigFile(contentDirPath);
  console.log({ markdownFiles, staticFiles, openApiFiles, config });
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
