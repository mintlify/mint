import { useContext } from 'react';

import { ConfigContext } from '@/context/ConfigContext';
import { cleanBasePath } from '@/utils/paths/cleanBasePath';

export function useBasePath() {
  const { config } = useContext(ConfigContext);
  return cleanBasePath(config?.basePath);
}
