import SwaggerParser from '@apidevtools/swagger-parser';

export const getFileExtension = (filename) => {
  return filename.substring(filename.lastIndexOf('.') + 1, filename.length) || filename;
};

export const openApiCheck = async (path) => {
  let spec;
  let isOpenApi = false;
  try {
    spec = await SwaggerParser.validate(path);
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
    if (page.hasOwnProperty('pages')) {
      const newGroup = filterOutNullInGroup(page);
      newPages.push(newGroup);
    } else {
      newPages.push(page);
    }
  });

  return newPages;
};
