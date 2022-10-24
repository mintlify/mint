import { addImportString } from './utils.js';

const imports = `
import { Accordion, AccordionGroup } from '@/components/Accordion'
import { Heading } from '@/components/Heading'
import { CodeGroup, SnippetGroup } from '@/components/CodeGroup'
import { RequestSimple } from '@/components/Request'
import { RequestExample, ResponseExample } from '@/components/ApiExample'
import { Param, ParamField } from '@/components/Param'
import { Card } from '@/components/Card'
import { ResponseField } from '@/components/ResponseField'
import { Expandable } from '@/components/Expandable'
import { CardGroup, Info, Warning, Note, Tip, Check } from '@mintlify/components'
import { Tabs, Tab } from '@mintlify/components'
import { Tooltip } from '@mintlify/components'
import { solid, regular, light, thin, duotone, brands } from '@/ui/Icon'
`;

const withImportsInjected = () => {
  return (tree: any) => {
    tree.children = tree.children.filter((node: any) => {
      return (
        (node.type === 'import' && !node.value?.includes('@/components/')) || node.type !== 'import'
      );
    });

    imports
      .trim()
      .split('\n')
      .forEach((importLine) => {
        addImportString(tree, importLine);
      });
  };
};

export default withImportsInjected;
