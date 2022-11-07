import { useRouter } from 'next/router';
import { useContext } from 'react';

import { ConfigContext } from '@/context/ConfigContext';

export function useCurrentPath() {
  const router = useRouter();
  const { subdomain } = useContext(ConfigContext);

  // Remove subdomain folder server-side
  const basePathMiddlewareRemoves = '/_sites/' + subdomain;

  // Mimic the middleware's rewriting the route to prevent hydration errors
  // from the server not knowing the link is supposed to be active by comparing
  // the original path.
  if (typeof window === 'undefined' && router.asPath.startsWith(basePathMiddlewareRemoves)) {
    return router.asPath.substring(basePathMiddlewareRemoves.length);
  }

  return router.asPath;
}
