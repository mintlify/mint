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
  params: Record<string, Param[]>
): JSX.Element | undefined {
  if (api == null) {
    return undefined;
  }

  const { endpoint, method } = extractMethodAndEndpoint(api);
  const { base, path: endpointPath } = extractBaseAndPath(endpoint, apiBaseIndex);
  const fullEndpoint = base + endpointPath;

  // \ symbols are escaped otherwise they escape the ` at ends the string
  const curlSnippet = {
    filename: 'cURL',
    code:
      `curl --request ${method} \\\n` +
      `     --url ${fullEndpoint} \\\n` +
      `     --header 'accept: application/json'`,
    prism: {
      grammar: Prism.languages.bash,
      language: 'bash',
    },
  };

  const pythonSnippet = {
    filename: 'Python',
    code:
      'import requests\n' +
      `url = "${fullEndpoint}"\n` +
      'headers = {"accept": "application/json"}\n' +
      `response = requests.${method?.toLowerCase()}(url, headers=headers)`,
    prism: {
      grammar: Prism.languages.python,
      language: 'python',
    },
  };

  const snippets = [curlSnippet, pythonSnippet];

  return (
    <RequestExample
      children={snippets.map((snippet) => {
        return (
          <Editor filename={snippet.filename}>
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
    />
  );
}
