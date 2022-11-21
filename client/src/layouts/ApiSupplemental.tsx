import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import React, { useState, useEffect, useContext } from 'react';

import { RequestExample, ResponseExample } from '@/components/ApiExample';
import { CodeSnippet } from '@/components/CodeSnippet';
import { ConfigContext } from '@/context/ConfigContext';
import { Component } from '@/enums/components';
import { CopyToClipboard } from '@/icons/CopyToClipboard';
import { APIBASE_CONFIG_STORAGE } from '@/ui/ApiPlayground';
import { getParamGroupsFromApiComponents } from '@/utils/api';
import { generateRequestExamples } from '@/utils/generateAPIExamples';
import { getOpenApiOperationMethodAndEndpoint } from '@/utils/getOpenApiContext';
import { htmlToReactComponent } from '@/utils/htmlToReactComponent';

const responseHasSimpleExample = (response: any): boolean => {
  if (response?.content == null) {
    return false;
  }

  return Boolean(
    response.content &&
      response.content.hasOwnProperty('application/json') &&
      response.content['application/json']?.examples &&
      response.content['application/json']?.examples.hasOwnProperty(['example-1']) &&
      response.content['application/json']?.examples['example-1']?.value
  );
};

const recursivelyConstructExample = (schema: any, result = {}): any => {
  if (schema.example) {
    return schema.example;
  }

  if (schema.properties) {
    const propertiesWithExamples: Record<string, any> = {};

    Object.entries(schema.properties).forEach(([propertyName, propertyValue]): any => {
      propertiesWithExamples[propertyName] = recursivelyConstructExample(propertyValue);
    });

    return { ...result, ...propertiesWithExamples };
  }

  if (schema.items) {
    return [recursivelyConstructExample(schema.items)];
  }

  let returnValue = null;
  if (schema.default) {
    returnValue = schema.default;
  } else if (schema.enum?.length > 0) {
    returnValue = schema.enum[0];
  } else if (schema.type) {
    returnValue = schema.type;
  }

  return returnValue;
};

const recursivelyCheckIfHasExample = (schema: any) => {
  if (schema.example || schema.type) {
    return true;
  }

  if (schema.properties) {
    return Object.values(schema.properties).some((propertyValue): any => {
      return recursivelyCheckIfHasExample(propertyValue);
    });
  }

  return false;
};

const generatedNestedExample = (response: any) => {
  if (
    response?.content?.hasOwnProperty('application/json') == null ||
    response.content['application/json']?.schema == null
  ) {
    return '';
  }

  const schema = response.content['application/json'].schema;
  const constructedExample = recursivelyConstructExample(schema);
  const hasExample = recursivelyCheckIfHasExample(schema);

  if (hasExample) {
    return constructedExample;
  }

  return '';
};

type ApiComponent = {
  type: string;
  children: { filename: string; html: string }[];
};

