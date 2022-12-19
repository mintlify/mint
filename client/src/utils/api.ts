import { AxiosRequestHeaders } from 'axios';
import isAbsoluteUrl from 'is-absolute-url';

import { ParamProps } from '@/components/Param';
import { Component } from '@/enums/components';
import { ApiConfig } from '@/types/config';
import { OpenApiFile } from '@/types/openApi';
import { ApiComponent } from '@/ui/ApiPlayground';

export type Child = {
  props: ParamProps & { mdxType: string };
};

export type Children = Child[];

export type Param = {
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  enum?: string[];
  format?: string;
  group?: string;
  properties?: Param[];
};

export type ParamGroup = {
  name: string;
  params: Param[];
};

const paramTypeToNameMap: Record<string, string> = {
  auth: 'Authorization',
  query: 'Query',
  path: 'Path',
  body: 'Body',
  header: 'Header',
};

const getPlaceholderFromObjectOrString = (value: any): undefined => {
  return (typeof value === 'string' && value) || value?.value?.toString();
};

const removeEmpty = (obj?: Object) => {
  if (!obj) return obj;

  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v || v === false));
};

const potentiallAddPathParams = (inputUrl: string, inputData: Record<string, any>) => {
  let url = inputUrl;
  if (inputData.Path) {
    Object.entries(inputData.Path).forEach(([pathName, pathValue]: [string, any]) => {
      if (!pathValue) {
        return;
      }
      url = url.replace(`{${pathName}}`, pathValue);
    });
  }

  return url;
};

const getBody = (obj: Object, _: string) => {
  // TODO: Add support for files in getBody with multipart/form-data
  // if (contentType === 'multipart/form-data') {
  //   let cleanedObj = removeEmpty(obj);
  //   const bodyFormData = new FormData();
  //   for (var key in cleanedObj) {
  //     bodyFormData.append(key, cleanedObj[key]);
  //   }
  //   return bodyFormData;
  // }
  return removeEmpty(obj);
};

const getHeaders = (obj: AxiosRequestHeaders, contentType: string): AxiosRequestHeaders => {
  const newObj = Object.assign({}, obj);
  newObj['Content-Type'] = contentType;
  return newObj;
};

export const getApiContext = (
  apiBase: string,
  path: string,
  inputData: Record<string, any>,
  contentType: string,
  apiConfig?: ApiConfig
): { url: string; body?: Object; params?: Object; headers?: AxiosRequestHeaders } => {
  const endpoint = `${apiBase}${path}`;
  const url = potentiallAddPathParams(endpoint, inputData);
  const body = getBody(inputData.Body, contentType);
  const params = removeEmpty(inputData.Query);
  const headers = getHeaders(inputData.Header || {}, contentType);

  if (inputData.Authorization) {
    const authEntires = Object.entries(inputData.Authorization);
    if (apiConfig?.auth?.method === 'basic' && authEntires.length === 2) {
      let [[usernameField, username], [, password]]: any = authEntires;
      // Get order based on username:password
      if (
        (apiConfig?.auth.name && apiConfig?.auth.name.split(':')[0] !== usernameField) ||
        (!apiConfig?.auth.name && usernameField.toLowerCase() !== 'username')
      ) {
        // switch orders
        const temp = username;
        username = password;
        password = temp;
      }
      headers.Authorization =
        'Basic ' + Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
    } else {
      authEntires.forEach(([authName, authValue]: [string, any]) => {
        if (authName === 'Bearer') {
          headers.Authorization = `Bearer ${authValue}`;
          return;
        }

        headers[authName] = authValue;
      });
    }
  }

  return { url, body, params, headers };
};

export const extractMethodAndEndpoint = (
  api: string
): { method?: string; endpoint: string; filename?: string } => {
  const methodRegex = /(get|post|put|delete|patch)\s/i;
  const foundMethod = api.trim().match(methodRegex);

  const startIndexOfMethod = foundMethod ? api.indexOf(foundMethod[0]) : 0;
  const endIndexOfMethod = foundMethod ? startIndexOfMethod + foundMethod[0].length - 1 : 0;
  // filename is completely optional and only used for versioning.
  const filename = api.substring(0, startIndexOfMethod).trim();

  // Filename is used when we have multiple openapi files. Filename will be undefined
  // for non-openapi pages and openapi pages with a single file.
  return {
    method: foundMethod ? foundMethod[0].slice(0, -1).toUpperCase() : undefined,
    endpoint: api.substring(endIndexOfMethod).trim(),
    filename: filename ? filename : undefined,
  };
};

