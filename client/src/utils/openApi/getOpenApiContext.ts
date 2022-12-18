import { PageMetaTags } from '@/types/metadata';
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

// TODO - refactor to return a single OpenApiFile
export const getRelevantOpenApiSpec = (
  pageMetadata: PageMetaTags,
  openApiFiles?: OpenApiFile[]
): OpenApiFile[] | undefined => {
  if (!openApiFiles) {
    return undefined;
  }
  if (pageMetadata?.openapi) {
    const { filename } = extractMethodAndEndpoint(pageMetadata.openapi);
    if (!filename) {
      // if no filename is defined return all files
      return openApiFiles;
    } else {
      openApiFiles.forEach((file) => {
        if (file.filename === filename) {
          return [file];
        }
      });
    }
  }
  return undefined;
};
