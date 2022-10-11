import { promises as _promises } from "fs";

const { readdir } = _promises;

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

export default getFileList;
