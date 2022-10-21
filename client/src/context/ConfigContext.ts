import { createContext } from 'react';

import { Config } from '@/types/config';

const ConfigContext = createContext({} as Config);
export default ConfigContext;
