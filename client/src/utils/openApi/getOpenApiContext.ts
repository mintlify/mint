import { extractMethodAndEndpoint } from '../api';

export const getOpenApiOperationMethodAndEndpoint = (endpointStr: string, openApi?: any) => {
  const { endpoint, method, filename } = extractMethodAndEndpoint(endpointStr);

  let path;

  openApi.files?.forEach((file: any) => {
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
