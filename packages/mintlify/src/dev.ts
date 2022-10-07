import { promises as _promises } from "fs";
import fse from "fs-extra";
import path from "path";
import shell from "shelljs";
import { CMD_EXEC_PATH, CLIENT_PATH } from "./constants.js";

const { readdir } = _promises;

const fileBelongsInPagesFolder = (filename: string) => {
  const extension =
    filename.substring(filename.lastIndexOf(".") + 1, filename.length) ||
    filename;
  return (
    extension &&
    (extension === "mdx" || extension === "md" || extension === "tsx")
  );
};

const getFileList = async (dirName: string, og = dirName) => {
  let files = [];
  const items = await readdir(dirName, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await getFileList(`${dirName}/${item.name}`, og))];
    } else {
      const path = `${dirName}/${item.name}`;
      const name = path.replace(og, "");
      files.push({ path, isSymbolicLink: item.isSymbolicLink(), name });
    }
  }

  return files;
};

const copyFiles = async () => {
  shell.cd(CMD_EXEC_PATH);
  const markdownFiles = [];
  const staticFiles = [];
  try {
    const allFilesInDocsFolder = await getFileList(CMD_EXEC_PATH);
    allFilesInDocsFolder.forEach((file) => {
      if (fileBelongsInPagesFolder(file.name)) {
        markdownFiles.push(file.name);
      } else if (!file.name.endsWith("mint.config.json")) {
        // all other files
        staticFiles.push(file.name);
      }
    });
  } catch (e) {
    // pages dir doesn't exist, empty pages array means no symlinks created
    console.error(e);
  }

  const configSourcePath = path.join(CMD_EXEC_PATH, "mint.config.json");
  const configTargetPath = path.join(CLIENT_PATH, "src", "config.json");
  fse.removeSync(configTargetPath);
  fse.copy(configSourcePath, configTargetPath);
  markdownFiles.forEach(async (filename) => {
    const sourcePath = path.join(CMD_EXEC_PATH, filename);
    const dotMintlifyPagesDir = path.join(CLIENT_PATH, "src", "pages");
    const targetPath = path.join(dotMintlifyPagesDir, filename);

    await fse.remove(targetPath);
    await fse.copy(sourcePath, targetPath);
  });

  staticFiles.forEach(async (filename) => {
    const sourcePath = path.join(CMD_EXEC_PATH, filename);
    const mintlifyPublicDir = path.join(CLIENT_PATH, "public");
    const targetPath = path.join(mintlifyPublicDir, filename);

    await fse.remove(targetPath);
    await fse.copy(sourcePath, targetPath);
  });
};

const dev = async () => {
  await copyFiles();
};

export default dev;
