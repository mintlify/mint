import SwaggerParser from "@apidevtools/swagger-parser";
import { promises as _promises } from "fs";

const { readdir } = _promises;

export const getFileExtension = (filename) => {
  return (
    filename.substring(filename.lastIndexOf(".") + 1, filename.length) ||
    filename
  );
};

export const openApiCheck = async (path) => {
  let spec;
  let isOpenApi = false;
  try {
    spec = await SwaggerParser.validate(path);
    isOpenApi = true;
  } catch {
    // not valid openApi
  }
  return { spec, isOpenApi };
};

export const filterOutNullInGroup = (group) => {
  const newPages = filterOutNullInPages(group.pages);
  const newGroup = {
    ...group,
    pages: newPages,
  };
  return newGroup;
};

const filterOutNullInPages = (pages) => {
  if (!Array.isArray(pages)) {
    return [];
  }
  const newPages = [];
  pages.forEach((page) => {
    if (page == null) {
      return;
    }
    if (page.hasOwnProperty("pages")) {
      const newGroup = filterOutNullInGroup(page);
      newPages.push(newGroup);
    } else {
      newPages.push(page);
    }
  });

  return newPages;
};

export const getFileList = async (dirName: string, og = dirName) => {
  let files = [];
  const items = await readdir(dirName, { withFileTypes: true });

  for (const item of items) {
    if (item.isDirectory()) {
      files = [...files, ...(await getFileList(`${dirName}/${item.name}`, og))];
    } else {
      const path = `${dirName}/${item.name}`;
      const name = path.replace(og, "");
      files.push(name);
    }
  }

  return files;
};
