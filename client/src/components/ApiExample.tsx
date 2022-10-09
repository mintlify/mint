import { CodeGroup, CodeGroupProps } from './CodeGroup';

export function RequestExample({ ...props }: CodeGroupProps) {
  return <CodeGroup {...props} isSmallText />;
}

export function ResponseExample({ ...props }: CodeGroupProps) {
  return <CodeGroup {...props} isSmallText />;
}
