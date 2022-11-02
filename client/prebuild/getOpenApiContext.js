export const extractMethodAndEndpoint = (api) => {
  const methodRegex = /^get|post|put|delete|patch/i;
  const trimmed = api.trim();
  const foundMethod = trimmed.match(methodRegex);

  const startIndexOfMethod = foundMethod ? api.indexOf(foundMethod[0]) : 0;
  const endIndexOfMethod = foundMethod ? startIndexOfMethod + foundMethod[0].length : 0;

  const filename = api.substring(0, startIndexOfMethod).trim();

  return {
    method: foundMethod ? foundMethod[0].toUpperCase() : undefined,
    endpoint: api.substring(endIndexOfMethod).trim(),
    filename: filename ? filename : undefined,
  };
};

export const getOpenApiOperationMethodAndEndpoint = (openApi, openApiMetaField) => {
  const { endpoint, method, filename } = extractMethodAndEndpoint(openApiMetaField);

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
    operation = path[method.toLowerCase()];
  } else {
    const firstOperationKey = Object.keys(path)[0];
    operation = path[firstOperationKey];
  }

  return {
    operation,
    method,
    endpoint,
  };
};

export const getOpenApiTitleAndDescription = (openApi, openApiMetaField) => {
  if (openApi == null || !openApiMetaField || openApiMetaField == null) {
    return {};
  }

  const { operation } = getOpenApiOperationMethodAndEndpoint(openApi, openApiMetaField);

  if (operation == null) {
    return {};
  }

  return {
    title: operation.summary,
    description: operation.description,
  };
};
