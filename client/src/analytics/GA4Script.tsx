import Script from 'next/script';

import { GoogleAnalyticsConfigInterface } from './AbstractAnalyticsImplementation';

export default function GA4Script({ ga4 }: { ga4?: GoogleAnalyticsConfigInterface }) {
  if (!ga4?.measurementId || process.env.NODE_ENV !== 'production') {
    return null;
  }

  // There is no npm package for Google Analytics 4 so set up happens by placing this script.
  // We can send events using window.gtag.
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${ga4.measurementId}`}
      />
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ga4.measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
