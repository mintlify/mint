import {
  solid,
  regular,
  light,
  thin,
  duotone,
  brands,
} from '@fortawesome/fontawesome-svg-core/import.macro';
import { CardGroup, Info, Warning, Note, Tip, Check } from '@mintlify/components';
import { Tabs, Tab } from '@mintlify/components';
import { Tooltip } from '@mintlify/components';

import { Accordion, AccordionGroup } from '@/components/Accordion';
import { RequestExample, ResponseExample } from '@/components/ApiExample';
import { Card } from '@/components/Card';
import { CodeGroup, SnippetGroup } from '@/components/CodeGroup';
import { Expandable } from '@/components/Expandable';
import { Heading } from '@/components/Heading';
import { Param, ParamField } from '@/components/Param';
import { RequestSimple } from '@/components/Request';
import { ResponseField } from '@/components/ResponseField';

const components: any = {
  Accordion,
  AccordionGroup,
  Heading,
  CodeGroup,
  SnippetGroup,
  RequestSimple,
  RequestExample,
  ResponseExample,
  Param,
  ParamField,
  Card,
  ResponseField,
  Expandable,
  CardGroup,
  Info,
  Warning,
  Note,
  Tip,
  Check,
  Tabs,
  Tab,
  Tooltip,
  solid,
  regular,
  light,
  thin,
  duotone,
  brands,
};

export default components;
