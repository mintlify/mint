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
