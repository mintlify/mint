// TODO: Refactor this file to improve readability
import { Tab, Tabs } from '@mintlify/components';
import { useEffect, useState } from 'react';

import { Expandable } from '@/components/Expandable';
import { Heading } from '@/components/Heading';
import { ParamField } from '@/components/Param';
import { ResponseField } from '@/components/ResponseField';
import { config } from '@/config';
import { openApi } from '@/openapi';
import { ApiPlayground, APIBASE_CONFIG_STORAGE, ApiComponent } from '@/ui/ApiPlayground';
import { getOpenApiOperationMethodAndEndpoint } from '@/utils/getOpenApiContext';
import { createExpandable, createParamField, getProperties } from '@/utils/openapi';

type OpenApiContentProps = {
  openapi: string;
  auth?: string;
};

export const getAllOpenApiParameters = (path: any, operation: any) => {
  return (path.parameters || []).concat(operation.parameters || []);
};

const getType = (schema: any) => {
  if (schema.type === 'string' && schema.format === 'binary') {
    return 'file';
  }
  return schema.type;
};

const getTypeName = (type: string[] | string) => {
  return Array.isArray(type) ? type.join(' | ') : type;
};

const getEnumDescription = (enumArray?: string[]): React.ReactNode | null => {
  if (enumArray == null || enumArray.length === 0) {
    return null;
  }
  return (
    <>
      Allowed values:{' '}
      {enumArray.map((val, i) => (
        <>
          <code>{val}</code>
          {i !== enumArray.length - 1 && ', '}
        </>
      ))}
    </>
  );
};

function ExpandableFields({ schema }: any) {
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({});
  if (schema == null) {
    return null;
  }

  if (schema.anyOf != null) {
    return (
      <Tabs>
        {schema.anyOf.map((schema: any, i: number) => (
          <Tab title={`${i + 1}`}>
            {/* TODO: Explore whether properties can be assumed */}
            <ExpandableFields schema={{ properties: schema }} />
          </Tab>
        ))}
      </Tabs>
    );
  }

  if (schema.items) {
    const name = schema.items.title;
    return (
      <ResponseField name={name} type={schema.items.type}>
        <>
          {schema.description}
          <Expandable
            title="properties"
            defaultOpen={false}
            onChange={(open) => {
              setExpandedFields({ ...expandedFields, [name]: open });
              return;
            }}
          >
            <ExpandableFields schema={schema.items} />
          </Expandable>
        </>
      </ResponseField>
    );
  }

  // TBD: Cleanup response field by types
  return (
    <>
      {schema.properties &&
        Object.entries(schema.properties)
          ?.sort(([propertyLeft], [propertyRight]) => {
            // Brings all required to the top
            return schema.required?.includes(propertyLeft)
              ? -1
              : schema.required?.includes(propertyRight)
              ? 1
              : 0;
          })
          .map(([property, value]: any) => {
            if (value == null) {
              return null;
            }

            const isArrayExpandable = Boolean(value.items && value.items.properties == null);
            const type =
              isArrayExpandable && value.items.type
                ? `${value.items.type}[]`
                : getTypeName(value.type);
            return (
              <ResponseField
                key={property}
                name={property}
                required={schema.required?.includes(property)}
                type={type}
              >
                {/* Is array nested */}
                {value.items && !isArrayExpandable ? (
                  <div className="mt-2">
                    {value.description}
                    <Expandable
                      title={value.items.type || 'properties'}
                      onChange={(open) => {
                        setExpandedFields({ ...expandedFields, [property]: open });
                        return;
                      }}
                    >
                      <ExpandableFields schema={value.items} />
                    </Expandable>
                  </div>
                ) : (
                  <>
                    {value.description || value.title || getEnumDescription(value.enum)}
                    {value.properties && (
                      <div className="mt-2">
                        <Expandable
                          title={value.type || 'properties'}
                          onChange={(open) => {
                            setExpandedFields({ ...expandedFields, [property]: open });
                            return;
                          }}
                        >
                          <ExpandableFields schema={value}></ExpandableFields>
                        </Expandable>
                      </div>
                    )}
                  </>
                )}
              </ResponseField>
            );
          })}
    </>
  );
}

