import Script from 'next/script';
import { PlausibleInterface } from './AbstractAnalyticsImplementation';

export default function PlausibleScript({ plausible }: { plausible?: PlausibleInterface }) {
  if (!plausible?.domain || process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <Script strategy="afterInteractive" data-domain={plausible.domain} src="https://plausible.io/js/script.js" />
  );
}
