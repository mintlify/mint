import categorizeFiles from './categorizeFiles.js';

const path = process.argv[2] ?? 'content';

const preconfigure = async () => {
  const { markdownFiles, staticFiles, openApiFiles } = await categorizeFiles(path);
  console.log({ markdownFiles, staticFiles, openApiFiles });
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
