import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';

import { RequestExample } from '@/components/ApiExample';
import { CodeBlock } from '@/components/CodeBlock';

import { extractBaseAndPath, extractMethodAndEndpoint, Param } from '../api';
import { bodyParamsToObjectString } from './bodyParamToObjectString';

export function generateRequestExamples(
  endpointStr: string | undefined,
  baseUrl: string[] | string | undefined,
  apiBaseIndex: number,
  params: Record<string, Param[]>,
  auth: string | undefined,
  authName: string | undefined,
  openApi: any
): JSX.Element | undefined {
  if (endpointStr == null) {
    return undefined;
  }

  // TO DO: QUERY AND PATH VARIABLES TOO
  const bodyParamsString = bodyParamsToObjectString(params.Body);
  //const currentAuth = params.Auth?.find((param) => param.name === authName)
  // TO DO, GET VALUE FROM PARAMS
  const authValue = 'YOUR_AUTH';

  const { endpoint, method } = extractMethodAndEndpoint(endpointStr);
  const { base, path: endpointPath } = extractBaseAndPath(endpoint, apiBaseIndex, baseUrl, openApi);
  const fullEndpoint = base + endpointPath;

  // \ symbols are escaped otherwise they escape the ` at ends the string
  let curlAuthHeader = '';
  if (auth === 'bearer') {
    curlAuthHeader = ` \\\n     --header 'Authorization: ${authName ?? 'Bearer'} ${authValue}'`;
  } else if (auth === 'key') {
    curlAuthHeader = ` \\\n     --header '${authName ?? 'key'}: ${authValue}'`;
  }
  const curlSnippet = {
    filename: 'cURL',
    code:
      `curl --request ${method} \\\n` +
      `     --url ${fullEndpoint} \\\n` +
      `     --header 'accept: application/json'` +
      curlAuthHeader +
      (bodyParamsString ? ` \\\n     --data '${bodyParamsString}'` : ''),
    prism: {
      grammar: Prism.languages.bash,
      language: 'bash',
    },
  };

  const pythonBodyLine = bodyParamsString ? `body = ${bodyParamsString}\n` : '';
  let pythonAuthHeader = '';
  if (auth === 'bearer') {
    pythonAuthHeader = `, "Authorization": "${authName ?? 'Bearer'} ${authValue}"'`;
  } else if (auth === 'key') {
    pythonAuthHeader = `, "${authName ?? 'key'}": "${authValue}"'`;
  }
  const pythonHeaderLine =
    params.Body?.length > 0 || pythonAuthHeader
      ? `headers = {"content-type": "application/json"${pythonAuthHeader}}\n`
      : '';

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
