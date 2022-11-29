import { CodeBlock } from '@/components/CodeBlock';
import { CodeGroup } from '@/components/CodeGroup';
import { Component } from '@/enums/components';
import { ApiComponent } from '@/types/apiComponent';
import { htmlToReactComponent } from '@/utils/htmlToReactComponent';

export function createUserDefinedExamples(apiComponents: ApiComponent[]) {
  // Response and Request Examples from MDX
  //   const [mdxRequestExample, setMdxRequestExample] = useState<JSX.Element | undefined>(undefined);
  //   const [mdxResponseExample, setMdxResponseExample] = useState<JSX.Element | undefined>(undefined);

  const requestComponentSkeleton = apiComponents.find((apiComponent) => {
    return apiComponent.type === Component.RequestExample;
  });

  const responseComponentSkeleton = apiComponents.find((apiComponent) => {
    return apiComponent.type === Component.ResponseExample;
  });

  const output = {} as any;

  // Create Request Example
  if (requestComponentSkeleton) {
    output.requestExample = (
      <CodeGroup
        isSmallText
        children={requestComponentSkeleton.children.map((child, i) => {
          return (
            <CodeBlock filename={child.filename} key={child.filename + i}>
              {htmlToReactComponent(child.html)}
            </CodeBlock>
          );
        })}
      />
    );
  }

  // Create ResponseExample
  if (responseComponentSkeleton) {
    output.responseExample = (
      <CodeGroup
        isSmallText
        children={responseComponentSkeleton.children.map((child, i) => {
          return (
            <CodeBlock filename={child.filename} key={child.filename + i}>
              {htmlToReactComponent(child.html)}
            </CodeBlock>
          );
        })}
      />
    );
  }

  return output;
}
