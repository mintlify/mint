import { MDXProvider } from '@mdx-js/react';
import clsx from 'clsx';
import { createContext, useContext, useState } from 'react';

import { DynamicLink } from '@/components/DynamicLink';
import { Heading } from '@/components/Heading';
import { ConfigContext } from '@/context/ConfigContext';
import { usePrevNext } from '@/hooks/usePrevNext';
import { useTableOfContents } from '@/hooks/useTableOfContents';
import { ContentSideLayout } from '@/layouts/ContentSideLayout';
import { Config } from '@/types/config';
import { PageMetaTags } from '@/types/metadata';
import { ApiComponent, ApiPlayground } from '@/ui/ApiPlayground';
import { Footer } from '@/ui/MDXContentController/Footer';
import { BlogHeader, PageHeader } from '@/ui/MDXContentController/PageHeader';
import { TableOfContents } from '@/ui/MDXContentController/TableOfContents';
import { getParamGroupsFromApiComponents } from '@/utils/api';
import { getOpenApiOperationMethodAndEndpoint } from '@/utils/openApi/getOpenApiContext';
import { getParameterType } from '@/utils/openApi/getParameterType';
import { createExpandable, createParamField, getProperties } from '@/utils/openapi';

import { GeneratedRequestExamples, OpenApiResponseExample } from '../../layouts/ApiSupplemental';
import { getAllOpenApiParameters, OpenApiParameters } from '../../layouts/OpenApiParameters';
import { BlogContext } from '../Blog';
import { createUserDefinedExamples } from './createUserDefinedExamples';

export const ContentsContext = createContext(undefined);

type MDXContentControllerProps = {
  children: any;
  meta: PageMetaTags;
  tableOfContents: any;
  section: string;
  apiComponents: any;
};

export function MDXContentController({
  children,
  meta,
  tableOfContents,
  section,
  apiComponents,
}: MDXContentControllerProps) {
  const { config, openApi } = useContext(ConfigContext);
  const [apiPlaygroundInputs, setApiPlaygroundInputs] = useState<Record<string, any>>({});
  const [apiBaseIndex, setApiBaseIndex] = useState(0);
  const toc = [...tableOfContents];

  const { currentSection, registerHeading, unregisterHeading } = useTableOfContents(toc);
  let { prev, next } = usePrevNext();

  const openApiPlaygroundProps = getOpenApiPlaygroundProps(
    apiBaseIndex,
    config,
    openApi,
    meta.openapi
  );
  const isApi = (meta.api?.length ?? 0) > 0 || (openApiPlaygroundProps.api?.length ?? 0) > 0;
  const isBlogMode = meta.mode === 'blog';
  const { requestExample, responseExample } = createUserDefinedExamples(apiComponents);

  // The user can hide the table of contents by marking the size as wide, but the API
  // overrides that to show request and response examples on the side.
  // TODO: Remove meta.size
  const isWideSize = meta.mode === 'wide' || meta.size === 'wide';
  let contentWidth = 'max-w-3xl xl:max-w-[43rem]';
  if (isApi || requestExample || responseExample) {
    contentWidth = 'max-w-3xl xl:max-w-[min(100% - 31rem, 43rem)]';
  } else if (isWideSize) {
    contentWidth = 'max-w-3xl';
  }

  const paramGroupDict = getParamGroupsFromApiComponents(
    openApiPlaygroundProps.apiComponents ?? apiComponents,
    meta.auth,
    config?.api
  );
  const paramGroups = Object.entries(paramGroupDict).map(([groupName, params]) => {
    return {
      name: groupName,
      params,
    };
  });

  const api = openApiPlaygroundProps.api ?? meta.api ?? '';

  return (
    <div className="flex flex-row pt-9 gap-12 items-stretch">
      <div className={clsx('relative grow mx-auto xl:-mx-1 overflow-auto px-1', contentWidth)}>
        {isBlogMode ? <BlogHeader meta={meta} /> : <PageHeader meta={meta} section={section} />}
        {isApi ? (
          <ApiPlayground
            api={api}
            paramGroups={paramGroups}
            contentType={openApiPlaygroundProps.contentType ?? meta.contentType}
            onInputDataChange={setApiPlaygroundInputs}
            onApiBaseIndexChange={setApiBaseIndex}
          />
        ) : null}

        {/* The MDXProvider here renders the MDX for the page */}
        <div className="relative z-20 prose prose-slate mt-8 dark:prose-dark">
          <ContentsContext.Provider value={{ registerHeading, unregisterHeading } as any}>
            <MDXProvider components={{ a: DynamicLink, Heading }}>{children}</MDXProvider>
          </ContentsContext.Provider>
          {meta.openapi && <OpenApiParameters endpointStr={meta.openapi} auth={meta.auth} />}
        </div>

        <Footer
          previous={meta.hideFooterPagination ? null : prev}
          next={meta.hideFooterPagination ? null : next}
          hasBottomPadding={!isApi}
        />
      </div>

      {!isWideSize &&
        (isApi || requestExample || responseExample ? (
          <ContentSideLayout sticky>
            <div className="space-y-6 pb-6 w-[28rem]">
              {requestExample}
              {!requestExample && (
                <GeneratedRequestExamples
                  paramGroupDict={paramGroupDict}
                  apiPlaygroundInputs={apiPlaygroundInputs}
                  apiBaseIndex={apiBaseIndex}
                  endpointStr={api}
                />
              )}
              {responseExample}
              {!responseExample && <OpenApiResponseExample openapi={meta.openapi} />}
            </div>
          </ContentSideLayout>
        ) : isBlogMode ? (
          <BlogContext />
        ) : (
          <TableOfContents tableOfContents={toc} currentSection={currentSection} meta={meta} />
        ))}
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
