import { useRouter } from 'next/router';
import { useContext } from 'react';

import { ConfigContext } from '@/context/ConfigContext';

export function useCurrentPath() {
  const { basePathMiddlewareRemoves } = useContext(ConfigContext);
  const router = useRouter();

  // Mimic the middleware's rewriting the route to prevent hydration errors
  // from the server not knowing the link is supposed to be active by comparing
  // the original path.
  const currentPath =
    basePathMiddlewareRemoves && router.asPath.startsWith(basePathMiddlewareRemoves)
      ? router.asPath.substring(basePathMiddlewareRemoves.length)
      : router.asPath;

  return currentPath;
}
