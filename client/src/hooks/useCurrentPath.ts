import { useRouter } from 'next/router';
import { useContext } from 'react';

import { ConfigContext } from '@/context/ConfigContext';

export function useCurrentPath() {
  const router = useRouter();
  const { subdomain } = useContext(ConfigContext);

  // Remove subdomain folder server-side
  const basePathMiddlewareRemoves = '/_sites/' + subdomain;

  const toRemove = router.basePath + basePathMiddlewareRemoves;

  // Mimic the middleware's rewriting the route to prevent hydration errors
  // from the server not knowing the link is supposed to be active by comparing
  // the original path.
  if (!router.isReady && router.asPath.startsWith(toRemove)) {
    return router.asPath.substring(toRemove.length).split('#')[0];
  }

  return router.asPath.split('#')[0];
}
