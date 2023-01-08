import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';

import { RequestExample } from '@/components/ApiExample';
import { CodeBlock } from '@/components/CodeBlock';
import { OpenApiFile } from '@/types/openApi';

import { extractBaseAndPath, extractMethodAndEndpoint, Param } from '../api';
import { bodyParamsToObjectString } from './bodyParamToObjectString';
import { fillPathVariables } from './fillPathVariables';

export function generateRequestExamples(
  endpointStr: string | undefined,
  baseUrlConfig: string[] | string | undefined,
  apiBaseIndex: number,
  params: Record<string, Param[]>,
  apiPlaygroundInputs: Record<string, Record<string, any>>,
  openApiFiles?: OpenApiFile[]
): JSX.Element | null {
  if (endpointStr == null) {
    return null;
  }

  const { endpoint, method } = extractMethodAndEndpoint(endpointStr);
  const { base, path: endpointPath } = extractBaseAndPath(
    endpoint,
    apiBaseIndex,
    baseUrlConfig,
    openApiFiles
  );

  // Generate body parameters
  const bodyParamsString = bodyParamsToObjectString(
    params.Body?.filter(
      (param) => param.required || Object.keys(apiPlaygroundInputs.Body || {}).includes(param.name)
    ),
    apiPlaygroundInputs.Body,
    1
  );

  // Generate query parameters
  const queryParams = new URLSearchParams(apiPlaygroundInputs.Query ?? {}).toString();
  const queryPostfix = queryParams ? '?' + queryParams : '';

  // Fill in path parameters and append query parameters
  const fullEndpoint =
    fillPathVariables(base + endpointPath, params.Path, apiPlaygroundInputs.Path) + queryPostfix;

  // Generate headers including user defined ones
  const headers = assembleUserInputHeaders(params, apiPlaygroundInputs);

  // Add default Content-Type header if the user didn't define it and we have body content
  if (!headers.find((header) => header[0] === 'Content-Type') && bodyParamsString) {
    headers.push(['Content-Type', 'application/json']);
  }

  const curlHeaders = headers
    .map((header) => `     --header '${header[0]}: ${header[1]}'`)
    .join(' \\\n');
  const curlSnippet = {
    filename: 'cURL',
    code:
      `curl --request ${method} \\\n` +
      `     --url ${fullEndpoint} \\\n` +
      curlHeaders +
      (bodyParamsString ? ` \\\n     --data '${bodyParamsString}'` : ''),
    prism: {
      grammar: Prism.languages.bash,
      language: 'bash',
    },
  };

  const pythonHeaders = headers.map((header) => `\n "${header[0]}": "${header[1]}"`).join(',');
  const pythonBodyLine = bodyParamsString ? `body = ${bodyParamsString}\n` : '';
  const pythonHeaderLine = headers.length > 0 ? `headers = {${pythonHeaders}\n}\n` : '';

  const pythonSnippet = {
    filename: 'Python',
    code:
      'import requests\n\n' +
      `url = "${fullEndpoint}"\n` +
      pythonBodyLine +
      pythonHeaderLine +
      `response = requests.${method?.toLowerCase()}(url${pythonBodyLine ? ', json=body' : ''}${
        pythonHeaderLine ? ', headers=headers' : ''
      })`,
    prism: {
      grammar: Prism.languages.python,
      language: 'python',
    },
  };

  const snippets = [curlSnippet, pythonSnippet];

  return (
    <RequestExample>
      {snippets.map((snippet) => {
        return (
          <CodeBlock filename={snippet.filename} key={snippet.filename}>
            {/* CodeBlock cannot copy text added with dangerouslySetInnerHTML */}
            <div className="hidden">{snippet.code}</div>
            <pre>
              <code
                dangerouslySetInnerHTML={{
                  __html: Prism.highlight(
                    snippet.code,
                    snippet.prism.grammar,
                    snippet.prism.language
                  ),
                }}
              />
            </pre>
          </CodeBlock>
        );
      })}
    </RequestExample>
  );
}

function assembleUserInputHeaders(
  params: Record<string, Param[]>,
  apiPlaygroundInputs: Record<string, Record<string, any>>
) {
  const headers = [];

  // These two loops should be the same
  if (params.Authorization) {
    for (const headerParam of params.Authorization) {
      const isDefined =
        apiPlaygroundInputs.Authorization && apiPlaygroundInputs.Authorization[headerParam.name];

      if (isDefined || headerParam.required) {
        let headerName = headerParam.name;

        // Empty strings get replaced with AUTH_VALUE placeholder
        let headerValue = isDefined
          ? apiPlaygroundInputs.Authorization[headerParam.name]
          : 'AUTH_VALUE';

        // Special case for Bearer tokens
        if (headerParam.name === 'Bearer') {
          headerName = 'Authorization';
          headerValue = 'Bearer ' + headerValue;
        }

        headers.push([headerName, headerValue]);
      }
    }
  }

  if (params.Header) {
    for (const headerParam of params.Header) {
      if (apiPlaygroundInputs.Header && apiPlaygroundInputs.Header[headerParam.name]) {
        headers.push([headerParam.name, apiPlaygroundInputs.Header[headerParam.name]]);
      } else if (headerParam.required) {
        headers.push([headerParam.name, 'HEADER_VALUE']);
      }
    }
  }

  return headers;
}