export const extractBaseAndPath = (
  endpoint: string,
  apiBaseIndex = 0,
  baseUrl: string | string[] | undefined,
  openApiFiles?: OpenApiFile[]
) => {
  let fullEndpoint;
  const openApiServers =
    openApiFiles &&
    openApiFiles.reduce((acc: any, file: OpenApiFile) => {
      return acc.concat(file.spec?.servers);
    }, []);
  baseUrl = baseUrl ?? openApiServers?.map((server: { url: string }) => server.url);
  if (isAbsoluteUrl(endpoint)) {
    fullEndpoint = endpoint;
  } else if (baseUrl) {
    const selectedBase = Array.isArray(baseUrl) ? baseUrl[apiBaseIndex] : baseUrl;
    fullEndpoint = `${selectedBase}${endpoint}`;
  } else {
    throw new Error('Invalid endpoint');
  }

  const url = new URL(fullEndpoint);
  const base = url.origin;
  const path = fullEndpoint.substring(fullEndpoint.indexOf(base) + base.length);

  return {
    path,
    base,
  };
};

const getParams = (apiComponents?: ApiComponent[]): Param[] => {
  const paramFields = apiComponents
    ?.filter(
      (apiComponent) =>
        apiComponent.type === Component.ParamField ||
        apiComponent.type === Component.Param ||
        apiComponent.name === Component.ParamField ||
        apiComponent.name === Component.Param
    )
    .map((apiComponent) => {
      const attributesMap: Record<any, any> = {};
      apiComponent?.attributes?.forEach((attribute: any) => {
        attributesMap[attribute.name] = attribute.value;
      });

      const expandable = apiComponent.children?.find(
        (child: any) => child.name === Component.Expandable
      );
      if (expandable?.children != null) {
        attributesMap.properties = getParams(expandable.children);
      }

      return attributesMap;
    });

  const params: Param[] = [];

  paramFields?.forEach((paramField) => {
    if (paramField == null) {
      return;
    }

    const { query, body, path, header } = paramField;

    let group;
    let name;

    if (query) {
      group = 'query';
      name = query;
    } else if (path) {
      group = 'path';
      name = path;
    } else if (body) {
      group = 'body';
      name = body;
    } else if (header) {
      group = 'header';
      name = header;
    }

    if (!group) {
      return;
    }

    const {
      placeholder,
      default: defaultValue,
      required,
      type,
      enum: enumValues,
      properties,
    } = paramField;

    params.push({
      name,
      placeholder:
        getPlaceholderFromObjectOrString(placeholder) ||
        getPlaceholderFromObjectOrString(defaultValue),
      required: required === null || required === true, // intentionally check for just null or true
      type,
      enum: enumValues,
      group,
      properties,
    });
  });

  return params;
};

export const getParamGroupsFromApiComponents = (
  apiComponents?: ApiComponent[],
  auth?: string,
  apiConfig?: ApiConfig
): Record<string, Param[]> => {
  const groups: Record<string, Param[]> = {};

  // Add auth if configured
  if (auth?.toLowerCase() !== 'none') {
    if (apiConfig?.auth?.name) {
      groups.Authorization = [
        {
          name: apiConfig.auth.name,
          required: true,
        },
      ];
    }

    if (apiConfig?.auth?.method === 'basic') {
      const name = apiConfig.auth.name || 'username:password';
      groups.Authorization = name.split(':').map((section) => {
        return {
          name: section,
          required: true,
        };
      });
    }

    if (apiConfig?.auth?.method?.toLowerCase() === 'bearer' || auth?.toLowerCase() === 'bearer') {
      groups.Authorization = [
        {
          name: 'Bearer',
          required: true,
        },
      ];
    }
  }

  const params = getParams(apiComponents);

  params.forEach((param) => {
    if (param.group == null) {
      return;
    }

    const groupName = paramTypeToNameMap[param.group];
    const existingGroup = groups[groupName];

    if (existingGroup) {
      groups[groupName] = [...existingGroup, param];
    } else {
      groups[groupName] = [param];
    }
  });

  return groups;
};
