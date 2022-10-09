export const extractMethodAndEndpoint = (api) => {
  const methodRegex = /^get|post|put|delete|patch/i;
  const trimmed = api.trim();
  const foundMethod = trimmed.match(methodRegex);

  const endIndexOfMethod = foundMethod
    ? api.indexOf(foundMethod[0]) + foundMethod[0].length
    : 0;

  return {
    method: foundMethod ? foundMethod[0].toUpperCase() : undefined,
    endpoint: api.substring(endIndexOfMethod).trim(),
  };
};

export const getOpenApiOperationMethodAndEndpoint = (
  openApiObj,
  openApiMetaField
) => {
  const { endpoint, method } = extractMethodAndEndpoint(openApiMetaField);

  const path = openApiObj?.paths && openApiObj.paths[endpoint];

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

export const getOpenApiTitleAndDescription = (openApiObj, openApiMetaField) => {
  if (openApiObj == null || !openApiMetaField || openApiMetaField == null) {
    return {};
  }

  const { operation } = getOpenApiOperationMethodAndEndpoint(
    openApiObj,
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
