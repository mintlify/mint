import { CodeGroup } from './CodeGroup';

export function RequestExample({ children }: { children: any }) {
  return <CodeGroup isSmallText>{children}</CodeGroup>;
}

export function ResponseExample({ children }: { children: any }) {
  return <CodeGroup isSmallText>{children}</CodeGroup>;
}
