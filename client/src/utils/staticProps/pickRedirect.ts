import { Groups } from '@/types/metadata';

import { getFirstPage } from './getFirstPage';
import { getFirstPageStartingWith } from './getFirstPageStartingWith';

// Function assumes callsite validated input is a valid array
export function pickRedirect(
  navWithMetadata: Groups,
  path: string
): {
  redirect: { destination: string; permanent: boolean };
} | null {
  console.log(path);
  // Allow linking to a folder and redirecting to the first page in it.
  // Eg. The path "updates/changelog" can redirect to "updates/changelog/2022" but not "updates/changelog-page"
  const firstPageInSubdir = getFirstPageStartingWith(navWithMetadata, '/' + path + '/');
  if (firstPageInSubdir.href) {
    return { redirect: { destination: firstPageInSubdir.href, permanent: false } };
  }

  // Redirect to the home page
  const firstPage = getFirstPage(navWithMetadata);
  if (firstPage.href) {
    return { redirect: { destination: firstPage.href, permanent: true } };
  }

  // Could not find a redirect
  return null;
}
