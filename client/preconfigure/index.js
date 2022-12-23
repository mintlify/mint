// TODO - rename to prebuild after legacy-components-imports is merged
import categorizeFiles from './categorizeFiles.js';
import { update } from './update.js';

const contentDirectoryPath = process.argv[2] ?? 'content';

const preconfigure = async () => {
  const { contentFilenames, staticFilenames, openApiFiles } = await categorizeFiles(
    contentDirectoryPath
  );
  // generateFavicon
  const mintConfig = await update(contentDirectoryPath, staticFilenames, openApiFiles);
  // generateNav
  console.log({ contentFilenames, staticFilenames, openApiFiles, mintConfig });
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
