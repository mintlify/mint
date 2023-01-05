import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import { useState, useEffect, useContext } from 'react';

import { CodeBlock } from '@/components/CodeBlock';
import { CodeGroup } from '@/components/CodeGroup';
import { ConfigContext } from '@/context/ConfigContext';
import { Param } from '@/utils/api';
import { generateRequestExamples } from '@/utils/apiExampleGeneration/generateApiRequestExamples';
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
  if (schema.example) {
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

export function GeneratedRequestExamples({
  paramGroupDict,
  apiPlaygroundInputs,
  apiBaseIndex,
  endpointStr,
}: {
  paramGroupDict: Record<string, Param[]>;
  apiPlaygroundInputs: Record<string, Record<string, any>>;
  apiBaseIndex: number;
  endpointStr?: string;
}) {
  const { mintConfig, openApiFiles } = useContext(ConfigContext);

  return generateRequestExamples(
    endpointStr,
    mintConfig?.api?.baseUrl,
    apiBaseIndex,
    paramGroupDict,
    apiPlaygroundInputs,
    openApiFiles
  );
}

export function OpenApiResponseExample({ openapi }: { openapi?: string }) {
  const { openApiFiles } = useContext(ConfigContext);
  const [openApiResponseExamples, setOpenApiResponseExamples] = useState<string[]>([]);

  const { operation } =
    openapi != null && openApiFiles != null
      ? getOpenApiOperationMethodAndEndpoint(openapi, openApiFiles)
      : { operation: undefined };

  useEffect(() => {
    if (openapi == null) {
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
  }, [openapi, openApiFiles, operation?.responses]);

  let responseChildren = [] as any;

  const openApiResponseExample = openApiResponseExamples[0];
  if (openApiResponseExample) {
    const stringifiedCode = JSON.stringify(openApiResponseExample, null, 2);
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

  return <CodeGroup isSmallText>{responseChildren}</CodeGroup>;
}
