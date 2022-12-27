// TODO - rename to prebuild after legacy-components-imports is merged
import categorizeFiles from './categorizeFiles.js';
import { update } from './update.js';

const contentDirectoryPath = process.argv[2] ?? '../docs'; // TODO - change default folder to something more generic for self-serve

const preconfigure = async () => {
  const { contentFilenames, staticFilenames, openApiFiles } = await categorizeFiles(
    contentDirectoryPath
  );
  // generateFavicon
  await update(contentDirectoryPath, staticFilenames, openApiFiles, contentFilenames);
  // generateNav
};

(async function () {
  try {
    await preconfigure();
  } catch (error) {
    console.log(error);
    console.error('⚠️   Error while fetching config settings');
  }
})();
