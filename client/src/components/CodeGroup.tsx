import { CodeGroup as GenericCodeGroup } from '@mintlify/components';
import { CodeGroupProps } from '@mintlify/components/dist/Code/CodeGroup';

import { useColors } from '@/hooks/useColors';

export function CodeGroup({ children, isSmallText }: { children: any; isSmallText?: boolean }) {
  const colors = useColors();
  return (
    <GenericCodeGroup
      selectedColor={colors.primaryLight}
      copiedTooltipColor={colors.primaryDark}
      isSmallText={isSmallText}
    >
      {children}
    </GenericCodeGroup>
  );
}

// Deprecated. Do not use SnippetGroup.
export function SnippetGroup(props: CodeGroupProps) {
  return <CodeGroup {...props} />;
}
