import { createContext } from 'react';

import { Config } from '@/types/config';
import { Groups } from '@/types/metadata';

export const ConfigContext = createContext(
  {} as { mintConfig?: Config; navWithMetadata?: Groups; openApi?: any; subdomain?: string }
);
