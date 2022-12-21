import { createContext } from 'react';

import { Config } from '@/types/config';
import { Groups } from '@/types/metadata';
import { OpenApiFile } from '@/types/openApi';

export const ConfigContext = createContext({
  // TODO - add default values for all context to improve error handling
  openApiFiles: [],
} as {
  mintConfig?: Config;
  navWithMetadata?: Groups;
  openApiFiles: OpenApiFile[];
  subdomain?: string;
});
