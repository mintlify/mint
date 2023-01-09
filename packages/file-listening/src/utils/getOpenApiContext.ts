export const extractMethodAndEndpoint = (
  api: string
): { method?: string; endpoint: string; filename?: string } => {
  const methodRegex = /(get|post|put|delete|patch)\s/i;
  const trimmed = api.trim();
  const foundMethod = trimmed.match(methodRegex);

  const startIndexOfMethod = foundMethod ? api.indexOf(foundMethod[0]) : 0;
  const endIndexOfMethod = foundMethod
    ? startIndexOfMethod + foundMethod[0].length - 1
    : 0;

  const filename = api.substring(0, startIndexOfMethod).trim();

  return {
    method: foundMethod ? foundMethod[0].slice(0, -1).toUpperCase() : undefined,
    endpoint: api.substring(endIndexOfMethod).trim(),
    filename: filename ? filename : undefined,
  };
};

export const getOpenApiOperationMethodAndEndpoint = (
  openApi: any,
  openApiMetaField: string
) => {
  const { endpoint, method, filename } =
    extractMethodAndEndpoint(openApiMetaField);

  let path: any;

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

  const { operation } = getOpenApiOperationMethodAndEndpoint(
    openApi,
    openApiMetaField
  );

  if (operation == null) {
    return {};
  }

  return {
    title: operation.summary,
    description: operation.description,
  };
};
