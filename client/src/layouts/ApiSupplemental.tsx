import axios from 'axios';
import parse from 'html-react-parser';
import React from 'react';
import { useState, useEffect } from 'react';

import { RequestExample, ResponseExample } from '@/components/ApiExample';
import { Editor } from '@/components/Editor';
import { Component } from '@/enums/components';
import { CopyToClipboard } from '@/icons/CopyToClipboard';
import { getOpenApiOperationMethodAndEndpoint } from '@/utils/getOpenApiContext';

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
  openapi,
}: {
  apiComponents: ApiComponent[];
  openapi?: string;
}) {
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

    const htmlToReactComponent = (html: string) => {
      // Convert newlines to breaks to be properly parsed
      // return parse(html.replaceAll('\n', '<br />'));
      return parse(html);
    };

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
    if (openapi == null) {
      return;
    }
    const { operation } = getOpenApiOperationMethodAndEndpoint(openapi);
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
  }, [openapi]);

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
      {mdxRequestExample}
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
