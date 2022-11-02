import openapiJSON from './openapi.json';

type OpenAPIFiles = {
  files: {
    name: string;
    openapi: any;
  }[];
};

export const openApi: OpenAPIFiles = openapiJSON;