export function ApiSupplemental({
  apiComponents,
  endpointStr,
  auth,
  authName,
}: {
  apiComponents: ApiComponent[];
  endpointStr?: string;
  auth?: string;
  authName?: string;
}) {
  const { config, openApi } = useContext(ConfigContext);
  const [apiBaseIndex, setApiBaseIndex] = useState(0);

  useEffect(() => {
    const configuredApiBaseIndex = window.localStorage.getItem(APIBASE_CONFIG_STORAGE);
    if (configuredApiBaseIndex != null) {
      setApiBaseIndex(parseInt(configuredApiBaseIndex, 10));
    }
  }, []);

  const { operation } =
    endpointStr != null && openApi != null
      ? getOpenApiOperationMethodAndEndpoint(endpointStr, openApi)
      : { operation: undefined };
  //const parameters = getAllOpenApiParameters(path, operation);
  const paramGroups = getParamGroupsFromApiComponents(apiComponents, auth);

  // Response and Request Examples from MDX
  const [mdxRequestExample, setMdxRequestExample] = useState<JSX.Element | undefined>(undefined);
  const [mdxResponseExample, setMdxResponseExample] = useState<JSX.Element | undefined>(undefined);
  // Open API generated response examples
  const [openApiResponseExamples, setOpenApiResponseExamples] = useState<string[]>([]);

  useEffect(() => {
    const requestComponentSkeleton = apiComponents.find((apiComponent) => {
      return apiComponent.type === Component.RequestExample;
    });

    const responseComponentSkeleton = apiComponents.find((apiComponent) => {
      return apiComponent.type === Component.ResponseExample;
    });

    const request: JSX.Element | undefined = requestComponentSkeleton && (
      <RequestExample
        children={requestComponentSkeleton.children.map((child) => {
          return (
            <CodeSnippet filename={child.filename}>{htmlToReactComponent(child.html)}</CodeSnippet>
          );
        })}
      />
    );

    setMdxRequestExample(request);

    const response: JSX.Element | undefined = responseComponentSkeleton && (
      <ResponseExample
        children={responseComponentSkeleton.children.map((child) => {
          return (
            <CodeSnippet filename={child.filename}>{htmlToReactComponent(child.html)}</CodeSnippet>
          );
        })}
      />
    );

    setMdxResponseExample(response);
  }, [apiComponents]);

  useEffect(() => {
    if (endpointStr == null) {
      return;
    }

    if (operation?.responses != null) {
      const responseExamplesOpenApi = Object.values(operation?.responses)
        .map((res: any) => {
          if (responseHasSimpleExample(res)) {
            return res?.content['application/json']?.examples['example-1']?.value;
          }
          return generatedNestedExample(res);
        })
        .filter((example) => example !== '');
      if (responseExamplesOpenApi != null) {
        setOpenApiResponseExamples(responseExamplesOpenApi);
      }
    }
  }, [endpointStr, openApi]);

  useEffect(() => {
    // Hacky approach to wait 50ms until document loads
    setTimeout(() => {
      document.querySelectorAll('.copy-to-clipboard').forEach((item) => {
        item.addEventListener(
          'click',
          () => {
            const codeElement = item.nextSibling;
            if (!codeElement || !window.getSelection) {
              return;
            }
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(codeElement);
            selection?.removeAllRanges();
            selection?.addRange(range);

            navigator.clipboard.writeText(selection?.toString() || '');

            const tooltip = item.getElementsByClassName('tooltip')[0];
            tooltip.classList.remove('hidden');
            setTimeout(() => {
              tooltip.classList.add('hidden');
            }, 2000);
          },
          true
        );
      });
    }, 50);
  }, []);

  const ResponseExampleChild = ({ code }: { code: string }) => (
    <pre className="language-json">
      <CopyToClipboard />
      <code
        className="language-json"
        dangerouslySetInnerHTML={{
          __html: Prism.highlight(code, Prism.languages.json, 'json'),
        }}
      />
    </pre>
  );

  let requestExamples = mdxRequestExample;
  if (
    !apiComponents.some((apiComponent) => {
      return apiComponent.type === Component.RequestExample;
    })
  ) {
    requestExamples = generateRequestExamples(
      endpointStr,
      config?.api?.baseUrl,
      apiBaseIndex,
      paramGroups,
      auth,
      authName,
      openApi
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {requestExamples}
      {/* TODO - Make it so that you can see both the openapi and response example in 1 view if they're both defined */}
      {mdxResponseExample}
      {!mdxResponseExample && openApiResponseExamples.length > 0 && (
        <ResponseExample
          children={{
            props: {
              filename: 'Response Example',
              children: openApiResponseExamples.map((code, i) => {
                if (code === '') return null;
                return (
                  <ResponseExampleChild code={JSON.stringify(code, null, 2)} key={`example-${i}`} />
                );
              }),
            },
          }}
        />
      )}
    </div>
  );
}
