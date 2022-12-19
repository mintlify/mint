import { OpenApiFile } from '@/types/openApi';

import { extractMethodAndEndpoint } from '../api';

export const getOpenApiOperationMethodAndEndpoint = (
  endpointStr: string,
  openApiFiles: OpenApiFile[]
) => {
  const { endpoint, method, filename } = extractMethodAndEndpoint(endpointStr);

  let path;

  openApiFiles.forEach((file) => {
    const openApiFile = file.spec;
    const openApiPath = openApiFile.paths && openApiFile.paths[endpoint];
    const isFilenameOrNone = !filename || filename === file.filename;
    console.log({ isFilename: filename === file.filename, filename: file.filename });
    if (openApiPath && isFilenameOrNone) {
      path = openApiPath;
    }
  });

  if (path == null) {
    return {};
  }

  let operation;
  if (method) {
    operation = (path as any)[method.toLowerCase()];
  } else {
    const firstOperationKey = Object.keys(path)[0];
    operation = (path as any)[firstOperationKey];
  }

  return {
    operation,
    method,
    path,
    endpoint,
  };
};

export const getOpenApiTitleAndDescription = (
  openApiMetaField?: string,
  openApiFiles?: OpenApiFile[]
) => {
  if (openApiFiles == null || !openApiMetaField || openApiMetaField == null) {
    return {};
  }

  const { operation } = getOpenApiOperationMethodAndEndpoint(openApiMetaField, openApiFiles);

  if (operation == null) {
    return {};
  }

  return {
    title: operation.summary,
    description: operation.description,
  };
};