export function OpenApiContent({ openapi, auth }: OpenApiContentProps) {
  const [apiBaseIndex, setApiBaseIndex] = useState(0);
  const { method, endpoint, operation, path } = getOpenApiOperationMethodAndEndpoint(openapi);
  useEffect(() => {
    const configuredApiBaseIndex = window.localStorage.getItem(APIBASE_CONFIG_STORAGE);
    if (configuredApiBaseIndex != null) {
      setApiBaseIndex(parseInt(configuredApiBaseIndex, 10));
    }
  }, [openapi]);

  if (operation == null) {
    return null;
  }

  let apiComponents: ApiComponent[] = [];

  const parameters = getAllOpenApiParameters(path, operation);
  const Parameters = parameters.map((parameter: any, i: number) => {
    const { name, description, required, schema, in: paramType, example } = parameter;
    const paramName = { [paramType]: name };
    const type = schema == null ? parameter?.type : getType(schema);
    const paramField = createParamField({
      [paramType]: name,
      required,
      type,
      default: schema?.default,
      placeholder: example || schema?.enum,
    });
    apiComponents.push(paramField);
    return (
      <ParamField
        key={i}
        {...paramName}
        required={required}
        type={type}
        default={schema?.default}
        enum={schema?.enum}
      >
        {description || schema?.description || schema?.title}
      </ParamField>
    );
  });

  const bodyContent = operation.requestBody?.content;
  const contentType = bodyContent && Object.keys(bodyContent)[0];
  const bodySchema = bodyContent && bodyContent[contentType]?.schema;

  const Body =
    bodySchema?.properties &&
    Object.entries(bodySchema.properties)?.map(([property, propertyValue]: any, i: number) => {
      const required = bodySchema.required?.includes(property);
      const type = getType(propertyValue);
      const bodyDefault = bodySchema.example
        ? JSON.stringify(bodySchema.example[property])
        : undefined;
      const last = i + 1 === operation.parameters?.length;
      let children;
      if (propertyValue.properties) {
        const properties = getProperties(propertyValue.properties);
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
      return (
        <ParamField
          body={property}
          required={required}
          type={type}
          default={bodyDefault}
          enum={propertyValue.enum}
          last={last}
        >
          {propertyValue.description || propertyValue.title}
        </ParamField>
      );
    });

  let responseSchema = operation.responses?.['200']?.content?.['application/json']?.schema;
  // endpoint in OpenAPI refers to the path
  const openApiServers = openApi?.files?.reduce((acc, file) => {
    return acc.concat(file.openapi.servers);
  }, []);
  const configBaseUrl =
    config.api?.baseUrl ?? openApiServers?.map((server: { url: string }) => server.url);
  const baseUrl =
    configBaseUrl && Array.isArray(configBaseUrl) ? configBaseUrl[apiBaseIndex] : configBaseUrl;
  const api = `${method} ${baseUrl}${endpoint}`;

  return (
    <div className="prose prose-slate dark:prose-dark">
      <ApiPlayground
        api={api}
        contentType={contentType}
        auth={auth}
        apiComponents={apiComponents}
      />
      <div>
        {Parameters?.length > 0 && (
          <>
            <Heading level={3} id="parameters" nextElement={null}>
              Parameters
            </Heading>
            {Parameters}
          </>
        )}
        {Body?.length > 0 && (
          <>
            <Heading level={3} id="body" nextElement={null}>
              Body
            </Heading>
            <ExpandableFields schema={bodySchema} />
          </>
        )}
        {responseSchema && (
          <>
            <Heading level={3} id="response" nextElement={null}>
              Response
            </Heading>
            <ExpandableFields schema={responseSchema} />
          </>
        )}
      </div>
    </div>
  );
}
