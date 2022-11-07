import { Anchor } from '@/types/config';

export function getAnchorsToDisplay(
  allAnchors: Anchor[],
  selectedVersion: string,
  pathname: string,
  basePathForAnchors: string
) {
  return allAnchors
    .filter((anchor: Anchor) => {
      // Hide hidden anchors unless we are in the docs for that anchor
      if (!anchor.isDefaultHidden) {
        return true;
      }
      return pathname.startsWith(`/${basePathForAnchors}${anchor.url}`);
    })
    .filter((anchor: Anchor) => {
      // Hide anchors in other versions unless they are currently active
      if (anchor.version == null) {
        return true;
      }
      return (
        anchor.version === selectedVersion ||
        pathname.startsWith(`/${basePathForAnchors}${anchor.url}`)
      );
    });
}
