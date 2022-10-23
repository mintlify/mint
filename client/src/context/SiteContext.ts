import { createContext } from 'react';

import { Config } from '@/types/config';
import { Groups } from '@/types/metadata';

const SiteContext = createContext({} as { config?: Config; nav?: Groups; openApi?: any });
export default SiteContext;
