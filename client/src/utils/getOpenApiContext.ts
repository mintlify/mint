import { extractMethodAndEndpoint } from './api';

export const getOpenApiOperationMethodAndEndpoint = (endpointStr: string, openApi?: any) => {
  const { endpoint, method } = extractMethodAndEndpoint(endpointStr);

  const path = openApi?.paths && openApi.paths[endpoint];

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
