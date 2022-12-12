import 'focus-visible';

import ErrorBoundary from '@/ui/ErrorBoundary';

import '../css/fonts.css';
import '../css/main.css';

export default function App(props: any) {
  const { Component, pageProps } = props;

  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
