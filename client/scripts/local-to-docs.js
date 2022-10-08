import { existsSync } from 'fs';
import { promises } from 'fs';
import { resolve } from 'path';

const { readdir, copyFile } = promises;

const pathToMoveTo = process.argv[2] ?? '../docs';

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

const moveConfig = async () => {
  try {
    const configPath = resolve('./src/mint.json');
    if (existsSync(configPath)) {
      console.log('⚙️ Config file detected');
      await copyFile(configPath, resolve(`${pathToMoveTo}/mint.json`));
      console.log('🌿 Config file moved to mint.json');
    }
  } catch (err) {
    console.log(err);
  }
};

const moveFiles = async () => {
  moveConfig();
  let publicFileList = await getFileList('./public');
  let mdxFileList = await getFileList('./src/pages');
  publicFileList = publicFileList.filter((filename) => {
    const startsWith = filename.startsWith('./public/favicons/');
    const endsWith = filename.endsWith('.DS_Store');
    return !startsWith && !endsWith;
  });
  mdxFileList = mdxFileList.filter((filename) => {
    const extension =
      filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
    return extension && (extension === 'mdx' || extension === 'md');
  });
  publicFileList.forEach(async (filename) => {
    const path = filename.substring(8);
    await copyFile(resolve(filename), resolve(`${pathToMoveTo}${path}`));
  });
  console.log(`📄  ${publicFileList.length} static files moved to ${pathToMoveTo}`);

  mdxFileList.forEach(async (filename) => {
    const path = filename.substring(11);
    await copyFile(resolve(filename), resolve(`${pathToMoveTo}${path}`));
  });
  console.log(`📄  ${mdxFileList.length} pages moved to ${pathToMoveTo}`);
};

(async function () {
  try {
    console.log('🗂  Moving files');
    await moveFiles();
  } catch (error) {
    console.log(error);
    console.error('⚠️   Error while prebuilding documents');
  }
})();
