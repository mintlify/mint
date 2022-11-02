import { openApi } from '@/openapi';

import { extractMethodAndEndpoint } from './api';

export const getOpenApiOperationMethodAndEndpoint = (openapi: string) => {
  const { endpoint, method, filename } = extractMethodAndEndpoint(openapi);

  let path;

  openApi.files.forEach((file) => {
    const openApiFile = file.openapi;
    const openApiPath = openApiFile.paths && openApiFile.paths[endpoint];
    const isFilenameOrNone = !filename || filename === file.name;
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
