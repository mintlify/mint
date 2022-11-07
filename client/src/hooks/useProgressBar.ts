import ProgressBar from '@badrap/bar-of-progress';
import { Router } from 'next/router';
import { useEffect } from 'react';

/**
 * @param color Hexadecimal color including the # at the start. Defaults to green if left undefined.
 */
export default function useProgressBar(color: string | undefined) {
  // This was previously used to fix Safari jumping to the bottom of the page
  // when closing the search modal using the `esc` key.
  // We commented it out when migrating to Vercel Platforms because we wanted to see if
  // the issue would occur in production.
  // Delete this commented out code if testing on Safari does not have this issue anymore,
  // and thus we don't need to write down the fix.
  //   if (typeof window !== 'undefined') {
  //     progress.start();
  //     progress.finish();
  //   }

  useEffect(() => {
    const progress = new ProgressBar({
      size: 2,
      color: color ?? '#16A34A',
      className: 'bar-of-progress',
      delay: 100,
    });

    Router.events.on('routeChangeStart', () => progress.start());
    Router.events.on('routeChangeComplete', () => progress.finish());
    Router.events.on('routeChangeError', () => progress.finish());
  });
}
