import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';

import { RequestExample } from '@/components/ApiExample';
import { Editor } from '@/components/Editor';
import { CopyToClipboard } from '@/icons/CopyToClipboard';

import { extractBaseAndPath, extractMethodAndEndpoint, Param } from './api';

export function generateRequestExamples(
  api: string | undefined,
  apiBaseIndex: number,
  params: Record<string, Param[]>,
  auth: string | undefined,
  authName: string | undefined
): JSX.Element | undefined {
  if (api == null) {
    return undefined;
  }

  // To do: Generate content for the examples from the params
  Object.entries(params);

  const { endpoint, method } = extractMethodAndEndpoint(api);
  const { base, path: endpointPath } = extractBaseAndPath(endpoint, apiBaseIndex);
  const fullEndpoint = base + endpointPath;

  // \ symbols are escaped otherwise they escape the ` at ends the string
  const curlSnippet = {
    filename: 'cURL',
    code:
      `curl --request ${method} \\\n` +
      `     --url ${fullEndpoint} \\\n` +
      `     --header 'accept: application/json'` +
      (auth === 'bearer'
        ? ` \\\n     --header 'Authorization: ${authName ?? 'Bearer'} {YOUR_TOKEN}'`
        : '') +
      (auth === 'key' ? ` \\\n     --header '${authName ?? 'key'}: {YOUR_KEY}'` : ''),
    prism: {
      grammar: Prism.languages.bash,
      language: 'bash',
    },
  };

  let pythonAuthHeader = '';
  if (auth === 'bearer') {
    pythonAuthHeader = `, "Authorization": "${authName ?? 'Bearer'} {YOUR_TOKEN}"'`;
  } else if (auth === 'key') {
    pythonAuthHeader = `, "${authName ?? 'key'}": "{YOUR_KEY}"'`;
  }

  const pythonSnippet = {
    filename: 'Python',
    code:
      'import requests\n\n' +
      `url = "${fullEndpoint}"\n` +
      `headers = {"accept": "application/json"${pythonAuthHeader}}\n` +
      `response = requests.${method?.toLowerCase()}(url, headers=headers)`,
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
          <Editor filename={snippet.filename} key={snippet.filename}>
            <pre>
              <CopyToClipboard />
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
          </Editor>
        );
      })}
    </RequestExample>
  );
}
