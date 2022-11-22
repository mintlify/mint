import { CodeBlock as GenericCodeBlock } from '@mintlify/components';
import { ReactNode } from 'react';

import { useColors } from '@/hooks/useColors';

export function CodeBlock({ filename, children }: { filename?: string; children?: ReactNode }) {
  const colors = useColors();
  return (
    <GenericCodeBlock
      filename={filename}
      filenameColor={colors.primaryLight}
      copiedTooltipColor={colors.primaryDark}
    >
      {children}
    </GenericCodeBlock>
  );
}
