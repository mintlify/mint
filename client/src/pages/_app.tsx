import { ResizeObserver } from '@juggle/resize-observer';
import 'focus-visible';
import 'intersection-observer';

import '@/utils/fontAwesome';

import '../css/fonts.css';
import '../css/main.css';

if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  window.ResizeObserver = ResizeObserver;
}
// TODO - figure out what to put in the App vs. [[...slug]].tsx
export default function App(props: any) {
  const { Component, pageProps } = props;

  return <Component {...pageProps} />;
}
