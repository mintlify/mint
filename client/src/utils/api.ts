import { AxiosRequestHeaders } from 'axios';
import isAbsoluteUrl from 'is-absolute-url';

import { ParamProps } from '@/components/Param';
import { config } from '@/config';
import { Component } from '@/enums/components';
import { openApi } from '@/openapi';
import { ApiComponent } from '@/ui/Api';

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
};

export type ParamGroup = {
  name: string;
  params: Param[];
};

export const BASEPATH = config.basePath || '';

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
  return {
    ...obj,
    'Content-Type': contentType,
  };
};

export const getApiContext = (
  apiBase: string,
  path: string,
  inputData: Record<string, any>,
  contentType: string
): { url: string; body?: Object; params?: Object; headers?: AxiosRequestHeaders } => {
  const endpoint = `${apiBase}${path}`;
  const url = potentiallAddPathParams(endpoint, inputData);
  const body = getBody(inputData.Body, contentType);
  const params = removeEmpty(inputData.Query);
  const headers = getHeaders(inputData.Header || {}, contentType);

  if (inputData.Authorization) {
    const authEntires = Object.entries(inputData.Authorization);
    if (config.api?.auth?.method === 'basic' && authEntires.length === 2) {
      let [[usernameField, username], [, password]]: any = authEntires;
      // Get order based on username:password
      if (
        (config.api.auth.name && config.api.auth.name.split(':')[0] !== usernameField) ||
        (!config.api.auth.name && usernameField.toLowerCase() !== 'username')
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
  const filename = api.substring(0, startIndexOfMethod).trim();

  return {
    method: foundMethod ? foundMethod[0].slice(0, -1).toUpperCase() : undefined,
    endpoint: api.substring(endIndexOfMethod).trim(),
    filename: filename ? filename : undefined,
  };
};

export const extractBaseAndPath = (endpoint: string, apiBaseIndex = 0) => {
  let fullEndpoint;
  const openApiServers = openApi?.files.reduce((acc, file) => {
    return acc.concat(file.openapi.servers);
  }, []);
  const baseUrl =
    config.api?.baseUrl ?? openApiServers?.map((server: { url: string }) => server.url);
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

export const getParamGroupsFromAPIComponents = (
  apiComponents?: ApiComponent[],
  auth?: string
): ParamGroup[] => {
  const groups: Record<string, Param[]> = {};

  // Add auth if configured
  if (auth?.toLowerCase() !== 'none') {
    if (config.api?.auth?.name) {
      groups.Authorization = [
        {
          name: config.api.auth.name,
          required: true,
        },
      ];
    }

    if (config.api?.auth?.method === 'basic') {
      const name = config.api.auth.name || 'username:password';
      groups.Authorization = name.split(':').map((section) => {
        return {
          name: section,
          required: true,
        };
      });
    }

    if (config.api?.auth?.method?.toLowerCase() === 'bearer' || auth?.toLowerCase() === 'bearer') {
      groups.Authorization = [
        {
          name: 'Bearer',
          required: true,
        },
      ];
    }
  }

  const paramFields = apiComponents
    ?.filter((apiComponent) => apiComponent.type === Component.ParamField)
    .map((apiComponent) => {
      const attributesMap: Record<any, any> = {};
      apiComponent?.attributes?.forEach((attribute: any) => {
        attributesMap[attribute.name] = attribute.value;
      });

      return attributesMap;
    });

  paramFields?.forEach((paramField) => {
    if (paramField == null) {
      return;
    }

    const { query, body, path, header } = paramField;

    let paramType;
    let name;

    if (query) {
      paramType = 'query';
      name = query;
    } else if (path) {
      paramType = 'path';
      name = path;
    } else if (body) {
      paramType = 'body';
      name = body;
    } else if (header) {
      paramType = 'header';
      name = header;
    }

    if (!paramType) {
      return;
    }

    const groupName = paramTypeToNameMap[paramType];
    const existingGroup = groups[groupName];

    const { placeholder, default: defaultValue, required, type, enum: enumValues } = paramField;

    const param = {
      name,
      placeholder:
        getPlaceholderFromObjectOrString(placeholder) ||
        getPlaceholderFromObjectOrString(defaultValue),
      required: required === null || required === true, // intentionally check for just null or true
      type,
      enum: enumValues,
    };

    if (existingGroup) {
      groups[groupName] = [...existingGroup, param];
    } else {
      groups[groupName] = [param];
    }
  });

  return Object.entries(groups).map(([groupName, params]) => {
    return {
      name: groupName,
      params,
    };
  });
};
