import { Inter, Fira_Code } from '@next/font/google';
import 'focus-visible';

import ErrorBoundary from '@/ui/ErrorBoundary';

import '../css/main.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
});

export default function App(props: any) {
  const { Component, pageProps } = props;

  return (
    <ErrorBoundary>
      <main className={`${inter.variable} ${firaCode.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
    </ErrorBoundary>
  );
}
