import { Anchor } from '@/types/config';

export function getCurrentAnchor(anchors: Anchor[], pathname: string) {
  return anchors.find((anchor) => {
    return pathname.startsWith(`/${anchor.url}`) || pathname.startsWith(anchor.url);
  });
}

export function getCurrentAnchorVersion(anchors: Anchor[], pathname: string) {
  return getCurrentAnchor(anchors, pathname)?.version;
}
