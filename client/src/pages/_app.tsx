import { Inter } from '@next/font/google';
import 'focus-visible';

import ErrorBoundary from '@/ui/ErrorBoundary';

import '../css/fonts.css';
import '../css/main.css';

const inter = Inter({ subsets: ['latin'] });

export default function App(props: any) {
  const { Component, pageProps } = props;

  return (
    <ErrorBoundary>
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </ErrorBoundary>
  );
}
