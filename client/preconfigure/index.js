// TODO - rename to prebuild after legacy-components-imports is merged
import categorizeFiles from './categorizeFiles.js';
import { updateAndReturnMintConfig } from './update.js';

const contentDirPath = process.argv[2] ?? 'content';

const preconfigure = async () => {
  const { markdownFilenames, staticFilenames, openApiFiles } = await categorizeFiles(
    contentDirPath
  );
  const mintConfig = await updateAndReturnMintConfig(contentDirPath, staticFilenames, openApiFiles);
  // generateNav
  // generateFavicon
  console.log({ markdownFilenames, staticFilenames, openApiFiles, mintConfig });
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
