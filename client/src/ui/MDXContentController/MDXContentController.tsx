import { MDXProvider } from '@mdx-js/react';
import clsx from 'clsx';
import { createContext, useContext, useEffect, useState } from 'react';

import { DynamicLink } from '@/components/DynamicLink';
import { Heading } from '@/components/Heading';
import { ConfigContext } from '@/context/ConfigContext';
import { useCurrentPath } from '@/hooks/useCurrentPath';
import { usePrevNext } from '@/hooks/usePrevNext';
import { useTableOfContents } from '@/hooks/useTableOfContents';
import { MDXContentControllerProps } from '@/types/MDXContentControllerTypes';
import { Config } from '@/types/config';
import { APIBASE_CONFIG_STORAGE, ApiComponent, ApiPlayground } from '@/ui/ApiPlayground';
import { Footer } from '@/ui/MDXContentController/Footer';
import { PageHeader } from '@/ui/MDXContentController/PageHeader';
import { TableOfContents } from '@/ui/MDXContentController/TableOfContents';
import { getOpenApiOperationMethodAndEndpoint } from '@/utils/openApi/getOpenApiContext';
import { getParameterType } from '@/utils/openApi/getParameterType';
import { createExpandable, createParamField, getProperties } from '@/utils/openapi';
import { slugToTitle } from '@/utils/titleText/slugToTitle';

import { ApiSupplemental } from '../../layouts/ApiSupplemental';
import { getAllOpenApiParameters, OpenApiContent } from '../../layouts/OpenApiContent';

export const ContentsContext = createContext(undefined);

