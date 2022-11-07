import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';

import { RequestExample, ResponseExample } from '@/components/ApiExample';
import { Editor } from '@/components/Editor';
import { ConfigContext } from '@/context/ConfigContext';
import { Component } from '@/enums/components';
import { CopyToClipboard } from '@/icons/CopyToClipboard';
import { APIBASE_CONFIG_STORAGE } from '@/ui/ApiPlayground';
import { getParamGroupsFromApiComponents } from '@/utils/api';
import { generateRequestExamples } from '@/utils/generateAPIExamples';
import { getOpenApiOperationMethodAndEndpoint } from '@/utils/getOpenApiContext';
import { htmlToReactComponent } from '@/utils/htmlToReactComponent';

const responseHasExample = (response: any) => {
  return (
    response?.content &&
    response?.content.hasOwnProperty('application/json') &&
    response?.content['application/json']?.examples &&
    response?.content['application/json']?.examples.hasOwnProperty(['example-1']) &&
    response?.content['application/json']?.examples['example-1']?.value
  );
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

  const { operation, path } =
    endpointStr != null && openApi != null
      ? getOpenApiOperationMethodAndEndpoint(endpointStr, openApi)
      : { operation: undefined, path: undefined };
  //const parameters = getAllOpenApiParameters(path, operation);
  const paramGroups = getParamGroupsFromApiComponents(apiComponents, auth);

  // Response and Request Examples from MDX
  const [mdxRequestExample, setMdxRequestExample] = useState<JSX.Element | undefined>(undefined);
  const [mdxResponseExample, setMdxResponseExample] = useState<JSX.Element | undefined>(undefined);
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
          return <Editor filename={child.filename}>{htmlToReactComponent(child.html)}</Editor>;
        })}
      />
    );

    setMdxRequestExample(request);

    const response: JSX.Element | undefined = responseComponentSkeleton && (
      <ResponseExample
        children={responseComponentSkeleton.children.map((child) => {
          return <Editor filename={child.filename}>{htmlToReactComponent(child.html)}</Editor>;
        })}
      />
    );

    setMdxResponseExample(response);
  }, [apiComponents]);
  // Open API generated response examples
  const [openApiResponseExamples, setOpenApiResponseExamples] = useState<string[]>([]);
  const [highlightedExamples, setHighlightedExamples] = useState<string[]>([]);

  useEffect(() => {
    if (endpointStr == null) {
      return;
    }

    if (operation?.responses != null) {
      const responseExamplesOpenApi = Object.values(operation?.responses)
        .map((resp: any) => {
          if (responseHasExample(resp)) {
            return resp?.content['application/json']?.examples['example-1']?.value;
          }
          return '';
        })
        .filter((example) => example !== '');
      if (responseExamplesOpenApi != null) {
        setOpenApiResponseExamples(responseExamplesOpenApi);
      }
    }
  }, [endpointStr, openApi]);

  useEffect(() => {
    if (openApiResponseExamples.length > 0) {
      const highlightPromises = openApiResponseExamples.map((example) => {
        return axios.post('/api/syntax-highlighted-json', {
          json: example,
        });
      });
      Promise.all(highlightPromises).then((responses) => {
        const highlightedExamples = responses.map((response) => response.data.highlightedJson);
        setHighlightedExamples(highlightedExamples);
      });
    }
  }, [openApiResponseExamples]);

  useEffect(() => {
    // Hacky approach to wait 1ms until document loads
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

  const ResponseExampleChild = ({ code }: { code: any }) => (
    <pre className="language-json">
      <CopyToClipboard />
      <code
        className="language-json"
        dangerouslySetInnerHTML={{
          __html: code,
        }}
      />
    </pre>
  );

  return (
    <div className="space-y-6 pb-6">
      {mdxRequestExample
        ? mdxRequestExample
        : generateRequestExamples(
            endpointStr,
            config?.api?.baseUrl,
            apiBaseIndex,
            paramGroups,
            auth,
            authName,
            openApi
          )}
      {/* TODO - Make it so that you can see both the openapi and response example in 1 view if they're both defined */}
      {highlightedExamples.length === 0 && mdxResponseExample}
      {highlightedExamples.length > 0 && (
        <ResponseExample
          children={{
            props: {
              filename: 'Response Example',
              children: highlightedExamples.map((code, i) => {
                if (code === '') return null;
                return <ResponseExampleChild code={code} key={`example-${i}`} />;
              }),
            },
          }}
        />
      )}
    </div>
  );
}
