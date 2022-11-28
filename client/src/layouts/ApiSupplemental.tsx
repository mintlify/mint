import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import React, { useState, useEffect, useContext } from 'react';

import { ResponseExample } from '@/components/ApiExample';
import { CodeBlock } from '@/components/CodeBlock';
import { CodeGroup } from '@/components/CodeGroup';
import { ConfigContext } from '@/context/ConfigContext';
import { Component } from '@/enums/components';
import { ApiComponent } from '@/types/apiComponent';
import { APIBASE_CONFIG_STORAGE } from '@/ui/ApiPlayground';
import { getParamGroupsFromApiComponents } from '@/utils/api';
import { generateRequestExamples } from '@/utils/apiExampleGeneration/generateAPIExamples';
import { getOpenApiOperationMethodAndEndpoint } from '@/utils/openApi/getOpenApiContext';

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

export function ApiSupplemental({
  apiComponents,
  endpointStr,
  auth,
  authName,
  userDefinedResponseExample,
}: {
  apiComponents: ApiComponent[];
  endpointStr?: string;
  auth?: string;
  authName?: string;
  userDefinedResponseExample: any;
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

  // Open API generated response examples
  const [openApiResponseExamples, setOpenApiResponseExamples] = useState<string[]>([]);

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

  const ResponseExampleChild = ({ code }: { code: string }) => (
    <pre className="language-json">
      {/* CodeBlock cannot copy text added with dangerouslySetInnerHTML */}
      <div className="hidden">{code}</div>
      <code
        className="language-json"
        dangerouslySetInnerHTML={{
          __html: Prism.highlight(code, Prism.languages.json, 'json'),
        }}
      />
    </pre>
  );

  let requestExamples = null;
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

  let responseChildren = [] as any;
  if (userDefinedResponseExample && userDefinedResponseExample.props.children) {
    responseChildren = responseChildren.concat(userDefinedResponseExample.props.children);
  }

  // We only include the first example because people tend to duplicate them
  const openApiExample = openApiResponseExamples.length > 0 ? openApiResponseExamples[0] : null;
  if (openApiExample) {
    const stringifiedCode = JSON.stringify(openApiExample, null, 2);
    responseChildren.push(
      <CodeBlock filename="Response" key={`example-response`}>
        <pre className="language-json">
          {/* CodeBlock cannot copy text added with dangerouslySetInnerHTML */}
          <div className="hidden">{stringifiedCode}</div>
          <code
            className="language-json"
            dangerouslySetInnerHTML={{
              __html: Prism.highlight(stringifiedCode, Prism.languages.json, 'json'),
            }}
          />
        </pre>
      </CodeBlock>
    );
  }

  return (
    <>
      {requestExamples}
      {responseChildren.length > 0 && <CodeGroup isSmallText>{responseChildren}</CodeGroup>}
    </>
  );
}