export function MDXContentController({
  children,
  meta,
  tableOfContents,
  section,
  apiComponents,
}: MDXContentControllerProps) {
  const currentPath = useCurrentPath();
  const { config, openApi } = useContext(ConfigContext);
  const toc = [...tableOfContents];

  const { currentSection, registerHeading, unregisterHeading } = useTableOfContents(toc);
  let { prev, next } = usePrevNext();

  // Control the API Base URL index
  const baseUrlArrayLength = getBaseUrlLength(config);
  const [apiBaseIndex, setApiBaseIndex] = useState(0);
  useEffect(() => {
    const configuredApiBaseIndex = window.localStorage.getItem(APIBASE_CONFIG_STORAGE);
    if (configuredApiBaseIndex != null) {
      const parsedIndex = parseInt(configuredApiBaseIndex, 10);
      // Prevent out-of-index errors
      if (parsedIndex <= baseUrlArrayLength) {
        setApiBaseIndex(parsedIndex);
      }
    }
  }, [openApi, baseUrlArrayLength]);

  const openApiPlaygroundProps = getOpenApiPlaygroundProps(
    apiBaseIndex,
    config,
    openApi,
    meta.openapi
  );

  const isApi = (meta.api?.length ?? 0) > 0 || (openApiPlaygroundProps.api?.length ?? 0) > 0;

  // The user can hide the table of contents by marking the size as wide, but the API
  // overrides that to show request and response examples on the side.
  // TODO: Remove meta.size
  const isWideSize = meta.mode === 'wide' || meta.size === 'wide';
  let contentWidth = 'xl:pr-20 xl:mr-[18rem]';
  if (isApi) {
    contentWidth = 'xl:pr-12 xl:mr-[28rem]';
  } else if (isWideSize) {
    contentWidth = 'xl:pr-20 xl:mr-[12rem]';
  }

  const isBlogMode = meta.mode === 'blog';

  return (
    <div className={clsx('relative max-w-3xl mx-auto pt-9 xl:max-w-none xl:ml-0', contentWidth)}>
      <PageHeader
        title={meta.title || slugToTitle(currentPath)}
        description={meta.description}
        section={section}
        isBlogMode={isBlogMode}
      />

      {isApi ? (
        <ApiPlayground
          api={openApiPlaygroundProps.api ?? meta.api ?? ''}
          auth={meta.auth}
          apiComponents={openApiPlaygroundProps.apiComponents ?? apiComponents}
          contentType={openApiPlaygroundProps.contentType ?? meta.contentType}
          children={children}
        />
      ) : null}

      {/* The MDXProvider here renders the MDX for the page */}
      <div className="relative z-20 prose prose-slate mt-8 dark:prose-dark">
        <ContentsContext.Provider value={{ registerHeading, unregisterHeading } as any}>
          <MDXProvider components={{ a: DynamicLink, Heading }}>{children}</MDXProvider>
        </ContentsContext.Provider>
        {meta.openapi && <OpenApiContent endpointStr={meta.openapi} auth={meta.auth} />}
      </div>

      <Footer previous={prev} next={next} hasBottomPadding={!isApi} />
      <div
        className={clsx(
          'z-10 hidden xl:block pr-8',
          isApi
            ? 'w-[30rem] absolute top-[7.6rem] left-full h-full'
            : 'fixed pl-8 w-[21rem] top-[3.8rem] bottom-0 right-[max(0px,calc(50%-45rem))] py-10 overflow-auto'
        )}
      >
        {!isApi && toc.length > 0 && !isWideSize && !isBlogMode && (
          <TableOfContents tableOfContents={toc} currentSection={currentSection} meta={meta} />
        )}
        {isApi && (
          <div className="sticky top-[6rem] left-0">
            <ApiSupplemental
              apiComponents={apiComponents}
              endpointStr={meta.openapi || meta.api}
              auth={meta.auth ?? config?.api?.auth?.method}
              authName={config?.api?.auth?.name}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function getOpenApiPlaygroundProps(
  apiBaseIndex: number,
  config: Config | undefined,
  openApi: any,
  openApiEndpoint: string | undefined
) {
  // Detect when OpenAPI is missing
  if (!openApiEndpoint || !openApi) {
    return {};
  }

  const { method, endpoint, operation, path } = getOpenApiOperationMethodAndEndpoint(
    openApiEndpoint,
    openApi
  );

  // Detect when OpenAPI string is missing the operation (eg. GET)
  if (!operation) {
    return {};
  }

  // Get the api string with the correct baseUrl
  // endpoint in OpenAPI refers to the path
  const openApiServers = openApi?.files?.reduce((acc: any, file: any) => {
    return acc.concat(file.openapi.servers);
  }, []);
  const configBaseUrl =
    config?.api?.baseUrl ?? openApiServers?.map((server: { url: string }) => server.url);
  const baseUrl =
    configBaseUrl && Array.isArray(configBaseUrl) ? configBaseUrl[apiBaseIndex] : configBaseUrl;
  const api = `${method} ${baseUrl}${endpoint}`;

  // Get ApiComponents to show in the ApiPlayground
  const parameters = getAllOpenApiParameters(path, operation);
  const apiComponents: ApiComponent[] = [];

  // Get the Parameter ApiComponents
  parameters.forEach((parameter: any, i: number) => {
    const { name, required, schema, in: paramType, example } = parameter;
    const type = schema == null ? parameter?.type : getParameterType(schema);
    const paramField = createParamField({
      [paramType]: name,
      required,
      type,
      default: schema?.default,
      placeholder: example || schema?.enum,
    });
    apiComponents.push(paramField);
  });

  const bodyContent = operation.requestBody?.content;
  const contentType = bodyContent && Object.keys(bodyContent)[0];
  const bodySchema = bodyContent && bodyContent[contentType]?.schema;

  // Get the Body ApiComponents
  if (bodySchema?.properties) {
    Object.entries(bodySchema.properties)?.forEach(([property, propertyValue]: any, i: number) => {
      const required = bodySchema.required?.includes(property);
      const type = getParameterType(propertyValue);
      const bodyDefault = bodySchema.example
        ? JSON.stringify(bodySchema.example[property])
        : undefined;
      const last = i + 1 === operation.parameters?.length;
      let children;
      if (propertyValue.properties) {
        const properties = getProperties(propertyValue.properties);
        children = [createExpandable(properties)];
      } else if (propertyValue.items?.properties) {
        const properties = getProperties(propertyValue.items.properties);
        children = [createExpandable(properties)];
      }
      const paramField = createParamField(
        {
          body: property,
          required,
          type,
          default: bodyDefault,
          enum: propertyValue.enum,
          last,
        },
        children
      );
      apiComponents.push(paramField);
    });
  }

  return {
    api,
    apiComponents,
    contentType,
  };
}

// Return the length of the array if baseUrl is an array, otherwise return 0
function getBaseUrlLength(config: Config | undefined) {
  if (config?.api?.baseUrl && Array.isArray(config.api?.baseUrl)) {
    return config?.api?.baseUrl.length;
  }
  return 0;
}
