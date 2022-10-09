import { useEffect, useState } from 'react';

import { Expandable } from '@/components/Expandable';
import { Heading } from '@/components/Heading';
import { ParamField } from '@/components/Param';
import { ResponseField } from '@/components/ResponseField';
import { config } from '@/config';
import { Component } from '@/enums/components';
import { openApi } from '@/openapi';
import { Api, APIBASE_CONFIG_STORAGE, ApiComponent } from '@/ui/Api';
import { MediaType } from '@/utils/api';
import { getOpenApiOperationMethodAndEndpoint } from '@/utils/getOpenApiContext';

type OpenApiContentProps = {
  openapi: string;
  auth?: string;
};

const getType = (schema: any) => {
  if (schema.type === 'string' && schema.format === 'binary') {
    return 'file';
  }
  return schema.type;
};

const getMedia = (name: string): MediaType => {
  switch (name) {
    case 'multipart/form-data':
      return 'form';
    default:
      return 'json';
  }
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
            const isArrayExpandable = Boolean(value.items && value.items.properties == null);
            const type =
              isArrayExpandable && value.items.type ? `${value.items.type}[]` : value.type;
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
  const { method, endpoint, operation } = getOpenApiOperationMethodAndEndpoint(openapi);
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

  const Parameters = operation.parameters?.map((parameter: any, i: number) => {
    const { name, description, required, schema, in: paramType } = parameter;
    const paramName = { [paramType]: name };
    const type = getType(schema);
    apiComponents.push({
      type: Component.ParamField,
      attributes: [
        {
          type: 'mdx',
          name: paramType,
          value: name,
        },
        {
          type: 'mdx',
          name: 'required',
          value: required,
        },
        {
          type: 'mdx',
          name: 'type',
          value: type,
        },
        {
          type: 'mdx',
          name: 'default',
          value: schema.default,
        },
        {
          type: 'mdx',
          name: 'enum',
          value: schema.enum,
        },
      ],
    });
    return (
      <ParamField
        key={i}
        {...paramName}
        required={required}
        type={type}
        default={schema.default}
        enum={schema.enum}
      >
        {description || schema.description || schema.title}
      </ParamField>
    );
  });

  const bodyContent = operation.requestBody?.content;
  const contentMedia = bodyContent && Object.keys(bodyContent)[0];
  const bodySchema = bodyContent && bodyContent[contentMedia]?.schema;

  const Body =
    bodySchema?.properties &&
    Object.entries(bodySchema.properties)?.map(([property, value]: any, i: number) => {
      const required = bodySchema.required?.includes(property);
      const type = getType(value);
      const bodyDefault = bodySchema.example
        ? JSON.stringify(bodySchema.example[property])
        : undefined;
      const last = i + 1 === operation.parameters?.length;
      apiComponents.push({
        type: Component.ParamField,
        attributes: [
          {
            type: 'mdx',
            name: 'body',
            value: property,
          },
          {
            type: 'mdx',
            name: 'required',
            value: required,
          },
          {
            type: 'mdx',
            name: 'type',
            value: type,
          },
          {
            type: 'mdx',
            name: 'default',
            value: bodyDefault,
          },
          {
            type: 'mdx',
            name: 'enum',
            value: value.enum,
          },
          {
            type: 'mdx',
            name: 'last',
            value: last,
          },
        ],
      });
      return (
        <ParamField
          body={property}
          required={required}
          type={type}
          default={bodyDefault}
          enum={value.enum}
          last={last}
        >
          {value.description || value.title}
        </ParamField>
      );
    });

  let responseSchema = operation.responses?.['200']?.content?.['application/json']?.schema;
  // endpoint in OpenAPI refers to the path
  const configBaseUrl =
    config.api?.baseUrl ?? openApi?.servers?.map((server: { url: string }) => server.url);
  const baseUrl =
    configBaseUrl && Array.isArray(configBaseUrl) ? configBaseUrl[apiBaseIndex] : configBaseUrl;
  const api = `${method} ${baseUrl}${endpoint}`;

  return (
    <div className="prose prose-slate dark:prose-dark">
      <Api api={api} media={getMedia(contentMedia)} auth={auth} apiComponents={apiComponents} />
      <div>
        {Parameters?.length > 0 && (
          <Heading level={3} id="parameters" nextElement={null}>
            Parameters
          </Heading>
        )}
        {Parameters}
        {Body?.length > 0 && (
          <Heading level={3} id="body" nextElement={null}>
            Body
          </Heading>
        )}
        <ExpandableFields schema={bodySchema} />
        {responseSchema && (
          <Heading level={3} id="response" nextElement={null}>
            Response
          </Heading>
        )}
        <ExpandableFields schema={responseSchema} />
      </div>
    </div>
  );
}
